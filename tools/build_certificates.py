"""Build the portfolio certificate gallery and search catalog from verified metadata."""
from pathlib import Path
from html import escape
from datetime import date
import json
import re

ROOT = Path(__file__).resolve().parent.parent
certificates = json.loads((ROOT / 'tools/certificate-data.json').read_text(encoding='utf-8'))
assets = ROOT / 'dist/assets/certificates'
cards = []
for certificate in certificates:
    when = date.fromisoformat(certificate['date'])
    label = f'{when.day} {when:%B %Y}'
    for field in ['file', 'preview']:
        filename = certificate[field]
        if not re.fullmatch(r'[a-z0-9-]+\.(pdf|jpg|png)', filename) or not (assets / filename).is_file():
            raise ValueError(f'Missing or invalid certificate {field}: {filename}')
    title = escape(certificate['title'])
    file = './assets/certificates/' + certificate['file']
    preview = './assets/certificates/' + certificate['preview']
    format = 'PDF' if certificate['file'].endswith('.pdf') else 'Image'
    cards.append(f'''<article class="certificate-card" id="certificate-{certificate['id']}">
<a class="certificate-preview" href="{file}" target="_blank" rel="noopener noreferrer" aria-label="View {title} certificate"><img src="{preview}" alt="{title} certificate awarded to Vishnutharan Bavachelvan" width="1200" height="900" loading="lazy" decoding="async"></a>
<div class="certificate-body"><div class="certificate-meta"><span>{escape(certificate['kind'])}</span><time datetime="{certificate['date']}">{label}</time></div><h4>{title}</h4><p class="certificate-issuer">{escape(certificate['issuer'])}</p><p>{escape(certificate['description'])}</p><div class="certificate-links"><a href="{file}" target="_blank" rel="noopener noreferrer">View certificate <span aria-hidden="true">↗</span></a><a href="{file}" download aria-label="Download {title} certificate">Download {format} <span aria-hidden="true">↓</span></a></div></div></article>''')
gallery = '''<div class="certificate-showcase" id="certificates" aria-labelledby="certificates-title">
<div class="certificate-heading"><div><span class="eyebrow accent">CERTIFICATES &amp; RECOGNITION</span><h3 id="certificates-title">Learning, with evidence.</h3></div><p>Courses, competitions, workshops and recognition. Each entry links to the certificate and states what it records.</p></div>
<div class="certificate-grid">''' + '\n'.join(cards) + '</div></div>'
page = ROOT / 'dist/index.html'
html = page.read_text(encoding='utf-8')
start = '<!-- CERTIFICATE GALLERY START -->'
end = '<!-- CERTIFICATE GALLERY END -->'
if html.count(start) != 1 or html.count(end) != 1:
    raise ValueError('Add one pair of certificate gallery markers to index.html.')
html = html.split(start)[0] + start + '\n' + gallery + '\n' + end + html.split(end)[1]
page.write_text(html, encoding='utf-8')
catalog = '// Verified against certificates supplied by the portfolio owner.\nexport const certificates = ' + json.dumps(certificates, ensure_ascii=False, indent=2) + ';\n'
(ROOT / 'dist/src/certificate-data.js').write_text(catalog, encoding='utf-8')
print(f'Built {len(certificates)} certificate cards and search entries.')
