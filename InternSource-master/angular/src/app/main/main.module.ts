import { NgModule } from '@angular/core';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '@shared/shared.module';
import {FileUploadModule} from 'primeng/fileupload';

@NgModule({
    declarations: [],
    imports: [
        MainRoutingModule,
        SharedModule,
        FileUploadModule
    ],
    exports: [
    ],
    providers: [],
    entryComponents: [
    ],
})
export class MainModule { }
