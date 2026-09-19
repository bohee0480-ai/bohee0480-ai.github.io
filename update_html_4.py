import codecs

html_path = 'index.html'
with codecs.open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific video srcs for project 4
content = content.replace('data-src="Q_short.mp4"', 'data-src="Comp 3.mp4"')
content = content.replace('data-src="vibe_milk_fin_short.mp4"', 'data-src="Comp 3_2.mp4"')
content = content.replace('data-src="key_fin.mp4"', 'data-src="Comp 3_3.mp4"')
content = content.replace('data-src="game_fin.mp4"', 'data-src="Comp 3_4.mp4"')

with codecs.open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML updated successfully for Project 4")
