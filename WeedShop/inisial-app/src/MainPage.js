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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loginId = localStorage.getItem("login_id");
    if (!loginId) return;

    const fetchCart = async () => {
      try {
        const response = await fetch(`http://localhost:8080/cart/${loginId}`);
        const data = await response.json();
        setCart(data);
        localStorage.setItem(`cart_${loginId}`, JSON.stringify(data));
      } catch (error) {
        console.error("❌ Failed to fetch cart:", error);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let url = `http://localhost:8080/api/products?`;
      if (category) url += `category=${encodeURIComponent(category)}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (sort) url += `sort=${encodeURIComponent(sort)}&`;
      url = url.endsWith("&") ? url.slice(0, -1) : url;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
        setTimeout(() => setLoading(false), 500); // Optional loader delay
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search, sort]);

  const saveCartToLocalStorage = (updatedCart) => {
    const loginId = localStorage.getItem("login_id");
    if (loginId) {
      localStorage.setItem(`cart_${loginId}`, JSON.stringify(updatedCart));
    }
  };

  const syncCartItemWithBackend = async (item) => {
    const loginId = localStorage.getItem("login_id");
    if (!loginId) return;

    try {
      await fetch("http://localhost:8080/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { id: parseInt(loginId) },
          product: { id: item.id },
          quantity: item.quantity,
        }),
      });
    } catch (error) {
      console.error("❌ Failed to sync cart item:", error);
    }
  };

  const handleProfileClick = () => {
    const loginId = localStorage.getItem("login_id");
    if (loginId) {
      navigate("/profile");
    } else {
      alert("Please log in to view your profile.");
      navigate("/login");
    }
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const addToCart = (product) => {
    const loginId = localStorage.getItem("login_id");
    if (!loginId) {
      alert("Please log in to add items to the cart.");
      navigate("/login");
      return;
    }

    const existingItem = cart.find((item) => item.product?.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.product?.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { product, quantity: 1 }];
    }

    setCart(updatedCart);
    saveCartToLocalStorage(updatedCart);
    syncCartItemWithBackend({ ...product, quantity: existingItem ? existingItem.quantity + 1 : 1 });

    alert(`${product.name} added to cart!`);
  };

  const updateQuantity = (productId, change) => {
    const updatedCart = cart.map((item) =>
      item.product?.id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );

    setCart(updatedCart);
    saveCartToLocalStorage(updatedCart);

    const updatedItem = updatedCart.find((item) => item.product?.id === productId);
    if (updatedItem) {
      syncCartItemWithBackend({
        ...updatedItem.product,
        quantity: updatedItem.quantity,
      });
    }
  };

  const removeFromCart = async (productId) => {
    const itemToRemove = cart.find((item) => item.product?.id === productId);
    if (!itemToRemove) return;

    try {
      await fetch(`http://localhost:8080/cart/remove/${itemToRemove.id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("❌ Failed to remove cart item from backend:", error);
    }

    const updatedCart = cart.filter((item) => item.product?.id !== productId);
    setCart(updatedCart);
    saveCartToLocalStorage(updatedCart);
  };

  const totalPrice = cart.reduce((sum, item) => {
    const price = item.product?.price || item.price;
    return sum + price * item.quantity;
  }, 0).toFixed(2);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="canna-loader"></div>
        <p>Loading your buds...</p>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="top-bar">
        <button className="button button-primary" onClick={handleProfileClick}>
          User Profile
        </button>
        <button className="button button-warning" onClick={() => setIsCartOpen(true)}>
          View Cart ({cart.length}) - ${totalPrice}
        </button>
      </div>

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

      <h1>Our Products</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image_url}
              alt={product.name}
              onClick={() => handleProductClick(product)}
            />
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

      {isCartOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div className="cart-content">
                {cart.map((item) => {
                  const product = item.product || item;
                  return (
                    <div key={product.id} className="cart-item">
                      <strong>{product.name}</strong> - ${product.price} × {item.quantity}
                      <div className="cart-buttons">
                        <button onClick={() => updateQuantity(product.id, -1)}>-</button>
                        <button onClick={() => updateQuantity(product.id, 1)}>+</button>
                        <button onClick={() => removeFromCart(product.id)}>❌</button>
                      </div>
                    </div>
                  );
                })}
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
