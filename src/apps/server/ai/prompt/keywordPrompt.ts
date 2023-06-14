import { PromptKeywordBodyReqDto } from '🔥apps/server/ai/dto/req/promptKeyword.req.dto';

export const generateKeywordPrompt = (body: PromptKeywordBodyReqDto) => {
  const keywordPrompt = `Your task is to recommend two words about the capability from the description which user wrote in the resume supporting website.\\n\\nRecommend two words about the capability at least 3 words and most 10 words in more detail in Korea from the description below, delimited by triple backticks. That description has 4 paragraph, each starts with 'Situation: ', 'Task: ', 'Action: ', 'Result: '. And it is written in Korean.\\n\\nTranslate the words into Korean.\\n\\nPlz Provide words in the Typascript string array format like ["창의력", "리더십"]\\n\\n\`\`\``;
  return `${keywordPrompt}\n\`\`\`\\nsituation: \`${body.situation}\`\\ntask: \`${body.task}\`\\naction: \`${body.action}\`\\nresult: \`${body.result}\`\\n\`\`\``;
};
