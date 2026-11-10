"""Reviewed inline-claim source plan (18-11). No HTML reserialization or facts update.

Each entry addresses one p/li/td/dd in main and checks its exact generator output.
Only that fragment is replaced. Existing links, source lists, schema, metadata,
and all pages outside the explicit 21-page plan are left byte-for-byte alone.
The generator fails closed when a claim changes: the source plan must be reviewed.
"""
from html.parser import HTMLParser
from pathlib import Path
import html
import json
import re

VOID = set("area base br col embed hr img input link meta param source track wbr".split())
class Node:
    def __init__(self, tag, attrs, start, inner_start, parent):
        self.tag, self.attrs, self.start, self.inner_start, self.parent = tag, dict(attrs), start, inner_start, parent
        self.inner_end = self.end = None
        self.children = []
    def ancestors(self):
        p = self.parent
        while p:
            yield p
            p = p.parent
    def inside(self, tag):
        return any(p.tag == tag for p in self.ancestors())

class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.source, self.nodes, self.stack = source, [], []
        self.starts = [0] + [m.end() for m in re.finditer("\n", source)]
        self.feed(source)
        self.close()
    def pos(self):
        line, col = self.getpos()
        return self.starts[line - 1] + col
    def handle_starttag(self, tag, attrs):
        start = self.pos()
        n = Node(tag, attrs, start, start + len(self.get_starttag_text()), self.stack[-1] if self.stack else None)
        self.nodes.append(n)
        if n.parent: n.parent.children.append(n)
        if tag in VOID:
            n.inner_end = n.end = n.inner_start
        else: self.stack.append(n)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            n = self.stack.pop()
            n.inner_end = n.end = n.inner_start
    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i].tag == tag:
                n = self.stack[i]
                n.inner_end = self.pos()
                n.end = self.source.index(">", n.inner_end) + 1
                del self.stack[i:]
                break
    def inner(self, n):
        assert n.inner_end is not None, (n.tag, n.start)
        return self.source[n.inner_start:n.inner_end]
    def text(self, n):
        return html.unescape(re.sub(r"<[^>]+>", "", self.inner(n))).strip()
    def units(self):
        return [n for n in self.nodes if n.tag in ("p", "li", "td", "dd") and n.inside("main")]
    def source_urls(self):
        urls = set()
        for n in self.nodes:
            if n.tag != "a": continue
            if any(p.tag in ("ul", "ol") and "bronnen" in (p.attrs.get("class", "") + " " + p.attrs.get("id", "")).split() for p in n.ancestors()):
                urls.add(n.attrs.get("href"))
            if any(p.tag == "p" and "src" in p.attrs.get("class", "").split() for p in n.ancestors()):
                urls.add(n.attrs.get("href"))
        # /keuzehulp/ uses an existing source column instead of a bottom list.
        for table in [n for n in self.nodes if n.tag == "table"]:
            headings = [n for n in self.nodes if n.tag == "th" and table in list(n.ancestors()) and n.attrs.get("scope") == "col"]
            if headings and self.text(headings[-1]) == "Bron":
                for row in [n for n in self.nodes if n.tag == "tr" and table in list(n.ancestors())]:
                    cells = [n for n in row.children if n.tag in ("td", "th")]
                    if len(cells) != len(headings): continue
                    urls.update(n.attrs["href"] for n in self.nodes if n.tag == "a" and cells[-1] in list(n.ancestors()))
        return urls

def apply_plan(root=Path(".")):
    plan = json.loads((root / "scripts/claim_sources.json").read_text())
    for page in plan:
        path = root / page["file"]
        s = path.read_text()
        d = Document(s)
        units = d.units()
        source_urls = d.source_urls()
        edits = []
        for entry in page["edits"]:
            n = units[entry["unit"]]
            assert n.tag == entry["tag"] and d.inner(n) == entry["before"], (page["file"], entry["unit"], "claim changed; re-review source")
            before, after = Document("<main>" + entry["before"] + "</main>"), Document("<main>" + entry["after"] + "</main>")
            for u in entry["sources"]:
                assert u in source_urls, (page["file"], u, "source not already in original sources list")
            assert re.sub(r"<[^>]+>", "", entry["before"]) == re.sub(r"<[^>]+>", "", entry["after"]), "inline sources must not alter prose"
            old_links = [n.attrs for n in before.nodes if n.tag == "a"]
            new_links = [n.attrs for n in after.nodes if n.tag == "a" and n.attrs.get("class") != "claim-source"]
            assert old_links == new_links, "preserve every existing source/partner/internal link"
            actual_sources = []
            for a in after.nodes:
                if a.tag != "a": continue
                assert not a.inside("a"), "never nest source links"
                if a.attrs.get("class") == "claim-source":
                    assert a.attrs == {"class": "claim-source", "href": a.attrs.get("href"), "rel": "noopener"}, "source is not a CTA"
                    assert a.attrs["href"] in source_urls and a.attrs["href"].startswith("https://"), "exact existing source URL required"
                    actual_sources.append(a.attrs["href"])
            assert set(actual_sources) == set(entry["sources"]), "manifest must list every actual source"
            edits.append((n.inner_start, n.inner_end, entry["after"]))
        for start, end, new in sorted(edits, reverse=True):
            s = s[:start] + new + s[end:]
        path.write_text(s)

if __name__ == "__main__": apply_plan()
