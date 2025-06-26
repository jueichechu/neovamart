// const express = require("express");
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // comes form the .env file, a constant set to 3000. if undefined, backup with value 3000 

console.log(PORT);

app.use(express.json()); // allows us to parse incoming data, e.g. extract image name and price 
app.use(cors()); // no cors errors in client
app.use(helmet()); // helmet is a security middleware that helps you protect your app by setting various HTTP headers
app.use(morgan("dev")); // log the requests 

app.get("/test", (req, res) => { // if we send a get request to the test route
    res.send("Hello from the test route");
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT); // set to PORT
});