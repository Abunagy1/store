/* Replace with your SQL commands */
CREATE TYPE type AS ENUM ('DVD', 'Furnature', 'Book');
CREATE TABLE products (id SERIAL PRIMARY KEY, sku VARCHAR(50), name VARCHAR(100), price INTEGER, Type_Switcher type, category VARCHAR(50), rating NUMERIC(3,2) CONSTRAINT max_rating CHECK (rating <= 5));
CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR(100), first_name VARCHAR(100), last_name VARCHAR(100), email VARCHAR(100), password VARCHAR);
CREATE TYPE status AS ENUM ('active', 'complete');
CREATE TABLE orders (id SERIAL PRIMARY KEY, user_id BIGINT, current_status status, CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE TABLE orders_products (id SERIAL PRIMARY KEY, quantity INTEGER, product_id BIGINT, order_id BIGINT, 
  CONSTRAINT fk_product FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_order FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE);
