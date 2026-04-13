import type { CreateConfigValues } from "@paperclipai/adapter-utils";

export const DMR_LOCAL_DEFAULT_URL = "http://dmr-local:3200/heartbeat";

export function buildDmrLocalConfig(v: CreateConfigValues): Record<string, unknown> {
  return {
    url: v.url || DMR_LOCAL_DEFAULT_URL,
    method: "POST",
    timeoutMs: 120000,
  };
}
