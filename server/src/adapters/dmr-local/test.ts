import type {
  AdapterEnvironmentCheck,
  AdapterEnvironmentTestContext,
  AdapterEnvironmentTestResult,
} from "../types.js";
import { DMR_LOCAL_DEFAULT_URL } from "./execute.js";

function summarizeStatus(checks: AdapterEnvironmentCheck[]): AdapterEnvironmentTestResult["status"] {
  if (checks.some((c) => c.level === "error")) return "fail";
  if (checks.some((c) => c.level === "warn")) return "warn";
  return "pass";
}

export async function testEnvironment(
  ctx: AdapterEnvironmentTestContext,
): Promise<AdapterEnvironmentTestResult> {
  const checks: AdapterEnvironmentCheck[] = [];
  const url = DMR_LOCAL_DEFAULT_URL;

  checks.push({
    code: "dmr_local_endpoint",
    level: "info",
    message: `Configured heartbeat endpoint: ${url}`,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });
    if (!response.ok && response.status !== 405 && response.status !== 501) {
      checks.push({
        code: "dmr_local_probe_unexpected_status",
        level: "warn",
        message: `dmr-local probe returned HTTP ${response.status}.`,
        hint: "Ensure the dmr-local service is running: docker compose up -d dmr-local",
      });
    } else {
      checks.push({
        code: "dmr_local_probe_ok",
        level: "info",
        message: "dmr-local service is reachable.",
      });
    }
  } catch (err) {
    checks.push({
      code: "dmr_local_probe_failed",
      level: "warn",
      message: err instanceof Error ? err.message : "dmr-local probe failed",
      hint: "Ensure the dmr-local service is running: docker compose up -d dmr-local",
    });
  } finally {
    clearTimeout(timeout);
  }

  return {
    adapterType: ctx.adapterType,
    status: summarizeStatus(checks),
    checks,
    testedAt: new Date().toISOString(),
  };
}
