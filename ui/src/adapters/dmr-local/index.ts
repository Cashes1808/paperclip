import type { UIAdapterModule } from "../types";
import { parseDmrLocalStdoutLine } from "./parse-stdout";
import { DmrLocalConfigFields } from "./config-fields";
import { buildDmrLocalConfig } from "./build-config";

export const dmrLocalUIAdapter: UIAdapterModule = {
  type: "dmr_local",
  label: "DMR Local",
  parseStdoutLine: parseDmrLocalStdoutLine,
  ConfigFields: DmrLocalConfigFields,
  buildAdapterConfig: buildDmrLocalConfig,
};
