"""Render the common CV PDF from the same content used by the website."""

from html import escape
from urllib.parse import urljoin

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Table


def render_cv_pdf(output, data, contacts, events):
    normal = ParagraphStyle(
        'CV body', fontName='Helvetica', fontSize=9.7, leading=11.7, spaceAfter=2
    )
    heading = ParagraphStyle(
        'CV section', parent=normal, fontName='Helvetica-Bold', fontSize=10.3, spaceBefore=4
    )
    title = ParagraphStyle(
        'CV name', parent=normal, fontName='Helvetica-Bold', fontSize=24,
        leading=28, alignment=TA_CENTER
    )
    centered = ParagraphStyle('CV centered', parent=normal, alignment=TA_CENTER)
    contact = ParagraphStyle('CV contact', parent=centered, fontSize=9)
    horizontal_margin = 38
    story = []

    def line(markup, style=normal):
        story.append(Paragraph(markup, style))

    def section(label):
        line(escape(label.upper()), heading)
        story.append(HRFlowable(width='100%', thickness=0.5, color=colors.HexColor('#777777'), spaceAfter=3))

    def pdf_link(url, label):
        target = escape(urljoin(data['portfolio'], url), quote=True)
        return f'<link href="{target}"><u>{escape(label)}</u></link>'

    line(escape(data['name'].upper()), title)
    line(escape(data['role']), centered)
    line(' · '.join(pdf_link(url, label) if url else escape(label) for url, label in contacts), contact)

    section('Professional Profile')
    line(escape(data['summary']))

    section('Education')
    education = data['education']
    line('<br/>'.join([
        f'<b>{escape(education["degree"])}</b>',
        escape(education['institution']),
        escape(f'{education["dates"]} (Expected {education["expected_graduation"]})'),
        escape(education['detail']),
    ]))

    section('Technical Skills')
    for label, value in data['skills']:
        line(f'<b>{escape(label)}:</b> {escape(value)}')

    projects = data.get('projects', [])
    coursework = data.get('coursework', [])
    additional = data.get('additional_project')
    if projects or coursework or additional:
        section('Projects')
        for project in projects:
            name = pdf_link(project['url'], project['name'])
            details = f'<b>{name}</b> | {escape(project["stack"])}'
            if project.get('live_url'):
                details += ' | ' + pdf_link(project['live_url'], project.get('live_label', 'Live store'))
            story.append(KeepTogether([
                Paragraph(details, normal),
                Paragraph(escape(project['summary']), normal),
            ]))
        notes = []
        if coursework:
            notes.append('<b>Selected coursework:</b> ' + ' · '.join(map(escape, coursework)))
        if additional:
            notes.append('<b>Other project:</b> ' + escape(additional))
        if notes:
            line(' · '.join(notes))

    section('Competitions & Leadership')
    line('<b>Competitive Hackathons &amp; Events:</b> ' + events(pdf_link))
    line('<b>Leadership &amp; Volunteering:</b> ' + escape(data['leadership_volunteering']))

    section('Certifications & Workshops')
    for course in data['certifications']:
        details = f'<b>{escape(course["issuer"])}:</b> {escape(course["title"])}'
        if course.get('certificate'):
            details += ' [' + pdf_link(course['certificate'], 'Certificate') + ']'
        line(details)

    section('Academic References')
    reference_cards = []
    for reference in data['references']:
        details = [f'<b>{escape(reference["name"])}</b>']
        details.extend(escape(reference[key]) for key in ('title', 'institution', 'credentials') if reference.get(key))
        links = []
        if reference.get('phone'):
            links.append(pdf_link('tel:' + reference['phone'].replace(' ', ''), reference['phone']))
        if reference.get('email'):
            links.append(pdf_link('mailto:' + reference['email'], reference['email']))
        if links:
            details.append(' · '.join(links))
        reference_cards.append(Paragraph('<br/>'.join(details), normal))

    reference_rows = [reference_cards[index:index + 2] for index in range(0, len(reference_cards), 2)]
    if reference_rows:
        usable_width = A4[0] - 2 * (horizontal_margin + 6)
        reference_table = Table(
            reference_rows, colWidths=[usable_width * 0.53, usable_width * 0.47], hAlign='LEFT',
            style=[
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 0),
                ('RIGHTPADDING', (0, 0), (-1, -1), 14),
                ('TOPPADDING', (0, 0), (-1, -1), 0),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
            ],
        )
        story.append(KeepTogether([reference_table]))

    document = SimpleDocTemplate(
        output, pagesize=A4, leftMargin=horizontal_margin, rightMargin=horizontal_margin,
        topMargin=25, bottomMargin=22, title='Curriculum Vitae | ' + data['name'],
        author=data['name'], invariant=1
    )
    document.build(story)
