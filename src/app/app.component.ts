import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from './config/config.service';
import { interval, Observable } from 'rxjs';
import { COIN, DIFFERENCE } from './const-common/const-common.const';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'my-app';
  public dataBcoin: COIN = {};
  public dataSpg: COIN = {};
  public audio = new Audio();
  constructor(public configService: ConfigService) {}
  ngOnInit(): void {
    this.audio.src = '../assets/mp3/ring.mp3';
    this.audio.load();
    const source = interval(5000);
    source.subscribe((val) => {
      this.getPriceBcoin();
    });
  }

  getPriceBcoin() {
    this.configService.getPriceCoin().subscribe((data) => {
      this.dataBcoin = data['BCOINUSDT'];
      this.dataBcoin = {
        ...this.dataBcoin,
        ask: Number(this.dataBcoin.ask).toFixed(2),
      };
      if (Number(this.dataBcoin.ask) > 3.0) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
      this.getAllChartOfTime('BCOIN');
      this.dataSpg = data['SPGUSDT'];
    });
  }

  convertTimestampToTime(timeStamp: string) {
    var s = new Date(timeStamp).toLocaleDateString('en-US');
  }

  getAllChartOfTime(nameCoin: string) {
    this.getChartOfTime(nameCoin, '1D', 'USDT');
    this.getChartOfTime(nameCoin, '7D', 'USDT');
    this.getChartOfTime(nameCoin, '1M', 'USDT');
    this.getChartOfTime(nameCoin, '1Y', 'USDT');
  }
  getChartOfTime(nameCoin: string, ranges: string, baseCurrency: string) {
    let obj = { value: '0', color: 'red' } as DIFFERENCE;
    this.configService
      .getChartOfTime(nameCoin, ranges, baseCurrency)
      .subscribe((data) => {
        let listKey = Object.keys(data.data);
        let length = Object.keys(data.data).length;
        let range =
          Number(data.data[listKey[0]][0]) /
          Number(data.data[listKey[length - 1]][0]);
        if (range < 1) {
          obj = { value: Number((1 - range) * 100).toFixed(2), color: 'green' };
        } else {
          obj = { value: Number((range - 1) * 100).toFixed(2), color: 'red' };
        }
        switch (ranges) {
          case '1D':
            this.dataBcoin = {
              ...this.dataBcoin,
              day: obj,
            };
            break;
          case '7D':
            this.dataBcoin = {
              ...this.dataBcoin,
              week: obj,
            };
            break;
          case '1M':
            this.dataBcoin = {
              ...this.dataBcoin,
              month: obj,
            };
            break;
          case '1Y':
            this.dataBcoin = {
              ...this.dataBcoin,
              year: obj,
            };
            break;
          default:
        }
      });
  }
}
