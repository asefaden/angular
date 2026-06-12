import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-edit.html',
  styleUrls: ['./product-edit.css']
})
export class ProductEdit implements OnInit {
  id!: number;
  product = { name: '', price: 0, description: '', quantity: 0 };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.productService.getProduct(this.id).subscribe({
      next: (data) => this.product = data,
      error: (err) => console.error(err)
    });
  }

  updateProduct(): void {
    this.productService.updateProduct(this.id, this.product).subscribe({
      next: () => {
        alert('🔄 የምርት መረጃው በተሳካ ሁኔታ ታድሷል!');
        this.router.navigate(['/products']);
      },
      error: (err) => console.error(err)
    });
  }
}
