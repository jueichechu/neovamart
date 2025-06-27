// const express = require("express");
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js" // import the productRoutes from the routes folder

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // comes form the .env file, a constant set to 3000. if undefined, backup with value 3000 

console.log(PORT);

app.use(express.json()); // allows us to parse incoming data, e.g. extract image name and price 
app.use(cors()); // no cors errors in client
app.use(helmet()); // helmet is a security middleware that helps you protect your app by setting various HTTP headers
app.use(morgan("dev")); // log the requests 

app.use("/api/products", productRoutes); // when we send a request to API/products, get requests



app.listen(PORT, () => {
    console.log("Server is running on port " + PORT); // set to PORT
});