import codecs

html_path = 'index.html'
with codecs.open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace only the specific video src
content = content.replace('data-src="first_1.mp4"', 'data-src="Comp 1_1.mp4"')

with codecs.open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML updated successfully")
