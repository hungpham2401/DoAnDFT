import { PersonDto, PersonForView } from "./../../../../shared/service-proxies/service-proxies";
import { HttpClient } from "@angular/common/http";
import { Component, Injector, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { AppComponentBase } from "@shared/app-component-base";
import { PersonServiceProxy } from "@shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import { Table } from "primeng/table";
import { finalize } from "rxjs/internal/operators/finalize";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CreateOrEditComponent } from "./create-or-edit/create-or-edit.component";
import { EditUserComponent } from "./edit-user/edit-user.component";

@Component({
  selector: "app-test2",
  templateUrl: "./test2.component.html",
  styleUrls: ["./test2.component.scss"],
  animations: [appModuleAnimation()],
})
export class Test2Component extends AppComponentBase implements OnInit {
  @ViewChild("dt") table: Table;
  keyword = "";
  Name = "";
  FullName = "";
  Email = "";
  loading = true;
  form: FormGroup;
  users : PersonDto[] = [] ;
  person: PersonForView[] = [];
  totalCount = 0;
  isRoleActive : boolean ;
  isView : boolean ;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _personService: PersonServiceProxy,
    public http: HttpClient
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.KhoiTaoForm();

  }
  KhoiTaoForm() {
    this.form = new FormGroup({
      TextInput1: new FormControl(),
      TextInput2: new FormControl(),
    });
  }
  getDataPage(lazyLoad?: LazyLoadEvent) {
    this.loading = true;
    this._personService
      .getAll(
        this.keyword,
        lazyLoad ? lazyLoad.first : this.table.first,
        lazyLoad ? lazyLoad.rows : this.table.rows
      )
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((result) => {
        this.person = result.items;
        this.totalCount = result.totalCount;
        console.log(53, this.person);
      });
  }

  viewUser(user: PersonDto): void {
    this.showCreateOrEditUserDialog(user.id , true);
    console.log(75 , user.name);
  }
  createPerson(id?: number) {
    this.showCreateOrEditUserDialog(id);

  }
  editUser(user: PersonDto): void {
    this.showCreateOrEditUserDialog(user.id);
    console.log(user.id);

  }

  //xóa
  protected delete(user: PersonDto): void {
      console.log(87, user.id);

      this.swal.fire({
        title: 'Bạn chắc chắn không?',
        text: 'Người dùng ' + user.name + ' sẽ bị xóa.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: this.confirmButtonColor,
        cancelButtonColor: this.cancelButtonColor,
        cancelButtonText: this.cancelButtonText,
        confirmButtonText: this.confirmButtonText
      }).then((result) => {
        if (result.value) {
          console.log(99, result.value);
          this._personService.delete(user.id).subscribe(() => {
            console.log(user.id);
            this.showDeleteMessage();
            this.getDataPage();
          });
        }
      });

  }

  private showCreateOrEditUserDialog(id?: number, isView = false, isRoleActive = false): void {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
        CreateOrEditComponent,
        {
          class: 'modal-xl',
        }
      );
    } else {
      createOrEditUserDialog = this._modalService.show(
        EditUserComponent,
        {
          class: 'modal-xl',
          initialState: {
            id: id,
            isView,
            isRoleActive
          },
        }
      );
    }
    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.getDataPage();
    });
  }
}
