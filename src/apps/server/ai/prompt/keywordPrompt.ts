import { PromptKeywordBodyReqDto } from '🔥apps/server/ai/dto/req/promptKeyword.req.dto';
import { PromptResumeBodyResDto } from '🔥apps/server/ai/dto/req/promptResume.req.dto';

export const generateKeywordPrompt = (body: PromptKeywordBodyReqDto) => {
  const keywordPrompt = process.env.CHATGPT_KEYWORD_PROMPT;
  return `${keywordPrompt}\n\`\`\`\\nsituation: \`${body.situation}\`\\ntask: \`${body.task}\`\\naction: \`${body.action}\`\\nresult: \`${body.result}\`\\n\`\`\``;
};

export const generateResumePrompt = (body: PromptResumeBodyResDto) => {
  const resumePrompt = process.env.CHATGPT_RESUME_PROMPT;
  return `${resumePrompt}Situation: ${body.situation}\\n\\nTask: ${body.task}\\n\\nAction: ${body.task}\\n\\nResult: ${body.result}\\n\`\`\`\\n\\nKeywords: ${body.keywords}"`;
};
