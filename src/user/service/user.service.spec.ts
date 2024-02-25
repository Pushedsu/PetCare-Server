import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../user.repository';
import { EmailService } from 'src/email/email.service';

const mockRepository = () => {
  findAll: jest.fn();
};

const mockEmailService = {
  sendEmail: jest.fn(),
};

describe('UserService', () => {
  //let service: UserService;
  let emailService: EmailService;
  let userRepository: UserRepository;
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
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('getUserAllData', () => {
    it('회원의 모든 정보를 ', async () => {
      //given
      const returnValue = {};
      //when
      //jest.spyOn(userRepository, 'findAll').mockResolvedValue(returnValue);
      //then
    });
  });
});
