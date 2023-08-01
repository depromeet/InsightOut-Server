export const GetOnBoardingResponseDescription = `
### ✅ 온보딩 여부 조회에 성공했습니다.
온보딩의 여부를 통해서 툴팁을 보여주거나 온보딩 페이지를 노출합니다.
`;

export const GetOnboardingSummaryMd = '🔵🟢🟣 온보딩 조회 API';

export const GetOnboardingDescriptionMd = `
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
