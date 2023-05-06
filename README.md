# 13기 4팀 백엔드

## 목차

#### 1. 아키텍처

#### 2. 기술스택

#### 3. .ENV

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

## 브런치 정책

| 배포환경 |    브런치명    |
| -------- | :------------: |
| main     |      런칭      |
| stage    | 주단위 작업물  |
| dev      |  실시간 개발   |
| PID-n    | Jira 티켓 번호 |

> 예시) PID/{작업명}

## 커밋 정책

| 앱       | 종류                              |
| -------- | --------------------------------- |
| feat     | 새기능 추가                       |
| fix      | 버그 수정                         |
| format   | 앱에 영향을 미치지 않는 단순 수정 |
| refactor | 리팩토링                          |

> 예시) feat: 로그인 추가

## PR 정책

1. 동일 스택 개발자 모두 요청
2. 모두의 approve 필요
3. 파트장이 merge 실행

## 팀원

|                                  Server, 팀장                                  |                                    백엔드                                    |                                     백엔드                                     |
| :----------------------------------------------------------------------------: | :--------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
|                                     김동현                                     |                                    이성태                                    |                                     장원진                                     |
| <img src="https://avatars.githubusercontent.com/u/97580759?v=4" width="200" /> | <img src="https://avatars.githubusercontent.com/u/83271772?v=4" width="200"> | <img src="https://avatars.githubusercontent.com/u/45301224?v=4" width="200" /> |
|                [kimddakki](https://github.com/PracticeEveryday)                |                   [Seongtae](https://github.com/stae1102)                    |                  [Wonjin Jang](https://github.com/JangDaljin)                  |

|                                   Web, 팀장                                    |                                      Web                                       |                                      Web                                       |                                      Web                                       |
| :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
|                                     박준하                                     |                                     박상범                                     |                                     신민경                                     |                                     윤상준                                     |
| <img src="https://avatars.githubusercontent.com/u/85827017?v=4" width="200" /> | <img src="https://avatars.githubusercontent.com/u/43921054?v=4" width="200" /> | <img src="https://avatars.githubusercontent.com/u/80238096?v=4" width="200" /> | <img src="https://avatars.githubusercontent.com/u/63948484?v=4" width="200" /> |
|                  [Joonha Park](https://github.com/harseille)                   |                 [SangBeom Park](https://github.com/sangbooom)                  |                   [minkyung](https://github.com/minkyung00)                    |                    [highJoon](https://github.com/highjoon)                     |

|                                                          Design, 팀장                                                           |                                                            디자인                                                             |                                                             디자인                                                              |
| :-----------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: |
|                                                             이설희                                                              |                                                            배유나                                                             |                                                             유지선                                                              |
| <img src="https://user-images.githubusercontent.com/83271772/212343731-6332432b-cae8-42b5-8667-d0a8b18d34be.png" width="200" /> | <img src="https://user-images.githubusercontent.com/83271772/212343731-6332432b-cae8-42b5-8667-d0a8b18d34be.png" width="200"> | <img src="https://user-images.githubusercontent.com/83271772/212343731-6332432b-cae8-42b5-8667-d0a8b18d34be.png" width="200" /> |
|                                           [이설희](https://www.behance.net/seullee6)                                            |                                                            배유나                                                             |                                                             유지선                                                              |
