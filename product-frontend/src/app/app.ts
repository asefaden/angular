import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // ስታንድአሎን መሆኑን ያረጋግጣል
  imports: [RouterOutlet], // ማዘዋወሪያውን እዚህ እንፈቅዳለን
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'product-frontend';
}
