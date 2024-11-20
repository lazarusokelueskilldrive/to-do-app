import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})



export class UiService {

  constructor(private _toastr: ToastrService) { }

  success(msg: string){
		this._toastr.success(msg)
	}
	// show message
	info(msg: string){
		this._toastr.info(msg)
	}
	// show message
	warning(msg: string){
		this._toastr.warning(msg)
	}
	error(msg: string){
		this._toastr.error(`<strong>${msg}</strong>`)
	}
}
