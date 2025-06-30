import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useEffect } from "react";

function ProductPage() {
  const {
    currentProduct,
    formData,
    setFormData,
    loading,
    error,
    fetchProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();
  const navigate = useNavigate(); 
  const {id} = useParams() // to fetch product id in the url 

  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);

  console.log(currentProduct);
  return <div>ProductPage</div>;
}

export default ProductPage