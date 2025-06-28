import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel:Model<UserDocument>){}

    async create(email:string,name:string,password:string):Promise<User>{
        const hashedPassword = await bcrypt.hash(password,10)
        return this.userModel.create({email,name,password:hashedPassword})
    }

    async findByEmail(email:string):Promise<User | null>{
        return this.userModel.findOne({email})
    }

    async validateUser(email:string,password:string):Promise<User | null>{
        const user = await this.findByEmail(email);
        if(user && await bcrypt.compare(password,user.password)){
            return user;
        }
        return null;
    }
}
