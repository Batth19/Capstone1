package com.example.weedshop.repository;

import com.example.weedshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByNameContainingIgnoreCase(String search);

    // ✅ Add methods for THC and CBD filtering
    List<Product> findByThcGreaterThanEqual(Double thc); // THC filter
    List<Product> findByCbdGreaterThanEqual(Double cbd); // CBD filter
}
