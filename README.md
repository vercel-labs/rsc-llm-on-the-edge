## Streaming an LLM response on the Edge

This is a demo of the [Vercel AI SDK](https://sdk.vercel.ai) with [Next.js](https://nextjs.org) using the Edge Runtime

This template uses [React Server Components](https://nextjs.org/docs/getting-started/react-essentials#server-components) and the AI SDK to stream an LLM response on the Edge to the client.

## How it works

The index route `/` uses the Edge Runtime through:

```js
export const runtime = "edge";
```

A stream is created using an AI provider SDK and the Vercel AI SDK:

```js
const response = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  stream: true,
  messages: [
    {
      role: "user",
      content:
        "Act like as if you are a travel expert. Provide a list of 5 things to do in " +
        city +
        " " +
        timezone +
        " and start with 'here's a...'",
    },
  ],
});

// Convert the response into a friendly text-stream
// See other supported providers: https://sdk.vercel.ai/docs/guides
const stream = OpenAIStream(response);
```

Recursively render the stream on the client using [React Suspense](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)

```js
import { Suspense } from "react";

export async function Tokens({ stream }: { stream: ReadableStream }) {
  const reader = stream.getReader();

  return (
    <Suspense>
      <RecursiveTokens reader={reader} />
    </Suspense>
  );
}

async function RecursiveTokens({
  reader,
}: {
  reader: ReadableStreamDefaultReader,
}) {
  const { done, value } = await reader.read();

  if (done) {
    return null;
  }

  const text = new TextDecoder().decode(value);

  return (
    <>
      {text}
      <Suspense fallback={null}>
        <RecursiveTokens reader={reader} />
      </Suspense>
    </>
  );
}
```

[Learn more](https://beta.nextjs.org/docs/rendering/edge-and-nodejs-runtimes).
