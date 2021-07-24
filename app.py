from flask import Flask, render_template, json
import os
import database.db_connector as db

# -------------------- Initialization --------------------
app = Flask(__name__)
db_connection = db.connect_to_database()


# ------------------- Routes --------------------

# Route 1: Home page (aka 'Reports')
@app.route('/')
def root():

    # Need to insert logic for populating report tables here

    return render_template("index.j2")

# Route 2: 'Customers' subpage
@app.route('/customers')
def Customers():

    # Step 1: Write query
    query = "SELECT * FROM Customers;"

    # Step 2: Send query ('Cursor' acts as the person typing the specified command into MySQL)
    cursor = db.execute_query(db_connection=db_connection, query=query)

    # Step 3: Access result (This returns a tuple of selected rows from query)
    results = cursor.fetchall()

    # Debugging
    """"""
    print("\n")
    print(f"Type:{type(results)}")
    print(f"Length: {len(results)}")
    print("Result:")
    for row in results:
        print(row)

    # The specified file is rendered with the queried data
    return render_template("customer_subpage.j2", customer_data=results)

    # The specified file is rendered with the queried data







# -------------------- Listener --------------------
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 1027))
    app.run(port=port, debug=True)
