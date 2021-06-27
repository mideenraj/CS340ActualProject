
DROP TABLE IF EXISTS `rhino_test_1`;
CREATE TABLE `rhino_test_1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `population` bigint(20) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `capital` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


LOCK TABLES `rhino_test_1` WRITE;
INSERT INTO `rhino_test_1` VALUES (1,'Rhino_1',2800000000,'Old Gemenese','Oranu'),(2,'Rhino_2',2600000000,'Leonese','Luminere'),(3,'Rhino_3',4900000000,'Caprican','Caprica City');
UNLOCK TABLES;


/* Just random stuff for testing purposes */;
