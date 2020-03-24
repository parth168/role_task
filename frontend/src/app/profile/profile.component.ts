import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { GetById } from '../response';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Update,FileUpload,ToggleStatus } from '../response';
import { Router } from '@angular/router';
import { from } from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private userService : UserServiceService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }
  
  UserId:string;
  userName:string;
  userEmail:string;
  userRole:string;
  userImage:string;
  _id:string;

  //Input for navbar
  userLogged:boolean=true;
  userProfile:boolean=true;
  ngOnInit(): void {
    this.UserId = window.localStorage.getItem('_id')
    this.userService.getById(this.UserId)
    .subscribe(
        (data: GetById) => {
          if(data.code === 200) {
            this.userName = data.data.name;
            this.userEmail = data.data.email;
            this.userRole = data.data.role;
            this.userImage = data.data.image;
            this._id = data.data._id;
          }
          else{
            this.toastr.error(data.message);
            return ;
          }
        },
        (error: HttpErrorResponse) => {
            this.toastr.error(error.error.message);
            return ;
        });
  }

  /**
   * @description
   * returns perticular Form control to validate.
   */
  get f() { return this.updateForm.controls; }

  updateForm: FormGroup;
  update:boolean= false;

  /**
   * @description
   * Build Edit profile form with old details.
   */
  editProfile(){
    this.update = true;
    this.updateForm = this.formBuilder.group({
      name: [this.userName , Validators.required],
      email: [this.userEmail, Validators.required]
    });
  }

  submitButton:boolean = true;
  imageUrl:string;

    /**
   * @description
   * Upload Image on change file.
   * 
   * @param event Event instance on changing file.
   */
  uploadImage(event: { target: { files: any[]; }; }){
    this.submitButton = false;
    this.toastr.warning("Wait for Image processing");
    this.userService.uploadImage(event.target.files[0])
    .subscribe(
      (data: FileUpload) => {
        this.submitButton = true;
        this.imageUrl = data.url;
      },
      error=>{
        this.toastr.error(error.error.message);
      }
    );
  }

  /**
   * @description
   * Cancel update form and hide.
   */
  cancel(){
    this.update = false;
  }

  /**
   * @description
   * Soft delete of user.
   */
  delete(){
    this.userService.toggleStatus(this._id)
    .subscribe(
      (data:ToggleStatus)=>{
        if(data.code === 200){
          this.toastr.success("Deleted successfully");
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('_id');
          this.router.navigate(['']);
        }
        else{
          this.toastr.error(data.message);
          return ;
        }
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(error.error.message);
        return ;
      }
    );
  }

  loading:boolean = false;
  submitted:boolean = false;

  /**
   * @description
   * Update details on submit of form.
   */
  onSubmit(){
    let obj = this.updateForm.value;
    if(this.imageUrl){
      obj.image = this.imageUrl;
    }
    this.loading = true;
    this.submitted = true;
    this.userService.update(this._id,obj)
    .subscribe(
        (data: Update) => {
          if(data.code === 200) {
            this.update = false;
            this.submitted = false;
            this.loading = false;
            this.toastr.success("Updated successfully");
            this.userName = data.data.name;
            this.userEmail = data.data.email;
            this.userRole = data.data.role;
            this.userImage = data.data.image;
          }
          else{
            this.update = false;
            this.submitted = false;
            this.loading = false;
            this.toastr.error(data.message);
            return ;
          }
        },
        (error: HttpErrorResponse) => {
          this.update = false;
          this.submitted = false;
          this.loading = false;
          this.toastr.error(error.error.message);
          return ;
        });
    this.update = false;
  }
}
