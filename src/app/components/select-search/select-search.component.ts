import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { map, Observable, startWith, take, takeUntil } from 'rxjs';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { Subject } from 'rxjs/internal/Subject';
interface Website {
  id: string;
  name: string;
}
@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss'],
})
export class SelectSearchComponent implements OnInit {
  @Input() set options(data: { value?: string; label?: string }[]) {
    if (data && data.length > 0) {
      this.optionDefault = data;
      this.optionsFilter = data;
    }
  }
  @Output() emitChangeAutoComplete: EventEmitter<any> = new EventEmitter();
  myControl = new FormControl();
  optionDefault: { value?: string; label?: string }[] = [];
  optionsFilter: { value?: string; label?: string }[] = [];
  constructor() {}
  ngOnInit() {}

  changeInput(event: any) {
    if (event) {
      this.optionsFilter = this.optionDefault.filter((item) =>
        String(item?.label?.toLowerCase()).includes(String(event.toLowerCase()))
      );
    } else {
      this.optionsFilter = this.optionDefault;
    }
  }

  handle(obj: { value?: string; label?: string }) {
    this.emitChangeAutoComplete.emit(obj);
  }
}
