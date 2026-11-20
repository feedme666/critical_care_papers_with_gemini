# Critical Care Papers: Gemini CLI instructions

The shared paper and guideline processing rules are imported below.
- When the user says `gather`, run `node scripts/gather_pdfs.js` (configured via `.gather.local.json`, supporting macOS Shortcuts mode or direct filesystem mode) to move PDFs into `raw_pdfs/` and report the result. Do not automatically start paper ingestion unless requested.
- When the user asks to process a PDF or says `go ahead`, follow the paper and guideline processing rules imported below.

@./docs/paper-ingestion.md
