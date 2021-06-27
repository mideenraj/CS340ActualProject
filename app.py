from flask import Flask, render_template, json
import os
import database.db_connector as db

# -------------------- Initialization --------------------
app = Flask(__name__)
db_connection = db.connect_to_database()


# ------------------- Routes --------------------
@app.route('/')
def root():
    return render_template("main.j2")

@app.route('/bsg-people')
def bsg_people():
    # The actual query...
    query = "SELECT * FROM bsg_people;"

    # Cursor acts as the person typing the specified command into MySQL
    cursor = db.execute_query(db_connection=db_connection, query=query)

    # This returns a tuple of rows from query
    results = cursor.fetchall()

    # The specified file is rendered with the queried data
    return render_template("bsg.j2", bsg_people=results)






# -------------------- Listener --------------------
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 1027))
    app.run(port=port, debug=True)
