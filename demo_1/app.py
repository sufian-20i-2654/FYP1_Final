from flask import Flask, request, jsonify
from flask_cors import CORS
import bs4 as bs
import requests
import newspaper
from newspaper import Article
import nltk
from pymongo import MongoClient
import re
nltk.download('punkt')
import requests

app = Flask(__name__)
CORS(app) 

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
@app.route('/submit-data', methods=['POST'])


def submit_data():
    data = request.get_json()

    selected_image_url = data.get('selectedImageName', '') + '.png'
    selected_back_url = data.get('selectedBackName', '') + '.jpg'
    keyword = data.get('userText', '').strip()
    url_text = data.get('urlText', '')
    lang_name = data.get('selectedlangName', '') 

    print(f"Selected Image Name: {selected_image_url}")
    print(f"Selected Back Name: {selected_back_url}")
    print(f"Keyword: {keyword}")
    print(f"User URL: {url_text}")
    print(f"Language: {lang_name}")

    client = MongoClient('localhost', 27017)
    db = client.article_data1
    collection = db.cnn
    collection2 = db.bbc
    collection3 = db.geo

    user_text = re.split(r'\s+', keyword)

    # Use sets to avoid duplicates
    titles_and_links = {
        'CNN': {'titles': set(), 'links': set()},
        'BBC': {'titles': set(), 'links': set()},
        'GEO': {'titles': set(), 'links': set()}
    }

    for kw in user_text:
        query = {"title": {"$regex": kw, "$options": "i"}}
        articles = collection.find(query)
        for article in articles:
            titles_and_links['CNN']['titles'].add(article.get('title', ''))
            titles_and_links['CNN']['links'].add(article.get('link', ''))

    for kw in user_text:
        query = {"title": {"$regex": kw, "$options": "i"}}
        articles = collection2.find(query)
        for article in articles:
            titles_and_links['BBC']['titles'].add(article.get('title', ''))
            titles_and_links['BBC']['links'].add(article.get('link', ''))

    for kw in user_text:
        query = {"title": {"$regex": kw, "$options": "i"}}
        articles = collection3.find(query)
        for article in articles:
            titles_and_links['GEO']['titles'].add(article.get('title', ''))
            titles_and_links['GEO']['links'].add(article.get('link', ''))

    response_data = {'message': 'Data received successfully', 'articles': []}
    
    # Convert sets back to lists and add them to response_data
    for source, data in titles_and_links.items():
        titles = list(data['titles'])
        links = list(data['links'])
        for title, link in zip(titles, links):
            response_data['articles'].append({'title': title, 'link': link, 'source': source})

    return jsonify(response_data)


@app.route('/fetch-article', methods=['POST'])
def fetch_article():
    data = request.get_json()
    print(data)
    article_link = data.get('links', '')
    print(article_link)

    articles_content = []

    for link in article_link:
        try:
            article = Article(link)
            article.download()
            article.parse()
            cleaned_text = article.text.replace('\n', '')
            cleaned_text = cleaned_text.replace('CNN', '')
            articles_content.append({
                'link': link,
                'title': article.title,
                'text': cleaned_text
            })
            print(cleaned_text)
            ngrok_public_url = 'https://c9db-104-197-74-102.ngrok-free.app/process-input'
            response = requests.get(ngrok_public_url, json={'context': cleaned_text})
            if response.status_code == 200:
                response.text = response.text.replace('\n', '').strip()
                response.text = response.text.replace('result:', '').strip()
                response.text = response.text.replace('1. Introduction:', '').strip()
                response.text = response.text.replace('2. Body', '').strip()
                response.text = response.text.replace('3. Conclusion:', '').strip()
                return jsonify({'message': response.text})
            else:
                return jsonify({'error': f'Error sending data to ngrok: {response.text}'})

             
        except Exception as e:
            print(f"Failed to process article at {link}: {e}")
    

    return jsonify({'message': 'Articles fetched successfully', 'articles': articles_content})

@app.route('/edited-text', methods=['POST'])
def handle_edited_text():
    edited_text = request.json.get('editedText')
    print(f"Received edited text: {edited_text}")
    return "Text received successfully"

if __name__ == '__main__':
    app.run(debug=True)