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

    # **Need to insert logic for populating report tables here

    # Step x: Render HomePage
    return render_template("index.j2")

# Route 2: 'Customers' subpage
@app.route('/customers')
def load_customers():

    # Step 1: Write query
    query = "SELECT * FROM Customers;"

    # Step 2: Send query ('Cursor' acts as the person typing the specified command into MySQL)
    cursor = db.execute_query(db_connection=db_connection, query=query)

    # Step 3: Access result (This returns a tuple of selected rows from query)
    results = cursor.fetchall()
    payload = []
    payload.append(results)

    # Step 4: Print query results if Debugging
    debug = False
    if debug:
        print("\n")
        print(f"Type:{type(results)}")
        print(f"Length: {len(results)}")
        print("Result:")
        for row in results:
            print(row)

    # Step 5: The specified file is rendered with the queried data
    return render_template("customers_subpage.j2", customer_data=payload)


# Route 3: 'Orders' subpage
@app.route('/orders')
def load_orders():
    # ***NEED TO IMPLEMENT***
    pass


# Route 4: 'Products' subpage
@app.route('/products')
def load_products():

    # Step 1: Write query
    query = "SELECT * FROM Products;"

    # Step 2: Send query ('Cursor' acts as the person typing the specified command into MySQL)
    cursor = db.execute_query(db_connection=db_connection, query=query)

    # Step 3: Access result (This returns a tuple of selected rows from query)
    results = cursor.fetchall()
    payload = []
    payload.append(results)

    # Step 4: Print query results if Debugging
    debug = False
    if debug:
        print("\n")
        print(f"Type:{type(results)}")
        print(f"Length: {len(results)}")
        print("Result:")
        for row in results:
            print(row)

    # Step 5: The specified file is rendered with the queried data
    return render_template("products_subpage.j2", product_data=payload)


# Route 5: 'Departments' subpage
@app.route('/departments')
def load_departments():

    # Step 1: Write query
    query = "SELECT * FROM Departments;"

    # Step 2: Send query ('Cursor' acts as the person typing the specified command into MySQL)
    cursor = db.execute_query(db_connection=db_connection, query=query)

    # Step 3: Access result (This returns a tuple of selected rows from query)
    results = cursor.fetchall()
    payload = []
    payload.append(results)

    # Step 4: Print query results if Debugging
    debug = False
    if debug:
        print("\n")
        print(f"Type:{type(results)}")
        print(f"Length: {len(results)}")
        print("Result:")
        for row in results:
            print(row)

    # Step 5: The specified file is rendered with the queried data
    return render_template("departments_subpage.j2", department_data=payload)







# -------------------- Listener --------------------
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 1027))
    app.run(port=port, debug=True)
