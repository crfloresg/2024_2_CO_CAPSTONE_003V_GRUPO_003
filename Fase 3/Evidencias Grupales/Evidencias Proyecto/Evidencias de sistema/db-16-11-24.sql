CREATE DATABASE  IF NOT EXISTS `gestion_inventario` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gestion_inventario`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 3.83.165.38    Database: gestion_inventario
-- ------------------------------------------------------
-- Server version	8.0.40-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Alertas`
--

DROP TABLE IF EXISTS `Alertas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Alertas` (
  `alerta_id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `bodega_id` int NOT NULL,
  `tipo_alerta_id` int NOT NULL,
  `mensaje` text NOT NULL,
  `estado_alerta_id` int NOT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_resolucion` datetime DEFAULT NULL,
  `stockMin` int DEFAULT NULL,
  PRIMARY KEY (`alerta_id`),
  KEY `fk_producto_idx` (`producto_id`),
  KEY `fk_bodega_idx` (`bodega_id`),
  KEY `fk_tipo_idx` (`tipo_alerta_id`),
  KEY `fk_estado_idx` (`estado_alerta_id`),
  CONSTRAINT `fk_abodega` FOREIGN KEY (`bodega_id`) REFERENCES `Bodegas` (`bodega_id`),
  CONSTRAINT `fk_aestado` FOREIGN KEY (`estado_alerta_id`) REFERENCES `Estados_Alerta` (`estado_alerta_id`),
  CONSTRAINT `fk_aprod` FOREIGN KEY (`producto_id`) REFERENCES `Productos` (`producto_id`),
  CONSTRAINT `fk_atipo` FOREIGN KEY (`tipo_alerta_id`) REFERENCES `Tipos_Alerta` (`tipo_alerta_id`)
) ENGINE=InnoDB AUTO_INCREMENT=220 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Alertas`
--

LOCK TABLES `Alertas` WRITE;
/*!40000 ALTER TABLE `Alertas` DISABLE KEYS */;
INSERT INTO `Alertas` VALUES (1,1,1,1,'hola',1,'2024-11-15 16:03:43',NULL,70);
/*!40000 ALTER TABLE `Alertas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Auditorias`
--

DROP TABLE IF EXISTS `Auditorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Auditorias` (
  `auditoria_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `bodega_id` int NOT NULL,
  `accion` varchar(100) NOT NULL,
  `descripcion` text,
  `fecha_accion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`auditoria_id`)
) ENGINE=InnoDB AUTO_INCREMENT=347 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Auditorias`
--

LOCK TABLES `Auditorias` WRITE;
/*!40000 ALTER TABLE `Auditorias` DISABLE KEYS */;
INSERT INTO `Auditorias` VALUES (1,1,1,'usuario_update','Se modifico el usuario 17','0001-01-01 00:00:00'),(2,1,1,'usuario_update','Se modifico el usuario 17','0001-01-01 00:00:00'),(3,1,1,'usuario_update','Se modifico el usuario 17','0001-01-01 00:00:00'),(4,1,1,'usuario_update','Se modifico el usuario 17','2024-10-20 03:12:02'),(5,1,1,'usuario_update','Se modifico el usuario 17','2024-10-20 03:15:29'),(6,1,1,'usuario_update','Se modifico el usuario 17','2024-10-20 00:30:35'),(7,4,1,'rol_update','Se modifico el rol 1','2024-10-21 20:16:20'),(8,4,1,'rol_update','Se modifico el rol 1','2024-10-21 20:18:07'),(9,4,1,'producto_create','Se creo el producto 3','2024-10-21 20:25:05'),(10,4,1,'rol_update','Se modifico el rol 1','2024-10-21 23:10:12'),(11,4,1,'producto_update','Se modifico el producto 3','2024-10-21 23:41:10'),(12,4,1,'producto_create','Se creo el producto 9','2024-10-21 23:42:00'),(13,4,1,'producto_create','Se creo el producto 10','2024-10-21 23:42:33'),(14,4,1,'rol_update','Se modifico el rol 1','2024-10-22 00:02:57'),(15,1,1,'rol_activate','Se habilito el rol 11','2024-10-22 19:29:29'),(16,1,1,'rol_update','Se modifico el rol 1','2024-10-23 21:22:26'),(17,1,1,'rol_update','Se modifico el rol 1','2024-10-23 21:34:29'),(18,4,1,'rol_update','Se modifico el rol 1','2024-10-23 22:05:32'),(19,4,1,'rol_update','Se modifico el rol 1','2024-10-23 22:09:48'),(20,4,1,'rol_update','Se modifico el rol 1','2024-10-23 23:39:26'),(21,1,1,'usuario_update','Se modifico el usuario 8','2024-10-24 13:26:21'),(22,1,1,'usuario_update','Se modifico el usuario 8','2024-10-24 13:27:28'),(23,1,1,'usuario_update','Se modifico el usuario 8','2024-10-24 13:27:37'),(24,4,1,'producto_create','Se creo el producto 11','2024-10-24 13:43:49'),(25,1,1,'producto_create','Se creo el producto 12','2024-10-24 13:44:25'),(26,1,1,'producto_update','Se modifico el producto 12','2024-10-24 13:45:34'),(27,1,1,'producto_desactivado','Se deshabilito el producto 12','2024-10-24 13:45:45'),(28,1,1,'producto_activate','Se habilito el producto 12','2024-10-24 13:45:59'),(29,1,1,'usuario_create','Se creo el usuario 18','2024-10-24 14:09:07'),(30,1,1,'rol_create','Se creo el rol 15','2024-10-24 14:09:38'),(31,1,1,'producto_create','Se creo el producto 13','2024-10-24 14:10:34'),(32,4,1,'rol_update','Se modifico el rol 1','2024-10-24 22:02:00'),(33,4,1,'solicitud_delete','Se cancelo la solicitud 6','2024-10-24 22:18:49'),(34,4,1,'solicitud_update','Se modifico la solicitud 6','2024-10-24 23:22:09'),(35,4,1,'solicitud_update','Se modifico la solicitud 6','2024-10-24 23:42:39'),(36,4,1,'rol_update','Se modifico el rol 1','2024-10-25 21:34:28'),(37,4,1,'solicitud_update','Se modifico la solicitud 6','2024-10-25 23:29:34'),(38,4,1,'solicitud_update','Se modifico la solicitud 6','2024-10-25 23:31:36'),(39,4,1,'solicitud_update','Se modifico la solicitud 6','2024-10-25 23:33:49'),(40,4,1,'solicitud_update','Se modifico la solicitud 6','2024-10-25 23:37:54'),(41,4,1,'solicitud_accept','Se acepto la solicitud 6','2024-10-26 18:20:55'),(42,4,1,'solicitud_deny','Se denego la solicitud 6','2024-10-26 18:22:39'),(43,4,1,'solicitud_deny','Se denego la solicitud 6','2024-10-26 18:25:22'),(44,4,1,'solicitud_deny','Se denego la solicitud 6','2024-10-26 18:28:48'),(45,1,1,'solicitud_create','Se creo la solicitud 7','2024-10-26 21:13:14'),(46,1,1,'solicitud_update','Se modifico la solicitud 7','2024-10-26 21:13:33'),(47,1,1,'solicitud_accept','Se acepto la solicitud 7','2024-10-26 21:15:10'),(48,1,1,'rol_create','Se creo el rol 16','2024-10-26 21:23:53'),(49,4,1,'producto_update','Se modifico el producto 1','2024-10-26 22:00:52'),(50,4,1,'producto_update','Se modifico el producto 1','2024-10-26 22:00:53'),(51,4,1,'producto_update','Se modifico el producto 1','2024-10-26 22:00:53'),(52,4,1,'producto_update','Se modifico el producto 1','2024-10-26 22:00:54'),(53,4,1,'producto_update','Se modifico el producto 1','2024-10-26 22:00:54'),(54,4,1,'producto_update','Se modifico el producto 1','2024-10-26 22:00:55'),(55,4,1,'producto_update','Se modifico el producto 1','2024-10-26 22:01:28'),(56,1,1,'usuario_delete','Se deshabilito el usuario 17','2024-10-28 11:51:42'),(57,1,1,'usuario_activate','Se habilito el usuario 17','2024-10-28 11:51:56'),(58,1,1,'usuario_create','Se creo el usuario 19','2024-10-28 11:54:51'),(59,1,1,'usuario_create','Se creo el usuario 20','2024-10-28 11:55:54'),(60,1,1,'usuario_create','Se creo el usuario 21','2024-10-28 11:57:23'),(61,1,1,'usuario_create','Se creo el usuario 22','2024-10-28 11:59:15'),(62,1,1,'usuario_create','Se creo el usuario 23','2024-10-28 12:00:07'),(63,1,1,'usuario_create','Se creo el usuario 24','2024-10-28 12:00:37'),(64,1,1,'usuario_create','Se creo el usuario 25','2024-10-28 12:01:25'),(65,1,1,'usuario_create','Se creo el usuario 26','2024-10-28 12:02:04'),(66,1,1,'usuario_create','Se creo el usuario 27','2024-10-28 12:02:38'),(67,1,1,'usuario_create','Se creo el usuario 28','2024-10-28 12:03:09'),(68,1,1,'usuario_create','Se creo el usuario 29','2024-10-28 12:03:37'),(69,1,1,'usuario_create','Se creo el usuario 30','2024-10-28 12:04:13'),(70,1,1,'usuario_create','Se creo el usuario 31','2024-10-28 18:51:07'),(71,1,1,'usuario_create','Se creo el usuario 32','2024-10-28 18:52:04'),(72,1,1,'usuario_create','Se creo el usuario 33','2024-10-28 18:52:57'),(73,1,1,'usuario_create','Se creo el usuario 34','2024-10-28 18:53:26'),(74,1,1,'usuario_create','Se creo el usuario 35','2024-10-28 18:54:11'),(75,1,1,'usuario_create','Se creo el usuario 36','2024-10-28 18:55:09'),(76,1,1,'usuario_create','Se creo el usuario 37','2024-10-28 18:56:09'),(77,1,1,'usuario_create','Se creo el usuario 38','2024-10-28 18:58:38'),(78,1,1,'usuario_create','Se creo el usuario 39','2024-10-28 18:59:22'),(79,1,1,'usuario_create','Se creo el usuario 40','2024-10-28 19:00:07'),(80,1,1,'usuario_create','Se creo el usuario 41','2024-10-28 19:00:49'),(81,1,1,'producto_desactivado','Se deshabilito el producto 11','2024-10-29 07:42:52'),(82,1,1,'producto_activate','Se habilito el producto 11','2024-10-29 07:45:03'),(83,1,1,'producto_update','Se modifico el producto 12','2024-10-29 07:46:47'),(84,1,1,'producto_update','Se modifico el producto 13','2024-10-29 07:47:17'),(85,1,1,'producto_update','Se modifico el producto 11','2024-10-29 07:47:49'),(86,1,1,'producto_update','Se modifico el producto 1','2024-10-29 07:48:53'),(87,1,1,'producto_update','Se modifico el producto 2','2024-10-29 07:49:15'),(88,1,1,'producto_update','Se modifico el producto 3','2024-10-29 07:49:42'),(89,1,1,'producto_update','Se modifico el producto 9','2024-10-29 07:50:14'),(90,1,1,'producto_update','Se modifico el producto 10','2024-10-29 07:50:39'),(91,1,1,'rol_update','Se modifico el rol 10','2024-10-29 08:00:15'),(92,1,1,'rol_update','Se modifico el rol 11','2024-10-29 08:01:06'),(93,1,1,'rol_update','Se modifico el rol 12','2024-10-29 08:01:47'),(94,1,1,'rol_update','Se modifico el rol 13','2024-10-29 08:02:43'),(95,1,1,'rol_update','Se modifico el rol 16','2024-10-29 08:03:35'),(96,1,1,'rol_update','Se modifico el rol 15','2024-10-29 08:04:40'),(97,1,1,'rol_update','Se modifico el rol 1','2024-10-29 08:05:06'),(98,1,1,'rol_create','Se creo el rol 17','2024-10-29 08:05:39'),(99,1,1,'rol_create','Se creo el rol 18','2024-10-29 08:06:16'),(100,1,1,'rol_create','Se creo el rol 19','2024-10-29 08:07:04'),(101,1,1,'rol_create','Se creo el rol 20','2024-10-29 08:14:25'),(102,1,1,'rol_create','Se creo el rol 21','2024-10-29 08:15:20'),(103,1,1,'rol_create','Se creo el rol 22','2024-10-29 08:16:05'),(104,1,1,'rol_create','Se creo el rol 23','2024-10-29 08:16:49'),(105,1,1,'rol_create','Se creo el rol 24','2024-10-29 08:17:14'),(106,1,1,'rol_update','Se modifico el rol 11','2024-10-29 08:19:41'),(107,1,1,'rol_update','Se modifico el rol 12','2024-10-29 08:21:35'),(108,1,1,'rol_create','Se creo el rol 25','2024-10-29 08:22:22'),(109,1,1,'rol_create','Se creo el rol 26','2024-10-29 08:22:57'),(110,1,1,'rol_create','Se creo el rol 27','2024-10-29 08:23:13'),(111,1,1,'rol_create','Se creo el rol 28','2024-10-29 08:23:45'),(112,1,1,'rol_create','Se creo el rol 29','2024-10-29 08:24:16'),(113,1,1,'rol_create','Se creo el rol 30','2024-10-29 08:24:42'),(114,1,1,'rol_create','Se creo el rol 31','2024-10-29 08:25:05'),(115,1,1,'rol_create','Se creo el rol 32','2024-10-29 08:25:22'),(117,1,1,'usuario_update','Se modifico el usuario 19','2024-10-29 08:30:57'),(118,1,1,'usuario_update','Se modifico el usuario 20','2024-10-29 08:31:23'),(119,1,1,'usuario_update','Se modifico el usuario 21','2024-10-29 08:31:44'),(120,1,1,'usuario_update','Se modifico el usuario 22','2024-10-29 08:31:59'),(121,1,1,'usuario_update','Se modifico el usuario 23','2024-10-29 08:32:28'),(122,1,1,'usuario_update','Se modifico el usuario 24','2024-10-29 08:33:16'),(123,1,1,'usuario_update','Se modifico el usuario 28','2024-10-29 08:33:36'),(124,1,1,'usuario_update','Se modifico el usuario 29','2024-10-29 08:33:49'),(125,1,1,'usuario_update','Se modifico el usuario 27','2024-10-29 08:34:19'),(126,1,1,'usuario_update','Se modifico el usuario 26','2024-10-29 08:34:37'),(127,1,1,'usuario_update','Se modifico el usuario 31','2024-10-29 08:35:10'),(128,1,1,'usuario_update','Se modifico el usuario 30','2024-10-29 08:35:28'),(129,1,1,'usuario_update','Se modifico el usuario 32','2024-10-29 08:35:41'),(130,1,1,'usuario_update','Se modifico el usuario 33','2024-10-29 08:35:53'),(131,1,1,'usuario_update','Se modifico el usuario 34','2024-10-29 08:36:13'),(132,1,1,'usuario_update','Se modifico el usuario 35','2024-10-29 08:37:18'),(133,1,1,'usuario_update','Se modifico el usuario 36','2024-10-29 08:38:04'),(134,1,1,'usuario_update','Se modifico el usuario 37','2024-10-29 08:38:20'),(135,1,1,'usuario_update','Se modifico el usuario 38','2024-10-29 08:38:33'),(136,1,1,'usuario_update','Se modifico el usuario 39','2024-10-29 08:39:37'),(137,1,1,'usuario_update','Se modifico el usuario 40','2024-10-29 08:39:52'),(138,1,1,'usuario_update','Se modifico el usuario 41','2024-10-29 08:40:00'),(139,1,1,'rol_create','Se creo el rol 33','2024-10-29 08:42:33'),(140,1,1,'usuario_create','Se creo el usuario 42','2024-10-29 08:44:07'),(141,42,1,'rol_update','Se modifico el rol 10','2024-10-29 13:11:37'),(142,42,1,'rol_update','Se modifico el rol 10','2024-10-29 13:11:56'),(143,42,1,'rol_update','Se modifico el rol 10','2024-10-29 13:12:18'),(144,42,1,'rol_update','Se modifico el rol 10','2024-10-29 13:12:28'),(145,42,1,'rol_update','Se modifico el rol 10','2024-10-29 13:12:39'),(146,42,1,'rol_update','Se modifico el rol 20','2024-10-29 13:21:10'),(147,42,1,'rol_update','Se modifico el rol 22','2024-10-29 13:29:07'),(148,42,1,'rol_update','Se modifico el rol 21','2024-10-29 13:31:11'),(149,42,1,'rol_update','Se modifico el rol 11','2024-10-29 13:41:03'),(150,42,1,'rol_update','Se modifico el rol 24','2024-10-29 13:43:49'),(151,42,1,'rol_update','Se modifico el rol 30','2024-10-29 13:49:06'),(152,42,1,'rol_update','Se modifico el rol 29','2024-10-29 13:52:11'),(153,42,1,'rol_update','Se modifico el rol 12','2024-10-29 13:53:16'),(154,42,1,'rol_update','Se modifico el rol 28','2024-10-29 13:54:02'),(155,42,1,'rol_update','Se modifico el rol 32','2024-10-29 13:54:39'),(156,42,1,'rol_update','Se modifico el rol 29','2024-10-29 13:56:34'),(157,42,1,'rol_update','Se modifico el rol 28','2024-10-29 13:58:25'),(158,42,1,'rol_update','Se modifico el rol 11','2024-10-29 13:58:34'),(159,42,1,'rol_update','Se modifico el rol 32','2024-10-29 14:01:30'),(160,42,1,'rol_update','Se modifico el rol 24','2024-10-29 14:02:46'),(161,42,1,'rol_update','Se modifico el rol 30','2024-10-29 14:06:46'),(162,42,1,'rol_update','Se modifico el rol 25','2024-10-29 14:07:23'),(163,42,1,'rol_update','Se modifico el rol 23','2024-10-29 14:14:12'),(164,42,1,'rol_update','Se modifico el rol 10','2024-10-29 14:20:24'),(165,42,1,'rol_update','Se modifico el rol 13','2024-10-29 14:22:52'),(166,42,1,'rol_update','Se modifico el rol 10','2024-10-29 14:27:29'),(167,42,1,'rol_update','Se modifico el rol 13','2024-10-29 14:30:21'),(168,42,1,'rol_update','Se modifico el rol 16','2024-10-29 14:31:49'),(169,42,1,'rol_update','Se modifico el rol 17','2024-10-29 14:34:22'),(170,42,1,'rol_update','Se modifico el rol 18','2024-10-29 14:35:48'),(171,42,1,'rol_update','Se modifico el rol 19','2024-10-29 14:38:31'),(172,42,1,'rol_update','Se modifico el rol 20','2024-10-29 15:08:05'),(173,42,1,'rol_update','Se modifico el rol 21','2024-10-29 15:10:14'),(174,42,1,'rol_update','Se modifico el rol 22','2024-10-29 15:12:49'),(175,42,1,'rol_update','Se modifico el rol 23','2024-10-29 15:14:44'),(176,42,1,'rol_update','Se modifico el rol 24','2024-10-29 15:17:01'),(177,42,1,'rol_update','Se modifico el rol 11','2024-10-29 15:20:20'),(178,42,1,'rol_update','Se modifico el rol 12','2024-10-29 15:22:34'),(179,42,1,'rol_update','Se modifico el rol 15','2024-10-29 15:24:00'),(180,42,1,'rol_update','Se modifico el rol 25','2024-10-29 15:25:47'),(181,42,1,'rol_update','Se modifico el rol 26','2024-10-29 15:27:08'),(182,42,1,'rol_update','Se modifico el rol 27','2024-10-29 15:28:22'),(183,42,1,'rol_update','Se modifico el rol 28','2024-10-29 15:32:57'),(184,42,1,'rol_update','Se modifico el rol 29','2024-10-29 15:35:02'),(185,42,1,'rol_update','Se modifico el rol 30','2024-10-29 15:36:18'),(186,42,1,'rol_update','Se modifico el rol 31','2024-10-29 15:38:23'),(187,42,1,'rol_update','Se modifico el rol 32','2024-10-29 15:39:51'),(188,42,1,'rol_update','Se modifico el rol 11','2024-10-29 15:40:39'),(189,42,1,'rol_update','Se modifico el rol 11','2024-10-29 15:41:26'),(190,42,1,'rol_update','Se modifico el rol 11','2024-10-29 15:41:46'),(191,4,1,'rol_update','Se modifico el rol 1','2024-10-29 15:43:52'),(192,4,1,'rol_update','Se modifico el rol 1','2024-10-29 15:47:12'),(193,4,1,'solicitud_create','Se creo la solicitud 8','2024-10-30 21:48:00'),(194,4,1,'solicitud_update','Se modifico la solicitud 8','2024-10-30 21:52:38'),(195,4,1,'usuario_update','Se modifico el usuario 30','2024-10-31 21:29:07'),(196,30,2,'solicitud_create','Se creo la solicitud 12','2024-10-31 21:33:32'),(197,4,1,'solicitud_accept','Se acepto la solicitud 12','2024-10-31 21:34:46'),(198,4,1,'transferencia_create','Se creo la transferencia 1','2024-11-01 00:23:55'),(199,4,1,'transferencia_create','Se creo la transferencia 2','2024-11-01 00:44:37'),(200,4,1,'transferencia_create','Se creo la transferencia 3','2024-11-01 13:16:17'),(201,4,1,'transferencia_delete','Se cancelo la transferencia 3','2024-11-01 13:36:41'),(202,4,1,'transferencia_delete','Se cancelo la transferencia 3','2024-11-01 13:38:23'),(203,4,1,'transferencia_delete','Se cancelo la transferencia 3','2024-11-01 13:38:52'),(204,4,1,'transferencia_create','Se creo la transferencia 4','2024-11-01 20:12:20'),(205,4,1,'transferencia_delete','Se cancelo la transferencia 4','2024-11-01 20:14:49'),(206,4,1,'recepcion_create','Recepciono la transferencia 1','2024-11-02 00:09:09'),(207,4,1,'rol_update','Se modifico el rol 1','2024-11-02 00:09:45'),(208,4,1,'recepcion_create','Recepciono la transferencia 2','2024-11-02 13:12:15'),(209,4,1,'transferencia_create','Se creo la transferencia 5','2024-11-02 13:17:29'),(210,4,2,'perdida_create','Se creo la perdida 8','2024-11-02 19:33:33'),(211,4,2,'perdida_create','Se registró una perdida de 1 de el producto 1 a un precio de 10','2024-11-02 19:46:03'),(212,4,3,'perdida_create','Se registró una perdida de 11 de el producto 2 a un precio de 22','2024-11-02 19:53:03'),(213,4,2,'perdida_create','Se registró una perdida de 10 de el producto 1 a un precio de 12','2024-11-02 20:52:07'),(214,4,2,'perdida_create','Se registró una perdida de 4 de el producto 1 a un precio de 9','2024-11-02 20:52:12'),(215,4,2,'perdida_create','Se registró una perdida de 5 de el producto 2 a un precio de 20','2024-11-02 20:52:16'),(216,4,1,'usuario_update','Se modifico el usuario 1','2024-11-02 22:30:27'),(217,4,1,'rol_update','Se modifico el rol 1','2024-11-02 23:41:52'),(218,4,1,'rol_update','Se modifico el rol 1','2024-11-02 23:42:15'),(219,4,1,'solicitud_create','Se creo la solicitud 13','2024-11-02 23:47:45'),(220,4,1,'solicitud_create','Se creo la solicitud 14','2024-11-02 23:49:45'),(221,42,1,'usuario_update','Se modifico el usuario 1','2024-11-03 14:45:58'),(222,1,1,'producto_desactivado','Se deshabilito el producto 440','2024-11-03 21:13:31'),(223,1,1,'producto_activate','Se habilito el producto 440','2024-11-03 21:13:43'),(224,42,1,'rol_create','Se creo el rol 34','2024-11-03 21:13:53'),(225,1,1,'solicitud_delete','Se cancelo la solicitud 8','2024-11-03 21:17:05'),(226,1,1,'usuario_create','Se creo el usuario 43','2024-11-03 21:30:01'),(227,1,1,'rol_update','Se modifico el rol 11','2024-11-03 21:30:48'),(228,43,2,'usuario_delete','Se deshabilito el usuario 35','2024-11-03 21:39:12'),(229,43,2,'usuario_activate','Se habilito el usuario 35','2024-11-03 21:39:19'),(230,43,2,'usuario_update','Se modifico el usuario 35','2024-11-03 21:39:40'),(242,35,2,'usuario_update','Se modifico el usuario 43','2024-11-03 22:10:00'),(243,43,2,'usuario_update','Se modifico el usuario 43','2024-11-03 22:10:25'),(245,43,2,'usuario_update','Se modifico el usuario 43','2024-11-03 22:13:38'),(246,43,2,'rol_create','Se creo el rol 35','2024-11-03 22:17:50'),(247,1,1,'usuario_update','Se modifico el usuario 25','2024-11-03 22:35:30'),(248,1,1,'usuario_update','Se modifico el usuario 18','2024-11-03 22:35:45'),(249,43,2,'rol_update','Se modifico el rol 11','2024-11-03 22:37:40'),(250,1,1,'rol_update','Se modifico el rol 12','2024-11-03 22:42:19'),(251,1,1,'rol_update','Se modifico el rol 11','2024-11-03 22:46:18'),(252,43,2,'rol_update','Se modifico el rol 27','2024-11-03 22:47:49'),(253,43,2,'rol_update','Se modifico el rol 27','2024-11-03 22:50:39'),(254,43,2,'rol_update','Se modifico el rol 27','2024-11-03 22:51:52'),(255,43,2,'rol_update','Se modifico el rol 27','2024-11-03 22:52:15'),(256,43,2,'rol_update','Se modifico el rol 27','2024-11-03 22:53:19'),(257,43,2,'rol_update','Se modifico el rol 27','2024-11-03 22:53:46'),(258,43,2,'rol_update','Se modifico el rol 27','2024-11-03 22:55:18'),(259,43,2,'rol_update','Se modifico el rol 27','2024-11-03 22:56:03'),(260,1,1,'rol_update','Se modifico el rol 28','2024-11-03 22:59:26'),(261,1,1,'usuario_update','Se modifico el usuario 2','2024-11-03 23:00:09'),(262,1,1,'rol_update','Se modifico el rol 29','2024-11-03 23:01:13'),(263,1,1,'rol_update','Se modifico el rol 28','2024-11-03 23:02:15'),(264,1,1,'rol_update','Se modifico el rol 28','2024-11-03 23:02:41'),(265,2,1,'rol_delete','Se deshabilito el rol 34','2024-11-03 23:06:32'),(266,2,1,'rol_activate','Se habilito el rol 34','2024-11-03 23:06:39'),(267,43,2,'solicitud_create','Se creo la solicitud 15','2024-11-03 23:37:29'),(268,1,1,'usuario_update','Se modifico el usuario 1','2024-11-04 18:56:27'),(269,4,1,'usuario_update','Se modifico el usuario 1','2024-11-05 18:25:23'),(270,9,1,'usuario_update','Se modifico el usuario 43','2024-11-05 19:25:20'),(271,43,3,'rol_update','Se modifico el rol 29','2024-11-05 19:31:46'),(272,43,3,'rol_update','Se modifico el rol 29','2024-11-05 19:32:32'),(273,9,1,'rol_update','Se modifico el rol 29','2024-11-05 19:36:42'),(274,43,3,'rol_update','Se modifico el rol 29','2024-11-05 19:38:35'),(275,43,3,'rol_update','Se modifico el rol 29','2024-11-05 19:39:42'),(276,43,3,'rol_update','Se modifico el rol 29','2024-11-05 19:39:47'),(277,9,1,'usuario_update','Se modifico el usuario 43','2024-11-05 19:40:32'),(278,9,1,'usuario_update','Se modifico el usuario 43','2024-11-05 19:41:20'),(279,9,1,'usuario_update','Se modifico el usuario 43','2024-11-05 19:42:35'),(280,9,1,'rol_update','Se modifico el rol 33','2024-11-05 19:56:28'),(281,9,1,'solicitud_create','Se creo la solicitud 16','2024-11-05 20:00:53'),(282,9,1,'solicitud_create','Se creo la solicitud 17','2024-11-05 20:02:59'),(283,9,1,'solicitud_delete','Se cancelo la solicitud 17','2024-11-05 20:04:22'),(284,1,1,'rol_update','Se modifico el rol 1','2024-11-11 17:05:50'),(285,1,1,'rol_update','Se modifico el rol 1','2024-11-11 17:21:08'),(286,9,1,'usuario_create','Se creo el usuario 44','2024-11-11 18:03:07'),(287,9,1,'usuario_update','Se modifico el usuario 44','2024-11-11 18:31:42'),(288,1,1,'rol_update','Se modifico el rol 1','2024-11-11 18:33:21'),(289,1,1,'rol_update','Se modifico el rol 1','2024-11-11 18:34:04'),(290,1,1,'rol_update','Se modifico el rol 1','2024-11-11 19:19:30'),(291,1,1,'rol_update','Se modifico el rol 11','2024-11-11 19:23:12'),(292,2,1,'rol_update','Se modifico el rol 28','2024-11-11 19:24:41'),(293,1,1,'rol_update','Se modifico el rol 1','2024-11-12 16:20:03'),(294,1,1,'compra_create','Creo la compra 1','2024-11-12 21:16:48'),(295,1,1,'compra_create','Creo la compra 2','2024-11-12 21:18:30'),(296,4,1,'compra_delete','Se cancelo la compra 1','2024-11-14 22:18:37'),(297,4,1,'compra_delete','Se cancelo la compra 1','2024-11-14 22:24:19'),(298,1,1,'compra_create','Creo la compra 3','2024-11-14 23:11:12'),(299,1,1,'compra_delete','Se cancelo la compra 3','2024-11-14 23:13:08'),(300,4,1,'compra_create','Creo la compra 4','2024-11-14 23:14:53'),(301,4,1,'compra_create','Creo la compra 6','2024-11-14 23:28:31'),(302,1,1,'compra_create','Creo la compra 7','2024-11-14 23:55:01'),(303,1,1,'compra_create','Creo la compra 8','2024-11-15 00:02:48'),(304,1,1,'compra_create','Creo la compra 9','2024-11-15 00:07:33'),(305,4,1,'compra_create','Creo la compra 10','2024-11-15 00:18:21'),(306,4,1,'compra_create','Creo la compra 11','2024-11-15 00:23:45'),(307,1,1,'alerta_desactivada','Se deshabilito la alerta 1','0001-01-01 00:00:00'),(308,1,1,'alerta_Activada','Se activado la alerta 1','0001-01-01 00:00:00'),(309,1,1,'stock_minimo_update','Se modifico el stock minimo 1','0001-01-01 00:00:00'),(310,1,1,'stock_minimo_update','Se modifico el stock minimo 1','0001-01-01 00:00:00'),(311,1,1,'stock_minimo_update','Se modifico el stock minimo 1','0001-01-01 00:00:00'),(312,1,1,'stock_minimo_update','Se modifico el stock minimo 1','0001-01-01 00:00:00'),(313,1,1,'stock_minimo_update','Se modifico el stock minimo 1','0001-01-01 00:00:00'),(314,1,1,'stock_minimo_update','Se modifico el stock minimo 1','0001-01-01 00:00:00'),(315,1,1,'stock_minimo_update','Se modifico el stock minimo 1','0001-01-01 00:00:00'),(316,1,1,'stock_minimo_update','Se modifico el stock minimo 1','0001-01-01 00:00:00'),(317,1,1,'stock_minimo_update','Se modifico el stock minimo 1','0001-01-01 00:00:00'),(318,1,1,'stock_minimo_update','Se modifico el stock minimo 1','0001-01-01 00:00:00'),(319,1,1,'stock_minimo_update','Se modifico el stock minimo 1','0001-01-01 00:00:00'),(320,1,1,'stock_minimo_update','Se modifico el stock minimo 1','0001-01-01 00:00:00'),(321,4,1,'rol_update','Se modifico el rol 1','2024-11-15 19:31:10'),(322,1,1,'stock_minimo_update','Se modifico el stock minimo 1','0001-01-01 00:00:00'),(323,1,1,'stock_minimo_update','Se modifico el stock minimo 1','0001-01-01 00:00:00'),(324,1,1,'stock_minimo_update','Se modifico el stock minimo 1','0001-01-01 00:00:00'),(325,4,1,'bodega_create','Se creo la bodega 5','2024-11-15 20:01:51'),(326,4,1,'bodega_update','Se modifico la bodega 5','2024-11-15 20:02:38'),(327,4,1,'bodega_create','Se creo la bodega 6','2024-11-15 20:18:58'),(328,4,1,'bodega_desactivado','Se deshabilito la bodega 6','2024-11-15 20:19:23'),(329,4,1,'rol_update','Se modifico el rol 1','2024-11-15 20:19:45'),(330,4,1,'bodega_activado','Se habilito la bodega 6','2024-11-15 20:20:41'),(331,4,1,'rol_update','Se modifico el rol 1','2024-11-16 00:46:05'),(332,4,1,'distribuidor_update','Se modifico el distribuidor 1','2024-11-16 01:03:37'),(333,4,1,'distribuidor_update','Se modifico el distribuidor 1','2024-11-16 01:03:47'),(334,4,1,'distribuidor_create','Se creo el distribuidor 2','2024-11-16 01:04:17'),(335,4,1,'distribuidor_desactivado','Se deshabilito el distribuidor 2','2024-11-16 01:04:32'),(336,4,1,'distribuidor_activado','Se habilito el distribuidor 2','2024-11-16 01:04:40'),(337,4,1,'distribuidor_create','Se creo el distribuidor 3','2024-11-16 01:05:24'),(338,4,1,'rol_update','Se modifico el rol 1','2024-11-16 13:29:18'),(339,9,1,'rol_delete','Se deshabilito el rol 25','2024-11-16 15:10:16'),(340,2,1,'rol_update','Se modifico el rol 28','2024-11-16 16:26:48'),(341,4,1,'usuario_update','Se modifico el usuario 2','2024-11-16 16:28:33'),(342,2,2,'rol_update','Se modifico el rol 11','2024-11-16 16:28:59'),(343,2,2,'solicitud_create','Se creo la solicitud 18','2024-11-16 16:31:58'),(344,4,1,'solicitud_delete','Se cancelo la solicitud 15','2024-11-16 16:32:55'),(345,4,1,'solicitud_accept','Se acepto la solicitud 18','2024-11-16 16:33:12'),(346,4,1,'transferencia_create','Se creo la transferencia 10','2024-11-16 16:38:40');
/*!40000 ALTER TABLE `Auditorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Bodegas`
--

DROP TABLE IF EXISTS `Bodegas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Bodegas` (
  `bodega_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `tipo_bodega_id` int NOT NULL,
  `estado_bodega_id` int NOT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`bodega_id`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `tipo_bodega_id` (`tipo_bodega_id`),
  KEY `estado_bodega_id` (`estado_bodega_id`),
  CONSTRAINT `Bodegas_ibfk_1` FOREIGN KEY (`tipo_bodega_id`) REFERENCES `Tipos_Bodega` (`tipo_bodega_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Bodegas_ibfk_2` FOREIGN KEY (`estado_bodega_id`) REFERENCES `Estados_Bodegas` (`estado_bodega_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bodegas`
--

LOCK TABLES `Bodegas` WRITE;
/*!40000 ALTER TABLE `Bodegas` DISABLE KEYS */;
INSERT INTO `Bodegas` VALUES (1,'Casa Central','Calle Principal 123, Ciudad',1,1,'2024-10-09 16:14:50','2024-10-09 16:14:50'),(2,'Bodega Pequeña 1','Calle Secundaria 456, Ciudad',2,1,'2024-10-09 16:14:50','2024-10-09 16:14:50'),(3,'Bodega Pequeña 2','Avenida Tercera 789, Ciudad',2,1,'2024-10-09 16:14:50','2024-10-09 16:14:50'),(4,'Bodega Central','123 Calle Principal',1,1,'2024-11-07 19:58:05','2024-11-07 19:58:05');
/*!40000 ALTER TABLE `Bodegas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Compra`
--

DROP TABLE IF EXISTS `Compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Compra` (
  `compra_id` int NOT NULL AUTO_INCREMENT,
  `bodega_id` int NOT NULL,
  `distribuidor_id` int NOT NULL,
  `documento_url` text,
  `observacion` text NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_cancelado` datetime DEFAULT NULL,
  PRIMARY KEY (`compra_id`),
  KEY `fk_bodega_idx` (`bodega_id`),
  KEY `fk_dis_idx` (`distribuidor_id`),
  CONSTRAINT `fk_bodega` FOREIGN KEY (`bodega_id`) REFERENCES `Bodegas` (`bodega_id`),
  CONSTRAINT `fk_dis` FOREIGN KEY (`distribuidor_id`) REFERENCES `Distribuidores` (`distribuidor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Compra`
--

LOCK TABLES `Compra` WRITE;
/*!40000 ALTER TABLE `Compra` DISABLE KEYS */;
INSERT INTO `Compra` VALUES (1,1,1,'','Compra de laptops dell','2024-11-12 21:16:38','2024-11-14 22:24:15'),(2,1,1,'','Compra de laptops','2024-11-12 21:18:24',NULL),(3,1,1,'','Compra de controladores rgb','2024-11-15 02:11:12','2024-11-15 02:13:08'),(4,1,1,'','Compra coolers','2024-11-14 23:13:57',NULL),(6,1,1,'','Compra de pendrives 64gb','2024-11-14 23:28:25',NULL),(7,1,1,'','Compra de AMAZONECHO 25 unidades','2024-11-15 02:55:01',NULL),(8,1,1,'','Compra de drones','2024-11-15 03:02:48',NULL),(9,1,1,'','Compra de proyectores','2024-11-15 03:07:33',NULL),(10,1,1,'','Impresora HP DeskJet 2700	HP2700','2024-11-15 03:18:21',NULL),(11,1,1,'/files/pdfs/11-20241115032345.pdf','Mouse pad Razer Goliathus	MOUSEPADRAZ','2024-11-15 03:23:46',NULL);
/*!40000 ALTER TABLE `Compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Compra_Detalles`
--

DROP TABLE IF EXISTS `Compra_Detalles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Compra_Detalles` (
  `detalle_id` int NOT NULL AUTO_INCREMENT,
  `compra_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_compra` int NOT NULL,
  PRIMARY KEY (`detalle_id`),
  KEY `fk_compra_idx` (`compra_id`),
  KEY `fk_producto_idx` (`producto_id`),
  CONSTRAINT `fk_compra` FOREIGN KEY (`compra_id`) REFERENCES `Compra` (`compra_id`),
  CONSTRAINT `fk_producto` FOREIGN KEY (`producto_id`) REFERENCES `Productos` (`producto_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Compra_Detalles`
--

LOCK TABLES `Compra_Detalles` WRITE;
/*!40000 ALTER TABLE `Compra_Detalles` DISABLE KEYS */;
INSERT INTO `Compra_Detalles` VALUES (1,1,180,30,500000),(2,2,180,15,450000),(3,3,1,60,4000),(4,4,13,30,55000),(5,6,182,100,3500),(6,7,286,25,14500),(7,8,185,15,120000),(8,9,162,10,250000),(9,10,171,40,56000),(10,11,424,60,15000);
/*!40000 ALTER TABLE `Compra_Detalles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Detalles_Solicitudes_Inventario`
--

DROP TABLE IF EXISTS `Detalles_Solicitudes_Inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Detalles_Solicitudes_Inventario` (
  `detalle_id` int NOT NULL AUTO_INCREMENT,
  `solicitud_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL,
  PRIMARY KEY (`detalle_id`),
  KEY `idx_detalles_solicitudes_producto` (`producto_id`),
  KEY `Detalles_Solicitudes_Inventario_ibfk_1` (`solicitud_id`),
  CONSTRAINT `Detalles_Solicitudes_Inventario_ibfk_1` FOREIGN KEY (`solicitud_id`) REFERENCES `Solicitudes_Inventario` (`solicitud_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Detalles_Solicitudes_Inventario_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `Productos` (`producto_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Detalles_Solicitudes_Inventario`
--

LOCK TABLES `Detalles_Solicitudes_Inventario` WRITE;
/*!40000 ALTER TABLE `Detalles_Solicitudes_Inventario` DISABLE KEYS */;
INSERT INTO `Detalles_Solicitudes_Inventario` VALUES (37,6,1,5),(38,6,3,56),(39,6,11,7),(40,6,2,345),(43,7,1,10),(44,7,3,55),(46,8,23,12),(47,12,1,20),(48,12,2,70),(49,15,2,1),(50,16,1,30),(51,17,3,22),(52,18,182,35);
/*!40000 ALTER TABLE `Detalles_Solicitudes_Inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Distribuidores`
--

DROP TABLE IF EXISTS `Distribuidores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Distribuidores` (
  `distribuidor_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo_electronico` varchar(255) DEFAULT NULL,
  `estado` int NOT NULL,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_modificacion` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`distribuidor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Distribuidores`
--

LOCK TABLES `Distribuidores` WRITE;
/*!40000 ALTER TABLE `Distribuidores` DISABLE KEYS */;
INSERT INTO `Distribuidores` VALUES (1,'Amazon','410 Terry Ave. N., Seattle, WA','1-888-280-4331','ventas@amazon.com',1,'2024-11-14 00:09:39','2024-11-16 01:03:45');
/*!40000 ALTER TABLE `Distribuidores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Estados_Alerta`
--

DROP TABLE IF EXISTS `Estados_Alerta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Estados_Alerta` (
  `estado_alerta_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`estado_alerta_id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Estados_Alerta`
--

LOCK TABLES `Estados_Alerta` WRITE;
/*!40000 ALTER TABLE `Estados_Alerta` DISABLE KEYS */;
INSERT INTO `Estados_Alerta` VALUES (2,'leída'),(1,'pendiente'),(3,'resuelta');
/*!40000 ALTER TABLE `Estados_Alerta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Estados_Bodegas`
--

DROP TABLE IF EXISTS `Estados_Bodegas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Estados_Bodegas` (
  `estado_bodega_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`estado_bodega_id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Estados_Bodegas`
--

LOCK TABLES `Estados_Bodegas` WRITE;
/*!40000 ALTER TABLE `Estados_Bodegas` DISABLE KEYS */;
INSERT INTO `Estados_Bodegas` VALUES (1,'activo'),(0,'inactivo');
/*!40000 ALTER TABLE `Estados_Bodegas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Estados_Solicitud_Inventario`
--

DROP TABLE IF EXISTS `Estados_Solicitud_Inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Estados_Solicitud_Inventario` (
  `estado_solicitud_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`estado_solicitud_id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Estados_Solicitud_Inventario`
--

LOCK TABLES `Estados_Solicitud_Inventario` WRITE;
/*!40000 ALTER TABLE `Estados_Solicitud_Inventario` DISABLE KEYS */;
INSERT INTO `Estados_Solicitud_Inventario` VALUES (2,'Aprobada'),(5,'Cancelada'),(4,'Completada'),(1,'Pendiente'),(3,'Rechazada');
/*!40000 ALTER TABLE `Estados_Solicitud_Inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Estados_Transferencia`
--

DROP TABLE IF EXISTS `Estados_Transferencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Estados_Transferencia` (
  `estado_transferencia_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`estado_transferencia_id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Estados_Transferencia`
--

LOCK TABLES `Estados_Transferencia` WRITE;
/*!40000 ALTER TABLE `Estados_Transferencia` DISABLE KEYS */;
INSERT INTO `Estados_Transferencia` VALUES (4,'Cancelada'),(3,'Completada'),(2,'En transito'),(1,'Pendiente');
/*!40000 ALTER TABLE `Estados_Transferencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Estados_Usuarios`
--

DROP TABLE IF EXISTS `Estados_Usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Estados_Usuarios` (
  `estado_usuario_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`estado_usuario_id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Estados_Usuarios`
--

LOCK TABLES `Estados_Usuarios` WRITE;
/*!40000 ALTER TABLE `Estados_Usuarios` DISABLE KEYS */;
INSERT INTO `Estados_Usuarios` VALUES (1,'activo'),(0,'inactivo');
/*!40000 ALTER TABLE `Estados_Usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Inventario`
--

DROP TABLE IF EXISTS `Inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Inventario` (
  `inventario_id` int NOT NULL AUTO_INCREMENT,
  `bodega_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int DEFAULT '0',
  `fecha_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`inventario_id`),
  UNIQUE KEY `uniq_bodega_producto` (`bodega_id`,`producto_id`),
  KEY `producto_id` (`producto_id`),
  KEY `idx_inventario_bodega` (`bodega_id`),
  CONSTRAINT `Inventario_ibfk_1` FOREIGN KEY (`bodega_id`) REFERENCES `Bodegas` (`bodega_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Inventario_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `Productos` (`producto_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Inventario`
--

LOCK TABLES `Inventario` WRITE;
/*!40000 ALTER TABLE `Inventario` DISABLE KEYS */;
INSERT INTO `Inventario` VALUES (1,1,1,61,'2024-11-14 23:13:08'),(2,1,2,120,'2024-11-02 13:17:28'),(3,2,1,66,'2024-11-02 20:52:10'),(4,3,2,73,'2024-11-02 19:53:02'),(5,2,2,20,'2024-11-02 20:52:15'),(6,3,1,4,'2024-11-02 13:12:07'),(7,1,180,15,'2024-11-14 22:24:17'),(8,1,13,30,'2024-11-14 23:14:51'),(9,1,182,65,'2024-11-16 16:38:39'),(10,1,286,25,'2024-11-15 02:55:01'),(11,1,185,15,'2024-11-15 03:02:49'),(12,1,162,10,'2024-11-15 03:07:34'),(13,1,171,40,'2024-11-15 03:18:22'),(14,1,424,60,'2024-11-15 03:23:46');
/*!40000 ALTER TABLE `Inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Lotes_Inventario`
--

DROP TABLE IF EXISTS `Lotes_Inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Lotes_Inventario` (
  `lote_id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `bodega_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_compra` int NOT NULL,
  `fecha_compra` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_vencimiento` datetime DEFAULT NULL,
  PRIMARY KEY (`lote_id`),
  KEY `bodega_id` (`bodega_id`),
  KEY `idx_lotes_inventario_producto` (`producto_id`),
  KEY `idx_lotes_inventario_fecha_compra` (`fecha_compra`),
  CONSTRAINT `Lotes_Inventario_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `Productos` (`producto_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Lotes_Inventario_ibfk_2` FOREIGN KEY (`bodega_id`) REFERENCES `Bodegas` (`bodega_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Lotes_Inventario`
--

LOCK TABLES `Lotes_Inventario` WRITE;
/*!40000 ALTER TABLE `Lotes_Inventario` DISABLE KEYS */;
INSERT INTO `Lotes_Inventario` VALUES (1,1,1,61,10,'2024-10-09 16:14:50',NULL),(2,2,1,120,20,'2024-10-09 16:14:50',NULL),(3,1,2,40,12,'2024-10-09 16:14:50',NULL),(4,2,3,69,22,'2024-10-09 16:14:51',NULL),(5,1,1,0,9,'2024-10-21 20:42:21',NULL),(6,1,2,11,10,'2024-11-01 13:36:38',NULL),(7,1,2,15,9,'2024-11-02 00:09:01',NULL),(8,2,2,20,20,'2024-11-02 00:09:05',NULL),(9,1,3,4,10,'2024-11-02 13:12:06',NULL),(10,2,3,4,20,'2024-11-02 13:12:10',NULL),(14,180,1,0,500000,'2024-11-12 21:16:43',NULL),(15,180,1,15,450000,'2024-11-12 21:18:27',NULL),(16,1,1,0,4000,'2024-11-15 02:11:13',NULL),(17,13,1,30,55000,'2024-11-14 23:14:50',NULL),(18,182,1,65,3500,'2024-11-14 23:28:28',NULL),(19,286,1,25,14500,'2024-11-15 02:55:01',NULL),(20,185,1,15,120000,'2024-11-15 03:02:49',NULL),(21,162,1,10,250000,'2024-11-15 03:07:34',NULL),(22,171,1,40,56000,'2024-11-15 03:18:22',NULL),(23,424,1,60,15000,'2024-11-15 03:23:46',NULL);
/*!40000 ALTER TABLE `Lotes_Inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Perdidas`
--

DROP TABLE IF EXISTS `Perdidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Perdidas` (
  `perdida_id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `bodega_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `tipo_perdida_id` int NOT NULL,
  `descripcion` text,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `usuario_id` int NOT NULL,
  `precio_compra` int NOT NULL,
  PRIMARY KEY (`perdida_id`),
  KEY `producto_id` (`producto_id`),
  KEY `bodega_id` (`bodega_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `idx_perdidas_tipo_perdida` (`tipo_perdida_id`),
  CONSTRAINT `Perdidas_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `Productos` (`producto_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Perdidas_ibfk_2` FOREIGN KEY (`bodega_id`) REFERENCES `Bodegas` (`bodega_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Perdidas_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios` (`usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Perdidas_ibfk_4` FOREIGN KEY (`tipo_perdida_id`) REFERENCES `Tipos_Perdida` (`tipo_perdida_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Perdidas`
--

LOCK TABLES `Perdidas` WRITE;
/*!40000 ALTER TABLE `Perdidas` DISABLE KEYS */;
INSERT INTO `Perdidas` VALUES (1,1,2,1,1,'Dañado durante el envío','2024-11-02 00:09:03',4,9),(2,2,2,5,2,'Perdida durante el envío','2024-11-02 00:09:07',4,20),(3,1,3,1,1,'Dañado durante el envío','2024-11-02 13:12:08',4,10),(4,2,3,1,2,'Perdida durante el envío','2024-11-02 13:12:12',4,20),(8,1,2,1,1,'Daño en bodega','2024-11-02 19:33:30',4,10),(9,1,2,1,1,'Daño por perdida','2024-11-02 19:45:42',4,10),(10,2,3,11,3,'xd','2024-11-02 19:52:59',4,22),(11,1,2,10,3,'Robo en bodega','2024-11-02 20:52:03',4,12),(12,1,2,4,3,'Robo en bodega','2024-11-02 20:52:08',4,9),(13,2,2,5,3,'Robo en bodega','2024-11-02 20:52:13',4,20);
/*!40000 ALTER TABLE `Perdidas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Permisos`
--

DROP TABLE IF EXISTS `Permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Permisos` (
  `permiso_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`permiso_id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Permisos`
--

LOCK TABLES `Permisos` WRITE;
/*!40000 ALTER TABLE `Permisos` DISABLE KEYS */;
INSERT INTO `Permisos` VALUES (1,'r_usuarios_global','Read usuarios por global','2024-10-14 01:21:42','2024-10-16 15:13:08'),(2,'r_usuarios_bodega','Read usuarios por bodega','2024-10-14 01:21:42','2024-10-16 15:13:08'),(3,'cu_usuarios_global','Create/Update usuarios global','2024-10-14 00:08:11','2024-10-16 15:13:07'),(4,'cu_usuarios_bodega','Create/Update usuarios por bodega','2024-10-14 00:08:11','2024-10-16 15:13:09'),(5,'d_usuarios_global','Delete usuarios por global','2024-10-14 01:44:33','2024-10-16 15:13:09'),(6,'d_usuarios_bodega','Delete usuarios por bodega','2024-10-14 01:44:33','2024-10-16 15:13:10'),(7,'a_usuarios_global','Activate  usuarios por global','2024-10-14 02:04:32','2024-10-16 15:13:10'),(8,'a_usuarios_bodega','Activate usuarios por bodega','2024-10-14 02:04:32','2024-10-16 15:13:10'),(9,'r_roles_global','Read roles por global','2024-10-18 00:53:16','2024-10-18 00:53:16'),(10,'r_roles_bodega','Read roles por bodega','2024-10-18 00:53:16','2024-10-18 00:53:16'),(11,'cu_roles_global','Create/Update roles global','2024-10-18 00:53:16','2024-10-18 00:53:16'),(12,'cu_roles_bodega','Create/Update roles por bodega','2024-10-18 00:53:16','2024-10-18 00:53:16'),(13,'d_roles_global','Delete roles por global','2024-10-18 00:53:16','2024-10-18 00:53:16'),(14,'d_roles_bodega','Delete roles por bodega','2024-10-18 00:53:16','2024-10-18 00:53:16'),(15,'a_roles_global','Activate  roles por global','2024-10-18 00:53:16','2024-10-18 00:53:16'),(16,'a_roles_bodega','Activate roles por bodega','2024-10-18 00:53:17','2024-10-18 00:53:17'),(17,'r_productos_global','Read productos por global','2024-10-18 01:58:03','2024-11-03 22:30:17'),(18,'r_productos_bodega','Read productos por bodega','2024-11-03 22:30:17','2024-11-03 22:30:17'),(19,'cu_productos_global','Create/Update productos por global','2024-10-18 01:58:17','2024-11-03 22:47:02'),(20,'a_productos_global','Activate productos por global','2024-10-18 01:58:17','2024-11-03 22:30:41'),(21,'d_productos_global','Delete productos por global','2024-10-18 01:58:17','2024-11-03 22:30:41'),(22,'r_inventarios_global','Read inventarios por global ','2024-10-21 20:07:40','2024-10-21 20:07:40'),(23,'r_inventarios_bodega','Read inventarios por bodega','2024-10-21 20:07:40','2024-10-21 20:07:40'),(24,'r_solicitudes_global','Read solicitudes por global ','2024-10-21 20:07:40','2024-10-23 20:38:11'),(26,'r_solicitudes_bodega','Read solicitudes por bodega','2024-10-23 20:38:11','2024-10-23 20:38:11'),(27,'cu_solicitudes_global','Create/Update solicitudes global','2024-10-23 23:38:55','2024-10-23 23:38:55'),(28,'cu_solicitudes_bodega','Create/Update solicitudes por bodega','2024-10-23 23:38:56','2024-10-23 23:38:56'),(35,'d_solicitudes_global','Cancel solicitudes por global','2024-10-24 22:01:27','2024-10-25 21:31:19'),(36,'d_solicitudes_bodega','Cancel solicitudes por bodega','2024-10-24 22:01:27','2024-10-25 21:31:20'),(37,'ad_solicitudes_global','Accept/Deny solicitudes por global','2024-10-25 21:31:20','2024-11-03 22:31:03'),(39,'r_transferencias_global','Read transferencias por global ','2024-11-11 17:03:56','2024-11-11 17:03:56'),(40,'r_transferencias_bodega','Read transferencias por bodega','2024-11-11 17:03:56','2024-11-11 17:03:56'),(41,'c_transferencias_global','Create transferencias por global','2024-11-11 17:19:19','2024-11-11 17:19:19'),(42,'d_transferencias_global','Delete transferencias por global','2024-11-11 17:20:56','2024-11-11 18:33:42'),(43,'c_recepciones_global','Create recepciones por global','2024-11-11 17:20:57','2024-11-11 18:33:42'),(45,'c_recepciones_bodega','Create recepciones por bodega','2024-11-11 18:52:24','2024-11-11 18:52:24'),(46,'r_perdidas_global','Read perdidas por global ','2024-11-11 19:11:57','2024-11-11 19:11:57'),(47,'r_perdidas_bodega','Read perdidas por bodega','2024-11-11 19:11:57','2024-11-11 19:11:57'),(48,'c_perdidas_global','Create perdidas por global ','2024-11-11 19:11:57','2024-11-11 19:11:57'),(49,'c_perdidas_bodega','Create perdidas por bodega','2024-11-11 19:11:57','2024-11-11 19:11:57'),(50,'r_compras_global','Read compras por global ','2024-11-12 16:19:50','2024-11-12 16:19:50'),(51,'c_compras_global','Create compras por global ','2024-11-12 16:19:50','2024-11-12 16:42:37'),(52,'d_compras_global','Delete compras por global ','2024-11-12 16:19:50','2024-11-12 16:19:50'),(53,'r_bodegas_global','Read bodegas por global ','2024-11-15 19:29:56','2024-11-15 19:29:56'),(54,'cu_bodegas_global','Create/Update bodegas global','2024-11-15 19:30:53','2024-11-15 19:30:53'),(55,'d_bodegas_global','Delete bodegas por global','2024-11-15 19:30:54','2024-11-15 19:30:54'),(56,'a_bodegas_global','Activate bodegas por global','2024-11-15 20:12:49','2024-11-15 20:12:49'),(57,'r_distribuidores_global','Read distribuidores por global ','2024-11-15 22:08:08','2024-11-15 22:08:08'),(58,'cu_distribuidores_global','Create/Update distribuidores global','2024-11-15 22:08:08','2024-11-15 22:08:08'),(59,'d_distribuidores_global','Delete distribuidores por global','2024-11-15 22:08:08','2024-11-15 22:08:08'),(60,'a_distribuidores_global','Activate distribuidores por global','2024-11-15 22:08:08','2024-11-15 22:08:08'),(61,'r_alarmas_global','Read alarmas por global','2024-11-16 13:15:01','2024-11-16 13:15:01'),(62,'r_alarmas_bodega','Read alarmas por bodega ','2024-11-16 13:15:01','2024-11-16 13:15:01'),(63,'u_alarmas_global','Update alarmas global','2024-11-16 13:15:01','2024-11-16 13:15:01'),(64,'u_alarmas_bodega','Update alarmas bodega','2024-11-16 13:15:02','2024-11-16 13:15:02'),(65,'d_alarmas_global','Delete alarmas por global','2024-11-16 13:15:02','2024-11-16 13:15:02'),(66,'d_alarmas_bodega','Delete alarmas por bodega','2024-11-16 13:15:02','2024-11-16 13:15:02'),(67,'a_alarmas_global','Activate alarmas por global','2024-11-16 13:15:02','2024-11-16 13:15:02'),(68,'a_alarmas_bodega','Activate alarmas por bodega','2024-11-16 13:15:02','2024-11-16 13:15:02');
/*!40000 ALTER TABLE `Permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Productos`
--

DROP TABLE IF EXISTS `Productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Productos` (
  `producto_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `codigo` varchar(200) NOT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `unidad_medida` varchar(100) DEFAULT NULL,
  `precio_venta` int DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `estado` int NOT NULL,
  PRIMARY KEY (`producto_id`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `idx_productos_categoria` (`categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=441 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Productos`
--

LOCK TABLES `Productos` WRITE;
/*!40000 ALTER TABLE `Productos` DISABLE KEYS */;
INSERT INTO `Productos` VALUES (1,'Controlador RGB Corsair','CTRLRGBCORS','Hardware PC','caja',20000,'2024-10-09 16:14:50','2024-10-29 07:48:53',1),(2,'Cable DisplayPort 1.4','CABDISPLAY1_4','Hardware PC','caja',10000,'2024-10-09 16:14:50','2024-10-29 07:49:15',1),(3,'Tarjeta de sonido Creative Sound Blaster Z','SOUNDBLASTERZ','Hardware PC','caja',90000,'0001-01-01 00:00:00','2024-10-29 07:49:41',1),(9,'Switch HDMI 4K UGREEN','HDMISWITCHUGREEN','Hardware PC','caja',18000,'0001-01-01 00:00:00','2024-10-29 07:50:14',1),(10,'Receptor USB Logitech Unifying','USBRECEPLOG','Hardware PC','caja',25000,'0001-01-01 00:00:00','2024-10-29 07:50:39',1),(11,'Kit de ventiladores NZXT AER RGB 2','VENTNZXTAER','Hardware PC','caja',60000,'0001-01-01 00:00:00','2024-10-29 07:47:49',1),(12,'Unidad SSD Samsung 980 1TB','SSDSAMS9801TB','Hardware PC','caja',125000,'0001-01-01 00:00:00','2024-10-29 07:46:47',1),(13,'Enfriador de CPU Noctua NH-U12S','COOLCPUU12S','Hardware PC','caja',80000,'0001-01-01 00:00:00','2024-10-29 07:47:17',1),(22,'Fuente de Poder Corsair 750W','PSU750WCOR','Fuentes de Poder','unidad',74990,'2024-01-22 00:00:00','2024-01-23 00:00:00',1),(23,'Fuente de Poder Thermaltake 500W','PSU500WTK','Fuentes de Poder','unidad',44990,'2024-01-23 00:00:00','2024-01-24 00:00:00',1),(24,'Fuente de Poder NZXT 850W','PSU850WNZXT','Fuentes de Poder','unidad',99990,'2024-01-24 00:00:00','2024-01-25 00:00:00',1),(25,'Gabinete Gamer Cougar MX330','CASEMX330','Gabinetes','unidad',29990,'2024-01-25 00:00:00','2024-01-26 00:00:00',1),(26,'Gabinete NZXT H510','CASEH510','Gabinetes','unidad',89990,'2024-01-26 00:00:00','2024-01-27 00:00:00',1),(27,'Gabinete Corsair Carbide SPEC-04','CASESPEC04','Gabinetes','unidad',59990,'2024-01-27 00:00:00','2024-01-28 00:00:00',1),(28,'Gabinete Thermaltake Versa H18','CASEH18','Gabinetes','unidad',49990,'2024-01-28 00:00:00','2024-01-29 00:00:00',1),(29,'Monitor LG 24\" FHD 75Hz','MON24LG','Monitores','unidad',129990,'2024-01-29 00:00:00','2024-01-30 00:00:00',1),(30,'Monitor Samsung 27\" Curved FHD','MON27SAMSUNG','Monitores','unidad',179990,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(132,'Monitor Acer 27\" QHD','MON27ACER','Monitores','unidad',199990,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(133,'Tarjeta Gráfica AMD Radeon RX 6700 XT','AMDRX6700','Tarjetas Gráficas','unidad',550000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(134,'Procesador AMD Ryzen 5 5600X','AMDR5600X','Procesadores','unidad',299990,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(135,'Placa Madre Gigabyte B450 AORUS','GIGAB450A','Placas Madres','unidad',160000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(136,'Memoria RAM Kingston HyperX 16GB','KHX16GB','Memorias','unidad',95000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(137,'HDD Seagate Barracuda 2TB','HDD2TBSEAG','Almacenamiento','unidad',60000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(138,'Fuente de Poder Cooler Master 650W','CM650W','Fuentes de Poder','unidad',70000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(139,'Caja de PC NZXT H510i','NZXTH510I','Cajas','unidad',85000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(140,'Refrigeración Líquida Corsair H100i','CORH100I','Refrigeración','unidad',180000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(141,'Monitor Dell UltraSharp 24\"','DELL24ULTRA','Monitores','unidad',280000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(142,'Teclado Mecánico Corsair K70 RGB','CORK70RGB','Teclados','unidad',120000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(143,'Ratón Gaming Razer DeathAdder V2','RAZHDAV2','Ratones','unidad',90000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(144,'Altavoces Bose Companion 2','BOSECOMP2','Audio','unidad',150000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(145,'Webcam Logitech Brio 4K','LOGBRIO4K','Webcams','unidad',250000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(146,'Tarjeta de Sonido Behringer UMC22','BEHUMC22','Audio','unidad',70000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(147,'Cable USB 3.0 de 1 metro','USB3M','Accesorios','unidad',10000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(148,'Hub USB 3.0 Sabrent','SABUSB3','Accesorios','unidad',25000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(149,'Adaptador de Red D-Link DWA-171','DWA171','Red','unidad',20000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(150,'Tarjeta Madre ASRock B450M Pro4','ASRPRO4','Placas Madres','unidad',110000,'2024-01-30 00:00:00','2024-01-31 00:00:00',1),(151,'Smartphone Samsung Galaxy S21','SAMSUNG21','Smartphones','unidad',650000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(152,'Tablet Apple iPad Air','APPLEIPADAIR','Tablets','unidad',800000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(153,'Auriculares Sony WH-1000XM4','SONYWH1000','Audio','unidad',300000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(154,'Consola PlayStation 5','PS5','Consolas','unidad',750000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(155,'Teclado Logitech K380','LOGITECHK380','Teclados','unidad',35000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(156,'Ratón Razer DeathAdder V2','RAZERDA2','Accesorios','unidad',60000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(157,'Cámara Canon EOS M50','CANONEOSM50','Cámaras','unidad',500000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(158,'Disco Duro Externo WD My Passport 1TB','WD1TB','Almacenamiento','unidad',80000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(159,'Cable HDMI de alta velocidad','HDMIHIGHSPEED','Accesorios','unidad',15000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(160,'Sistema de Sonido Bose SoundLink','BOSESL','Audio','unidad',400000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(161,'Pantalla LED 32\" Samsung','SAMSUNG32LED','Monitores','unidad',250000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(162,'Proyector BenQ GS2','BENQGS2','Proyectores','unidad',700000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(163,'Funda de Teclado para MacBook','MACBOOKFUND','Accesorios','unidad',25000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(164,'Batería Externa Anker 10000mAh','ANKER10000','Cargadores','unidad',35000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(165,'Mochila para Laptop Targus','TARGUSMOCH','Accesorios','unidad',60000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(166,'Lámpara LED de Escritorio','LAMLED','Iluminación','unidad',50000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(167,'Kit de Limpieza para PC','LIMPC','Accesorios','unidad',15000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(168,'Sistema de Refrigeración NZXT Kraken','NZXTKRAKEN','Refrigeración','unidad',90000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(169,'Torre Gaming Corsair 4000D','CORSAIR4000D','PCs','unidad',130000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(170,'Reloj Inteligente Fitbit Versa 3','FITBITVERSA3','Wearables','unidad',250000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(171,'Impresora HP DeskJet 2700','HP2700','Impresoras','unidad',150000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(172,'Router WiFi TP-Link Archer A7','TPARCHERA7','Redes','unidad',70000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(173,'Teclado mecánico Razer BlackWidow','RAZERBLACK','Teclados','unidad',90000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(174,'Monitor ASUS 24\" Full HD','ASUS24FHD','Monitores','unidad',180000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(175,'Cámara de Seguridad TP-Link Tapo C200','TAPOC200','Seguridad','unidad',60000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(176,'Altavoz Bluetooth JBL Flip 5','JBLFLIP5','Audio','unidad',200000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(177,'Soporte de Laptop Rain Design mStand','RAINDESIGN','Accesorios','unidad',50000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(178,'Bocina portátil Anker Soundcore','ANKERSOUNDC','Audio','unidad',120000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(179,'Cargador Inalámbrico Anker','ANKERWIRELESS','Cargadores','unidad',35000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(180,'Laptop Dell Inspiron 15','DELLINSPIR15','Laptops','unidad',900000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(181,'Estación de Acoplamiento USB-C','DOCKUSBC','Accesorios','unidad',70000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(182,'Memoria USB SanDisk 64GB','SANDISK64','Almacenamiento','unidad',20000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(183,'Cámara Web Logitech C920','LOGITECHC920','Cámaras','unidad',80000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(184,'Smartwatch Garmin Forerunner 245','GARMIN245','Wearables','unidad',400000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(185,'Dron DJI Mini 2','DJIMINI2','Drones','unidad',1200000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(186,'Microondas Samsung 20L','SAMSUNG20M','Electrodomésticos','unidad',350000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(187,'Batidora Oster 6831','OSTER6831','Electrodomésticos','unidad',80000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(188,'Ventilador de Torre Lasko','LASKOTOWER','Electrodomésticos','unidad',200000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(189,'Aspiradora Robot iRobot Roomba','IROBOTROOMBA','Electrodomésticos','unidad',900000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(190,'Horno de Convección Black+Decker','BLACKDECKER','Electrodomésticos','unidad',700000,'2024-02-01 00:00:00','2024-02-02 00:00:00',1),(269,'Altavoz portátil JBL Flip 5','JBLFLIP5','Audio','unidad',150000,'2024-10-28 10:00:00','2024-10-29 10:00:00',1),(270,'Reloj inteligente Garmin Forerunner 245','GARMIN245','Wearables','unidad',400000,'2024-10-28 10:15:00','2024-10-29 10:15:00',1),(271,'Tablet Samsung Galaxy Tab S6','SAMSUNGS6','Tablets','unidad',600000,'2024-10-28 10:30:00','2024-10-29 10:30:00',1),(272,'Cámara de acción GoPro HERO9','GOPROHERO9','Cámaras','unidad',400000,'2024-10-28 10:45:00','2024-10-29 10:45:00',1),(273,'Sistema de sonido Bose SoundLink Revolve','BOSEREVOLVE','Audio','unidad',300000,'2024-10-28 11:00:00','2024-10-29 11:00:00',1),(274,'Smartwatch Fitbit Versa 3','FITBITVERSA3','Wearables','unidad',300000,'2024-10-28 11:15:00','2024-10-29 11:15:00',1),(275,'Luz LED para video Neewer 660','NEWEER660','Iluminación','unidad',80000,'2024-10-28 11:30:00','2024-10-29 11:30:00',1),(276,'Micrófono de condensador Blue Yeti','BLUEYETI','Audio','unidad',200000,'2024-10-28 11:45:00','2024-10-29 11:45:00',1),(277,'Escáner Canon CanoScan LiDE 400','CANONLIIDE400','Escáneres','unidad',150000,'2024-10-28 12:00:00','2024-10-29 12:00:00',1),(278,'Cafetera espresso DeLonghi EC685','DELONGHIEC685','Electrodomésticos','unidad',400000,'2024-10-28 12:15:00','2024-10-29 12:15:00',1),(279,'Silla gaming DXRacer Formula','DXRACERFORMULA','Muebles','unidad',500000,'2024-10-28 12:30:00','2024-10-29 12:30:00',1),(280,'Disco duro externo Seagate 2TB','SEAGATE2TB','Almacenamiento','unidad',120000,'2024-10-28 12:45:00','2024-10-29 12:45:00',1),(281,'Teclado mecánico Razer Huntsman','RAZERHUNTSMAN','Teclados','unidad',200000,'2024-10-28 13:00:00','2024-10-29 13:00:00',1),(283,'Monitor Dell UltraSharp U2720Q','DELLU2720Q','Monitores','unidad',1200000,'2024-10-28 13:30:00','2024-10-29 13:30:00',1),(284,'Router ASUS RT-AC66U','ASUSRTAC66U','Redes','unidad',70000,'2024-10-28 13:45:00','2024-10-29 13:45:00',1),(285,'Sistema de refrigeración NZXT Kraken X63','NZXT_KRAKEN_X63','Computación','unidad',150000,'2024-10-28 14:00:00','2024-10-29 14:00:00',1),(286,'Altavoz inteligente Amazon Echo Dot','AMAZONECHO','Audio','unidad',60000,'2024-10-28 14:15:00','2024-10-29 14:15:00',1),(287,'Reloj deportivo Polar Vantage V2','POLARVANTAGEV2','Wearables','unidad',500000,'2024-10-28 14:30:00','2024-10-29 14:30:00',1),(289,'Cámara sin espejo Sony Alpha 6400','SONYALPHA6400','Cámaras','unidad',800000,'2024-10-28 15:00:00','2024-10-29 15:00:00',1),(290,'Sistema de sonido Sonos One','SONOSONE','Audio','unidad',250000,'2024-10-28 15:15:00','2024-10-29 15:15:00',1),(291,'Smartwatch Amazfit GTS 2','AMAZFITGTS2','Wearables','unidad',200000,'2024-10-28 15:30:00','2024-10-29 15:30:00',1),(292,'Luz LED Philips Hue White','PHILIPSHUE','Iluminación','unidad',50000,'2024-10-28 15:45:00','2024-10-29 15:45:00',1),(293,'Micrófono de solapa Rode SmartLav+','RODESMARTLAV','Audio','unidad',100000,'2024-10-28 16:00:00','2024-10-29 16:00:00',1),(294,'Escáner Fujitsu ScanSnap iX1500','FUJITSUSCANSNAP','Escáneres','unidad',200000,'2024-10-28 16:15:00','2024-10-29 16:15:00',1),(295,'Cafetera de goteo Hamilton Beach','HAMILTONBEACH','Electrodomésticos','unidad',90000,'2024-10-28 16:30:00','2024-10-29 16:30:00',1),(296,'Escritorio en L HOMCOM','HOMCOMDESK','Muebles','unidad',250000,'2024-10-28 16:45:00','2024-10-29 16:45:00',1),(297,'Disco duro portátil WD My Passport 4TB','WD4TB','Almacenamiento','unidad',200000,'2024-10-28 17:00:00','2024-10-29 17:00:00',1),(298,'Teclado inalámbrico Logitech K380','LOGITECHK380','Teclados','unidad',60000,'2024-10-28 17:15:00','2024-10-29 17:15:00',1),(299,'Cámara web Razer Kiyo Pro','RAZERKIYO','Accesorios','unidad',150000,'2024-10-28 17:30:00','2024-10-29 17:30:00',1),(300,'Monitor ASUS ROG Swift PG259QN','ASUSPG259QN','Monitores','unidad',2500000,'2024-10-28 17:45:00','2024-10-29 17:45:00',1),(301,'Router Netgear Nighthawk RAX80','NETGEARNIGHTHAWK','Redes','unidad',300000,'2024-10-28 18:00:00','2024-10-29 18:00:00',1),(302,'Sistema de refrigeración Corsair H115i','CORSAIRH115I','Computación','unidad',200000,'2024-10-28 18:15:00','2024-10-29 18:15:00',1),(303,'Parlante portátil JBL Charge 5','JBLCHARGE5','Audio','unidad',120000,'2024-10-28 18:30:00','2024-10-29 18:30:00',1),(304,'Cámara de acción GoPro Hero 10','GOPROHERO10','Cámaras','unidad',700000,'2024-10-28 18:45:00','2024-10-29 18:45:00',1),(305,'Proyector Epson Home Cinema 2150','EPSON2150','Proyectores','unidad',900000,'2024-10-28 19:00:00','2024-10-29 19:00:00',1),(306,'Consola de videojuegos Nintendo Switch','NINTENDOSWITCH','Videojuegos','unidad',350000,'2024-10-28 19:15:00','2024-10-29 19:15:00',1),(308,'Mouse Logitech MX Master 3','LOGITECHMXMASTER3','Accesorios','unidad',80000,'2024-10-28 19:45:00','2024-10-29 19:45:00',1),(309,'Tablet Samsung Galaxy Tab S7','GALAXYTABS7','Tablets','unidad',750000,'2024-10-28 20:00:00','2024-10-29 20:00:00',1),(310,'Auriculares Bose QuietComfort 35 II','BOSEQC35II','Audio','unidad',250000,'2024-10-28 20:15:00','2024-10-29 20:15:00',1),(311,'Cargador solar Anker PowerPort','ANKERPOWERPORT','Accesorios','unidad',45000,'2024-10-28 20:30:00','2024-10-29 20:30:00',1),(312,'Lámpara de escritorio TaoTronics TT-DL16','TAOTRONICSTTDL16','Iluminación','unidad',75000,'2024-10-28 20:45:00','2024-10-29 20:45:00',1),(313,'Silla gaming Corsair T3 Rush','CORSAIRT3RUSH','Muebles','unidad',250000,'2024-10-28 21:00:00','2024-10-29 21:00:00',1),(314,'Placa base ASUS ROG Strix B550-F','ASUSROGB550F','Computación','unidad',150000,'2024-10-28 21:15:00','2024-10-29 21:15:00',1),(315,'Disco SSD Samsung 970 EVO Plus 1TB','SAMSUNG970EVO','Almacenamiento','unidad',200000,'2024-10-28 21:30:00','2024-10-29 21:30:00',1),(316,'Sistema de sonido Logitech Z623','LOGITECHZ623','Audio','unidad',120000,'2024-10-28 21:45:00','2024-10-29 21:45:00',1),(317,'Cafetera espresso DeLonghi EC155','DELONGHIEC155','Electrodomésticos','unidad',100000,'2024-10-28 22:00:00','2024-10-29 22:00:00',1),(318,'Raspberry Pi 4 Model B 8GB','RaspberryPi4B','Computación','unidad',50000,'2024-10-28 22:15:00','2024-10-29 22:15:00',1),(319,'Monitor LG 27UK850-W','LG27UK850','Monitores','unidad',600000,'2024-10-28 22:30:00','2024-10-29 22:30:00',1),(320,'Calentador de agua eléctrico Ariston','ARISTON','Electrodomésticos','unidad',150000,'2024-10-28 22:45:00','2024-10-29 22:45:00',1),(321,'Auriculares inalámbricos Apple AirPods Pro 2','APPLEAIRPODSPRO2','Audio','unidad',230000,'2024-10-28 23:00:00','2024-10-29 23:00:00',1),(322,'Smartphone Samsung Galaxy S21 FE','SAMSUNGGALAXYS21FE','Telefonía','unidad',750000,'2024-10-28 23:15:00','2024-10-29 23:15:00',1),(323,'Laptop Dell XPS 13','DELLXPS13','Computación','unidad',1200000,'2024-10-28 23:30:00','2024-10-29 23:30:00',1),(324,'Cámara réflex Canon EOS Rebel T7','CANONEOST7','Cámaras','unidad',550000,'2024-10-28 23:45:00','2024-10-29 23:45:00',1),(325,'Altavoz inteligente Google Nest Hub','GOOGLENESTHUB','Smart Home','unidad',90000,'2024-10-29 00:00:00','2024-10-30 00:00:00',1),(326,'Microondas Panasonic NN-SD975S','PANASONICNN975','Electrodomésticos','unidad',150000,'2024-10-29 00:15:00','2024-10-30 00:15:00',1),(327,'Proyector portátil Anker Nebula Capsule','ANKERNEBULACAPSULE','Proyectores','unidad',250000,'2024-10-29 00:30:00','2024-10-30 00:30:00',1),(328,'Robot aspirador iRobot Roomba 694','IROBOT694','Smart Home','unidad',300000,'2024-10-29 00:45:00','2024-10-30 00:45:00',1),(329,'Teclado Logitech G Pro X','LOGITECHGPROX','Teclados','unidad',120000,'2024-10-29 01:00:00','2024-10-30 01:00:00',1),(330,'Cargador inalámbrico Anker PowerWave','ANKERPOWERWAVE','Accesorios','unidad',45000,'2024-10-29 01:15:00','2024-10-30 01:15:00',1),(331,'Silla de oficina Ergohuman','ERGOHUMAN','Muebles','unidad',300000,'2024-10-29 01:30:00','2024-10-30 01:30:00',1),(332,'Parlante Sony SRS-XB33','SONYSRSXB33','Audio','unidad',150000,'2024-10-29 01:45:00','2024-10-30 01:45:00',1),(333,'Luz LED inteligente Philips Hue','PHILIPSHUE','Iluminación','unidad',60000,'2024-10-29 02:00:00','2024-10-30 02:00:00',1),(334,'Kit de inicio Xiaomi Mi Smart Home','XIAOMISMARTKIT','Smart Home','unidad',120000,'2024-10-29 02:15:00','2024-10-30 02:15:00',1),(335,'Pulsera inteligente Fitbit Charge 5','FITBITCHARGE5','Salud','unidad',150000,'2024-10-29 02:30:00','2024-10-30 02:30:00',1),(336,'Cámara de vigilancia Arlo Essential','ARLOESSENTIAL','Seguridad','unidad',300000,'2024-10-29 02:45:00','2024-10-30 02:45:00',1),(337,'Barra de sonido Samsung HW-Q60T','SAMSUNGHWQ60T','Audio','unidad',200000,'2024-10-29 03:00:00','2024-10-30 03:00:00',1),(338,'Monitor gaming ASUS ROG Strix XG27AQ','ASUSROGXG27AQ','Monitores','unidad',800000,'2024-10-29 03:15:00','2024-10-30 03:15:00',1),(339,'Auriculares Razer Kraken V3','RAZERKRAKENV3','Audio','unidad',120000,'2024-10-29 03:30:00','2024-10-30 03:30:00',1),(340,'Cámara digital Nikon Z50','NIKONZ50','Cámaras','unidad',650000,'2024-10-29 03:45:00','2024-10-30 03:45:00',1),(341,'Laptop HP Pavilion 15','HPPAVILION15','Computación','unidad',1100000,'2024-10-29 04:00:00','2024-10-30 04:00:00',1),(342,'Tablet Samsung Galaxy Tab S8','SAMSUNGTABS8','Tablets','unidad',650000,'2024-10-29 04:15:00','2024-10-30 04:15:00',1),(343,'Cámara GoPro HERO10','GOPROHERO10','Cámaras','unidad',450000,'2024-10-29 04:30:00','2024-10-30 04:30:00',1),(345,'Teclado mecánico Corsair K95 RGB','CORSAIRK95RGB','Teclados','unidad',200000,'2024-10-29 05:00:00','2024-10-30 05:00:00',1),(346,'Altavoz JBL Charge 5','JBLCHARGE5','Audio','unidad',130000,'2024-10-29 05:15:00','2024-10-30 05:15:00',1),(347,'Drone DJI Mini SE','DJIMINISE','Drones','unidad',350000,'2024-10-29 05:30:00','2024-10-30 05:30:00',1),(349,'Silla gamer DXRacer Formula Series','DXRACERFORMULA','Muebles','unidad',250000,'2024-10-29 06:00:00','2024-10-30 06:00:00',1),(350,'Router TP-Link Archer AX50','TPLINKAX50','Redes','unidad',80000,'2024-10-29 06:15:00','2024-10-30 06:15:00',1),(351,'Reloj inteligente Amazfit GTS 2','AMAZFITGTS2','Salud','unidad',160000,'2024-10-29 06:30:00','2024-10-30 06:30:00',1),(352,'Auriculares Sennheiser HD 599','SENNHEISERHD599','Audio','unidad',250000,'2024-10-29 06:45:00','2024-10-30 06:45:00',1),(353,'Cámara de seguridad Ring Stick Up Cam','RINGSTICKUPCAM','Seguridad','unidad',220000,'2024-10-29 07:00:00','2024-10-30 07:00:00',1),(354,'Microondas Samsung MG14K3510CM','SAMSUNGMG14','Electrodomésticos','unidad',95000,'2024-10-29 07:15:00','2024-10-30 07:15:00',1),(356,'Disco duro externo WD My Passport','WD_MY_PASSPORT','Almacenamiento','unidad',120000,'2024-10-29 07:45:00','2024-10-30 07:45:00',1),(357,'Cafetera eléctrica Breville BDC450','BREVILLEBDC450','Cocina','unidad',170000,'2024-10-29 08:00:00','2024-10-30 08:00:00',1),(358,'Cargador solar RAVPower','RAVPOWERSOLAR','Accesorios','unidad',45000,'2024-10-29 08:15:00','2024-10-30 08:15:00',1),(360,'Sofá de dos plazas IKEA EKTORP','IKEAEKTORP','Muebles','unidad',400000,'2024-10-29 08:45:00','2024-10-30 08:45:00',1),(361,'Cámara Canon EOS M50 Mark II','CANONEOSM50','Cámaras','unidad',950000,'2024-10-29 09:00:00','2024-10-30 09:00:00',1),(362,'Auriculares HyperX Cloud II','HYPERXCLOUDII','Audio','unidad',120000,'2024-10-29 09:15:00','2024-10-30 09:15:00',1),(363,'Laptop Lenovo IdeaPad 3','LENOVOIDEAPAD3','Computación','unidad',850000,'2024-10-29 09:30:00','2024-10-30 09:30:00',1),(364,'Proyector BenQ TH685','BENQTH685','Proyectores','unidad',1100000,'2024-10-29 09:45:00','2024-10-30 09:45:00',1),(365,'Smart TV LG OLED55C1','LGOLED55C1','Televisores','unidad',2400000,'2024-10-29 10:00:00','2024-10-30 10:00:00',1),(366,'Robot aspirador iRobot Roomba 980','IROBOT980','Electrodomésticos','unidad',1800000,'2024-10-29 10:15:00','2024-10-30 10:15:00',1),(367,'Teclado Razer BlackWidow V3','RAZERBLACKWIDOW','Teclados','unidad',150000,'2024-10-29 10:30:00','2024-10-30 10:30:00',1),(368,'Altavoz Sonos One','SONOSONE','Audio','unidad',200000,'2024-10-29 10:45:00','2024-10-30 10:45:00',1),(369,'Disco duro Seagate Backup Plus','SEAGATEBACKUP','Almacenamiento','unidad',90000,'2024-10-29 11:00:00','2024-10-30 11:00:00',1),(370,'Cafetera Nespresso VertuoPlus','NESPRESSOVERTUO','Cocina','unidad',180000,'2024-10-29 11:15:00','2024-10-30 11:15:00',1),(371,'Smartwatch Apple Watch Series 7','APPLEWATCH7','Salud','unidad',300000,'2024-10-29 11:30:00','2024-10-30 11:30:00',1),(372,'Auriculares JBL Tune 750BTNC','JBL750BTNC','Audio','unidad',95000,'2024-10-29 11:45:00','2024-10-30 11:45:00',1),(373,'Silla de escritorio Herman Miller Aeron','HERMANMILLERAERON','Muebles','unidad',900000,'2024-10-29 12:00:00','2024-10-30 12:00:00',1),(374,'Drone Parrot Anafi','PARROTANAFI','Drones','unidad',450000,'2024-10-29 12:15:00','2024-10-30 12:15:00',1),(375,'Reloj Garmin Fenix 6','GARMINFENIX6','Salud','unidad',750000,'2024-10-29 12:30:00','2024-10-30 12:30:00',1),(376,'Bocina portátil Ultimate Ears BOOM 3','UEBOOM3','Audio','unidad',90000,'2024-10-29 12:45:00','2024-10-30 12:45:00',1),(377,'Aspiradora Dyson V11','DYSONV11','Electrodomésticos','unidad',1400000,'2024-10-29 13:00:00','2024-10-30 13:00:00',1),(378,'Cámara instantánea Fujifilm Instax Mini 11','FUJIFILMINSTAX11','Cámaras','unidad',100000,'2024-10-29 13:15:00','2024-10-30 13:15:00',1),(379,'Teclado Logitech G915','LOGITECHG915','Teclados','unidad',250000,'2024-10-29 13:30:00','2024-10-30 13:30:00',1),(380,'Sofá de tres plazas IKEA FÄRLÖV','IKEAFARLOV','Muebles','unidad',600000,'2024-10-29 13:45:00','2024-10-30 13:45:00',1),(400,'Memoria RAM Corsair 16GB','RAMC16GB','Hardware PC','caja',50000,'2024-01-01 00:00:00','2024-01-02 00:00:00',1),(401,'Disco Duro Seagate 1TB','HDD1TB','Hardware PC','caja',40000,'2024-01-03 00:00:00','2024-01-04 00:00:00',1),(402,'Placa Base ASUS ROG','PLABASEROG','Hardware PC','caja',80000,'2024-01-05 00:00:00','2024-01-06 00:00:00',1),(403,'Tarjeta Gráfica NVIDIA RTX 3060','RTX3060','Hardware PC','caja',150000,'2024-01-07 00:00:00','2024-01-08 00:00:00',1),(404,'Fuente de Poder EVGA 600W','FPEVGA600','Hardware PC','caja',30000,'2024-01-09 00:00:00','2024-01-10 00:00:00',1),(406,'Cooler Master Hyper 212','COOLER212','Hardware PC','caja',25000,'2024-01-13 00:00:00','2024-01-14 00:00:00',1),(407,'SSD Kingston 480GB','SSD480GB','Hardware PC','caja',60000,'2024-01-15 00:00:00','2024-01-16 00:00:00',1),(408,'Monitor ASUS 24 pulgadas','MONASUS24','Hardware PC','caja',120000,'2024-01-17 00:00:00','2024-01-18 00:00:00',1),(410,'Mouse Logitech G502','MOUSEG502','Hardware PC','caja',40000,'2024-01-21 00:00:00','2024-01-22 00:00:00',1),(411,'Alimentador de Red TP-Link','ALIMTP','Hardware PC','caja',20000,'2024-01-23 00:00:00','2024-01-24 00:00:00',1),(412,'Tarjeta de sonido Creative Sound Blaster','TARJCREATIVE','Hardware PC','caja',35000,'2024-01-25 00:00:00','2024-01-26 00:00:00',1),(413,'Adaptador Wi-Fi TP-Link AC600','ADAPTAC600','Hardware PC','caja',25000,'2024-01-27 00:00:00','2024-01-28 00:00:00',1),(415,'Micrófono USB Blue Snowball','MICROFONO_BLUE','Hardware PC','caja',80000,'2024-01-31 00:00:00','2024-02-01 00:00:00',1),(416,'Pasta térmica Arctic Silver 5','PASTATERMAL','Hardware PC','caja',15000,'2024-02-02 00:00:00','2024-02-03 00:00:00',1),(417,'Luz LED RGB Corsair','LED_RGB_CORS','Hardware PC','caja',20000,'2024-02-04 00:00:00','2024-02-05 00:00:00',1),(418,'Soporte para monitor Ergotron','SOPORTEM','Hardware PC','caja',45000,'2024-02-06 00:00:00','2024-02-07 00:00:00',1),(419,'Lector de tarjetas USB 3.0','LECTOR_USB','Hardware PC','caja',10000,'2024-02-08 00:00:00','2024-02-09 00:00:00',1),(420,'Estabilizador de corriente APC','ESTABILIZADOR','Hardware PC','caja',30000,'2024-02-10 00:00:00','2024-02-11 00:00:00',1),(421,'Tarjeta madre Gigabyte B550','TARJAMOTHERB550','Hardware PC','caja',90000,'2024-02-12 00:00:00','2024-02-13 00:00:00',1),(422,'Monitor BenQ 27 pulgadas','MONBENQ27','Hardware PC','caja',130000,'2024-02-14 00:00:00','2024-02-15 00:00:00',1),(423,'Teclado mecánico Corsair K95','TECLADOCORSK95','Hardware PC','caja',95000,'2024-02-16 00:00:00','2024-02-17 00:00:00',1),(424,'Mouse pad Razer Goliathus','MOUSEPADRAZ','Hardware PC','caja',15000,'2024-02-18 00:00:00','2024-02-19 00:00:00',1),(425,'Parlantes Logitech Z623','PARLOGITECHZ623','Hardware PC','caja',70000,'2024-02-20 00:00:00','2024-02-21 00:00:00',1),(426,'Gabinete Cooler Master MasterBox','GABCMBOX','Hardware PC','caja',80000,'2024-02-22 00:00:00','2024-02-23 00:00:00',1),(427,'Cámara de seguridad Logitech Circle','CAMSECLOGI','Hardware PC','caja',55000,'2024-02-24 00:00:00','2024-02-25 00:00:00',1),(428,'Disco duro WD My Passport 2TB','WD_MY_PASS','Hardware PC','caja',70000,'2024-02-26 00:00:00','2024-02-27 00:00:00',1),(429,'Docking Station Hama','DOCKHAMA','Hardware PC','caja',60000,'2024-02-28 00:00:00','2024-02-29 00:00:00',1),(431,'Refrigerador líquido Corsair H100i','REFLIQUIDOC','Hardware PC','caja',120000,'2024-03-03 00:00:00','2024-03-04 00:00:00',1),(432,'Tarjeta gráfica AMD Radeon RX 6700','TARJAMDRX6700','Hardware PC','caja',160000,'2024-03-05 00:00:00','2024-03-06 00:00:00',1),(433,'Almacenamiento externo Seagate 5TB','ALMEXTSEAGATE','Hardware PC','caja',95000,'2024-03-07 00:00:00','2024-03-08 00:00:00',1),(434,'Tarjeta de red TP-Link Archer T6E','TARJAREDTPLINK','Hardware PC','caja',35000,'2024-03-09 00:00:00','2024-03-10 00:00:00',1),(435,'Módulo de memoria Kingston HyperX','MEMORYHYPERX','Hardware PC','caja',45000,'2024-03-11 00:00:00','2024-03-12 00:00:00',1),(436,'Hub USB 3.0 Anker','HUBANKER','Hardware PC','caja',20000,'2024-03-13 00:00:00','2024-03-14 00:00:00',1),(437,'Silla gamer DXRacer','SILLAGAMERDXR','Hardware PC','caja',250000,'2024-03-15 00:00:00','2024-03-16 00:00:00',1),(438,'Adaptador HDMI a VGA','ADAPHDMIVGA','Hardware PC','caja',12000,'2024-03-17 00:00:00','2024-03-18 00:00:00',1),(439,'Controlador USB 3.0 PCIe','CONTROLPICE','Hardware PC','caja',50000,'2024-03-19 00:00:00','2024-03-20 00:00:00',1),(440,'Soporte de CPU Fellowes','SOPCPUFELLOWES','Hardware PC','caja',30000,'2024-03-21 00:00:00','2024-11-03 21:13:42',1);
/*!40000 ALTER TABLE `Productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `rol_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text,
  `bodega_id` int NOT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `estado` int NOT NULL,
  PRIMARY KEY (`rol_id`),
  KEY `bodega` (`bodega_id`),
  CONSTRAINT `bodegaidfk` FOREIGN KEY (`bodega_id`) REFERENCES `Bodegas` (`bodega_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
INSERT INTO `Roles` VALUES (1,'Súper Global','Súper Global',1,'2024-10-15 23:41:07','2024-11-02 23:42:15',1),(10,'Administrador Global','Descripción: Supervisa y gestiona todas las funciones administrativas y operativas en todas las bodegas.        \n\nPermisos:\n-Usuarios y Roles Global: Crear, editar y eliminar usuarios y roles en todas las bodegas.       \n-Gestión de Inventarios Global: Crear, editar y eliminar productos a nivel global.\n-Seguridad y Autenticación: Configurar políticas de seguridad de contraseñas y permisos.\n-Panel de Control: Personalización de KPIs y widgets para todas las bodegas.\n-Alertas y Reportes: Configurar alertas de stock y generar reportes globales.\n',1,'0001-01-01 00:00:00','2024-10-29 13:12:39',1),(11,'Gerente de Sucursal','Descripción: Responsable de supervisar la operación y el inventario, del reabastecimiento de la bodega (donde gestiona las solicitudes de productos). Y además, genera reportes sobre el estado de stock y ventas.\n\nPermisos:\n-Gestión de Productos Locales: Crear, editar y eliminar productos en Bodega\n-Gestión de inventarios locales: Visualizar, modificar y actualizar inventario de su sucursal.\n-Aprobación de Solicitudes: Aprobar o rechazar solicitudes de reabastecimiento realizadas por el Operador.\n-Generación de reportes locales: crear reportes de inventario y ventas específicos para la bodega\n-Notificaciones: Recibir alertas de stock bajo en la bodega.\n',2,'0001-01-01 00:00:00','2024-10-29 13:58:33',1),(12,'Operador de Sucursal','Descripción: Actualiza el inventario en la bodega y realiza solicitudes de reabastecimiento.\n\nPermisos:\n-Actualización de inventario: registrar cada movimiento de productos en la bodega.\n-Solicitudes de reabastecimiento: Crear solicitudes de reabastecimiento de productos al Gerente de Sucursal.\n-Consulta de inventario: acceso a reportes básicos de la bodega sin permisos de exportación.\n',2,'0001-01-01 00:00:00','2024-10-29 13:53:16',1),(13,'Auditor','Descripción: Monitorea las transacciones y verifica la integridad de los datos en el sistema.\n\nPermisos:\n-Consultar reportes detallados de inventarios y movimientos.\n-Revisar registros de movimientos y actividades de usuarios.\n-Acceder a reportes de seguridad y auditoría.\n-Exportar datos de auditoría en formatos seguros (PDF, CSV).',1,'0001-01-01 00:00:00','2024-10-29 08:02:43',1),(15,' Operador de Sucursal Junior','Descripción: Operador nuevo con permisos limitados mientras se adapta a sus responsabilidades.\n\nPermisos:\n-Actualizar el stock en tiempo real de ciertos productos limitados en su sucursal.\n-Consultar inventario de productos básicos.\n-Enviar solicitudes de reabastecimiento que requieren aprobación del gerente.\n-Ver solo reportes básicos de la sucursal (sin permisos de exportación).',2,'0001-01-01 00:00:00','2024-10-29 08:04:40',1),(16,'Gerente Global','Descripción: Supervisa el inventario y la gestión a nivel global para todas las sucursales.\n\nPermisos:\n-Ver inventarios y reportes globales.\n-Generar reportes comparativos entre sucursales.\n-Aprobar grandes cambios de inventario (como transferencia de stock entre sucursales).\n-Revisar alertas y notificaciones de stock bajo en todas las sucursales.',1,'0001-01-01 00:00:00','2024-10-29 08:03:35',1),(17,'Administrador Junior','Descripción: Nuevo administrador con permisos controlados para familiarizarse con el sistema.\n\nPermisos:\n-Crear y editar productos bajo supervisión, sin permisos de eliminación.\n-Gestionar roles para usuarios en entrenamiento.\n-Generar reportes de stock y ventas, pero sin programación automática de reportes.\n-Acceso restringido a la gestión de seguridad y auditoría.\n',1,'0001-01-01 00:00:00','0001-01-01 00:00:00',1),(18,'Auditor Junior','Descripción: Auditor en entrenamiento con acceso limitado para monitorear la seguridad y verificar el cumplimiento de procesos.\n\nPermisos:\n-Consultar reportes básicos de inventarios y movimientos.\n-Revisar actividades de usuarios de nivel operador únicamente.\n-Exportar reportes básicos para revisión, con supervisión.',1,'0001-01-01 00:00:00','0001-01-01 00:00:00',1),(19,'Analista de Datos Temporal','Descripción: Nuevo rol temporal para usuarios que analizan datos de inventario y ventas.\n\nPermisos:\n-Acceder a reportes de ventas y stock, con permisos de consulta.\n-Visualizar gráficos de tendencias sin permisos de exportación.\n-Generar reportes limitados a su sucursal o área.\n-Consultar datos específicos, sin capacidad de modificar inventarios.',1,'0001-01-01 00:00:00','0001-01-01 00:00:00',1),(20,'Gerente de Inventario','Descripción: Responsable de supervisar el inventario en Casa Central y de gestionar la distribución de stock a las bodegas pequeñas\n\nPermisos:\n-Inventarios Casa Central: Supervisar y modificar inventarios en Casa Central.\n-Transferencias a Sucursales: Aprobar y coordinar transferencias de stock hacia otras bodegas, y aprueba solicitudes de reabastecimiento de otras bodegas.\n-Alertas de Stock: Acceso a alertas de stock bajo en todas las bodegas.\n-Reportes de Inventario: \nGenerar reportes de inventario detallados y comparativos.\n',1,'0001-01-01 00:00:00','2024-10-29 13:21:10',1),(21,'Operador de Inventario','Descripción: Encargado de registrar entradas y salidas de productos en Casa Central y de coordinar la preparación de envíos a otras bodegas\n\nPermisos:\n-Actualización de inventario: registrar la entrada y salida de productos en Casa Central.\n-Preparación de envíos: asistir en la preparación de productos para envío a otras bodegas.\n-Consulta de inventario: acceso a reportes básicos de Casa Central.\n',1,'0001-01-01 00:00:00','2024-10-29 13:31:11',1),(22,'Auditor Principal','Descripción: Encargado de verificar la integridad de los datos en el sistema y de realizar auditorías todas las actividades relacionadas con inventarios, usuarios y productos.\n\n\nPermisos:\n-Auditoría Completa: Acceso a historial de inventario, actividades de usuario y auditoría de productos en todas las bodegas.\n-Reportes de Irregularidades: Generar reportes de actividades sospechosas y exportar datos para auditorías.\n-Alertas de Cumplimiento: Configuración y recepción de alertas sobre actividades irregulares.\n-Monitoreo de transacciones: ver registros detallados de todas las actividades.\n\n',1,'0001-01-01 00:00:00','2024-10-29 13:29:07',1),(23,'Operador Junior','Descripción: Apoya en la actualización del inventario de productos básicos bajo supervisión, ideal para empleados en entrenamiento.\n\nPermisos Limitados: actualización de inventario de productos asignados, supervisada por un operador principal.\n',1,'0001-01-01 00:00:00','0001-01-01 00:00:00',1),(24,'Administrador Junior','Descripción: Apoya en la creación de productos y usuarios, sin permisos de eliminación ni acceso a configuraciones críticas.\n\nPermisos:\n-Gestión Básica de Usuarios Locales: Crear y asignar roles básicos para usuarios en Bodega\n-Consulta de Inventarios: Ver el inventario de la bodega\n-Alertas de Stock: Configurar alertas de stock para Bodega ',1,'0001-01-01 00:00:00','2024-10-29 14:02:46',1),(25,'Auditor Junior','Descripción: Ayuda al Auditor Principal con la revisión de inventarios y actividades en Bodega. Donde Monitorea los movimientos de inventario y las actividades de los usuarios en la bodega \n\nPermisos:\n-Revisión de movimientos Inventarios: Consultar inventarios y generar reportes de inventarios y movimientos en Bodega\n-Consultas de Actividades de Usuario: Revisar las actividades de usuarios en Bodega\n-Generación de Reportes Básicos: Exportar reportes básicos de actividades específicas, bajo supervisión del Auditor Principal.\n',2,'0001-01-01 00:00:00','2024-11-16 15:10:16',0),(26,'Operador Junior','Descripción: Apoya en la actualización del inventario de productos básicos, con restricciones en productos de alto valor.\n\nPermisos: actualización de inventario de productos básicos y solicitudes de reabastecimiento con aprobación del gerente.\n',2,'0001-01-01 00:00:00','0001-01-01 00:00:00',1),(27,'Analista de Datos Junior','Descripción: Visualiza y analiza tendencias de inventario sin permisos de exportación, familiarizándose con los datos de la bodega.\n\nPermisos: visualización de reportes de tendencias de stock y ventas sin opciones de exportación.\n',2,'0001-01-01 00:00:00','0001-01-01 00:00:00',1),(28,'Gerente de Sucursal','Descripción: Responsable de supervisar la operación y el inventario, del reabastecimiento de la bodega (donde gestiona las solicitudes de productos). Y además, genera reportes sobre el estado de stock y ventas.\n\nPermisos:\n-Gestión de Productos Locales: Crear, editar y eliminar productos en Bodega\n-Gestión de inventarios locales: Visualizar, modificar y actualizar inventario de su sucursal.\n-Aprobación de Solicitudes: Aprobar o rechazar solicitudes de reabastecimiento realizadas por el Operador.\n-Generación de reportes locales: crear reportes de inventario y ventas específicos para la bodega\n-Notificaciones: Recibir alertas de stock bajo en la bodega.\n',1,'0001-01-01 00:00:00','2024-11-03 22:59:26',1),(29,'Operador de Sucursal','Descripción: Actualiza el inventario en la bodega y realiza solicitudes de reabastecimiento.\n\nPermisos:\n-Actualización de inventario: registrar cada movimiento de productos en la bodega.\n-Solicitudes de reabastecimiento: Crear solicitudes de reabastecimiento de productos al Gerente de Sucursal.\n-Consulta de inventario: acceso a reportes básicos de la bodega sin permisos de exportación.',3,'0001-01-01 00:00:00','2024-10-29 13:56:34',1),(30,'Auditor Asistente','Descripción: Ayuda al Auditor Principal con la revisión de inventarios y actividades en Bodega. Donde Monitorea los movimientos de inventario y las actividades de los usuarios en la bodega \n\nPermisos:\n-Revisión de movimientos Inventarios: Consultar inventarios y generar reportes de inventarios y movimientos en Bodega\n-Consultas de Actividades de Usuario: Revisar las actividades de usuarios en Bodega\n-Generación de Reportes Básicos: Exportar reportes básicos de actividades específicas, bajo supervisión del Auditor Principal.',3,'0001-01-01 00:00:00','2024-10-29 14:06:46',1),(31,'Operador Junior','Descripción: Responsable de actualizar inventario en productos básicos y enviar solicitudes de reabastecimiento bajo supervisión.\n\nPermisos: actualización de inventario para productos básicos y envío de solicitudes de reabastecimiento con supervisión.\n',3,'0001-01-01 00:00:00','0001-01-01 00:00:00',1),(32,'Administrador Junior de Sucursal','Descripción: Apoya en la creación de productos y usuarios, sin permisos de eliminación ni acceso a configuraciones críticas.\n\nPermisos:\n-Gestión Básica de Usuarios y Roles: Crear Crear usuarios, y asignar roles básicos para usuarios de su Bodega\n-Consulta de Inventarios: Ver el inventario de la bodega\n-Alertas de Stock: Configurar alertas de stock para Bodega ',3,'0001-01-01 00:00:00','2024-10-29 14:01:30',1),(33,'Todos los permisos','prueba todo liberado',1,'0001-01-01 00:00:00','0001-01-01 00:00:00',1),(34,'Sin permiso','Con este rol, no tendrá permisos absolutamente a nada',1,'0001-01-01 00:00:00','2024-11-03 23:06:37',1);
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roles_Permisos`
--

DROP TABLE IF EXISTS `Roles_Permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles_Permisos` (
  `rol_permiso_id` int NOT NULL AUTO_INCREMENT,
  `rol_id` int NOT NULL,
  `permiso_id` int NOT NULL,
  PRIMARY KEY (`rol_permiso_id`),
  KEY `rol_id` (`rol_id`),
  KEY `permiso_id` (`permiso_id`),
  CONSTRAINT `Roles_Permisos_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `Roles` (`rol_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Roles_Permisos_ibfk_2` FOREIGN KEY (`permiso_id`) REFERENCES `Permisos` (`permiso_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles_Permisos`
--

LOCK TABLES `Roles_Permisos` WRITE;
/*!40000 ALTER TABLE `Roles_Permisos` DISABLE KEYS */;
INSERT INTO `Roles_Permisos` VALUES (632,27,2),(709,29,4),(710,29,18),(711,29,23),(712,29,26),(713,29,28),(714,29,36),(715,29,6),(716,29,8),(717,29,10),(718,29,12),(719,29,14),(720,29,16),(721,29,20),(740,33,2),(741,33,1),(742,33,3),(743,33,4),(744,33,5),(745,33,6),(746,33,7),(747,33,8),(748,33,9),(749,33,10),(750,33,11),(751,33,12),(752,33,13),(753,33,14),(754,33,15),(755,33,16),(756,33,17),(757,33,18),(758,33,19),(759,33,20),(760,33,21),(761,33,22),(762,33,23),(763,33,24),(764,33,26),(765,33,27),(766,33,28),(767,33,35),(768,33,36),(769,33,37),(1023,1,1),(1024,1,3),(1025,1,5),(1026,1,7),(1027,1,9),(1028,1,13),(1029,1,15),(1030,1,11),(1031,1,19),(1032,1,20),(1033,1,21),(1034,1,24),(1035,1,18),(1036,1,37),(1037,1,35),(1038,1,27),(1039,1,22),(1040,1,43),(1041,1,42),(1042,1,41),(1043,1,39),(1044,1,46),(1045,1,48),(1046,1,50),(1047,1,51),(1048,1,52),(1049,1,53),(1050,1,54),(1051,1,55),(1052,1,56),(1053,1,57),(1054,1,58),(1055,1,59),(1056,1,60),(1057,1,61),(1058,1,63),(1059,1,65),(1060,1,67),(1061,28,2),(1062,28,4),(1063,28,6),(1064,28,8),(1065,28,10),(1066,28,12),(1067,28,14),(1068,28,16),(1069,28,18),(1070,28,23),(1071,28,26),(1072,28,28),(1073,28,36),(1074,28,40),(1075,28,45),(1076,28,47),(1077,28,49),(1078,28,53),(1079,28,54),(1080,28,55),(1081,28,56),(1082,28,62),(1083,28,64),(1084,28,66),(1085,28,68),(1086,11,2),(1087,11,4),(1088,11,6),(1089,11,8),(1090,11,10),(1091,11,12),(1092,11,14),(1093,11,16),(1094,11,18),(1095,11,23),(1096,11,26),(1097,11,28),(1098,11,36),(1099,11,40),(1100,11,45),(1101,11,47),(1102,11,49),(1103,11,53),(1104,11,54),(1105,11,55),(1106,11,56),(1107,11,62),(1108,11,64),(1109,11,66),(1110,11,68);
/*!40000 ALTER TABLE `Roles_Permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Solicitudes_Inventario`
--

DROP TABLE IF EXISTS `Solicitudes_Inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Solicitudes_Inventario` (
  `solicitud_id` int NOT NULL AUTO_INCREMENT,
  `bodega_id` int NOT NULL,
  `estado_solicitud_id` int NOT NULL,
  `fecha_solicitud` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_aprobacion` datetime DEFAULT NULL,
  `fecha_rechazo` datetime DEFAULT NULL,
  `fecha_completada` datetime DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `usuario_solicitante_id` int NOT NULL,
  `usuario_aprobador_id` int DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`solicitud_id`),
  KEY `usuario_solicitante_id` (`usuario_solicitante_id`),
  KEY `usuario_aprobador_id` (`usuario_aprobador_id`),
  KEY `idx_solicitudes_inventario_estado` (`estado_solicitud_id`),
  KEY `Solicitudes_Inventario_ibfk_1` (`bodega_id`),
  CONSTRAINT `Solicitudes_Inventario_ibfk_1` FOREIGN KEY (`bodega_id`) REFERENCES `Bodegas` (`bodega_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Solicitudes_Inventario_ibfk_2` FOREIGN KEY (`usuario_solicitante_id`) REFERENCES `Usuarios` (`usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Solicitudes_Inventario_ibfk_3` FOREIGN KEY (`usuario_aprobador_id`) REFERENCES `Usuarios` (`usuario_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Solicitudes_Inventario_ibfk_4` FOREIGN KEY (`estado_solicitud_id`) REFERENCES `Estados_Solicitud_Inventario` (`estado_solicitud_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Solicitudes_Inventario`
--

LOCK TABLES `Solicitudes_Inventario` WRITE;
/*!40000 ALTER TABLE `Solicitudes_Inventario` DISABLE KEYS */;
INSERT INTO `Solicitudes_Inventario` VALUES (6,1,3,'2024-10-23 23:52:30',NULL,'2024-10-26 18:28:46',NULL,'2024-10-25 23:37:53',1,NULL,'Rechazada'),(7,1,2,'2024-10-27 00:13:14','2024-10-27 00:15:11',NULL,NULL,'2024-10-27 00:13:33',1,NULL,'producto sin stock'),(8,1,5,'2024-10-30 21:47:59',NULL,NULL,NULL,'2024-10-30 21:52:36',4,NULL,NULL),(12,2,2,'2024-11-01 00:33:32','2024-10-31 21:34:44',NULL,NULL,NULL,30,NULL,'aprobada'),(13,1,1,'2024-11-03 02:47:46',NULL,NULL,NULL,NULL,4,NULL,NULL),(14,1,1,'2024-11-03 02:49:45',NULL,NULL,NULL,NULL,4,NULL,NULL),(15,2,5,'2024-11-03 23:37:27',NULL,NULL,NULL,NULL,43,NULL,NULL),(16,1,1,'2024-11-05 23:00:54',NULL,NULL,NULL,NULL,9,NULL,NULL),(17,1,5,'2024-11-05 23:03:00',NULL,NULL,NULL,NULL,9,NULL,NULL),(18,2,2,'2024-11-16 16:31:56','2024-11-16 19:33:13',NULL,NULL,NULL,2,NULL,'Aceptada');
/*!40000 ALTER TABLE `Solicitudes_Inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tipos_Alerta`
--

DROP TABLE IF EXISTS `Tipos_Alerta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tipos_Alerta` (
  `tipo_alerta_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`tipo_alerta_id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tipos_Alerta`
--

LOCK TABLES `Tipos_Alerta` WRITE;
/*!40000 ALTER TABLE `Tipos_Alerta` DISABLE KEYS */;
INSERT INTO `Tipos_Alerta` VALUES (1,'bajo_stock'),(2,'fecha_caducidad'),(3,'otro');
/*!40000 ALTER TABLE `Tipos_Alerta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tipos_Bodega`
--

DROP TABLE IF EXISTS `Tipos_Bodega`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tipos_Bodega` (
  `tipo_bodega_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`tipo_bodega_id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tipos_Bodega`
--

LOCK TABLES `Tipos_Bodega` WRITE;
/*!40000 ALTER TABLE `Tipos_Bodega` DISABLE KEYS */;
INSERT INTO `Tipos_Bodega` VALUES (1,'central'),(2,'pequeña');
/*!40000 ALTER TABLE `Tipos_Bodega` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tipos_Perdida`
--

DROP TABLE IF EXISTS `Tipos_Perdida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tipos_Perdida` (
  `tipo_perdida_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`tipo_perdida_id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tipos_Perdida`
--

LOCK TABLES `Tipos_Perdida` WRITE;
/*!40000 ALTER TABLE `Tipos_Perdida` DISABLE KEYS */;
INSERT INTO `Tipos_Perdida` VALUES (1,'Daño'),(3,'otro'),(2,'Perdida');
/*!40000 ALTER TABLE `Tipos_Perdida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Transferencias`
--

DROP TABLE IF EXISTS `Transferencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Transferencias` (
  `transferencia_id` int NOT NULL AUTO_INCREMENT,
  `bodega_origen_id` int NOT NULL,
  `bodega_destino_id` int NOT NULL,
  `estado_transferencia_id` int NOT NULL,
  `fecha_envio` datetime DEFAULT NULL,
  `fecha_recepcion` datetime DEFAULT NULL,
  `fecha_cancelado` datetime DEFAULT NULL,
  `usuario_solicitante_id` int NOT NULL,
  `usuario_verificador_id` int DEFAULT NULL,
  `observaciones` text,
  `secret` int NOT NULL,
  PRIMARY KEY (`transferencia_id`),
  KEY `bodega_origen_id` (`bodega_origen_id`),
  KEY `bodega_destino_id` (`bodega_destino_id`),
  KEY `usuario_solicitante_id` (`usuario_solicitante_id`),
  KEY `usuario_verificador_id` (`usuario_verificador_id`),
  KEY `idx_transferencias_estado` (`estado_transferencia_id`),
  CONSTRAINT `Transferencias_ibfk_2` FOREIGN KEY (`bodega_origen_id`) REFERENCES `Bodegas` (`bodega_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Transferencias_ibfk_3` FOREIGN KEY (`bodega_destino_id`) REFERENCES `Bodegas` (`bodega_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Transferencias_ibfk_4` FOREIGN KEY (`usuario_solicitante_id`) REFERENCES `Usuarios` (`usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Transferencias_ibfk_5` FOREIGN KEY (`usuario_verificador_id`) REFERENCES `Usuarios` (`usuario_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Transferencias_ibfk_6` FOREIGN KEY (`estado_transferencia_id`) REFERENCES `Estados_Transferencia` (`estado_transferencia_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Transferencias`
--

LOCK TABLES `Transferencias` WRITE;
/*!40000 ALTER TABLE `Transferencias` DISABLE KEYS */;
INSERT INTO `Transferencias` VALUES (1,1,2,3,'2024-11-01 00:23:51','2024-11-02 00:08:57',NULL,4,NULL,'test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test ',53623),(2,1,3,3,'2024-11-01 00:44:31','2024-11-02 13:12:03',NULL,4,NULL,'test',70950),(3,1,2,4,'2024-11-01 13:16:12',NULL,'2024-11-01 13:38:47',4,NULL,'1',28999),(4,1,3,4,'2024-11-01 20:12:15',NULL,'2024-11-01 20:14:45',4,NULL,'xd',54671),(5,1,3,2,'2024-11-02 13:17:22',NULL,NULL,4,NULL,'1',38053),(10,1,2,2,'2024-11-16 16:38:29',NULL,NULL,4,NULL,'Se envian cantidad acorde a stock de casas central',49586);
/*!40000 ALTER TABLE `Transferencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Transferencias_Detalles`
--

DROP TABLE IF EXISTS `Transferencias_Detalles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Transferencias_Detalles` (
  `detalle_id` int NOT NULL AUTO_INCREMENT,
  `transferencia_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad_despachada` int NOT NULL,
  `cantidad_recibida` int DEFAULT NULL,
  `precio_compra` int NOT NULL,
  `cantidad_dmg` int DEFAULT NULL,
  `cantidad_perdida` int DEFAULT NULL,
  PRIMARY KEY (`detalle_id`),
  KEY `IX_transferencias_detalles_transferencia_id` (`transferencia_id`),
  KEY `IX_transferencias_detalles_producto_id` (`producto_id`),
  CONSTRAINT `FK_transferencias_detalles_productos_producto_id` FOREIGN KEY (`producto_id`) REFERENCES `Productos` (`producto_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_transferencias_detalles_transferencias_transferencia_id` FOREIGN KEY (`transferencia_id`) REFERENCES `Transferencias` (`transferencia_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Transferencias_Detalles`
--

LOCK TABLES `Transferencias_Detalles` WRITE;
/*!40000 ALTER TABLE `Transferencias_Detalles` DISABLE KEYS */;
INSERT INTO `Transferencias_Detalles` VALUES (1,1,1,10,10,10,0,0),(2,1,1,20,19,9,1,0),(3,1,2,30,25,20,0,4),(4,2,1,5,4,10,1,0),(5,2,2,5,4,20,0,1),(6,3,1,1,NULL,10,NULL,NULL),(7,4,1,10,NULL,10,NULL,NULL),(8,5,1,24,NULL,10,NULL,NULL),(9,5,2,45,NULL,20,NULL,NULL),(10,10,182,35,NULL,3500,NULL,NULL);
/*!40000 ALTER TABLE `Transferencias_Detalles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuarios`
--

DROP TABLE IF EXISTS `Usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuarios` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `run` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol_id` int NOT NULL,
  `bodega_id` int NOT NULL,
  `estado_usuario_id` int NOT NULL,
  `refresh_token` varchar(500) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`usuario_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `Usuarios_UNIQUE` (`run`),
  KEY `rol_id` (`rol_id`),
  KEY `estado_usuario_id` (`estado_usuario_id`),
  KEY `bodega_id` (`bodega_id`),
  CONSTRAINT `Usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `Roles` (`rol_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Usuarios_ibfk_2` FOREIGN KEY (`estado_usuario_id`) REFERENCES `Estados_Usuarios` (`estado_usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Usuarios_ibfk_3` FOREIGN KEY (`bodega_id`) REFERENCES `Bodegas` (`bodega_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuarios`
--

LOCK TABLES `Usuarios` WRITE;
/*!40000 ALTER TABLE `Usuarios` DISABLE KEYS */;
INSERT INTO `Usuarios` VALUES (1,'12345678-5','Juan','Pérez','juan@empresa.com','$2a$11$iy1CSrn5gUJX5uIWfeT4qO7WuuWmyz5oPKRiJE42R2RxD94ONnera',1,1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOiIxIiwiZW1haWwiOiJqdWFuQGVtcHJlc2EuY29tIiwiYXVkIjoiSW52ZW50YVBybyIsImlzcyI6IkludmVudGFQcm8iLCJleHAiOjE3MzIzMjE2MzMsImlhdCI6MTczMTcxNjgzMywibmJmIjoxNzMxNzE2ODMzfQ.3yvl_GLus4hKgCkdcmdgyqLLk6Wd5iKqfKHvGk0inmQ','2024-10-09 16:14:50','2024-11-15 21:27:13'),(2,'10154704-3','María','López','maria@empresa.com','$2a$11$2z2YHMOK33RPdUW9x9vHje9CQy8fkadB6pdPd2cz0zJDgOi5MnFq6',11,2,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOiIyIiwiZW1haWwiOiJtYXJpYUBlbXByZXNhLmNvbSIsImF1ZCI6IkludmVudGFQcm8iLCJpc3MiOiJJbnZlbnRhUHJvIiwiZXhwIjoxNzMyMzkwMTIyLCJpYXQiOjE3MzE3ODUzMjIsIm5iZiI6MTczMTc4NTMyMn0.R1xiAMIjXHQtWPggrzow6hDEydw6tShSxGung4XEWWA','2024-10-09 16:14:50','2024-11-16 16:28:43'),(3,'34567890-3','Carlos','Gómez','carlos@empresa.com','[hashed_password]',1,1,1,NULL,'2024-10-09 16:14:50','2024-10-30 08:01:35'),(4,'45678901-2','Leydinn','Leydin','leydin@test.com','$2a$11$JmswIJ/OleQUsQZxHnbOnOcz8TukcckbIyFKaeTOVajNSMQ78Vw8y',1,1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOiI0IiwiZW1haWwiOiJsZXlkaW5AdGVzdC5jb20iLCJhdWQiOiJJbnZlbnRhUHJvIiwiaXNzIjoiSW52ZW50YVBybyIsImV4cCI6MTczMjM5MDI1OSwiaWF0IjoxNzMxNzg1NDU5LCJuYmYiOjE3MzE3ODU0NTl9.HcdV0yDMCErqEpwlRaQPjmwZN6NrfRD7yfiTWKKGpw4','0001-01-01 00:00:00','2024-11-16 16:30:59'),(5,'56789012-1','Adrian','Castros','Adriancastros12@gmail.com','$2a$11$lmUvLb7H/C1wH6ZJ2wSP4e99CZEL1etkarfsgjhdK.4ChgxQ9ts0q',1,1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOiI1IiwiZW1haWwiOiJBZHJpYW5jYXN0cm9zMTJAZ21haWwuY29tIiwiYXVkIjoiSW52ZW50YVBybyIsImlzcyI6IkludmVudGFQcm8iLCJleHAiOjE3Mjk2MzkzMzQsImlhdCI6MTcyOTAzNDUzNCwibmJmIjoxNzI5MDM0NTM0fQ.Py_CfJGV1xRwyQAIqMpuZ-v893hX6qkdR8fgzP45vhI','0001-01-01 00:00:00','2024-10-30 08:01:35'),(8,'89012345-8','Guadalupe','Salgado','Lupesalga@gmail.com','$2a$11$/byToXcsrlmjrDqeZ/X.memqRVqkiDev8wXnBWHcIxFDL0AdxJaZq',1,1,1,NULL,'0001-01-01 00:00:00','2024-10-30 08:01:35'),(9,'90123456-7','test','testt','test@test.com','$2a$11$ASRAvnIJ34VA.s02jVoWy.xtFi691C1OQNdo7peGvj4X9bN8m7Cou',1,1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOiI5IiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiYXVkIjoiSW52ZW50YVBybyIsImlzcyI6IkludmVudGFQcm8iLCJleHAiOjE3MzE5NTk3NTYsImlhdCI6MTczMTM1NDk1NiwibmJmIjoxNzMxMzU0OTU2fQ.YNn9oS3gshmH2MvlqjNd6Mymi1FrF6KNmGeLrPAk47A','0001-01-01 00:00:00','2024-11-11 16:55:56'),(10,'11222333-6','test','1','test1@gmail.com','$2a$11$EoUopad07JvL3IM/8i8Tk.TZ9d2afts1wRDB4BcCeSsdoazdbqejC',12,1,1,NULL,'0001-01-01 00:00:00','2024-10-30 08:01:35'),(11,'22333444-5','test','2','test2@gmail.com','$2a$11$7L4Z0SscrQE32rYlR4oOPO/oaJ8y9RzAqn0EoTRQ8A093PXtiMWMK',12,1,1,NULL,'0001-01-01 00:00:00','2024-10-30 08:01:35'),(16,'77888999-K','Pepe','A','pPepe@gmail.com','$2a$11$BTNobdi5d1bGKUg0JSYfIO6KBtRXk3/eJ4wNxxhaCcEx5xAFn9ijq',13,1,1,NULL,'0001-01-01 00:00:00','2024-10-30 08:01:35'),(17,'88999000-9','Jonh','AA','JonhA@gmail.com','$2a$11$Ds9wPVW.MHRDUptSCFn6/.q9FKCaooMLtJAy5RXKGZQT1v0X38lYC',11,1,1,NULL,'0001-01-01 00:00:00','2024-10-30 08:01:35'),(18,'9185340-K','Cristian','Silva','cristian@gmail.com','$2a$11$DsBXbGlBbt77gzefSQfZ5.4NGYiaK5J0s1kNyykVOaDmTVNkGQXaq',12,2,1,NULL,'2024-10-24 14:09:07','2024-11-03 22:35:44'),(19,'10111222-7','Juan','Perez','juan.perez@inventapro.com','$2a$11$XEkg/QOruGjcLWiYE7pJgOTSfC3sAKi3H0Tdld/BL.1JZx2MRZZWS',10,1,1,NULL,'2024-10-28 11:54:51','2024-10-30 08:01:35'),(20,'21222333-6','Maria','Gonzalez','maria.gonzalez@inventapro.com','$2a$11$lJMWjQzql1BtJY4esHBL0ucgiMIG3qFUDfVZ.ecUZpK9lL3J//vV6',21,1,1,NULL,'2024-10-28 11:55:54','2024-10-30 08:01:35'),(21,'32333444-5','Carlos','Lopez','carlos.lopez@inventapro.com','$2a$11$SZ.SfXMFQscuNMsm7Wapj.ynjRxKbxXllo1RfGB/3cje.WJABpaZO',22,1,1,NULL,'2024-10-28 11:57:23','2024-10-30 08:01:35'),(22,'43444555-4','Sofia','Rodriguez','sofia.rodriguez@inventapro.com','$2a$11$/HYwVsprzaAySKc96ZiXjuk/BcfvVFveOolmIZOf7BfCmfoPtbrNK',20,1,1,NULL,'2024-10-28 11:59:15','2024-10-30 08:01:35'),(23,'54555666-3','Laura','Jimenez','laura.jimenez@inventapro.com','$2a$11$2XXc2qsaFyawbnZ1o5ld/evuSithCO0SBcHaCUzt9VRNdBDVCUOSy',20,1,1,NULL,'2024-10-28 12:00:07','2024-10-30 08:01:35'),(24,'65666777-2','Andres','Torres','andres.torres@inventapro.com','$2a$11$3Kxrffvep9JfSFoAu09cQOPHMoXbgyrLuTvgKSlKDmWPN1yzsRcRq',21,1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOiIyNCIsImVtYWlsIjoiYW5kcmVzLnRvcnJlc0BpbnZlbnRhcHJvLmNvbSIsImF1ZCI6IkludmVudGFQcm8iLCJpc3MiOiJJbnZlbnRhUHJvIiwiZXhwIjoxNzMxMzcwMzYxLCJpYXQiOjE3MzA3NjU1NjEsIm5iZiI6MTczMDc2NTU2MX0.BAEPYwqa0JhFgH08Jv6OtAGPor5m2q1hU8gK9dDeH3w','2024-10-28 12:00:37','2024-11-04 21:12:41'),(25,'23345620-9','Daniela','Morales','daniela.morales@inventapro.com','$2a$11$yomMbxbKW67iSfBWSo7mX.x9csc5kvkCCwxddL9Fdwg9L4ZgoPO3.',12,2,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOiIyNSIsImVtYWlsIjoiZGFuaWVsYS5tb3JhbGVzQGludmVudGFwcm8uY29tIiwiYXVkIjoiSW52ZW50YVBybyIsImlzcyI6IkludmVudGFQcm8iLCJleHAiOjE3MzE0NTA0NTksImlhdCI6MTczMDg0NTY1OSwibmJmIjoxNzMwODQ1NjU5fQ.5u0oVCkLxtJ4rSeIURxQneVPIcUE51L3QmgPuUsSq2A','2024-10-28 12:01:25','2024-11-05 19:27:39'),(26,'87888999-K','Ricardo','Castillo','ricardo.castillo@inventapro.com','$2a$11$bVTku0RQ05GkARpeHzUYB.S2aOcub/zuWblOmd7qKZixzS4zmgIfa',10,1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOiIyNiIsImVtYWlsIjoicmljYXJkby5jYXN0aWxsb0BpbnZlbnRhcHJvLmNvbSIsImF1ZCI6IkludmVudGFQcm8iLCJpc3MiOiJJbnZlbnRhUHJvIiwiZXhwIjoxNzMxNDUxNTEwLCJpYXQiOjE3MzA4NDY3MTAsIm5iZiI6MTczMDg0NjcxMH0.Y5fNG-hXABI8tkA3nGUAOi1OxWSRu9TqltxcEUEJUcY','2024-10-28 12:02:04','2024-11-05 19:45:10'),(27,'98999000-9','Fernanda','Vargas','fernanda.vargas@inventapro.com	','$2a$11$OdbVS42PTICj7Qgt9APO0ObrhaLeBhJP9oKhkB89PBesWaSbl9jiW',21,1,1,NULL,'2024-10-28 12:02:38','2024-10-30 08:01:35'),(28,'19200111-8','Pedro','Silva','pedro.silva@inventapro.com','$2a$11$OP/gSkyMihHJoH4hGwoUHOYlaEURNHufjfMR/OdFOWZpEe7oM0Z6e',22,1,1,NULL,'2024-10-28 12:03:09','2024-10-30 08:01:35'),(29,'20311222-7','Isabel','Herrera','isabel.herrera@inventapro.com','$2a$11$N/GNdGwoByAIEw.kSC9.g.43IgXgoj0wmLLGbR8SHdVLS2HKzpU3u',20,1,1,NULL,'2024-10-28 12:03:37','2024-10-30 08:01:35'),(30,'20714016-3','Luis','Rios','luis.rios@inventapro.com','$2a$11$j05aU11aB4Z8APu4v6IbjuUP6jlxoLX4c4mxEPRn3fC03iNUvGQJe',12,2,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOiIzMCIsImVtYWlsIjoibHVpcy5yaW9zQGludmVudGFwcm8uY29tIiwiYXVkIjoiSW52ZW50YVBybyIsImlzcyI6IkludmVudGFQcm8iLCJleHAiOjE3MzEwMjU3NjUsImlhdCI6MTczMDQyMDk2NSwibmJmIjoxNzMwNDIwOTY1fQ.gsrB-Z0Rt4q0ik63SBh7oGNuf_2_ZrPI7MT8aNxR_5s','2024-10-28 12:04:13','2024-10-31 21:29:25'),(31,'42533444-5','Valentina','Martinez','valentina.martinez@inventapro.com','$2a$11$v4Q5A.vQtw/.S0UksSuim.vxMIQGaXtIOtJHyimxuAwK9L44ltNaa',11,2,1,NULL,'2024-10-28 18:51:07','2024-10-30 08:01:35'),(32,'53644555-4','Natalia','Mendoza','natalia.mendoza@inventapro.com','$2a$11$8HeC4JEXDHdSEeNOGOZ8LesYsICApYVvCg8ApOXTTgtknT.0LRW3i',25,2,1,NULL,'2024-10-28 18:52:04','2024-10-30 08:01:35'),(33,'64755666-3','Marcos','Torres','marcos.torres@inventapro.com','$2a$11$hB0HV8.U1OJ.xVM5OPYDaOSl8UaBOhOYgpkDy2oHsGNOX4sBhfFLG',11,2,1,NULL,'2024-10-28 18:52:57','2024-10-30 08:01:35'),(34,'75866777-2','Gabriela','Flores','gabriela.flores@inventapro.com','$2a$11$DCZzsNeUwcjvHhXkL0TOzO2Y0wP9zmaQ.h0F7cvbpBtfuQrLz8ZiW',12,2,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOiIzNCIsImVtYWlsIjoiZ2FicmllbGEuZmxvcmVzQGludmVudGFwcm8uY29tIiwiYXVkIjoiSW52ZW50YVBybyIsImlzcyI6IkludmVudGFQcm8iLCJleHAiOjE3MzE0NDk5OTgsImlhdCI6MTczMDg0NTE5OCwibmJmIjoxNzMwODQ1MTk4fQ.eXjaizrPHXTwPgw2SGtY0CW55fPbq6o2SJArI83FYFo','2024-10-28 18:53:26','2024-11-05 19:19:58'),(35,'9366326-8','Javier','Ruiz','javier.ruiz@inventapro.com','$2a$11$7vKrUiCj9WowzZqZbKi8iORb1kCuTxcXwc4YQ9lMzmg1.axV4naHe',25,2,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOiIzNSIsImVtYWlsIjoiamF2aWVyLnJ1aXpAaW52ZW50YXByby5jb20iLCJhdWQiOiJJbnZlbnRhUHJvIiwiaXNzIjoiSW52ZW50YVBybyIsImV4cCI6MTczMTg5NjU5OSwiaWF0IjoxNzMxMjkxNzk5LCJuYmYiOjE3MzEyOTE3OTl9.EkfvIOOPBeAUlWSJkLSobgQTmsF-vjYiInPLaxINcs8','2024-10-28 18:54:11','2024-11-10 23:23:20'),(36,'97088999-K','Mariana','Castro','mariana.castro@inventapro.com','$2a$11$B8POTx7AFXOQX2DqOJkFweAw6mMRKEO99JBjzOzaaSabV5kBpMS5a',28,3,1,NULL,'2024-10-28 18:55:09','2024-10-30 08:01:35'),(37,'08199000-9','Esteban','Mendez','esteban.mendez@inventapro.com	','$2a$11$jM4jHF8lg7EHzki09VpluOGdRQk/PXv6SQKSubUCuHsSggJzeH0Qm',29,3,1,NULL,'2024-10-28 18:56:09','2024-10-30 08:01:35'),(38,'19210111-8','Patricia','Lopez','patricia.lopez@inventapro.com','$2a$11$RqXqAMRRnopVSS.fgAIm9.DewCG5ArcW/Wbxn5bJpGvXsE0H9aZfi',30,3,1,NULL,'2024-10-28 18:58:38','2024-10-30 08:01:35'),(39,'30321222-7','Alan','Jimenez','alan.jimenez@inventapro.com','$2a$11$ULaBJLHgJwyA2x4HoBenX.xanuOl8qJkI/EqJM/hNQDgkNZNVYQkS',28,3,1,NULL,'2024-10-28 18:59:22','2024-10-30 08:01:35'),(40,'41432333-6','Tomas','Ortega','tomas.ortega@inventapro.com','$2a$11$oymccyzRy0q.mJp0D/yaRO1c..ZQwpSFvCfLEGTHZigm2vMsQ0uS2',29,3,1,NULL,'2024-10-28 19:00:07','2024-10-30 08:01:35'),(41,'52543444-5','Carla','Ruiz','carla.ruiz@inventapro.com','$2a$11$jJ2P5Rrt9Gwus1AagoyC0.RfUDLBr4rxk7YWOMHxY7y9JYXm5Tseu',30,3,1,NULL,'2024-10-28 19:00:49','2024-10-30 08:01:35'),(42,'63654555-4','super','rol','super.rol@test@gmail.com','$2a$11$nXlSP0sGIt6hSyNEZSFmJ.y3Eg3iYuWziinjG2D9Q2AAh5n9.KxpS',33,1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOiI0MiIsImVtYWlsIjoic3VwZXIucm9sQHRlc3RAZ21haWwuY29tIiwiYXVkIjoiSW52ZW50YVBybyIsImlzcyI6IkludmVudGFQcm8iLCJleHAiOjE3MzA4MDcwNjYsImlhdCI6MTczMDIwMjI2NiwibmJmIjoxNzMwMjAyMjY2fQ.INZqoKRNjEUIiV2268Mjp36gCzKthxlTXWsyWtYgpOc','2024-10-29 08:44:07','2024-10-30 08:01:35'),(43,'21541017-K','Juanita','Tapia','juanita.tapia@inventapro.com','$2a$11$4uEjEQniGpe5bTZfr9nCte61p4bpZyCgAO8j9HUCdrg6JJz2tDFi2',10,1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOiI0MyIsImVtYWlsIjoianVhbml0YS50YXBpYUBpbnZlbnRhcHJvLmNvbSIsImF1ZCI6IkludmVudGFQcm8iLCJpc3MiOiJJbnZlbnRhUHJvIiwiZXhwIjoxNzMxNDUxMzE0LCJpYXQiOjE3MzA4NDY1MTQsIm5iZiI6MTczMDg0NjUxNH0.kJAfT0FYBx-gAKKLxxFnXw3G62hMNnN8b5lrXFDckpY','2024-11-03 21:29:59','2024-11-05 19:42:35'),(44,'3423434-5','Juan','Pintoo','juan.pinto@inventapro.com','$2a$11$XllLGGP/7ZYsIvrByWHyHOXi58IjG.T2VaLecnfT5E3LY3a00ViGy',26,2,1,NULL,'2024-11-11 18:03:07','2024-11-11 18:31:42');
/*!40000 ALTER TABLE `Usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-16 17:39:46
