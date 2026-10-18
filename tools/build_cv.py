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
from reportlab.platypus import SimpleDocTemplate, Paragraph, KeepTogether, HRFlowable, PageBreak, Flowable

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / 'tools/cv-data.json').read_text(encoding='utf-8'))
OUTPUT = ROOT / 'output/pdf'
OUTPUT.mkdir(parents=True, exist_ok=True)
ASSETS = ROOT / 'dist/assets'
ASSETS.mkdir(parents=True, exist_ok=True)
BASE = 'Vishnutharan-Bavachelvan-CV'
CATALOG = {project['id']: project for project in DATA['projects']}
PROFILES = DATA['profiles']
DEFAULT_PROFILE = DATA['default_profile']
FILE_SUFFIXES = {'software': 'SoftwareEngineering', 'fullstack': 'FullStack', 'web': 'Web', 'mobile': 'Mobile'}
CERTIFICATES = json.loads((ROOT / 'tools/certificate-data.json').read_text(encoding='utf-8'))
if len(CATALOG) != len(DATA['projects']) or set(PROFILES) != set(FILE_SUFFIXES) or DEFAULT_PROFILE not in PROFILES:
    raise ValueError('CV project IDs must be unique; software, fullstack, web and mobile profiles must exist with a valid default.')

font_dir = Path('C:/Windows/Fonts')
if all((font_dir / name).exists() for name in ['calibri.ttf', 'calibrib.ttf']):
    pdfmetrics.registerFont(TTFont('CV', str(font_dir / 'calibri.ttf')))
    pdfmetrics.registerFont(TTFont('CV-Bold', str(font_dir / 'calibrib.ttf')))
    pdfmetrics.registerFontFamily('CV', normal='CV', bold='CV-Bold')
    regular, bold = 'CV', 'CV-Bold'
else:
    regular, bold = 'Helvetica', 'Helvetica-Bold'
heading_font = bold
if (font_dir / 'arialbd.ttf').exists():
    pdfmetrics.registerFont(TTFont('CV-Heading', str(font_dir / 'arialbd.ttf')))
    heading_font = 'CV-Heading'

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

def paragraph(text, style='body', style_set=styles):
    return Paragraph(text, style_set[style])

def pdf_link(url, text):
    return f'<a href="{escape(url, quote=True)}" color="#111111"><u>{escape(text)}</u></a>'

def html_link(url, text):
    return f'<a href="{escape(url, quote=True)}">{escape(text)}</a>'

def filenames(key):
    return BASE + '-' + FILE_SUFFIXES[key] + '.pdf', f'cv-{key}.html'

def navigation_page(key):
    return 'cv.html' if key == DEFAULT_PROFILE else filenames(key)[1]

def education_text():
    education = DATA['education']
    dates = education['dates']
    if education.get('expected_graduation'):
        dates += f" | Expected graduation: {education['expected_graduation']}"
    return dates

def pdf_project(project, style_set=styles):
    links = pdf_link(project['url'], 'Repository')
    if project.get('evidence'):
        links += ' | ' + pdf_link(project['evidence'], 'Verification')
    dates = f" | {escape(project['dates'])}" if project.get('dates') else ''
    title = f"{escape(project['name'])} <font name=\"{regular}\" size=\"9.5\">| {escape(project['category'])}{dates}</font>"
    block = [paragraph(title, 'project', style_set), paragraph(f"{escape(project['stack'])} | {links}", 'stack', style_set)]
    block.extend(paragraph('- ' + escape(bullet), 'bullet', style_set) for bullet in project['bullets'])
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

def certificate_description(certificate):
    return DATA.get('certificate_descriptions', {}).get(certificate['id'], certificate['description'])

def pdf_certificate(certificate, style_set=styles):
    url = DATA['portfolio'] + 'assets/certificates/' + certificate['file']
    return KeepTogether([
        paragraph(f'<b>{escape(certificate["title"])}</b> | {escape(certificate["kind"])}', 'project', style_set),
        paragraph(f'{escape(certificate["issuer"])} | {certificate_date(certificate)} | {pdf_link(url, "Certificate")}', 'stack', style_set),
        paragraph(escape(certificate_description(certificate)), 'body', style_set),
    ])

def html_certificate(certificate):
    url = './assets/certificates/' + certificate['file']
    return f'<article class="cv-certificate"><h3>{escape(certificate["title"])}<span>{escape(certificate["kind"])}</span></h3><p class="cv-stack">{escape(certificate["issuer"])} | {certificate_date(certificate)} | {html_link(url, "Certificate")}</p><p>{escape(certificate_description(certificate))}</p></article>'

def page_footer(canvas, document):
    canvas.saveState()
    canvas.setFont(regular, 9.5)
    canvas.setFillColor(muted)
    canvas.drawString(42, 35, DATA['name'])
    canvas.drawRightString(A4[0] - 42, 35, f'{document.page} / 2')
    canvas.restoreState()

class SectionHeading(Flowable):
    """Keep a section's rule and title together with the following content."""
    def __init__(self, heading):
        super().__init__()
        self.heading = heading
        self.keepWithNext = True
        self.spaceAfter = 5
    def wrap(self, available_width, available_height):
        self.width = available_width
        _, self.heading_height = self.heading.wrap(available_width, available_height)
        self.height = self.heading_height + 14
        return self.width, self.height
    def draw(self):
        self.canv.saveState()
        self.canv.setStrokeColor(muted)
        self.canv.setLineWidth(0.5)
        self.canv.line(0, 2, self.width, 2)
        self.canv.restoreState()
        self.heading.drawOn(self.canv, 0, 7)

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
    covered_ids = {project['id'] for project in selected + teams}
    others = [project for project in DATA['projects'] if project['id'] not in covered_ids]
    centered = profile.get('heading_alignment', 'left') == 'center'
    refined = profile.get('refined_layout', False)
    document_styles = {name: ParagraphStyle(f'{key}-{name}', parent=style) for name, style in styles.items()}
    if refined:
        document_styles['name'].fontName = heading_font
        document_styles['name'].fontSize = 22
        document_styles['name'].leading = 28
        document_styles['section'].fontSize = 11
        document_styles['section'].spaceBefore = 0
        document_styles['section'].spaceAfter = 5
        document_styles['body'].leading = 13.8
        document_styles['body'].spaceAfter = 1
        document_styles['bullet'].leading = 13.8
        document_styles['project'].spaceBefore = 7
    def paragraph(text, style='body'):
        return Paragraph(text, document_styles[style])
    def section(title):
        heading = paragraph(title, 'section')
        return SectionHeading(heading) if refined else heading
    display_name = DATA['name'].upper() if DATA.get('uppercase_name') else DATA['name']
    def header(text, style):
        return Paragraph(text, ParagraphStyle(f'{key}-header-{style}', parent=document_styles[style], alignment=1 if centered else 0))
    story = []
    story.extend([header(escape(display_name), 'name'), header(escape(role), 'role')])
    contact = f'{pdf_link("mailto:" + DATA["email"], DATA["email"])} | {pdf_link("tel:" + DATA["phone"].replace(" ", ""), DATA["phone"])}'
    story.append(header(contact, 'contact'))
    story.append(header(f'{pdf_link(DATA["github"], "GitHub" if refined else "github.com/vishnu-tharan")} | {pdf_link(DATA["portfolio"], "Portfolio" if refined else "vishnu-tharan.github.io/PortfolioVishnu")} | {pdf_link(DATA["linkedin"], "LinkedIn")}', 'contact'))
    if not refined:
        story.append(HRFlowable(width='100%', thickness=0.7, color=ink, spaceBefore=8, spaceAfter=0))
    story.extend([section('PROFILE'), paragraph(escape(summary))])
    education_block = [section('EDUCATION'), paragraph(f'<b>{escape(education["degree"])}</b>')]
    if refined:
        education_block.extend([paragraph(escape(education['institution'])), paragraph(escape(education_text()), 'stack')])
    else:
        education_block.append(paragraph(f'{escape(education["institution"])} | {escape(education_text())}', 'stack'))
    story.append(KeepTogether(education_block + [paragraph(escape(education['detail']))]))
    story.append(section('TECHNICAL SKILLS'))
    story.extend(paragraph(f'<b>{escape(label)}:</b> {escape(value)}') for label, value in skills)
    story.append(section('TECHNICAL PROJECTS'))
    story.extend(pdf_project(project, document_styles) for project in selected)
    if others:
        story.append(KeepTogether([section('OTHER DEVELOPMENTS'), paragraph(' | '.join(pdf_link(project['url'], project['name']) for project in others))]))
    story.append(PageBreak())
    teamwork = [section('TEAM PROJECTS & LEADERSHIP')]
    for team in teams:
        teamwork.append(paragraph(f'<b>{escape(team["name"])}</b> | {escape(team["category"])} | {pdf_link(team["url"], "Repository")}'))
        if team.get('dates'):
            teamwork.append(paragraph(escape(team['dates']), 'stack'))
        teamwork.extend(paragraph(escape(bullet)) for bullet in team['bullets'])
    teamwork.append(paragraph(escape(DATA['community'])))
    teamwork.extend(paragraph(f'<b>{escape(item["title"])}</b> | {escape(item["institution"])}' + (f' | {escape(item["dates"])}' if item.get('dates') else '')) for item in DATA.get('leadership', []))
    teamwork.extend(pdf_certificate(certificate, document_styles) for certificate in CERTIFICATES if certificate['kind'] == 'Development event')
    story.append(KeepTogether(teamwork))
    story.extend([section('CERTIFICATIONS & WORKSHOPS'), paragraph(escape(DATA['certifications']))])
    story.extend(pdf_certificate(certificate, document_styles) for certificate in CERTIFICATES if certificate['kind'] in ['Course', 'Workshop'])
    story.append(section('AWARDS & COMPETITIONS'))
    story.extend(pdf_certificate(certificate, document_styles) for certificate in CERTIFICATES if certificate['kind'] in ['Competition participation', 'Merit award'])
    references = DATA.get('references', [])
    if references:
        reference_block = [section('REFERENCES')]
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
        label = value['label'] + (' (Main)' if other == DEFAULT_PROFILE else '')
        choices.append(f'<a href="./{navigation_page(other)}"{current}>{escape(label)}</a>')
    choices = ''.join(choices)
    skills_html = ''.join(f'<div><dt>{escape(label)}</dt><dd>{escape(value)}</dd></div>' for label, value in skills)
    other_html = '<section class="cv-other-developments"><h2>Other developments</h2><p>' + ' · '.join(html_link(project['url'], project['name']) for project in others) + '</p></section>' if others else ''
    team_html = ''.join(f'<article class="cv-team-project"><h3>{html_link(team["url"], team["name"])}<span>{escape(team["category"])}</span></h3>' + (f'<p class="cv-stack">{escape(team["dates"])}</p>' if team.get('dates') else '') + ''.join(f'<p>{escape(bullet)}</p>' for bullet in team['bullets']) + '</article>' for team in teams)
    leadership_html = ''.join(f'<p><strong>{escape(item["title"])}</strong> | {escape(item["institution"])}' + (f' | {escape(item["dates"])}' if item.get('dates') else '') + '</p>' for item in DATA.get('leadership', []))
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
<main class="cv-sheet{' cv-sheet-refined' if refined else ''}">
<header class="cv-heading{' cv-heading-centered' if centered else ''}"><h1>{escape(display_name)}</h1><p class="cv-role">{escape(role)}</p>
<div class="cv-contact">{html_link('mailto:' + DATA['email'], DATA['email'])} {html_link('tel:' + DATA['phone'].replace(' ', ''), DATA['phone'])} {html_link(DATA['github'], 'GitHub / vishnu-tharan')} {html_link(DATA['portfolio'], 'Portfolio')} {html_link(DATA['linkedin'], 'LinkedIn')}</div></header>
<section><h2>Profile</h2><p>{escape(summary)}</p></section>
<section><h2>Education</h2><h3>{escape(education['degree'])}<span>{escape(education_text())}</span></h3><p>{escape(education['institution'])}</p><p>{escape(education['detail'])}</p></section>
<section><h2>Technical skills</h2><dl class="cv-skills">{skills_html}</dl></section>
<section><h2>Technical projects</h2>{''.join(html_project(project) for project in selected)}</section>
{other_html}
<section class="cv-page-two"><h2>Team projects &amp; leadership</h2>{team_html}<p>{escape(DATA['community'])}</p>{leadership_html}{development_html}</section>
<section><h2>Certifications &amp; workshops</h2><p>{escape(DATA['certifications'])}</p>{courses_html}</section>
<section><h2>Awards &amp; competitions</h2>{awards_html}</section>
{references_html}
</main><script type="module" src="./src/preferences.js"></script></body></html>
'''
    (ROOT / 'dist' / html_filename).write_text(html, encoding='utf-8')
    if key == DEFAULT_PROFILE:
        for directory in [OUTPUT, ASSETS]:
            shutil.copyfile(output, directory / (BASE + '.pdf'))
        main_html = html.replace(f'./assets/{filename}', f'./assets/{BASE}.pdf')
        (ROOT / 'dist/cv.html').write_text(main_html, encoding='utf-8')
        print(f'Main CV now uses {profile["label"]}.')
    print(f'Created two-page {filename} and {html_filename}')

requested = sys.argv[1:] or list(PROFILES)
if len(set(requested)) != len(requested) or any(key not in PROFILES for key in requested):
    raise SystemExit('Choose distinct profiles: software fullstack web mobile')
for key in requested:
    build(key, PROFILES[key])
for legacy, target in {'cv-frontend.html': 'cv-web.html', 'cv-backend.html': 'cv-software.html'}.items():
    (ROOT / 'dist' / legacy).write_text(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=./{target}"><title>CV moved | {escape(DATA["name"])}</title></head><body><p>This CV is now available at <a href="./{target}">the updated internship CV page</a>.</p></body></html>\n', encoding='utf-8')

# Keep legacy download URLs in sync with their replacement roles.
for old, new in {"Frontend": "Web", "Backend": "SoftwareEngineering"}.items():
    for directory in [OUTPUT, ASSETS]:
        source = directory / f"{BASE}-{new}.pdf"
        if source.exists():
            shutil.copyfile(source, directory / f"{BASE}-{old}.pdf")
