# Engineering Safety Hook v2.2

Recommended for a Windows + Git Bash + Linux/Remote SSH workflow.

## Runtime design

- **Windows VS Code extension host** → `guard-destructive.ps1`
- **Linux/macOS extension host** → `guard-destructive.sh`
- The shell used in the integrated terminal does **not** determine which hook
  runner is selected.
- The Windows PowerShell guard still detects Bash/Git Bash command text such as
  `rm -rf`.
- The Bash guard tries `jq`, then `python3`, then `python`, then `node`. If a parser executable exists but fails, it continues to the next parser.

## Install

Place:

```text
~/.copilot/hooks/safety/
├── pretool-safety.json
├── guard-destructive.ps1
└── guard-destructive.sh
```

Register:

```json
"chat.hookFilesLocations": {
  "~/.copilot/hooks/safety": true
}
```

On Linux/macOS:

```bash
chmod +x ~/.copilot/hooks/safety/guard-destructive.sh
```

## Guarded high-confidence patterns

- destructive Git: `reset --hard`, forced `clean`, broad checkout/restore,
  force-push, stash clear/drop
- recursive forced deletion: `rm -rf` / `rm -fr`, Windows equivalents
- disk/block operations: `mkfs`, `fdisk`, `parted`, destructive Windows disk
  commands, raw `dd` writes to common block devices
- SQL: `DROP DATABASE/SCHEMA/TABLE`, `TRUNCATE TABLE`
- Docker: `system prune -a`, `volume prune`, `compose down -v`

The hook returns `ask`, not `deny`.

## Smoke tests

### Windows PowerShell runner

```powershell
'{"hook_event_name":"PreToolUse","tool_name":"run_in_terminal","tool_input":{"command":"rm -rf ./build"}}' |
powershell.exe -NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass `
  -File "$HOME\.copilot\hooks\safety\guard-destructive.ps1"
```

Expected: `permissionDecision = ask`.

### Git Bash / Linux Bash runner

```bash
printf '%s' \
'{"hook_event_name":"PreToolUse","tool_name":"run_in_terminal","tool_input":{"command":"rm -rf ./build"}}' |
bash ~/.copilot/hooks/safety/guard-destructive.sh
```

Expected: `permissionDecision = ask`.

Safe check:

```bash
printf '%s' \
'{"hook_event_name":"PreToolUse","tool_name":"run_in_terminal","tool_input":{"command":"echo hello"}}' |
bash ~/.copilot/hooks/safety/guard-destructive.sh
```

Expected: `{}`.

## Remote Linux

The remote Linux machine needs its own copy of the hook files under its own
`~/.copilot/hooks/safety/` if the extension host runs remotely.

No dependency should be installed solely for this hook. If `jq` is absent, it
uses `python3`; on Git Bash it can also use `python`. If none are available, the
hook fails open and normal VS Code permissions remain active.


## v2.2 parser fix

Git Bash can expose a `python` command that exists but is not actually usable in
the current shell. v2.1 treated mere command existence as sufficient and then
failed open when that parser failed.

v2.2 tries each available parser **successfully**, in order:

```text
jq -> python3 -> python -> node -> fail open
```

This makes manual Git Bash testing more robust while leaving the verified Windows
VS Code hook path on PowerShell.
