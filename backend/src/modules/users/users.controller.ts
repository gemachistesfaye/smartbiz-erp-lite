import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from './dto/user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get all users in business' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  async findAll(@CurrentUser() user: { businessId: string }) {
    return this.usersService.findByBusinessId(user.businessId);
  }

  @Get(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Return user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: { businessId: string }) {
    const user = await this.usersService.findById(id);
    if (user.businessId !== currentUser.businessId) {
      return { message: 'User not found' };
    }
    return user;
  }

  @Post()
  @Roles('OWNER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() createUserDto: CreateUserDto, @CurrentUser() user: { businessId: string }) {
    return this.usersService.create({
      ...createUserDto,
      businessId: user.businessId,
    });
  }

  @Put(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: { businessId: string },
  ) {
    return this.usersService.update(id, currentUser.businessId, updateUserDto);
  }

  @Put(':id/change-password')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed' })
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() currentUser: { id: string },
  ) {
    if (id !== currentUser.id) {
      return { message: 'Can only change your own password' };
    }
    return this.usersService.changePassword(
      id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @Put(':id/deactivate')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Deactivate user' })
  @ApiResponse({ status: 200, description: 'User deactivated' })
  async deactivate(@Param('id') id: string, @CurrentUser() user: { businessId: string }) {
    return this.usersService.deactivate(id, user.businessId);
  }

  @Put(':id/activate')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Activate user' })
  @ApiResponse({ status: 200, description: 'User activated' })
  async activate(@Param('id') id: string, @CurrentUser() user: { businessId: string }) {
    return this.usersService.activate(id, user.businessId);
  }

  @Delete(':id')
  @Roles('OWNER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 403, description: 'Cannot delete owner' })
  async remove(@Param('id') id: string, @CurrentUser() user: { businessId: string }) {
    return this.usersService.remove(id, user.businessId);
  }
}
