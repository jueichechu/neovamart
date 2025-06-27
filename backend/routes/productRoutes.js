import expres from "express"; 

const router = expres.Router() // create a new router instance

router.get("/", getAllProducts);
router.post("/", createProduct);

export default router; // export the router
