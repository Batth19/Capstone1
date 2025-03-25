package com.example.weedshop.controller;

import com.example.weedshop.model.CartItem;
import com.example.weedshop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartItem cartItem) {
        if (cartItem.getUser() == null || cartItem.getProduct() == null) {
            return ResponseEntity.badRequest().body("User or Product cannot be null");
        }

        CartItem savedCartItem = cartService.addToCart(
                cartItem.getUser().getId(),
                cartItem.getProduct().getId(),
                cartItem.getQuantity()
        );

        return ResponseEntity.ok(savedCartItem);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long userId) {
        List<CartItem> cartItems = cartService.getCartItemsByUser(userId);
        return ResponseEntity.ok(cartItems);
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<String> removeFromCart(@PathVariable Long cartItemId) {
        cartService.removeCartItem(cartItemId);
        return ResponseEntity.ok("Item removed from cart successfully!");
    }
}
