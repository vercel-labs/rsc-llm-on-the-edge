import { headers } from "next/headers";
import { Footer } from "./components/footer";
import { Region } from "./components/region";
import { parseVercelId } from "./parse-vercel-id";
import { OpenAIStream } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { Suspense } from "react";

export const runtime = "edge";

const apiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
});

const openai = new OpenAIApi(apiConfig);

export default async function Page() {
  const headersList = headers();
  const city = decodeURIComponent(
    headersList.get("X-Vercel-IP-City") || "San%20Francisco"
  );

  const timezone =
    headersList.get("X-Vercel-IP-Timezone") || "America/Los_Angeles";

  const { proxyRegion, computeRegion } = parseVercelId(
    headersList.get("X-Vercel-Id")!
  );

  const date = new Date().toLocaleString("en-US", {
    timeZone: timezone,
    timeZoneName: "short",
    second: "numeric",
    minute: "numeric",
    hour: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return (
    <>
      <main>
        <h1 className="title">
          <span>What to do in </span>
          {city}?
        </h1>
        <pre className="tokens">
          <Suspense fallback={null}>
            {/* @ts-ignore rsc */}
            <Wrapper city={city} timezone={timezone} />
          </Suspense>
        </pre>
      </main>
      <div className="meta">
          <div className="info">
            <span>Proxy Region</span>
            <Region region={proxyRegion} />
          </div>
          <div className="info">
            <span>Compute Region</span>
            <Region region={computeRegion} />
          </div>
        </div>
      <Footer>
        {/* <p>
          Generated on {date} by{" "}
          <a
            href="https://vercel.com/docs/concepts/functions/edge-functions"
            target="_blank"
            rel="noreferrer"
          >
            Vercel Edge Runtime
          </a>
        </p> */}
      </Footer>
    </>
  );
}

async function Wrapper({ city, timezone }: { city: string; timezone: string }) {
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
          " and start with 'here's a...'. Do not mention the timezone in your response.",
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  /* @ts-ignore rsc */
  return <Tokens stream={stream} />;
}

async function Tokens({ stream }: { stream: ReadableStream }) {
  const reader = stream.getReader();

  return (
    /* @ts-ignore rsc */
    <RecursiveTokens reader={reader} />
  );
}

async function RecursiveTokens({
  reader,
}: {
  reader: ReadableStreamDefaultReader;
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
        {/* @ts-ignore rsc */}
        <RecursiveTokens reader={reader} />
      </Suspense>
    </>
  );
}
