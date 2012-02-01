#!/usr/bin/env python

import os
import cgi
from datetime import datetime

from google.appengine.api import memcache
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

import simplejson

from models import *

class Index(webapp.RequestHandler):
  page = 'index.html'
  def get(self):
    path = os.path.join(os.path.dirname(__file__), 'template' ,self.page)
    self.response.out.write(
      template.render(path,{
        "year"	: datetime.now().strftime("%Y")
    }))


class Error(Index):
  page = 'error.html'


class Insert(webapp.RequestHandler):
  def post(self):
    self.response.headers['Content-Type'] = 'application/json'
    try:
      title_ = cgi.escape(self.request.get('title')).lower()
      url_   = cgi.escape(self.request.get('url')).lower()
      tags_  = cgi.escape(self.request.get('tags')).lower()

      if not Link.gql("WHERE url = :1", url_):
        self.response.out.write('{"feedback":false, "msg":"Este link ja existe."}')
      else:
        Link(title=title_, url=url_, tags=tags_).put()
        memcache.delete("last")
        self.response.out.write('{"feedback":true, "msg":"Link inserido com sucesso!"}')
        
    except Exception, e:
      self.response.out.write('{"feedback":false, "msg":"Erro interno do servidor."}')


class Delete(webapp.RequestHandler):
  def post(self):
    self.response.headers['Content-Type'] = 'application/json'
    url = cgi.escape(self.request.get('url')).lower()
    self.response.out.write(url)

def show(self,links):
  response = []
  for link in links:
    if link.title:
      link_dict = {"title": link.title.capitalize(),
                   "url": link.url,
                   "tags": link.tags,
                   "date": link.date.strftime("Posted on %m/%d/%Y at %H:%M:%S")}
      response.append(link_dict)

  self.response.out.write(simplejson.dumps(response))


class Search(webapp.RequestHandler):
  def post(self):
    self.response.headers['Content-Type'] = 'application/json'
    search = cgi.escape(self.request.get('search')).lower()
    if len(search) >= 3:
      links = Link.all().search(search).fetch(1000)
      show(self,links)
      

class Last(webapp.RequestHandler):
  def post(self):
    self.response.headers['Content-Type'] = 'application/json'
    
    links = memcache.get("last")
    if links is None:
      links = Link.all().order("-date").fetch(15)
      if not memcache.add("last", links, 3600):
            logging.error("Memcache set failed.")
      
    show(self,links)
