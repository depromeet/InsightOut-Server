import { PromptKeywordBodyReqDto } from '🔥apps/server/ai/dto/req/promptKeyword.req.dto';
import { PromptResumeBodyResDto } from '🔥apps/server/ai/dto/req/promptResume.req.dto';

export const generateKeywordPrompt = (body: PromptKeywordBodyReqDto) => {
  const keywordPrompt = `Your task is to recommend two words about the capability from the description which user wrote in the resume supporting website.\\n\\nRecommend two words about the capability at least 3 words and most 10 words in more detail in Korea from the description below, delimited by triple backticks. That description has 4 paragraph, each starts with 'Situation: ', 'Task: ', 'Action: ', 'Result: '. And it is written in Korean.\\n\\nTranslate the words into Korean.\\n\\nPlz Provide words in the Typascript string array format like ["창의력", "리더십"]\\n\\n\`\`\``;
  return `${keywordPrompt}\n\`\`\`\\nsituation: \`${body.situation}\`\\ntask: \`${body.task}\`\\naction: \`${body.action}\`\\nresult: \`${body.result}\`\\n\`\`\``;
};

export const generateResumePrompt = (body: PromptResumeBodyResDto) => {
  const resumePrompt = `Your task is to write a new essay for a job application using two keywords and four paragraphs below. This eassy should include the content of paragraphs and keywords below.\\n\\nYour essay should be clearly formatted, consist of complete sentences.no longer than 700 characters.\\n\\nYour essay should be translated in Korean.\\n\\nParagraphs are delimited by triple backticks and keywords are string array wrapped by single backtick.\\n\\nParagraphs:\\n\`\`\`\\n`;
  return `${resumePrompt}Situation: ${body.situation}\\n\\nTask: ${body.task}\\n\\nAction: ${body.task}\\n\\nResult: ${body.result}\\n\`\`\`\\n\\nKeywords: ${body.keywords}"`;
};
