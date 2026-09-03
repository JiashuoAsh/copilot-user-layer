# Cross-project destructive-command guard for VS Code Agent Hooks.
# Windows runner: PowerShell 5.1 compatible.
#
# IMPORTANT:
# The shell used by the VS Code terminal does not matter here. This script can
# inspect Bash/Git Bash command text (rm -rf, git clean, etc.) even though the
# hook runner itself is PowerShell.
#
# Reads PreToolUse JSON from stdin and returns permissionDecision=ask for
# high-confidence destructive command patterns.
#
# Guardrail only; not a security sandbox.

$ErrorActionPreference = "Stop"

function Emit-Json {
    param([hashtable]$Object)
    $Object | ConvertTo-Json -Depth 12 -Compress | Write-Output
}

function Get-CommandStrings {
    param($Object)

    $result = New-Object System.Collections.Generic.List[string]

    function Walk-Node {
        param($Node)

        if ($null -eq $Node -or $Node -is [string]) { return }

        foreach ($prop in $Node.PSObject.Properties) {
            $name = [string]$prop.Name
            $value = $prop.Value

            if ($name -match '^(?i:command|commands|cmd|script|shellCommand|shell_command)$') {
                if ($value -is [string]) {
                    $result.Add($value)
                }
                elseif ($value -is [System.Collections.IEnumerable]) {
                    foreach ($item in $value) {
                        if ($item -is [string]) { $result.Add($item) }
                    }
                }
            }
            elseif ($null -ne $value -and $value -isnot [string]) {
                Walk-Node $value
            }
        }
    }

    Walk-Node $Object
    return $result
}

function Get-DestructiveReason {
    param([string]$Command)

    if ([string]::IsNullOrWhiteSpace($Command)) { return $null }

    # Git: local work loss / history rewrite.
    if ($Command -match '(?i)\bgit\s+reset\s+--hard\b') {
        return "git reset --hard can discard local changes"
    }
    if ($Command -match '(?i)\bgit\s+clean\b[^\r\n]*\s-[^\r\n\s]*f') {
        return "forced git clean can permanently remove untracked files"
    }
    if ($Command -match '(?i)\bgit\s+(checkout|restore)\b[^\r\n]*--\s*(?:\.|\*)\s*(?:$|[;&|])') {
        return "broad git checkout/restore can discard local changes"
    }
    if ($Command -match '(?i)\bgit\s+restore\b[^\r\n]*(?:^|\s)(?:\.|\*)\s*(?:$|[;&|])') {
        return "broad git restore can discard local changes"
    }
    if ($Command -match '(?i)\bgit\s+push\b[^\r\n]*(--force(?:-with-lease)?|-f\b)') {
        return "force-push can rewrite remote history"
    }
    if ($Command -match '(?i)\bgit\s+stash\s+(clear|drop)\b') {
        return "stash clear/drop can remove saved work"
    }

    # Bash / POSIX deletion (also catches Git Bash command text on Windows).
    if ($Command -match '(?i)(?:^|[;&|]\s*)(?:sudo\s+)?rm\s+-[A-Za-z]*r[A-Za-z]*f[A-Za-z]*\b') {
        return "recursive forced deletion detected (rm -rf style)"
    }
    if ($Command -match '(?i)(?:^|[;&|]\s*)(?:sudo\s+)?rm\s+-[A-Za-z]*f[A-Za-z]*r[A-Za-z]*\b') {
        return "recursive forced deletion detected (rm -fr style)"
    }

    # PowerShell / cmd deletion.
    if (($Command -match '(?i)\bRemove-Item\b') -and
        ($Command -match '(?i)(?:-Recurse|-r\b)') -and
        ($Command -match '(?i)(?:-Force|-f\b)')) {
        return "recursive forced deletion detected (Remove-Item)"
    }
    if ($Command -match '(?i)\b(?:rd|rmdir)\s+/s\b[^\r\n]*/q\b') {
        return "recursive quiet directory deletion detected"
    }
    if ($Command -match '(?i)\bdel\s+/s\b[^\r\n]*/q\b') {
        return "recursive quiet file deletion detected"
    }

    # Disk / block-device destructive operations.
    if ($Command -match '(?i)\b(?:Clear-Disk|Remove-Partition|Format-Volume)\b') {
        return "disk or partition destructive operation detected"
    }
    if ($Command -match '(?i)(?:^|[;&|]\s*)(?:format|diskpart)(?:\.exe)?\b') {
        return "disk formatting or partitioning command detected"
    }
    if ($Command -match '(?i)(?:^|[;&|]\s*)(?:sudo\s+)?(?:mkfs(?:\.[A-Za-z0-9_-]+)?|fdisk|parted)\b') {
        return "Linux disk formatting or partitioning command detected"
    }
    if ($Command -match '(?i)(?:^|[;&|]\s*)(?:sudo\s+)?dd\b[^\r\n]*\bof=/dev/(?:sd|nvme|vd|xvd|mmcblk)') {
        return "raw write to a block device detected"
    }

    # Database destructive operations.
    if ($Command -match '(?i)\bDROP\s+(?:DATABASE|SCHEMA|TABLE)\b') {
        return "destructive SQL DROP operation detected"
    }
    if ($Command -match '(?i)\bTRUNCATE\s+TABLE\b') {
        return "destructive SQL TRUNCATE operation detected"
    }

    # Docker state/data cleanup.
    if ($Command -match '(?i)\bdocker\s+system\s+prune\b[^\r\n]*\s-a\b') {
        return "docker system prune -a can remove broad local state"
    }
    if ($Command -match '(?i)\bdocker\s+volume\s+prune\b') {
        return "docker volume prune can remove persistent data"
    }
    if ($Command -match '(?i)\bdocker(?:\s+compose|-compose)\s+down\b[^\r\n]*(?:-v|--volumes)\b') {
        return "docker compose down with volume removal can delete persistent data"
    }

    return $null
}

try {
    $raw = [Console]::In.ReadToEnd()

    if ([string]::IsNullOrWhiteSpace($raw)) {
        Emit-Json @{}
        exit 0
    }

    # Windows PowerShell 5.1: ConvertFrom-Json has no -Depth parameter.
    $event = $raw | ConvertFrom-Json

    if ($event.hook_event_name -and $event.hook_event_name -ne "PreToolUse") {
        Emit-Json @{}
        exit 0
    }

    $commands = @(Get-CommandStrings $event.tool_input)
    if ($commands.Count -eq 0) {
        Emit-Json @{}
        exit 0
    }

    foreach ($command in $commands) {
        $reason = Get-DestructiveReason $command
        if ($reason) {
            Emit-Json @{
                hookSpecificOutput = @{
                    hookEventName = "PreToolUse"
                    permissionDecision = "ask"
                    permissionDecisionReason = "User-level safety guard: $reason. Review the exact command before allowing it."
                }
            }
            exit 0
        }
    }

    Emit-Json @{}
}
catch {
    # Preview API / schema mismatch should not disable every agent tool.
    Emit-Json @{}
    exit 0
}
