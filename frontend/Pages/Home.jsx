import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../src/Components/NavBar";
import Footer from "../src/Components/Footer.jsx";


const categories = [
  "All",
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

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const params = new URLSearchParams({
          page: currentPage,
          limit,
        });

        if (search.trim()) {
          params.append("search", search.trim());
        }

        if (selectedCategory !== "All") {
          params.append("category", selectedCategory);
        }

        const response = await fetch(
          `http://localhost:5000/api/products?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }

        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, search, selectedCategory]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategory = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              Your Campus Marketplace
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Buy and sell within your campus.
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-500">
              Find books, electronics, cycles and other useful products
              from fellow students.
            </p>
          </div>

          <div className="mt-8 max-w-3xl">
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-gray-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search books, electronics, cycles..."
                className="h-16 w-full rounded-2xl border border-gray-200 bg-white pl-14 pr-5 text-sm shadow-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900">
            Categories
          </h2>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategory(category)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-green-600 text-white shadow-md"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-green-500 hover:text-green-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {totalProducts} products available
              </p>
            </div>

            <Link
              to="/add-product"
              className="hidden rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-600 sm:block"
            >
              + Sell Product
            </Link>
          </div>

          {loading && (
            <div className="py-20 text-center">
              <p className="text-sm text-gray-500">
                Loading products...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="mt-8 rounded-2xl bg-red-50 p-6 text-center">
              <p className="text-sm font-medium text-red-600">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <p className="text-lg font-semibold text-gray-700">
                No products found
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Try another search or category.
              </p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold text-green-600">
                      {product.category}
                    </p>

                    <h3 className="mt-2 truncate text-lg font-semibold text-gray-900">
                      {product.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {product.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{product.price}
                      </span>

                      <Link
                        to={`/products/${product._id}`}
                        className="rounded-full bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-green-600"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                ←
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 w-10 rounded-full text-sm font-semibold ${
                    currentPage === page
                      ? "bg-green-600 text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                →
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;