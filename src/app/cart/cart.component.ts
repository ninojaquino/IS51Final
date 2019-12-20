import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';


export interface IBicycle {
  id?: number;
  image: string;
  description: string;
  price: number;
  quantity: number;
}


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  bikes: Array<IBicycle> = [];
  nameParams = '';
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    const bikes = JSON.parse(localStorage.getItem('bikes'));
    if (bikes && bikes.length > 0) {
      this.bikes = bikes;
    } else {
      this.bikes = await this.loadShoppingCartFromJSON();
    }
  }

  async loadShoppingCartFromJSON() {
    const bike = await this.http.get('assets/inventory.json').toPromise();
    return bike.json();
  }

  addItems(item: string) {
    switch (item) {
      case 'Bike1':
        this.bikes.unshift({
          'id': 1,
          'image': '../../assets/bike1.jpeg',
          'description': 'Bike Model 1',
          'price': 5000,
          'quantity': 1
        });
        break;
      case 'Bike2':
        this.bikes.unshift({
          'id': 2,
          'image': '../../assets/bike2.jpeg',
          'description': 'Bike Model 2',
          'price': 4000,
          'quantity': 1
        });
        break;
      case 'Bike3':
        this.bikes.unshift({
          'id': 3,
          'image': '../../assets/bike3.jpeg',
          'description': 'Bike Model 3',
          'price': 3000,
          'quantity': 1
        });
        break;
    }
    this.saveBicycle();
  }

  deleteBicycle(index: number) {
    this.bikes.splice(index, 1);
    this.saveBicycle();
  }

  saveBicycle() {
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
    this.toastService.showToast('success', 2000, 'Success: Items saved!');
  }

  orderCheckout() {
    if (this.nameParams == null || this.nameParams === '') {
      this.toastService.showToast('warning', 2000, 'Name must not be null!');
    } else if (this.nameParams.indexOf(', ') === -1) {
      this.toastService.showToast('warning', 2000, 'Name must have a comma and a space');
    } else {
      const data = this.computeAmount();
      this.computeAmount();
      this.router.navigate(['invoice', data]);
    }
  }

  computeAmount() {
    const total = this.bikes.reduce((acc: number, item: IBicycle) => {
      acc += item.quantity * item.price;
      return acc;
    }, 0);
    const taxAmount = total * .10;
    const subTotal = total - taxAmount;
    const grandTotal = subTotal + taxAmount;
    let firstName, lastName, indexOfComma, fullName;
    indexOfComma = this.nameParams.indexOf(', ');
    firstName = this.nameParams.slice(indexOfComma + 1, this.nameParams.length);
    lastName = this.nameParams.slice(0, indexOfComma);
    fullName = firstName + ' ' + lastName;
    this.router.navigate(['invoice', {
      fullName: fullName,
      taxAmount: taxAmount.toFixed(2),
      subTotal: subTotal.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    }
    ]);
    console.log('the total for this order is -------->', total);
  }
}
