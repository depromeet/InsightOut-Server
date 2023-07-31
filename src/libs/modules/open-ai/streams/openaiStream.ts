import { OpenAIStreamCallbacks } from 'ai';

// Chat Completion Chunk 타입
interface ChatCompletionChunk {
  id: string;
  choices: Array<ChatCompletionChunkChoice>;
  created: number;
  model: string;
  object: string;
}

interface ChatCompletionChunkChoice {
  delta: ChoiceDelta;

  finish_reason: 'stop' | 'length' | 'function_call' | null;

  index: number;
}

interface ChoiceDelta {
  /**
   * Chunk 메시지 내용
   */
  content?: string | null;

  /**
   * 모델이 생성되면서 호출해야 하는 함수의 이름과 매개변수
   */
  function_call?: FunctionCall;

  /**
   * 메시지 작성자의 역할
   */
  role?: 'system' | 'user' | 'assistant' | 'function';
}

interface FunctionCall {
  arguments?: string;

  /**
   * 호출할 함수의 이름
   */
  name?: string;
}

export function OpenAiStream(res: Response | AsyncIterable<ChatCompletionChunk>, callbacks: OpenAIStreamCallbacks): ReadableStream {}
