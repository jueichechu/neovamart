import expres from "express"; 
import { createProduct, getAllProducts } from "../controllers/productController.js"; // remember to add .js at the end of the import path

const router = expres.Router() // create a new router instance

router.get("/", getAllProducts);
router.post("/", createProduct);

export default router; // export the router
