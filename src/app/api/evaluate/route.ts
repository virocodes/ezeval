import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const EVALUATOR_MODEL = "llama-3.3-70b-versatile";

export async function POST(req: Request) {
  const { systemPrompt, userPrompt, models } = await req.json();
  const responses = [];
  for (const model of models) {
    const response = await groq.chat.completions.create({
      model: model,
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
      });

    const evaluationPrompt = `
      You are a helpful assistant that evaluates the quality of the response given by the model.
      The system prompt is: ${systemPrompt}
      The user prompt is: ${userPrompt}
      The response is: ${response.choices[0].message.content || ""}
      Return data in raw JSON with this format:
      {
        "score": 47,
        "reasoning": "The response is not accurate... because..."
      }
      IT IS VERY IMPORTANT THAT YOU DON'T INLUDE ANY OTHER TEXT, MARKDOWN, FORMATTING, OR ANYTHING ELSE. JUST THE JSON.
    `;

    const evaluatorResponse = await groq.chat.completions.create({
      model: EVALUATOR_MODEL,
      messages: [{ role: "system", content: evaluationPrompt }, { role: "user", content: evaluationPrompt }],
    });

    const evalData = JSON.parse(evaluatorResponse.choices[0].message.content || "");

    const returnData = {
      model: model,
      llmResponse: response.choices[0].message.content || "",
      evaluatorResponse: evalData.reasoning,
      score: evalData.score,
      responseTime: response.usage?.completion_time || 0,
    };

    responses.push(returnData);
  }
 
  return NextResponse.json(responses);
}

