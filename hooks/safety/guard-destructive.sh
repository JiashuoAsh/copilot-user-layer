#!/usr/bin/env bash
# Cross-project destructive-command guard for VS Code Agent Hooks.
#
# Linux/macOS runner, and usable manually from Git Bash on Windows.
# Reads PreToolUse JSON from stdin and returns permissionDecision=ask for
# high-confidence destructive command patterns.
#
# JSON parser preference (tries each parser, not just command existence):
#   jq -> python3 -> python -> node -> fail open
#
# IMPORTANT:
# On Windows VS Code, the registered hook runner remains PowerShell because that
# path is already verified. It still inspects Bash/Git Bash command text.
#
# Guardrail only; not a security sandbox.

set -u

INPUT="$(cat)"

emit_empty() {
  printf '%s\n' '{}'
}

extract_with_jq() {
  command -v jq >/dev/null 2>&1 || return 1
  printf '%s' "$INPUT" | jq -r '
    .tool_input
    | ..
    | objects
    | (
        .command?,
        .cmd?,
        .script?,
        .shellCommand?,
        .shell_command?,
        (.commands?[]?)
      )
    | select(type == "string")
  ' 2>/dev/null
}

extract_with_python() {
  local py="$1"
  command -v "$py" >/dev/null 2>&1 || return 1

  INPUT_JSON="$INPUT" "$py" - <<'PY'
import json, os, sys

try:
    event = json.loads(os.environ.get("INPUT_JSON", ""))
except Exception:
    raise SystemExit(1)

wanted = {"command", "commands", "cmd", "script", "shellCommand", "shell_command"}

def walk(value):
    if isinstance(value, dict):
        for key, child in value.items():
            if key in wanted:
                if isinstance(child, str):
                    print(child)
                elif isinstance(child, list):
                    for item in child:
                        if isinstance(item, str):
                            print(item)
            elif not isinstance(child, str):
                walk(child)
    elif isinstance(value, list):
        for child in value:
            walk(child)

walk(event.get("tool_input"))
PY
}

extract_with_node() {
  command -v node >/dev/null 2>&1 || return 1

  INPUT_JSON="$INPUT" node - <<'JS'
let event;
try {
  event = JSON.parse(process.env.INPUT_JSON || "");
} catch {
  process.exit(1);
}

const wanted = new Set([
  "command", "commands", "cmd", "script", "shellCommand", "shell_command"
]);

function walk(value) {
  if (Array.isArray(value)) {
    for (const child of value) walk(child);
    return;
  }
  if (!value || typeof value !== "object") return;

  for (const [key, child] of Object.entries(value)) {
    if (wanted.has(key)) {
      if (typeof child === "string") {
        console.log(child);
      } else if (Array.isArray(child)) {
        for (const item of child) {
          if (typeof item === "string") console.log(item);
        }
      }
    } else if (typeof child !== "string") {
      walk(child);
    }
  }
}

walk(event.tool_input);
JS
}

extract_commands() {
  local out

  # A parser may exist but still be unusable in the current shell environment
  # (for example a Windows app alias visible from Git Bash). Therefore try the
  # next parser when execution/parsing fails.
  if out="$(extract_with_jq)"; then
    printf '%s\n' "$out"
    return 0
  fi
  if out="$(extract_with_python python3)"; then
    printf '%s\n' "$out"
    return 0
  fi
  if out="$(extract_with_python python)"; then
    printf '%s\n' "$out"
    return 0
  fi
  if out="$(extract_with_node)"; then
    printf '%s\n' "$out"
    return 0
  fi

  return 1
}

reason_for() {
  local c="$1"

  # Git.
  if grep -Eqi '(^|[[:space:];|&])git[[:space:]]+reset[[:space:]]+--hard([[:space:];|&]|$)' <<<"$c"; then
    printf '%s' 'git reset --hard can discard local changes'; return 0
  fi
  if grep -Eqi '(^|[[:space:];|&])git[[:space:]]+clean([^;&|]*[[:space:]])?-[^[:space:]]*f' <<<"$c"; then
    printf '%s' 'forced git clean can permanently remove untracked files'; return 0
  fi
  if grep -Eqi '(^|[[:space:];|&])git[[:space:]]+(checkout|restore)[^;&|]*--[[:space:]]+(\.|\*)([[:space:];|&]|$)' <<<"$c"; then
    printf '%s' 'broad git checkout/restore can discard local changes'; return 0
  fi
  if grep -Eqi '(^|[[:space:];|&])git[[:space:]]+restore[^;&|]*[[:space:]](\.|\*)([[:space:];|&]|$)' <<<"$c"; then
    printf '%s' 'broad git restore can discard local changes'; return 0
  fi
  if grep -Eqi '(^|[[:space:];|&])git[[:space:]]+push[^;&|]*(--force(-with-lease)?|(^|[[:space:]])-f([[:space:]]|$))' <<<"$c"; then
    printf '%s' 'force-push can rewrite remote history'; return 0
  fi
  if grep -Eqi '(^|[[:space:];|&])git[[:space:]]+stash[[:space:]]+(clear|drop)([[:space:];|&]|$)' <<<"$c"; then
    printf '%s' 'stash clear/drop can remove saved work'; return 0
  fi

  # Filesystem deletion.
  if grep -Eqi '(^|[;&|][[:space:]]*)(sudo[[:space:]]+)?rm[[:space:]]+-[^[:space:]]*r[^[:space:]]*f|(^|[;&|][[:space:]]*)(sudo[[:space:]]+)?rm[[:space:]]+-[^[:space:]]*f[^[:space:]]*r' <<<"$c"; then
    printf '%s' 'recursive forced deletion detected (rm -rf/rm -fr style)'; return 0
  fi

  # Disk / block devices.
  if grep -Eqi '(^|[[:space:];|&])(sudo[[:space:]]+)?(mkfs([.][[:alnum:]_-]+)?|fdisk|parted)([[:space:];|&]|$)' <<<"$c"; then
    printf '%s' 'disk formatting or partitioning command detected'; return 0
  fi
  if grep -Eqi '(^|[[:space:];|&])(sudo[[:space:]]+)?dd[[:space:]][^;&|]*of=/dev/(sd|nvme|vd|xvd|mmcblk)' <<<"$c"; then
    printf '%s' 'raw write to a block device detected'; return 0
  fi

  # SQL.
  if grep -Eqi 'DROP[[:space:]]+(DATABASE|SCHEMA|TABLE)([[:space:];]|$)' <<<"$c"; then
    printf '%s' 'destructive SQL DROP operation detected'; return 0
  fi
  if grep -Eqi 'TRUNCATE[[:space:]]+TABLE([[:space:];]|$)' <<<"$c"; then
    printf '%s' 'destructive SQL TRUNCATE operation detected'; return 0
  fi

  # Docker.
  if grep -Eqi '(^|[[:space:];|&])docker[[:space:]]+system[[:space:]]+prune[^;&|]*(^|[[:space:]])-a([[:space:];|&]|$)' <<<"$c"; then
    printf '%s' 'docker system prune -a can remove broad local state'; return 0
  fi
  if grep -Eqi '(^|[[:space:];|&])docker[[:space:]]+volume[[:space:]]+prune([[:space:];|&]|$)' <<<"$c"; then
    printf '%s' 'docker volume prune can remove persistent data'; return 0
  fi
  if grep -Eqi '(^|[[:space:];|&])(docker[[:space:]]+compose|docker-compose)[[:space:]]+down[^;&|]*(^|[[:space:]])(-v|--volumes)([[:space:];|&]|$)' <<<"$c"; then
    printf '%s' 'docker compose down with volume removal can delete persistent data'; return 0
  fi

  return 1
}

emit_ask() {
  local reason="$1"

  if command -v jq >/dev/null 2>&1; then
    jq -n --arg r "User-level safety guard: $reason. Review the exact command before allowing it." \
      '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"ask",permissionDecisionReason:$r}}'
    return 0
  fi

  local py
  for py in python3 python; do
    if command -v "$py" >/dev/null 2>&1 &&
       REASON="$reason" "$py" - <<'PY' >/tmp/.copilot_hook_output.$$ 2>/dev/null
import json, os
reason = os.environ["REASON"]
print(json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "ask",
        "permissionDecisionReason": (
            f"User-level safety guard: {reason}. "
            "Review the exact command before allowing it."
        )
    }
}))
PY
    then
      cat /tmp/.copilot_hook_output.$$
      rm -f /tmp/.copilot_hook_output.$$
      return 0
    fi
    rm -f /tmp/.copilot_hook_output.$$ 2>/dev/null || true
  done

  if command -v node >/dev/null 2>&1; then
    REASON="$reason" node - <<'JS'
const reason = process.env.REASON;
console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "ask",
    permissionDecisionReason:
      `User-level safety guard: ${reason}. Review the exact command before allowing it.`
  }
}));
JS
    return $?
  fi

  emit_empty
}

if [[ -z "${INPUT//[[:space:]]/}" ]]; then
  emit_empty
  exit 0
fi

COMMANDS="$(extract_commands)" || {
  emit_empty
  exit 0
}

while IFS= read -r command; do
  [[ -z "$command" ]] && continue

  if reason="$(reason_for "$command")"; then
    emit_ask "$reason"
    exit 0
  fi
done <<<"$COMMANDS"

emit_empty
