"""Check generated CVs for page limits, readable text, links and web/PDF parity."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json
import pdfplumber
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / 'tools/cv-data.json').read_text(encoding='utf-8'))
PROJECTS = {project['id']: project for project in DATA['projects']}

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.downloads = []
        self.current = []
    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == 'a' and 'download' in attrs:
            self.downloads.append(attrs['href'])
        if tag == 'a' and attrs.get('aria-current') == 'page':
            self.current.append(attrs['href'])

for key, profile in DATA['profiles'].items():
    suffix = '' if key == 'general' else f'-{key.title()}'
    filename = f'Vishnutharan-Bavachelvan-CV{suffix}.pdf'
    html_name = 'cv.html' if key == 'general' else f'cv-{key}.html'
    pdf = ROOT / 'dist/assets' / filename
    reader = PdfReader(pdf)
    assert len(reader.pages) == 1, f'{filename}: more than one page'
    text = reader.pages[0].extract_text()
    assert DATA['name'] in text and DATA['education']['expected_graduation'] in text
    assert profile.get('role', DATA['role']) in text
    assert '\ufffd' not in text, f'{filename}: broken characters'
    names = [PROJECTS[project_id]['name'] for project_id in profile['project_ids']]
    positions = [text.index(name) for name in names]
    assert positions == sorted(positions), f'{filename}: incorrect project order'
    for project_id in profile['project_ids']:
        for bullet in PROJECTS[project_id]['bullets']:
            assert ' '.join(bullet.split()) in ' '.join(text.split()), f'{filename}: missing project bullet'
    annotations = reader.pages[0].get('/Annots', [])
    urls = [str(annotation.get_object().get('/A', {}).get('/URI', '')) for annotation in annotations]
    assert DATA['github'] in urls and DATA['portfolio'] in urls and DATA['linkedin'] in urls
    assert all(PROJECTS[project_id]['url'] in urls for project_id in profile['project_ids'])
    with pdfplumber.open(pdf) as document:
        page = document.pages[0]
        assert all(char['x0'] >= 35 and char['x1'] <= page.width - 35 and char['top'] >= 30 and char['bottom'] <= page.height - 30 for char in page.chars), f'{filename}: text outside page margins'
    html = (ROOT / 'dist' / html_name).read_text(encoding='utf-8')
    page = Page(); page.feed(html)
    assert [urlsplit(url).path for url in page.downloads] == [f'./assets/{filename}'], f'{html_name}: incorrect PDF download'
    assert page.current == [f'./{html_name}'], f'{html_name}: incorrect selected version'
    assert all(name in html for name in names)
    assert pdf.read_bytes() == (ROOT / 'output/pdf' / filename).read_bytes(), f'{filename}: stale published PDF'
    print(f'{key}: one page, selectable text, working link annotations, correct project order and matching download')
