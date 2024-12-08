import { forwardRef, Inject, Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ResultComponent } from '../components/result/result.component';
import { NzResultStatusType } from 'ng-zorro-antd/result';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(
    @Inject(forwardRef(() => NzModalService)) private modal: NzModalService,
  ) { }

  showErrorModal(title: string, error?: any){

    let status;

    switch(error.status){
      case(403):
        status = '403'
        break;
      case(404):
        status = '404'
        break;
      case(500):
        status = '500'
        break;
      default: 
        status = 'error';
        break;
      }

    

    this.modal.create({
      nzContent: ResultComponent,
      nzData: {
        title: title,
        subtitle: error.message,
        status: status
      },
      nzFooter: null,
      nzClosable: true,
      nzCentered: true,
    });
  }

  showModal(title: string, message: string, status: ['warning', 'info', 'success'][number]){
    this.modal.create({
      nzContent: ResultComponent,
      nzData: {
        title: title,
        subtitle: message,
        status: status
      },
      nzFooter: null,
      nzClosable: true,
      nzCentered: true,
    });
  }

  showConfirmModal(title: string, content: string, buttons: {ok: string, cancel: string}, loading: boolean, onOkCallback: () => Promise<void> ){
    this.modal.confirm({
      nzTitle: title,
      nzContent: content,
      nzOkDanger: true,
      nzOkLoading: loading,
      nzOnOk: onOkCallback,
      nzOkText: buttons.ok,
      nzCancelText: buttons.cancel,
      nzCentered: true,
    });
  }

}
