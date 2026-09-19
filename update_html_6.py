import codecs

html_path = 'index.html'
with codecs.open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific video src for project 6
content = content.replace('data-src="player_fin__.mp4"', 'data-src="Comp 1_7.mp4"')

with codecs.open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML updated successfully for Project 6")
