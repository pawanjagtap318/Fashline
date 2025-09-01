import axios from 'axios';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProduct } from '../../redux/slices/adminProductSlice';
import { fetchProductDetails } from "../../redux/slices/productsSlice"

function EditProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector((state) => state.products);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData }));
    navigate("/admin/products");
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;


  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white shadow-xl rounded-xl p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
          ✨ Edit Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={productData.description}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              rows={4}
              onChange={handleChange}
              required
            />
          </div>

          {/* Price & Stock - Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Count in Stock
              </label>
              <input
                type="number"
                name="countInStock"
                value={productData.countInStock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              />
            </div>
          </div>

          {/* SKU */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">SKU</label>
            <input
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Sizes (comma-separated)
            </label>
            <input
              type="text"
              name="sizes"
              value={productData.sizes.join(", ")}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  sizes: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
          </div>

          {/* Colors */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Colors (comma-separated)
            </label>
            <input
              type="text"
              name="colors"
              value={productData.colors.join(", ")}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  colors: e.target.value.split(",").map((c) => c.trim()),
                })
              }
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Upload Images
            </label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="w-full text-gray-600"
            />
            {uploading && (
              <p className="text-indigo-500 mt-2 animate-pulse">
                Uploading Image...
              </p>
            )}

            <div className="flex flex-wrap gap-4 mt-4">
              {productData.images.map((image, index) => (
                <div
                  key={index}
                  className="relative group border rounded-lg overflow-hidden shadow-md"
                >
                  <img
                    src={image.url}
                    alt={image.altText || "Product Image"}
                    className="w-24 h-24 object-cover group-hover:opacity-80 transition"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProductPage
