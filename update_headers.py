import os
import re

dashboard_dir = r'd:\StaffKhata\gym-frontend\app\(dashboard)'
files_to_modify = []

for root, dirs, files in os.walk(dashboard_dir):
    for file in files:
        if file == 'page.tsx':
            files_to_modify.append(os.path.join(root, file))

for filepath in files_to_modify:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if SlideInText is already imported
    if 'import { SlideInText }' not in content:
        # Find where to insert the import
        if 'import' in content:
            # Insert after the last import
            last_import_idx = content.rfind('import')
            newline_idx = content.find('\n', last_import_idx)
            if newline_idx != -1:
                content = content[:newline_idx] + '\nimport { SlideInText } from "@/components/ui/slide-in-text"' + content[newline_idx:]
            else:
                content = 'import { SlideInText } from "@/components/ui/slide-in-text"\n' + content
        else:
            content = 'import { SlideInText } from "@/components/ui/slide-in-text"\n' + content

    # Replace static h2 headers
    def replacer(match):
        text = match.group(1)
        if '{' in text:
            # Dynamic text
            # Handle mixed text and variables like "Hello, {user?.name.split(' ')[0]}!"
            # We can use a template literal: <SlideInText text={`Hello, ${user?.name.split(' ')[0]}!`} />
            # This is a bit tricky, so let's handle the known patterns
            if text.startswith('Hello, {') and text.endswith('}!'):
                var_part = text[8:-2]
                return f'<SlideInText text={{`Hello, ${{ {var_part} }}!`}} />'
            elif text.startswith('Welcome, {') and text.endswith('}!'):
                var_part = text[10:-2]
                return f'<SlideInText text={{`Welcome, ${{ {var_part} }}!`}} />'
            elif text.startswith('{') and text.endswith('}'):
                return f'<SlideInText text={text} />'
            else:
                # Fallback for complex expressions
                return f'<SlideInText text={{`{text.replace("{", "${")}`}} />'
        else:
            return f'<SlideInText text="{text}" />'
            
    content = re.sub(r'<h2[^>]*className="[^"]*text-3xl font-bold tracking-tight[^"]*"[^>]*>(.*?)</h2>', replacer, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
print(f'Processed {len(files_to_modify)} files.')
