📅 Smart Event Planner

A smart and user-friendly web application designed to simplify event planning and management. It allows users to create, organize, and track events efficiently with an intuitive interface and structured workflow.

🚀 Features
- Create, update, and delete events
- Event scheduling with date & time management
- User-friendly dashboard for event overview
- Event categorization and filtering
- Real-time updates for event changes
- Secure authentication system (if implemented)
  
🛠️ Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Django (Python)
- Database: MySQL / SQLite (based on setup)
- Tools: Git, GitHub, VS Code

⚙️ Installation & Setup
# Clone the repository
git clone https://github.com/Pranav6305/smart_event_planner.git

# Move into project directory
cd smart_event_planner

# Create virtual environment
python -m venv venv

# Activate environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver

🎯 Future Improvements
- Email notifications for events
- Calendar integration (Google Calendar sync)
- Mobile responsive UI improvements
- AI-based event suggestions
