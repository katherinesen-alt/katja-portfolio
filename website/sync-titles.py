#!/usr/bin/env python3
"""Sync everything that repeats a case page's title.

The <h1 class="case-hero-text"> of each case page is the source of truth. From it:
  - the page's own <title>, so the browser tab reads the same as the heading
  - the .headline of the card that links to it on the homepage

Run after editing any case page title:  python3 sync-titles.py
"""
import glob, io, re, sys

INDEX = 'index.html'

def read(path):
    return io.open(path, encoding='utf-8').read()

def write(path, text):
    io.open(path, 'w', encoding='utf-8').write(text)

def case_title(html, path):
    m = re.search(r'<h1 class="case-hero-text">(.*?)</h1>', html, re.S)
    if not m:
        sys.exit('no <h1 class="case-hero-text"> in %s' % path)
    return ' '.join(m.group(1).split())

def sync_tab_titles():
    changed = []
    for path in sorted(glob.glob('case-*.html')):
        html = read(path)
        title = case_title(html, path)
        m = re.search(r'<title>(.*?)</title>', html, re.S)
        if not m:
            sys.exit('no <title> in %s' % path)
        if m.group(1) != title:
            changed.append((path, m.group(1), title))
            write(path, html[:m.start(1)] + title + html[m.end(1):])
    return changed

def sync_cards():
    html = read(INDEX)
    card = re.compile(
        r'(<a href="(case-[^"]+\.html)" class="reveal work-card">.*?'
        r'<p class="headline">)(.*?)(</p>)', re.S)

    changed = []
    def swap(m):
        title = case_title(read(m.group(2)), m.group(2))
        if ' '.join(m.group(3).split()) != title:
            changed.append((m.group(2), m.group(3).strip(), title))
        return m.group(1) + title + m.group(4)

    write(INDEX, card.sub(swap, html))
    return changed

def report(label, changed):
    for path, old, new in changed:
        print('%s\n  - %s\n  + %s' % (path, old, new))
    print('%d %s updated' % (len(changed), label))

report('tab title(s)', sync_tab_titles())
report('card(s)', sync_cards())
