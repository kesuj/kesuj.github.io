"""Convert the tables in a PDF into an Excel workbook, one worksheet per page.

Usage:
    py pdf_tables_to_excel.py input.pdf [more.pdf ...] [--out DIR] [--all-text]

For each PDF, writes <name>.xlsx next to it (or into --out). Sheet names are
"Page 1", "Page 2", ... so the workbook mirrors the document page by page.
Pages with several tables get them stacked with a blank row between.
Pages with no detectable table lines fall back to a word-position grid
(--all-text forces that fallback on every page), so nothing is dropped.

Scanned (image-only) pages are reported, not guessed: run OCR first
(e.g. `ocrmypdf scanned.pdf searchable.pdf`) and then convert the result.

Requires: pdfplumber, openpyxl (both pip-installable).
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

import pdfplumber
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font
from openpyxl.utils import get_column_letter

LINE_SETTINGS = {"vertical_strategy": "lines", "horizontal_strategy": "lines", "snap_tolerance": 4}
TEXT_SETTINGS = {"vertical_strategy": "text", "horizontal_strategy": "text", "snap_tolerance": 4}


def clean(cell) -> str:
    return " ".join(str(cell).split()) if cell is not None else ""


def extract_page(page, force_text: bool) -> tuple[list[list[list[str]]], str]:
    """Return (tables, mode). mode is 'lines', 'text', or 'empty' (no extractable text)."""
    if not (page.extract_text() or "").strip():
        return [], "empty"
    if not force_text:
        tables = [t for t in page.extract_tables(LINE_SETTINGS) if t and any(any(clean(c) for c in r) for r in t)]
        if tables:
            return [[[clean(c) for c in row] for row in t] for t in tables], "lines"
    tables = [t for t in page.extract_tables(TEXT_SETTINGS) if t]
    if tables:
        return [[[clean(c) for c in row] for row in t] for t in tables], "text"
    # Last resort: one line per row so the text is still captured.
    lines = [[ln] for ln in (page.extract_text() or "").splitlines() if ln.strip()]
    return ([lines] if lines else []), "text"


def write_sheet(ws, tables):
    row_idx = 1
    widths: dict[int, int] = {}
    for t_no, table in enumerate(tables):
        if t_no:
            row_idx += 1
        for r_no, row in enumerate(table):
            for c_no, value in enumerate(row, start=1):
                cell = ws.cell(row=row_idx, column=c_no, value=number_or_text(value))
                cell.alignment = Alignment(wrap_text=False, vertical="top")
                if r_no == 0 and len(table) > 1:
                    cell.font = Font(bold=True)
                widths[c_no] = max(widths.get(c_no, 0), min(len(value), 60))
            row_idx += 1
    for c_no, w in widths.items():
        ws.column_dimensions[get_column_letter(c_no)].width = max(8, w + 2)
    ws.freeze_panes = "A2"


def number_or_text(value: str):
    """Keep numbers as numbers so Excel formulas work, but never alter text."""
    s = value.replace(",", "")
    if s and s.lstrip("-").replace(".", "", 1).isdigit() and not value.startswith("0") or s in ("0", "0.0"):
        try:
            return float(s) if "." in s else int(s)
        except ValueError:
            return value
    return value


def convert(pdf_path: Path, out_dir: Path | None, force_text: bool) -> dict:
    wb = Workbook()
    wb.remove(wb.active)
    summary = {"pages": 0, "tables": 0, "empty_pages": [], "text_mode_pages": []}
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            summary["pages"] += 1
            ws = wb.create_sheet(f"Page {page.page_number}")
            tables, mode = extract_page(page, force_text)
            if mode == "empty":
                summary["empty_pages"].append(page.page_number)
                ws["A1"] = "No selectable text on this page (scanned image?). Run OCR first."
                ws["A1"].font = Font(italic=True, color="9C0006")
                continue
            if mode == "text":
                summary["text_mode_pages"].append(page.page_number)
            summary["tables"] += len(tables)
            write_sheet(ws, tables)
    out_path = (out_dir or pdf_path.parent) / f"{pdf_path.stem}.xlsx"
    wb.save(out_path)
    summary["output"] = str(out_path)
    return summary


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="PDF tables -> Excel, one sheet per page")
    ap.add_argument("pdfs", nargs="+", type=Path)
    ap.add_argument("--out", type=Path, help="output folder (default: next to each PDF)")
    ap.add_argument("--all-text", action="store_true", help="use word-position grids on every page")
    a = ap.parse_args(argv)
    if a.out:
        a.out.mkdir(parents=True, exist_ok=True)
    failures = 0
    for pdf in a.pdfs:
        try:
            s = convert(pdf, a.out, a.all_text)
        except Exception as e:  # noqa: BLE001 - report and keep going with the other files
            print(f"FAILED {pdf}: {e}", file=sys.stderr)
            failures += 1
            continue
        note = ""
        if s["empty_pages"]:
            note += f"; needs OCR on pages {s['empty_pages']}"
        if s["text_mode_pages"]:
            note += f"; no ruled lines on pages {s['text_mode_pages']} (word grid used - check alignment)"
        print(f"{pdf.name}: {s['pages']} pages, {s['tables']} tables -> {s['output']}{note}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
