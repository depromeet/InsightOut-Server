import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Question, Resume } from '@prisma/client';
import { DatabaseModule } from '📚libs/modules/database/database.module';
import { ResumeRepository } from '📚libs/modules/database/repositories/resume.repository';
import { GetOneResumeResponseDto, GetOneResumeWithTitleResponseDto } from '\uD83D\uDD25apps/server/resumes/dtos/resumes/getResume.dto';
import { ResumesService } from '🔥apps/server/resumes/services/resumes.service';

const mockCreatedAt = new Date();
const mockUpdatedAt = new Date();

const mockAllResumeData: (Resume & { Question: Omit<Question, 'resumeId' | 'answer'>[] })[] = [
  {
    id: 1,
    title: '새 자기소개서',
    createdAt: mockCreatedAt,
    updatedAt: mockUpdatedAt,
    userId: 1,
    Question: [
      {
        id: 1,
        title: '',
        createdAt: mockCreatedAt,
        updatedAt: mockUpdatedAt,
      },
    ],
  },
];

const mockAllResumeDataWithAnswer: (Resume & { Question: Omit<Question, 'resumeId'>[] })[] = [
  {
    id: 1,
    title: '새 자기소개서',
    createdAt: mockCreatedAt,
    updatedAt: mockUpdatedAt,
    userId: 1,
    Question: [
      {
        id: 1,
        title: '',
        answer: '',
        createdAt: mockCreatedAt,
        updatedAt: mockUpdatedAt,
      },
    ],
  },
];

const mockAllTitleOfResumes: { id: number; title: string; createdAt: Date; updatedAt: Date }[] = [
  {
    id: 1,
    title: '자기소개서1',
    createdAt: mockCreatedAt,
    updatedAt: mockUpdatedAt,
  },
];

describe('Resume Service', () => {
  let service: ResumesService;
  let repository: ResumeRepository;
  let mockResumeRepository: Partial<ResumeRepository>;

  // 각각 테스트 수행 이전
  beforeEach(async () => {
    mockResumeRepository = {
      findMany: jest.fn().mockReturnValue(mockAllResumeData),
      findFirst: ((query: any) =>
        mockAllResumeData.find((resume) => resume.id === query.where.id && resume.userId === query.where.userId)) as any,
    };

    // 테스팅 모듈 생성
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        ResumesService,
        {
          provide: ResumeRepository,
          useValue: mockResumeRepository,
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

  /*************************
   ********** Get **********
   *************************/
  describe('get all resumes', () => {
    it('should get all resumes', async () => {
      const resumes = await service.getAllResumes(1, { answer: false });

      const mockResumesReponseDto = mockAllResumeData.map(
        (resume) => new GetOneResumeResponseDto(resume as Resume & { Question: Question[] }),
      );

      // 서비스 레이어의 결과 객체가 같은지 깊게 비교
      expect(resumes).toStrictEqual(mockResumesReponseDto);
    });

    it('should get all resumes with answer', async () => {
      mockResumeRepository.findMany = jest.fn().mockResolvedValue(mockAllResumeDataWithAnswer);
      const resumes = await service.getAllResumes(1, { answer: true });

      const mockResumesReponseDto = mockAllResumeDataWithAnswer.map(
        (resume) => new GetOneResumeResponseDto(resume as Resume & { Question: Question[] }),
      );

      // 서비스 레이어의 결과 객체가 같은지 깊게 비교
      expect(resumes).toStrictEqual(mockResumesReponseDto);
    });

    it('should not find any raw', async () => {
      mockResumeRepository.findMany = jest.fn().mockResolvedValue([]);

      // 존재하지 않는 유저로 쿼리 진행
      const resumes = await service.getAllResumes(2, { answer: true });
      const resuemsWithAnswer = await service.getAllResumes(2, { answer: true });

      // 값을 찾지 못해야 한다.
      expect(resumes).toStrictEqual([]);
      expect(resuemsWithAnswer).toStrictEqual([]);
    });

    it('should get all title of resumes', async () => {
      mockResumeRepository.findMany = jest.fn().mockResolvedValue(mockAllTitleOfResumes);

      const resumeTitleWithResumeId = await service.getAllResumesTitle(1);

      const mockResumes = mockAllTitleOfResumes.map((resume) => new GetOneResumeWithTitleResponseDto(resume as Resume));

      expect(resumeTitleWithResumeId).toStrictEqual(mockResumes);
    });

    it('should get no title of resumes data', async () => {
      mockResumeRepository.findMany = jest.fn().mockResolvedValue([]);

      const resumeTitleWithResumeId = await service.getAllResumesTitle(987654321);

      expect(resumeTitleWithResumeId).toStrictEqual([]);
    });

    it('should get one resume', async () => {
      const resume = await service.getOneResume(1, 1);

      const mockOneResume = new GetOneResumeResponseDto(mockAllResumeData[0] as Resume & { Question: Question[] });

      expect(resume).toBeDefined();
      expect(resume).toStrictEqual(mockOneResume);
    });

    it('throw if resume not found', async () => {
      expect(service.getOneResume(987654321, 123456789)).rejects.toThrow(NotFoundException);
    });
  });
});
