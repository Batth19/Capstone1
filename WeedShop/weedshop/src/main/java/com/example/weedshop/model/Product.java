package com.example.weedshop.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;  // Product category

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer stock_quantity;

    @Column(nullable = false)
    private String image_url;

    // ✅ Added THC and CBD fields
    @Column(nullable = false)
    private Double thc;

    @Column(nullable = false)
    private Double cbd;
}
