import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLogin } from 'src/dto/CreateLogin.dto';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import { UpdateUserDto } from 'src/dto/UpdateUser.dto';
import { User } from 'src/schemas/User.schema';
import { UserSettings } from 'src/schemas/UserSettings.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name)
    private userSettingModel: Model<UserSettings>,
  ) {}

  async createUser({ settings, ...createUserDto }: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new HttpException(
        'Email already registered',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (settings) {
      const newSettings = new this.userSettingModel(settings);
      const savedNewSettings = await newSettings.save();
      const newUser = new this.userModel({
        ...createUserDto,
        settings: savedNewSettings._id,
      });
      return await newUser.save();
    }
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async login(userDto: CreateLogin) {
    const user = await this.userModel
      .findOne({ email: userDto.email })
      .select('+password');
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const isPasswordValid = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return {
      user,
      token: this.generateToken(user),
    };
  }
  getUsers() {
    return this.userModel.find().populate(['settings', 'posts']);
  }

  getUserById(id: string) {
    return this.userModel.findById(id).populate(['settings', 'posts']);
  }
  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }
  deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  generateToken(user: User) {
    return jwt.sign({ email: user.email }, '123456', {
      expiresIn: '5h',
    });
  }

  buildUserResponse(user: User) {
    return {
      name: user.name,
      email: user.email,
      token: this.generateToken(user),
    };
  }

  // pagination
  // async paginate(page = 1, limit = 10) {
  //   const users = await this.userModel
  //     .find()
  //     .limit(limit * 1)
  //     .skip((page - 1) * limit)
  //     .exec();
  //   const count = await this.userModel.countDocuments();
  //   return {
  //     users,
  //     totalPages: Math.ceil(count / limit),
  //     currentPage: page,
  //   };
  // }
  async pagination(page: number = 1, limit: number = 10): Promise<User[]> {
    const skip = (page - 1) * limit;
    return this.userModel.find().skip(skip).limit(limit).exec();
  }
  async sortData(field: string) {
    try {
      const users = await this.userModel.find().sort(field);
      return users;
    } catch (error) {
      throw new Error('Failed to sort users.');
    }
  }
  async searchUsers(query: string) {
    try {
      const users = await this.userModel.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          // Add more fields to search here if needed
        ],
      });
      return users;
    } catch (error) {
      throw new Error('Failed to search users.');
    }
  }
  async filterUsers(filters: any) {
    try {
      const users = await this.userModel.find(filters);
      return users;
    } catch (error) {
      throw new Error('Failed to filter users.');
    }
  }
  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
}
