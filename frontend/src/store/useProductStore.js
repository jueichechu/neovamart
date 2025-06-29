import { create } from "zustand";
import axios from "axios";

const BASE_URL = "http://localhost:3000"

export const useProductStore = create((set, get) => ({
    // products state
    products:[],
    loading:false,
    error:null,

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
}));
