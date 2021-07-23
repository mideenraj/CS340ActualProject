from flask import Flask, render_template, json
import os
import database.db_connector as db

# -------------------- Initialization --------------------
app = Flask(__name__)
db_connection = db.connect_to_database()


# ------------------- Routes --------------------
@app.route('/')             # Home page (Reports)
def root():
    return render_template("index.j2")

@app.route('/test')
def Customers():

    # Step 1: Write query
    query = "SELECT * FROM Customers;"

    # Step 2: Send query ('Cursor' acts as the person typing the specified command into MySQL)
    cursor = db.execute_query(db_connection=db_connection, query=query)

    # Step 3: Access result (This returns a tuple of selected rows from query)
    results = cursor.fetchall()

    print(f"My Test:\n {results}")

    # The specified file is rendered with the queried data
    return render_template("bsg.j2", bsg_people=results)

    # The specified file is rendered with the queried data





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
