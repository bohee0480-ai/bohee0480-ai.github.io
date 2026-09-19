import codecs

html_path = 'index.html'
with codecs.open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('content="./og_image.jpg"', 'content="https://bohee0480-ai.github.io/og_image.jpg"')

with codecs.open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("OG image URL made absolute")
