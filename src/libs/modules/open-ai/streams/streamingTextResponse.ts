import { ServerResponse } from 'node:http';

export const streamToResponse = (
  res: ReadableStream,
  response: ServerResponse,
  init?: { headers?: Record<string, string>; status?: number },
) => {
  response.writeHead(init?.status || 200, {
    'Content-Type': 'text/plain; charset=utf-8',
    ...init?.headers,
  });

  const reader = res.getReader();
  function read() {
    reader.read().then(({ done, value }: { done: boolean; value?: any }) => {
      if (done) {
        response.end();
        return;
      }
      response.write(value);
      read();
    });
  }
  read();
};
