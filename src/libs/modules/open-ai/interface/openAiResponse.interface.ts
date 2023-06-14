export interface OpenAiResponseInterface {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: [
    {
      message: {
        role: string;
        content: string[] | string;
      };
      finish_reason: string;
      index: number;
    },
  ];
}
