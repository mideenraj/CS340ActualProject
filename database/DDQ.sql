

-- Drop tables if exists
DROP TABLE IF EXISTS `OrderProducts`;
DROP TABLE IF EXISTS `Orders`;
DROP TABLE IF EXISTS `Products`;
DROP TABLE IF EXISTS `Seasons`;
DROP TABLE IF EXISTS `Customers`;
DROP TABLE IF EXISTS `Departments`;




-- Contruct Tables
CREATE TABLE `Seasons` (
  `seasonID` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `seasonName` VARCHAR(255) NOT NULL,
  `startDate` DATE NOT NULL,
  `endDate` DATE NOT NULL
);

CREATE TABLE `Customers` (
  `customerID` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `fName` VARCHAR(255) NOT NULL,
  `lName` VARCHAR(255) NOT NULL,
  `birthDate` DATE NOT NULL,
  `zipCode` INT(11) NOT NULL
);

CREATE TABLE `Departments` (
  `departmentID` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `Products` (
  `productID` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `productName` VARCHAR(255) NOT NULL,
  `departmentID` INT(11),
  `salePrice` DECIMAL(6, 2) NOT NULL,
  `unitType`  varchar(255) NOT NULL,
  CONSTRAINT `products_1` FOREIGN KEY (`departmentID`) REFERENCES `Departments` (`departmentID`) ON DELETE SET NULL
);

CREATE TABLE `Orders` (
  `orderID` INT(11) AUTO_INCREMENT PRIMARY KEY,
  `customerID` INT(11),
  `seasonID` INT(11) NOT NULL,
  `totalCost` DECIMAL(7, 2) NOT NULL,
  CONSTRAINT `orders_1` FOREIGN KEY (`customerID`) REFERENCES `Customers` (`customerID`) ON DELETE SET NULL,
  CONSTRAINT `orders_2` FOREIGN KEY (`seasonID`) REFERENCES `Seasons` (`seasonID`) ON DELETE NO ACTION
);

CREATE TABLE `OrderProducts` (
  `productID` INT(11),
  `orderID` INT(11) NOT NULL,
  `seasonID` INT(11) NOT NULL,
  `quantitySold` INT(11) NOT NULL,
  `productTotal` DECIMAL(7, 2) NOT NULL,
  CONSTRAINT `orderproducts_1` FOREIGN KEY (`productID`) REFERENCES `Products` (`productId`) ON DELETE SET NULL,
  CONSTRAINT `orderproducts_2` FOREIGN KEY (`orderID`) REFERENCES `Orders` (`orderID`) ON DELETE CASCADE
);




-- Insert data into tables
LOCK TABLES `Seasons` WRITE;
INSERT INTO `Seasons` VALUES 
  (1, 'Winter', '2020-12-21', '2021-03-20'),
  (2, 'Spring', '2021-03-21', '2021-06-19'),
  (3, 'Summer', '2021-06-20', '2021-08-21'),
  (4, 'Fall', '2021-08-22', '2021-12-20');
UNLOCK TABLES;

LOCK TABLES `Customers` WRITE;
INSERT INTO `Customers` VALUES
  (0, 'Sallie', 'Mae', '1985-01-12', 90001),
  (0, 'Johnny', 'Brown', '1992-03-15', 32004),
  (0, 'Mia', 'Fallon', '1977-05-12', 48002),
  (0, 'Jason', 'Hernandez', '2001-07-10', 17522),
  (0, 'Taylor', 'Hudson', '1958-12-28', 23139);
UNLOCK TABLES;

LOCK TABLES `Departments` WRITE;
INSERT INTO `Departments` VALUES
  (0, 'Fruits'),
  (0, 'Vegetables'),
  (0, 'Flowers'),
  (0, 'Canned Goods'),
  (0, 'Dairy');
UNLOCK TABLES;

LOCK TABLES `Products` WRITE;
INSERT INTO `Products` VALUES
  (0, 'Apple', 1, 1.32, 'Pound'),
  (0, 'Banana', 1, 0.57, 'Pound'),
  (0, 'Cabbage', 2, 1.97, 'Head'),
  (0, 'Ginger', 2, 0.50, 'Pound'),
  (0, 'Orchids', 3, 9.99, 'Stem'),
  (0, 'Gloriosa', 3, 11.99, 'Stem'),
  (0, 'Corn', 4, 1.99, "Can"),
  (0, 'Beans', 4, 1.99, "Can"),
  (0, 'Milk', 5, 2.68, "Gallon"),
  (0, 'Cheese', 5, 1.57, "Block");
UNLOCK TABLES;

LOCK TABLES `Orders` WRITE;
INSERT INTO `Orders` VALUES
  (0, 1, 1, 17.17),
  (0, 4, 1, 51.69),
  (0, 2, 2, 30.95),
  (0, 4, 3, 28.8),  
  (0, 5, 3, 9.99);
UNLOCK TABLES;

LOCK TABLES `OrderProducts` WRITE;
INSERT INTO `OrderProducts` VALUES
  (1, 1, 1, 2, 1.00),
  (4, 1, 1, 3, 1.50),
  (6, 1, 1, 1, 11.99),
  (9, 1, 1, 1, 2.68),
  (10, 2, 1, 6, 11.94),
  (3, 2, 1, 8, 15.76),
  (9, 2, 1, 3, 8.04),
  (6, 2, 1, 1, 11.99),
  (1, 2, 1, 3, 3.96),
  (4, 3, 2, 2, 1.00),
  (7, 3, 2, 3, 5.97),
  (6, 3, 2, 2, 23.98),
  (2, 4, 3, 5, 2.85),
  (5, 4, 3, 2, 19.98),
  (7, 4, 3, 3, 5.97),
  (5, 5, 3, 1, 9.99);
UNLOCK TABLES;