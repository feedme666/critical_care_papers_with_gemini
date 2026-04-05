import re

with open("paper_226_text.txt", "r") as f:
    text = f.read()

results = []
for i in range(53, 79):
    pattern = rf"(?m)^{i}\.\s+(.*?)(?=\n{i+1}\.|\Z)"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        results.append(f"--- {i} ---\n{match.group(0).strip()}")
    else:
        results.append(f"--- {i} ---\nNOT FOUND")

with open("recs_53_78_raw.txt", "w") as f:
    f.write("\n\n".join(results))
