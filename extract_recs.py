import re

with open("paper_226_text.txt", "r") as f:
    text = f.read()

# Replace newlines with spaces to make regex easier, but keep some structure.
# Actually, let's just use regex on the full string with re.DOTALL
matches = re.finditer(r"(?m)^(\d+)\.\s+(.*?)(?=\n\n|\n[A-Z][a-z]+|\n\d+\.\s+|$)", text)
# Wait, let's just extract blocks starting with `\n(79-104)\. ` and capture the next 500 characters
results = []
for i in range(79, 105):
    pattern = rf"(?m)^{i}\.\s+([\s\S]{{5,500}}?)(?:Revisited|Carryover|New|evidence\)|evidence\)\s+Remark:|evidence\)\s+Rationale:)"
    match = re.search(pattern, text)
    if match:
        results.append(f"--- {i} ---\n{match.group(0).strip()}")
    else:
        # Fallback if the pattern doesn't perfectly match
        pattern2 = rf"(?m)^{i}\.\s+.*?(?=\n\d+\.\s+)"
        match2 = re.search(pattern2, text, re.DOTALL)
        if match2:
            results.append(f"--- {i} ---\n{match2.group(0)[:500].strip()}")
        else:
            results.append(f"--- {i} ---\nNOT FOUND")

with open("recs_79_104_raw.txt", "w") as f:
    f.write("\n\n".join(results))

