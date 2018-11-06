CREATE DATABASE  IF NOT EXISTS `ctg` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
USE `ctg`;
-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: localhost    Database: ctg
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `biddings`
--

DROP TABLE IF EXISTS `biddings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `biddings` (
  `id` varchar(100) NOT NULL,
  `salerID` varchar(100) DEFAULT NULL,
  `bidderID` varchar(100) DEFAULT NULL,
  `notes` varchar(500) DEFAULT NULL,
  `biddingDate` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biddings`
--

LOCK TABLES `biddings` WRITE;
/*!40000 ALTER TABLE `biddings` DISABLE KEYS */;
/*!40000 ALTER TABLE `biddings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_teams`
--

DROP TABLE IF EXISTS `client_teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `client_teams` (
  `clientID` varchar(100) DEFAULT NULL,
  `teamID` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_teams`
--

LOCK TABLES `client_teams` WRITE;
/*!40000 ALTER TABLE `client_teams` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deals`
--

DROP TABLE IF EXISTS `deals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `deals` (
  `id` varchar(100) NOT NULL,
  `service` varchar(100) NOT NULL,
  `provider` varchar(100) NOT NULL,
  `bidder` varchar(100) DEFAULT NULL,
  `status` varchar(100) NOT NULL,
  `currency` char(5) NOT NULL,
  `price` double NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `shortDescription` varchar(100) DEFAULT NULL,
  `longDescription` varchar(500) DEFAULT NULL,
  KEY `fk_service_idx` (`service`),
  KEY `fk_bidder_idx` (`bidder`),
  KEY `fk_location_idx` (`location`),
  KEY `fk_status_idx` (`status`),
  KEY `fk_saler_idx` (`provider`),
  CONSTRAINT `fk_bidder` FOREIGN KEY (`bidder`) REFERENCES `org` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_location` FOREIGN KEY (`location`) REFERENCES `location` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_provider` FOREIGN KEY (`provider`) REFERENCES `org` (`id`),
  CONSTRAINT `fk_service` FOREIGN KEY (`service`) REFERENCES `services` (`id`),
  CONSTRAINT `fk_status` FOREIGN KEY (`status`) REFERENCES `fk_biddingstatus` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deals`
--

LOCK TABLES `deals` WRITE;
/*!40000 ALTER TABLE `deals` DISABLE KEYS */;
/*!40000 ALTER TABLE `deals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fk_biddingstatus`
--

DROP TABLE IF EXISTS `fk_biddingstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `fk_biddingstatus` (
  `status` varchar(100) NOT NULL,
  PRIMARY KEY (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fk_biddingstatus`
--

LOCK TABLES `fk_biddingstatus` WRITE;
/*!40000 ALTER TABLE `fk_biddingstatus` DISABLE KEYS */;
INSERT INTO `fk_biddingstatus` VALUES ('engaged'),('ready'),('sold');
/*!40000 ALTER TABLE `fk_biddingstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `location` (
  `id` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `zip` varchar(100) DEFAULT NULL,
  `cordinateX` varchar(100) DEFAULT NULL,
  `cordinateY` varchar(100) DEFAULT NULL,
  `radius` double DEFAULT NULL,
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES ('##location#0f7036c4747915c5249b975a31da9c25',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('##location#3f8b1425143eda2785f8188228617e8f',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('##location#678d49cb01469fdfe61dba88977c7387',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('##location#8de47e0f71e53e6ff55714a20a955526',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('##location#d2722d7047e61b7708f484e9a7a48e39',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `org`
--

DROP TABLE IF EXISTS `org`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `org` (
  `id` varchar(100) NOT NULL,
  `shortName` varchar(200) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `contact` varchar(15) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `dateRegistred` varchar(100) NOT NULL,
  `locationRegistred` varchar(100) DEFAULT NULL,
  `locationWork` varchar(100) DEFAULT NULL,
  `shortDescription` varchar(100) DEFAULT NULL,
  `longdescription` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `phoneNumber_UNIQUE` (`email`),
  UNIQUE KEY `fullName_UNIQUE` (`fullName`),
  UNIQUE KEY `contact_UNIQUE` (`contact`),
  UNIQUE KEY `shortDescription_UNIQUE` (`shortDescription`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `org`
--

LOCK TABLES `org` WRITE;
/*!40000 ALTER TABLE `org` DISABLE KEYS */;
INSERT INTO `org` VALUES ('default','default','default','default','defaut','default','default','default','default','default');
/*!40000 ALTER TABLE `org` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `services` (
  `id` varchar(100) NOT NULL,
  `parentService` varchar(100) DEFAULT NULL,
  `creator` varchar(100) DEFAULT NULL,
  `dateCreated` timestamp NULL DEFAULT NULL,
  `shortDescription` varchar(100) DEFAULT NULL,
  `longDescription` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES ('##services#fa810f770634014405bf3b70dd892f70',NULL,'231',NULL,NULL,NULL),('default','default',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `token` (
  `id` varchar(100) NOT NULL,
  `userID` varchar(100) DEFAULT '1=2',
  `services_read` varchar(100) DEFAULT '1=2',
  `services_write` varchar(100) DEFAULT '1=2',
  `deals_write` varchar(100) DEFAULT '1=2',
  `deals_read` varchar(100) DEFAULT '1=2',
  `clients_read` varchar(100) DEFAULT '1=2',
  `clients_write` varchar(100) DEFAULT '1=2',
  `users_read` varchar(100) DEFAULT '1=2',
  `users_write` varchar(100) DEFAULT '1=2',
  `tokens_read` varchar(100) DEFAULT '1=2',
  `tokens_write` varchar(100) DEFAULT '1=2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `id` varchar(100) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `middleName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) NOT NULL,
  `virtualID` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `organisation` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `contact_UNIQUE` (`contact`),
  UNIQUE KEY `virtualID_UNIQUE` (`virtualID`),
  UNIQUE KEY `password_UNIQUE` (`password`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'ctg'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-10-13 16:35:11
