[CmdletBinding(PositionalBinding=$false)]
Param(
    [switch] $update,
    [string] $dropbox = ""
)

$cache_dirname = "yaytd-cache"
$ytdl_filename = "youtube-dl"

Push-Location -Path $PSScriptRoot

# Download official youtube-dl and save it locally
if (!(Test-Path -Path "ThirdParty")) {
    New-Item -ItemType Directory "ThirdParty"
}
Push-Location -Path "ThirdParty"
if ($IsWindows -or $ENV:OS) { $ytdl_filename += ".exe" }
if (!(Test-Path -Path ".\$ytdl_filename")) {
    $official_ytdl = "https://api.github.com/repos/ytdl-org/youtube-dl/releases/latest"
    $assets = Invoke-WebRequest -UseBasicParsing $official_ytdl |
              ConvertFrom-Json |
              Select -Expand assets;
    foreach ($asset in $assets) {
        if ($asset.name -ne $ytdl_filename) { continue }
        $official_ytdl = $asset.browser_download_url
        Write-Host -Object "Downloading: $official_ytdl"
        Invoke-WebRequest -UseBasicParsing -Uri $official_ytdl -OutFile $ytdl_filename
    }
}
Pop-Location

# Setup cache subsystem with Dropbox.
if ($dropbox) {
    $dropbox = Join-Path -Path $dropbox -ChildPath $cache_dirname
    if (!(Test-Path -Path $dropbox)) {
        New-Item -ItemType Directory $dropbox
    }
    if (!(Test-Path -Path $cache_dirname)) {
        New-Item -ItemType Junction -Name $cache_dirname -Target $dropbox
    }
} elseif ($update) {
    # Self-update youtube-dl via builtin updater (if there is a newer version).
    & .\ThirdParty\youtube-dl -U
} elseif (!(Test-Path -Path $cache_dirname)) {
    Write-Host -Object "Please specify path to your Dropbox folder via -dropbox parameter"
    exit 1
}

# Lift off.
Push-Location -Path "src"
if (!(Test-Path -Path "node_modules")) {
    & npm install
}
& npm start
Pop-Location

Pop-Location
return 0
