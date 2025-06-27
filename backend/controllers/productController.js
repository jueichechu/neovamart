import {sql} from "../config/db.js" // import the sql function

// asynchronous function because it will take some time to get data from database, and we can call await in it
export const getProducts = async (req, res) => {
    try {
        const products = await sql`
            SELECT * FROM products
            ORDER BY created_at DESC
        `;
        console.log("fetched products", products);
        res.status(200).json({ success: true, data: products });
    } catch (error) {

    }
}; 

export const createProduct = async (req, res) => {};

export const getProduct = async (req, res) => {};
export const updateProduct = async (req, res) => {};
export const deleteProduct = async (req, res) => {};

