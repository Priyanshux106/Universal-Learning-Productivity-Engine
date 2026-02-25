import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StuddyBuddy AI — AWS-Native Learning Platform",
  description:
    "An AI-powered developer learning platform built on AWS Bedrock, Lambda, and DynamoDB. Generate roadmaps, simplify concepts, practice with adaptive quizzes, and analyze code with AI explanations.",
  keywords: ["AI learning", "AWS Bedrock", "developer education", "coding practice", "roadmap generator"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-aura-bg text-aura-text antialiased">
        <div className="bg-particles" />
        {children}
      </body>
    </html>
  );
}
