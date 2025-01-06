"use client";

import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">EzEval</h1>
      <p className="text-lg text-gray-500">
        EzEval is a platform for evaluating the performance of your LLMs.
      </p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => {
        router.push("/experiment/new");
      }}>Get Started</button>
    </div>
  );
}
