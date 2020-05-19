import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MaterialService, MaterialInstance} from "../shared/classes/material.service";
import {OrderService} from "./order.service";
import {Order, OrderPosition} from "../shared/interfaces";
import {OrdersService} from "../shared/services/orders.services";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef;
  sub: Subscription;
  modal: MaterialInstance;
  pending: boolean = false;

  isRoot: boolean;

  constructor(
    private router: Router,
    public order: OrderService,
    private ordersService: OrdersService
    ) {
  }

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    })
  }

  ngOnDestroy(): void {
    this.modal.destroy();
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition);
  }

  openModal(): void {
    this.modal.open();
  }

  cancel() {
    this.modal.close();
  }

  submit() {
    this.pending = true;
    const order: Order = {
      list: this.order.list.map(item => {
        delete item._id;
        return item;
      })
    }
    this.sub = this.ordersService.create(order).subscribe((newOrder: Order) => {
      MaterialService.toast(`Order №${newOrder.order} has been successfully added`);
      this.order.clear();
    },
    error=> MaterialService.toast(error.error.message),
      ()=> {
        this.modal.close();
        this.pending = false;
      }
    );
  }
}
