#!/usr/bin/env python3
"""Sync the homepage work-card headlines to the case pages' own <h1>.

The case page is the source of truth: each work-card's .headline is rewritten
from the <h1 class="case-hero-text"> of the page it links to. Run after
editing any case page title:  python3 sync-titles.py
"""
import io, re, sys

INDEX = 'index.html'

def case_title(path):
    html = io.open(path, encoding='utf-8').read()
    m = re.search(r'<h1 class="case-hero-text">(.*?)</h1>', html, re.S)
    if not m:
        sys.exit('no <h1 class="case-hero-text"> in %s' % path)
    return ' '.join(m.group(1).split())

def main():
    html = io.open(INDEX, encoding='utf-8').read()
    card = re.compile(
        r'(<a href="(case-[^"]+\.html)" class="reveal work-card">.*?'
        r'<p class="headline">)(.*?)(</p>)', re.S)

    changed = []
    def swap(m):
        title = case_title(m.group(2))
        if ' '.join(m.group(3).split()) != title:
            changed.append((m.group(2), m.group(3).strip(), title))
        return m.group(1) + title + m.group(4)

    out = card.sub(swap, html)
    io.open(INDEX, 'w', encoding='utf-8').write(out)

    for page, old, new in changed:
        print('%s\n  - %s\n  + %s' % (page, old, new))
    print('%d card(s) updated' % len(changed))

main()
