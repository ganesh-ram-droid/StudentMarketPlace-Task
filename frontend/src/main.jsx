import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "../Pages/Home.jsx";
import Register from "../Pages/Register.jsx";
import ProductDetails from "../Pages/ProductDetails.jsx";
import AddProduct from "../Pages/AddProduct.jsx";
import EditProduct from "../Pages/EditProduct.jsx";
import MyProducts from "../Pages/MyProducts.jsx";
import MyPurchases from "../Pages/MyPurchases.jsx";
import { Login } from "../Pages/Login.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/my-orders" element={<MyPurchases />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
