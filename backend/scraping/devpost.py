# backend/scraping/devpost.py

import requests
from bs4 import BeautifulSoup

def scrape_devpost():
    url = "https://devpost.com/c/artificial-intelligence"
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching Devpost page: {e}")
        return []

    soup = BeautifulSoup(response.text, 'lxml')

    hackathons = []
    for item in soup.find_all('a', class_="clearfix"):
        try:
            title_tag = item.find('h5', class_='title')
            description_tag = item.find('p', class_='challenge-description')
            deadline_tags = item.find_all('p', class_='challenge-date')
            location_tags = item.find_all('p', class_='challenge-location')
            registration_link = item.get('href', "N/A")

            title = title_tag.text.strip() if title_tag else "N/A"
            description = description_tag.text.strip() if description_tag else "N/A"

            # Assuming the second 'challenge-date' is the deadline
            if len(deadline_tags) > 1:
                deadline_text = deadline_tags[1].text
                deadline = deadline_text.split('\n')[1].replace("Deadline:","") if '\n' in deadline_text else deadline_text
            else:
                deadline = "N/A"

            # Assuming the first 'challenge-date' is the prize
            prize = deadline_tags[0].text.strip() if len(deadline_tags) > 0 else "N/A"

            # Assuming the second 'challenge-location' is the location
            if len(location_tags) > 1:
                location = location_tags[1].text.strip()
            else:
                location = "N/A"

            hackathon = {
                'title': title,
                'description': description,
                'deadline': deadline,
                'prize': prize,
                'location': location,
                'registration_link': registration_link
            }
            hackathons.append(hackathon)
        except Exception as e:
            print(f"Error parsing a Devpost hackathon: {e}")
            continue

    return hackathons