import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { PersonDto, PersonServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent extends AppComponentBase implements OnInit {
  saving = false;
  user = new PersonDto();
  checkedRolesMap: { [key: string]: boolean } = {};
  id: number;
  isView = false;
  @Output() onSave = new EventEmitter<any>();
  form: FormGroup;
  isRoleActive = true;
  constructor(
    injector: Injector,
    private fb: FormBuilder,
    public  _personService : PersonServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  khoiTaoForm() {
    this.form = this.fb.group({
      HoTen: ["", Validators.required],
      Name: ["", Validators.required],
      EmailAddress: ["", Validators.required],
    });
  };
  save(): void {
    //this.user.roleNames = this.getCheckedRoles();
    if (CommonComponent.getControlErr(this.form) === '') {
      this.saving = true;
      this._getValueForSave();
            this._personService
              .createOrEdit(this.user).subscribe(() => {
                this.showUpdateMessage();
                this.bsModalRef.hide();
                this.onSave.emit(this.form);
              });
    }
  }

  ngOnInit(): void {
    this.khoiTaoForm();
    this._personService.getForEdit(this.id).subscribe((result) => {
      this.user = result;
      this._setValueForEdit();
      console.log(58, this.user);

      // this._personService.getRoles().subscribe((result2) => {
      //   this.roles = result2.items;
      //   this.setInitialRolesStatus();
      // });
    });
  }
  private _getValueForSave() {
    this.user.name = this.form.controls.Name.value;
    this.user.fullName = this.form.controls.HoTen.value;
    this.user.email = this.form.controls.EmailAddress.value;
    console.log(99,this.user);
  }

  private _setValueForEdit() {
    this.form.controls.HoTen.setValue(this.user.fullName);
    this.form.controls.Name.setValue(this.user.name);
    this.form.controls.EmailAddress.setValue(this.user.email);
    if (this.isView) {
      this.form.disable();
    }
    console.log(80 , this.form);

  }
}
