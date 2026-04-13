import type { ServerAdapterModule, AdapterModel } from "../types.js";
import { execute, DMR_LOCAL_DEFAULT_URL } from "./execute.js";
import { testEnvironment } from "./test.js";

async function listModels(): Promise<AdapterModel[]> {
  const base = process.env.DMR_URL ?? "http://model-runner:11434";
  try {
    const res = await fetch(`${base}/v1/models`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const json = await res.json() as { data?: { id: string }[] };
    return (json.data ?? []).map((m) => ({ id: m.id, label: m.id }));
  } catch {
    return [];
  }
}

export const dmrLocalAdapter: ServerAdapterModule = {
  type: "dmr_local",
  execute,
  testEnvironment,
  listModels,
  models: [],
  supportsLocalAgentJwt: true,
  agentConfigurationDoc: `# dmr_local agent configuration

Adapter: dmr_local

Routes heartbeats to a local Ollama inference service via the dmr-local bridge.

Core fields:
- url (string, optional): heartbeat endpoint, default ${DMR_LOCAL_DEFAULT_URL}
- method (string, optional): HTTP method, default POST
- timeoutMs (number, optional): request timeout in milliseconds, default 120000
`,
};
