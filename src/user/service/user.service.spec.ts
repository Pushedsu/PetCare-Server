import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../user.repository';
import { EmailService } from 'src/email/email.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../user.schema';

const mockRepository = () => {
  findAll: jest.fn();
};

const mockEmailService = {
  sendEmail: jest.fn(),
};

describe('UserService', () => {
  //let service: UserService;
  let emailService: EmailService;
  let repository: UserRepository;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: EmailService, useValue: mockEmailService },
        { provide: UserRepository, useValue: mockRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    emailService = module.get<EmailService>(EmailService);
    repository = module.get<UserRepository>(UserRepository);
  });

  describe('findAll', () => {
    it('모든 값을 불러와!', async () => {
      //given
      //when
      //then
    });
  });
});
