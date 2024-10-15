# backend/scraping/test_unstop.py

from unstop import scrape_unstop_hackathons

if __name__ == "__main__":
    url = "https://unstop.com/hackathons?oppstatus=open&category=data%20science:programming"
    data = scrape_unstop_hackathons(url)
    for hack in data:
        print(hack)