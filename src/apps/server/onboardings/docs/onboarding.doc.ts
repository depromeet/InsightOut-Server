export const getOnBoardingResponseDescription = `
### ✅ 온보딩 여부 조회에 성공했습니다.
온보딩의 여부를 통해서 툴팁을 보여주거나 온보딩 페이지를 노출합니다.
`;

export const getOnboardingSummaryMd = '🔵🟢🟣 온보딩 조회 API';

export const getOnboardingDescriptionMd = `
# 온보딩 조회 API
## Description
유저가 **온보딩을 완료 했는지 여부를 조회**합니다. 이는 툴팁 사용 및 온보딩 페이지 노출 여부와 직결됩니다.

전체적인 Flow는 아래와 같습니다.
![image](https://github.com/depromeet/13th-4team-backend/assets/83271772/4cd57f0d-c741-480f-b828-3f882801e9b8)

회원가입/로그인 시 **온보딩 여부**를 access token과 함께 전달합니다.
어떠한 이유로 온보딩 여부에 대한 정보가 없을 시에는 \`온보딩 조회 API\`를 사용하여 온보딩 여부 값을 가져옵니다.

향후 다른 페이지로 이동했을 때, 전역 상태에서 온보딩 여부를 통해서 분기처리합니다.
- 온보딩을 했을 시, 툴팁을 보이지 않습니다.
- 온보딩을 하지 않았을 시, 툴팁을 보여주며 온보딩 여부 업데이트 API를 호출해 DB에서 유저의 온보딩 여부를 수정하고 전역 상태를 업데이트합니다.
`;

// -- getOnboarding

export const patchOnboardingResponseDescriptionMd = `
### ✅ 온보딩 여부 업데이트에 성공했습니다.
각 화면 별로 온보딩이 완료됐을 때, 온보딩 여부를 업데이트합니다.
응답으로 업데이트된 온보딩 데이터를 반환합니다.
`;

export const patchOnboardingSummaryMd = `
🔵🟢🟣 온보딩 여부 업데이트 API
`;

export const patchOnboardingDescriptionMd = `
# 온보딩 여부 업데이트 API

## Description
온보딩 여부를 업데이트합니다. 유저가 툴팁을 최초 확인하거나, 온보딩 페이지를 경험했을 때 업데이트합니다.
온보딩/툴팁이 사용되는 위치는 아래와 같습니다.

## Picture
<img width="617" alt="image" src="https://github.com/depromeet/13th-4team-backend/assets/83271772/c3c28f00-08c4-4e28-a414-8663094bb6d2">

<img width="593" alt="image" src="https://github.com/depromeet/13th-4team-backend/assets/83271772/2ae77be5-c540-432b-9b02-48fd7d4092b9">

<img width="477" alt="image" src="https://github.com/depromeet/13th-4team-backend/assets/83271772/2186f084-d2a8-41a8-a1b7-05e9f8603ce6">

<img width="391" alt="image" src="https://github.com/depromeet/13th-4team-backend/assets/83271772/ee530ab4-3a46-42b1-8f3f-55b5c04d670d">

## Figma
⛳️ [경험 분해 온보딩 팝업](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1833-11874&t=dUehEoPlyiDTcQPi-4)\n
⛳️ [경험 분해 스텝퍼](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=695-5705&t=dUehEoPlyiDTcQPi-4)\n
⛳️ [자기소개서 작성 툴팁](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1221-8169&t=dUehEoPlyiDTcQPi-4)\n
⛳️ [모아보기 정렬 툴팁](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1403-10706&t=dUehEoPlyiDTcQPi-4)
`;

// -- patchOnboarding
