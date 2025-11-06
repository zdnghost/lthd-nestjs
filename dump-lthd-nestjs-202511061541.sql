-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: lthd-nestjs
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(36) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('0a0aae79-c59c-4530-9588-c17cb84a0f5e','Liam','Miller','liamm','$2b$10$5PENnIRhAci/T02BshVnB.H9XWuqM8aYg.1b4ThZcOkYIC1z99PAG',24,'admin',1,'2025-11-06 15:38:28.530091','2025-11-06 15:40:07.873847'),('36e3d13c-feae-452b-86cc-641b5dc545f0','John','Doe','johndoe','$2b$10$0v2gpVKztDuyddxDCkSVwer7waueaPV1JFFzEL1n3QtrwGmyZOilu',25,'admin',1,'2025-11-06 15:37:25.201156','2025-11-06 15:40:07.883590'),('5bc700a1-188e-4754-b6b5-eed0b027a302','Ethan','Johnson','ethanj','$2b$10$k6YlyMYpi6inKlLO6p1vlO139n4ceQmSFnx0DQFKg.O8vz7mB2hwm',20,'admin',1,'2025-11-06 15:38:05.163844','2025-11-06 15:40:07.885392'),('8b5e8a45-30f0-4679-95bb-144814796f61','Michael','Smith','mikesmith','$2b$10$CgHPtQh6WBFbtFCeH0nNfu2vqTQhDTFzuNj9wbWKIhRxvTdtBH4S.',29,'admin',1,'2025-11-06 15:37:42.777424','2025-11-06 15:40:07.889410'),('9cc7e77b-d721-41f8-a51d-204f323f4a6e','Olivia','Wilson','oliviaw','$2b$10$Z0RHdW3klDiMMH8VwEJlsuwepun5k4kem9tqpv9xCahA3xJHo5t12',22,'admin',1,'2025-11-06 15:38:37.068375','2025-11-06 15:40:07.891363'),('ab77e72f-3504-48f0-8aac-98e10b8eb60e','Ava','Taylor','avat','$2b$10$s/0uHjr6mi/H3MOktoeGeeg8sUhS1RAdyE.2DlTSPJ8xdBfB9WroW',27,'admin',1,'2025-11-06 15:38:15.561943','2025-11-06 15:40:07.892957'),('bcf9e67e-c0b2-40e1-bfd8-eb3424c6e362','Sophia','Brown','sophiab','$2b$10$fOr4U7Ulf3xxkriA3BfYZeHuvUyt72.IGAzWqiOY9isQ21Z75tHWe',23,'admin',1,'2025-11-06 15:37:53.435501','2025-11-06 15:40:07.894507'),('ccf05ad9-21c0-4e79-ada7-9829a635ba34','Emma','Watson','emmaw','$2b$10$6JTrKhHgMRv.zQkXmUCNse5RiOb5aB4SGcOZU3hfdrGkGvJpLXb86',21,'admin',1,'2025-11-06 15:37:35.889015','2025-11-06 15:40:07.897000'),('d815e5fb-b7c9-4d44-a71b-7750e99b0dc3','Nam','Nguyen','nam123','$2b$10$4d.BeL9MSj0rKACUhTblkeaPuYasnFK9btnOU0SJV3ejIwHnQM9Xu',22,'admin',1,'2025-11-06 15:34:10.243335','2025-11-06 15:40:07.898809'),('e013aebe-77b2-4168-adc0-c15cc37d14c5','Willson','Talia','talia','$2b$10$XoqmkqAIbjsXtGFSSAWczujSEYdpEHWoUQIByjojOGjZeDc8SLlDu',22,'admin',1,'2025-11-06 15:37:09.869635','2025-11-06 15:40:07.900461'),('eeda8978-4535-4244-8344-3c3e5b1edfb1','Noah','Davis','noahd','$2b$10$5SBmp5ETVByW7LEOz20VFuD4bAJkndMU8B0ceIya73dbSh2xraeOu',26,'admin',1,'2025-11-06 15:38:44.498018','2025-11-06 15:40:07.902853');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-06 15:41:22
