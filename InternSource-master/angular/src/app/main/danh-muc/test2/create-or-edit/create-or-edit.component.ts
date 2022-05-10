import { HttpClient } from "@angular/common/http";
import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppComponentBase } from "@shared/app-component-base";
import { CommonComponent } from "@shared/dft/components/common.component";
import {
  CreateUserDto,
  DemoCreateInput,
  PersonServiceProxy,
  RoleDto,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-create-or-edit",
  templateUrl: "./create-or-edit.component.html",
  styleUrls: ["./create-or-edit.component.scss"],
})
export class CreateOrEditComponent extends AppComponentBase implements OnInit {
  saving = false;
  user = new CreateUserDto();
  roles: RoleDto[] = [];
  checkedRolesMap: { [key: string]: boolean } = {};
  defaultRoleCheckedStatus = false;

  @Output() onSave = new EventEmitter<any>();
  form: FormGroup;

  constructor(
    injector: Injector,
    private fb: FormBuilder,
    public _personService: PersonServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.khoiTaoForm();
    this.user.isActive = true;

  }

  khoiTaoForm() {
    this.form = this.fb.group({
      HoTen: ['', Validators.required],
      Name: ['', Validators.required],
      EmailAdress: ['', Validators.required],
      TenDangNhap: ['', Validators.required],

    });

  }

  // setInitialRolesStatus(): void {
  //   _.map(this.roles, (item) => {
  //     this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
  //     );
  //   });
  // }

  // isRoleChecked(): boolean {
  //   // just return default role checked status
  //   // it's better to use a setting
  //   return this.defaultRoleCheckedStatus;
  // }

  // onRoleChange(role: RoleDto, $event) {
  //   this.checkedRolesMap[role.normalizedName] = $event.target.checked;
  // }

  // getCheckedRoles(): string[] {
  //   const roles: string[] = [];
  //   _.forEach(this.checkedRolesMap, function (value, key) {
  //     if (value) {
  //       roles.push(key);
  //     }
  //   });
  //   return roles;
  // }

  save(): void {
    // this.user.roleNames = this.getCheckedRoles();
    if (CommonComponent.getControlErr(this.form) === '') {
      this.saving = true;
      this._getValueForSave();
      if (this.user.userName.toLocaleLowerCase() === 'admin') {
        this.showSwalAlertMessage('Admin không được trùng!', 'error');
        this.saving = false;
      } else {
        this._personService.checkExist(this.user.userName, this.user.emailAddress, 0).subscribe((res) => {
          switch (res) {
            case 0: {
              this._personService
                .createOrEdit(this.user.name , this.user.emailAddress , this.user.full).subscribe(() => {
                  this.showCreateMessage();
                  this.bsModalRef.hide();
                  this.onSave.emit();
                });
              break;
            }
            case 1: {
              this.showSwalAlertMessage('Tên đăng nhập đã tồn tại!', 'error');
              this.saving = false;
              break;
            }
            case 2: {
              this.showSwalAlertMessage('Email đã tồn tại!', 'error');
              this.saving = false;
              break;
            }
            default:
              break;
          }
        });
      }
    }
  }

  private _getValueForSave() {
    this.user.name = this.form.controls.HoTen.value;
    this.user.surname = this.form.controls.HoTen.value;
    this.user.emailAddress = this.form.controls.EmailAdress.value;
    this.user.userName = this.form.controls.TenDangNhap.value;
  }
}

