import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { GetById,GetAll,ToggleStatus } from '../response';
import { HttpErrorResponse } from '@angular/common/http';
import { Router,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  data = [];
  userLogged:boolean = true;
  constructor(
    private userService : UserServiceService,
    private toastr: ToastrService,
    private route : ActivatedRoute
  ) { }
  
  userRole:string;
  UserId:string;
  userImage:string;
  blockCreateNewUser = false;
  blockAction = false;
  totalUser:number;
  totalPage:any;
  totalPageArray:any;
  currentPage:number;
  token:string;
  ngOnInit(): void {
    this.token = window.localStorage.getItem('token');
    this.UserId = window.localStorage.getItem('_id')
    this.userService.getById(this.UserId)
    .subscribe(
        (data: GetById) => {
          if(data.code === 200) {
            this.userRole = data.data.role;
            this.userImage = data.data.image;
            if(this.userRole == 'MALE' || this.userRole == 'FEMALE'){
              this.blockCreateNewUser = true;
              this.blockAction = true;
            }
            this.currentPage = this.route.snapshot.params['page'] || 1;
            this.userService.getAll(this.token,this.currentPage,this.search,'','')
            .subscribe(
                (data: GetAll) => {
                    if(data.code === 200) {
                      this.totalUser = data.count;
                      this.totalPage = this.totalUser/5;
                      if(this.totalPage > parseInt(this.totalPage))
                      {
                        this.totalPage = parseInt(this.totalPage)+1;
                      }
                      this.totalPageArray = new Array(this.totalPage);
                      this.data = data.data;
                    }else {
                      this.toastr.error(data.message);
                    }
                },
                (error: HttpErrorResponse) => {
                  this.toastr.error(error.error.message);
                });

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
   * Soft delete user by id.
   * 
   * @param _id User unique ID to identify.
   */
  toggleStatus(_id:string){
    this.userService.toggleStatus(_id)
    .subscribe(
        (data: ToggleStatus) => {
            if(data.code === 200) {
              for ( let i in this.data){
                if(this.data[i]._id == _id){
                  this.data[i].status = !this.data[i].status;
                }
              }
            }else {
              this.toastr.error(data.message);
            }
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error.message);
    });
  }
  orderName:number = 1;
  sort:string;

  /**
   * @description
   * Sort users in ascending or descending order by Name.
   */
  sortByName(){
    this.sort = 'name';
    this.userService.getAll(this.token,this.currentPage,this.search,this.sort,this.orderName)
    .subscribe(
        (data: GetAll) => {
            if(data.code === 200) {
              this.totalUser = data.count;
              this.totalPage = this.totalUser/5;
              if(this.totalPage > parseInt(this.totalPage))
              {
                this.totalPage = parseInt(this.totalPage)+1;
              }
              this.totalPageArray = new Array(this.totalPage);
              this.data = data.data;

              if(this.orderName == 1){
                this.orderName = -1;
              }
              else{
                this.orderName = 1;
              }

            }else {
              this.toastr.error(data.message);
            }
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error.message);
        });
  }
  orderEmail:number = 1;

  /**
   * @description
   * Sort users in ascending or descending order by Email.
   */
  sortByEmail(){
    this.sort = 'email';
    this.userService.getAll(this.token,this.currentPage,this.search,this.sort,this.orderEmail)
    .subscribe(
        (data: GetAll) => {
            if(data.code === 200) {
              this.totalUser = data.count;
              this.totalPage = this.totalUser/5;
              if(this.totalPage > parseInt(this.totalPage))
              {
                this.totalPage = parseInt(this.totalPage)+1;
              }
              this.totalPageArray = new Array(this.totalPage);
              this.data = data.data;

              if(this.orderEmail == 1){
                this.orderEmail = -1;
              }
              else{
                this.orderEmail = 1;
              }

            }else {
              this.toastr.error(data.message);
            }
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error.message);
        });
  }

  orderRole:number = 1;

  /**
   * @description
   * Sort users in ascending or descending order by Role.
   */
  sortByRole(){
    this.sort = 'role';
    this.userService.getAll(this.token,this.currentPage,this.search,this.sort,this.orderRole)
    .subscribe(
        (data: GetAll) => {
            if(data.code === 200) {
              this.totalUser = data.count;
              this.totalPage = this.totalUser/5;
              if(this.totalPage > parseInt(this.totalPage))
              {
                this.totalPage = parseInt(this.totalPage)+1;
              }
              this.totalPageArray = new Array(this.totalPage);
              this.data = data.data;

              if(this.orderRole == 1){
                this.orderRole = -1;
              }
              else{
                this.orderRole = 1;
              }

            }else {
              this.toastr.error(data.message);
            }
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error.message);
        });
  }

  search:string = '';
  /**
   * @description
   * Search users by Name or Email or Role.
   */
  searchByInput(){
    this.currentPage = 1;
    this.userService.getAll(this.token,this.currentPage,this.search,this.sort,'')
    .subscribe(
        (data: GetAll) => {
            if(data.code === 200) {
              this.totalUser = data.count;
              this.totalPage = this.totalUser/5;
              if(this.totalPage > parseInt(this.totalPage))
              {
                this.totalPage = parseInt(this.totalPage)+1;
              }
              this.totalPageArray = new Array(this.totalPage);
              this.data = data.data;
            }else {
              this.toastr.error(data.message);
            }
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error.message);
        });
  }

  /**
   * @description
   * Ger users by pagination.
   * 
   * @param currentPage Current page of pagination.
   */
  changepage(currentPage:number){
    this.currentPage =  currentPage;
    this.userService.getAll(this.token,this.currentPage,this.search,'','')
    .subscribe(
        (data: GetAll) => {
            if(data.code === 200) {
              this.totalUser = data.count;
              this.totalPage = this.totalUser/5;
              if(this.totalPage > parseInt(this.totalPage))
              {
                this.totalPage = parseInt(this.totalPage)+1;
              }
              this.totalPageArray = new Array(this.totalPage);
              this.data = data.data;
            }else {
              this.toastr.error(data.message);
            }
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error.message);
        });
  }
}
