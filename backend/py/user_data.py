import html
import json
import os
import sqlite3
import sys

from flask import Flask, request, jsonify
from flask_cors import CORS

from util import unix_ts, sanitize_inputs
from db_util import load_character_limits

# Custom Flask class for running functions before app
# class FlaskMod(Flask):
#     def run(self, host=None, port=None, debug=None, load_dotenv=True, **options):
#         if not self.debug:
#             with self.app_context():
#                 initialize()
#         super(FlaskMod, self).run(host=host, port=port, debug=debug, load_dotenv=load_dotenv, **options)

DB_PATH = "./db/user_data.sqlite3"

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests for all routes

"""
flask --app ./backend/py/user_data.py --debug run 
"""

@app.route('/save_contact_request', methods=['POST'])
def save_contact_request():
    # load char limit configs
    character_limits = load_character_limits()

    # sanitize input
    cleaned_form = sanitize_inputs(request.form)

    # We save contact requests to the database by default
    # Unlikely to change later; JSON was only for early testing
    save_db = True 

    try:
        # connect to db
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # read form data from request
        subject =   cleaned_form.get('contact-request-subject')
        full_name = cleaned_form.get('contact-request-name')
        email =     cleaned_form.get('contact-request-email').lower()
        message =   cleaned_form.get('contact-request-message')

        # force character limits in case user attempts to modify js scripts
        subject =   subject[:character_limits["contact_requests"]["subject"]]
        full_name = full_name[:character_limits["contact_requests"]["name"]]
        email =     email[:character_limits["contact_requests"]["email"]]
        message =   message[:character_limits["contact_requests"]["message"]]

        # get current unix timestamp
        timestamp = unix_ts()


        if save_db:
            # Save the data to the database

            cursor.execute('''INSERT INTO contact_requests (
                                subject, full_name, email, message, timestamp
                              ) VALUES (?, ?, ?, ?, ?)''',
                           (subject, full_name, email, message, timestamp))
            conn.commit()

        else:
            # Save the data to a JSON file
            data = {
                'subject': subject,
                'full_name': full_name,
                'email': email,
                'message': message,
            }

            output_dir = './outputs/contact_requests/'
            os.makedirs(output_dir, exist_ok=True)

            filename = f'{timestamp}.json'
            output_file = os.path.join(output_dir, filename)
            with open(output_file, 'w') as file:
                json.dump(data, file, indent=4)

        return jsonify({
            'status': 'ok'
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error trying to upload contact request: {e}'
        })
    
    finally:
        conn.close()

@app.route('/save_mailing_list', methods=['POST'])
def save_mailing_list():
    # load char limit configs
    character_limits = load_character_limits()

    # sanitize inputs
    cleaned_form = sanitize_inputs(request.form)

    try:
        # connect to db
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # gather form data (email addr, opt in, signup time)
        email = cleaned_form.get('mailing-list-email').lower()
        opt_in = 1
        signup_timestamp = unix_ts()

        # force character limits in case user attempts to modify js scripts
        email = email[:character_limits["mailing_list"]["email"]]

        # Check if the email already exists in the db
        cursor.execute("SELECT email FROM mailing_list WHERE email=?", (email,))
        existing_email = cursor.fetchone()

        if existing_email:
            # Email already exists
            return jsonify({
                'status': 'already_exists'
            })
        
        else:
            # Insert the new entry into the db
            cursor.execute('''INSERT INTO mailing_list (
                            email, opt_in, signup_timestamp
                            ) VALUES (?, ?, ?)''',
                            (email, opt_in, signup_timestamp))
            conn.commit()

            return jsonify({
                'status': 'ok'
            })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': e
        })
    
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
