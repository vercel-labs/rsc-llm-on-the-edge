import "./globals.css";

export const metadata = {
  title: "React Server Component LLM streaming on the Edge",
  description: "Vercel AI SDK on the Edge",
  twitter: {
    card: "summary_large_image",
    title: "Vercel AI SDK on the Edge",
    description: "React Server Component streaming an LLM response on the Edge",
    creator: "@nextjs",
  },
  themeColor: "#FFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* <NavigationSwitcher /> */}
        {children}
      </body>
    </html>
  );
}
