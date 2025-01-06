"use client"

import { useEffect, useState } from "react";

type EvalResponse = {
  model: string;
  llmResponse: string;
  evaluatorResponse: string;
  score: number;
  responseTime: number;
}

export default function Experiment() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [models, setModels] = useState<string[]>(["gemma2-9b-it", "llama3-8b-8192", "mixtral-8x7b-32768"]);
  const [results, setResults] = useState<EvalResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        body: JSON.stringify({ systemPrompt, userPrompt, models }),
      });
      if (!response.ok) throw new Error("Failed to evaluate");
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">LLM Evaluation Platform</h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="system-prompt" className="block text-sm font-medium text-gray-700">
                System Prompt
              </label>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                id="system-prompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Enter system instructions..."
              />
            </div>

            <div>
              <label htmlFor="user-prompt" className="block text-sm font-medium text-gray-700">
                User Prompt
              </label>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                id="user-prompt"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Enter user prompt..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Models</label>
              <div className="bg-gray-50 rounded-md p-4 space-y-2">
                {["gemma2-9b-it", "llama3-8b-8192", "mixtral-8x7b-32768"].map((model) => (
                  <label key={model} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      value={model}
                      checked={models.includes(model)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setModels([...models, model]);
                        } else {
                          setModels(models.filter(m => m !== model));
                        }
                      }}
                    />
                    <span className="text-sm text-gray-700">{model}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || models.length === 0}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${loading || models.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
              >
                {loading ? 'Running...' : 'Run Experiment'}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-8">
            <div className="flex">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}
        {results.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Results</h3>
            </div>
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Response</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluation</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {result.model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {result.score}/100
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(result.responseTime).toFixed(2)}ms
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => {
                            const modal = document.createElement('div');
                            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4';
                            modal.innerHTML = `
                              <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                                <div class="flex justify-between items-center mb-4">
                                  <h3 class="text-lg font-medium">Model Response</h3>
                                  <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                                <div class="whitespace-pre-wrap">${result.llmResponse}</div>
                              </div>
                            `;
                            document.body.appendChild(modal);
                          }}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          {result.llmResponse.substring(0, 100)}...
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => {
                            const modal = document.createElement('div');
                            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4';
                            modal.innerHTML = `
                              <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                                <div class="flex justify-between items-center mb-4">
                                  <h3 class="text-lg font-medium">Evaluation</h3>
                                  <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                                <div class="whitespace-pre-wrap">${result.evaluatorResponse}</div>
                              </div>
                            `;
                            document.body.appendChild(modal);
                          }}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          {result.evaluatorResponse.substring(0, 100)}...
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
