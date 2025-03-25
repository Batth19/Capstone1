package com.example.weedshop.controller;

import com.example.weedshop.model.Product;
import com.example.weedshop.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3003")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getProducts(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "thcMin", required = false) Double thcMin,
            @RequestParam(value = "cbdMin", required = false) Double cbdMin) {

        List<Product> products;

        if (category != null && !category.isEmpty()) {
            products = productService.getProductsByCategory(category);
        } else if (search != null && !search.isEmpty()) {
            products = productService.searchProducts(search);
        } else {
            products = productService.getAllProducts();
        }

        // ✅ Filter by THC level if requested
        if (thcMin != null) {
            products = productService.getProductsByThcLevel(thcMin);
        }

        // ✅ Filter by CBD level if requested
        if (cbdMin != null) {
            products = productService.getProductsByCbdLevel(cbdMin);
        }

        // ✅ Sorting (by price ascending or descending)
        if (sort != null) {
            if (sort.equalsIgnoreCase("priceAsc")) {
                products.sort(Comparator.comparingDouble(Product::getPrice));
            } else if (sort.equalsIgnoreCase("priceDesc")) {
                products.sort(Comparator.comparingDouble(Product::getPrice).reversed());
            }
        }

        return products;
    }

    // ✅ Get Product by ID endpoint
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);

        return product.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
