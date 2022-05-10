import { DanhMucRoutingModule } from './danh-muc-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { DemoComponent } from './demo/demo.component';
import { CreateOrEditDemoDialogComponent } from './demo/create-or-edtit/create-or-edit-demo-dialog.component';
import { TestComponent } from './test/test.component';
import {FileUploadModule} from 'primeng/fileupload';
import { CreateOrEditTestComponent } from './test/create-or-edit-test/create-or-edit-test/create-or-edit-test.component';
import { Test2Component } from './test2/test2.component';
import { CreateOrEditComponent } from './test2/create-or-edit/create-or-edit.component';





@NgModule({
    imports: [
        SharedModule,
        DanhMucRoutingModule,
        FileUploadModule


    ],
    declarations: [
        DemoComponent,
        CreateOrEditDemoDialogComponent,
        TestComponent,
        CreateOrEditTestComponent,
        Test2Component,
        CreateOrEditComponent,

    ],
})
export class DanhMucModule { }
