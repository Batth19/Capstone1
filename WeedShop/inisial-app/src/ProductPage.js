import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/products/${id}`);
        const data = await res.json();
        setProduct(data);

        const recRes = await fetch(`http://localhost:8080/api/products?category=${encodeURIComponent(data.category)}`);
        const recData = await recRes.json();
        setRecommendations(recData.filter(item => item.id !== data.id));
      } catch (error) {
        console.error("Failed to fetch product details or recommendations", error);
      }
    };

    fetchProduct();
  }, [id]);

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
        console.error("❌ Failed to fetch cart from backend:", error);
      }
    };

    fetchCart();
  }, []);

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
          product: { id: item.product ? item.product.id : item.id },
          quantity: item.quantity,
        }),
      });
    } catch (error) {
      console.error("❌ Failed to sync cart item with backend:", error);
    }
  };

  const addToCart = (product) => {
    const loginId = localStorage.getItem("login_id");
    if (!loginId) {
      alert("Please log in to add items to the cart.");
      navigate("/login");
      return;
    }

    const existingItem = cart.find((item) => item.product?.id === product.id || item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        (item.product?.id === product.id || item.id === product.id)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    saveCartToLocalStorage(updatedCart);
    syncCartItemWithBackend({ ...product, quantity: existingItem ? existingItem.quantity + 1 : 1 });

    alert(`${product.name} added to cart!`);
  };

  const updateQuantity = (productId, change) => {
    const updatedCart = cart.map((item) => {
      const itemId = item.product?.id || item.id;
      return itemId === productId
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item;
    });

    setCart(updatedCart);
    saveCartToLocalStorage(updatedCart);

    const updatedItem = updatedCart.find((item) => (item.product?.id || item.id) === productId);
    if (updatedItem) {
      syncCartItemWithBackend(updatedItem);
    }
  };

  const removeFromCart = async (productId) => {
    const itemToRemove = cart.find((item) => (item.product?.id || item.id) === productId);
    if (!itemToRemove) return;

    try {
      await fetch(`http://localhost:8080/cart/remove/${itemToRemove.id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("❌ Failed to delete from backend:", error);
    }

    const updatedCart = cart.filter((item) => (item.product?.id || item.id) !== productId);
    setCart(updatedCart);
    saveCartToLocalStorage(updatedCart);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-page">
      <div className="top-bar">
        <button className="button button-primary" onClick={() => navigate("/profile")}>User Profile</button>
        <button className="button button-warning" onClick={() => setIsCartOpen(true)}>
          View Cart ({cart.length})
        </button>
      </div>

      <button className="button button-primary" onClick={() => navigate(-1)}>Back</button>
      <h1>{product.name}</h1>
      <img src={product.image_url} alt={product.name} className="product-image" />
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Stock:</strong> {product.stock_quantity}</p>

      <div className="thc-cbd-levels">
        <div className="thc-cbd-row">
          <p><strong>THC:</strong> {product.thc}%</p>
          <div className="progress-bar">
            <div className="progress thc" style={{ width: `${product.thc}%` }}></div>
          </div>
        </div>
        <div className="thc-cbd-row">
          <p><strong>CBD:</strong> {product.cbd}%</p>
          <div className="progress-bar">
            <div className="progress cbd" style={{ width: `${product.cbd}%` }}></div>
          </div>
        </div>
      </div>

      <button className="button button-success" onClick={() => addToCart(product)}>Add to Cart</button>

      <h2>Recommended Products</h2>
      <div className="recommendations-grid">
        {recommendations.map((rec) => (
          <div key={rec.id} className="product-card" onClick={() => navigate(`/product/${rec.id}`)}>
            <img src={rec.image_url} alt={rec.name} className="recommendation-image" />
            <h3>{rec.name}</h3>
            <p>${rec.price}</p>
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
                {cart.map((item) => {
                  const productId = item.product?.id || item.id;
                  const productName = item.product?.name || item.name;
                  const price = item.product?.price || item.price;
                  return (
                    <div key={productId} className="cart-item">
                      <strong>{productName}</strong> - ${price} × {item.quantity}
                      <div className="cart-buttons">
                        <button onClick={() => updateQuantity(productId, -1)}>-</button>
                        <button onClick={() => updateQuantity(productId, 1)}>+</button>
                        <button onClick={() => removeFromCart(productId)}>❌</button>
                      </div>
                    </div>
                  );
                })}
                <hr />
                <p className="cart-total">
                  <strong>Total:</strong> ${cart.reduce((sum, item) => {
                    const price = item.product?.price || item.price;
                    return sum + price * item.quantity;
                  }, 0).toFixed(2)}
                </p>
              </div>
            )}
            <div className="modal-buttons">
              <button className="button button-primary" onClick={() => setIsCartOpen(false)}>Close Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
