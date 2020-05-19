import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {Subscription} from "rxjs";
import {AnalyticsPage} from "../shared/interfaces";
import {Chart} from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('revenue') revenueRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  averageCheque: number;
  pending: boolean = true;
  sub: Subscription;

  constructor(private overviewService: AnalyticsService) {
  }

  ngAfterViewInit(): void {
    const revenueConfig: any = {
      label: 'Revenue',
      color: 'rgb(255, 99, 132)'
    };

    const orderConfig: any = {
      label: 'Orders',
      color: 'rgb(54, 162, 235)'
    };

    this.sub = this.overviewService.getAnalytics().subscribe((data: AnalyticsPage) => {

      this.averageCheque = data.averageCheque;
      revenueConfig.labels = data.chart.map(item => item.label);
      revenueConfig.data = data.chart.map(item => item.revenue);
      orderConfig.labels = data.chart.map(item => item.label);
      orderConfig.data = data.chart.map(item => item.order);

      const revenueCtx = this.revenueRef.nativeElement.getContext('2d');
      const orderCtx = this.orderRef.nativeElement.getContext('2d');

      revenueCtx.canvas.height = '300px';
      orderCtx.canvas.height = '300px';

      new Chart(revenueCtx, createChartConfig(revenueConfig));
      new Chart(orderCtx, createChartConfig(orderConfig));
      this.pending = false;
    })
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
