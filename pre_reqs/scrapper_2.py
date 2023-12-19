import bs4 as bs
import requests
import newspaper
from newspaper import Article
import nltk
from pymongo import MongoClient

nltk.download('punkt')
import requests

def is_gallery_in_url(url):
    lowercase_url = url.lower()

    return 'gallery' in lowercase_url

def is_live_in_url(url):
    lowercase_url = url.lower()

    return 'live' in lowercase_url

def is_av_in_url(url):
    lowercase_url = url.lower()
    
    

    return 'av' in lowercase_url

def is_shows_in_url(url):
    lowercase_url = url.lower()
    return 'shows' in lowercase_url

client = MongoClient('localhost', 27017)
db = client['article_data1']
collection = db['bbc']

url = "https://www.bbc.com/"
links_to_article = []
title=[]
options1=["news","sport"]
for i in options1:
    url+=i
    source = requests.get(url)
    soup = bs.BeautifulSoup(source.content, 'html.parser')
    cnn_paper = newspaper.build(url, memoize_articles=False)
    links = []
    for article in cnn_paper.articles:
        links.append(article.url)
    for link in links:
        if not is_live_in_url(link) or not is_av_in_url(link):
            links_to_article.append(link)
    for link in links_to_article:
        try:
            article = Article(link)
            article.download()
            article.parse()
            article.nlp()
            collection.insert_one({'title': article.title, 'source': 'BBC','link':link})
        except newspaper.article.ArticleException as e:
            print(f"Error processing article at {link}: {e}")
    links_to_article=[]
for document in collection.find({}):
    print(document)