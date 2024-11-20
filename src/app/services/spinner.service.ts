import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  busyRequestCount: number = 0;
  constructor(
    private _spinner: NgxSpinnerService

  ) { }

  busy(){
    this.busyRequestCount++;
    this._spinner;
    this._spinner.show(undefined, {
      type: 'square-jelly-box', 
       bdColor: 'rgba(0,0,0,0.8)', 
       color:"#fff",
       size: 'default'
    });
  } 

  idle() {
    this.busyRequestCount--;
    if(this.busyRequestCount <= 0){
      this.busyRequestCount=0;
      this._spinner.hide()
    }
  }
}