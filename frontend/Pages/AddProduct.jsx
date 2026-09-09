import { useState } from "react";

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

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            image,
            price: Number(price),
            category,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Product added successfully");

      setTitle("");
      setDescription("");
      setImage("");
      setPrice("");
      setCategory("");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Add Product</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Image URL</label>
          <br />
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Price</label>
          <br />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            required
          />
        </div>

        <br />

        <div>
          <label>Category</label>
          <br />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <br />

        <button type="submit">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;