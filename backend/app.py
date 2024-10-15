# backend/app.py

from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from scraping import scrape_devpost, scrape_devfolio, scrape_unstop_hackathons, scrape_hack2skill
from apscheduler.schedulers.background import BackgroundScheduler
import threading
import time
import datetime
import logging
from models import Base, User, Hackathon  # Import all models
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    filename='scraping.log',
    filemode='a',
    format='%(asctime)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, expose_headers=["Authorization"], supports_credentials=True)
api = Api(app)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'default_secret_key')  # Use environment variable
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=1)
jwt = JWTManager(app)

# Database setup
engine = create_engine('sqlite:///hackathons.db')
Base.metadata.create_all(engine)  # Creates both 'users' and 'hackathons' tables
Session = sessionmaker(bind=engine)
session = Session()

# Scraping Function
def scrape_all_sources():
    logging.info("Starting scraping process...")
    print("Starting scraping process...")
    
    # Clear existing data
    session.query(Hackathon).delete()
    session.commit()

    try:
        # Scrape Devpost
        logging.info("Scraping Devpost...")
        print("Scraping Devpost...")
        devpost_data = scrape_devpost()
        for hack in devpost_data:
            hackathon = Hackathon(
                source="Devpost",
                title=hack.get('title', "N/A"),
                description=hack.get('description', "N/A"),
                deadline=hack.get('deadline', "N/A"),
                prize=hack.get('prize', "N/A"),
                location=hack.get('location', "N/A"),
                registration_link=hack.get('registration_link', "N/A")
            )
            session.add(hackathon)

        # Scrape Devfolio
        logging.info("Scraping Devfolio...")
        print("Scraping Devfolio...")
        devfolio_data = scrape_devfolio()
        for hack in devfolio_data:
            hackathon = Hackathon(
                source="Devfolio",
                title=hack.get('name', "N/A"),
                description="N/A",  # Add if available
                deadline="N/A",      # Add if available
                prize=hack.get('prize', "N/A"),
                location=hack.get('location', "N/A"),
                registration_link=hack.get('link', "N/A"),
                start_date=hack.get('start_date', "N/A")
            )
            session.add(hackathon)

        # Scrape Unstop
        logging.info("Scraping Unstop...")
        print("Scraping Unstop...")
        unstop_url = "https://unstop.com/hackathons?oppstatus=open&category=data%20science:programming"
        unstop_data = scrape_unstop_hackathons(unstop_url)
        for hack in unstop_data:
            hackathon = Hackathon(
                source="Unstop",
                title=hack.get('title', "N/A"),
                description="N/A",  # Add if available
                deadline="N/A",      # Add if available
                prize=hack.get('prize', "N/A"),
                location=hack.get('location', "N/A"),
                registration_link=hack.get('link',"N/A"),  # Add if available
                institution=hack.get('institution', "N/A"),
                days_left=hack.get('days_left', "N/A")
            )
            session.add(hackathon)

        # Scrape Hack2skill
        logging.info("Scraping Hack2skill...")
        print("Scraping Hack2skill...")
        hack2skill_data = scrape_hack2skill()
        for hack in hack2skill_data:
            hackathon = Hackathon(
                source="Hack2skill",
                title=hack.get('name', "N/A"),
                description=hack.get('description', "N/A"),
                deadline=hack.get('register before', "N/A"),
                prize="N/A",  # Add if available
                location=hack.get('mode', "N/A"),
                registration_link=hack.get('link', "N/A")
            )
            session.add(hackathon)

        session.commit()
        logging.info("Scraping process completed.")
        print("Scraping process completed.")
    except Exception as e:
        logging.error(f"Error during scraping: {e}")
        print(f"Error during scraping: {e}")

# API Resources
class HackathonList(Resource):
    def get(self, source=None):
        if source:
            hackathons = session.query(Hackathon).filter_by(source=source).all()
        else:
            hackathons = session.query(Hackathon).all()
        result = []
        for hack in hackathons:
            hack_data = {
                'id': hack.id,
                'source': hack.source,
                'title': hack.title,
                'description': hack.description,
                'deadline': hack.deadline,
                'prize': hack.prize,
                'location': hack.location,
                'registration_link': hack.registration_link,
                'institution': hack.institution,
                'days_left': hack.days_left,
                'mode': hack.mode,
                'start_date': hack.start_date,
                'featured': hack.featured  # Include featured status
            }
            result.append(hack_data)
        return jsonify(result)
api.add_resource(HackathonList, '/api/hackathons', '/api/hackathons/<string:source>')
# Authentication Routes
class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return {'message': 'Username and password are required.'}, 400

        user = session.query(User).filter_by(username=username).first()
        if not user or not user.check_password(password):
            return {'message': 'Invalid username or password.'}, 401

        additional_claims = {"role": user.role}
        access_token = create_access_token(identity=user.id, additional_claims=additional_claims)

        return {
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'role': user.role
            }
        }, 200

api.add_resource(Login, '/api/login')

# Example: Protected Route for Admin to Toggle Featured Hackathon
# backend/app.py

class ToggleFeatured(Resource):
    @jwt_required()
    def post(self, hackathon_id):
        try:
            user_id = get_jwt_identity()
            user = session.query(User).filter_by(id=user_id).first()

            if not user:
                logging.warning(f"User with ID {user_id} not found.")
                return {'message': 'User not found.'}, 404

            if user.role != 'admin':
                logging.warning(f"User '{user.username}' with role '{user.role}' attempted to toggle featured status.")
                return {'message': 'Admin privilege required.'}, 403

            hackathon = session.query(Hackathon).filter_by(id=hackathon_id).first()
            if not hackathon:
                logging.warning(f"Hackathon with ID {hackathon_id} not found.")
                return {'message': 'Hackathon not found.'}, 404

            # Toggle the 'featured' status
            hackathon.featured = 1 if hackathon.featured == 0 else 0
            session.commit()

            logging.info(f"Hackathon '{hackathon.title}' featured status toggled to {hackathon.featured} by user '{user.username}'.")
            return {'featured': hackathon.featured}, 200

        except Exception as e:
            logging.error(f"Error toggling featured status for hackathon ID {hackathon_id}: {e}")
            return {'message': 'An error occurred while toggling featured status.'}, 500

# Add the resource to the API
api.add_resource(ToggleFeatured, '/api/hackathons/<int:hackathon_id>/toggle-featured')
# Scheduler Setup
def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(scrape_all_sources, 'interval', days=1, next_run_time=datetime.datetime.now())
    scheduler.start()
    logging.info("Scheduler started. Scraping will run daily.")
    print("Scheduler started. Scraping will run daily.")

    try:
        while True:
            time.sleep(2)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
        logging.info("Scheduler shut down.")
        print("Scheduler shut down.")

if __name__ == '__main__':
    # Start the scheduler in a separate thread
    scheduler_thread = threading.Thread(target=start_scheduler)
    scheduler_thread.start()

    # Run the Flask app
    app.run(debug=True, use_reloader=False, port=5213)