import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartDemoComponent } from './chart-demo.component';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [
    ChartDemoComponent
  ],
  imports: [
    CommonModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  exports: [
    ChartDemoComponent
  ]
})
export class ChartDemoModule { }
