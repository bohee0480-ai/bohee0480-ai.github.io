import codecs
with codecs.open('index.js', 'r', 'utf-8', errors='ignore') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if 'leftSide.style.clipPath' in line:
        lines[i] = '            if (leftSide) leftSide.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;\n'
with codecs.open('index.js', 'w', 'utf-8') as f:
    f.writelines(lines)
