// import client from '../database';
const client = require ('../database');
// import { types } from 'pg';
// Parse numeric types as floats instead of strings
// types.setTypeParser(1700, (value) => {
//   return parseFloat(value);
// });
// export type Product = {
//   id?: number;
//   name: string;
//   price: number;
//   category: string;
//   rating: number;
// };
// ############################################################### \\\

  // ######################## List All Products function ####################### \\\
exports.index = async () => {
  try {
    const sql = 'SELECT * FROM products;';
    const conn = await client.connect();
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
  } catch (err) {
    throw new Error(`Cannot get products: ${err}`);
  }
};
  // ############################################################### \\\

  // ####################### Product details function #######################\\\
exports.show = async (id) => {
  try {
    const sql = 'SELECT * FROM products WHERE id = ($1);';
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
  } catch (err) {
    throw new Error(`Could not find product: Error: ${err}`);
  }
};
  // ############################################################### \\\

  // ####################### Create function #######################\\\
exports.create = async (p) => {
  try {
    const sql =
      'INSERT INTO products (name, price, category, rating) VALUES ($1, $2, $3, $4) RETURNING *;';
    const conn = await client.connect();
    const result = await conn.query(sql, [
      p.sku,
      p.name,
      p.price,
      p.Type_Switcher,
    ]);
    conn.release();
    return result.rows[0];
  } catch (err) {
    throw new Error(`Cannot add product. Error: ${err}`);
  }
};
  // ############################################################### \\\

  // ####################### Update function #######################\\\
exports.update = async (p) => {
  try {
    const sql = `UPDATE products SET name = $2, price = $3, category = $4 WHERE id = $1 RETURNING *;`;
    const conn = await client.connect();
    const result = await conn.query(sql, [p.id, p.name, p.price, p.Type_Switcher]);
    conn.release();
    return result.rows[0];
  } catch (err) {
    throw new Error(`Could not update product Error: ${err}`);
  }
};
  // ############################################################### \\\

  // ####################### Delete function #######################\\\
exports.delete = async (id) => {
  try {
    const sql = 'DELETE FROM products WHERE id = ($1) RETURNING *;';
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    const product = result.rows[0];
    conn.release();
    return product;
  } catch (err) {
    throw new Error(`Cannot delete product: Error: ${err}`);
  }
};

  // ##############################################################################\\\

