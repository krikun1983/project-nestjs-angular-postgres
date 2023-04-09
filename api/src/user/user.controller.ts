import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { UserService } from './user.service';
import { IUser } from './models/user.interface';
import { Observable } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() user: IUser): Observable<IUser> {
    return this.userService.createUser(user);
  }

  @Get(':id')
  findUser(@Param('id') id: string): Observable<IUser> {
    return this.userService.findUser(Number(id));
  }

  @Get()
  findUserAll(): Observable<IUser[]> {
    return this.userService.findUserAll();
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() user: IUser): Observable<any> {
    return this.userService.updateUser(Number(id), user);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<any> {
    return this.userService.deleteOne(Number(id));
  }
}
