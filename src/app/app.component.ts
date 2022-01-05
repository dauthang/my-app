import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from './config/config.service';
import { interval, Observable } from 'rxjs';
import { COIN, DIFFERENCE } from './const-common/const-common.const';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'my-app';
  formGroup: FormGroup;
  public listCoin: COIN[] = [];
  public listFilter: string[] = ['BCOINUSDT', 'ONEUSDT'];
  public audio = new Audio();
  constructor(public configService: ConfigService, private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      name: [null],
    });
  }
  ngOnInit(): void {
    this.audio.src = '../assets/mp3/ring.mp3';
    this.audio.load();
    const source = interval(5000);
    source.subscribe((val) => {
      this.getListCoin();
    });
  }

  getListCoin() {
    this.configService.getPriceCoin().subscribe((data) => {
      let dataCoin = [] as COIN[];
      for (const iterator of this.listFilter) {
        let day = {} as DIFFERENCE;
        let week = {} as DIFFERENCE;
        let month = {} as DIFFERENCE;
        let year = {} as DIFFERENCE;
        if (data.hasOwnProperty(iterator)) {
          this.configService
            .getChartOfTime(iterator.replace('USDT', ''), '1D', 'USDT')
            .subscribe((dataD) => {
              day = this.mathDifference(dataD.data);
              this.configService
                .getChartOfTime(iterator.replace('USDT', ''), '7D', 'USDT')
                .subscribe((dataW) => {
                  week = this.mathDifference(dataW.data);
                  this.configService
                    .getChartOfTime(iterator.replace('USDT', ''), '1M', 'USDT')
                    .subscribe((dataM) => {
                      month = this.mathDifference(dataM.data);
                      this.configService
                        .getChartOfTime(
                          iterator.replace('USDT', ''),
                          '1Y',
                          'USDT'
                        )
                        .subscribe((dataY) => {
                          year = this.mathDifference(dataY.data);
                          dataCoin.push({
                            ...data[iterator],
                            name: iterator.replace('USDT', ''),
                            day,
                            week,
                            month,
                            year,
                          });
                        });
                    });
                });
            });
        }
      }
      this.listCoin = dataCoin;
    });
  }

  mathDifference(data: any) {
    let listKey = Object.keys(data);
    let length = Object.keys(data).length;
    let range =
      Number(data[listKey[0]][0]) / Number(data[listKey[length - 1]][0]);
    if (range < 1) {
      return { value: Number((1 - range) * 100).toFixed(2), color: 'green' };
    } else {
      return { value: Number((range - 1) * 100).toFixed(2), color: 'red' };
    }
  }
  addLikeCoin() {
    if (this.listFilter.find((item) => item !== this.formGroup.value.name)) {
      this.listFilter.push(this.formGroup.value.name);
      this.getListCoin();
      return;
    }
  }

  deleteCoin(value: string) {
    for (const iterator of this.listFilter) {
      if (
        String(iterator) !== String(this.formGroup.value.name) &&
        !['BCOINUSDT', 'ONEUSDT'].includes(value)
      ) {
        this.listFilter = this.listFilter.filter((item) =>
          String(item !== value)
        );
        this.getListCoin();
      }
    }
  }

  // convertTimestampToTime(timeStamp: string) {
  //   var s = new Date(timeStamp).toLocaleDateString('en-US');
  // }
}
