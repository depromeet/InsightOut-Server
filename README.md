<div align='center'><img src='https://github.com/depromeet/InsightOut-Server/assets/83271772/29424c20-830f-4d22-b1f5-2a10d610cc88' />
<h3 align='center'>💫 자기소개서가 막막한 순간, 그 시작을 함께하는 인사이트 아웃</h3>
</div>

---

<div>
    <div align='center'>
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

<aside align='center'>

<img src='https://github.com/depromeet/InsightOut-Server/assets/83271772/19c9398d-8a1a-47ef-bc36-8df1c502cc27' />
<img src='https://github.com/depromeet/InsightOut-Server/assets/83271772/86d4fd4d-225c-4332-b26f-542db740edbd' />

<h3 align='center'>경험분해</h3>

<p align='center'>👀 <strong>첫 번째, 내가 가진 경험을 분해해봐요</strong><br />
<br />
1️⃣ 내 <strong>경험을 쉽게 풀어낼 수 있는 문항</strong>들을 제공해요<br />
2️⃣ <strong>핵심 키워드</strong>들을 선택하고 추가 할 수 있어요<br />
3️⃣ <strong>S.T.A.R 기법</strong>을 활용해 내 경험을 논리적으로 구조화해봐요<br />
</p>
</aside>

---

<aside align='center'>

<img src='https://github.com/depromeet/InsightOut-Server/assets/83271772/edbc8da1-98ab-4b5b-a9d3-ea72b4a96ede' />

<h3 align='center'>AI 역량 키워드 및 자기소개서 추천</h3>

<p align='center'>👀 <strong>두 번째, AI루모스가 막막한 취준을 도와줘요</strong><br />
<br />
1️⃣ 내 경험을 통해 루모스가 <strong>키워드를 추천</strong>해줘요<br />
2️⃣ 앞서 작성한 내용을 기반으로 <strong>자기소개서를 생성해줘요</strong><br />
3️⃣ 경험을 통해 받을 수 있는 <strong>예상 자기소개서 질문</strong>도 제공해줘요<br />
</p>
</aside>

---

<aside align='center'>

<img src='https://github.com/depromeet/InsightOut-Server/assets/83271772/a0950979-fc38-4142-84c8-24e059f041dc' />

<h3 align='center'>모아보기</h3>

<p align='center'>👀 <strong>네 번째, 내가 작성한 경험, 자기소개서, AI가 추천해준 자기소개서를 큐레이션 할 수 있어요</strong><br />
<br />
1️⃣ 역량 <strong>키워드 중심</strong>으로 경험카드를 모아볼 수 있어요<br />
2️⃣ 내가 작성한 <strong>자기소개서들을 확인</strong> 할 수 있어요<br />
3️⃣ AI 루모스가 추천해준 키워드로 <strong>루모스가 추천하는 자기소개서들</strong>을 모아 볼 수 있어요<br />
</p>
</aside>

---

<aside align='center'>

<img src='https://github.com/depromeet/InsightOut-Server/assets/83271772/e57d6cfa-3aa1-4dab-8044-9f36f2943b6b' />

<h3 align='center'>자기소개서 작성</h3>

<p align='center'>👀 <strong>세 번째, 생성한 경험 카드를 활용해서 자기소개서를 작성할 수 있어요</strong><br />
<br />
1️⃣ <strong>폴더 형식</strong>으로 자기소개서를 작성하고 관리 할 수 있어요<br />
2️⃣ 작성 중인 자기소개서의 <strong>맞춤법 검사</strong>도 가능하답니다.<br />
3️⃣ 작성을 완료한 <strong>경험카드를 참고</strong>하며 자기소개서를 작성할 수 있어요<br />
</p>
</aside>

---

<div  style='text-align:center' >
<img src='https://github.com/depromeet/InsightOut-Server/assets/83271772/758d1b60-cd1f-4c87-812f-b0fd9193f186'/>
<br />
<br />
<div align='center'>자기소개서 작성의 시작을 인사이트 아웃과 함께해요.</div>
</div>

---

### Insight-out의 서버는 어떻게 구성되었을까요?

#### 1. 아키텍처

<img src='https://github.com/depromeet/InsightOut-Server/assets/83271772/ca9e3e7d-41de-4ef2-9de8-e52915c0d963' />

> **급하게 작성해서 아직 수정이 필요해요!**

최대한 빠른 개발을 진행하기 위해 아키텍처는 단순하게 가져갔어요(수정 예정 중). 단일 EC2(t2-micro)에 서버를 한 대 띄우고 해당 컴퓨터에서 Redis를 설치해 작동시켰습니다.

배포 파이프라인은 GitHub Actions를 통해 특정 branch의 Push 이벤트가 발생하면, 도커 이미지 빌드 후 ECR에 이미지를 올린 후, S3에 해당 아티팩트를 저장한 다음, EC2에 그 파일을 전달하고 작동시키는 구조입니다.

향후 비동기 처리를 안전하게 하기 위해 SQS를 도입하거나 혹은 Database Slow query를 파악하기 위해 CloudWatch와 Lambda를 사용해서 알림이 올 수 있게끔 하려고 합니다.

프론트엔드의 경우 Next.js를 Vercel에 배포하였습니다.

#### 2. 기술스택

- Language: TypeScript
- Framework: Node.js, NestJS
- database: PostgreSQL, Redis
- ORM: Prisma(변경 예정)
- Cloud: AWS EC2, AWS RDS, AWS ECR, AWS S3

---

#### 3. 브랜치 정책

| 배포환경 |     브런치명     |
| -------- | :--------------: |
| main     |       런칭       |
| dev      |   실시간 개발    |
| feature  | 각각의 기능 개발 |
| fix      |  수정 사항 개발  |
| docs     |  문서 작성/수정  |
| 미정     |  Jira 티켓 번호  |

> 예시) PID/{작업명}

---

#### 4. 커밋 정책

| 앱       | 종류                              |
| -------- | --------------------------------- |
| feat     | 새 기능 추가                      |
| fix      | 버그 수정                         |
| format   | 앱에 영향을 미치지 않는 단순 수정 |
| refactor | 리팩토링                          |
| docs     | 문서 추가/수정                    |
| comment  | 주석 추가                         |

> 예시) feat: 로그인 추가

---

#### 5. 팀원

|                             Server, 💫 **파트장**                              |                       백엔드, 💼 **운영진**, 👑 **팀장**                       |
| :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
|                                     김동현                                     |                                     이성태                                     |
| <img src="https://avatars.githubusercontent.com/u/97580759?v=4" width="200" /> | <img src="https://avatars.githubusercontent.com/u/83271772?v=4" width="200" /> |
|                [kimddakki](https://github.com/PracticeEveryday)                |                    [Seongtae](https://github.com/stae1102)                     |

|                               Web, 💫 **파트장**                               |                                      Web                                       |                                      Web                                       |                                      Web                                       |
| :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
|                                     박준하                                     |                                     박상범                                     |                                     신민경                                     |                                     윤상준                                     |
| <img src="https://avatars.githubusercontent.com/u/85827017?v=4" width="200" /> | <img src="https://avatars.githubusercontent.com/u/43921054?v=4" width="200" /> | <img src="https://avatars.githubusercontent.com/u/80238096?v=4" width="200" /> | <img src="https://avatars.githubusercontent.com/u/63948484?v=4" width="200" /> |
|                  [Joonha Park](https://github.com/harseille)                   |                 [SangBeom Park](https://github.com/sangbooom)                  |                   [minkyung](https://github.com/minkyung00)                    |                    [highJoon](https://github.com/highjoon)                     |

|                                                     Design, 💫 **파트장**                                                     |                                                       디자인, 🤵🏻‍♀️ **PM**                                                       |
| :---------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------: |
|                                                            이설희                                                             |                                                            유지선                                                             |
| <img src='https://github.com/depromeet/InsightOut-Server/assets/83271772/33b4b7ba-0d86-4887-bd48-e317f1dcfe27' width="200" /> | <img src='https://github.com/depromeet/InsightOut-Server/assets/83271772/33b4b7ba-0d86-4887-bd48-e317f1dcfe27' width="200" /> |
|                                          [이설희](https://www.behance.net/seullee6)                                           |                                                            유지선                                                             |
