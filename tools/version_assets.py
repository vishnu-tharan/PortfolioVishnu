"""Keep static asset URLs and module imports on one release version."""
from pathlib import Path
import re
import sys

release = sys.argv[1] if len(sys.argv) > 1 else ''
if not re.fullmatch(r'[A-Za-z0-9_-]+', release):
    raise SystemExit('Usage: python tools/version_assets.py <release-name>')
root = Path(__file__).resolve().parent.parent / 'dist'
imports = re.compile(r"((?:from\s+|import\s+)[\"'])(\./[^\"'?]+\.js)(?:\?v=[A-Za-z0-9_-]+)?([\"'])")
assets = re.compile(r'((?:src|href)=")(\./(?:src/[^"?]+\.js|[^"/?]+\.css|assets/[^"?]+\.pdf))(?:\?v=[A-Za-z0-9_-]+)?(")')
for path in (root / 'src').glob('*.js'):
    text = path.read_text(encoding='utf-8-sig')
    updated = imports.sub(lambda m: f'{m[1]}{m[2]}?v={release}{m[3]}', text)
    if text != updated:
        path.write_text(updated, encoding='utf-8')
for path in root.glob('*.html'):
    text = path.read_text(encoding='utf-8-sig')
    updated = assets.sub(lambda m: f'{m[1]}{m[2]}?v={release}{m[3]}', text)
    if text != updated:
        path.write_text(updated, encoding='utf-8')
