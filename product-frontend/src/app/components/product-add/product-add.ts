import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-add.html',
  styleUrls: ['./product-add.css']
})
export class ProductAdd {
  product = { 
    name: '', 
    price: 0, 
    description: '', 
    quantity: 0 
  };
  
  notificationMessage: string = '';
  notificationType: 'success' | 'danger' | '' = '';

  constructor(private productService: ProductService, private router: Router) { }

  saveProduct(): void {
    // ከሰርቨር የሚመጣውን ማንኛውንም አይነት ምላሽ በንፅህና ለመቀበል <any> አክለናል
    this.productService.createProduct(this.product).subscribe({
      next: (res: any) => {
        console.log('ዳታ በተሳካ ሁኔታ ገብቷል:', res);
        
        // አረንጓዴውን ኖቲፊኬሽን በገጹ ላይ በግልጽ ማሳያ
        this.notificationMessage = '✅ ምርቱ በተሳካ ሁኔታ መጋዘን ውስጥ ተቀምጧል!';
        this.notificationType = 'success';

        // ልክ 2 ሰከንድ ሲሞላው ወደ ዝርዝር ገጽ መመለሻ
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 2000);
      },
      error: (err) => {
        console.error('የሰርቨር ስህተት:', err);
        this.notificationMessage = '❌ ስህተት አጋጥሟል! እባክዎን መረጃዎቹን ያረጋግጡ።';
        this.notificationType = 'danger';
      }
    });
  }
}
