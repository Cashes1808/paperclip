import type { AdapterConfigFieldsProps } from "../types";
import { Field, DraftInput, help } from "../../components/agent-config-primitives";
import { DMR_LOCAL_DEFAULT_URL } from "./build-config";

const inputClass =
  "w-full rounded-md border border-border px-2.5 py-1.5 bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground/40";

export function DmrLocalConfigFields({
  isCreate,
  values,
  set,
  config,
  eff,
  mark,
}: AdapterConfigFieldsProps) {
  return (
    <Field label="Heartbeat URL" hint={help.webhookUrl}>
      <DraftInput
        value={
          isCreate
            ? (values!.url || DMR_LOCAL_DEFAULT_URL)
            : eff("adapterConfig", "url", String(config.url ?? DMR_LOCAL_DEFAULT_URL))
        }
        onCommit={(v) =>
          isCreate
            ? set!({ url: v || DMR_LOCAL_DEFAULT_URL })
            : mark("adapterConfig", "url", v || DMR_LOCAL_DEFAULT_URL)
        }
        immediate
        className={inputClass}
        placeholder={DMR_LOCAL_DEFAULT_URL}
      />
    </Field>
  );
}
