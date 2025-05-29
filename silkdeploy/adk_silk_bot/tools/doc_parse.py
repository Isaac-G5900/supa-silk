import pathlib, tempfile, uuid, logging, re, requests, pdfplumber
from markdownify import markdownify as md

# ── silence verbose pdfminer logs ────────────────────────────────
for name in ("pdfminer", "pdfplumber.page", "pdfminer.layout"):
    logging.getLogger(name).setLevel(logging.ERROR)

HTTP_RE = re.compile(r"^https?://", re.I)

def _parse_pdf(pdf_path: pathlib.Path) -> str:
    """Run pdfplumber → Markdown on a local file."""
    markdown_pages = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            markdown_pages.append(md(page.extract_text() or ""))
    return "\n\n---\n\n".join(markdown_pages)

def extract_to_markdown(path: str) -> str:
    """
    Accepts either…
        a local file path
        an HTTP/HTTPS URL (signed URL, public URL, etc.)
    Returns Markdown string on success, or an 'Error: …' string.
    """
    if HTTP_RE.match(path):
        tmp = pathlib.Path(tempfile.gettempdir()) / f"{uuid.uuid4()}.pdf"
        try:
            resp = requests.get(path, timeout=30)
            resp.raise_for_status()
            
            if "application/pdf" not in resp.headers.get("content-type", ""):
                return "Error: URL did not return a PDF"
            tmp.write_bytes(resp.content)
            return _parse_pdf(tmp)
        except Exception as e:
            return f"Error: download failed – {e}"

    local = pathlib.Path(path).expanduser().resolve()
    if not local.exists():
        return f"Error: File not found at {local}"
    return _parse_pdf(local)
