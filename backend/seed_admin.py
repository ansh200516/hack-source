# backend/seed_admin.py

from sqlalchemy.orm import sessionmaker
from models import Base, User
from app import engine  # Ensure that engine is correctly imported
import sys

def seed_admin():
    Session = sessionmaker(bind=engine)
    session = Session()

    admin_username = 'ansh'  # Desired admin username
    admin_password = 'ansh201661'  # Desired admin password

    # Check if admin already exists
    existing_admin = session.query(User).filter_by(username=admin_username).first()
    if existing_admin:
        print(f"Admin user '{admin_username}' already exists.")
        sys.exit(0)

    # Create new admin user
    admin = User(username=admin_username, role='admin')
    admin.set_password(admin_password)

    session.add(admin)
    session.commit()
    print(f"Admin user '{admin_username}' created successfully.")

if __name__ == '__main__':
    seed_admin()