import re

with open('src/pages/CompanyDashboard.tsx', 'r') as f:
    content = f.read()

# Find OverviewTab section (from const OverviewTab to const ProfileEditor)
start = content.find('const OverviewTab = ')
end = content.find('const ProfileEditor = ')
section = content[start:end]

# Count divs
opens = len(re.findall(r'<div', section))
closes = len(re.findall(r'</div>', section))

print(f"OverviewTab section: {len(section)} chars")
print(f"Opens: {opens}, Closes: {closes}, Diff: {opens - closes}")

# Find the position of the error
lines = section.split('\n')
print(f"Total lines in OverviewTab: {len(lines)}")

# Simple bracket matching
stack = []
in_multiline = False
line_num = 0
for i, line in enumerate(lines):
    line_num = i + 1
    # Skip lines that are just comments
    stripped = line.strip()
    if stripped.startswith('//') or stripped.startswith('/*') or stripped.startswith('*'):
        continue

    # Count <div and </div>
    div_opens = line.count('<div')
    div_closes = line.count('</div>')

    # Adjust for the fact that <div might be part of </div>
    net = div_opens - div_closes

    # Skip if the line is just HTML entities
    if stripped.startswith('{') and stripped.endswith('}'):
        continue

    print(f"Line {line_num}: +{div_opens} -{div_closes} | {stripped[:60]}")
