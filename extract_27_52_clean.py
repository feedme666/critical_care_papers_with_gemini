import re

with open("paper_226_text.txt", "r") as f:
    text = f.read()

# Normalize tricky numbers: "37 ." -> "37." etc.
text = re.sub(r'(\d+)\s+\.', r'\1.', text)
text = re.sub(r'\x07', '', text) # Remove bell characters

results = []
for i in range(27, 53):
    # Flexible pattern: look for `[something] i.  Text...`
    # We allow leading spaces, words like "New", etc.
    pattern = rf"(?m)(?:^|\n).*?\b{i}\.\s+([\s\S]*?)(?=\n.*?\b{i+1}\.\s+|\n.*?\b\d{{2,3}}\.\s+|\nReferences|\nTable|\nFig|\Z)"
    match = re.search(pattern, text)
    if match:
        content = match.group(1).strip()
        # Clean up some formatting
        results.append(f"--- {i} ---\n{content[:1500]}")
    else:
        results.append(f"--- {i} ---\nNOT FOUND")

with open("recs_27_52_clean.txt", "w") as f:
    f.write("\n\n".join(results))
