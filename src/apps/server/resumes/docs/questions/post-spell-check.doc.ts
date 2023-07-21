export const PostSpellCheckResponseDescriptionMd = `
### ✅ 자기소개서 맞춤법 검사에 성공했습니다.
다음 맞춤법 검사기를 연동하여 요청을 보낸 결과입니다.
`;

export const PostSpellCheckSummaryMd = `
🟣 자기소개서 답안 맞춤법 검사 API
`;

export const PostSpellCheckDescriptionMd = `
# 자기소개서 답안 맞춤법 검사 API

## Description

맞춤법을 검사하여 맞춤법에 맞지 않은 토큰을 모두 반환합니다.\n
(🚨 만약 맞춤법이 틀리지 않았으면 빈배열을 가지는 배열을 반환합니다 -> \`[[]]\`)

아래는 응답 예시입니다.

\`\`\`ts
[
    [
        {
            "type": "space",
            "token": "일년에",
            "suggestions": [
                "일 년에"
            ],
            "context": "최초로 시작되어 일년에 한바퀴를 돌면서"
        }
    ]
]
\`\`\`

**type**은 틀린 맞춤법의 유형입니다. \`space\`는 띄어쓰기, \`spell\`은 전반적으로 틀린 맞춤법 (ex.돼게 -> 되게, 역활 -> 역할), \`doubt\`는 맞춤법 오류가 의심되는 구절입니다. 명세를 확인할 수 없어서 추가적인 오류 타입이 존재할 수도 있습니다.

**token**은 틀린 맞춤법의 토큰(글자)입니다.

**suggestions**는 틀린 맞춤법에 대해서 정정할 수 있는 방법들입니다.

**context**는 틀린 맞춤법 토큰이 어떤 맥락에서 틀린 것인지를 나타냅니다.

## Picture

<img width="431" alt="image" src="https://github.com/depromeet/13th-4team-backend/assets/83271772/77289549-80ed-4c14-9e08-1cc0668f70a9">

## Figma

⛳️ [맞춤법 검사-로딩...](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1263-19185&t=zKwSWoPmdDHGzQV4-4)\n
⛳️ [맞춤법 검사-오류 없음](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1263-19553&t=zKwSWoPmdDHGzQV4-4)\n
⛳️ [맞춤법 검사 - 오류 있음](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1221-11498&t=zKwSWoPmdDHGzQV4-4)\n
⛳️ [맞춤법 검사-오류 보기](https://www.figma.com/file/0ZJ1ulwtU8k0KQuroxU9Wc/%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%95%84%EC%9B%83?type=design&node-id=1263-20990&t=zKwSWoPmdDHGzQV4-4)
`;
