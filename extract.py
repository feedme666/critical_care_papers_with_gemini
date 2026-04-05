import Quartz
from Foundation import NSURL

pdf_url = NSURL.fileURLWithPath_("/Users/ryutaroseo/Documents/Dev_local/gemini/critical-care-papers/processed_pdfs/paper_226.pdf")
pdf_doc = Quartz.PDFDocument.alloc().initWithURL_(pdf_url)

if pdf_doc:
    text = ""
    for i in range(pdf_doc.pageCount()):
        page = pdf_doc.pageAtIndex_(i)
        if page and page.string():
            text += page.string() + "\n"
    print(text[:1000])
else:
    print("Could not load PDF")
