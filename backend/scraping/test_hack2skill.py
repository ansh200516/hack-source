# backend/scraping/test_hack2skill.py

from hack2skill import scrape_hack2skill

if __name__ == "__main__":
    data = scrape_hack2skill()
    for hack in data:
        print(hack)