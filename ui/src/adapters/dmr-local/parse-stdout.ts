import type { TranscriptEntry } from "../types";

export function parseDmrLocalStdoutLine(line: string, ts: string): TranscriptEntry[] {
  return [{ kind: "stdout", ts, text: line }];
}
