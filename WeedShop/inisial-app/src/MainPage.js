import "./MainPage.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const navigate = useNavigate();

  // ✅ Load Cart from Local Storage on Page Load
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  // ✅ Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      let url = `http://localhost:8080/api/products?`;
      if (category) url += `category=${encodeURIComponent(category)}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (sort) url += `sort=${encodeURIComponent(sort)}&`;
      url = url.endsWith("&") ? url.slice(0, -1) : url;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [category, search, sort]);

  // ✅ Navigate to profile if logged in
  const handleProfileClick = () => {
    const loginId = localStorage.getItem("login_id");
    if (loginId) {
      navigate("/profile");
    } else {
      alert("Please log in to view your profile.");
      navigate("/login");
    }
  };

  // ✅ Navigate to product detail page
  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  // ✅ Add to Cart with quantity check
  const addToCart = (product) => {
    const loginId = localStorage.getItem("login_id");
    if (!loginId) {
      alert("Please log in to add items to the cart.");
      navigate("/login");
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // ✅ Store updated cart in localStorage
    alert(`${product.name} added to cart!`);
  };

  // ✅ Update quantity of an item
  const updateQuantity = (productId, change) => {
    let updatedCart = cart.map((item) =>
      item.id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // ✅ Update localStorage
  };

  // ✅ Remove an item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // ✅ Update localStorage
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="main-container">
      {/* Top Navigation */}
      <div className="top-bar">
        <button className="button button-primary" onClick={handleProfileClick}>
          User Profile
        </button>
        <button className="button button-warning" onClick={() => setIsCartOpen(true)}>
          View Cart ({cart.length}) - ${totalPrice}
        </button>
      </div>

      {/* Filters, Search, and Sorting */}
      <div className="filters-container">
        <div>
          <strong>Filter by Category: </strong>
          {["Indica", "Sativa", "Hybrid", ""].map((cat) => (
            <button
              key={cat}
              className={`button button-filter ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat || "All"}
            </button>
          ))}
        </div>

        <div>
          <strong>Search: </strong>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <strong>Sort by Price: </strong>
          <button className="button button-filter" onClick={() => setSort("priceAsc")}>
            Low to High
          </button>
          <button className="button button-filter" onClick={() => setSort("priceDesc")}>
            High to Low
          </button>
          <button className="button button-clear" onClick={() => setSort("")}>
            Clear Sorting
          </button>
        </div>
      </div>

      {/* Product Listing */}
      <h1>Our Products</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image_url} alt={product.name} onClick={() => handleProductClick(product)} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="product-price"><strong>Price:</strong> ${product.price}</p>
            <p><strong>Stock:</strong> {product.stock_quantity}</p>
            <button className="button button-success" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div className="cart-content">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <strong>{item.name}</strong> - ${item.price} x {item.quantity}
                    <div className="cart-buttons">
                      <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                      <button onClick={() => removeFromCart(item.id)}>❌</button>
                    </div>
                  </div>
                ))}
                <hr />
                <p className="cart-total"><strong>Total:</strong> ${totalPrice}</p>
              </div>
            )}
            <div className="modal-buttons">
              <button className="button button-primary" onClick={() => setIsCartOpen(false)}>
                Close Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
