import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';


@Component({
  selector: 'app-import-excel-test',
  templateUrl: './import-excel-test.component.html',
  styleUrls: ['./import-excel-test.component.scss']
})
  export class ImportExcelTestComponent extends AppComponentBase  {
    uploading = false;
    saveDisabled = false;
    downLoading = false;
    maxFile = 1;
    files: File[] = [];
    returnMessage = '';
    excelAcceptTypes = '';
    @Output() onDownload = new EventEmitter();
    @Output() onSave = new EventEmitter<File[]>();
    @Output() onClose = new EventEmitter();
    constructor(
        public bsModalRef: BsModalRef,
        injector: Injector,
    ) {
        super(injector);
    }

    onSelect(event) {
        if (this.files.length < this.maxFile) {
            this.files.push(...event.addedFiles);
            this.saveDisabled = false;
        } else {
            this.showNotifyMessage(`Chỉ được phép chọn tối đa ${this.maxFile} file.`, 'error');
        }
    }

    onRemove(event) {
        this.files.splice(this.files.indexOf(event), 1);
    }

    download(): void {
        this.downLoading = true;
        this.onDownload.emit();
    }

    upload() {
        this.uploading = true;
        this.onSave.emit(this.files);
    }

    uploadDone() {
        setTimeout(() => {
            this.saveDisabled = false;
            this.saveDisabled = true;
        });
    }

    close() {
        this.onClose.emit();
        this.bsModalRef.hide();
    }
}
