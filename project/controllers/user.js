// ############### thismodule is not a model but it conduct as a views in django ################ \\
const client = require ('../database');
const bcrypt = require ('bcrypt');
// import { client } from 'pg'
//import dotenv from 'dotenv'
//import { Order } from "./order";
//dotenv.config()
//const { PEPPER, SALT_ROUNDS } = process.env;
const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;
// import { User } from '../interfaces/user.interface'
// export type User = {
//   id?: number;
//   username: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   password: string;
// };
/* 
SQL and JS have different naming conventions:
- lower_snake_case: SQL columns
- camelCase: JS object properties
To avoid breaking conventions we can use these functions to convert 
from SQL naming to JS when importing data from the DB 
*/
/*
const columnNamesToUserProps = (
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  password: string
): User => {
  const user: User = {
      id: id,
      username: username,
      firstName: first_name,
      lastName: last_name,
      email: email,
      password: password
  };
  return user;
};
*/

// ##################################### CRUD Operations #################################### \\
// CRUD views Controller functions
// ################################# index or List All users function ############################ \\\
// ($n) => is the arguments selector, i.e. ($1) = mean first argument & ($2) = second etc.
// result.rows[0] estimated number of result rows, and is 0 because PostgreSQL knows that there can be no result row
// rows[0] will simply echo the first column in your database.
// 0 is the first because all arrays in PHP (and in most programming languages) are zero-based indexed - they simply start with zero index
// if you didn't write result.rows it will give you all the date object as follows
/*
{
    "command": "SELECT",
    "rowCount": 0,
    "oid": null,
    "rows": [],
    "fields": [
        {
            "name": "id",
            "tableID": 16442,
            "columnID": 1,
            "dataTypeID": 23,
            "dataTypeSize": 4,
            "dataTypeModifier": -1,
            "format": "text"
        },
        {
            "name": "username",
            "tableID": 16442,
            "columnID": 2,
            "dataTypeID": 1043,
            "dataTypeSize": -1,
            "dataTypeModifier": 104,
            "format": "text"
        },
        {
            "name": "first_name",
            "tableID": 16442,
            "columnID": 3,
            "dataTypeID": 1043,
            "dataTypeSize": -1,
            "dataTypeModifier": 104,
            "format": "text"
        },
        {
            "name": "last_name",
            "tableID": 16442,
            "columnID": 4,
            "dataTypeID": 1043,
            "dataTypeSize": -1,
            "dataTypeModifier": 104,
            "format": "text"
        },
        {
            "name": "email",
            "tableID": 16442,
            "columnID": 5,
            "dataTypeID": 1043,
            "dataTypeSize": -1,
            "dataTypeModifier": 104,
            "format": "text"
        },
        {
            "name": "password",
            "tableID": 16442,
            "columnID": 6,
            "dataTypeID": 1043,
            "dataTypeSize": -1,
            "dataTypeModifier": -1,
            "format": "text"
        }
    ],
    "_parsers": [
        null,
        null,
        null,
        null,
        null,
        null
    ],
    "_types": {
        "_types": {
            "arrayParser": {},
            "builtins": {
                "BOOL": 16,
                "BYTEA": 17,
                "CHAR": 18,
                "INT8": 20,
                "INT2": 21,
                "INT4": 23,
                "REGPROC": 24,
                "TEXT": 25,
                "OID": 26,
                "TID": 27,
                "XID": 28,
                "CID": 29,
                "JSON": 114,
                "XML": 142,
                "PG_NODE_TREE": 194,
                "SMGR": 210,
                "PATH": 602,
                "POLYGON": 604,
                "CIDR": 650,
                "FLOAT4": 700,
                "FLOAT8": 701,
                "ABSTIME": 702,
                "RELTIME": 703,
                "TINTERVAL": 704,
                "CIRCLE": 718,
                "MACADDR8": 774,
                "MONEY": 790,
                "MACADDR": 829,
                "INET": 869,
                "ACLITEM": 1033,
                "BPCHAR": 1042,
                "VARCHAR": 1043,
                "DATE": 1082,
                "TIME": 1083,
                "TIMESTAMP": 1114,
                "TIMESTAMPTZ": 1184,
                "INTERVAL": 1186,
                "TIMETZ": 1266,
                "BIT": 1560,
                "VARBIT": 1562,
                "NUMERIC": 1700,
                "REFCURSOR": 1790,
                "REGPROCEDURE": 2202,
                "REGOPER": 2203,
                "REGOPERATOR": 2204,
                "REGCLASS": 2205,
                "REGTYPE": 2206,
                "UUID": 2950,
                "TXID_SNAPSHOT": 2970,
                "PG_LSN": 3220,
                "PG_NDISTINCT": 3361,
                "PG_DEPENDENCIES": 3402,
                "TSVECTOR": 3614,
                "TSQUERY": 3615,
                "GTSVECTOR": 3642,
                "REGCONFIG": 3734,
                "REGDICTIONARY": 3769,
                "JSONB": 3802,
                "REGNAMESPACE": 4089,
                "REGROLE": 4096
            }
        },
        "text": {},
        "binary": {}
    },
    "RowCtor": null,
    "rowAsArray": false
}
*/

exports.index = async (_req, _res) => {  // just one function instead of splitting it on users.js and here
  try {
    const conn = await client.connect();
    const query = 'SELECT * FROM users;';
    const result = await conn.query(query);
    conn.release();
    //res.json(result.rows);  // we can't put res.render("users_list", { data: result }); cause the front end react need json
    return result.rows; // list all columns  => // will contain the unparsed string value of each column (used if you have another awaiting func)
  } catch (err) {
    // console.error(err);
    // res.status(500).send(`${err}`);
    throw new Error(`Could not get users from Database. Error: ${err}`);
  }
};
  /*
// modified index function as we have difference in column names maping if type scripted
  async users(): Promise<User[]> {
    try {
      const sql = 'SELECT * FROM users;';
      const conn = await client.connect();
      const results = await conn.query(sql);
      conn.release();
      for (const result of results.rows) {
        console.log(result)
      }
      return results.rows.map((result) => {
        return columnNamesToUserProps(result.id, result.username, result.first_name, result.last_name, result.email, result.password);});
    } catch (err) {
      throw new Error(`Cannot get users: ${err}`);
    }
  }
  */
// ############################################################### \\\

// ################## getUser or User Details Show function ##################\\\
exports.show = async (user_id) => {
  try {
    const sql = 'SELECT * FROM users WHERE id = ($1);'; // id=${id} name selector ${id} doesn't work use ($id) or {$id}
    const conn = await client.connect();
    const result = await conn.query(sql, [user_id]);
    conn.release();
    return result.rows[0]; // list one
  } catch (err) {
    throw new Error(`Cannot get any user: Error: ${err}`);
  }
};
// ########################################################################## \\\
  
  // ########################## Create User Function ######################### \\\\
exports.create = async (u) => {
  try {
    const conn = await client.connect();
    const sql = 'INSERT INTO users (username, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    // const query = `INSERT INTO users (first_name, last_name, email,) VALUES ('${user.first_name}', '${user.last_name}', ${user.balance}) RETURNING *;`
    const hashedPassword = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));
    const result = await conn.query(sql, [u.username, u.first_name, u.last_name, u.email, hashedPassword,]);
    conn.release();
    return result.rows[0];
  } catch (err) {
    throw new Error(`Cannot create user: ${err}`);
  }
};
// ##############################################################################\\\
  
  // ########################## Update Method #################################### \\\
exports.update = async (u) => {
  try {
    const conn = await client.connect();
    const sql = `UPDATE users SET username = $2, first_name = $3, last_name = $4, email = $5, password = $6 WHERE id = $1 RETURNING *`;
    const result = await conn.query(sql, [u.id, u.username, u.first_name, u.last_name, u.email, u.password,]);
    conn.release();
    return result.rows[0];
  } catch (err) {
    throw new Error(`Could not update user. Error: ${err}`);
  }
};
  // ##############################################################################\\\

  // ########################## Authentication Method #################################### \\\
exports.authenticate = async (username, pwdString) => {
  try {
    // const sql = `SELECT * FROM users WHERE email = '${email}';`
    const sql = 'SELECT * FROM users WHERE username=($1);';
    const conn = await client.connect();
    const result = await conn.query(sql, [username]);
    let auth = null;
    if (result.rows.length) {
      const user = result.rows[0];
      if (bcrypt.compareSync(pwdString, user.password)) {
        auth = user; // it was having + pepper
      }
    }
    return auth;
  } catch (err) {
    throw new Error(`Cannot authenticate user ${username}: ${err}`);
  }
};

  // ############################# Delete User Method ############################### \\\
exports.delete = async (id) => {
  try {
    const sql = 'DELETE FROM users WHERE id=($1)';
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    const product = result.rows[0];
    conn.release();
    return product;
  } catch (err) {
    throw new Error(`unable to delete user (${id}) Error: ${err}`);
  }
};
  // ##############################################################################\\\