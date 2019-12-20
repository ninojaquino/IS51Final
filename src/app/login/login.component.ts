import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { Subject } from 'rxjs';


export interface IUser {
  id?: number;
  username: string;
  password: string;
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: IUser = {
    username: null,
    password: null
  };
  constructor(private router: Router, private toastService: ToastService) {
  }

  ngOnInit() {

  }

  loginUser(user: IUser) {
    const presetUser = { username: 'nino', password: 'nino123'};
    if (user.username != null && user.password != null && user.username !== '' && user.password !== '') {
      if (user.username === presetUser.username && user.password === presetUser.password) {
          localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['cart', user]);
      } else {
        this.toastService.showToast('danger', 2000, 'Invalid credentials!');
      }
    } else {
      this.toastService.showToast('danger', 2000, 'Username or Password not specified!');
    }
  }

}
