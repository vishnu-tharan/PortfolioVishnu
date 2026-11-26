"""Publish the supplied CV PDF and build its matching web version.

Run: python tools/build_cv.py [--pdf path/to/new-cv.pdf]
The supplied PDF is preserved byte for byte. Update cv-data.json to match it.
"""
from pathlib import Path
from html import escape
import argparse
import json
import shutil
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / 'tools/cv-data.json').read_text(encoding='utf-8'))
CERTIFICATES = json.loads((ROOT / 'tools/certificate-data.json').read_text(encoding='utf-8'))
BASE = 'Vishnutharan-Bavachelvan-CV'
SOURCE = ROOT / 'tools/cv-source.pdf'


def link(url, label):
    return f'<a href="{escape(url, quote=True)}">{escape(label)}</a>'


def section(title, content):
    return f'<section><h2>{escape(title)}</h2>{content}</section>'


def reference_html(reference):
    contacts = []
    if reference.get('phone'):
        contacts.append(link('tel:' + reference['phone'].replace(' ', ''), reference['phone']))
    if reference.get('email'):
        contacts.append(link('mailto:' + reference['email'], reference['email']))
    details = ''.join('<p>' + escape(reference[field]) + '</p>' for field in ['title', 'institution', 'credentials'] if reference.get(field))
    return f'<article class="cv-reference"><h3>{escape(reference["name"])}</h3>{details}<p>{" · ".join(contacts)}</p></article>'


def build_html(pdf_name):
    contacts = [link('mailto:' + DATA['email'], DATA['email']), link('tel:' + DATA['phone'].replace(' ', ''), DATA['phone'])]
    if DATA.get('location'):
        contacts.append(escape(DATA['location']))
    contacts.extend([link(DATA['github'], 'GitHub'), link(DATA['linkedin'], 'LinkedIn'), link(DATA['portfolio'], 'Portfolio')])
    education = DATA['education']
    skills = ''.join(f'<div><dt>{escape(label)}</dt><dd>{escape(value)}</dd></div>' for label, value in DATA['skills'])
    events = escape(DATA['competitions_events'])
    for certificate_id in ['ieeextreme-18-2024', 'ieeextreme-17-2023', 'hackforce-2023', 'trailblazers-2024']:
        certificate = next(item for item in CERTIFICATES if item['id'] == certificate_id)
        events = events.replace('[Certificate]', '[' + link('./assets/certificates/' + certificate['file'], 'Certificate') + ']', 1)
    activities = '<p><strong>Competitive Hackathons &amp; Events:</strong> ' + events + '</p>'
    activities += '<p><strong>Leadership &amp; Volunteering:</strong> ' + escape(DATA['leadership_volunteering']) + '</p>'
    courses = ''
    for course in DATA['certifications']:
        courses += '<p><strong>' + escape(course['issuer']) + ':</strong> ' + escape(course['title'])
        if course.get('certificate'):
            courses += ' ' + link(course['certificate'], 'Certificate')
        courses += '</p>'
    body = section('Professional Profile', '<p>' + escape(DATA['summary']) + '</p>')
    body += section('Education', f'<h3>{escape(education["degree"])}</h3><p>{escape(education["institution"])}</p><p class="cv-stack">{escape(education["dates"])} (Expected {escape(education["expected_graduation"])})</p><p>{escape(education["detail"])}</p>')
    body += section('Technical Skills', '<dl class="cv-skills">' + skills + '</dl>')
    projects = []
    for project in DATA.get('projects', []):
        name = link(project['url'], project['name'])
        stack = escape(project['stack'])
        summary = escape(project['summary'])
        live_store = ''
        if project.get('live_url'):
            live_store = ' | ' + link(project['live_url'], project.get('live_label', 'Live store'))
        projects.append(f'<article class="cv-project"><h3>{name}</h3><p class="cv-stack">{stack}{live_store}</p><p>{summary}</p></article>')
    coursework = DATA.get('coursework', [])
    if coursework:
        details = ' · '.join(escape(item) for item in coursework)
        projects.append(f'<p><strong>Selected coursework:</strong> {details}</p>')
    additional_project = DATA.get('additional_project')
    if additional_project:
        projects.append(f'<p><strong>Other project:</strong> {escape(additional_project)}</p>')
    if projects:
        body += section('Projects', ''.join(projects))
    body += section('Competitions & Leadership', activities)
    body += section('Certifications & Workshops', courses)
    references = ''.join(reference_html(reference) for reference in DATA['references'])
    body += section('Academic References', f'<div class="cv-references">{references}</div>')
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Curriculum Vitae | {escape(DATA['name'])}</title><script src="./src/theme-init.js"></script><link rel="stylesheet" href="./theme.css"><link rel="stylesheet" href="./cv.css?v=cv-references"><link rel="stylesheet" href="./cv-theme.css"></head>
<body class="cv-page"><nav class="cv-toolbar" aria-label="CV navigation"><a href="./index.html">← Back to portfolio</a><div class="cv-toolbar-actions"><button class="cv-theme-toggle" type="button" data-theme-toggle aria-label="Switch theme">◐</button><a class="cv-button" href="./assets/{pdf_name}" download>Download CV <span>PDF ↓</span></a></div></nav><main class="cv-sheet cv-sheet-refined"><header class="cv-heading cv-heading-centered"><h1>{escape(DATA['name'].upper())}</h1><p class="cv-role">{escape(DATA['role'])}</p><div class="cv-contact">{' · '.join(contacts)}</div></header>{body}</main><script type="module" src="./src/preferences.js"></script></body></html>'''


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pdf', type=Path, help='New owner-supplied PDF')
    args = parser.parse_args()
    source = args.pdf or SOURCE
    if len(PdfReader(source).pages) not in (1, 2):
        raise ValueError('Expected a one- or two-page CV.')
    if args.pdf and source.resolve() != SOURCE.resolve():
        shutil.copyfile(source, SOURCE)
    for directory in [ROOT / 'dist/assets', ROOT / 'output/pdf']:
        directory.mkdir(parents=True, exist_ok=True)
        for suffix in ['', '-General', '-SoftwareEngineering', '-FullStack', '-Web', '-Mobile', '-Frontend', '-Backend']:
            shutil.copyfile(SOURCE, directory / (BASE + suffix + '.pdf'))
    for name, suffix in [('cv.html', ''), ('cv-general.html', '-General')]:
        (ROOT / 'dist' / name).write_text(build_html(BASE + suffix + '.pdf'), encoding='utf-8', newline='\n')
    print('Published the master PDF unchanged and rebuilt matching web CVs.')


if __name__ == '__main__':
    main()
