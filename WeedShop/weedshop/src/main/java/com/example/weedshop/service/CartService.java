package com.example.weedshop.service;

import com.example.weedshop.model.CartItem;
import com.example.weedshop.model.Product;
import com.example.weedshop.model.User;
import com.example.weedshop.repository.CartItemRepository;
import com.example.weedshop.repository.ProductRepository;
import com.example.weedshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public CartItem addToCart(Long userId, Long productId, Integer quantity) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Product> product = productRepository.findById(productId);

        if (user.isPresent() && product.isPresent()) {
            CartItem cartItem = new CartItem();
            cartItem.setUser(user.get());
            cartItem.setProduct(product.get());
            cartItem.setQuantity(quantity);

            return cartItemRepository.save(cartItem);
        } else {
            throw new RuntimeException("User or Product not found!");
        }
    }

    public List<CartItem> getCartItemsByUser(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    @Transactional
    public void removeCartItem(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }
}
