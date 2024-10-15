# backend/scraping/devfolio.py

import sys
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time

def fetch_rendered_html(url):
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    # Adjust the path to chromedriver if necessary
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    try:
        driver.get(url)
        time.sleep(5)  # Allow page to load
        rendered_html = driver.page_source
    except Exception as e:
        print(f"Error fetching Devfolio page: {e}")
        rendered_html = ""
    finally:
        driver.quit()
    return rendered_html

def scrape_devfolio():
    url = 'https://devfolio.co/hackathons/open'
    html_content = fetch_rendered_html(url)
    if not html_content:
        return []

    soup = BeautifulSoup(html_content, 'html.parser')
    hackathons = []

    # Find all hackathon links
    links = soup.find_all(lambda tag: tag.name == 'a' and tag.find('h3') is not None)

    for link in links:
        hackathon = {}
        try:
            name_tag = link.find('h3')
            hackathon['name'] = name_tag.text.strip() if name_tag else "N/A"
            hackathon['link'] = link['href'] if 'href' in link.attrs else "N/A"

            # Fetch individual hackathon page
            hackathon_html = fetch_rendered_html(hackathon['link'])
            if not hackathon_html:
                hackathon['prize'] = "N/A"
                hackathon['start_date'] = "N/A"
                hackathon['location'] = "N/A"
                hackathons.append(hackathon)
                continue

            soup_i = BeautifulSoup(hackathon_html, 'html.parser')

            # Extract Prize
            divs = []
            for div in soup_i.find_all('div'):
                if div.find('h2') and div.find('h5') and not any(child.name != 'h2' and child.name != 'h5' for child in div.children):
                    divs.append(div.text)
            hackathon['prize'] = divs[0].strip("Available in Prizes") if divs else "Can't find"

            # Extract Start Date
            divs_with_only_p = []
            for div in soup_i.find_all('div'):
                if div.find('p') and not any(child.name != 'p' for child in div.children):
                    divs_with_only_p.append(div.text)

            runs_from_element = None
            for element in divs_with_only_p:
                if element.startswith("Runs"):
                    runs_from_element = element
                    break
            if runs_from_element:
                runs_from_date = runs_from_element.split("Runs from")[-1].strip()
                hackathon['start_date'] = runs_from_date
            else:
                hackathon['start_date'] = "Can't find"

            # Extract Location
            happening = None
            for element in divs_with_only_p:
                if element[0:9]=="Happening":
                    happening = element
                    break
            if happening:
                location = happening.split("Happening")[-1].strip()
                hackathon['location'] = location
            else:
                hackathon['location'] = "Can't find"

            hackathons.append(hackathon)
        except Exception as e:
            print(f"Error scraping Devfolio hackathon: {e}")
            continue

    return hackathons