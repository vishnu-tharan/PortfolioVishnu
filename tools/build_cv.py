"""Generate the CV PDF and accessible web page from cv-data.json.

Requires reportlab. Run: python tools/build_cv.py
Author: vishnu-tharan
"""
from pathlib import Path
from html import escape
import json
import shutil

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "tools/cv-data.json").read_text(encoding="utf-8"))
FILENAME = "Vishnutharan-Bavachelvan-CV.pdf"
OUTPUT = ROOT / "output/pdf" / FILENAME
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

# Embed the local typeface when available; keep generation portable elsewhere.
font_dir = Path("C:/Windows/Fonts")
if (font_dir / "calibri.ttf").exists():
    pdfmetrics.registerFont(TTFont("CV", str(font_dir / "calibri.ttf")))
    pdfmetrics.registerFont(TTFont("CV-Bold", str(font_dir / "calibrib.ttf")))
    pdfmetrics.registerFontFamily("CV", normal="CV", bold="CV-Bold")
    regular, bold = "CV", "CV-Bold"
else:
    regular, bold = "Helvetica", "Helvetica-Bold"

ink = colors.HexColor("#20252b")
red = colors.HexColor("#b42e25")
styles = {
    "name": ParagraphStyle("name", fontName=bold, fontSize=27, leading=30, textColor=ink, spaceAfter=4),
    "role": ParagraphStyle("role", fontName=bold, fontSize=11, leading=15, textColor=red, spaceAfter=7),
    "contact": ParagraphStyle("contact", fontName=regular, fontSize=9, leading=12, textColor=ink),
    "section": ParagraphStyle("section", fontName=bold, fontSize=10, leading=13, textColor=red, spaceBefore=12, spaceAfter=5),
    "body": ParagraphStyle("body", fontName=regular, fontSize=9.8, leading=12.8, textColor=ink, alignment=TA_LEFT),
    "project": ParagraphStyle("project", fontName=bold, fontSize=10.5, leading=14, textColor=ink, spaceBefore=5),
    "stack": ParagraphStyle("stack", fontName=regular, fontSize=9, leading=12, textColor=colors.HexColor("#555d66"), spaceAfter=2),
    "bullet": ParagraphStyle("bullet", fontName=regular, fontSize=9.6, leading=12.5, textColor=ink, leftIndent=10, firstLineIndent=-8, spaceAfter=1),
}

def p(text, style="body"):
    return Paragraph(text, styles[style])

def link(url, text):
    return f'<a href="{escape(url, quote=True)}" color="#b42e25">{escape(text)}</a>'

story = [p(escape(DATA["name"]), "name"), p(escape(DATA["role"]), "role")]
story += [p(f'{link("mailto:" + DATA["email"], DATA["email"])} | {link("tel:+94773646391", DATA["phone"])}', "contact")]
story += [p(f'{link(DATA["github"], "github.com/vishnu-tharan")} | {link(DATA["portfolio"], "vishnu-tharan.github.io/PortfolioVishnu")}', "contact")]
story += [p(escape(DATA["availability"]) + " | " + link(DATA["linkedin"], "LinkedIn / Vishnutharan Bavachelvan"), "contact")]
story += [p("PROFILE", "section"), p(escape(DATA["summary"]))]
story += [p("TECHNICAL SKILLS", "section")]
for label, value in DATA["skills"]:
    story.append(p(f"<b>{escape(label)}:</b> {escape(value)}"))
story += [p("SELECTED PROJECTS", "section")]
for project in DATA["projects"]:
    block = [p(f'{escape(project["name"])} <font name="{regular}" size="9">| {escape(project["category"])} | {link(project["url"], "Repository")}</font>', "project"), p(escape(project["stack"]), "stack")]
    block.extend(p("- " + escape(bullet), "bullet") for bullet in project["bullets"])
    story.append(KeepTogether(block))
ed = DATA["education"]
story += [p("EDUCATION", "section"), p(f'<b>{escape(ed["degree"])}</b> | {escape(ed["dates"])}'), p(escape(ed["institution"])), p(escape(ed["detail"]))]
story += [p("CERTIFICATIONS", "section"), p(escape(DATA["certifications"]))]
story += [p("LEADERSHIP & COMMUNITY", "section"), p(escape(DATA["community"]))]

def decorate(canvas, doc):
    canvas.setFillColor(red)
    canvas.rect(42, A4[1] - 24, 48, 3, fill=1, stroke=0)

doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=42, leftMargin=42,
                        topMargin=38, bottomMargin=32, title=f'{DATA["name"]} - CV',
                        author=DATA["author"], subject="Full-stack development and IT opportunities")
doc.build(story, onFirstPage=decorate, onLaterPages=decorate)
(ROOT / "dist/assets").mkdir(parents=True, exist_ok=True)
shutil.copyfile(OUTPUT, ROOT / "dist/assets" / FILENAME)

def html_link(url, label):
    return f'<a href="{escape(url, quote=True)}">{escape(label)}</a>'

projects_html = "\n".join(
    '<article class="cv-project"><h3>' + html_link(x["url"], x["name"]) +
    f'<span>{escape(x["category"])}</span></h3><p class="cv-stack">{escape(x["stack"])}</p><ul>' +
    ''.join(f'<li>{escape(b)}</li>' for b in x["bullets"]) + '</ul></article>'
    for x in DATA["projects"]
)
skills_html = ''.join(f'<div><dt>{escape(k)}</dt><dd>{escape(v)}</dd></div>' for k, v in DATA["skills"])
html = f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="author" content="{escape(DATA["author"])}">
  <meta name="description" content="Vishnutharan Bavachelvan's CV: full-stack development projects, technical skills, education and certifications.">
  <meta name="theme-color" content="#090909">
  <title>CV | {escape(DATA["name"])}</title>
  <script src="./src/theme-init.js"></script><link rel="stylesheet" href="./theme.css"><link rel="stylesheet" href="./cv.css"><link rel="stylesheet" href="./cv-theme.css">
</head>
<body class="cv-page">
  <nav class="cv-toolbar" aria-label="CV navigation"><a href="./index.html">&#8592; Back to portfolio</a><div class="cv-toolbar-actions"><button class="cv-theme-toggle" type="button" data-theme-toggle aria-label="Switch theme" aria-pressed="false">◐</button><a class="cv-button" href="./assets/{FILENAME}" download>Download CV <span>PDF &#8595;</span></a></div></nav>
  <main class="cv-sheet">
    <header class="cv-heading"><p class="cv-kicker">CURRICULUM VITAE</p><h1>{escape(DATA["name"])}</h1><p class="cv-role">{escape(DATA["role"])}</p>
      <div class="cv-contact">{html_link("mailto:" + DATA["email"], DATA["email"])} {html_link("tel:+94773646391", DATA["phone"])} {html_link(DATA["github"], "GitHub / vishnu-tharan")} {html_link(DATA["portfolio"], "Portfolio")} {html_link(DATA["linkedin"], "LinkedIn")}</div>
      <p class="cv-availability">{escape(DATA["availability"])}</p>
    </header>
    <section><h2>Profile</h2><p>{escape(DATA["summary"])}</p></section>
    <section><h2>Technical skills</h2><dl class="cv-skills">{skills_html}</dl></section>
    <section><h2>Selected projects</h2>{projects_html}</section>
    <section><h2>Education</h2><h3>{escape(ed["degree"])}<span>{escape(ed["dates"])}</span></h3><p>{escape(ed["institution"])}</p><p>{escape(ed["detail"])}</p></section>
    <section><h2>Certifications</h2><p>{escape(DATA["certifications"])}</p></section>
    <section><h2>Leadership &amp; community</h2><p>{escape(DATA["community"])}</p></section>
  </main>
<script type="module" src="./src/preferences.js"></script></body>
</html>
'''
(ROOT / "dist/cv.html").write_text(html, encoding="utf-8")
print(f"Created {OUTPUT}")
print("Updated dist/cv.html and downloadable PDF.")
