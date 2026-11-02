"""Check generated CVs for page limits, readable text, links and web/PDF parity."""
from pathlib import Path
import re
import unicodedata
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

suffixes = {'general': 'General'}
assert set(DATA['profiles']) == set(suffixes), 'Expected one common CV'
assert DATA['default_profile'] == 'general', 'The main CV must be general'
assert 'ceb' in DATA['profiles']['general']['project_ids'], 'Main project selection must retain CEB'

for key, profile in DATA['profiles'].items():
    filename = f'Vishnutharan-Bavachelvan-CV-{suffixes[key]}.pdf'
    html_name = f'cv-{key}.html'
    pdf = ROOT / 'dist/assets' / filename
    reader = PdfReader(pdf)
    assert len(reader.pages) == 2, f'{filename}: expected two pages'
    raw_text = '\n'.join(page.extract_text() for page in reader.pages)
    text = unicodedata.normalize('NFKD', raw_text)
    assert DATA['name'].upper() in text.upper(), f'{filename}: missing name'
    assert DATA['education']['expected_graduation'] in text, f'{filename}: missing graduation date'
    assert profile.get('role', DATA['role']) in text, f'{filename}: missing role title'
    normalized = ' '.join(text.split())

    # Outdated / speculative phrasing checks
    assert all(title not in text for title in ['Software Engineering Intern', 'Full-Stack Developer Intern', 'Web Application Developer Intern', 'Mobile App Developer Intern'])
    assert not any(phrase in normalized.lower() for phrase in ['seeking a software', 'seeking a full-stack', 'seeking a web application', 'seeking a mobile app'])
    assert 'Applicant' not in text and 'Remote worldwide' not in text, f'{filename}: outdated header wording'
    assert ' '.join(profile.get('summary', DATA['summary']).split()) in normalized, f'{filename}: summary mismatch'

    # Technical skills
    for label, value in profile.get('skills', DATA['skills']):
        assert label in text, f'{filename}: missing skill category {label}'
        for item in [s.strip() for s in value.split(',')]:
            assert item in text or item in normalized, f'{filename}: missing skill {item}'

    # Section ordering
    sections = [
        'PROFESSIONAL PROFILE',
        'EDUCATION',
        'TECHNICAL SKILLS',
        'TECHNICAL PROJECTS',
        'TEAM PROJECTS, COMPETITIONS & LEADERSHIP',
        'CERTIFICATIONS & WORKSHOPS',
        'ACADEMIC REFERENCES'
    ]
    section_positions = [text.index(section) for section in sections]
    assert section_positions == sorted(section_positions), f'{filename}: incorrect reading order'
    assert '\ufffd' not in text, f'{filename}: broken characters'

    # Project ordering and bullets
    names = [PROJECTS[project_id]['name'] for project_id in profile['project_ids']]
    positions = [text.index(name) for name in names]
    assert positions == sorted(positions), f'{filename}: incorrect project order'
    for project_id in profile['project_ids']:
        if PROJECTS[project_id].get('dates'):
            assert PROJECTS[project_id]['dates'] in normalized, f'{filename}: missing project dates'
        for bullet in PROJECTS[project_id]['bullets']:
            assert ' '.join(bullet.split()) in normalized, f'{filename}: missing project bullet'

    # Annotation URLs
    annotations = [annotation for page in reader.pages for annotation in page.get('/Annots', [])]
    urls = [str(annotation.get_object().get('/A', {}).get('/URI', '')) for annotation in annotations]
    assert DATA['github'] in urls and DATA['portfolio'] in urls and DATA['linkedin'] in urls
    assert all(PROJECTS[project_id]['url'] in urls for project_id in profile['project_ids'])

    # Team projects
    for project_id in DATA.get('team_project_ids', []):
        team = PROJECTS[project_id]
        assert team['name'] in text and team['url'] in urls, f'{filename}: missing team project {team["name"]}'

    # Academic references
    for reference in DATA.get('references', []):
        assert reference['name'] in text, f'{filename}: missing reference {reference["name"]}'
        assert 'mailto:' + reference['email'] in urls, f'{filename}: missing email for {reference["name"]}'

    # Page styling checks via pdfplumber
    with pdfplumber.open(pdf) as document:
        for page in document.pages:
            assert all(char['size'] >= 7.0 for char in page.chars), f'{filename}: unreadable small text'

    # Web HTML validation
    html = (ROOT / 'dist' / html_name).read_text(encoding='utf-8')
    page = Page()
    page.feed(html)
    assert [urlsplit(url).path for url in page.downloads] == [f'./assets/{filename}'], f'{html_name}: incorrect PDF download'
    assert DATA['name'].upper() in html, f'{html_name}: name missing'
    assert DATA['role'] in html, f'{html_name}: role title missing'
    assert all(PROJECTS[project_id]['name'] in html for project_id in profile['project_ids'])
    assert all(reference['name'] in html for reference in DATA.get('references', []))
    assert pdf.read_bytes() == (ROOT / 'output/pdf' / filename).read_bytes(), f'{filename}: stale published PDF'
    print(f'{key}: two readable pages, role title, skills, projects and academic references verified')

main_filename = 'Vishnutharan-Bavachelvan-CV.pdf'
general_filename = 'Vishnutharan-Bavachelvan-CV-General.pdf'
for directory in ['dist/assets', 'output/pdf']:
    common = (ROOT / directory / main_filename).read_bytes()
    assert common == (ROOT / directory / general_filename).read_bytes(), 'Main download must match general CV'
    for suffix in ['SoftwareEngineering', 'FullStack', 'Web', 'Mobile', 'Frontend', 'Backend']:
        assert (ROOT / directory / f'Vishnutharan-Bavachelvan-CV-{suffix}.pdf').read_bytes() == common, 'Older downloads must serve the same common CV'

general_html = (ROOT / 'dist/cv-general.html').read_text(encoding='utf-8')
main_html = (ROOT / 'dist/cv.html').read_text(encoding='utf-8')
assert main_html == general_html.replace(f'./assets/{general_filename}', f'./assets/{main_filename}'), 'Main web CV must match the common version'

for legacy in ['software', 'fullstack', 'web', 'mobile', 'frontend', 'backend']:
    assert 'url=./cv.html' in (ROOT / 'dist' / f'cv-{legacy}.html').read_text(encoding='utf-8'), 'Older CV pages must reach the common version'

print('Main PDF/page and every previous CV link now lead to the same updated CV.')
