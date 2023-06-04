export const getExperienceSuccMd = `
### ✅ 경험 분해 조회에 성공했습니다.
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
이미 가지고 있는 키워드라면 \`{가지고 있는 키워드} 해당 키워드가 이미 존재합니다. 확인 부탁드립니다.\`라는 400 에러가 발생합니다.\n
body keyword는 \`required\`입니다.
`;

export const createManyExperienceCapabilitiesSuccMd = `
### ✅ 경험 분해 키워드를 임시 저장하는 데 성공했습니다.
해당 유저가 가지고 있지 않은 키워드를 임시저장하려고 하면 \`{가지고 있지 않은 키워드}해당 키워드가 만들어 있지 않습니다. 확인 부탁드립니다.\` 라는 400 에러가 발생합니다.\n
body keywords는 \`required\`입니다.\n
이미 만들어져 있는 키워드를 추가한다면 count에 포함되지 않습니다.(prisma에서 자동으로 만들지 않습니다.)
`;
