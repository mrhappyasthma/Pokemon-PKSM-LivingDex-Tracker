import json
import os
import re
import requests
from datetime import date
from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/')
def homepage():
  if request.environ['HTTP_HOST'].endswith('.appspot.com'):  #Redirect the appspot url to the custom url
    return '<meta http-equiv="refresh" content="0; url=https://livingdextracker.com" />'
  else:
    template_values = {
      'page_title' : "Living Dex Tracker",
      'current_year' : date.today().year,
    }
    return render_template('home.html', **template_values)

@app.route('/fetchimages', methods=['POST'])
def fetchImages():
  if request.environ['HTTP_HOST'].endswith('.appspot.com'):  #Redirect the appspot url to the custom url
    return '<meta http-equiv="refresh" content="0; url=https://livingdextracker.com" />'
  else:
    response = requests.get('https://bulbapedia.bulbagarden.net/w/api.php?action=parse&prop=text&format=json&page=List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number')
    j = json.loads(response.content)
    text = j.get('parse', {}).get('text', '{}').get('*', '')
    results = re.findall(r'<img alt="(.+)" src="//(archives\.bulbagarden.net/media/upload/.+\.png)"', text)
    return json.dumps(dict(results))

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)