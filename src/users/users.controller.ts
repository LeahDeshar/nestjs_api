import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import mongoose from 'mongoose';
import { UpdateUserDto } from 'src/dto/UpdateUser.dto';
import { CreateLogin } from 'src/dto/CreateLogin.dto';

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
  getUsers() {
    return this.userService.getUsers();
  }
  // current user
  @Get('/current')
  readCurrentUser(@Param('id', new ValidationPipe()) id: string) {
    // return this.userService.readCurrentUser(id);
    return '';
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
