import os
import glob
import re

files_to_skip = [
    'content/volumenes/2/e01-el-experimento-de-las-siete-naciones.md'
]

v2 = glob.glob('content/volumenes/2/*.md*')
v3 = glob.glob('content/volumenes/3/*.md*')

for fpath in v2 + v3:
    if fpath in files_to_skip:
        continue
    
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'publicado: false' not in content:
        # insert before the second ---
        content = re.sub(r'(\n---\n)', r'\npublicado: false\1', content, count=1)
        
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Done setting publicado: false")
