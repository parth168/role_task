import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { User } from './user'


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(
    private http: HttpClient
  ) { }
 
  /**
   * @description
   * get users by logged user role from databse.
   * 
   * @param token Jwt-Token of logged user.
   * @param page  Current page of pagination.
   * @param serchBy Search key want to get user by name or email or role.
   * @param sort take name of sorting parameter like sort by name or sort by email or sort by role.
   * @param order order of sorting ascending or descending.
   */
  getAll(token:string,page:number,serchBy:string,sort:string,order:any) {
    let headers = new HttpHeaders();
    headers = headers.set('auth_token', token);
    return this.http.get(`http://localhost:8001/user/details?page=${page}&search=${serchBy}&sort=${sort}&order=${order}`, { headers: headers });
  }

  /**
   * @description
   * Registration Request to backend.
   * 
   * @param user form value of registartion field.
   */
  register(user: User) {
    return this.http.post(`http://localhost:8001/user/register`, user);
  }

  /**
   * @description
   * Login Request to backend.
   * 
   * @param user Login form value id and password.
   */
  login(user: User) {
    return this.http.post(`http://localhost:8001/user/login`, user);
  }


  /**
   * @description
   * Soft delete of user request to backend.
   * 
   * @param _id  User unique ID in database to identif.
   */
  toggleStatus(_id:string) {
    let headers = new HttpHeaders();
    const token = window.localStorage.getItem('token');
    headers = headers.set('auth_token', token);
    return this.http.patch(`http://localhost:8001/user/toggleStatus/${_id}`, {}, { headers: headers });
  }

  /**
   * @description
   * Get user detail by perticular id request to backend.
   *  
   * @param _id  User unique ID in database to identify.
   */
  getById(_id:string) {
    let headers = new HttpHeaders();
    const token = window.localStorage.getItem('token');
    headers = headers.set('auth_token', token);
    return this.http.get(`http://localhost:8001/user/details/${_id}`, { headers: headers });
  }

  /**
   * @description
   * Update user Detail Request to backend.
   * 
   * @param _id  User unique ID in database to identify.
   * @param data New details of user need to update in database.
   */
  update(_id:string, data: User) {
    let headers = new HttpHeaders();
    const token = window.localStorage.getItem('token');
    headers = headers.set('auth_token', token);
    return this.http.put(`http://localhost:8001/user/updateUser/${_id}`, data, { headers: headers });
  }

  /**
   * @description
   * Logout Request to backend for storing token in database has used. 
   */
  logout() {
    let headers = new HttpHeaders();
    const token = window.localStorage.getItem('token');
    headers = headers.set('auth_token', token);
    return this.http.post(`http://localhost:8001/user/logout`, {}, { headers: headers });
  }

  /**
   * @description
   * Forgot password Request to backend send link in mail to change password
   * 
   * @param email Email of user.
   */
  forgotPassword(email: String) {
    return this.http.get(`http://localhost:8001/user/forgotPassword/${email}`);
  }

  /**
   * @description
   * Change password request to backend.
   * 
   * @param _id User unique ID in database to identify.
   * @param password New password.
   */
  changePassword(_id: String, password: String) {
    return this.http.put(`http://localhost:8001/user/changePassword/${_id}`, { password: password });
  }

  /**
   * @description
   * Image uploading request to third party database.
   * 
   * @param files Image.
   */
  uploadImage(files) {
    let formData = new FormData()
    formData.append('file', files)
    return this.http.post(`http://3.18.139.243:8808/codezeros/uploadFile/common`, formData);
  }
}
