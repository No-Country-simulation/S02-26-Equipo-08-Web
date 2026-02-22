-- -----------------------------------------------------
-- Schema gestion_pacientes
-- -----------------------------------------------------
--DROP SCHEMA IF EXISTS gestion_pacientes CASCADE;
--CREATE SCHEMA gestion_pacientes;

-- Seteamos el esquema para no tener que escribirlo en cada tabla
--SET search_path TO gestion_pacientes;

-- -----------------------------------------------------
-- Table Pedido_estado
-- -----------------------------------------------------
CREATE TABLE Pedido_estado (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(45) NOT NULL
);

-- -----------------------------------------------------
-- Table rol
-- -----------------------------------------------------
CREATE TABLE rol (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(45) NOT NULL
);

-- -----------------------------------------------------
-- Table usuario
-- -----------------------------------------------------
CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  id_rol INT NOT NULL,
  email VARCHAR(60) NOT NULL UNIQUE,
  habilitado SMALLINT NOT NULL DEFAULT 1,
  password_hash VARCHAR(500),
  fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_ultimo_login TIMESTAMP,
  intentos_login INT NOT NULL DEFAULT 0,
  fecha_deshabilitado TIMESTAMP
);

CREATE INDEX idx_usuario_id ON usuario (id);

-- -----------------------------------------------------
-- Table cuidador_estado
-- -----------------------------------------------------
CREATE TABLE cuidador_estado (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(45)
);

-- -----------------------------------------------------
-- Table cuidador
-- -----------------------------------------------------
CREATE TABLE cuidador (
  id SERIAL PRIMARY KEY,
  id_usuario INT NOT NULL,
  cbu VARCHAR(40),
  cvu VARCHAR(40),
  alias VARCHAR(40),
  con_documentacion SMALLINT NOT NULL DEFAULT 0,
  id_cuidador_estado INT NOT NULL DEFAULT 1,
  id_autorizado_por INT NOT NULL,
  Fecha_autorizado TIMESTAMP,
  Fecha_ingreso DATE NOT NULL
);

-- -----------------------------------------------------
-- Table parentesco
-- -----------------------------------------------------
CREATE TABLE parentesco (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(50)
);

-- -----------------------------------------------------
-- Table familiar
-- -----------------------------------------------------
CREATE TABLE familiar (
  id SERIAL PRIMARY KEY,
  id_paciente INT NOT NULL,
  id_parentesco INT NOT NULL
);

-- -----------------------------------------------------
-- Table Persona
-- -----------------------------------------------------
CREATE TABLE Persona (
  id SERIAL PRIMARY KEY,
  id_usuario INT NOT NULL,
  apellido VARCHAR(60) NOT NULL,
  nombre VARCHAR(60) NOT NULL,
  identificacion VARCHAR(45) NOT NULL,
  direccion VARCHAR(1000) NOT NULL,
  telefono VARCHAR(200) NOT NULL,
  edad INT NOT NULL
);

CREATE INDEX idx_apellido_nombre ON Persona (apellido, nombre);

-- -----------------------------------------------------
-- Table Tarea
-- -----------------------------------------------------
CREATE TABLE Tarea (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(60) NOT NULL,
  valor_hora FLOAT NOT NULL,
  moneda VARCHAR(45)
);

-- -----------------------------------------------------
-- Table pedido_servicio
-- -----------------------------------------------------
CREATE TABLE pedido_servicio (
  id SERIAL PRIMARY KEY,
  id_usuario INT NOT NULL,
  fecha_del_servicio TIMESTAMP NOT NULL,
  hora_inicio TIME NOT NULL,
  cantidad_horas_solicitadas DOUBLE PRECISION NOT NULL,
  id_pedido_estado INT,
  fecha_finalizado DATE,
  Observaciones VARCHAR(1000)
);

-- -----------------------------------------------------
-- Table asignacion_servico
-- -----------------------------------------------------
CREATE TABLE asignacion_servico (
  id SERIAL PRIMARY KEY,
  id_cuidador INT NOT NULL,
  id_paciente INT NOT NULL,
  id_tarea INT NOT NULL,
  id_pedido INT NOT NULL,
  id_asignado_por INT,
  Fecha_asignacion TIMESTAMP
);

-- -----------------------------------------------------
-- Table guardia_estado
-- -----------------------------------------------------
CREATE TABLE guardia_estado (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(45) NOT NULL
);

-- -----------------------------------------------------
-- Table guardia
-- -----------------------------------------------------
CREATE TABLE guardia (
  id SERIAL PRIMARY KEY,
  id_asignacion INT,
  id_paciente INT,
  id_cuidador INT,
  id_pedido_servicio INT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  Hora_inicio TIME NOT NULL,
  hora_finalizacion TIME NOT NULL,
  id_guardia_estado INT,
  Observaciones TEXT
);

-- -----------------------------------------------------
-- Table log_auditoria
-- -----------------------------------------------------
CREATE TABLE log_auditoria (
  id SERIAL PRIMARY KEY,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_usuario INT NOT NULL,
  accion VARCHAR(250) NOT NULL,
  tabla_afectada VARCHAR(250) NOT NULL,
  valor_anterior JSONB,
  valor_nuevo JSONB,
  ip_direccion VARCHAR(45)
);

-- -----------------------------------------------------
-- Table pagos
-- -----------------------------------------------------
CREATE TABLE pagos (
  id SERIAL PRIMARY KEY,
  id_cuidador INT NOT NULL,
  id_guardia INT NOT NULL,
  fecha_pago TIMESTAMP,
  id_pago_autorizo INT,
  cantidad_horas TIME,
  importe_abonado FLOAT
);

-- -----------------------------------------------------
-- DATA INSERTION
-- -----------------------------------------------------
INSERT INTO Pedido_estado (descripcion) VALUES ('Solicitado'), ('Asignado'), ('Finalizado'), ('Facturado'), ('Anulado');

INSERT INTO cuidador_estado (descripcion) VALUES ('Pendiente de autorizar'), ('Autorizado'), ('No autorizado'), ('Falta presentar documentación');

INSERT INTO guardia_estado (descripcion) VALUES ('En progreso'), ('Finalizada'), ('Pagada');

INSERT INTO parentesco (descripcion) VALUES ('Padre'), ('Madre'), ('Tutor'), ('Hija/o'), ('Hermana/o'), ('Otro');

INSERT INTO rol (descripcion) VALUES ('Admin'), ('Paciente'), ('Cuidador'), ('Acompañante'), ('Familiar');
