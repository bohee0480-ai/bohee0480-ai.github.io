import codecs

html_path = 'index.html'
with codecs.open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific video srcs for project 1
content = content.replace('data-src="comfyui_node.mp4"', 'data-src="Comp 1_3.mp4"')
content = content.replace('data-src="first_01_sunglass.mp4"', 'data-src="Comp 1_2.mp4"')

with codecs.open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML updated successfully")
