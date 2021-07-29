from flask import Flask, render_template, json, request
import os
import database.db_connector as db

# -------------------- Initialization --------------------
app = Flask(__name__)
db_connection = db.connect_to_database()


# ------------------- Routes --------------------

# Route 1: Home page (aka 'Reports')
@app.route('/')
def root():

    # Step 1: Write query
    # --Query 1: Access 'Sell log' table data
    query = "SELECT * FROM OrderProducts;"
    # -- ** Insert queries to populate other tables here

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

    # Step x: Render HomePage
    return render_template("index.j2", reports_data=payload)

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
    # Step 1: Initialize payload
    payload = []

    # Step 2: Write Query 1 (order table population) and append to payload
    query1 = "SELECT * FROM Orders;"
    cursor1 = db.execute_query(db_connection=db_connection, query=query1)
    result1 = cursor1.fetchall()
    payload.append(result1)

    # Step 3: Write Query 2 (Customer selection drop down menu population) and append to payload
    query2 = "SELECT customerID, fName, lName FROM Customers;"
    cursor2 = db.execute_query(db_connection=db_connection, query=query2)
    result2 = cursor2.fetchall()
    full_names = []   # This will end up being a list of 1-tuples [(ID.1  Bob Roberts), ... ]
    for name in result2:
        customer_info = f"ID.{name['customerID']}" + "  " + name["fName"] + " " + name['lName']
        full_names.append(customer_info)
    payload.append(full_names)

    # Step 4: Write Query 3 (Product selection menu) and append to payload
    query3 = "SELECT productID, productName, salePrice, unitType FROM Products;"
    cursor3 = db.execute_query(db_connection=db_connection, query=query3)
    result3 = cursor3.fetchall()
    payload.append(result3)

    # Step 5: The specified file is rendered with the queried data
    return render_template("orders_subpage.j2", order_data=payload)


# Route 4: 'Products' subpage
@app.route('/products', methods=['POST', 'GET'])
def load_products():

    # For loading page
    if request.method == 'GET':
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

    # For taking commands (Update, delete, or insert)
    elif request.method == 'POST':
        response_obj = request.json()
        print("TEST_2:", response_obj)













    # ---------------------------------------------------------------------------------------------

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


# Route 6: 'Seasons' subpage
@app.route('/seasons')
def load_seasons():

    # Step 1: Write query
    query = "SELECT * FROM Seasons;"

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
    return render_template("seasons_subpage.j2", season_data=payload)


# Route 6: 'Demo UI' subpage
@app.route('/demoUI')
def load_demo():

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
    return render_template("DemoUI_subpage.j2", demo_data=payload)



# -------------------- Listener --------------------
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 1027))
    app.run(port=port, debug=True)
