import codecs

html_path = 'index.html'
with codecs.open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Swap Project 1 videos
content = content.replace('Comp 1_3.mp4', '__TMP1__')
content = content.replace('Comp 1_2.mp4', 'Comp 1_3.mp4')
content = content.replace('__TMP1__', 'Comp 1_2.mp4')

# Swap Project 3 videos
content = content.replace('Comp 1_5.mp4', '__TMP3__')
content = content.replace('Comp 1_4.mp4', 'Comp 1_5.mp4')
content = content.replace('__TMP3__', 'Comp 1_4.mp4')

with codecs.open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML swapped successfully for Projects 1 and 3")
