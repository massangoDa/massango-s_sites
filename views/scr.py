import sys
import os
import requests
from bs4 import BeautifulSoup

# コマンドライン引数からURLを取得
url = sys.argv[1]
folder_name = url.replace("/", "_")  # URLからフォルダ名を作成

# 一時フォルダ内にフォルダを作成
temp_dir = 'temp'
folder_path = os.path.join(temp_dir, folder_name)
os.makedirs(folder_path, exist_ok=True)

# 指定されたURLからページを取得し、そのコンテンツをダウンロードして保存
def download_page(url, file_path):
    response = requests.get(url)
    if response.status_code == 200:
        with open(file_path, 'wb') as f:
            f.write(response.content)

# 指定したURLからリンクを取得し、それらのリンクを再帰的にダウンロード
def download_site(url, folder_path):
    download_page(url, os.path.join(folder_path, 'index.html'))
    page = requests.get(url).text
    soup = BeautifulSoup(page, 'html.parser')
    links = [a.get('href') for a in soup.find_all('a', href=True)]

    for link in links:
        if link.startswith('http') or link.startswith('https'):
            subfolder_name = link.replace("/", "_")
            subfolder_path = os.path.join(folder_path, subfolder_name)
            os.makedirs(subfolder_path, exist_ok=True)
            download_site(link, subfolder_path)

download_site(url, folder_path)
print('Python script execution completed.')
