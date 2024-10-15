# backend/scraping/test_devfolio.py

from devfolio import scrape_devfolio

if __name__ == "__main__":
    data = scrape_devfolio()
    for hack in data:
        print(hack)