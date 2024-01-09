import sys
import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import re

def clean_folder_name(url):
    match = re.search(r'^(https?://)?(www\d?\.)?(?P<domain>[\w.-]+)', url)
    if match:
        domain = match.group('domain')
        cleaned_domain = re.sub(r'[^a-zA-Z0-9._-]', '', domain.replace(".", ""))
        return cleaned_domain
    else:
        return None

def download_page(url, file_path):
    response = requests.get(url)
    if response.status_code == 200:
        with open(file_path, 'wb') as f:
            f.write(response.content)

def download_site(url, folder_path):
    download_page(url, os.path.join(folder_path, 'index.html'))
    page = requests.get(url).text
    soup = BeautifulSoup(page, 'html.parser')

    for css_link in soup.find_all('link', rel='stylesheet'):
        if 'href' in css_link.attrs:
            css_url = urljoin(url, css_link['href'])
            if css_url.endswith('.css'):
                css_file_name = os.path.basename(css_url)
                css_file_name = re.sub(r'[^a-zA-Z0-9._-]', '', css_file_name)
                download_page(css_url, os.path.join(folder_path, css_file_name))

    index_html_link = None
    for a in soup.find_all('a', href=True):
        link = a.get('href')
        if link.endswith('index.html'):
            index_html_link = urljoin(url, link)
            break

    if index_html_link:
        index_html_file_name = 'index.html'
        download_page(index_html_link, os.path.join(folder_path, index_html_file_name))

# コマンドライン引数からURLを取得
url = sys.argv[1]

# URLからフォルダ名をクリーンアップ
folder_name = clean_folder_name(url)

# 一時フォルダ内にフォルダを作成
temp_dir = 'rewinmass/service/proxy/temp'
folder_path = os.path.join(temp_dir, folder_name)
os.makedirs(folder_path, exist_ok=True)

# サイトをダウンロード
download_site(url, folder_path)

print(folder_name)