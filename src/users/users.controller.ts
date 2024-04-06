import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import mongoose from 'mongoose';
import { UpdateUserDto } from 'src/dto/UpdateUser.dto';
import { CreateLogin } from 'src/dto/CreateLogin.dto';
import { ExpressRequest } from 'src/middleware/auth.middleware';
import { AuthGaurd } from 'src/guards/auth.guard';
import { RoleGaurd } from 'src/guards/role.guard';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createDtoUser: CreateUserDto) {
    return this.userService.createUser(createDtoUser);
  }

  // login
  @Post('/login')
  @UsePipes(new ValidationPipe())
  login(@Body() createDtoLogin: CreateLogin) {
    return this.userService.login(createDtoLogin);
  }

  @Get()
  @UseGuards(RoleGaurd)
  @Roles(['user'])
  getUsers(@Request() request: ExpressRequest) {
    if (!request.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.userService.getUsers();
  }

  @Get('pages')
  pagination(@Query('page') page: number, @Query('limit') limit: number) {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Invalid pagination parameters');
    }
    return this.userService.pagination(page, limit);
  }

  @Get('sort')
  async sortData(@Query('field') field: string) {
    return this.userService.sortData(field);
  }
  @Get('search')
  searchUsers(@Query('query') query: string) {
    return this.userService.searchUsers(query);
  }
  @Get('filter')
  filterUsers(@Query() filters: any) {
    return this.userService.filterUsers(filters);
  }
  // current user
  @Get('/current')
  async readCurrentUser(@Request() request: ExpressRequest) {
    if (!request.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.userService.buildUserResponse(request.user);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }
    const findUser = await this.userService.getUserById(id);
    if (!findUser) {
      throw new HttpException(
        'User not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return findUser;
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }
    const findUser = await this.userService.getUserById(id);
    if (!findUser) {
      throw new HttpException(
        'User not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }
    const findUser = await this.userService.getUserById(id);
    if (!findUser) {
      throw new HttpException(
        'User not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return this.userService.deleteUser(id);
  }
}
