import sqlite3

accepted_confirmations = ["yes", "y"]

# def create_connection(db_file, return_cursor=False):
#     """ 
#     create a database connection to the SQLite database
#         specified by db_file

#     :param db_file: database file
#     :return: Connection object or None
#     """

#     conn = sqlite3.connect(db_file)

#     if return_cursor:
#         return conn, conn.cursor()
#     return conn

def create_mailing_list_table(conn):
    # Mailing list table
    conn.cursor().execute('''CREATE TABLE IF NOT EXISTS mailing_list (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL,
                    opt_in INTEGER,
                    signup_timestamp INTEGER
                    )''')
    
    conn.commit()

def create_contact_requests_table(conn):
    # Contact requests
    conn.cursor().execute('''CREATE TABLE IF NOT EXISTS contact_requests (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    subject TEXT NOT NULL,
                    full_name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    message TEXT NOT NULL,
                    timestamp INTEGER
                    )''')
    
    conn.commit()

def truncate_table(conn, table_name, rows=None):
    cursor = conn.cursor()

    try:
        if rows is None:
            confirm = input(f"Are you sure you want to delete all rows of table {table_name}? Input YES or Y to proceed.\n")
            confirm = confirm.lower()
            if confirm not in accepted_confirmations:
                return 
            
            # If rows is not provided, truncate all rows from the table
            cursor.execute(f'DELETE FROM {table_name};')
        else:
            start, end = rows
            confirm = input(f"Are you sure you want to delete rows {start}-{end} of table {table_name}? Input YES or Y to proceed.\n")
            confirm = confirm.lower()
            if confirm not in accepted_confirmations:
                return 
            # Truncate specified number of rows from the table
            # cursor.execute(f'DELETE FROM {table_name} WHERE rowid IN (SELECT rowid FROM {table_name} LIMIT ?);', (rows,))

            start = start or min(cursor.execute(f'SELECT MIN(rowid) FROM {table_name};').fetchone())
            end = end or max(cursor.execute(f'SELECT MAX(rowid) FROM {table_name};').fetchone())


            cursor.execute(f'DELETE FROM {table_name} WHERE rowid BETWEEN ? AND ?;', (start, end))


        # Commit the changes and close the connection
        conn.commit()
        conn.close()

        return True

    except Exception as e:
        # Handle any exceptions that may occur
        print(f'Error truncating table: {e}')
        return False


"""
python3 ./assets/py/db_util.py
"""
def main():
    conn = sqlite3.connect("./db/user_data.sqlite3")

    # Initialize DBs for user_data
    create_mailing_list_table(conn)
    create_contact_requests_table(conn)

if __name__ == '__main__':
    main()

