import type { AdapterExecutionContext, AdapterExecutionResult } from "../types.js";
import { asString, asNumber, parseObject } from "../utils.js";

export const DMR_LOCAL_DEFAULT_URL = "http://dmr-local:3200/heartbeat";

export async function execute(ctx: AdapterExecutionContext): Promise<AdapterExecutionResult> {
  const { config, runId, agent, context, authToken } = ctx;
  const url = asString(config.url, DMR_LOCAL_DEFAULT_URL);
  const method = asString(config.method, "POST");
  const timeoutMs = asNumber(config.timeoutMs, 120000);
  const headers = parseObject(config.headers) as Record<string, string>;
  const payloadTemplate = parseObject(config.payloadTemplate);
  const body = { ...payloadTemplate, agentId: agent.id, runId, context, authToken: authToken ?? null };

  const controller = new AbortController();
  const timer = timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "content-type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
      ...(timer ? { signal: controller.signal } : {}),
    });

    if (!res.ok) {
      throw new Error(`DMR Local heartbeat failed with status ${res.status}`);
    }

    let parsed: Record<string, unknown> = {};
    try {
      parsed = (await res.json()) as Record<string, unknown>;
    } catch {
      // non-JSON body — fall through to safe defaults
    }

    const exitCode = typeof parsed.exitCode === "number" ? parsed.exitCode : 0;
    const signal = typeof parsed.signal === "string" ? parsed.signal : null;
    const timedOut = typeof parsed.timedOut === "boolean" ? parsed.timedOut : false;
    const summary = typeof parsed.summary === "string" ? parsed.summary : `DMR Local POST ${url}`;
    const rawUsage = parsed.usage as Record<string, unknown> | undefined;
    const usage =
      rawUsage && typeof rawUsage.inputTokens === "number"
        ? {
            inputTokens: rawUsage.inputTokens as number,
            outputTokens: (rawUsage.outputTokens as number) ?? 0,
          }
        : undefined;

    return { exitCode, signal, timedOut, summary, ...(usage ? { usage } : {}) };
  } finally {
    if (timer) clearTimeout(timer);
  }
}
