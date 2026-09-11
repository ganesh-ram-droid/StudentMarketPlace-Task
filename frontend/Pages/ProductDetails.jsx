import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../src/Components/NavBar";
import Footer from "../src/Components/Footer.jsx";


const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buying, setBuying] = useState(false);
  const [isOwnProduct, setIsOwnProduct] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch product"
          );
        }

        let currentUser = null;

        try {
          currentUser = JSON.parse(localStorage.getItem("user") || "null");
        } catch {
          currentUser = null;
        }

        setIsOwnProduct(
          String(data.product.seller?._id) === String(currentUser?.id)
        );
        setProduct(data.product);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuyNow = async () => {
    if (!product?.seller?.phone || buying) {
      return;
    }

    const whatsappWindow = window.open("", "_blank");

    if (!whatsappWindow) {
      setError("Please allow popups to contact the seller on WhatsApp");
      return;
    }

    try {
      setBuying(true);
      setError("");

      const token = localStorage.getItem("token");
      let user = {};

      try {
        user = JSON.parse(localStorage.getItem("user") || "{}");
      } catch {
        user = {};
      }

      const response = await fetch(
        `http://localhost:5000/api/purchases/${product._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to show interest in this product");
      }

      const message = `New CampusMarket product interest

Product: ${product.title}
Price: ₹${product.price}
Interest ID: ${data.interest._id}

Buyer name: ${user.name || "Not provided"}
Buyer email: ${user.email || "Not provided"}
Buyer phone: ${user.phone || "Not provided"}

Please contact me to arrange the handover.`;

      const whatsappUrl = `https://wa.me/${
        product.seller.phone
      }?text=${encodeURIComponent(message)}`;

      whatsappWindow.location.href = whatsappUrl;
    } catch (error) {
      whatsappWindow.close();
      setError(error.message);
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-gray-500">
            Loading product...
          </p>
        </div>

        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Product not found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error || "This product may have been removed."}
          </p>

          <Link
            to="/"
            className="mt-6 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
          >
            Back to Home
          </Link>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-sm font-medium text-gray-500 hover:text-green-600"
        >
          ← Back to Products
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="aspect-square bg-gray-100">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="w-fit rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-600">
              {product.category}
            </span>

            <h1 className="mt-5 text-3xl font-bold text-gray-900 sm:text-4xl">
              {product.title}
            </h1>

            <p className="mt-4 text-3xl font-bold text-green-600">
              ₹{product.price}
            </p>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">
                Description
              </h2>

              <p className="mt-3 leading-7 text-gray-500">
                {product.description}
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Seller
              </p>

              <p className="mt-2 text-base font-semibold text-gray-900">
                {product.seller?.name}
              </p>
            </div>

            {isOwnProduct ? (
              <p className="mt-6 rounded-2xl bg-gray-100 py-4 text-center text-sm font-bold text-gray-600">
                This is your product
              </p>
            ) : (
              <>
                <button
                  onClick={handleBuyNow}
                  disabled={buying}
                  className="mt-6 w-full rounded-2xl bg-green-600 py-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {buying ? "Showing interest..." : "Show Interest on WhatsApp"}
                </button>

                <p className="mt-3 text-center text-xs text-gray-400">
                  Your interest details will be sent to the seller through WhatsApp.
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
