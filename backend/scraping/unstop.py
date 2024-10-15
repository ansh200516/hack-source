# backend/scraping/unstop.py

import sys
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time

def setup_driver():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    return driver

def scrape_unstop_hackathons(url):
    driver = setup_driver()
    try:
        driver.get(url)
        time.sleep(5)  # Allow page to load

        hackathon_details = []

        # Infinite scroll to load more hackathons dynamically if needed
        last_height = driver.execute_script("return document.body.scrollHeight")
        
        while True:
            # Find all hackathon cards based on XPath
            hackathon_cards = driver.find_elements(By.XPATH, "//div[contains(@class, 'user_img opp_content')]")
            
            # Loop through each card and extract information
            for card in hackathon_cards:
                try:
                    # Scroll the card into view
                    driver.execute_script("arguments[0].scrollIntoView(true);", card)
                    time.sleep(1)  # Allow scrolling animation
                    
                    # Extract hackathon title
                    title = card.find_element(By.XPATH, ".//h2[@class='double-wrap']").text
                    
                    # Extract institution
                    institution = card.find_element(By.XPATH, ".//p").text
                    
                    # Extract prize (if available)
                    prize_element = card.find_elements(By.XPATH, ".//div[contains(@class, 'prize')]")
                    if prize_element:
                        prize = prize_element[0].text.split('\n')[1].strip()
                        # Add rupee symbol
                        prize = "₹" + prize
                    else:
                        prize = "N/A"
                    
                    # Extract days left (if available)
                    days_left_elements = card.find_elements(By.XPATH, ".//div[contains(@class, 'seperate_box') and contains(., 'days left')]")
                    if days_left_elements:
                        days_left = days_left_elements[0].text.split('\n')[0].strip()
                    else:
                        days_left = "N/A"
                    driver.execute_script("arguments[0].click();", card)
                    time.sleep(1)
                    link_elements = driver.find_elements(By.XPATH, ".//a[ \
                        contains(concat(' ', normalize-space(@class), ' '), ' register_btn ') and \
                        contains(concat(' ', normalize-space(@class), ' '), ' cursor ') and \
                        contains(concat(' ', normalize-space(@class), ' '), ' waves-effect ') and \
                        contains(concat(' ', normalize-space(@class), ' '), ' ng-star-inserted ') \
                    ]")
                    if link_elements:
                        link = link_elements[0].get_attribute('href')
                        # Prepend base URL if necessary
                        if link.startswith('/'):
                            link = 'https://unstop.com' + link
                    else:
                        link = 'N/A'
                    
                    # Append hackathon details to list
                    hackathon_details.append({
                        'title': title,
                        'institution': institution,
                        'prize': prize,
                        'days_left': days_left,
                        'link': link
                    })
                    
                except Exception as e:
                    print(f"Error scraping card: {e}")
                    continue
            
            # Scroll down to load more cards if available
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(3)  # Wait for the page to load more content

            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

    except Exception as e:
        print(f"Error during Unstop scraping: {e}")
    finally:
        driver.quit()

    return hackathon_details