import { EditIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";

function ProductCard({product}) {
  const {deleteProduct} = useProductStore();
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        {/* PRODUCT IMAGE */}
        <figure className="relative pt-[56.25%]">
        <img
            src={product.image}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
        />
        </figure> 

        <div className="card-body">  {/* Card class */}
            {/* PRODUCT INFO */}
            <h2 className="card-title text-lg font-semibold">{product.name}</h2>
            <p className="text-2xl font-bold text-primary">${Number(product.price).toFixed(2)}</p>

            {/* CARD ACTIONS, edit and delete buttons */}
            <div className="card-actions justify-end mt-4">
                <Link to={`/product/${product.id}`} className="btn btn-sm btn-info btn-outline">
                    <EditIcon className="size-4" /> {/* takes user to product page */}
                </Link>

                <button
                    className="btn btn-sm btn-error btn-outline"
                    onClick = {() => deleteProduct(product.id)} 
                >
                    <Trash2Icon className="size-4" /> {/* deletes the product */}
                </button>
            </div>
        </div>
    </div>
  );
}

export default ProductCard;