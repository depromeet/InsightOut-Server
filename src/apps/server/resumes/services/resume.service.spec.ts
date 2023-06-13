import { Test, TestingModule } from '@nestjs/testing';
import { Question, Resume } from '@prisma/client';
import { DatabaseModule } from '📚libs/modules/database/database.module';
import { ResumeRepository } from '📚libs/modules/database/repositories/resume.repository';
import { GetOneResumeResponseDto } from '🔥apps/server/resumes/dtos/resumes/get-resume.dto';
import { ResumesService } from '🔥apps/server/resumes/services/resumes.service';

const mockCreatedAt = new Date();
const mockUpdatedAt = new Date();

const mockAllResumeData: (Resume & { Question: Question[] })[] = [
  {
    id: 1,
    title: '새 자기소개서',
    createdAt: mockCreatedAt,
    updatedAt: mockUpdatedAt,
    userId: 1,
    Question: [
      {
        id: 1,
        resumeId: 1,
        title: '',
        answer: '',
        createdAt: mockCreatedAt,
        updatedAt: mockUpdatedAt,
      },
    ],
  },
];

describe('Resume Service', () => {
  let service: ResumesService;
  let repository: ResumeRepository;

  // 각각 테스트 수행 이전
  beforeEach(async () => {
    // 테스팅 모듈 생성
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        ResumesService,
        {
          provide: ResumeRepository,
          useValue: {
            findMany: jest.fn().mockReturnValue(mockAllResumeData),
          },
        },
      ],
    }).compile();

    service = module.get<ResumesService>(ResumesService);
    repository = module.get<ResumeRepository>(ResumeRepository);
  });

  // service가 정의되었는지 확인
  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  // repository가 정의되었는지 확인
  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('get all resumes', () => {
    it('should get all resumes', async () => {
      const resumes = await service.getAllResumes(1, { answer: false });

      const mockResumesReponseDto = mockAllResumeData.map((resume) => new GetOneResumeResponseDto(resume));

      // 서비스 레이어의 결과 객체가 같은지 깊게 비교
      expect(resumes).toStrictEqual(mockResumesReponseDto);
    });

    it('should get all resumes with answer', async () => {
      const resumes = await service.getAllResumes(1, { answer: true });

      const mockResumesReponseDto = mockAllResumeData.map((resume) => new GetOneResumeResponseDto(resume));

      // 서비스 레이어의 결과 객체가 같은지 깊게 비교
      expect(resumes).toStrictEqual(mockResumesReponseDto);
    });
  });
});
