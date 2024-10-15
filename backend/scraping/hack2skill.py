# backend/scraping/hack2skill.py

import sys
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time

def fetch_rendered_html(url):
    options = Options()
    options.add_argument('--headless')  # Run in headless mode
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    try:
        driver.get(url)
        time.sleep(5)  # Wait for the page to fully render
        rendered_html = driver.page_source
    except Exception as e:
        print(f"Error fetching Hack2skill page: {e}")
        rendered_html = ""
    finally:
        driver.quit()
    return rendered_html

def scrape_hack2skill():
    url = "https://hack2skill.com/#ongoin-initiatives"
    html_content = fetch_rendered_html(url)
    if not html_content:
        return []

    soup = BeautifulSoup(html_content, 'html.parser')
    details = []
    links = []

    # Extract all relevant links
    for a_tag in soup.find_all('a', class_='text-link'):
        if not a_tag.find_all(True):
            links.append(a_tag['href'])

    # Extract hackathon details
    card_bodies = soup.find_all('div', class_='card-body')
    for i, card in enumerate(card_bodies):
        hackathon = {}
        try:
            # Extract and clean text
            curr = [x.strip() for x in card.get_text(separator='\n').strip().split('\n') if x.strip()]
            hackathon['name'] = curr[0] if len(curr) > 0 else "Can't find"
            hackathon['description'] = curr[1] if len(curr) > 1 else "Can't find"
            hackathon['register before'] = curr[3] if len(curr) > 3 else "Can't find"
            hackathon['mode'] = curr[7] if len(curr) > 7 else "Can't find"
            hackathon['link'] = links[i] if i < len(links) else "Can't find"

            # Define AI/ML-related keywords
            ai_ml_keywords = [
                'AI', 'Artificial Intelligence', 'Machine Learning', 'ML', 'Deep Learning',
                'Neural Network', 'Computer Vision', 'Natural Language Processing', 'NLP',
                'Data Science', 'AI/ML', 'AI & ML', 'AI-ML'
            ]
            pattern = re.compile(r'\b(' + '|'.join(ai_ml_keywords) + r')\b', re.IGNORECASE)

            # Combine name and description for keyword searching
            combined_text = f"{hackathon['name']} {hackathon['description']}"

            # Check if any AI/ML keyword is present AND link is valid
            if pattern.search(combined_text) and hackathon['link'] != "Can't find":
                details.append(hackathon)
        
        except Exception as e:
            print(f"Error scraping Hack2skill hackathon card: {e}")
            continue

    return details