export const GetAllResumesTitleResponseDescriptionMd = `
### ✅ 자기소개서 제목 조회에 성공했습니다.
모아보기에서 자기소개서 제목을 통해 자기소개서들을 필터링합니다.
`;

export const GetAllResumesTitleSummaryMd = `자기소개서 제목 조회 API`;

export const GetAllResumesTitleDescriptionMd = `
# 자기소개서 제목 조회 API

## Description

자기소개서 **제목**을 전체 가져옵니다. 해당 API는 모아보기 페이지에서 자기소개서를 탭했을 때,
유저가 자기소개서 제목으로 자신이 작성한 자기소개서를 찾아낼 수 있도록 자기소개서 제목을 응답으로 전달합니다.

각 자기소개서 제목은 key 값으로 응답받은 id를 사용합니다.

## Picture

<img width="441" alt="image" src="https://github.com/depromeet/13th-4team-backend/assets/83271772/8d9bc56e-0840-4533-9d72-674ff9cf8172">

## Figma

⛳️ [모아보기 - 자기소개서](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1403-11728&t=BGdyU14QTHF3scSm-4)

`;

export const GetAllResumeResponseDescriptionMd = `
### ✅ 자기소개서 전체 조회에 성공했습니다.
유저가 작성한 모든 자기소개서를 반환하며, 각각의 자기소개서는 문항을 포함하고 문항의 답안은 Optional로 선택하여 가져올 수 있습니다.
자기소개서가 출력되는 기준은 모두 생성일자로부터 내림차순입니다. 자기소개서에 속한 자기소개서 문항도 마찬가지입니다.
`;

export const GetAllResumeSummaryMd = `
자기소개서 전체 조회 API (2023.6.3. Updated)
`;

export const GetAllResumeDescriptionMd = `
# 자기소개서 조회 API

## Description

자기소개서를 생성한 날짜 기준 **내림차순(최신순)**으로 조회합니다. 자기소개서 목록과 각 자기소개서 별 문항을 모두 출력합니다.
문항에 대한 답안이 payload가 크기 때문에 기본적으로 문항 제목만 조회하며, answer 쿼리스트링 값에 따라서 문항에 대한 답안도 추가적으로 가져옵니다.

- POST /resumes - 자기소개서(Resumes)와 문항들(Questions)을 가져오며, **문항의 \`답안(answer)\`은 가져오지 않습니다.**
- POST /resumes?answer=true - 자기소개서(Resumes)와 문항들(Questions)을 가져오며, **자기소개서 문항의 제목과 \`답안\`을 가져옵니다.**

## Keyword

용어가 통일되지 않아 명세합니다.
1. 자기소개서: 디프만 13기
2. 문항: 디프만 13기 지원 동기

## Picture

![image](https://github.com/depromeet/13th-4team-backend/assets/83271772/61edf279-1e15-46de-a974-561eac58b4a3)

## Figma

⛳️[자기소개서 작성 첫 화면](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1221-8169&t=bY8GHCeIQEeC8L6e-4)`;

export const GetOneResumeResponseDescriptionMd = `
### ✅ 특정 자기소개서 조회에 성공했습니다.
**한 개**의 자기소개서를 가져오며, 자기소개서에 속한 자기소개서 문항도 **생성일자 기준 내림차순**\`(최신순)\`으로 가져옵니다.
`;

export const GetOneResumeSummaryMd = `
특정 자기소개서 조회 API (2023.6.6. Updated)
`;

export const GetOneResumeDescriptionMd = `
# 자기소개서 조회 API

## Description

**userId**와 **resumeId** path parameter를 통해서 특정 자기소개서 한 개를 조회합니다. 자기소개서는 그 자기소개서에 속한 모든 문항를 가져옵니다.
자기소개서 문항은 **생성일자 기준 내림차순(최신순)으로 정렬**되어 출력됩니다. 주로 \`모아보기\`에서 사용됩니다.

## Picture

![image](https://github.com/depromeet/13th-4team-backend/assets/83271772/90712fb4-7c1e-4b8c-845e-2139dd6deca9)

## Figma

⛳️ [자기소개서 모아보기](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1403-11728&t=oMTkLrgQjXJOPb8D-4)
`;
