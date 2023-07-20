import json
import os
import sqlite3
import sys

from flask import Flask, request, jsonify
from flask_cors import CORS

from util import uts

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
flask --app ./assets/py/user_data.py --debug run 
"""

@app.route('/save_contact_request', methods=['POST'])
def save_contact_request():
    # We save contact requests to the database by default
    # Unlikely to change later; JSON was only for early testing
    save_db = True 
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # form data
        subject = request.form.get('contact-request-subject')
        full_name = request.form.get('contact-request-name')
        email = request.form.get('contact-request-email')
        message = request.form.get('contact-request-message')
        timestamp = uts()


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
            'success': True
        })
    
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': f'Error trying to upload contact request: {e}'
        })

@app.route('/save_mlist', methods=['POST'])
def save_mlist():

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # form data
        email = request.form.get('email')
        opt_in = 1
        signup_timestamp = uts()

        # upload to db
        cursor.execute('''INSERT INTO mailing_list (
                        email, opt_in, signup_timestamp
                        ) VALUES (?, ?, ?)''',
                        (email, opt_in, signup_timestamp))
        conn.commit()

        return jsonify({
            'success': True
        })
    
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': f'Error trying to upload contact request: {e}'
        })

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
