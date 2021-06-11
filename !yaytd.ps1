[CmdletBinding(PositionalBinding=$false)]
Param(
    [switch] $update,
    [string] $dropbox = "",
    [string] $cache_dirname = "yaytd-cache"
)

Push-Location -Path $PSScriptRoot
if ($dropbox) {
    $dropbox = Join-Path -Path $dropbox -ChildPath $cache_dirname
    if (!(Test-Path -Path $dropbox)) {
        New-Item -ItemType Directory $dropbox
    }
    if (!(Test-Path -Path $cache_dirname)) {
        New-Item -ItemType Junction -Name $cache_dirname -Target $dropbox
    }
} elseif ($update) {
    & .\ThirdParty\youtube-dl -U
} elseif (!(Test-Path -Path $cache_dirname)) {
    Write-Host -Object "Please specify path to your Dropbox folder via -dropbox parameter"
    exit 1
}
Push-Location -Path "src"
if (!(Test-Path -Path "node_modules")) {
    & npm install
}
& npm start
Pop-Location
Pop-Location
return 0
