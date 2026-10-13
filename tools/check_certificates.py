"""Validate certificate metadata, unchanged document copies and gallery links."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
from datetime import date
import hashlib
import json

ROOT = Path(__file__).resolve().parent.parent
certificates = json.loads((ROOT / 'tools/certificate-data.json').read_text(encoding='utf-8'))
assert len(certificates) == 7
assert len({item['id'] for item in certificates}) == 7
assert len({item['file'] for item in certificates}) == 7
assert sorted(item['kind'] for item in certificates) == sorted(['Course', 'Workshop', 'Development event', 'Merit award'] + ['Competition participation'] * 3)

class Gallery(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.links = []
        self.images = []
    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == 'article' and attrs.get('class') == 'certificate-card':
            self.ids.append(attrs['id'])
        if tag == 'a' and attrs.get('href', '').startswith('./assets/certificates/'):
            self.links.append(urlsplit(attrs['href']).path)
        if tag == 'img' and attrs.get('src', '').startswith('./assets/certificates/'):
            self.images.append(urlsplit(attrs['src']).path)
            assert attrs.get('alt') and attrs.get('loading') == 'lazy'

gallery = Gallery()
gallery.feed((ROOT / 'dist/index.html').read_text(encoding='utf-8'))
assert gallery.ids == ['certificate-' + item['id'] for item in certificates]
assert len(gallery.links) == 21 and len(gallery.images) == 7
for item in certificates:
    date.fromisoformat(item['date'])
    url = './assets/certificates/' + item['file']
    assert gallery.links.count(url) == 3
    assert './assets/certificates/' + item['preview'] in gallery.images
    published = ROOT / 'dist/assets/certificates' / item['file']
    local_copy = ROOT / 'output/certificates' / item['file']
    assert published.is_file() and local_copy.is_file()
    assert hashlib.sha256(published.read_bytes()).digest() == hashlib.sha256(local_copy.read_bytes()).digest()
print('Seven classified certificates: valid dates, named document copies, lazy previews and complete view/download links.')
