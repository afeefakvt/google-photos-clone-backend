import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService:UsersService,
        private jwtService:JwtService
    ){}

    async register(email:string,name:string,password:string){
        return this.usersService.create(email,name,password);
    }
    async login(user:any){
        const payload = {email:user.email,sub:user._id};
        return{
            access_token : this.jwtService.sign(payload)
        }
    }
    async validateUser(email:string,password:string){
        return this.usersService.validateUser(email,password)
    }
}
