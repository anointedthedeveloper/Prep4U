#!/usr/bin/env python3
import http.server
import socketserver
import os
from pathlib import Path

PORT = 5000
DIRECTORY = "Prep4U"

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def log_message(self, format, *args):
        print(f"[HTTP] {format % args}")

if __name__ == "__main__":
    os.chdir(Path(__file__).parent)
    
    with socketserver.TCPServer(("0.0.0.0", PORT), NoCacheHTTPRequestHandler) as httpd:
        print(f"Server running at http://0.0.0.0:{PORT}")
        print(f"Serving files from: {DIRECTORY}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.shutdown()
