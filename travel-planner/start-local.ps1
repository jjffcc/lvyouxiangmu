$ErrorActionPreference = 'Stop'

# Keep a WSL session open: systemd services alone do not prevent WSL idle shutdown.
$databaseProcess = Get-CimInstance Win32_Process -Filter "Name = 'wsl.exe'" |
    Where-Object { $_.CommandLine -like '*service postgresql start && exec sleep infinity*' }
if (-not $databaseProcess) {
    Start-Process -FilePath 'wsl.exe' `
        -ArgumentList '-d Ubuntu -u root -- sh -c "service postgresql start && exec sleep infinity"' `
        -WindowStyle Hidden `
        -RedirectStandardOutput (Join-Path $env:TEMP 'tujian-database.log') `
        -RedirectStandardError (Join-Path $env:TEMP 'tujian-database.error.log')
}

$databaseReady = $false
for ($attempt = 0; $attempt -lt 30; $attempt++) {
    & wsl.exe -d Ubuntu -u root -- pg_isready -h 127.0.0.1 -p 5432 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $databaseReady = $true
        break
    }
    Start-Sleep -Seconds 1
}
if (-not $databaseReady) {
    throw "PostgreSQL startup did not finish. See tujian-database*.log in $env:TEMP."
}

$servers = @(
    @{ Name = 'api'; Port = 3000; Command = 'npm run dev:api' },
    @{ Name = 'frontend'; Port = 5173; Command = 'npm run dev --workspace frontend -- --host 127.0.0.1 --port 5173 --strictPort' }
)

foreach ($server in $servers) {
    $listener = Get-NetTCPConnection -LocalPort $server.Port -State Listen -ErrorAction SilentlyContinue
    if ($listener) { continue }

    $outputLog = Join-Path $env:TEMP "tujian-$($server.Name).log"
    $errorLog = Join-Path $env:TEMP "tujian-$($server.Name).error.log"
    Start-Process -FilePath $env:ComSpec `
        -ArgumentList '/d', '/c', $server.Command `
        -WorkingDirectory $PSScriptRoot `
        -WindowStyle Hidden `
        -RedirectStandardOutput $outputLog `
        -RedirectStandardError $errorLog
}

$ready = $false
for ($attempt = 0; $attempt -lt 30; $attempt++) {
    $api = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
    $frontend = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
    if ($api -and $frontend) {
        $ready = $true
        break
    }
    Start-Sleep -Seconds 1
}

if (-not $ready) {
    throw "Website startup did not finish. See tujian-*.log in $env:TEMP."
}

Write-Host 'Website ready: http://127.0.0.1:5173/'
