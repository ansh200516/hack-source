# backend/scraping/test_devpost.py

from devpost import scrape_devpost

if __name__ == "__main__":
    data = scrape_devpost()
    for hack in data:
        print(hack)