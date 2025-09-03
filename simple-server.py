#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
from pathlib import Path

# Change to the project directory
os.chdir(Path(__file__).parent)

PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler

print(f"Starting PR Management System Development Server...")
print(f"Port: {PORT}")
print(f"Directory: {os.getcwd()}")
print(f"URL: http://localhost:{PORT}")
print("-----------------------------------")

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print("Press Ctrl+C to stop the server")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
except OSError as e:
    if e.errno == 10048:  # Port already in use on Windows
        print(f"Error: Port {PORT} is already in use.")
        print("Please close any other applications using this port and try again.")
    else:
        print(f"Error starting server: {e}")
    sys.exit(1)
