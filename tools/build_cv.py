"""Generate matching one-page PDFs and web CVs from cv-data.json.

Requires reportlab and pypdf. Run: python tools/build_cv.py
Author: vishnu-tharan
"""
from pathlib import Path
from html import escape
import json
import shutil

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, KeepTogether

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / 'tools/cv-data.json').read_text(encoding='utf-8'))
OUTPUT = ROOT / 'output/pdf'
OUTPUT.mkdir(parents=True, exist_ok=True)
ASSETS = ROOT / 'dist/assets'
ASSETS.mkdir(parents=True, exist_ok=True)
BASE = 'Vishnutharan-Bavachelvan-CV'
CATALOG = {project['id']: project for project in DATA['projects']}
PROFILES = DATA['profiles']
if len(CATALOG) != len(DATA['projects']) or set(PROFILES) != {'general', 'frontend', 'backend', 'mobile'}:
    raise ValueError('CV project IDs must be unique and all four profiles must exist.')

font_dir = Path('C:/Windows/Fonts')
if all((font_dir / name).exists() for name in ['calibri.ttf', 'calibrib.ttf']):
    pdfmetrics.registerFont(TTFont('CV', str(font_dir / 'calibri.ttf')))
    pdfmetrics.registerFont(TTFont('CV-Bold', str(font_dir / 'calibrib.ttf')))
    pdfmetrics.registerFontFamily('CV', normal='CV', bold='CV-Bold')
    regular, bold = 'CV', 'CV-Bold'
else:
    regular, bold = 'Helvetica', 'Helvetica-Bold'

ink = colors.HexColor('#20252b')
red = colors.HexColor('#b42e25')
styles = {
    'name': ParagraphStyle('name', fontName=bold, fontSize=26, leading=29, textColor=ink, spaceAfter=4),
    'role': ParagraphStyle('role', fontName=bold, fontSize=10.5, leading=14, textColor=red, spaceAfter=6),
    'contact': ParagraphStyle('contact', fontName=regular, fontSize=9.5, leading=12, textColor=ink),
    'section': ParagraphStyle('section', fontName=bold, fontSize=10.5, leading=13, textColor=red, spaceBefore=10, spaceAfter=4),
    'body': ParagraphStyle('body', fontName=regular, fontSize=10.2, leading=13.2, textColor=ink),
    'project': ParagraphStyle('project', fontName=bold, fontSize=10.5, leading=13.5, textColor=ink, spaceBefore=5),
    'stack': ParagraphStyle('stack', fontName=regular, fontSize=9.5, leading=12, textColor=colors.HexColor('#555d66'), spaceAfter=2),
    'bullet': ParagraphStyle('bullet', fontName=regular, fontSize=10.2, leading=13.2, textColor=ink, leftIndent=10, firstLineIndent=-8, spaceAfter=2),
}

def paragraph(text, style='body'):
    return Paragraph(text, styles[style])

def pdf_link(url, text):
    return f'<a href="{escape(url, quote=True)}" color="#b42e25">{escape(text)}</a>'

def html_link(url, text):
    return f'<a href="{escape(url, quote=True)}">{escape(text)}</a>'

def filenames(key):
    suffix = '' if key == 'general' else f'-{key.title()}'
    return BASE + suffix + '.pdf', 'cv.html' if key == 'general' else f'cv-{key}.html'

def education_text():
    education = DATA['education']
    dates = education['dates']
    if education.get('expected_graduation'):
        dates += f" | Expected graduation: {education['expected_graduation']}"
    return dates

def decorate(canvas, doc):
    canvas.setFillColor(red)
    canvas.rect(42, A4[1] - 24, 48, 3, fill=1, stroke=0)

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

def build(key, profile):
    filename, html_filename = filenames(key)
    role = profile.get('role', DATA['role'])
    summary = profile.get('summary', DATA['summary'])
    skills = profile.get('skills', DATA['skills'])
    selected = [CATALOG[project_id] for project_id in profile['project_ids']]
    if len(selected) != 3 or len(set(profile['project_ids'])) != 3:
        raise ValueError(f'{key}: select three distinct projects.')
    education = DATA['education']
    team = CATALOG['agri']
    story = [paragraph(escape(DATA['name']), 'name'), paragraph(escape(role), 'role')]
    story.append(paragraph(f'{pdf_link("mailto:" + DATA["email"], DATA["email"])} | {pdf_link("tel:" + DATA["phone"].replace(" ", ""), DATA["phone"])}', 'contact'))
    story.append(paragraph(f'{pdf_link(DATA["github"], "GitHub / vishnu-tharan")} | {pdf_link(DATA["portfolio"], "Portfolio")} | {pdf_link(DATA["linkedin"], "LinkedIn")} | {escape(DATA["availability"])}', 'contact'))
    story.extend([paragraph('PROFILE', 'section'), paragraph(escape(summary))])
    story.append(KeepTogether([paragraph('EDUCATION', 'section'), paragraph(f'<b>{escape(education["degree"])}</b>'), paragraph(f'{escape(education["institution"])} | {escape(education_text())}', 'stack'), paragraph(escape(education['detail']))]))
    story.append(paragraph('TECHNICAL SKILLS', 'section'))
    story.extend(paragraph(f'<b>{escape(label)}:</b> {escape(value)}') for label, value in skills)
    story.append(paragraph('SELECTED PROJECTS', 'section'))
    story.extend(pdf_project(project) for project in selected)
    story.append(KeepTogether([paragraph('TEAMWORK & LEADERSHIP', 'section'), paragraph(f'<b>{escape(team["name"])}</b> | {escape(team["category"])} | {pdf_link(team["url"], "Repository")}'), paragraph(escape(team['bullets'][0])), paragraph(escape(DATA['community']))]))
    story.extend([paragraph('CERTIFICATIONS', 'section'), paragraph(escape(DATA['certifications']))])
    output = OUTPUT / filename
    document = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=42, leftMargin=42, topMargin=38, bottomMargin=32,
                                 title=f'{DATA["name"]} - {profile["label"]} CV', author=DATA['name'], subject=role)
    document.build(story, onFirstPage=decorate, onLaterPages=decorate)
    if len(PdfReader(output).pages) != 1:
        raise ValueError(f'{filename} exceeds one page. Edit the content or spacing before publishing.')
    shutil.copyfile(output, ASSETS / filename)
    choices = []
    for other, value in PROFILES.items():
        current = ' aria-current="page"' if other == key else ''
        choices.append(f'<a href="./{filenames(other)[1]}"{current}>{escape(value["label"])}</a>')
    choices = ''.join(choices)
    skills_html = ''.join(f'<div><dt>{escape(label)}</dt><dd>{escape(value)}</dd></div>' for label, value in skills)
    html = f'''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="author" content="{escape(DATA['name'])}">
<meta name="description" content="{escape(summary, quote=True)}"><meta name="theme-color" content="#090909">
<title>{escape(profile['label'])} CV | {escape(DATA['name'])}</title>
<script src="./src/theme-init.js"></script><link rel="stylesheet" href="./theme.css"><link rel="stylesheet" href="./cv.css"><link rel="stylesheet" href="./cv-theme.css"><link rel="stylesheet" href="./effects.css">
</head><body class="cv-page">
<nav class="cv-toolbar" aria-label="CV navigation"><a href="./index.html">&#8592; Back to portfolio</a><div class="cv-toolbar-actions"><button class="cv-theme-toggle" type="button" data-theme-toggle aria-label="Switch theme" aria-pressed="false">◐</button><a class="cv-button" href="./assets/{filename}" download>Download CV <span>PDF &#8595;</span></a></div></nav>
<nav class="cv-versions" aria-label="CV versions">{choices}</nav>
<main class="cv-sheet">
<header class="cv-heading"><p class="cv-kicker">{escape(profile['label'])} / CURRICULUM VITAE</p><h1>{escape(DATA['name'])}</h1><p class="cv-role">{escape(role)}</p>
<div class="cv-contact">{html_link('mailto:' + DATA['email'], DATA['email'])} {html_link('tel:' + DATA['phone'].replace(' ', ''), DATA['phone'])} {html_link(DATA['github'], 'GitHub / vishnu-tharan')} {html_link(DATA['portfolio'], 'Portfolio')} {html_link(DATA['linkedin'], 'LinkedIn')}</div><p class="cv-availability">{escape(DATA['availability'])}</p></header>
<section><h2>Profile</h2><p>{escape(summary)}</p></section>
<section><h2>Education</h2><h3>{escape(education['degree'])}<span>{escape(education_text())}</span></h3><p>{escape(education['institution'])}</p><p>{escape(education['detail'])}</p></section>
<section><h2>Technical skills</h2><dl class="cv-skills">{skills_html}</dl></section>
<section><h2>Selected projects</h2>{''.join(html_project(project) for project in selected)}</section>
<section><h2>Teamwork &amp; leadership</h2><h3>{html_link(team['url'], team['name'])}<span>{escape(team['category'])}</span></h3><p>{escape(team['bullets'][0])}</p><p>{escape(DATA['community'])}</p></section>
<section><h2>Certifications</h2><p>{escape(DATA['certifications'])}</p></section>
</main><script type="module" src="./src/preferences.js"></script></body></html>
'''
    (ROOT / 'dist' / html_filename).write_text(html, encoding='utf-8')
    print(f'Created one-page {filename} and {html_filename}')

for key, profile in PROFILES.items():
    build(key, profile)
