import { UserEntity } from '@libs/modules/database/entities/user/userEntity.interface';

export interface UserInfoEntity {
  userId: number;
  field?: Field;
  provider?: Provider;
  imageUrl?: string;

  User: UserEntity;
}

export const Field = {
  DEVELOPMENT: 'DEVELOPMENT', // 개발
  MANAGEMENT: 'MANAGEMENT', // 경영
  MARKETING: 'MARKETING', // 마케팅
  ADVERTISING: 'ADVERTISING', // 광고
  DESIGN: 'DESIGN', // 디자인
  SALES: 'SALES', // 영업
  CUSTOMER_SERVICE: 'CUSTOMER_SERVICE', // 고객 서비스
  RETAIL: 'RETAIL', // 리테일
  GAME_PRODUCTION: 'GAME_PRODUCTION', // 게임 제작
  MEDIA: 'MEDIA', // 미디어
  HUMAN_RESOURCE: 'HUMAN_RESOURCE', // 인사
  ENGINEERING: 'ENGINEERING', // 엔지니어링 & 설계
  FINANCE: 'FINANCE', // 금융
  MANUFACTURING: 'MANUFACTURING', // 제조 & 생산
  MEDICAL: 'MEDICAL', // 의료
  BIO: 'BIO', // 바이오
  LOGISTICS: 'LOGISTICS', // 물류
  TRADE: 'TRADE', // 무역
  EDUCATION: 'EDUCATION', // 교육
  LAW: 'LAW', // 법률
  CONSTRUCTION: 'CONSTRUCTION', // 건설
  PUBLIC_WELFARE: 'PUBLIC_WELFARE', // 공공 & 복지
} as const;

export type Field = (typeof Field)[keyof typeof Field];

export const Provider = {
  GOOGLE: 'GOOGLE', // 구글 로그인
  APPLE: 'APPLE', // 애플 로그인
  KAKAO: 'KAKAO', // 카카오 로그인
} as const;

export type Provider = (typeof Provider)[keyof typeof Provider];
