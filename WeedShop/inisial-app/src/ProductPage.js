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

  const addToCart = (product) => {
    const loginId = localStorage.getItem("login_id");
    if (!loginId) {
      alert("Please log in to add items to the cart.");
      navigate("/login");
      return;
    }
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.name} added to cart!`);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-page">
      {/* Navigation Bar */}
      <div className="top-bar">
        <button className="button button-primary" onClick={() => navigate("/profile")}>User Profile</button>
        <button className="button button-warning" onClick={() => setIsCartOpen(true)}>
          View Cart ({cart.length})
        </button>
      </div>

      {/* Product Details */}
      <button className="button button-primary" onClick={() => navigate(-1)}>Back</button>
      <h1>{product.name}</h1>
      <img src={product.image_url} alt={product.name} className="product-image" />
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Stock:</strong> {product.stock_quantity}</p>

      {/* THC and CBD Levels with Progress Bars */}
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

      {/* Recommended Products */}
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
                {cart.map((item, index) => (
                  <div key={index}>
                    <strong>{item.name}</strong> - ${item.price}
                  </div>
                ))}
                <hr />
                <p className="cart-total"><strong>Total:</strong> ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</p>
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
