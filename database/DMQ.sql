-- underscore character "_" will preface values which are variables that will 
-- have data from the backend programming language

-- Data Manipulation Queries ------------------------------------

-- Query 1: to populate the 'sell log' dislay table on 'reports' subpage
SELECT * FROM OrderProducts;

-- Query 2: to populate the customers table on 'customers' subpage
SELECT * FROM Customers;

-- Query 3: to populate the orders table on 'orders' subpage
SELECT * FROM Orders;

-- Query 4: to populate the products table on 'products' subpage
SELECT * FROM Products;

-- Query 5: to populate the departments table on 'departments' subpage
SELECT * FROM Departments;

-- Query6: to populate the seasons table on 'seasons' subpage
SELECT * FROM Seasons;

-- Query 7: to populate produce menu on the 'Demo UI' subpage
SELECT productName, salePrice, unitType FROM Products;

-- Query 8: to populate the drop down menu for character selection on the 'Demo UI' subpage
SELECT fName, lName FROM Customers;

-- Query 9: populate products/quantity/total revenue column(s) of 'current season' display table on 'reports' subpage
SELECT (SELECT productName FROM Products p WHERE p.productID = op.productID), SUM(op.quantitySold), SUM(op.productTotal) FROM OrderProducts op WHERE op.seasonID = '3' GROUP BY op.productID;

-- Query 10: populate 'current year top sellers' on 'reports' subpage
SELECT (SELECT seasonName FROM Seasons WHERE seasonID = '1') as Season, MAX(itemTotal) as ItemTotal FROM (SELECT op.productID as itemID, SUM(op.productTotal) as itemTotal FROM OrderProducts op WHERE op.seasonID = '1' GROUP by op.productID) sq;

-- Query 11: UPDATE values on 'customers' subpage
UPDATE Customers set fname=_fnameIn, lname=_lnameIn, birthDate=_birthDateIn, zipCode=_zipcodeIn WHERE customerID=_customerIDUpdating;

-- Query 12: DELETE values on 'customers' subpage
DELETE FROM Customers WHERE customerID=_customerIDDeleting;

-- Query 13: INSERT values on 'customers' subpage
INSERT INTO Customers (fname, lname, birthDate, zipCode) VALUES (_fnameIn, _lnameIn, _birthDateIn, _zipcodeIn);

-- Query 14: UPDATE values on 'products' subpage
UPDATE Products set productName=_productNameIn, departmentID=_departmentIDIn, salePrice=_salePriceIn WHERE productID=_productIDDeleting;

-- Query 15: DELETE values on 'products' subpage
DELETE FROM Products WHERE productID=_productIDDeleting;

-- Query 16: INSERT values on 'products' subpage
INSERT INTO Products (productName, departmentID, salePrice) VALUES (_productNameIn, departmentIDIn, _salePriceIn);

-- Query 17: INSERT values on 'departments' subpage
INSERT INTO Departments (departmentName) VALUES (_departmentNameIn);

-- Query 18: INSERT values on 'orders' subpage
INSERT INTO Orders (customerID, seasonID, totalCost) VALUES (_customerIDIn, _seasonIDIn, _totalCostIn);

-- Query 19: INSERT values on 'seasons' subpage
INSERT INTO Seasons (seasonName, startDate, endDate) VALUES (_seasonNameIn, _startDateIn, _endDateIn);

-- Query 20: DELETE values on OrderProducts
DELETE FROM OrderProducts WHERE productID=_productIDBeingDeleted AND orderID=_orderIDBeingDeleted 
	AND seasonID=seasonIDBeingDeleted;
    
-- Query 21: INSERT values on OrderProducts
INSERT INTO OrderProducts (productID, orderID, seasonID, quantitySold, productTotal) 
	VALUES(_newproductID, _neworderID, _newseasonID, _newquantity, _newtotal);