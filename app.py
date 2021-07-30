from flask import Flask, render_template, json, request, jsonify
import os
import database.db_connector as db
from GLOBAL_VARIABLES import *

# -------------------- Initialization --------------------
app = Flask(__name__)
db_connection = db.connect_to_database()


# ------------------- Routes --------------------
# Route 1: Homepage (aka 'Reports')
@app.route('/')
def root():

    # Step 1: append all subpage URLs to payload
    payload = []
    payload.append(subpages)

    # Step 2: Write query
    # --Query 1: Access 'Sell log' table data
    query = "SELECT * FROM OrderProducts;"
    # -- ** Insert queries to populate other tables here

    # Step 3: Send query ('Cursor' acts as the person typing the specified command into MySQL)
    cursor = db.execute_query(db_connection=db_connection, query=query)

    # Step 4: Access result (This returns a tuple of selected rows from query)
    results = cursor.fetchall()
    payload.append(results)

    # Step 5: Print query results if Debugging
    debug = False
    if debug:
        print("\n")
        print(f"Type:{type(results)}")
        print(f"Length: {len(results)}")
        print("Result:")
        for row in results:
            print(row)

    # Step 6: Render HomePage
    return render_template("index.j2", reports_data=payload)


# Route 2: 'Customers' subpage
@app.route('/customers')
def load_customers():

    # Step 1: append all subpage URLs to payload
    payload = []
    payload.append(subpages)

    # Step 2: Write query
    query = "SELECT * FROM Customers;"

    # Step 3: Send query ('Cursor' acts as the person typing the specified command into MySQL)
    cursor = db.execute_query(db_connection=db_connection, query=query)

    # Step 4: Access result (This returns a tuple of selected rows from query)
    results = cursor.fetchall()
    payload.append(results)

    # Step 5: Print query results if Debugging
    debug = False
    if debug:
        print("\n")
        print(f"Type:{type(results)}")
        print(f"Length: {len(results)}")
        print("Result:")
        for row in results:
            print(row)

    # Step 6: The specified file is rendered with the queried data
    return render_template("customers_subpage.j2", customer_data=payload)


# Route 3: 'Orders' subpage
@app.route('/orders', methods=['POST', 'GET'])
def load_orders():

    # For initial page load...
    if request.method == 'GET':
        # Step 1: append all subpage URLs to payload
        payload = []
        payload.append(subpages)

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

    # For making an order...
    elif request.method == 'POST':

        # Step 1:

        # Step 2:
        # Step 3:
        # Step 4:
        # Step 5:



# Route 4: 'Products' subpage
@app.route('/products', methods=['POST', 'GET'])
def load_products():

    # For loading page
    if request.method == 'GET':
        # Step 1: append all subpage URLs to payload
        payload = []
        payload.append(subpages)

        # Step 2: Write query
        query = "SELECT * FROM Products;"

        # Step 3: Send query ('Cursor' acts as the person typing the specified command into MySQL)
        cursor = db.execute_query(db_connection=db_connection, query=query)

        # Step 4: Access result (This returns a tuple of selected rows from query)
        results = cursor.fetchall()
        payload.append(results)

        # Step 5: Print query results if Debugging
        debug = False
        if debug:
            print("\n")
            print(f"Type:{type(results)}")
            print(f"Length: {len(results)}")
            print("Result:")
            for row in results:
                print(row)

        # Step 6: The specified file is rendered with the queried data
        return render_template("products_subpage.j2", product_data=payload)

    # For taking commands (Update, delete, or insert)
    elif request.method == 'POST':
        # ---- Access request Payload
        response_obj = request.json
        # print("!!! Data from Post Request: ", response_obj)          # For Debugging

        # ---- If this is a POST request for Updating the database
        if response_obj["action"] == 'update':

            # Step 1: Sent query and access result
            query = f"UPDATE Products SET productName='{response_obj['name']}', departmentID='{response_obj['department']}', " \
                    f"salePrice='{response_obj['price']}', unitType='{response_obj['unitType']}' WHERE productID='{response_obj['ID']}';"
            cursor = db.execute_query(db_connection=db_connection, query=query)

            # Step 2: Access updated row from database
            query2 = f"SELECT * FROM Products WHERE productID='{response_obj['ID']}';"
            cursor = db.execute_query(db_connection=db_connection, query=query2)
            results = cursor.fetchall()

            # Step 3: create payload with returned data
            payload = results[0]
            payload["salePrice"] = str(payload["salePrice"])  # Since salePrice is of Decimal Type, change it to str
            # print("!!! Payload response: ", payload)          # For Debugging

            # Step 4: Return response
            return payload

        # ---- If this is a POST request for Deleting a row from the database
        elif response_obj["action"] == 'delete':

            # Step 1: Send query to delete chosen row
            query = f"DELETE FROM Products WHERE productID='{response_obj['rowToDelete']}';"
            cursor = db.execute_query(db_connection=db_connection, query=query)
            results = cursor.fetchall()
            # print("TEST_3", results)  # For debugging

            # Step 2: Send bogus response
            return {"Status": "Complete"}

        # ---- If this is a POST request for Inserting a new product into the database
        elif response_obj["action"] == 'insert':

            # Step 1: Send query
            query = f"INSERT INTO Products (productName, salePrice, departmentID, unitType) VALUES " \
                    f"('{response_obj['name']}', '{response_obj['price']}', '{response_obj['department']}', '{response_obj['unit']}');"
            cursor = db.execute_query(db_connection=db_connection, query=query)
            results = cursor.fetchall()

            # Step 2: Access new row through query and sent it back as a response
            query = f"SELECT * FROM Products WHERE productName='{response_obj['name']}' AND departmentID='{response_obj['department']}' " \
                    f"AND salePrice='{response_obj['price']}' AND unitType='{response_obj['unit']}';"
            cursor = db.execute_query(db_connection=db_connection, query=query)
            results = cursor.fetchall()
            payload = results[0]
            payload["salePrice"] = str(payload["salePrice"])  # Since salePrice is of Decimal Type, change it to str
            return payload

        # ---- If this is a POST request for Searching a product
        elif response_obj["action"] == 'search':

            # Step 1: Write query
            if response_obj["searchBy"] == "id":
                query = f"SELECT * FROM Products WHERE productID='{response_obj['id']}';"
            elif response_obj["searchBy"] == "name":
                query = f"SELECT * FROM Products WHERE productName='{response_obj['name']}';"
            elif response_obj["searchBy"] == "price":
                query = f"SELECT * FROM Products WHERE salePrice<='{response_obj['price']}';"

            # Step 2: Send query ('Cursor' acts as the person typing the specified command into MySQL)
            cursor = db.execute_query(db_connection=db_connection, query=query)

            # Step 3: Access result (This returns a tuple of selected rows from query)
            results = cursor.fetchall()
            row_list = []
            for val in results:
                val["salePrice"] = str(val["salePrice"])  # Since salePrice is of Decimal Type, change it to str
                row_list.append(val)

            payload = {"rows": row_list}
            print(payload)

            # Step 4: return JSON object consisting on queried rows
            return payload





















    # ---------------------------------------------------------------------------------------------


# Route 5: 'Departments' subpage
@app.route('/departments')
def load_departments():

    # Step 1: append all subpage URLs to payload
    payload = []
    payload.append(subpages)

    # Step 2: Write query
    query = "SELECT * FROM Departments;"

    # Step 3: Send query ('Cursor' acts as the person typing the specified command into MySQL)
    cursor = db.execute_query(db_connection=db_connection, query=query)

    # Step 4: Access result (This returns a tuple of selected rows from query)
    results = cursor.fetchall()
    payload.append(results)

    # Step 5: Print query results if Debugging
    debug = False
    if debug:
        print("\n")
        print(f"Type:{type(results)}")
        print(f"Length: {len(results)}")
        print("Result:")
        for row in results:
            print(row)

    # Step 6: The specified file is rendered with the queried data
    return render_template("departments_subpage.j2", department_data=payload)


# Route 6: 'Seasons' subpage
@app.route('/seasons')
def load_seasons():

    # Step 1: append all subpage URLs to payload
    payload = []
    payload.append(subpages)

    # Step 2: Write query
    query = "SELECT * FROM Seasons;"

    # Step 3: Send query ('Cursor' acts as the person typing the specified command into MySQL)
    cursor = db.execute_query(db_connection=db_connection, query=query)

    # Step 4: Access result (This returns a tuple of selected rows from query)
    results = cursor.fetchall()
    payload.append(results)

    # Step 5: Print query results if Debugging
    debug = False
    if debug:
        print("\n")
        print(f"Type:{type(results)}")
        print(f"Length: {len(results)}")
        print("Result:")
        for row in results:
            print(row)

    # Step 6: The specified file is rendered with the queried data
    return render_template("seasons_subpage.j2", season_data=payload)


# Route 6: 'Demo UI' subpage
@app.route('/demoUI')
def load_demo():

    # Step 1: append all subpage URLs to payload
    payload = []
    payload.append(subpages)

    # Step 2: Write query
    query = "SELECT * FROM Products;"

    # Step 3: Send query ('Cursor' acts as the person typing the specified command into MySQL)
    cursor = db.execute_query(db_connection=db_connection, query=query)

    # Step 4: Access result (This returns a tuple of selected rows from query)
    results = cursor.fetchall()
    payload.append(results)

    # Step 5: Print query results if Debugging
    debug = False
    if debug:
        print("\n")
        print(f"Type:{type(results)}")
        print(f"Length: {len(results)}")
        print("Result:")
        for row in results:
            print(row)

    # Step 6: The specified file is rendered with the queried data
    return render_template("DemoUI_subpage.j2", demo_data=payload)



# -------------------- Listener --------------------
if __name__ == "__main__":
    port = int(os.environ.get('PORT', port_num))
    app.run(port=port, debug=True)
