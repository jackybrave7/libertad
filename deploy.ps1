# Deploy local site folder to Sweb FTP via WinSCP.
# Reads deploy.config (key=value) from this script's directory.
# Uses WinSCP "synchronize remote" - only changed files are uploaded.

$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Deploy to libertad-theater.ru"               -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# --- Find WinSCP.com ---
$winscpCandidates = @(
    "${env:ProgramFiles(x86)}\WinSCP\WinSCP.com",
    "$env:ProgramFiles\WinSCP\WinSCP.com",
    "$env:LOCALAPPDATA\Programs\WinSCP\WinSCP.com"
)
$winscp = $null
foreach ($p in $winscpCandidates) {
    if (Test-Path $p) { $winscp = $p; break }
}
if (-not $winscp) {
    Write-Host "[ERROR] WinSCP.com not found. Install from https://winscp.net" -ForegroundColor Red
    exit 1
}

# --- Load deploy.config ---
$cfgPath = Join-Path $root 'deploy.config'
if (-not (Test-Path $cfgPath)) {
    Write-Host "[ERROR] deploy.config not found next to deploy.ps1" -ForegroundColor Red
    Write-Host "Copy deploy.config.example to deploy.config and fill it in."
    exit 1
}

$cfg = @{}
Get-Content $cfgPath -Encoding UTF8 | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq '') { return }
    if ($line.StartsWith('#')) { return }
    $eq = $line.IndexOf('=')
    if ($eq -lt 1) { return }
    $key = $line.Substring(0, $eq).Trim()
    $val = $line.Substring($eq + 1).Trim()
    $cfg[$key] = $val
}

foreach ($required in @('FTP_HOST','FTP_USER','FTP_PASS')) {
    if (-not $cfg.ContainsKey($required) -or [string]::IsNullOrWhiteSpace($cfg[$required])) {
        Write-Host "[ERROR] deploy.config: $required is missing" -ForegroundColor Red
        exit 1
    }
}
if (-not $cfg.ContainsKey('FTP_REMOTE_DIR') -or [string]::IsNullOrWhiteSpace($cfg['FTP_REMOTE_DIR'])) {
    $cfg['FTP_REMOTE_DIR'] = '/'
}
if (-not $cfg.ContainsKey('FTP_PROTOCOL') -or [string]::IsNullOrWhiteSpace($cfg['FTP_PROTOCOL'])) {
    $cfg['FTP_PROTOCOL'] = 'ftp'
}

Write-Host ("Host:      {0}" -f $cfg['FTP_HOST'])
Write-Host ("User:      {0}" -f $cfg['FTP_USER'])
Write-Host ("Remote:    {0}" -f $cfg['FTP_REMOTE_DIR'])
Write-Host ("Protocol:  {0}" -f $cfg['FTP_PROTOCOL'])
Write-Host ("Local:     {0}" -f $root)
Write-Host ""

# --- Escape user/password for WinSCP script (double-quote inside "..." -> "") ---
function Escape-WinScpArg($s) { return ($s -replace '"','""') }
$wsUser = Escape-WinScpArg $cfg['FTP_USER']
$wsPass = Escape-WinScpArg $cfg['FTP_PASS']
$openLine = ('open {0}://{1}/ -username="{2}" -password="{3}" -timeout=30' -f $cfg['FTP_PROTOCOL'], $cfg['FTP_HOST'], $wsUser, $wsPass)

# --- Files / dirs that must NOT be deployed ---
$excludeList = @(
    '.git/'
    '.github/'
    '.claude/'
    'node_modules/'
    'deploy.bat'
    'deploy.ps1'
    'deploy.config'
    'deploy.config.example'
    'deploy.log'
    'libertad-tmp.html'
    'style-main.css'
    'style-fixes.css'
    '*.md'
    '*.py'
    '*.gs'
    '*.bak'
    '*.tmp'
    '*.log'
    '.DS_Store'
    'Thumbs.db'
    'desktop.ini'
)
$excludes = [string]::Join('; ', $excludeList)

# --- Build the WinSCP script ---
$scriptPath = Join-Path $env:TEMP ("deploy_libertad_{0}.txt" -f (Get-Random))
$winscpLines = @(
    'option batch on'
    'option confirm off'
    'option reconnecttime 30'
    $openLine
    ('synchronize remote -mirror=off -delete=off -criteria=size,time -filemask="| {0}" "{1}" "{2}"' -f $excludes, $root, $cfg['FTP_REMOTE_DIR'])
    'close'
    'exit'
)
Set-Content -Path $scriptPath -Value $winscpLines -Encoding UTF8

Write-Host "Connecting and comparing files..."
Write-Host "(first run may take a minute)"
Write-Host ""

$logPath = Join-Path $root 'deploy.log'
& $winscp /log=$logPath /loglevel=0 /ini=nul /script=$scriptPath
$rc = $LASTEXITCODE

Remove-Item $scriptPath -ErrorAction SilentlyContinue

Write-Host ""
if ($rc -eq 0) {
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  [OK] Deploy finished successfully."          -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
} else {
    Write-Host "============================================" -ForegroundColor Red
    Write-Host ("  [ERROR] WinSCP exit code {0}." -f $rc)      -ForegroundColor Red
    Write-Host "  See deploy.log for details."                 -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
}
Write-Host ""
exit $rc
