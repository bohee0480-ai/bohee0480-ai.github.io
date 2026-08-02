import codecs

css_path = 'index.css'
with codecs.open(css_path, 'r', encoding='utf-8', errors='ignore') as f:
    css = f.read()

append_css = """\n\n/* Desktop Z-Index Fix */
.custom-1-grid, .custom-2-grid, .custom-3-grid, .custom-4-grid, .video-wrapper, .video-original-wrapper {
    z-index: 10;
    position: relative;
}
"""

with codecs.open(css_path, 'a', encoding='utf-8') as f:
    f.write(append_css)
print("CSS appended successfully")
