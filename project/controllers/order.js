//import Product from './product';
// import client from '../database';
const client = require ('../database');
// export type Order = {
//   id?: number;
//   user_id: number;
//   current_status: string;
// };
// Types that are not directly linked to a model
// export type OrderDetails = {
//   id?: number;
//   product_id: number;
//   quantity: number;
//   order_id: number;
// };
/* 
SQL and JS have different naming conventions:
- lower_snake_case: SQL columns
- camelCase: JS object properties
To avoid breaking conventions we can use these functions to convert 
from SQL naming to JS when importing data from the DB 
*/

// ##############################################################################\\\

// ##########################  #################  ################################## \\\
// ($n) => is the arguments selector, i.e. ($1) = mean first argument & ($2) = second etc.
// result.rows[0] estimated number of result rows and is 0 because PostgreSQL knows that there can be no result row
// rows[0] will simply echo the first column in your database.
// 0 is the first because all arrays in PHP (and in most programming languages) are zero-based indexed - they simply start with zero index

  // ########################### list orders Method ################################## \\\
exports.index = async (_req, _res) => {
  try {
    //const conn = await pool.connect()
    const conn = await client.connect();
    const sql = 'SELECT * FROM orders';
    const result = await conn.query(sql);
    conn.release();
    return result.rows; // list all columns
  } catch (err) {
    throw new Error(`Could not get orders. Error: ${err}`);
  }
};
  // ##############################################################################\\\

  // ########################## Order Details Method #################################### \\\
exports.show = async (id) => {
  try {
    const sql = 'SELECT * FROM orders WHERE id=($1)';
    //const conn = await pool.connect()
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0]; // list one
  } catch (err) {
    throw new Error(`Could not find product order. Error: ${err}`);
  }
};

  // ##############################################################################\\\
  // ############################# Create Order Method ################################## \\\
exports.create = async (user_id, current_status) => {
  try {
    const conn = await client.connect();
    //const id = `'${o.user_id}'`; const status = `'${o.current_status}'`;
    // if the user has already any opened orders => We select only id from orders table 
    const checkActiveQuery = 'SELECT id FROM orders WHERE user_id = $1 AND current_status = $2;'; // ${id} doesn't work use ($id) or {$id}
    const checkActiveQueryRes = await conn.query(checkActiveQuery, [user_id, current_status,]);
    //const checkActiveQueryRes = await conn.query(sql`alter table ${sql.identifier([table_name])} add check(length(${col_name}) <= ${col.maxlength})`);
    //console.log(checkActiveQueryRes)
    if (checkActiveQueryRes.rows[0]) {
      conn.release();
      throw new Error('an active order for this user already exists');
    } else {
      const sql = "INSERT INTO orders (user_id, current_status) VALUES ($1, 'active') RETURNING *;";
      const result = await conn.query(sql, [user_id, current_status]);
      conn.release();
      const order = result.rows[0];
      return order;
      //return ({id: order.id as number, user_id: order.user_id as number, current_status: order.current_status as string});
    }
  } catch (err) {
    throw new Error(`Cannot create order: ${err}`);
  }
};
  // ##############################################################################\\\
  // ########################## ADD Product To orders Method #################################### \\\
exports.addProductToOrder = async (user_id, product_id, quantity) => {  // we take the user id to get the order
  try {
    const conn = await client.connect();
    // get the only active user order id by using user id => we select only order id
    const orderQuery = "SELECT id FROM orders WHERE user_id = ($1) AND current_status = 'active';";
    const orderResult = await conn.query(orderQuery, [user_id]);
    const order_id = orderResult.rows[0].id;
    if (order_id) {
      //const addProductQuery = "INSERT INTO order_details (product_id, quantity, order_id) VALUES($1, $2, $3) RETURNING product_id, quantity;"
      const addProductQuery = 'INSERT INTO orders_products (product_id, quantity, order_id) VALUES ($1, $2, $3) RETURNING *';
      const result = await conn.query(addProductQuery, [product_id, quantity, order_id,]);
      conn.release();
      const order = result.rows[0];
      return order;
    } else {
      conn.release();
      console.error(`There are no active orders for user ${user_id}`);
    }
  } catch (err) {
    throw new Error(`Cannot add product ${product_id} to order: ${err}`);
  }
};

// #############################################################################################\\\
  
  // ########################## Remove Product Method #################################### \\\
exports.removeProductFromOrder = async (user_id, product_id) => {
  try {
    const conn = await client.connect();
    const orderQuery = "SELECT id FROM orders WHERE user_id = ($1) AND current_status = 'active';";
    const orderResult = await conn.query(orderQuery, [user_id]);
    const order_id = orderResult.rows[0].id;
    if (order_id) {
      const sql = 'DELETE FROM orders_products WHERE order_id = ($1) AND product_id = ($2) RETURNING *';
      const result = await conn.query(sql, [order_id, product_id]);
      conn.release();
      return result.rows[0];
    } else {
      conn.release();
      console.error(`There are no active orders for user ${user_id}`);
    }
  } catch (err) {
    throw new Error(`Could not delete product ${product_id} from order: ${err}`);
  }
};
// ##############################################################################\\\
  
  // ########################## ADD Product To Orders as OpenCart ############################# \\\
  // this method is another way to add products on the same order as an open cart
  //(using M-T-M order-products table that relate both orders and products tables)
exports.openCart = async (order_id, product_id, quantity, user_id) => {   // we take order.id directly to get the order
  // get the order by its id to see if it is open
  try {
    const ordersql = 'SELECT * FROM orders WHERE id=($1)';
    const conn = await client.connect();
    const result = await conn.query(ordersql, [order_id]);
    const order = result.rows[0];
    if (order.current_status !== 'active' && order.user_id !== user_id) {
      throw new Error(`Could not add product ${product_id} to order ${order_id} because order status is ${order.current_status}`);
    }
    conn.release();
  } catch (err) {
    throw new Error(`${err}`);
  }
  try {
    const sql = 'INSERT INTO orders_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
    const conn = await client.connect();
    const result = await conn.query(sql, [order_id, product_id, quantity]);
    conn.release();
    return result.rows[0];
  } catch (err) {
    throw new Error(`Could not add product ${product_id} to order ${order_id}: ${err}`);
  }
};
  // ##############################################################################\\\

  // ########################## Update Order Method #################################### \\\
exports.updateStatus = async(user_id) => {
  try {
    const sqlQuery = "SELECT id FROM orders WHERE user_id = ($1) AND current_status = 'active';";
    const conn = await client.connect();
    const sqlQueryRes = await conn.query(sqlQuery, [user_id]);
    console.log(sqlQueryRes);
    if (!sqlQueryRes.rows[0]) {
      conn.release();
      throw new Error(`there are no active orders for user ${user_id}`);
    } else {
      const order_id = sqlQueryRes.rows[0].id;
      const sql = "UPDATE orders SET current_status = 'complete' WHERE id = ($1) RETURNING *;";
      //const orderProductsSql ='UPDATE orders_products SET product_id = $1, quantity = $2 WHERE order_id = $3 RETURNING product_id, quantity';
      const result = await conn.query(sql, [order_id]);
      // const sql1 = `UPDATE orders SET user_id = $2, current_status = $3 WHERE id = $1 RETURNING *;`;
      //const result1 = await conn.query(sql1, [user_id, current_status]);
      conn.release();
      return result.rows[0];
    }
  } catch (err) {
    throw new Error(`Could not update order ${order_id}. Error: ${err}`);
  }
};
  // ##############################################################################\\\

  // ########################## Get Current Orders Method ################################ \\\
exports.getUserOrders = async (user_id) => {
  try {
    const conn = await client.connect();
    const sql = `SELECT * FROM orders WHERE user_id = ($1);`;
    const result = await conn.query(sql, [user_id]);
    conn.release();
    return result.rows;
  } catch (err) {
    throw new Error(`Could not get orders for user. Error: ${err}`);
  }
};
  // ##############################################################################\\\

  // ########################## Get Active Only Orders Method ############################ \\\
exports.getActiveOrder = async (user_id) => {
  try {
    const sql = "SELECT * FROM orders WHERE user_id = ($1) AND current_status = 'active'";
    const conn = await client.connect();
    const result = await conn.query(sql, [user_id]);
    conn.release();
    return result.rows[0];
  } catch (err) {
    throw new Error(`Cannot retrieve active order: ${err}`);
  }
};
  // ##############################################################################\\\

  // ########################## Get Completeed Orders Method ############################## \\\
exports.getCompletedOrders = async (user_id) => {
  try {
    const sql = "SELECT * FROM orders WHERE user_id = ($1) AND current_status = 'complete'";
    const conn = await client.connect();
    const result = await conn.query(sql, [user_id]);
    const orderList = result.rows.map((order) => {
      return order;
    });
    conn.release();
    return orderList;
  } catch (err) {
    throw new Error(`Cannot retrieve completed orders: ${err}`);
  }
};
exports.delete = async (id) => {
  try {
    const sql = 'DELETE FROM orders WHERE id = ($1) RETURNING *;';
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    const product = result.rows[0];
    conn.release();
    return product;
  } catch (err) {
    throw new Error(`Cannot delete product: Error: ${err}`);
  }
};

