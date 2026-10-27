"""Check generated CVs for page limits, readable text, links and web/PDF parity."""
from pathlib import Path
import re
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

suffixes = {'general': 'General'}
assert set(DATA['profiles']) == set(suffixes), 'Expected one common CV'
assert DATA['default_profile'] == 'general', 'The main CV must be general'
assert not DATA['role'], 'The common CV must not have a role title'
assert 'ceb' in DATA['profiles']['general']['project_ids'], 'Main project selection must retain CEB'
for key, profile in DATA['profiles'].items():
    filename = f'Vishnutharan-Bavachelvan-CV-{suffixes[key]}.pdf'
    html_name = f'cv-{key}.html'
    pdf = ROOT / 'dist/assets' / filename
    reader = PdfReader(pdf)
    assert len(reader.pages) == 2, f'{filename}: expected two pages'
    text = '\n'.join(page.extract_text() for page in reader.pages)
    assert DATA['name'] in text and DATA['education']['expected_graduation'] in text
    assert profile.get('role', DATA['role']) in text
    normalized = ' '.join(text.split())
    assert all(title not in text for title in ['Software Engineering Intern', 'Full-Stack Developer Intern', 'Web Application Developer Intern', 'Mobile App Developer Intern'])
    assert not any(phrase in normalized.lower() for phrase in ['seeking a software', 'seeking a full-stack', 'seeking a web application', 'seeking a mobile app'])
    assert 'Applicant' not in text and 'Remote worldwide' not in text and 'On-site in Sri Lanka' not in text, f'{filename}: outdated header wording'
    assert ' '.join(profile.get('summary', DATA['summary']).split()) in normalized
    for label, value in profile.get('skills', DATA['skills']):
        assert ' '.join(value.split()) in normalized, f'{filename}: missing technical skills'
        assert 'Playwright' not in value and 'Vitest' not in value, f'{filename}: excluded testing tools still present'
        if label == 'Tools & testing':
            assert 'Linux' in value and 'GitHub Actions' in value, f'{filename}: requested tools missing'
    sections = ['PROFILE', 'EDUCATION', 'TECHNICAL SKILLS', 'TECHNICAL PROJECTS', 'OTHER DEVELOPMENTS', 'TEAM PROJECTS & LEADERSHIP', 'CERTIFICATIONS & WORKSHOPS', 'AWARDS & COMPETITIONS', 'REFERENCES']
    section_positions = [text.index(section) for section in sections]
    assert section_positions == sorted(section_positions), f'{filename}: incorrect reading order'
    assert '\ufffd' not in text, f'{filename}: broken characters'
    names = [PROJECTS[project_id]['name'] for project_id in profile['project_ids']]
    positions = [text.index(name) for name in names]
    assert positions == sorted(positions), f'{filename}: incorrect project order'
    for project_id in profile['project_ids']:
        if PROJECTS[project_id].get('dates'):
            assert PROJECTS[project_id]['dates'] in normalized, f'{filename}: missing project dates'
        for bullet in PROJECTS[project_id]['bullets']:
            assert ' '.join(bullet.split()) in ' '.join(text.split()), f'{filename}: missing project bullet'
    annotations = [annotation for page in reader.pages for annotation in page.get('/Annots', [])]
    urls = [str(annotation.get_object().get('/A', {}).get('/URI', '')) for annotation in annotations]
    assert DATA['github'] in urls and DATA['portfolio'] in urls and DATA['linkedin'] in urls
    assert all(PROJECTS[project_id]['url'] in urls for project_id in profile['project_ids'])
    covered_ids = set(profile['project_ids']) | set(DATA['team_project_ids'])
    others = [project for project in DATA['projects'] if project['id'] not in covered_ids]
    other_text = text.split('OTHER DEVELOPMENTS', 1)[1].split(DATA['name'], 1)[0].strip()
    assert ' '.join(other_text.split()) == ' | '.join(project['name'] for project in others), f'{filename}: other developments should contain only remaining project names'
    assert all(project['url'] in urls for project in others), f'{filename}: missing other project links'
    for reference in DATA.get('references', []):
        assert all(' '.join(reference[field].split()) in normalized for field in ['name', 'credentials', 'title', 'phone', 'email']), f'{filename}: missing reference details'
        assert 'mailto:' + reference['email'] in urls and 'tel:' + reference['phone'].replace(' ', '') in urls
    for certificate in CERTIFICATES:
        assert all(' '.join(certificate[field].split()) in normalized for field in ['title', 'issuer', 'kind']), f'{filename}: missing certificate content'
        description = DATA.get('certificate_descriptions', {}).get(certificate['id'], certificate['description'])
        assert ' '.join(description.split()) in normalized, f'{filename}: missing certificate description'
        assert DATA['portfolio'] + 'assets/certificates/' + certificate['file'] in urls, f'{filename}: missing certificate link'
    for item in DATA.get('leadership', []):
        assert item['title'] in text and item['institution'] in text
        if item.get('dates'):
            assert item['dates'] in text, f'{filename}: missing leadership dates'
    assert 'TEAM PROJECTS & LEADERSHIP' in reader.pages[1].extract_text(), f'{filename}: expected supplemental content on page 2'
    assert 'REFERENCES' not in reader.pages[0].extract_text(), f'{filename}: reference should be at the end'
    for project_id in DATA.get('team_project_ids', ['agri']):
        team = PROJECTS[project_id]
        assert team['name'] in text and team['url'] in urls, f'{filename}: missing group project attribution'
        assert all(' '.join(bullet.split()) in ' '.join(text.split()) for bullet in team['bullets'])
        if team.get('dates'):
            assert team['dates'] in text, f'{filename}: missing group project dates'
    assert 'GATEWAY-UniversityOfVavuniya' not in ' '.join(urls), f'{filename}: copied Gateway repository still linked'
    with pdfplumber.open(pdf) as document:
        if profile.get('heading_alignment') == 'center':
            first = document.pages[0]
            display_name = DATA['name'].upper() if DATA.get('uppercase_name') else DATA['name']
            for heading in filter(None, [display_name, profile.get('role', DATA['role'])]):
                matches = [match for match in first.search(heading, regex=False) if match['top'] < 130]
                assert len(matches) == 1 and abs((matches[0]['x0'] + matches[0]['x1']) / 2 - first.width / 2) < 1, f'{filename}: header should be centered'
            assert first.search('PROFILE', regex=False)[0]['x0'] < 55, f'{filename}: body should stay left aligned'
        for page in document.pages:
            assert all(char['x0'] >= 35 and char['x1'] <= page.width - 35 and char['top'] >= 30 and char['bottom'] <= page.height - 30 for char in page.chars), f'{filename}: text outside page margins'
            assert not page.images, f'{filename}: CV should contain selectable text rather than images'
            assert all(char['size'] >= 9.4 for char in page.chars), f'{filename}: unreadable small text'
            assert all(grayscale(char['non_stroking_color']) for char in page.chars), f'{filename}: colored text in monochrome CV'
            assert all(grayscale(line['stroking_color']) for line in page.lines), f'{filename}: colored decoration in monochrome CV'
    html = (ROOT / 'dist' / html_name).read_text(encoding='utf-8')
    page = Page(); page.feed(html)
    # HTML indentation should not change content validation.
    html = re.sub(r'>\s+<', '><', ' '.join(html.split()))
    assert [urlsplit(url).path for url in page.downloads] == [f'./assets/{filename}'], f'{html_name}: incorrect PDF download'
    selected_page = 'cv.html' if key == DATA['default_profile'] else html_name
    assert page.current == [] and page.versions == [], f'{html_name}: common CV should have no role navigation'
    assert 'cv-role' not in html, f'{html_name}: role heading should be absent'
    assert all(name in html for name in names)
    other_html = '<section class="cv-other-developments"><h2>Other developments</h2><p>' + ' · '.join(f'<a href="{escape(project["url"], quote=True)}">{escape(project["name"])}</a>' for project in others) + '</p></section>'
    assert other_html in html, f'{html_name}: other developments must contain only project names'
    assert all(escape(PROJECTS[project_id]['dates']) in html for project_id in profile['project_ids'] if PROJECTS[project_id].get('dates'))
    assert all(escape(item['dates']) in html for item in DATA.get('leadership', []) if item.get('dates'))
    assert all(escape(certificate['title']) in html and certificate['file'] in html for certificate in CERTIFICATES)
    assert all(escape(DATA.get('certificate_descriptions', {}).get(certificate['id'], certificate['description'])) in html for certificate in CERTIFICATES)
    assert all(reference['email'] in html and reference['name'] in html for reference in DATA.get('references', []))
    assert ('cv-heading-centered' in html) == (profile.get('heading_alignment') == 'center'), f'{html_name}: incorrect header alignment'
    assert f'<h1>{escape(DATA["name"].upper())}</h1>' in html, f'{html_name}: name should be fully capitalized'
    assert 'cv-sheet-refined' in html, f'{html_name}: missing professional layout'
    assert 'cv-focus' not in html and 'cv-availability' not in html and 'Applicant' not in html, f'{html_name}: heading should contain only role and contact details'
    assert 'GATEWAY-UniversityOfVavuniya' not in html, f'{html_name}: copied Gateway repository still linked'
    assert pdf.read_bytes() == (ROOT / 'output/pdf' / filename).read_bytes(), f'{filename}: stale published PDF'
    print(f'{key}: two readable monochrome pages, no role heading, all certificates, leadership and reference')

main_filename = 'Vishnutharan-Bavachelvan-CV.pdf'
general_filename = 'Vishnutharan-Bavachelvan-CV-General.pdf'
for directory in ['dist/assets', 'output/pdf']:
    common = (ROOT / directory / main_filename).read_bytes()
    assert common == (ROOT / directory / general_filename).read_bytes(), 'Main download must be the common CV'
    for suffix in ['SoftwareEngineering', 'FullStack', 'Web', 'Mobile', 'Frontend', 'Backend']:
        assert (ROOT / directory / f'Vishnutharan-Bavachelvan-CV-{suffix}.pdf').read_bytes() == common, 'Older downloads must serve the same common CV'
general_html = (ROOT / 'dist/cv-general.html').read_text(encoding='utf-8')
main_html = (ROOT / 'dist/cv.html').read_text(encoding='utf-8')
assert main_html == general_html.replace(f'./assets/{general_filename}', f'./assets/{main_filename}'), 'Main web CV must match the common version'
for legacy in ['software', 'fullstack', 'web', 'mobile', 'frontend', 'backend']:
    assert 'url=./cv.html' in (ROOT / 'dist' / f'cv-{legacy}.html').read_text(encoding='utf-8'), 'Older CV pages must reach the common version'
print('Main PDF/page and every previous CV link now lead to the same common CV.')
