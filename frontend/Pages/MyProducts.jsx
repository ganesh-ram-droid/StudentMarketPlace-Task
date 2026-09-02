import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../src/Components/NavBar";
import Footer from "../src/Components/Footer.jsx";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/products/my-products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch products"
          );
        }

        setProducts(data.products);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleMarkAsSold = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/products/${id}/sold`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to mark product as sold");
      }

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? data.product : product
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-green-600">
              MY PRODUCTS
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Your listings
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage the products you are selling.
            </p>
          </div>

          <Link
            to="/add-product"
            className="hidden rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 sm:block"
          >
            + Sell Product
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <p className="text-sm text-gray-500">
              Loading your products...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              You haven't listed anything yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Start selling products to other students.
            </p>

            <Link
              to="/add-product"
              className="mt-6 inline-block rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Sell Your First Product
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <p className="text-xs font-semibold text-green-600">
                    {product.category}
                  </p>

                  <h2 className="mt-2 truncate text-lg font-semibold text-gray-900">
                    {product.title}
                  </h2>

                  <p className="mt-2 text-xl font-bold text-gray-900">
                    ₹{product.price}
                  </p>

                  <p
                    className={`mt-2 text-xs font-semibold uppercase ${
                      product.status === "sold"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {product.status || "available"}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Link
                      to={`/edit-product/${product._id}`}
                      className="rounded-xl border border-gray-200 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>

                  {product.status !== "sold" && (
                    <button
                      onClick={() => handleMarkAsSold(product._id)}
                      className="mt-3 w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
                    >
                      Mark as Sold
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyProducts;
