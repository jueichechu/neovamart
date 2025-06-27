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
        console.log("Error getProducts function", error);
        res.status(500).json({ success: false, message: "Internal Server Error" }); // 500 is internal server error
    }
}; 

export const createProduct = async (req, res) => {
    const {name, price, image} = req.body; // in server.js, we have middle layer: app.use(express.json()) that allows us to destructure incoming data, e.g. extract image name and price

    if (!name || !price || !image) {
        return res.status(400).json({success: false, message:"All fields are required"})
    }

    try {
        const newProduct = await sql` 
            INSERT INTO products (name, price, image)
            VALUES (${name}, ${price}, ${image}) 
            RETURNING *
        `
        console.log("New product added:", newProduct);
        // test this function with Postman
        res.status(201).json({ success: true, data: newProduct[0] }); // a 201 response status code indicates that the HTTP request has led to the creation of a resource
        // note that newProduct is an array Record<string, any>[], so we return the first element, which is the newly created product
    } catch (error) {
        console.log("Error createProduct function", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getProduct = async (req, res) => {};
export const updateProduct = async (req, res) => {};
export const deleteProduct = async (req, res) => {};

