import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const example =
  "Your task is to recommend two words about the capability from the description which user wrote in the resume supporting website.\\n\\nRecommend two words about the capability at least 3 words and most 10 words in more detail in Korea from the description below, delimited by triple backticks. That description has 4 paragraph, each starts with 'Situation: ', 'Task: ', 'Action: ', 'Result: '. And it is written in Korean.\\n\\nTranslate the words into Korean.\\n\\nProvide words in the Javacscript string array format like `[\\\"창의력\\\", \\\"리더십\\\"]`.\\n\\n```\\nSituation: 처음으로 프로그래밍 언어를 배우고자 하였으며, 조금 더 책임감 있게 자신을 고양하고 충분히 학습할 수 있도록 '네이버 부스트코스 코칭스터디'라는 프로그램에서 리더로 지원함\\n\\nTask: 매주 Python 미션이 3문제 이상 주어졌으며, 이 문제를 팀원들과 함께 토론하고 서로 가르쳐주며 최적의 답을 찾아내서 코치에게 제출해야 하는 상황이었습니다.\\n\\nAction: 솔선수범하여 매주 주어지는 미션을 받은 당일 모두 풀어냈으며, 팀원들을 동기부여 할 수 있도록 열정있는 모습을 보여주었습니다. 또한, 뒤처지는 멤버들을 다독이며 모두 수료했습니다.\\n\\nResult: 한 명의 낙오자 없이 모두가 정상적으로 코스를 마치며 수료할 수 있었습니다. 책임감 있게 미션을 수행하면서 프로그래밍에 대해서 확실하게 입문할 수 있었고 잘 적응할 수 있었습니다.\\n```";

export class PromptTestBodyRequestDto {
  @IsNotEmpty()
  @MaxLength(3000)
  @ApiProperty({ example })
  content: string;
}
