package com.example.weedshop.service;

import com.example.weedshop.model.Product;
import com.example.weedshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // ✅ Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // ✅ Get products by category
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    // ✅ Search products by name (case-insensitive)
    public List<Product> searchProducts(String search) {
        return productRepository.findByNameContainingIgnoreCase(search);
    }

    // ✅ Get product by ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // ✅ Get products with THC above a certain level
    public List<Product> getProductsByThcLevel(Double thc) {
        return productRepository.findByThcGreaterThanEqual(thc);
    }

    // ✅ Get products with CBD above a certain level
    public List<Product> getProductsByCbdLevel(Double cbd) {
        return productRepository.findByCbdGreaterThanEqual(cbd);
    }
}
