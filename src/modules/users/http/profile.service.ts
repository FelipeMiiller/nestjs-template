import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../domain/models/profile.model';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { User } from '../domain/models/users.model';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateProfileDto) {
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');
    const profile = this.profileRepository.create({ ...dto, user });
    return this.profileRepository.save(profile);
  }

  async findOne(id: string) {
    const profile = await this.profileRepository.findOne({ where: { id }, relations: ['user'] });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async update(id: string, dto: UpdateProfileDto) {
    const profile = await this.profileRepository.findOneBy({ id });
    if (!profile) throw new NotFoundException('Profile not found');
    Object.assign(profile, dto);
    return this.profileRepository.save(profile);
  }

  async remove(id: string) {
    const profile = await this.profileRepository.findOneBy({ id });
    if (!profile) throw new NotFoundException('Profile not found');
    await this.profileRepository.remove(profile);
    return { deleted: true };
  }
}
