import "./About.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    const storedAgeCheck = localStorage.getItem("ageVerified");
    if (storedAgeCheck === "true") {
      setIsAllowed(true);
    }
  }, []);

  const handleAgeCheck = (isAdult) => {
    if (isAdult) {
      localStorage.setItem("ageVerified", "true");
      setIsAllowed(true);
    } else {
      setIsAllowed(false);
    }
  };

  if (isAllowed === false) {
    return (
      <div className="container">
        <div className="age-check-box">
          <h1 className="denied">🚫 Access Denied</h1>
          <p>You must be 18 or older to access this page.</p>
        </div>
      </div>
    );
  }

  if (isAllowed === null) {
    return (
      <div className="container">
        <div className="age-check-box">
          <h2>Are you 18 years or older?</h2>
          <div className="button-container">
            <button className="button-yes" onClick={() => handleAgeCheck(true)}>✅ Yes</button>
            <button className="button-no" onClick={() => handleAgeCheck(false)}>❌ No</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="about-page">
      <div className="about-content">
        <h1>🌿 Welcome to the Brothers By bud's</h1>
        <p>
          Experience top-quality cannabis products, expertly curated for both medicinal and recreational use. 
          Our shop offers a wide variety of **Indica, Sativa, and Hybrid** strains to suit your lifestyle.
        </p>
        <div className="buttons">
          <button className="button-primary" onClick={() => navigate("/login")}>🔑 Login</button>
          <button className="button-primary" onClick={() => navigate("/register")}>📝 Register</button>
          <button className="button-secondary" onClick={() => navigate("/main")}>🛒 Shop Now</button>
        </div>

        {/* Our Values */}
        <div className="values">
          <h2>💚 Our Core Values</h2>
          <ul>
            <li>✔️ **Quality:** We ensure every product meets the highest standards.</li>
            <li>✔️ **Transparency:** Clear product descriptions and lab-tested results.</li>
            <li>✔️ **Customer Satisfaction:** Dedicated support for an excellent shopping experience.</li>
          </ul>
        </div>

        {/* Categories */}
        <div className="categories">
          <div className="category">
            <img src="https://www.grxstatic.com/4f3rgqwzdznj/5QfIKoqfeMWKszFTt84fKg/e56772c4590c31d6dc8f8b43c997a468/relaxed_person_smoking_marijuana_at_home_1471397377.jpg" alt="Indica" />
            <h2>Indica</h2>
            <p>Relaxing & calming - ideal for stress relief.</p>
          </div>
          <div className="category">
            <img 
               src="https://www.shutterstock.com/image-photo/man-on-stone-hill-beautiful-600nw-2487367275.jpg" 
                alt="Sativa"/>
                 <h2>Sativa</h2>
                 <p>Uplifting & energizing - perfect for productivity.</p>
              </div>

          <div className="category">
            <img src="https://img.pikbest.com/photo/20240821/a-person-meditating-in-a-peaceful-environment-surrounded-by-nature_10745194.jpg!sw800" alt="Hybrid" />
            <h2>Hybrid</h2>
            <p>A balanced mix of relaxation and energy.</p>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="reviews">
          <h2>⭐ Customer Reviews</h2>
          <div className="review">
            <p>💬 "Best quality weed I’ve ever tried! Super smooth experience." - <strong>Mike D.</strong></p>
          </div>
          <div className="review">
            <p>💬 "Amazing service and fast delivery. Highly recommend!" - <strong>Sarah W.</strong></p>
          </div>
          <div className="review">
            <p>💬 "Great selection and fair prices. Love this place!" - <strong>James T.</strong></p>
          </div>
        </div>

        {/* How to Order */}
        <div className="order-steps">
          <h2>🛒 How to Order</h2>
          <ol>
            <li>🔍 **Browse** our selection and choose your products.</li>
            <li>🛒 **Add to Cart** and proceed to checkout.</li>
            <li>💳 **Secure Payment** with multiple payment options.</li>
            <li>🚚 **Fast Delivery** within 24-48 hours.</li>
          </ol>
        </div>

        {/* FAQ Section */}
        <div className="faq">
          <h2>❓ Frequently Asked Questions</h2>
          <p><strong>🔹 Is your cannabis lab-tested?</strong></p>
          <p>Yes, all our products go through **strict quality testing** for safety.</p>

          <p><strong>🔹 Do you offer same-day delivery?</strong></p>
          <p>Yes, for orders placed before **2 PM**, same-day delivery is available.</p>

          <p><strong>🔹 What payment methods do you accept?</strong></p>
          <p>We accept **credit cards, debit cards, and cryptocurrency payments.**</p>
        </div>
       {/* 📞 Contact Us Section */}
<div className="contact-us">
    <h2>Contact Us</h2>
    <p>Have questions or need help? Get in touch with us!</p>
    <ul>
        <li><strong>Location:</strong> 83 Barrat Drive, Red Deer, Alberta</li>
        <li><strong>Email:</strong> support@premiumweedshop.com</li>
        <li><strong>Phone:</strong> +1 (555) 123-4567</li>
        <li><strong>Live Chat:</strong> Available 24/7 on our website</li>
    </ul>
</div>



    
        
      </div>
    </div>
  );
}

export default About;
