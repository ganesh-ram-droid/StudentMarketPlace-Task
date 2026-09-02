import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../src/Components/NavBar";
import Footer from "../src/Components/Footer.jsx";

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/purchases/my-purchases",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setPurchases(data.purchases);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [navigate]);

  const handleDeleteOrder = async (purchaseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/purchases/${purchaseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete order");
      }

      setPurchases((prevPurchases) =>
        prevPurchases.filter((purchase) => purchase._id !== purchaseId)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-green-600">MY ORDERS</p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Products you bought
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View your order details and contact the seller when needed.
        </p>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <p className="text-sm text-gray-500">Loading your orders...</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              You have no orders yet
            </h2>

            <Link
              to="/"
              className="mt-6 inline-block rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {purchases.map((purchase) => (
              <div
                key={purchase._id}
                className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row"
              >
                <img
                  src={purchase.product?.image}
                  alt={purchase.product?.title}
                  className="h-40 w-full rounded-xl object-cover sm:w-48"
                />

                <div className="flex-1">
                  <p className="text-xs font-semibold text-green-600">
                    {purchase.product?.category}
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-gray-900">
                    {purchase.product?.title}
                  </h2>

                  <p className="mt-2 text-lg font-bold text-gray-900">
                    ₹{purchase.product?.price}
                  </p>

                  <div className="mt-4 space-y-1 text-sm text-gray-500">
                    <p>Order ID: {purchase._id}</p>
                    <p>
                      Seller: {purchase.product?.seller?.name || "Seller"}
                    </p>
                    <p>
                      Ordered on: {new Date(purchase.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteOrder(purchase._id)}
                    className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                  >
                    Delete Order
                  </button>
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

export default MyPurchases;
