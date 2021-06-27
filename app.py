from flask import Flask, render_template, json
import os
import database.db_connector as db

# Configuration

app = Flask(__name__)
db_connection = db.connect_to_database()

# Routes 

@app.route('/')
def root():
    return render_template("main.j2")

@app.route('/bsg-people')
def bsg_people():
    query = "SELECT * FROM bsg_people;"
    # Cursor acts as the person typing the specified command into MySQL
    cursor = db.execute_query(db_connection=db_connection, query=query)
    results = cursor.fetchall()     # I think this is a list of
    print(type(results))
    return render_template("bsg.j2", bsg_people=results)

# Listener

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 1027))
    app.run(port=port, debug=True)


# more testing stuff
