from flask import Flask, render_template, json, request, jsonify
import os
import database.db_connector as db
from GLOBAL_VARIABLES import *
import datetime

# -------------------- Initialization --------------------
app = Flask(__name__)
db_connection = db.connect_to_database()


# ------------------- Routes --------------------
# Route 1: Homepage (aka 'Reports')
@app.route('/', methods=['POST', 'GET'])
def root():

    # If initial page load...
    if request.method == 'GET':
        # -----Step 1: append all subpage URLs to payload
        payload = []
        payload.append(subpages)

        # -----Step 2: Query for populating 'Sales log'
        # Query 1: Access 'Sell log' table data
        query = "SELECT * FROM OrderProducts;"
        cursor = db.execute_query(db_connection=db_connection, query=query)
        results = cursor.fetchall()     # Access result (This returns a tuple of selected rows from query)
        payload.append(results)

        # -----Step 3: Query(s) for populating 'Current seasons'
        # --SubStep 1: get ID of every product
        query1 = "SELECT productID FROM Products;"
        cursor1 = db.execute_query(db_connection=db_connection, query=query1)
        productIDs = cursor1.fetchall()  # Access result (This returns a tuple of selected rows from query)

        # --SubStep 2: Determine current season by cross-referencing date-of-purchase with seasonal dates
        date_of_purchase = str(datetime.datetime.today()).split()[0]
        query2 = f"SELECT seasonID FROM Seasons WHERE startDate <= '{date_of_purchase}' AND endDate >= '{date_of_purchase}';"
        cursor2 = db.execute_query(db_connection=db_connection, query=query2)
        result2 = cursor2.fetchall()
        seasonID = result2[0]['seasonID']

        # --SubStep 2: get cumulative revenue for current season
        date_of_purchase = str(datetime.datetime.today()).split()[0]
        query3 = f"SELECT SUM(totalCost) as totalCost FROM Orders WHERE seasonID='{seasonID}';"
        cursor3 = db.execute_query(db_connection=db_connection, query=query3)
        result3 = cursor3.fetchall()
        seasonalGross = float(result3[0]['totalCost'])

        # --SubStep 3: get stats for every product using IDs (that was accessed earlier)
        query4 = f"SELECT (SELECT productName FROM Products p WHERE p.productID = op.productID) as Product, " \
                 f"SUM(op.quantitySold) as Quantity, SUM(op.productTotal) as Total FROM OrderProducts " \
                 f"op WHERE op.seasonID = '{seasonID}' GROUP BY op.productID;"
        cursor4 = db.execute_query(db_connection=db_connection, query=query4)
        result4 = cursor4.fetchall()
        currentSeasonalStats = []
        for prod in result4:
            prod['Quantity'] = float(prod['Quantity'])
            prod['Total'] = float(prod['Total'])
            prod['Percent'] = round((prod['Total']/seasonalGross)*100, 1)
            currentSeasonalStats.append(prod)
        payload.append(currentSeasonalStats)

        # -----Step 4: Query(s) for populating 'Current year top sellers'
        # --SubStep 1: get ID of every season
        query1 = "SELECT seasonID FROM Seasons;"
        cursor1 = db.execute_query(db_connection=db_connection, query=query1)
        seasonIDs = cursor1.fetchall()  # Access result (This returns a tuple of selected rows from query)
        sids = []
        for val in seasonIDs:
            sids.append(val['seasonID'])

        # --SubStep 2: xxx
        currentAnnualStats = []
        for each_id in sids:
            # print("Each_id:", each_id)
            # --Get Name of season
            query2 = f"SELECT seasonName FROM Seasons WHERE seasonID={each_id};"
            cursor2 = db.execute_query(db_connection=db_connection, query=query2)
            seasonName = cursor2.fetchall()[0]["seasonName"]

            # --Get all products and their total sales
            query3 = f"SELECT productID as ProductID, SUM(quantitySold) as Quantity, SUM(productTotal) as " \
                     f"Total FROM OrderProducts WHERE seasonID='{each_id}' GROUP BY productID;"
            cursor3 = db.execute_query(db_connection=db_connection, query=query3)
            productData = cursor3.fetchall()
            # print("TEST_2:", productData)
            if productData == ():
                break

            # --Determine product with highest sale
            totals = []
            for val in productData:
                totals.append(float(val['Total']))
            maxTotal = max(totals)
            # print("MAX:", maxTotal)

            # --Choose top seller
            for each in productData:
                if float(each['Total']) == maxTotal:
                    each['season'] = seasonName
                    each['quantity'] = int(each['Quantity'])
                    each['total'] = float(each['Total'])
                    currentAnnualStats.append(each)

        # --Convert productID to productName
        for eachPS in currentAnnualStats:
            query3 = f"SELECT productName FROM Products WHERE productID='{eachPS['ProductID']}';"
            cursor3 = db.execute_query(db_connection=db_connection, query=query3)
            productName = cursor3.fetchall()[0]["productName"]
            eachPS['product'] = productName
            del eachPS['ProductID']

        # --SubStep 3: append data to payload
        payload.append(currentAnnualStats)

        # -----Step 4: Print query results if Debugging
        debug = False
        if debug:
            print("\n")
            print(f"Type:{type(results)}")
            print(f"Length: {len(results)}")
            print("Result:")
            for row in results:
                print(row)

        # -----Step 5: Render HomePage
        return render_template("index.j2", reports_data=payload)

    # If request for an order cancellation...
    elif request.method == 'POST':
        response_obj = request.json

        # ---Step 1: delete order log from OrderProducts
        query1 = f"DELETE FROM OrderProducts WHERE productID='{response_obj['productID']}' AND orderID='" \
                 f"{response_obj['orderID']}' AND seasonID='{response_obj['seasonID']}';"
        cursor1 = db.execute_query(db_connection=db_connection, query=query1)

        # ---Step 2: subtract the cancelled amount from 'Orders' entry

        # -First, access the total order price
        query2 = f"SELECT totalCost FROM Orders WHERE orderID='{response_obj['orderID']}';"
        cursor2 = db.execute_query(db_connection=db_connection, query=query2)
        totalPrice = float(cursor2.fetchall()[0]['totalCost'])

        # -Second, after subtracting the amount from the order total, if value is 0, delete order entirely....
        if totalPrice - float(response_obj['productTotal']) == 0:
            query3 = f"DELETE FROM Orders WHERE orderID='{response_obj['orderID']}';"
            db.execute_query(db_connection=db_connection, query=query3)

        # -Third, ....Otherwise, simply update the Orders entry with the subtracted price
        else:
            updatedPrice = totalPrice - float(response_obj['productTotal'])
            query4 = f"UPDATE Orders SET totalCost='{updatedPrice}' WHERE orderID='{response_obj['orderID']}';"
            db.execute_query(db_connection=db_connection, query=query4)

        # ---Step 3: return
        return {"status":"complete"}


# Route 2: 'Customers' subpage
@app.route('/customers', methods=['POST', 'GET'])
def load_customers():

    # If request for page load....
    if request.method == 'GET':
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

    elif request.method == 'POST':

        response_obj = request.json

        # If update request...
        if response_obj["action"] == 'update':
            # Step 1: Sent query and access result
            query = f"UPDATE Customers SET fName='{response_obj['fname']}', lName='{response_obj['lname']}', " \
                    f"birthDate='{response_obj['dob']}', zipCode='{response_obj['zip']}' WHERE customerID='{response_obj['ID']}';"
            cursor = db.execute_query(db_connection=db_connection, query=query)

            # Step 2: Access updated row from database
            query2 = f"SELECT * FROM Customers WHERE customerID='{response_obj['ID']}';"
            cursor = db.execute_query(db_connection=db_connection, query=query2)
            results = cursor.fetchall()

            # Step 3: create payload with returned data
            payload = results[0]
            #print("TEST_1:", payload)          # For Debugging
            payload["birthDate"] = response_obj['dob'] # Since salePrice is of Date Type, change it to str

            # Step 4: Return response
            return payload

        # If delete request...
        elif response_obj["action"] == 'delete':

            # Step 1: Send query to delete chosen row
            query = f"DELETE FROM Customers WHERE customerID ='{response_obj['rowToDelete']}';"
            cursor = db.execute_query(db_connection=db_connection, query=query)
            results = cursor.fetchall()
            # print("TEST_3", results)  # For debugging

            # Step 2: Send bogus response
            return {"Status": "Complete"}

        # If insert request...
        elif response_obj["action"] == 'insert':
            print("!!!!!! !!!!!!!! !!!!!!!!!!!!!! !!!!!!!!!!!!!!!!!")

            print("THIS:", response_obj)

            # Step 1: Send query
            query = f"INSERT INTO Customers (fName, lName, birthDate, zipCode) VALUES " \
                    f"('{response_obj['fName']}', '{response_obj['lName']}', '{response_obj['birthDate']}', '{response_obj['zipCode']}');"
            cursor = db.execute_query(db_connection=db_connection, query=query)
            results = cursor.fetchall()

            # Step 2: Access new row through query and sent it back as a response
            query = f"SELECT * FROM Customers WHERE fName='{response_obj['fName']}' AND lName='{response_obj['lName']}' " \
                    f"AND birthDate='{response_obj['birthDate']}' AND zipCode='{response_obj['zipCode']}';"
            cursor = db.execute_query(db_connection=db_connection, query=query)
            results = cursor.fetchall()
            payload = results[0]
            payload["birthDate"] = response_obj['birthDate']  # Since dob is of date Type, change it to str
            return payload


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

        customer_info = []
        for each_customer in result2:
            id = each_customer['customerID']
            fullName = each_customer['fName'] + " " + each_customer['lName']
            customer_info.append((id, fullName))
        payload.append(customer_info)


        # Step 4: Write Query 3 (Product selection menu) and append to payload
        query3 = "SELECT productID, productName, salePrice, unitType FROM Products;"
        cursor3 = db.execute_query(db_connection=db_connection, query=query3)
        result3 = cursor3.fetchall()
        payload.append(result3)

        # Step 5: The specified file is rendered with the queried data
        return render_template("orders_subpage.j2", order_data=payload)

    # For making an order...
    elif request.method == 'POST':
        response_obj = request.json

        # Step 1: Determine current by cross-referencing date-of-purchase with seasonal dates
        date_of_purchase = str(datetime.datetime.today()).split()[0]
        query1 = f"SELECT seasonID FROM Seasons WHERE startDate <= '{date_of_purchase}' AND endDate >= '{date_of_purchase}';"
        cursor1 = db.execute_query(db_connection=db_connection, query=query1)
        result1 = cursor1.fetchall()
        seasonID = result1[0]['seasonID']

        # Step 2: Calculate total cost
        total = 0
        for prod in response_obj["purchases"]:
            query2 = f"SELECT salePrice FROM Products WHERE productID='{prod[0]}';"
            cursor2 = db.execute_query(db_connection=db_connection, query=query2)
            result2 = cursor2.fetchall()
            price = float(result2[0]['salePrice'])             # Since salePrice is of Decimal Type, change it to str
            total += (price * int(prod[1]))

        # Step 3: Execute the order (aka insert into 'Orders')
        query3 = f"INSERT INTO Orders VALUES ('0', '{response_obj['customer']}', '{seasonID}', '{total}');"
        db.execute_query(db_connection=db_connection, query=query3)

        # Step 4: Access ID of last inserted row
        query4 = f"SELECT LAST_INSERT_ID();"
        cursor4 = db.execute_query(db_connection=db_connection, query=query4)
        orderID = cursor4.fetchall()
        orderID = str(orderID[0]['LAST_INSERT_ID()'])

        # Step 5: Populate orderProducts
        for eachItem in response_obj["purchases"]:
            # First, Access the price for each product
            query5 = f"SELECT salePrice FROM Products WHERE productID='{eachItem[0]}';"
            cursor5 = db.execute_query(db_connection=db_connection, query=query5)
            result5 = cursor5.fetchall()
            price = float(result5[0]['salePrice'])  # Since salePrice is of Decimal Type, change it to str

            # Second, variablize each column value
            productID = eachItem[0]
            orderID = orderID                # Constant
            seasonID = seasonID              # Constant
            quantity = eachItem[1]
            productTotal = price * int(quantity)

            # Third, insert into OrderProducts
            query5 = f"INSERT INTO OrderProducts VALUES ('{productID}', '{orderID}', '{seasonID}', '{quantity}', '{productTotal}');"
            db.execute_query(db_connection=db_connection, query=query5)

        # Step 6: Access the latest row
        query5 = f"SELECT * FROM Orders WHERE orderID='{orderID}';"
        cursor5 = db.execute_query(db_connection=db_connection, query=query5)
        last_insert = cursor5.fetchall()
        last_insert[0]['totalCost'] = float(last_insert[0]['totalCost'])

        # Step 7: Return the row
        return {"lastOrder": last_insert[0]}


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

            # Step 4: return JSON object consisting on queried rows
            return payload


# Route 5: 'Departments' subpage
@app.route('/departments', methods=['POST', "GET"])
def load_departments():

    if request.method == 'GET':
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

    elif request.method == 'POST':

        response_obj = request.json

        # If update request...
        if response_obj["action"] == 'insert':
            # Step 1: Send query
            query = f"INSERT INTO Departments (name) VALUES " \
                    f"('{response_obj['name']}');"
            cursor = db.execute_query(db_connection=db_connection, query=query)
            results = cursor.fetchall()

            # Step 4: Access ID of last inserted row
            query2 = f"SELECT LAST_INSERT_ID();"
            cursor2 = db.execute_query(db_connection=db_connection, query=query2)
            depID = cursor2.fetchall()
            depID = str(depID[0]['LAST_INSERT_ID()'])

            # Step 2: Access new row through query and sent it back as a response
            query3 = f"SELECT * FROM Departments WHERE departmentID='{depID}';"
            cursor3 = db.execute_query(db_connection=db_connection, query=query3)
            results = cursor3.fetchall()
            payload = results[0]
            return payload


# Route 6: 'Seasons' subpage
@app.route('/seasons')
def load_seasons():

    # If page load...
    if request.method == 'GET':
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

    # If post req
    elif request.method == 'POST':
        response_obj = request.json

        # If insert request...
        if response_obj["action"] == 'insert':
            # Step 1: Send query
            query = f"INSERT INTO Seasons (name, startDate, endDate) VALUES " \
                    f"('{response_obj['sName']}', '{response_obj['sDate']}', '{response_obj['eDate']}');"
            cursor = db.execute_query(db_connection=db_connection, query=query)
            results = cursor.fetchall()

            # Step 4: Access ID of last inserted row
            query2 = f"SELECT LAST_INSERT_ID();"
            cursor2 = db.execute_query(db_connection=db_connection, query=query2)
            seasonID = cursor2.fetchall()
            seasonID = str(seasonID[0]['LAST_INSERT_ID()'])

            # Step 2: Access new row through query and sent it back as a response
            query3 = f"SELECT * FROM Seasons WHERE seasonID='{seasonID}';"
            cursor3 = db.execute_query(db_connection=db_connection, query=query3)
            results = cursor3.fetchall()
            payload = results[0]
            return payload




# -------------------- Listener --------------------
if __name__ == "__main__":
    port = int(os.environ.get('PORT', port_num))
    app.run(port=port, debug=True)
