import type { ServerAdapterModule } from "../types.js";
import { execute, DMR_LOCAL_DEFAULT_URL } from "./execute.js";
import { testEnvironment } from "./test.js";

export const dmrLocalAdapter: ServerAdapterModule = {
  type: "dmr_local",
  execute,
  testEnvironment,
  models: [],
  agentConfigurationDoc: `# dmr_local agent configuration

Adapter: dmr_local

Routes heartbeats to a local Ollama inference service via the dmr-local bridge.

Core fields:
- url (string, optional): heartbeat endpoint, default ${DMR_LOCAL_DEFAULT_URL}
- method (string, optional): HTTP method, default POST
- timeoutMs (number, optional): request timeout in milliseconds, default 120000
`,
};
