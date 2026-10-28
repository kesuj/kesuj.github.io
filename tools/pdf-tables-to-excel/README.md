# PDF tables → Excel (one worksheet per page)

A small, tested Python tool that pulls every table out of a PDF and writes an Excel workbook that mirrors the document page by page: **Page 1, Page 2, …** as separate sheets.

```
py pdf_tables_to_excel.py report.pdf          # writes report.xlsx next to it
py pdf_tables_to_excel.py a.pdf b.pdf --out xlsx/
```

What it does:

- Detects ruled tables with `pdfplumber`; several tables on one page are stacked with a blank row between them.
- Pages without ruled lines fall back to a word-position grid, so nothing is silently dropped. The console tells you which pages used the fallback so you can check alignment.
- Numbers become real numbers (`1,250` → `1250`), so formulas work; codes like `007` or `A-001` stay as text.
- Header row bold, columns auto-sized, header frozen.
- Scanned (image-only) pages are **flagged, not guessed**: run OCR first (for example `ocrmypdf scanned.pdf searchable.pdf`), then convert.

Sample: `samples/sample.pdf` → `samples/sample.xlsx` (3 pages: two tables on page 1, one on page 2, plain text on page 3).

Tests: `py -m pytest -q` renders the sample PDF with headless Edge, converts it and checks cell values, sheet names and number parsing (2 tests).

Requirements: Python 3.10+, `pip install pdfplumber openpyxl` (pytest for the tests).

Limits: layout fidelity depends on the PDF having real table lines or consistent column positions; merged cells are flattened; no OCR built in.
