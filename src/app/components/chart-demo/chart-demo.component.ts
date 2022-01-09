import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart-demo',
  templateUrl: './chart-demo.component.html',
  styleUrls: ['./chart-demo.component.scss']
})
export class ChartDemoComponent implements OnInit {
  @Input() barChartLabels = [] as any;
  @Input() barChartType = 'bar';
  @Input() barChartLegend = true;
  @Input() set getbarChartData(value: any) {
    if(value) {
      this.barChartData = value;
      console.log(value)
    }
  }
  public barChartData = [];
  constructor() { }
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  ngOnInit() {
    let data = [];
    for(let i =1; i<=24; i++) {
      data.push(i)
    }
    this.barChartLabels = data;
 
  }
}
