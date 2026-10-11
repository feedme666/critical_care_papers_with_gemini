# Project instructions

This repository is a React application for Japanese summaries and critical appraisal of critical care papers and guidelines.

## Adding a paper or guideline

- When the user asks to process a PDF or says `go ahead`, read `docs/paper-ingestion.md` in full before changing data. Follow its content rules and workflow.
- Inspect `raw_pdfs/` directly. It is ignored by Git, so Git-based file listings can miss input PDFs. If there are multiple PDFs and the user did not identify one, process one at a time and report which file was selected.
- Check for an existing PMID before allocating an ID. Never overwrite an existing `paper_*.json`. If the PMID already exists, stop and report it.
- Verify bibliographic details against the PDF and the actual PubMed page. If a PMID cannot be verified, use `null` for both `pmid` and `pubmed_link`; do not guess clinical findings or numbers.
- Use the next ID from `src/data/papers/metadata.json`. After creating the JSON, update metadata and regenerate `src/data/papers/papers_summary.json` with `node regenerate_summary.js`.
- Before moving the source PDF to `processed_pdfs/paper_<ID>.pdf`, verify the new JSON and summary, and confirm the destination filename does not exist. The source PDF must remain available if processing fails.
- Report the source PDF, assigned ID, PMID verification status, files changed, and checks performed.

## Project checks

- Run `npm run build` after changing application code or paper data. Run focused checks appropriate to the change.
- `npm run deploy` publishes to GitHub Pages; run it only when the user asks to deploy.
