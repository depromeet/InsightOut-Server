<div style='text-align:center'><img src='https://github.com/depromeet/InsightOut-Server/assets/83271772/29424c20-830f-4d22-b1f5-2a10d610cc88' />
<h3>💫 자기소개서가 막막한 순간, 그 시작을 함께하는 인사이트 아웃</h3>
</div>

---

<div>
    <div style='display:flex; justify-content:center; align-items: center;'>
        <img src='https://github.com/depromeet/InsightOut-Server/assets/83271772/35d596b3-0f14-4f12-9023-b1bd62a1376e' width='30%' />
        <p>
            <strong>자기소개서로 매일 밤 지새우는 취업준비생이신가요?</strong>
            <br />
            <br />인사이트 아웃에서 경험 분해를 통해 직무역량을 파헤치고
            <br />나만의 <strong>경험 카드</strong>를 만들어보세요. <strong>AI 역량 키워드 추천</strong>부터
            <br /><strong>자기소개서 작성</strong>까지, 취업 준비 과정의 고민을 해결해보세요!
        </p>
    </div>
</div>

---

## 목차

1. [아키텍처](#1-아키텍처)

2. [기술스택](#2-기술스택)

3. [.ENV](#3-env)

4. [브랜치 정책](#4-브랜치-정책)

5. [커밋 정책](#5-커밋-정책)

6. [PR 정책](#6-pr-정책)

7. [팀원](#7-팀원)

# 1. 아키텍처

# 2. 기술스택

# 3. .ENV

---

| 이름                                 | 설명                            | 예시                                |
| :----------------------------------- | :------------------------------ | :---------------------------------- |
| PORT                                 | 포트                            |                                     |
| LOCAL_SERVER                         | 로컬 URL                        |                                     |
| DEVELOPMENT_SERVER                   | 개발용 URL                      |                                     |
| RELEASE_SERVER                       | 릴리즈용 URL                    |                                     |
| PRODUCTION_SERVER                    | 런칭용 URL                      |                                     |
| DATABASE_URL                         |                                 | postgres://{ID}:{PASSWORD}@{DB_URL} |
| SHADOW_DATABASE_URL                  |                                 | postgres://{ID}:{PASSWORD}@{DB_URL} |
| DB_HOST                              |                                 |                                     |
| DB_PORT                              |                                 |                                     |
| DB_USERNAME                          |                                 |                                     |
| DB_PASSWORD                          |                                 |                                     |
| DB_DATABASE                          |                                 |                                     |
| AWS_ACCESS_KEY                       |                                 |                                     |
| AWS_SECRET_ACCESS_KEY                |                                 |                                     |
| AWS_REGION                           |                                 | ap-northeast-2                      |
| AWS_SIGNATURE_VERSION                |                                 | v4                                  |
| AWS_S3_API_VERSION                   |                                 | 2006-03-01                          |
| AWS_S3_BUCKET                        | 버킷명                          |                                     |
| AWS_S3_GET_DURATION                  | PreSignedURL 읽기 가능 시간(초) | 300                                 |
| AWS_S3_PUT_DURATION                  | PreSignedURL 쓰기 가능 시간(초) | 300                                 |
| FIREBASE_TYPE                        |                                 | service_account                     |
| FIREBASE_PROJECT_ID=                 |                                 |                                     |
| FIREBASE_PRIVATE_KEY_ID              |                                 |                                     |
| FIREBASE_PRIVATE_KEY                 |                                 |                                     |
| FIREBASE_CLIENT_EMAIL                |                                 |                                     |
| FIREBASE_CLIENT_ID                   |                                 |                                     |
| FIREBASE_AUTH_URI                    |                                 |                                     |
| FIREBASE_TOKEN_URI                   |                                 |                                     |
| FIREBASE_AUTH_PROVIDER_X509_CERT_URL |                                 |                                     |
| FIREBASE_CLIENT_X509_CERT_URL        |                                 |                                     |
| FIREBASE_API_KEY                     |                                 |                                     |
| FIREBASE_AUTH_DOMAIN                 |                                 |                                     |
| FIREBASE_STORAGE_BUCKET              |                                 |                                     |
| FIREBASE_MESSAGING_SENDER_ID         |                                 |                                     |
| FIREBASE_APP_ID                      |                                 |                                     |
| FIREBASE_MEASUREMENT_ID              |                                 |                                     |

---

# 4. 브랜치 정책

| 배포환경 |    브런치명    |
| -------- | :------------: |
| main     |      런칭      |
| stage    | 주단위 작업물  |
| dev      |  실시간 개발   |
| PID-n    | Jira 티켓 번호 |

> 예시) PID/{작업명}

---

# 5. 커밋 정책

| 앱       | 종류                              |
| -------- | --------------------------------- |
| feat     | 새기능 추가                       |
| fix      | 버그 수정                         |
| format   | 앱에 영향을 미치지 않는 단순 수정 |
| refactor | 리팩토링                          |

> 예시) feat: 로그인 추가

---

# 6. PR 정책

1. 동일 스택 개발자 모두 요청
2. 모두의 approve 필요
3. 파트장이 merge 실행

---

# 7. 팀원

|                             Server, 💫 **파트장**                              |                      백엔드, 💼 **운영진**, 👑 **팀장**                      |
| :----------------------------------------------------------------------------: | :--------------------------------------------------------------------------: |
|                                     김동현                                     |                                    이성태                                    |
| <img src="https://avatars.githubusercontent.com/u/97580759?v=4" width="200" /> | <img src="https://avatars.githubusercontent.com/u/83271772?v=4" width="200"> |
|                [kimddakki](https://github.com/PracticeEveryday)                |                   [Seongtae](https://github.com/stae1102)                    |

|                               Web, 💫 **파트장**                               |                                      Web                                       |                                      Web                                       |                                      Web                                       |
| :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
|                                     박준하                                     |                                     박상범                                     |                                     신민경                                     |                                     윤상준                                     |
| <img src="https://avatars.githubusercontent.com/u/85827017?v=4" width="200" /> | <img src="https://avatars.githubusercontent.com/u/43921054?v=4" width="200" /> | <img src="https://avatars.githubusercontent.com/u/80238096?v=4" width="200" /> | <img src="https://avatars.githubusercontent.com/u/63948484?v=4" width="200" /> |
|                  [Joonha Park](https://github.com/harseille)                   |                 [SangBeom Park](https://github.com/sangbooom)                  |                   [minkyung](https://github.com/minkyung00)                    |                    [highJoon](https://github.com/highjoon)                     |

|           Design, 💫 **파트장**            | 디자인, 🤵🏻‍♀️ **PM** |
| :----------------------------------------: | :---------------: |
|                   이설희                   |      유지선       |
|                                            |                   |
| [이설희](https://www.behance.net/seullee6) |      유지선       |
