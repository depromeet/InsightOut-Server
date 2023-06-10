export const testApiSuccMd = `
### ✅ openai 프롬프트 테스트 API입니다.
성공 시 openai에서 내려주는 값이 들어 있습니다. 예시는 아래와 같습니다. \n
\`\`\`
{
    "id": "cmpl-7PnupHcqfEw23gp2Oof1a4yXaEsng",
    "object": "text_completion",
    "created": 1686384431,
    "model": "text-ada-001",
    "choices": [
    {
        // 결과는 아래 text 프로퍼티 안에 들어 있습니다.
        "text": "There are many ways someone can learn English. There are dozens of websites and videos that can be found online that teach English, or how to use English-related technologies, or how to be a better English speaker. There are also many English",
        "index": 0,
        "logprobs": null,
        "finish_reason": "length"
    }
    ],
        "usage": {
        "prompt_tokens": 6,
            "completion_tokens": 50,
            "total_tokens": 56
    }
}
\`\`\`

추후 프롬프트를 실행할 API는 text 프로퍼티만 추출하여 반환하겠습니다 :) 
`;
