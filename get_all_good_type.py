import requests
from bs4 import BeautifulSoup
import json

url = 'https://buff.163.com/market/csgo'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}

try:
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')

    data = {}
    # 查找特定 div 下的元素
    for div in soup.find_all('div', class_='item w-SelType csgo_filter'):
        # 查找 i 元素
        i_element = div.find('i')
        subType = {}
        # 查找 li 元素
        for li in div.find_all('li'):
            value = li.get('value')
            text = li.get_text(strip=True)
            subType[value] = text
        if i_element:
            p_element = div.find('p')
            if p_element:
                value = p_element.get('value')
                text = p_element.get_text(strip=True)
                data[value] = {
                    "text": text,
                    "subType": subType
                }

    # 将数据写入文件
    with open('./src/buff/itemTypes.js', 'w', encoding='utf-8') as f:
        f.write("export default ")
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("数据已成功写入文件")

except requests.RequestException as e:
    print(f"请求出错: {e}")
except Exception as e:
    print(f"发生错误: {e}")