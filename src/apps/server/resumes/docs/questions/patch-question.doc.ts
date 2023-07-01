export const PatchQuestionResponseDescriptionMd = `
### ✅ 자기소개서 문항 수정에 성공했습니다.
문항의 제목과 답안을 받아서 기존 DB에 저장된 값을 업데이트합니다.
수정 일자를 반환합니다.
`;

export const PatchQuestionSummaryMd = `
🟣 자기소개서 문항 수정 API (2023.6.6. Updated)
`;

export const PatchQuestionDescriptionMd = `
# 자기소개서 문항 수정 API

## Description

자기소개서 제목과 문항을 받아서 DB에 저장된 자기소개서 문항을 업데이트합니다.
임시저장 및 자동저장의 주기 및 Trigger에 따라서 호출됩니다.

사용자의 마지막 입력을 기준으로 업데이트가 될 수 있고, 포커스를 잃어 onBlur 이벤트가 발생했을 때에도 업데이트가 발생할 수 있습니다.
또한, 임시저장 버튼을 눌러서도 임시저장이 가능합니다.

- 2023.6.6 반환 값에 updatedAt이 추가됐습니다.

## Picture

<img width="1104" alt="image" src="https://github.com/depromeet/13th-4team-backend/assets/83271772/a6dd76cd-0b2e-4035-9977-9aae59b5a74c">

## Figma
⛳️ [자기소개서 작성](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1221-11167&t=nNIhb8U7EAcbAZnX-4)
`;
