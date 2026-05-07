from __future__ import annotations

import mimetypes
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote


ROOT = Path(__file__).parent.resolve()
TEMPLATE_DIR = ROOT
STATIC_DIR = ROOT / "static"
HOST = "127.0.0.1"
PORT = 8000
ROUTES = {
    "/": "index.html",
    "/index.html": "index.html",
    "/work": "work.html",
    "/work/": "work.html",
    "/about": "about.html",
    "/about/": "about.html",
    "/stories": "stories.html",
    "/stories/": "stories.html",
    "/contact": "contact.html",
    "/contact/": "contact.html",
}


class PortfolioHandler(SimpleHTTPRequestHandler):
    """Tiny dependency-free Python server for the portfolio."""

    def do_GET(self) -> None:
        route = unquote(self.path.split("?", 1)[0])
        if route in ROUTES:
            self.send_file(TEMPLATE_DIR / ROUTES[route], "text/html; charset=utf-8")
            return

        if route.startswith("/static/"):
            requested = route.removeprefix("/static/")
            target = (STATIC_DIR / requested).resolve()

            if STATIC_DIR in target.parents or target == STATIC_DIR:
                self.send_file(target, mimetypes.guess_type(target.name)[0] or "application/octet-stream")
                return

        self.send_error(404, "Not found")

    def send_file(self, path: Path, content_type: str) -> None:
        if not path.is_file():
            self.send_error(404, "Not found")
            return

        data = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        if path.suffix == ".pdf":
            self.send_header("Content-Disposition", 'inline; filename="Kapil_Resume.pdf"')
        self.end_headers()
        self.wfile.write(data)


def run() -> None:
    server = ThreadingHTTPServer((HOST, PORT), PortfolioHandler)
    print(f"Kapil's portfolio is running at http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    run()
