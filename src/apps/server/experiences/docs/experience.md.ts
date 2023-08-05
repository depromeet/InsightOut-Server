export const createExperienceDescriptionMd = `
### ✅ 경험 분해 생성에 성공하였습니다.
해당 API를 사용하시면 아무 내용이 들어가 있지 않은 경험 분해를 생성한 뒤 반환합니다.\n
최초 상태는 \`INPROGRESS\`입니다.
`;

export const createExperienceSummaryMd = '🔵 경험 정보 생성 API';
export const createExperienceSuccessMd = '✅ 경험 정보 생성에 성공하였습니다.';

//-- createExperience

export const getExperienceSuccessMd = `
### ✅ 경험 분해 조회에 성공했습니다.
s, t, a, r의 경험 카드 내용을 조회하기 위해서 각각 querystring에 boolean 값을 입력합니다.\n
예를 들어서,
- situation=true를 입력하면, situation 정보만 가져옵니다.
- situation=true&task=true를 입력하면, situation, task 정보만 가져옵니다.\n

마지막 데이터만 가져오고자 한다면, string에는 createdAt을, order에는 DESC, page는 1, take는 1을 입력해주세요.

### Picture

#### 키워드 정리

<img width="360" alt="image" src="https://github.com/depromeet/InsightOut-Server/assets/83271772/e14612fe-13e0-469a-892e-66a615bcb194">

#### 페이지네이션 명세

<img width="1409" alt="image" src="https://github.com/depromeet/InsightOut-Server/assets/83271772/ea8542e8-df05-4842-ba86-b43138fb1fe4">

---

유저가 생성 중인 경험 분해가 있다면 \`생성 중인 경험분해\`를 반환합니다.\n
 처음 경험 분해를 생성하는 것이면 \`INPROGRESS 상태의 경험카드가 없습니다\`라는 문구가 나옵니다.
`;

export const getExperienceFirstPagehavingNextPageDescriptionMd = `
### 첫 페이지 조회
- page: 1 - 현재 페이지는 1페이지입니다.
- take: 3 - take로 입력한 값은 3입니다. 즉, 페이지 당 3개의 값을 조회합니다.
- itemCount: 3 - 해당 API에서의 총 아이템 개수는 3개입니다.
- pageCount: 3 - 총 페이지 개수는 3개입니다(총 7~9개의 아이템이 존재할 수 있습니다.).
- hasPreviousPage: false - 이전 페이지가 존재하지 않습니다. 즉, 첫 번째 페이지입니다.
- hasNextPage: true - 다음 페이지가 존재합니다. 즉, 마지막 페이지가 아닙니다.
`;

export const getExperienceOnePageDescriptionMd = `
### 페이지가 한 개만 있는 경우 조회 (다음 페이지가 없는 경우)
- page: 1 - 현재 페이지는 1페이지입니다.
- take: 3 - take로 입력한 값은 3입니다. 즉, 페이지 당 3개의 값을 조회합니다.
- itemCount: 3 - 해당 API에서의 총 아이템 개수는 3개입니다.
- pageCount: 3 - 총 페이지 개수는 3개입니다(총 7~9개의 아이템이 존재할 수 있습니다.).
- hasPreviousPage: false - 이전 페이지가 존재하지 않습니다. 즉, 첫 번째 페이지입니다.
- hasNextPage: false - 다음 페이지가 존재합니다. 즉, 마지막 페이지입니다.

> 즉, 이 경우에는 첫 페이지이자 마지막 페이지입니다.
`;

export const getExperienceLastPagehavingDescriptionMd = `
### 마지막 페이지 조회
- page: 3 - 현재 페이지는 3페이지입니다.
- take: 3 - take로 입력한 값은 3입니다. 즉, 페이지 당 3개의 값을 조회합니다.
- itemCount: 3 - 해당 API에서의 총 아이템 개수는 3개입니다.
- pageCount: 3 - 총 페이지 개수는 3개입니다(총 7~9개의 아이템이 존재할 수 있습니다.).
- hasPreviousPage: true - 이전 페이지가 존재합니다. 즉, 첫 번째 페이지가 아닙니다.
- hasNextPage: false - 다음 페이지가 존재하지 않습니다. 즉, 마지막 페이지입니다.
`;

export const getExperienceMiddlePagehavingDescriptionMd = `
### 중간 페이지 조회
- page: 2 - 현재 페이지는 2페이지입니다.
- take: 3 - take로 입력한 값은 3입니다. 즉, 페이지 당 3개의 값을 조회합니다.
- itemCount: 3 - 해당 API에서의 총 아이템 개수는 3개입니다.
- pageCount: 3 - 총 페이지 개수는 3개입니다(총 7~9개의 아이템이 존재할 수 있습니다.).
- hasPreviousPage: true - 이전 페이지가 존재합니다. 즉, 첫 번째 페이지가 아닙니다.
- hasNextPage: true - 다음 페이지가 존재합니다. 즉, 마지막 페이지가 아닙니다.
`;

export const upsertExperienceSuccessMd = `
### ✅ 경험 분해 생성 및 업데이트에 성공했습니다.
유저가 경험 분해 생성한 내역이 없다면 \`CREATE\`가 진행됩니다.\n
유저가 경험 분해 생성 중인 내역이 있다면 \`UPDATE\`가 진행됩니다.\n
`;

// -- getExperience

export const getExperienceByIdDescriptionMd = `
### ✅ 경험 분해 단일 조회에 성공하였습니다.
경험 분해가 존재하지 않을 경우 \`404\`에러를 반환합니다.\n
성공 시 \`Experience\`(경험), \`ExperienceInfo\`(경험 정보), \`AiResume\`(AI 추천 자기소개서), \`AiCapability\`(추천 키워드)를 반환합니다.
`;

export const getExperienceByIdSuccessMd = `✅ 경험 분해 단일 조회에 성공하였습니다 :)`;

export const getExperienceByIdSummaryMd = `🔵🟢🟣 경험 분해 단일 조회 API`;

// -- getExperienceById

export const updateExperienceDescriptionMd = `
### ✅ 경험 분해 업데이트에 성공했습니다.
전달 받은 아이디의 경험 분해가 없다면 \`404\` 에러를 뱉어냅니다.
모든 프로퍼티는 Optinal입니다.\n
변경 되지 않은 사항은 프로퍼티를 넣어 주시지 않으셔도 됩니다.\n
전달 받은 프로퍼티만 업데이트 됩니다 :)
`;

export const updateExperienceSummaryMd = '🔵 경험 정보 수정 API';
export const updateExperienceSuccessMd = '✅ 경험 정보 수정에 성공하였습니다.';

// -- updateExperience

export const getExperienceCardInfoDescriptionMd = `
### ✅ 경험 카드를 보여주기 위해 필요한 앞, 뒷면에 대한 모든 정보 조회에 성공하였습니다.
전달 받은 아이디의 경험 분해가 없다면 \`404\` 에러를 뱉어냅니다.
`;

export const getExperienceCardInfoSummaryMd = '✅ 경험 카드 정보 조회 API';
export const getExperienceCardInfoSuccessMd = '✅ 경험 카드를 보여주기 위해 필요한 앞, 뒷면에 대한 모든 정보 조회에 성공하였습니다.';

// -- get experienceInfo

export const addCapabilitySuccessMd = `
### ✅ 경험 분해 키워드 추가하는 데 성공했습니다.
이미 가지고 있는 키워드라면 \`{가지고 있는 키워드} 해당 키워드가 이미 존재합니다. 확인 부탁드립니다.\`라는 409 에러가 발생합니다.\n
body keyword는 \`required\`입니다.
`;

export const createManyExperienceCapabilitiesSuccessMd = `
### ✅ 경험 분해 키워드를 임시 저장하는 데 성공했습니다.
해당 유저가 가지고 있지 않은 키워드를 임시저장하려고 하면 \`{가지고 있지 않은 키워드}해당 키워드가 만들어 있지 않습니다. 확인 부탁드립니다.\` 라는 400 에러가 발생합니다.\n
body keywords는 \`required\`입니다.\n
이미 만들어져 있는 키워드를 추가한다면 count에 포함되지 않습니다.(prisma에서 자동으로 만들지 않습니다.)
`;

export const getExperienceCapabilitySuccessMd = `
### ✅ 경험 분해 키워드를 가져오는 데 성공했습니다.
성공 Response는 아래와 같습니다. 유저의 키워드를 property에 key명으로 모두 담아 내립니다.\n
유저의 모든 키워드 중 선택한 키워드는 value에 true 값을 담아 반환합니다.\n
![image](https://github.com/depromeet/13th-4team-backend/assets/97580759/40590171-349f-45a6-9dd3-abe7156a647d)\n
위 사진에서 보라색 칠해져 있는 값들이 true입니다.
\`\`\`
// 해당 사진과 관련없는 예시입니다.
{
  "statusCode": 201,
  "success": true,
  "data": {
    "리더십": true,
    "문제해결력": true,
    "문제해결역량": false,
    "의사소통": false,
    "커뮤니케이션": false,
    "협상/설득력": false,
    "팀워크": false,
  }
}
\`\`\`

`;

export const getAiResumeDescriptionMd = `
### ✅ ChatGPT가 추천해준 AI 자기소개서 조회에 성공하였습니다.
해당 추천 자기소개서가 없을 경우 \`404\` 에러가 내려갑니다!

`;

export const getAiResumeSummaryMd = `
✅ ChatGPT 추천 자기소개서 조회 API
`;

export const getAiResumeSuccessMd = `
ChatGPT가 추천해준 자기소개서 조회에 성공하였습니다 :)
`;

// -- ChatGPT AI가 추천해준 자기소개서 내려주는 API

export const deleteExperienceDescriptionMd = `
### ✅ 경험 분해 삭제에 성공했습니다.
유저의 삭제할 경험 분해가 존재하지 않으면 \`404\`에러를 반환합니다.\n
경험 분해가 삭제되었으면 \`isDeleted에 true\` 값이, 삭제 되지 않았다면 \`isDeleted에 false\` 값이 들어있는 채로 반환됩니다 :)
`;

export const deleteExperienceSummaryMd = '🔵 경험 분해 삭제 API';
export const deleteExperienceSuccessMd = '✅ 경험 분해 삭제에 성공하였습니다.';

// -- updateExperience

export const getCountOfExperienceResponseDescriptionMd = `
### ✅ 경험 카드 개수 조회에 성공했습니다.
모아보기 최상단에 사용되는 경험카드의 개수 값을 반환합니다.
`;

export const getCountOfExperienceSummaryMd = `
🟢 경험 카드 개수 조회 API
`;

export const getCountOfExperienceDescriptionMd = `
# 경험 카드 개수 조회 API

## Description

경험 카드 개수를 조회합니다. 개수 데이터를 가져와 모아보기에서 가장 상단 경험 카드 +99와 같이 매핑될 때 사용할 수 있습니다.

## Picture

<img width="622" alt="image" src="https://github.com/depromeet/13th-4team-backend/assets/83271772/2507b92c-3eb3-4b31-949e-5216f548a1ad">

## Figma

⛳️ [모아보기 - 경험카드탭](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1403-10706&t=BGdyU14QTHF3scSm-4)
`;

// -- getCountOfExperience

export const getCountOfExperienceAndCapabilityResponseDescriptionMd = `
### ✅ 경험카드 키워드 및 개수 조회에 성공했습니다.
모아보기 상단 경험카드를 눌렀을 때, 유저가 작성한 경험카드의 역량 키워드를 탭에 보여줍니다.\n
또한, 키워드 오른쪽에 키워드가 등록된 경험카드의 개수가 출력됩니다. \n
\`isCompleted\` 쿼리 키워드를 true로 보내주시면 완료된 정보만 내려줍니다 :) false시 전체 데이터가 내려갑니다 :)\n
isComleted는 Optional한 값이며 default 값은 false입니다. >> \`전체\`를 같이 내려주게 되는데 전체의 id 값은 0입니다.


<img width="250" alt="image" src="https://github.com/depromeet/13th-4team-backend/assets/83271772/0ab94ec3-1ca1-4cea-8fc4-0cf9c8b73190">
`;

export const getCountOfExperienceAndCapabilitySummaryMd = `
🟢🟣 경험카드 키워드 및 해당 경험카드 개수 조회 API
`;

export const getCountOfExperienceAndCapabilityDescriptionMd = `
# 경험카드 키워드 및 해당 경험카드 개수 조회 API

## Description

경험카드 키워드와 그 키워드를 포함하는 경험카드의 개수를 반환합니다.\n
예를 들어, 커뮤니케이션과 리더십이라는 두 역량 키워드를 등록한 경험카드를 유저가 생성했었다고 한다면,\n
커뮤니케이션 +1, 리더십 +1 과 같은 형태로 화면에 추가됩니다.

## Picture

<img width="508" alt="image" src="https://github.com/depromeet/13th-4team-backend/assets/83271772/44dc9473-17b6-429a-bd3a-9e9bfcd8b6d7">

## Figma

⛳️ [모아보기 - 경헙카드탭](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1403-10706&t=JS6M2TwVexDV0UV0-4)
`;

// -- getCountOfExperienceAndCapability

export const getStarFromExperienceResponseDescriptionMd = `
### ✅ 경험카드 S, T, A, R 조회에 성공했습니다.

자기소개서 작성 페이지에서 경험 카드를 눌렀을 때, 오른쪽 분할 화면에 출력될 S, T, A, R 데이터입니다.
`;

export const getStarFromExperienceSummaryMd = `
🟣 경험카드 S, T, A, R 조회 API
`;

export const getStarFromExperienceDescriptionMd = `
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

// -- getStarFromExperience
