import { PersonForView } from './../../../../shared/service-proxies/service-proxies';
import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { PersonServiceProxy } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/internal/operators/finalize';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateOrEditComponent } from './create-or-edit/create-or-edit.component';

@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  styleUrls: ['./test2.component.scss'],
  animations: [appModuleAnimation()],
})
export class Test2Component extends AppComponentBase implements OnInit {
  @ViewChild ('dt') table : Table;
  keyword = '' ;
  Name = '' ;
  FullName = '' ;
  Email = '' ;
  loading = true;
  form: FormGroup;
  person: PersonForView[] = [] ;
  totalCount = 0 ;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _personService: PersonServiceProxy ,
    public http: HttpClient,
  ) { super(injector); }

  ngOnInit(): void {
    this.KhoiTaoForm();
  }
  KhoiTaoForm(){
    this.form = new FormGroup({
      TextInput1 :  new FormControl() ,
      TextInput2 : new FormControl()
    })
  }
  getDataPage(lazyLoad? : LazyLoadEvent) {
    this.loading = true;
    this._personService.getAll(
      this.keyword ,
      lazyLoad ? lazyLoad.first : this.table.first ,
      lazyLoad ? lazyLoad.rows : this.table.rows,
    ).pipe(finalize(() => {this.loading = false;})).subscribe(result => {
      this.person = result.items ;
      this.totalCount = result.totalCount ;
      console.log(53 , this.person);

    });

  }
  private _showCreateOrEdit(id?: number, isView = false): void {
    // copy
    let createOrEditUserDialog: BsModalRef;
    createOrEditUserDialog = this._modalService.show(
      CreateOrEditComponent,
      {
        class: 'modal-xl',
        ignoreBackdropClick: true,
        initialState: {
          id,
          isView,
        },
      }
    );


  }
  createPerson(id?: number){
    this._showCreateOrEdit(id);
  }

  onSubmit() {

  }



}


