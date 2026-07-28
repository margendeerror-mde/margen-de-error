import os
import re

dir_path = 'content/volumenes/3'
for filename in os.listdir(dir_path):
    if filename.endswith('.md'):
        filepath = os.path.join(dir_path, filename)
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Remove mecanismo block (mecanismo:\n  - something\n  - something)
        # Using a regex that matches "mecanismo:" followed by lines starting with "  - "
        new_content = re.sub(r'mecanismo:\n(?:  - .*\n)*', '', content)
        
        with open(filepath, 'w') as f:
            f.write(new_content)
