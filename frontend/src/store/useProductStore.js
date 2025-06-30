import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:3000"

export const useProductStore = create((set, get) => ({
    // products state
    products:[],
    loading:false,
    error:null,
    currentProduct:null, // initially null, only determined when fetchProduct

    // form state
    formData: {
        name: "",
        price: "",
        image: "",
    },

    // setter function for form data, and reset helper function
    setFormData: (formData) => set({ formData }),
    resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

    // json function/method to add product, ensure they are seprated by commas
    addProduct: async(e) => {
        e.preventDefault();
        set({loading:true});

        try {
            const { formData } = get();
            await axios.post(`${BASE_URL}/api/products`, formData);
            await get().fetchProducts();
            get().resetForm();
            toast.success("Product added successfully");
            // close the modal    
            document.getElementById("add_product_modal").close();
        } catch (error) {
            console.log("Error in addProduct function", error);
            toast.error("Something went wrong");
        } finally {
            set({loading:false});
        }
    },

    // fetch products function
    fetchProducts: async () => {
        set({loading:true});
        try {
            const response = await axios.get(`${BASE_URL}/api/products`)
            set({products:response.data.data,error:null}); // first data is from axios, second data is from API data field
        } catch (err) {
            if(err.status == 429) set({error:"Rate Limit Exceeded", products: [] });
            else set({error: "Something went wrong", products: []});
        } finally {
            set({loading:false});
        }
    },

    deleteProduct: async (id) => {
        set({loading:true});
        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`); 
            set(prev => ({products: prev.products.filter(product => product.id !== id)})); 
            toast.success("Product deleted successfully"); // toast notification showing that product is deleted
        } catch (error) {
            console.log("Error in deleteProduct function", error);
            toast.error("Something went wrong");
        } finally {
            set({loading: false});
        }
    },

    fetchProduct: async (id) => {
        set({ loading: true });
        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`);
            set({ currentProduct: response.data.data,
                formData: response.data.data,
                error: null,
            });
        } catch (error) {
            console.log("Error in fetchProduct function", error);
            set({ error: "Something went wrong", currentProduct: null });
        } finally {
            set({ loading: false });
        }
    },
    
    updateProduct: async (id) => {
        set({ loading: true });
        try {
            const {formData} = get();
            const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData);
            set({ currentProduct: response.data.data });
            toast.success("Product updated successfully");
        } catch (error) {
            toast.error("Soemthing went wrong");
            console.log("Error in updateProduct function", error);
        } finally {
            set({ loading: false });
        }
    },
}));
