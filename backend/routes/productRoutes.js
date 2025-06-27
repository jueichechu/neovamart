import expres from "express"; 
import { 
    getProducts, 
    getProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from "../controllers/productController.js"; // remember to add .js at the end of the import path

const router = expres.Router() // create a new router instance

router.get("/", getProducts); // get all products, which is the default route for this router
router.get("/:id", getProduct); // get product by id, which is passed in the URL as a parameter
router.post("/", createProduct);
router.put("/:id", updateProduct); // update product by id
router.delete("/:id", deleteProduct); 


export default router; // export the router
