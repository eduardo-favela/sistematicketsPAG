-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema sistematicketspag
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `sistematicketspag` ;

-- -----------------------------------------------------
-- Schema sistematicketspag
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `sistematicketspag` DEFAULT CHARACTER SET utf8 ;

-- -----------------------------------------------------
-- Table `sistematicketspag`.`etapas_proyecto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`etapas_proyecto` (
  `id_etapa` INT NOT NULL AUTO_INCREMENT,
  `etapa` VARCHAR(25) NULL,
  PRIMARY KEY (`id_etapa`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`regiones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`regiones` (
  `idregiones` INT(11) NOT NULL AUTO_INCREMENT,
  `region` VARCHAR(20) NULL DEFAULT NULL,
  PRIMARY KEY (`idregiones`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`uens`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`uens` (
  `idUEN` INT(11) NOT NULL AUTO_INCREMENT,
  `UEN` VARCHAR(20) NULL DEFAULT NULL,
  `regiones_idregiones` INT(11) NOT NULL,
  `status` VARCHAR(10) NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`idUEN`),
  INDEX `fk_UENS_regiones1_idx` (`regiones_idregiones` ASC),
  CONSTRAINT `fk_UENS_regiones1`
    FOREIGN KEY (`regiones_idregiones`)
    REFERENCES `sistematicketspag`.`regiones` (`idregiones`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 30
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`puestos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`puestos` (
  `id_puesto` INT NOT NULL,
  `puesto` VARCHAR(45) NULL,
  PRIMARY KEY (`id_puesto`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`empleados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`empleados` (
  `idempleado` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(60) NOT NULL,
  `apellido_paterno` VARCHAR(45) NULL DEFAULT NULL,
  `apellido_materno` VARCHAR(45) NULL DEFAULT NULL,
  `UENS_idUEN` INT(11) NOT NULL,
  `puestos_id_puesto` INT NOT NULL,
  PRIMARY KEY (`idempleado`),
  UNIQUE INDEX `idempleado_UNIQUE` (`idempleado` ASC),
  INDEX `fk_empleados_UENS1_idx` (`UENS_idUEN` ASC),
  INDEX `fk_empleados_puestos1_idx` (`puestos_id_puesto` ASC),
  CONSTRAINT `fk_empleados_UENS1`
    FOREIGN KEY (`UENS_idUEN`)
    REFERENCES `sistematicketspag`.`uens` (`idUEN`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_empleados_puestos1`
    FOREIGN KEY (`puestos_id_puesto`)
    REFERENCES `sistematicketspag`.`puestos` (`id_puesto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 520
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`departamentos_sistema`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`departamentos_sistema` (
  `iddepartamento` INT(11) NOT NULL AUTO_INCREMENT,
  `departamento` VARCHAR(25) NULL DEFAULT NULL,
  PRIMARY KEY (`iddepartamento`),
  UNIQUE INDEX `iddepartamentos_UNIQUE` (`iddepartamento` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`equipo_sistemas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`equipo_sistemas` (
  `empleados_idempleado` INT(11) NOT NULL,
  `departamentos_sistema_iddepartamento` INT(11) NOT NULL,
  PRIMARY KEY (`empleados_idempleado`),
  INDEX `fk_equipo_sistemas_empleados_idx` (`empleados_idempleado` ASC),
  INDEX `fk_equipo_sistemas_departamentos_sistema1_idx` (`departamentos_sistema_iddepartamento` ASC),
  CONSTRAINT `fk_equipo_sistemas_empleados`
    FOREIGN KEY (`empleados_idempleado`)
    REFERENCES `sistematicketspag`.`empleados` (`idempleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_equipo_sistemas_departamentos_sistema1`
    FOREIGN KEY (`departamentos_sistema_iddepartamento`)
    REFERENCES `sistematicketspag`.`departamentos_sistema` (`iddepartamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`marcas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`marcas` (
  `id_marca` INT NOT NULL,
  `marca` VARCHAR(45) NULL,
  PRIMARY KEY (`id_marca`))
ENGINE = InnoDB;

USE `sistematicketspag` ;

-- -----------------------------------------------------
-- Table `sistematicketspag`.`tipo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`tipo` (
  `idtipo` INT(11) NOT NULL AUTO_INCREMENT,
  `tipo_equipo` VARCHAR(20) NULL DEFAULT NULL,
  PRIMARY KEY (`idtipo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`equipos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`equipos` (
  `idequipo` INT(11) NOT NULL AUTO_INCREMENT,
  `equipo` VARCHAR(45) NULL DEFAULT NULL,
  `propiedad` VARCHAR(25) NULL,
  `no_serie` VARCHAR(45) NULL,
  `etatus` VARCHAR(25) NULL,
  `tipo_idtipo` INT(11) NOT NULL,
  `marcas_id_marca` INT NOT NULL,
  PRIMARY KEY (`idequipo`),
  UNIQUE INDEX `idequipo_UNIQUE` (`idequipo` ASC),
  INDEX `fk_equipos_tipo1_idx` (`tipo_idtipo` ASC),
  INDEX `fk_equipos_marcas1_idx` (`marcas_id_marca` ASC),
  UNIQUE INDEX `no_serie_UNIQUE` (`no_serie` ASC),
  CONSTRAINT `fk_equipos_tipo1`
    FOREIGN KEY (`tipo_idtipo`)
    REFERENCES `sistematicketspag`.`tipo` (`idtipo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_equipos_marcas1`
    FOREIGN KEY (`marcas_id_marca`)
    REFERENCES `sistematicketspag`.`marcas` (`id_marca`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`empleados_has_equipos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`empleados_has_equipos` (
  `empleados_idempleado` INT(11) NOT NULL,
  `equipos_idequipo` INT(11) NOT NULL,
  `empleados_has_equipos_responsiva` TINYINT NULL,
  `empleados_has_fecha_asign` DATETIME NULL,
  `empleados_has_estatus` VARCHAR(20) NULL,
  PRIMARY KEY (`empleados_idempleado`, `equipos_idequipo`),
  INDEX `fk_empleados_has_equipos_equipos1_idx` (`equipos_idequipo` ASC),
  INDEX `fk_empleados_has_equipos_empleados1_idx` (`empleados_idempleado` ASC),
  CONSTRAINT `fk_empleados_has_equipos_empleados1`
    FOREIGN KEY (`empleados_idempleado`)
    REFERENCES `sistematicketspag`.`empleados` (`idempleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_empleados_has_equipos_equipos1`
    FOREIGN KEY (`equipos_idequipo`)
    REFERENCES `sistematicketspag`.`equipos` (`idequipo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`estatus`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`estatus` (
  `idestatus` INT(11) NOT NULL AUTO_INCREMENT,
  `estatus` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`idestatus`),
  UNIQUE INDEX `idestatus_UNIQUE` (`idestatus` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`proyectos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`proyectos` (
  `idproyecto` INT(11) NOT NULL AUTO_INCREMENT,
  `proyecto` VARCHAR(80) NOT NULL,
  `depto` INT(11) NOT NULL,
  PRIMARY KEY (`idproyecto`),
  UNIQUE INDEX `idproyecto_UNIQUE` (`idproyecto` ASC),
  INDEX `fk_depto_idx` (`depto` ASC),
  CONSTRAINT `fk_depto_proyecto`
    FOREIGN KEY (`depto`)
    REFERENCES `sistematicketspag`.`departamentos_sistema` (`iddepartamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 52
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`servicios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`servicios` (
  `idservicios` INT(11) NOT NULL AUTO_INCREMENT,
  `servicio` VARCHAR(25) NOT NULL,
  `depto` INT(11) NOT NULL,
  PRIMARY KEY (`idservicios`),
  UNIQUE INDEX `idservicios_UNIQUE` (`idservicios` ASC),
  INDEX `fk_depto_idx` (`depto` ASC),
  CONSTRAINT `fk_depto`
    FOREIGN KEY (`depto`)
    REFERENCES `sistematicketspag`.`departamentos_sistema` (`iddepartamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`tickets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`tickets` (
  `idticket` INT(11) NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NOT NULL,
  `fecha_respuesta` DATETIME NULL DEFAULT NULL,
  `tiempo_resolucion_servicio` DOUBLE NULL DEFAULT NULL,
  `tiempo_resolucion_real` DOUBLE NULL DEFAULT NULL,
  `descripcion_servicio` TEXT NULL DEFAULT NULL,
  `comentarios` TEXT NULL DEFAULT NULL,
  `empleados_idempleado` INT(11) NOT NULL,
  `UENS_idUEN` INT(11) NOT NULL,
  `proyectos_idproyecto` INT(11) NOT NULL,
  `servicios_idservicios` INT(11) NOT NULL,
  `estatus_idestatus` INT(11) NOT NULL,
  PRIMARY KEY (`idticket`),
  INDEX `fk_tickets_empleados1_idx` (`empleados_idempleado` ASC),
  INDEX `fk_tickets_UENS1_idx` (`UENS_idUEN` ASC),
  INDEX `fk_tickets_proyectos1_idx` (`proyectos_idproyecto` ASC),
  INDEX `fk_tickets_servicios1_idx` (`servicios_idservicios` ASC),
  INDEX `fk_tickets_estatus1_idx` (`estatus_idestatus` ASC),
  CONSTRAINT `fk_tickets_UENS1`
    FOREIGN KEY (`UENS_idUEN`)
    REFERENCES `sistematicketspag`.`uens` (`idUEN`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tickets_empleados1`
    FOREIGN KEY (`empleados_idempleado`)
    REFERENCES `sistematicketspag`.`empleados` (`idempleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tickets_estatus1`
    FOREIGN KEY (`estatus_idestatus`)
    REFERENCES `sistematicketspag`.`estatus` (`idestatus`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tickets_proyectos1`
    FOREIGN KEY (`proyectos_idproyecto`)
    REFERENCES `sistematicketspag`.`proyectos` (`idproyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tickets_servicios1`
    FOREIGN KEY (`servicios_idservicios`)
    REFERENCES `sistematicketspag`.`servicios` (`idservicios`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`seguimientos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`seguimientos` (
  `idseguimiento` INT(11) NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NOT NULL,
  `comentarios` TEXT NOT NULL,
  `tiemporesolucion` DOUBLE NOT NULL,
  `tickets_idticket` INT(11) NOT NULL,
  `estatus_idestatus` INT(11) NOT NULL,
  PRIMARY KEY (`idseguimiento`),
  UNIQUE INDEX `idseguimiento_UNIQUE` (`idseguimiento` ASC),
  INDEX `fk_seguimientos_tickets1_idx` (`tickets_idticket` ASC),
  INDEX `fk_seguimientos_estatus1_idx` (`estatus_idestatus` ASC),
  CONSTRAINT `fk_seguimientos_estatus1`
    FOREIGN KEY (`estatus_idestatus`)
    REFERENCES `sistematicketspag`.`estatus` (`idestatus`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_seguimientos_tickets1`
    FOREIGN KEY (`tickets_idticket`)
    REFERENCES `sistematicketspag`.`tickets` (`idticket`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`tipos_servicio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`tipos_servicio` (
  `idtipos_servicio` INT(11) NOT NULL AUTO_INCREMENT,
  `tiposervicio` VARCHAR(45) NOT NULL,
  `servicios_idservicios` INT(11) NOT NULL,
  `timpo_resolucion_max` DOUBLE NULL,
  PRIMARY KEY (`idtipos_servicio`),
  UNIQUE INDEX `idtips_servicio_UNIQUE` (`idtipos_servicio` ASC),
  INDEX `fk_tipos_servicio_servicios1_idx` (`servicios_idservicios` ASC),
  CONSTRAINT `fk_tipos_servicio_servicios1`
    FOREIGN KEY (`servicios_idservicios`)
    REFERENCES `sistematicketspag`.`servicios` (`idservicios`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`usuarios` (
  `idusuario` INT(11) NOT NULL AUTO_INCREMENT,
  `user` VARCHAR(45) NOT NULL,
  `pass` VARCHAR(60) NOT NULL,
  `empleados_idempleado` INT(11) NOT NULL,
  PRIMARY KEY (`idusuario`),
  UNIQUE INDEX `user_UNIQUE` (`user` ASC),
  UNIQUE INDEX `pass_UNIQUE` (`pass` ASC),
  UNIQUE INDEX `idusuario_UNIQUE` (`idusuario` ASC),
  INDEX `fk_usuarios_empleados1_idx` (`empleados_idempleado` ASC),
  CONSTRAINT `fk_usuarios_empleados1`
    FOREIGN KEY (`empleados_idempleado`)
    REFERENCES `sistematicketspag`.`empleados` (`idempleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `sistematicketspag`.`proyectos_has_etapas_proyecto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sistematicketspag`.`proyectos_has_etapas_proyecto` (
  `proyectos_idproyecto` INT(11) NOT NULL,
  `etapas_proyecto_id_etapa` INT NOT NULL,
  `tiempo_duracion` DOUBLE NULL,
  `secuencia` INT NULL,
  PRIMARY KEY (`proyectos_idproyecto`, `etapas_proyecto_id_etapa`),
  INDEX `fk_proyectos_has_etapas_proyecto_etapas_proyecto1_idx` (`etapas_proyecto_id_etapa` ASC),
  INDEX `fk_proyectos_has_etapas_proyecto_proyectos1_idx` (`proyectos_idproyecto` ASC),
  CONSTRAINT `fk_proyectos_has_etapas_proyecto_proyectos1`
    FOREIGN KEY (`proyectos_idproyecto`)
    REFERENCES `sistematicketspag`.`proyectos` (`idproyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_proyectos_has_etapas_proyecto_etapas_proyecto1`
    FOREIGN KEY (`etapas_proyecto_id_etapa`)
    REFERENCES `sistematicketspag`.`etapas_proyecto` (`id_etapa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
