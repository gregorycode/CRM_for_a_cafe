import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild} from '@angular/core';
import {Filter} from "../../shared/interfaces";
import {MaterialDatePicker, MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements OnDestroy, AfterViewInit {
  @ViewChild('from') fromRef: ElementRef;
  @ViewChild('to') toRef: ElementRef;
  from: MaterialDatePicker;
  to: MaterialDatePicker;
  isValid: boolean = true;

  @Output() onFilter = new EventEmitter<Filter>();
  order: number;


  constructor() {
  }

  ngOnDestroy(): void {
    this.from.destroy();
    this.to.destroy();
  }

  ngAfterViewInit(): void {
    this.from = MaterialService.initDatePIcker(this.fromRef, this.validate.bind(this))
    this.to = MaterialService.initDatePIcker(this.toRef, this.validate.bind(this))
  }

  validate() {
    if (!this.from.date || !this.to.date) {
      this.isValid = true;
      return;
    }
    this.isValid = this.from.date < this.to.date;
  }

  submitFilter() {
    const filter: Filter = {};

    if (this.order) {
      filter.order = this.order;
    }

    if (this.from.date) {
      filter.start = this.from.date;
    }

    if (this.to.date) {
      filter.end = this.to.date;
    }

    this.onFilter.emit(filter);
  }

}
