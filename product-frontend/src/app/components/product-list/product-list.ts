import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (err) => console.error(err)
    });
  }

  filterProducts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  deleteProduct(id: number): void {
    if (confirm('ይህንን ምርት መሰረዝ ይፈልጋሉ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('🗑️ ምርቱ በተሳካ ሁኔታ ተሰርዟል!');
          this.loadProducts();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
