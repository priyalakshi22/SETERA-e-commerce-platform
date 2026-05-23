CREATE DATABASE IF NOT EXISTS setera_db;
USE setera_db;

CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)        NOT NULL,
  email       VARCHAR(150)        NOT NULL UNIQUE,
  password    VARCHAR(255)        NOT NULL,
  created_at  DATETIME            DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  order_ref       VARCHAR(30)         NOT NULL UNIQUE,
  user_id         INT                 NULL,         
  email           VARCHAR(150)        NOT NULL,
  first_name      VARCHAR(80)         NOT NULL,
  last_name       VARCHAR(80)         NOT NULL,
  address         TEXT                NOT NULL,
  city            VARCHAR(80)         NOT NULL,
  phone           VARCHAR(30)         NOT NULL,
  subtotal        DECIMAL(12,2)       NOT NULL,
  promo_deduction DECIMAL(12,2)       NOT NULL DEFAULT 0,
  delivery_fee    DECIMAL(12,2)       NOT NULL DEFAULT 0,
  grand_total     DECIMAL(12,2)       NOT NULL,
  status          ENUM('pending','processing','shipped','delivered','cancelled')
                                      DEFAULT 'pending',
  placed_at       DATETIME            DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_lines (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  order_id    INT             NOT NULL,
  product_id  VARCHAR(60)     NOT NULL,
  name        VARCHAR(200)    NOT NULL,
  category    VARCHAR(60)     NOT NULL,
  unit_price  DECIMAL(12,2)   NOT NULL,
  quantity    INT             NOT NULL,
  line_total  DECIMAL(12,2)   NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
