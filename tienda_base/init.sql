CREATE SCHEMA tienda_abarrotes;
USE tienda_abarrotes;

-- PRODUCTO
CREATE TABLE producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    precio DECIMAL(10,2),
    stock INT
);


-- CLIENTE

CREATE TABLE cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    telefono VARCHAR(20),
    correo VARCHAR(100)
);

-- VENTA
CREATE TABLE venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2),
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

-- DETALLE VENTA
CREATE TABLE detalle_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT,
    producto_id INT,
    cantidad INT,
    precio_unitario DECIMAL(10,2),
    FOREIGN KEY (venta_id) REFERENCES venta(id),
    FOREIGN KEY (producto_id) REFERENCES producto(id)
);

-- PROVEEDOR
CREATE TABLE proveedor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    telefono VARCHAR(20)
);

-- COMPRA
CREATE TABLE compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2),
    FOREIGN KEY (proveedor_id) REFERENCES proveedor(id)
);

-- FACTURA
CREATE TABLE factura (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2),
    FOREIGN KEY (venta_id) REFERENCES venta(id)
);

-- PAGO
CREATE TABLE pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('VENTA','COMPRA'),
    referencia_id INT,
    monto DECIMAL(10,2),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
