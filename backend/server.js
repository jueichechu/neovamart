import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // built in module from node

import productRoutes from "./routes/productRoutes.js" // import the productRoutes from the routes folder
import { sql } from "./config/db.js"; // import the sql function from the db.js file in the config folder
import { aj } from "./lib/arcjet.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // comes form the .env file, a constant set to 3000. if undefined, backup with value 3000 
const __dirname = path.resolve(); // keep track of directory we are in

app.use(express.json()); // allows us to parse incoming data, e.g. extract image name and price 
app.use(cors()); // no cors errors in client
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
); // helmet is a security middleware that helps you protect your app by setting various HTTP headers
app.use(morgan("dev")); // log the requests 

// apply arcjet rate-limit to all routes
// Add a middleware with parameters: request, response, and next (callback function to call when middleware is done) 
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested:1 // specifies that each request consumes 1 token from the bucket
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                res.status(429).json({ error: "Too Many Requests" });
            } else if (decision.reason.isBot()) {
                res.status(403).json({ error: "Bot Access Denied" });
            } else {
                res.status(403).json({ error: "Forbidden" });
            }
            return;
        }
        // check for spoofed bots, i.e. bots that try to bypass the bot detection by spoofing their user agent
        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            res.status(403).json({ error: "Spoofed Bot Detected" });
            return;
        }

        next(); // if call next() with no arguments, Express moves on to the next middleware/route handler
    } catch (error) {
        console.log("Arcjet error", error);
        next(error); // if call next(error), Express will skip straight to error-handling middleware
    }
});

app.use("/api/products", productRoutes); // when we send a request to API/products, get requests

if (process.env.NODE_ENV === "production") {
    // server our react app, __dirname indicates we are in root directory. dist folder is production ready for react app
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req,res) => { // send file which is index.html in dist folder
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html")); // path
    });
}

async function initDB() { // function initialize the database
    try { // create a table called products if it does not exist. Get sql function that we exported from /config/db.js, a tagged template literal that allows us to write SQL queries safely
        // name is in lowercase, keywords in uppercase
        // id is a serial primary key, which means it will auto-increment
        // name, image, and price are all strings with a maximum length of 255 characters
        // the table will be created if it does not exist
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log("Database initialized successfully");
    } catch (error) { // catch any errors that occur during execution of SQL query
        console.log("Error initDB", error);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port", PORT);
    });
});