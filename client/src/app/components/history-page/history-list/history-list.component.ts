import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {LocalOrder} from "../history-page.component";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef: ElementRef;
  @Input() orders: LocalOrder[] = []
  modal: MaterialInstance;
  selectedOrder: LocalOrder;
  constructor() { }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  selectOrder(order: LocalOrder) {
    this.selectedOrder = order;
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }
}
