"""Apply a reproducible CSP after generating HTML, including exact JSON-LD hashes."""
from pathlib import Path
import base64
import hashlib
import re

def secure_pages(root):
    for page in root.glob('*.html'):
        text = page.read_text(encoding='utf-8-sig')
        text = re.sub(r'<meta (?:http-equiv="Content-Security-Policy"|name="referrer")[^>]*>\s*', '', text)
        hashes = []
        for attributes, body in re.findall(r'<script\b([^>]*)>(.*?)</script>', text, re.S):
            if 'src=' not in attributes:
                hashes.append("'sha256-" + base64.b64encode(hashlib.sha256(body.encode()).digest()).decode() + "'")
        policy = "default-src 'self'; script-src 'self' " + ' '.join(hashes) + "; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://api.github.com; object-src 'none'; base-uri 'none'; form-action 'self' https://formsubmit.co; frame-src 'none'"
        meta = f'<meta http-equiv="Content-Security-Policy" content="{policy}"><meta name="referrer" content="strict-origin-when-cross-origin">'
        text = text.replace('<head>', '<head>' + meta, 1)
        page.write_text(text, encoding='utf-8')

if __name__ == '__main__':
    secure_pages(Path(__file__).resolve().parent.parent / 'dist')
