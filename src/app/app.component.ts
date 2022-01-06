import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from './config/config.service';
import { interval, Observable } from 'rxjs';
import { COIN, DIFFERENCE } from './const-common/const-common.const';
import { FormBuilder, FormGroup } from '@angular/forms';
const listCoinPrivate = ['BNBUSDT', 'BTCUSDT'];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'my-app';
  formGroup: FormGroup;
  public listCoin: COIN[] = [];
  public listFilter: string[] = [];
  public listCurrency = ['USDT', 'VNDC'];
  public listNameCoin: { value?: string; label?: string }[] = [];
  public audio = new Audio();
  constructor(public configService: ConfigService, private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      name: [null],
      target: [null],
      currency: ['USDT'],
    });
    this.listFilter = [
      `BCOIN${this.formGroup.value.currency}`,
      `ONE${this.formGroup.value.currency}`,
    ];
  }
  ngOnInit(): void {
    this.audio.src = '../assets/mp3/ring.mp3';
    this.audio.load();
    this.getListCoin();
    this.getListNameCoin();
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
            .getChartOfTime(
              iterator
                .replace(this.listCurrency[0], '')
                .replace(this.listCurrency[1], ''),
              '1D',
              this.formGroup.value.currency
            )
            .subscribe((dataD) => {
              day = this.mathDifference(dataD.data);
              this.configService
                .getChartOfTime(
                  iterator
                    .replace(this.listCurrency[0], '')
                    .replace(this.listCurrency[1], ''),
                  '7D',
                  this.formGroup.value.currency
                )
                .subscribe((dataW) => {
                  week = this.mathDifference(dataW.data);
                  this.configService
                    .getChartOfTime(
                      iterator
                        .replace(this.listCurrency[0], '')
                        .replace(this.listCurrency[1], ''),
                      '1M',
                      this.formGroup.value.currency
                    )
                    .subscribe((dataM) => {
                      month = this.mathDifference(dataM.data);
                      this.configService
                        .getChartOfTime(
                          iterator
                            .replace(this.listCurrency[0], '')
                            .replace(this.listCurrency[1], ''),
                          '1Y',
                          this.formGroup.value.currency
                        )
                        .subscribe((dataY) => {
                          year = this.mathDifference(dataY.data);
                          dataCoin.push({
                            ...data[iterator],
                            name: iterator.replace(
                              this.formGroup.value.currency,
                              ''
                            ),
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

  getListNameCoin() {
    this.configService.getNameListCoin().subscribe((data) => {
      let list = [] as any;
      data.data.forEach((element: any) => {
        list.push({ value: element.symbol, label: element.name });
      });
      this.listNameCoin = list;
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
    let value = '';
    let listAdd = this.listFilter;
    let check = false;
    for (const iterator of this.listFilter) {
      if (iterator !== value) {
        check = true;
      }
    }
    if (check) {
      listAdd.push(value);
    }
    this.listFilter = listAdd;
  }

  deleteCoin(value: string) {
    if (value) {
      let valueCurrency = '';
      if (value === 'BNB') {
        valueCurrency = 'BNB';
      } else {
        valueCurrency = `${value}${this.formGroup.value.currency}`;
      }
      this.listFilter = this.listFilter.filter(
        (item) => item !== valueCurrency
      );
    }
  }

  onChangeSelectCurrency() {
    let list = [];
    list = this.listFilter.map((item) => {
      return item
        .replace(this.listCurrency[0], '')
        .replace(this.listCurrency[1], '');
    });
    this.listFilter = list.map((item) => {
      return `${item}${this.formGroup.value.currency}`;
    });
    this.getListCoin();
  }

  emitChangeAutoComplete(e: { value?: string; label?: string }) {
    this.formGroup.patchValue({
      name: e.value,
    });
  }

  // convertTimestampToTime(timeStamp: string) {
  //   var s = new Date(timeStamp).toLocaleDateString('en-US');
  // }
}
