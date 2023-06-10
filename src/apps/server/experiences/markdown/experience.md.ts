export const getExperienceSuccMd = `
### ✅ 경험 분해 조회에 성공했습니다.
s, t, a, r의 경험 카드 내용을 조회하기 위해서 각각 querystring에 boolean 값을 입력합니다.\n
예를 들어서,
- situation=true를 입력하면, situation 정보만 가져옵니다.
- situation=true&task=true를 입력하면, situation, task 정보만 가져옵니다.\n

추가적으로, 마지막으로 만든 경험카드 한 개만을 조회하기 위해서는 querystring에서 last라는 키에 대해 값을 boolean으로 넣어주세요.\n
예를 들어서 last=true를 입력했을 때, 유저가 마지막으로 만든 경험카드 한 개만을 조회합니다.

---

유저가 생성 중인 경험 분해가 있다면 \`생성 중인 경험분해\`를 반환합니다.\n
 처음 경험 분해를 생성하는 것이면 \`INPROGRESS 상태의 경험카드가 없습니다\`라는 문구가 나옵니다.
`;

export const upsertExperienceSuccMd = `
### ✅ 경험 분해 생성 및 업데이트에 성공했습니다.
유저가 경험 분해 생성한 내역이 없다면 \`CREATE\`가 진행됩니다.\n
유저가 경험 분해 생성 중인 내역이 있다면 \`UPDATE\`가 진행됩니다.\n
모든 프로퍼티는 Optinal입니다.\n
변경 되지 않은 사항은 프로퍼티를 넣어 주시지 않으셔도 됩니다.\n
전달 받은 프로퍼티만 업데이트 됩니다 :)
`;

export const addCapabilitySuccMd = `
### ✅ 경험 분해 키워드 추가하는 데 성공했습니다.
이미 가지고 있는 키워드라면 \`{가지고 있는 키워드} 해당 키워드가 이미 존재합니다. 확인 부탁드립니다.\`라는 409 에러가 발생합니다.\n
body keyword는 \`required\`입니다.
`;

export const createManyExperienceCapabilitiesSuccMd = `
### ✅ 경험 분해 키워드를 임시 저장하는 데 성공했습니다.
해당 유저가 가지고 있지 않은 키워드를 임시저장하려고 하면 \`{가지고 있지 않은 키워드}해당 키워드가 만들어 있지 않습니다. 확인 부탁드립니다.\` 라는 400 에러가 발생합니다.\n
body keywords는 \`required\`입니다.\n
이미 만들어져 있는 키워드를 추가한다면 count에 포함되지 않습니다.(prisma에서 자동으로 만들지 않습니다.)
`;

export const getExperienceCapabilitySuccMd = `
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
