import re
import json

with open("paper_226_text.txt", "r") as f:
    text = f.read()

# Try to find exactly 27 to 52 in the text.
# The pattern might have a bell character `\x07` or just spaces.
# Also, they might be split across lines.
out = []
for i in range(27, 53):
    # Search for exactly `number. [bell/spaces]Text...`
    # We will grab 1000 characters after the match.
    pattern = rf"(?m)^{i}\.\s+.*?(?=(?:\n{i+1}\.\s+|\n\d+\.\s+|\Z))"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        out.append(f"--- {i} ---\n{match.group(0)[:1500]}")
    else:
        # Try a more relaxed pattern
        pattern2 = rf"(?m)(?<=\n){i}\.\s+.*?(?=(?:\n{i+1}\.\s+|\n\d+\.\s+|\Z))"
        match2 = re.search(pattern2, text, re.DOTALL)
        if match2:
            out.append(f"--- {i} ---\n{match2.group(0)[:1500]}")
        else:
            out.append(f"--- {i} ---\nNOT FOUND")

with open("recs_27_52_raw.txt", "w") as f:
    f.write("\n\n".join(out))
