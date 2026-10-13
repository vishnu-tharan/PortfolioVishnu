"""Check generated CVs for page limits, readable text, links and web/PDF parity."""
from pathlib import Path
from html.parser import HTMLParser
from html import escape
from urllib.parse import urlsplit
import json
import pdfplumber
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / 'tools/cv-data.json').read_text(encoding='utf-8'))
PROJECTS = {project['id']: project for project in DATA['projects']}
CERTIFICATES = json.loads((ROOT / 'tools/certificate-data.json').read_text(encoding='utf-8'))

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.downloads = []
        self.current = []
        self.versions = []
    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == 'a' and 'download' in attrs:
            self.downloads.append(attrs['href'])
        if tag == 'a' and attrs.get('aria-current') == 'page':
            self.current.append(attrs['href'])
        if tag == 'a' and attrs.get('href', '').startswith('./cv'):
            self.versions.append(attrs['href'])

def grayscale(color):
    if isinstance(color, (int, float)):
        return True
    return color is not None and len(color) == 3 and max(color) - min(color) < 0.001

for key, profile in DATA['profiles'].items():
    suffix = '' if key == 'general' else '-FullStack' if key == 'fullstack' else f'-{key.title()}'
    filename = f'Vishnutharan-Bavachelvan-CV{suffix}.pdf'
    html_name = 'cv.html' if key == 'general' else f'cv-{key}.html'
    pdf = ROOT / 'dist/assets' / filename
    reader = PdfReader(pdf)
    assert len(reader.pages) == 2, f'{filename}: expected two pages'
    text = '\n'.join(page.extract_text() for page in reader.pages)
    assert DATA['name'] in text and DATA['education']['expected_graduation'] in text
    assert profile.get('role', DATA['role']) in text
    normalized = ' '.join(text.split())
    assert ' '.join(profile.get('summary', DATA['summary']).split()) in normalized
    for label, value in profile.get('skills', DATA['skills']):
        assert ' '.join(value.split()) in normalized, f'{filename}: missing technical skills'
    sections = ['PROFILE', 'EDUCATION', 'TECHNICAL SKILLS', 'TECHNICAL PROJECTS', 'TEAM PROJECTS & LEADERSHIP', 'CERTIFICATIONS & WORKSHOPS', 'AWARDS & COMPETITIONS', 'REFERENCES']
    section_positions = [text.index(section) for section in sections]
    assert section_positions == sorted(section_positions), f'{filename}: incorrect reading order'
    assert '\ufffd' not in text, f'{filename}: broken characters'
    names = [PROJECTS[project_id]['name'] for project_id in profile['project_ids']]
    positions = [text.index(name) for name in names]
    assert positions == sorted(positions), f'{filename}: incorrect project order'
    for project_id in profile['project_ids']:
        for bullet in PROJECTS[project_id]['bullets']:
            assert ' '.join(bullet.split()) in ' '.join(text.split()), f'{filename}: missing project bullet'
    annotations = [annotation for page in reader.pages for annotation in page.get('/Annots', [])]
    urls = [str(annotation.get_object().get('/A', {}).get('/URI', '')) for annotation in annotations]
    assert DATA['github'] in urls and DATA['portfolio'] in urls and DATA['linkedin'] in urls
    assert all(PROJECTS[project_id]['url'] in urls for project_id in profile['project_ids'])
    for reference in DATA.get('references', []):
        assert all(' '.join(reference[field].split()) in normalized for field in ['name', 'credentials', 'title', 'phone', 'email']), f'{filename}: missing reference details'
        assert 'mailto:' + reference['email'] in urls and 'tel:' + reference['phone'].replace(' ', '') in urls
    for certificate in CERTIFICATES:
        assert all(' '.join(certificate[field].split()) in normalized for field in ['title', 'issuer', 'kind', 'description']), f'{filename}: missing certificate content'
        assert DATA['portfolio'] + 'assets/certificates/' + certificate['file'] in urls, f'{filename}: missing certificate link'
    for item in DATA.get('leadership', []):
        assert item['title'] in text and item['institution'] in text
    assert 'TEAM PROJECTS & LEADERSHIP' in reader.pages[1].extract_text(), f'{filename}: expected supplemental content on page 2'
    assert 'REFERENCES' not in reader.pages[0].extract_text(), f'{filename}: reference should be at the end'
    for project_id in DATA.get('team_project_ids', ['agri']):
        team = PROJECTS[project_id]
        assert team['name'] in text and team['url'] in urls, f'{filename}: missing group project attribution'
        assert all(' '.join(bullet.split()) in ' '.join(text.split()) for bullet in team['bullets'])
    assert 'GATEWAY-UniversityOfVavuniya' not in ' '.join(urls), f'{filename}: copied Gateway repository still linked'
    with pdfplumber.open(pdf) as document:
        if profile.get('heading_alignment') == 'center':
            first = document.pages[0]
            for heading in [DATA['name'], profile.get('role', DATA['role'])]:
                matches = [match for match in first.search(heading, regex=False) if match['top'] < 130]
                assert len(matches) == 1 and abs((matches[0]['x0'] + matches[0]['x1']) / 2 - first.width / 2) < 1, f'{filename}: header should be centered'
            assert first.search('PROFILE', regex=False)[0]['x0'] < 55, f'{filename}: body should stay left aligned'
            assert DATA['focus'] in normalized, f'{filename}: missing internship focus'
        for page in document.pages:
            assert all(char['x0'] >= 35 and char['x1'] <= page.width - 35 and char['top'] >= 30 and char['bottom'] <= page.height - 30 for char in page.chars), f'{filename}: text outside page margins'
            assert not page.images, f'{filename}: CV should contain selectable text rather than images'
            assert all(char['size'] >= 9.4 for char in page.chars), f'{filename}: unreadable small text'
            assert all(grayscale(char['non_stroking_color']) for char in page.chars), f'{filename}: colored text in monochrome CV'
            assert all(grayscale(line['stroking_color']) for line in page.lines), f'{filename}: colored decoration in monochrome CV'
    html = (ROOT / 'dist' / html_name).read_text(encoding='utf-8')
    page = Page(); page.feed(html)
    assert [urlsplit(url).path for url in page.downloads] == [f'./assets/{filename}'], f'{html_name}: incorrect PDF download'
    assert page.current == [f'./{html_name}'], f'{html_name}: incorrect selected version'
    expected_versions = ['./cv.html' if version == 'general' else f'./cv-{version}.html' for version in DATA['profiles']]
    assert page.versions == expected_versions, f'{html_name}: incomplete role navigation'
    assert all(name in html for name in names)
    assert all(escape(certificate['title']) in html and certificate['file'] in html for certificate in CERTIFICATES)
    assert all(reference['email'] in html and reference['name'] in html for reference in DATA.get('references', []))
    assert ('cv-heading-centered' in html) == (profile.get('heading_alignment') == 'center'), f'{html_name}: incorrect header alignment'
    assert 'GATEWAY-UniversityOfVavuniya' not in html, f'{html_name}: copied Gateway repository still linked'
    assert pdf.read_bytes() == (ROOT / 'output/pdf' / filename).read_bytes(), f'{filename}: stale published PDF'
    print(f'{key}: two readable monochrome pages, all certificates, leadership and final reference, matching role download')
