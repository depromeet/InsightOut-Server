import { createParser } from '@libs/modules/openAi/streams/eventParser/eventParser';
import { EventSourceParser, ParsedEvent, ReconnectInterval } from '@libs/modules/openAi/streams/eventParser/types';

export interface FunctionCallPayload {
  name: string;
  arguments: Record<string, unknown>;
}

export function readableFromAsyncIterable<T>(iterable: AsyncIterable<T>) {
  // 비동기 iterator를 평가해 변수에 저장
  const it = iterable[Symbol.asyncIterator]();

  // ReadableStream 인스턴스 생성
  return new ReadableStream<T>({
    async pull(controller: ReadableStreamDefaultController<T>) {
      const { done, value } = await it.next();
      if (done) controller.close();
      // done이 나오기 전까지 stream에 저장
      else controller.enqueue(value);
    },

    async cancel(reason) {
      await it.return?.(reason);
    },
  });
}

/**
 * AIStream stream의 생명주기 이벤트를 위한 헬퍼 콜백 메서드
 *
 * @interface
 */
export interface AIStreamCallbacks {
  onStart?: () => Promise<void> | void;
  onCompletion?: (completion: string) => Promise<void> | void;
  onToken?: (token: string) => Promise<void> | void;
}

/**
 * Custom parser for AIStream data.
 * @interface
 */
export interface AIStreamParser {
  (data: string): string | void;
}

/**
 * Creates a TransformStream that parses events from an EventSource stream using a custom parser.
 * @param {AIStreamParser} customParser - Function to handle event data.
 * @returns {TransformStream<Uint8Array, string>} TransformStream parsing events.
 */
export function createEventStreamTransformer(customParser?: AIStreamParser): TransformStream<Uint8Array, string> {
  const textDecoder = new TextDecoder();
  let eventSourceParser: EventSourceParser;

  return new TransformStream({
    async start(controller): Promise<void> {
      eventSourceParser = createParser((event: ParsedEvent | ReconnectInterval) => {
        if (
          ('data' in event && event.type === 'event' && event.data === '[DONE]') ||
          // Replicate doesn't send [DONE] but does send a 'done' event
          // @see https://replicate.com/docs/streaming
          (event as any).event === 'done'
        ) {
          controller.terminate();
          return;
        }

        if ('data' in event) {
          const parsedMessage = customParser ? customParser(event.data) : event.data;
          if (parsedMessage) controller.enqueue(parsedMessage);
        }
      });
    },

    transform(chunk) {
      eventSourceParser.feed(textDecoder.decode(chunk));
    },
  });
}

/**
 * Creates a transform stream that encodes input messages and invokes optional callback functions.
 * The transform stream uses the provided callbacks to execute custom logic at different stages of the stream's lifecycle.
 * - `onStart`: Called once when the stream is initialized.
 * - `onToken`: Called for each tokenized message.
 * - `onCompletion`: Called once when the stream is flushed, with the aggregated messages.
 *
 * This function is useful when you want to process a stream of messages and perform specific actions during the stream's lifecycle.
 *
 * @param {AIStreamCallbacks} [callbacks] - An object containing the callback functions.
 * @return {TransformStream<string, Uint8Array>} A transform stream that encodes input messages as Uint8Array and allows the execution of custom logic through callbacks.
 *
 * @example
 * const callbacks = {
 *   onStart: async () => console.log('Stream started'),
 *   onToken: async (token) => console.log(`Token: ${token}`),
 *   onCompletion: async (completion) => console.log(`Completion: ${completion}`)
 * };
 * const transformer = createCallbacksTransformer(callbacks);
 */
export function createCallbacksTransformer(callbacks: AIStreamCallbacks | undefined): TransformStream<string, Uint8Array> {
  const textEncoder = new TextEncoder();
  let aggregatedResponse = '';
  const { onStart, onToken, onCompletion } = callbacks || {};

  return new TransformStream({
    async start(): Promise<void> {
      if (onStart) await onStart();
    },

    async transform(message, controller): Promise<void> {
      controller.enqueue(textEncoder.encode(message));

      if (onToken) await onToken(message);
      if (onCompletion) aggregatedResponse += message;
    },

    async flush(): Promise<void> {
      if (onCompletion) await onCompletion(aggregatedResponse);
    },
  });
}

export function trimStartOfStreamHelper(): (text: string) => string {
  let isStreamStart = true;

  return (text: string): string => {
    if (isStreamStart) {
      text = text.trimStart();
      if (text) isStreamStart = false;
    }
    return text;
  };
}

/**
 * Returns a ReadableStream created from the response, parsed and handled with custom logic.
 * The stream goes through two transformation stages, first parsing the events and then
 * invoking the provided callbacks.
 *
 * For 2xx HTTP responses:
 * - The function continues with standard stream processing.
 *
 * For non-2xx HTTP responses:
 * - If the response body is defined, it asynchronously extracts and decodes the response body.
 * - It then creates a custom ReadableStream to propagate a detailed error message.
 *
 * @param {Response} response - The response.
 * @param {AIStreamParser} customParser - The custom parser function.
 * @param {AIStreamCallbacks} callbacks - The callbacks.
 * @return {ReadableStream} The AIStream.
 * @throws Will throw an error if the response is not OK.
 */
export function AIStream(response: Response, customParser?: AIStreamParser, callbacks?: AIStreamCallbacks): ReadableStream<Uint8Array> {
  if (!response.ok) {
    if (response.body) {
      const reader = response.body.getReader();
      return new ReadableStream({
        async start(controller) {
          const { done, value } = await reader.read();
          if (!done) {
            const errorText = new TextDecoder().decode(value);
            controller.error(new Error(`Response error: ${errorText}`));
          }
        },
      });
    } else {
      return new ReadableStream({
        start(controller) {
          controller.error(new Error('Response error: No response body'));
        },
      });
    }
  }

  const responseBodyStream = response.body || createEmptyReadableStream();

  return responseBodyStream.pipeThrough(createEventStreamTransformer(customParser)).pipeThrough(createCallbacksTransformer(callbacks));
}

/**
 * Creates an empty ReadableStream that immediately closes upon creation.
 * This function is used as a fallback for creating a ReadableStream when the response body is null or undefined,
 * ensuring that the subsequent pipeline processing doesn't fail due to a lack of a stream.
 *
 * @returns {ReadableStream} An empty and closed ReadableStream instance.
 */
function createEmptyReadableStream(): ReadableStream {
  return new ReadableStream({
    start(controller) {
      controller.close();
    },
  });
}
