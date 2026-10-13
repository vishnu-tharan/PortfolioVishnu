"""Generate matching internship PDFs and web CVs with the existing CV layout.

Requires reportlab and pypdf. Run: python tools/build_cv.py
Author: vishnu-tharan
"""
from pathlib import Path
from html import escape
from datetime import date
import json
import shutil
import sys

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, KeepTogether, HRFlowable, PageBreak

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / 'tools/cv-data.json').read_text(encoding='utf-8'))
OUTPUT = ROOT / 'output/pdf'
OUTPUT.mkdir(parents=True, exist_ok=True)
ASSETS = ROOT / 'dist/assets'
ASSETS.mkdir(parents=True, exist_ok=True)
BASE = 'Vishnutharan-Bavachelvan-CV'
CATALOG = {project['id']: project for project in DATA['projects']}
PROFILES = DATA['profiles']
CERTIFICATES = json.loads((ROOT / 'tools/certificate-data.json').read_text(encoding='utf-8'))
if len(CATALOG) != len(DATA['projects']) or set(PROFILES) != {'general', 'fullstack', 'frontend', 'backend', 'mobile'}:
    raise ValueError('CV project IDs must be unique and all five internship profiles must exist.')

font_dir = Path('C:/Windows/Fonts')
if all((font_dir / name).exists() for name in ['calibri.ttf', 'calibrib.ttf']):
    pdfmetrics.registerFont(TTFont('CV', str(font_dir / 'calibri.ttf')))
    pdfmetrics.registerFont(TTFont('CV-Bold', str(font_dir / 'calibrib.ttf')))
    pdfmetrics.registerFontFamily('CV', normal='CV', bold='CV-Bold')
    regular, bold = 'CV', 'CV-Bold'
else:
    regular, bold = 'Helvetica', 'Helvetica-Bold'

ink = colors.HexColor('#111111')
muted = colors.HexColor('#555555')
styles = {
    'name': ParagraphStyle('name', fontName=bold, fontSize=27, leading=30, textColor=ink, spaceAfter=4),
    'role': ParagraphStyle('role', fontName=bold, fontSize=11, leading=14, textColor=ink, spaceAfter=6),
    'contact': ParagraphStyle('contact', fontName=regular, fontSize=9.5, leading=12, textColor=ink),
    'section': ParagraphStyle('section', fontName=bold, fontSize=10.5, leading=13, textColor=ink, spaceBefore=9, spaceAfter=4, keepWithNext=True),
    'body': ParagraphStyle('body', fontName=regular, fontSize=10.5, leading=13.4, textColor=ink),
    'project': ParagraphStyle('project', fontName=bold, fontSize=10.8, leading=13.5, textColor=ink, spaceBefore=5),
    'stack': ParagraphStyle('stack', fontName=regular, fontSize=9.5, leading=12, textColor=muted, spaceAfter=2),
    'bullet': ParagraphStyle('bullet', fontName=regular, fontSize=10.5, leading=13.4, textColor=ink, leftIndent=10, firstLineIndent=-8, spaceAfter=2),
}

def paragraph(text, style='body'):
    return Paragraph(text, styles[style])

def pdf_link(url, text):
    return f'<a href="{escape(url, quote=True)}" color="#111111"><u>{escape(text)}</u></a>'

def html_link(url, text):
    return f'<a href="{escape(url, quote=True)}">{escape(text)}</a>'

def filenames(key):
    suffix = '' if key == 'general' else '-FullStack' if key == 'fullstack' else f'-{key.title()}'
    return BASE + suffix + '.pdf', 'cv.html' if key == 'general' else f'cv-{key}.html'

def education_text():
    education = DATA['education']
    dates = education['dates']
    if education.get('expected_graduation'):
        dates += f" | Expected graduation: {education['expected_graduation']}"
    return dates

def pdf_project(project):
    links = pdf_link(project['url'], 'Repository')
    if project.get('evidence'):
        links += ' | ' + pdf_link(project['evidence'], 'Verification')
    title = f"{escape(project['name'])} <font name=\"{regular}\" size=\"9.5\">| {escape(project['category'])}</font>"
    block = [paragraph(title, 'project'), paragraph(f"{escape(project['stack'])} | {links}", 'stack')]
    if project.get('dates'):
        block.append(paragraph(escape(project['dates']), 'stack'))
    block.extend(paragraph('- ' + escape(bullet), 'bullet') for bullet in project['bullets'])
    return KeepTogether(block)

def html_project(project):
    links = html_link(project['url'], 'Repository')
    if project.get('evidence'):
        links += ' · ' + html_link(project['evidence'], 'Verification')
    dates = f'<p class="cv-stack">{escape(project["dates"])}</p>' if project.get('dates') else ''
    return f'''<article class="cv-project"><h3>{html_link(project['url'], project['name'])}<span>{escape(project['category'])}</span></h3>
<p class="cv-stack">{escape(project['stack'])}</p>{dates}<ul>{''.join(f'<li>{escape(bullet)}</li>' for bullet in project['bullets'])}</ul><p class="cv-evidence">{links}</p></article>'''

def certificate_date(certificate):
    when = date.fromisoformat(certificate['date'])
    return f'{when.day} {when:%B %Y}'

def pdf_certificate(certificate):
    url = DATA['portfolio'] + 'assets/certificates/' + certificate['file']
    return KeepTogether([
        paragraph(f'<b>{escape(certificate["title"])}</b> | {escape(certificate["kind"])}', 'project'),
        paragraph(f'{escape(certificate["issuer"])} | {certificate_date(certificate)} | {pdf_link(url, "Certificate")}', 'stack'),
        paragraph(escape(certificate['description'])),
    ])

def html_certificate(certificate):
    url = './assets/certificates/' + certificate['file']
    return f'<article class="cv-certificate"><h3>{escape(certificate["title"])}<span>{escape(certificate["kind"])}</span></h3><p class="cv-stack">{escape(certificate["issuer"])} | {certificate_date(certificate)} | {html_link(url, "Certificate")}</p><p>{escape(certificate["description"])}</p></article>'

def page_footer(canvas, document):
    canvas.saveState()
    canvas.setFont(regular, 9.5)
    canvas.setFillColor(muted)
    canvas.drawString(42, 35, DATA['name'])
    canvas.drawRightString(A4[0] - 42, 35, f'{document.page} / 2')
    canvas.restoreState()

def build(key, profile):
    filename, html_filename = filenames(key)
    role = profile.get('role', DATA['role'])
    summary = profile.get('summary', DATA['summary'])
    skills = profile.get('skills', DATA['skills'])
    selected = [CATALOG[project_id] for project_id in profile['project_ids']]
    if len(selected) != 3 or len(set(profile['project_ids'])) != 3:
        raise ValueError(f'{key}: select three distinct projects.')
    education = DATA['education']
    teams = [CATALOG[project_id] for project_id in DATA.get('team_project_ids', ['agri'])]
    story = [paragraph(escape(DATA['name']), 'name'), paragraph(escape(role), 'role')]
    story.append(paragraph(f'{pdf_link("mailto:" + DATA["email"], DATA["email"])} | {pdf_link("tel:" + DATA["phone"].replace(" ", ""), DATA["phone"])} | {escape(DATA["availability"])}', 'contact'))
    story.append(paragraph(f'{pdf_link(DATA["github"], "github.com/vishnu-tharan")} | {pdf_link(DATA["portfolio"], "vishnu-tharan.github.io/PortfolioVishnu")} | {pdf_link(DATA["linkedin"], "LinkedIn")}', 'contact'))
    story.append(HRFlowable(width='100%', thickness=0.7, color=ink, spaceBefore=8, spaceAfter=0))
    story.extend([paragraph('PROFILE', 'section'), paragraph(escape(summary))])
    story.append(KeepTogether([paragraph('EDUCATION', 'section'), paragraph(f'<b>{escape(education["degree"])}</b>'), paragraph(f'{escape(education["institution"])} | {escape(education_text())}', 'stack'), paragraph(escape(education['detail']))]))
    story.append(paragraph('TECHNICAL SKILLS', 'section'))
    story.extend(paragraph(f'<b>{escape(label)}:</b> {escape(value)}') for label, value in skills)
    story.append(paragraph('TECHNICAL PROJECTS', 'section'))
    story.extend(pdf_project(project) for project in selected)
    story.append(PageBreak())
    teamwork = [paragraph('TEAM PROJECTS & LEADERSHIP', 'section')]
    for team in teams:
        teamwork.append(paragraph(f'<b>{escape(team["name"])}</b> | {escape(team["category"])} | {pdf_link(team["url"], "Repository")}'))
        teamwork.extend(paragraph(escape(bullet)) for bullet in team['bullets'])
    teamwork.append(paragraph(escape(DATA['community'])))
    teamwork.extend(paragraph(f'<b>{escape(item["title"])}</b> | {escape(item["institution"])}') for item in DATA.get('leadership', []))
    teamwork.extend(pdf_certificate(certificate) for certificate in CERTIFICATES if certificate['kind'] == 'Development event')
    story.append(KeepTogether(teamwork))
    story.extend([paragraph('CERTIFICATIONS & WORKSHOPS', 'section'), paragraph(escape(DATA['certifications']))])
    story.extend(pdf_certificate(certificate) for certificate in CERTIFICATES if certificate['kind'] in ['Course', 'Workshop'])
    story.append(paragraph('AWARDS & COMPETITIONS', 'section'))
    story.extend(pdf_certificate(certificate) for certificate in CERTIFICATES if certificate['kind'] in ['Competition participation', 'Merit award'])
    references = DATA.get('references', [])
    if references:
        reference_block = [paragraph('REFERENCES', 'section')]
        for reference in references:
            reference_block.extend([
                paragraph(f'<b>{escape(reference["name"])}</b> | {escape(reference["title"])}'),
                paragraph(escape(reference['credentials']), 'stack'),
                paragraph(f'{pdf_link("tel:" + reference["phone"].replace(" ", ""), reference["phone"])} | {pdf_link("mailto:" + reference["email"], reference["email"])}', 'stack'),
            ])
        story.append(KeepTogether(reference_block))
    output = OUTPUT / filename
    document = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=42, leftMargin=42, topMargin=38, bottomMargin=54,
                                 title=f'{DATA["name"]} - {profile["label"]} CV', author=DATA['name'], subject=role)
    document.build(story, onFirstPage=page_footer, onLaterPages=page_footer)
    if len(PdfReader(output).pages) != 2:
        raise ValueError(f'{filename} must have two readable pages. Check content and spacing before publishing.')
    shutil.copyfile(output, ASSETS / filename)
    choices = []
    for other, value in PROFILES.items():
        current = ' aria-current="page"' if other == key else ''
        choices.append(f'<a href="./{filenames(other)[1]}"{current}>{escape(value["label"])}</a>')
    choices = ''.join(choices)
    skills_html = ''.join(f'<div><dt>{escape(label)}</dt><dd>{escape(value)}</dd></div>' for label, value in skills)
    team_html = ''.join(f'<article class="cv-team-project"><h3>{html_link(team["url"], team["name"])}<span>{escape(team["category"])}</span></h3>' + ''.join(f'<p>{escape(bullet)}</p>' for bullet in team['bullets']) + '</article>' for team in teams)
    leadership_html = ''.join(f'<p><strong>{escape(item["title"])}</strong> | {escape(item["institution"])}</p>' for item in DATA.get('leadership', []))
    development_html = ''.join(html_certificate(certificate) for certificate in CERTIFICATES if certificate['kind'] == 'Development event')
    courses_html = ''.join(html_certificate(certificate) for certificate in CERTIFICATES if certificate['kind'] in ['Course', 'Workshop'])
    awards_html = ''.join(html_certificate(certificate) for certificate in CERTIFICATES if certificate['kind'] in ['Competition participation', 'Merit award'])
    references_html = '<section><h2>References</h2>' + ''.join(f'<article class="cv-reference"><h3>{escape(reference["name"])}<span>{escape(reference["title"])}</span></h3><p class="cv-stack">{escape(reference["credentials"])}</p><p class="cv-reference-contact">{html_link("tel:" + reference["phone"].replace(" ", ""), reference["phone"])} | {html_link("mailto:" + reference["email"], reference["email"])}</p></article>' for reference in references) + '</section>' if references else ''
    html = f'''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="author" content="{escape(DATA['name'])}">
<meta name="description" content="{escape(summary, quote=True)}"><meta name="theme-color" content="#ffffff">
<title>{escape(profile['label'])} CV | {escape(DATA['name'])}</title>
<script src="./src/theme-init.js"></script><link rel="stylesheet" href="./theme.css"><link rel="stylesheet" href="./cv.css"><link rel="stylesheet" href="./cv-theme.css">
</head><body class="cv-page">
<nav class="cv-toolbar" aria-label="CV navigation"><a href="./index.html">&#8592; Back to portfolio</a><div class="cv-toolbar-actions"><button class="cv-theme-toggle" type="button" data-theme-toggle aria-label="Switch theme" aria-pressed="false">◐</button><a class="cv-button" href="./assets/{filename}" download>Download CV <span>PDF &#8595;</span></a></div></nav>
<nav class="cv-versions" aria-label="CV versions">{choices}</nav>
<main class="cv-sheet">
<header class="cv-heading"><h1>{escape(DATA['name'])}</h1><p class="cv-role">{escape(role)}</p>
<div class="cv-contact">{html_link('mailto:' + DATA['email'], DATA['email'])} {html_link('tel:' + DATA['phone'].replace(' ', ''), DATA['phone'])} {html_link(DATA['github'], 'GitHub / vishnu-tharan')} {html_link(DATA['portfolio'], 'Portfolio')} {html_link(DATA['linkedin'], 'LinkedIn')}</div><p class="cv-availability">{escape(DATA['availability'])}</p></header>
<section><h2>Profile</h2><p>{escape(summary)}</p></section>
<section><h2>Education</h2><h3>{escape(education['degree'])}<span>{escape(education_text())}</span></h3><p>{escape(education['institution'])}</p><p>{escape(education['detail'])}</p></section>
<section><h2>Technical skills</h2><dl class="cv-skills">{skills_html}</dl></section>
<section><h2>Technical projects</h2>{''.join(html_project(project) for project in selected)}</section>
<section class="cv-page-two"><h2>Team projects &amp; leadership</h2>{team_html}<p>{escape(DATA['community'])}</p>{leadership_html}{development_html}</section>
<section><h2>Certifications &amp; workshops</h2><p>{escape(DATA['certifications'])}</p>{courses_html}</section>
<section><h2>Awards &amp; competitions</h2>{awards_html}</section>
{references_html}
</main><script type="module" src="./src/preferences.js"></script></body></html>
'''
    (ROOT / 'dist' / html_filename).write_text(html, encoding='utf-8')
    print(f'Created two-page {filename} and {html_filename}')

requested = sys.argv[1:] or list(PROFILES)
if len(set(requested)) != len(requested) or any(key not in PROFILES for key in requested):
    raise SystemExit('Choose distinct profiles: general fullstack frontend backend mobile')
for key in requested:
    build(key, PROFILES[key])
