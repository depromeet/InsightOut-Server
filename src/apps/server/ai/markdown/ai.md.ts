export const postKeywordPromptDescriptionMd = `
### ✅ ChatGPT 추천 키워드 생성 프롬프트 API 생성 및 업데이트에 성공하였습니다.
ChatGPT API를 사용하여 키워드를 생성할 때 2~3초 정도 소요됩니다.\n
이미 AI 추천 Keyword가 있다면 \`409\`에러를 반환합니다.\n
두 개의 키워드를 생성한 후 DB에 업데이트 합니다. \n
결과 값으로 id와 keyword를 리턴합니다. \n
키워드는 이 후 추천 자기소개서를 생성할 때 반환해 주셔야 합니다 :)

## Picture
<img width="377" alt="image" src="https://github.com/depromeet/InsightOut-Server/assets/97580759/cbd1c90e-0365-41d4-b7fc-850d5b09a860">
`;

export const postKeywordPromptSummaryMd = `
✅ ChatGPT 추천 키워드 생성 및 저장 프롬프트 API
`;

export const postKeywordPromptSuccMd = `
ChatGPT 추천 키워드가 생성 및 저장 되었습니다 :)
`;

// -- ChatGPT AI Keyword 생성 API
export const postResumePromptDescriptionMd = `
### ✅ ChatGPT 추천 자기소개서 생성 프롬프트 API 생성에 성공하였습니다.
ChatGPT API를 사용하여 추천 자기소개서를 생성할 때 30~40초 정도 소요됩니다.\n
전달 받은 역량 IDs 중 없는 것있다면 \`404\` 에러를 반환합니다.\n
이미 추천 AI가 생성된 것이 있다면 \`409\` 에러를 반환합니다.\n
키워드 및 추천 자기소개서 타입이 맞지 않다면 \`400\` 에러를 반환합니다.

## Picture
<img width="383" alt="image" src="https://github.com/depromeet/InsightOut-Server/assets/97580759/139996dc-b750-43a6-a493-3352f9d868f3">
`;

export const postResumePromptSummaryMd = `
✅ ChatGPT 추천 자기소개서 생성 프롬프트 API
`;

export const postResumePromptSuccMd = `
ChatGPT 추천 자기소개서가 생성되었습니다 :)
`;

// -- ChatGPT 추천 자기소개서 생성 API

export const postSummaryPromptDescriptionMd = `
### ✅ ChatGPT STAR 경험 요약, 요약 키워드 생성, 추천 자기소개서 항목 생성 및 데이터 베이스 저장에 성공하였습니다.
ChatGPT API를 사용하여 추천 자기소개서를 생성할 때 20~30초 정도 소요됩니다.\n
모든 플로우를 실행 시킨 뒤 생성된 경험 카드를 보여주기 위해 필요한 정보를 반환합니다.\n


## Picture
<img width="515" alt="image" src="https://github.com/depromeet/InsightOut-Server/assets/97580759/b765db66-e16b-4698-99fe-f8e51f487955">

- 차트 플로우

<img width="227" alt="image" src="https://github.com/depromeet/InsightOut-Server/assets/97580759/59db9d47-e5f6-4d96-8fec-5c16cad90fbd">
`;

export const postResumeSummarySummaryMd = `
✅ ChatGPT 경험 요약 프롬프트, 요약 키워드 생성 프롬프트, 추천 자기소개서 작성 프롬프트 API
`;

export const postResumeSummarySuccMd = `
ChatGPT 경험 요약 프롬프트, 요약 키워드 생성 프롬프트, 추천 자기소개서 작성 프롬프트가 생성되고 저장되었습니다 :)
`;

// -- ChatGPT 경험 요약 프롬프트 API

export const getAiResumeDescriptionMd = `
### ChatGPT가 해당 유저에게 추천해준 자기소개서 목록 조회에 성공하였습니다.
ChatGPT가 유저에게 추천해준 자기소개서 목록이 나옵니다.\n
\`query\` 값에 ChatGPT가 추천해준 키워드를 입력하면 필터링 되어 추천 자기소개서를 내려줍니다 query는 \`Opional\`입니다.\n
query를 넣어주지 않으면 전체 목록이 내려옵니다.\n
추천 자기소개서가 없으면 \`[]\` 빈 배열이 내려갑니다.

`;
export const getAiResumeSummaryMd = `
✅ ChatGPT 추천 자기소개서 조회 API
`;
export const getAiResumeSuccMd = `
ChatGPT 추천 자기소개서 목록 조회에 성공하였습니다.
`;

// -- ai 자기소개서 가져오기
