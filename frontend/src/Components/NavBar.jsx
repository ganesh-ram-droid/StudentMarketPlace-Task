import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    // A malformed stored user should not prevent navigation from rendering.
    localStorage.removeItem("user");
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold text-gray-900">
          Campus<span className="text-green-600">Market</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 transition hover:text-green-600"
          >
            Home
          </Link>

          <Link
            to="/my-products"
            className="text-sm font-medium text-gray-700 transition hover:text-green-600"
          >
            My Products
          </Link>

          <Link
            to="/my-orders"
            className="text-sm font-medium text-gray-700 transition hover:text-green-600"
          >
            My Orders
          </Link>

          <Link
            to="/add-product"
            className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            + Sell Product
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {token ? (
            <>
              {user?.name && (
                <span className="hidden text-sm font-medium text-gray-600 sm:inline">
                  Hi, {user.name}
                </span>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hidden rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 sm:inline-flex"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
