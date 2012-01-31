#!/usr/bin/env python

from google.appengine.ext import search
from google.appengine.ext import db

class Link(search.SearchableModel):
    title = db.StringProperty()
    url   = db.StringProperty()
    tags  = db.StringProperty()
    date  = db.DateTimeProperty(auto_now_add=True)
