CREATE DATABASE  IF NOT EXISTS `gestion_inventario` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gestion_inventario`;
-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: 3.83.165.38    Database: gestion_inventario
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.22.04.1

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
  PRIMARY KEY (`alerta_id`),
  KEY `producto_id` (`producto_id`),
  KEY `bodega_id` (`bodega_id`),
  KEY `idx_alertas_tipo_alerta` (`tipo_alerta_id`),
  KEY `idx_alertas_estado_alerta` (`estado_alerta_id`),
  CONSTRAINT `Alertas_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `Productos` (`producto_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Alertas_ibfk_2` FOREIGN KEY (`bodega_id`) REFERENCES `Bodegas` (`bodega_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Alertas_ibfk_3` FOREIGN KEY (`tipo_alerta_id`) REFERENCES `Tipos_Alerta` (`tipo_alerta_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Alertas_ibfk_4` FOREIGN KEY (`estado_alerta_id`) REFERENCES `Estados_Alerta` (`estado_alerta_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Auditorias`
--

DROP TABLE IF EXISTS `Auditorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Auditorias` (
  `auditoria_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `accion` varchar(100) NOT NULL,
  `descripcion` text,
  `fecha_accion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`auditoria_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `Auditorias_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios` (`usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=193 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `fecha_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`bodega_id`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `tipo_bodega_id` (`tipo_bodega_id`),
  KEY `estado_bodega_id` (`estado_bodega_id`),
  CONSTRAINT `Bodegas_ibfk_1` FOREIGN KEY (`tipo_bodega_id`) REFERENCES `Tipos_Bodega` (`tipo_bodega_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Bodegas_ibfk_2` FOREIGN KEY (`estado_bodega_id`) REFERENCES `Estados_Bodegas` (`estado_bodega_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `precio_compra` decimal(10,2) NOT NULL,
  `fecha_compra` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_vencimiento` datetime DEFAULT NULL,
  PRIMARY KEY (`lote_id`),
  KEY `bodega_id` (`bodega_id`),
  KEY `idx_lotes_inventario_producto` (`producto_id`),
  KEY `idx_lotes_inventario_fecha_compra` (`fecha_compra`),
  CONSTRAINT `Lotes_Inventario_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `Productos` (`producto_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Lotes_Inventario_ibfk_2` FOREIGN KEY (`bodega_id`) REFERENCES `Bodegas` (`bodega_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Movimientos`
--

DROP TABLE IF EXISTS `Movimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Movimientos` (
  `movimiento_id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `bodega_id` int NOT NULL,
  `tipo_movimiento_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `fecha_movimiento` datetime DEFAULT CURRENT_TIMESTAMP,
  `usuario_id` int NOT NULL,
  `referencia_id` int DEFAULT NULL,
  `lote_id` int DEFAULT NULL,
  PRIMARY KEY (`movimiento_id`),
  KEY `producto_id` (`producto_id`),
  KEY `bodega_id` (`bodega_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `lote_id` (`lote_id`),
  KEY `idx_referencia_id` (`referencia_id`),
  KEY `idx_movimientos_tipo` (`tipo_movimiento_id`),
  CONSTRAINT `Movimientos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `Productos` (`producto_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Movimientos_ibfk_2` FOREIGN KEY (`bodega_id`) REFERENCES `Bodegas` (`bodega_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Movimientos_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios` (`usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Movimientos_ibfk_4` FOREIGN KEY (`tipo_movimiento_id`) REFERENCES `Tipos_Movimiento` (`tipo_movimiento_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Movimientos_ibfk_5` FOREIGN KEY (`lote_id`) REFERENCES `Lotes_Inventario` (`lote_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  PRIMARY KEY (`perdida_id`),
  KEY `producto_id` (`producto_id`),
  KEY `bodega_id` (`bodega_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `idx_perdidas_tipo_perdida` (`tipo_perdida_id`),
  CONSTRAINT `Perdidas_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `Productos` (`producto_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Perdidas_ibfk_2` FOREIGN KEY (`bodega_id`) REFERENCES `Bodegas` (`bodega_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Perdidas_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios` (`usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Perdidas_ibfk_4` FOREIGN KEY (`tipo_perdida_id`) REFERENCES `Tipos_Perdida` (`tipo_perdida_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=531 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
-- Table structure for table `Tipos_Movimiento`
--

DROP TABLE IF EXISTS `Tipos_Movimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tipos_Movimiento` (
  `tipo_movimiento_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`tipo_movimiento_id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `fecha_solicitud` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_envio` datetime DEFAULT NULL,
  `fecha_recepcion` datetime DEFAULT NULL,
  `usuario_solicitante_id` int NOT NULL,
  `usuario_verificador_id` int DEFAULT NULL,
  `observaciones` text,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `cantidad` int NOT NULL,
  PRIMARY KEY (`detalle_id`),
  KEY `IX_transferencias_detalles_transferencia_id` (`transferencia_id`),
  KEY `IX_transferencias_detalles_producto_id` (`producto_id`),
  CONSTRAINT `FK_transferencias_detalles_productos_producto_id` FOREIGN KEY (`producto_id`) REFERENCES `Productos` (`producto_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_transferencias_detalles_transferencias_transferencia_id` FOREIGN KEY (`transferencia_id`) REFERENCES `Transferencias` (`transferencia_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-29 20:27:38
