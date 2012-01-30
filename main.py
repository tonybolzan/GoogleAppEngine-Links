#!/usr/bin/env python

from google.appengine.ext.webapp.util import run_wsgi_app

from views import *

def main():
  application = webapp.WSGIApplication([
    ('/', Index),
    ('/index', Index),
    ('/index.html', Index),
    ('/insert', Insert),
    ('/search', Search),
    ('/last', Last),
    ('/.*', Error)
  ], debug=True)
  run_wsgi_app(application)

if __name__ == '__main__':
  main()
