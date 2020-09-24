import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global'

@Injectable()
export class UserService{
    public url: string;
    constructor (public http: HttpClient){
        this.url = GLOBAL.url;
    }

    singup(){
        return 'hola mundo desde el servicio';
    }
}
