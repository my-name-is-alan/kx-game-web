$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$mail = Get-Content -Raw (Join-Path $root "project/assets/Script/Views/LyMail.ts")

function Assert-Match {
    param([string]$Text, [string]$Pattern, [string]$Message)
    if ($Text -notmatch $Pattern) {
        throw $Message
    }
}

Assert-Match $mail 'mailListLocked\s*:\s*boolean' "bulk mail lock is missing"
Assert-Match $mail 'if\s*\(this\.mailListLocked\)\s*return' "stale clicks are not blocked"
Assert-Match $mail 'this\.list_mails\.touchable\s*=\s*false' "mail list stays touchable while deleting"
Assert-Match $mail 'this\._partner\.callLater' "mail list unlock is not deferred"
Assert-Match $mail 'index\s*<\s*0\s*\|\|\s*index\s*>=\s*this\.mails\.length' "mail index bounds are not checked"
Assert-Match $mail '!mail\s*\|\|\s*mail\.id\s*==\s*null' "missing mail ID is not guarded"
Assert-Match $mail 'if\s*\(!mail\)\s*\{' "stale item rendering is not guarded"

Write-Output "MAIL_CLICK_RACE_CONTRACT_OK"
