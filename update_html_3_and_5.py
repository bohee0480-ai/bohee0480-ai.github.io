import codecs

html_path = 'index.html'
with codecs.open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific video srcs for project 3
content = content.replace('data-src="octane_19.mp4"', 'data-src="Comp 1_4.mp4"')
content = content.replace('data-src="viewrender_02.mp4"', 'data-src="Comp 1_5.mp4"')

# Replace the specific video src for project 5
content = content.replace('data-src="apocalypse_fin_04.mp4"', 'data-src="Comp 1_6.mp4"')

with codecs.open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML updated successfully for Projects 3 and 5")
