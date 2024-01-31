import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { UserSignupDto } from '../dto/user.signup.dto';
import { EmailService } from 'src/email/email.service';
import { UserRepository } from '../user.repository';
import { AuthService } from 'src/auth/auth.service';
import { AwsService } from 'src/aws/aws.service';

// Given / When / Then BDD 스타일로 테스트 코드를 작성!

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let authService: AuthService;
  let awsService: AwsService;

  const mockUserService = {
    signUp: jest.fn(),
    deleteUser: jest.fn(),
    logout: jest.fn(),
    getUserAllData: jest.fn(),
    updateName: jest.fn(),
    updatePassword: jest.fn(),
    findPassword: jest.fn(),
  };

  const mockAuthService = {
    login: jest.fn(),
    validateByRefreshToken: jest.fn(),
  };

  const mockAwsService = {
    uploadFileToS3: jest.fn(),
    getAwsS3FileUrl: jest.fn(),
    deleteS3Object: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: AwsService, useValue: mockAwsService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    awsService = module.get<AwsService>(AwsService);
  });

  describe('signUp', () => {
    it('회원 가입', async () => {
      //given
      const userSignupDto: UserSignupDto = {
        email: 'email1234@email.com',
        name: 'minsu',
        password: 'qwer1234',
      };

      //when
      const signUpSpy = jest.spyOn(userService, 'signUp');
      await controller.signUp(userSignupDto);

      //then
      expect(signUpSpy).toBeCalledWith(userSignupDto);
    });
  });
});
