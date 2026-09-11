import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../src/Components/NavBar";
import Footer from "../src/Components/Footer.jsx";

const categories = [
  "Books",
  "Electronics",
  "Calculators",
  "Stationery",
  "Lab Equipment",
  "Hostel Items",
  "Cycles",
  "Sports",
  "Clothing",
  "Other",
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    status: "available",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load product");
        }

        setFormData({
          title: data.product.title,
          description: data.product.description,
          price: String(data.product.price),
          category: data.product.category,
          status: data.product.status,
        });
        setImagePreview(data.product.image);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleChange = (event) => {
    setFormData((currentData) => ({
      ...currentData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setImageFile(selectedFile);

    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const productData = new FormData();
      productData.append("title", formData.title);
      productData.append("description", formData.description);
      productData.append("price", formData.price);
      productData.append("category", formData.category);
      productData.append("status", formData.status);

      if (imageFile) {
        productData.append("image", imageFile);
      }

      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: productData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to update product");
      }

      navigate("/my-products");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/my-products" className="text-sm font-medium text-gray-500 hover:text-green-600">
          Back to My Products
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Edit product</h1>

        {loading ? (
          <p className="py-12 text-center text-sm text-gray-500">Loading product...</p>
        ) : (
          <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            {error && <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Product Name</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Product Image</label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="mb-3 h-48 w-full rounded-xl object-cover sm:w-64"
                  />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
                <p className="mt-2 text-xs text-gray-400">Leave this empty to keep the current image.</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Price</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100">
                    {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Availability</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100">
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full rounded-xl bg-green-600 py-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EditProduct;
