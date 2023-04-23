import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { Pagination } from 'nestjs-typeorm-paginate';

import { UserService } from './user.service';
import { IUser, UserRole } from './models/user.interface';
import { hasRoles } from '../auth/decorator/role.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() user: IUser): Observable<IUser | object> {
    return this.userService.createUser(user).pipe(
      map((user: IUser) => user),
      catchError((err) => of({ error: err.message }))
    );
  }

  @Post('login')
  login(@Body() user: IUser): Observable<object> {
    return this.userService.login(user).pipe(map((token: string) => ({ access_token: token })));
  }

  @Get(':id')
  findUser(@Param('id') id: string): Observable<IUser> {
    return this.userService.findUser(Number(id));
  }

  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10
  ): Observable<Pagination<IUser>> {
    limit = limit > 100 ? 100 : limit;

    return this.userService.paginate({ page, limit, route: 'http://localhost:3000/users' });
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() user: IUser): Observable<any> {
    return this.userService.updateUser(Number(id), user);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<any> {
    return this.userService.deleteOne(Number(id));
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(@Param('id') id: string, @Body() user: IUser): Observable<IUser> {
    return this.userService.updateRoleOfUser(Number(id), user);
  }
}
