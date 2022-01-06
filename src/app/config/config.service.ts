import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
const getPriceCoin = {
  url: 'https://exchange.vndc.io/exchange/api/v1/showup-prices',
  options: {
    responseType: 'json',
    params: {},
    observe: 'response',
  },
};
const getChartOfTime = {
  url: 'https://api.invest.vndc.io/api/v1/chart',
  options: {
    responseType: 'json',
    params: {},
    observe: 'response',
  },
};
@Injectable()
export class ConfigService {
  constructor(private http: HttpClient) {}

  getPriceCoin(): Observable<any> {
    return this.http.get<any>(getPriceCoin.url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getChartOfTime(
    nameCoin: string,
    range: string,
    baseCurrency: string
  ): Observable<any> {
    return this.http
      .get<any>(
        `${getChartOfTime.url}?currency=${nameCoin}&range=${range}&baseCurrency=${baseCurrency}`
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getNameListCoin(): Observable<any> {
    return this.http
      .get<any>(` https://api.invest.vndc.io/api/v1/currency?query=&tag=`)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
