# SOFT OMEN — tiny no-cache dev server. concept, design & code by ghostly.grl ♥
import http.server, os, sys
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()
port = int(sys.argv[1]) if len(sys.argv) > 1 else 5720
http.server.ThreadingHTTPServer(('', port), H).serve_forever()
