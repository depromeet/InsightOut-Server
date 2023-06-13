export const GetStarFromExperienceResponseDescriptionMd = `
### ✅ 경험카드 S, T, A, R 조회에 성공했습니다.

자기소개서 작성 페이지에서 경험 카드를 눌렀을 때, 오른쪽 분할 화면에 출력될 S, T, A, R 데이터입니다.
`;

export const GetStarFromExperienceSummaryMd = `
경험카드 S, T, A, R 조회 API
`;

export const GetStarFromExperienceDescriptionMd = `
# 경험카드 S, T, A, R 조회 API

## Description

경험카드의 S, T, A, R을 조회합니다.\n

S, T, A, R은 각각 **100자**로 총 **400자**의 페이로드를 가집니다.\n

해당 API가 사용되는 위치는 **자기소개서 작성 페이지**에서의 경험 카드에 대한 컴포넌트입니다.\n
request URI에서 **experienceId**를 path parameter로 입력해주세요.\n

서버에서는 path parameter에 있는 **experienceId**를 통해서 DB에 있는 경험 카드의 **S**, **T**, **A**, **R**을 가져옵니다.\n

## Picture

<img width="568" alt="image" src="https://github.com/depromeet/InsightOut-Server/assets/83271772/5482f97f-2257-4d2a-8537-a1be7dd95a58">

## Figma

⛳️ [자기소개서 작성 첫화면](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1221-8169&t=40PA9IdsKSnKAGBa-4)
`;
