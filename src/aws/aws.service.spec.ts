import { Test, TestingModule } from '@nestjs/testing';
import { AwsService } from './aws.service';
import { ConfigService } from '@nestjs/config';

//configService get 부분 함수 mock 구현해야함
const mockConfigService = {
  uploadFileToS3: jest.fn(),
};

describe('AwsService', () => {
  let service: AwsService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AwsService>(AwsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
