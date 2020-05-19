import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrdersService} from "../shared/services/orders.services";
import {Filter, Order} from "../shared/interfaces";
import {Subscription} from "rxjs";

const STEP = 2;

export interface LocalOrder extends Order {
  totalSum?: number
}

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip') tooltipRef: ElementRef;
  tooltip: MaterialInstance;
  isFilterVisible: boolean = false;
  offset: number = 0;
  limit: number = STEP;
  loading: boolean = false;
  reLoading: boolean = false;
  noMoreOrders: boolean = false;
  filter: Filter = {};
  filterApplied: boolean = false;

  orders: LocalOrder[] = [];

  sub: Subscription;

  constructor(private ordersService: OrdersService) {
  }

  ngOnInit(): void {
    this.reLoading = true;
    this.fetch();
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })
    this.sub = this.ordersService.fetch(params).subscribe((orders: LocalOrder[]) => {
      this.orders = this.orders.concat(orders);
      this.computePrice();
      this.noMoreOrders = orders.length < STEP;
      this.loading = false;
      this.reLoading = false;
    })
  }

  computePrice(): void {
    this.orders.forEach(order => {
      order.totalSum = order.list.reduce((total, item) => {
        return total += item.quantity * item.cost;
      }, 0);
    })
  }

  ngOnDestroy(): void {
    this.tooltip.destroy();

    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  loadMore() {
    this.loading = true;
    this.offset += STEP;
    this.fetch();
  }

  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.filter = filter;
    this.reLoading = true;
    this.filterApplied = Object.keys(this.filter).length > 0;
    this.fetch();
  }

}
