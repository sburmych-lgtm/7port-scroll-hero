# PowerShell Frame Extraction Script for Windows
Write-Host "🎬 [Asset Pipeline] Starting Frame Extraction..." -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir
$videoPath = Join-Path $rootDir "Video_scroll.MOV"
$outputDir = Join-Path $rootDir "public\frames"

if (!(Test-Path $videoPath)) {
    Write-Error "Video not found at: $videoPath"
    exit 1
}

if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$outputPattern = Join-Path $outputDir "frame_%04d.webp"
Write-Host "⚙️ Running FFmpeg (30fps WebP q=78 Lanczos)..." -ForegroundColor Yellow

ffmpeg -y -i "$videoPath" -vf "fps=30,scale=1920:1080:flags=lanczos" -c:v libwebp -lossless 0 -q:v 78 -compression_level 6 -preset photo "$outputPattern"

$frames = Get-ChildItem (Join-Path $outputDir "frame_*.webp")
$count = $frames.Count
$totalSize = ($frames | Measure-Object -Property Length -Sum).Sum / 1MB

Write-Host "✅ Extracted $count frames! Total size: $([math]::Round($totalSize, 2)) MB" -ForegroundColor Green

# Generate manifest
$manifest = @{
    totalFrames = $count
    fps = 30
    width = 1920
    height = 1080
    format = "webp"
    pattern = "frames/frame_{index}.webp"
    finalShot = @{
        src = "Final_shot.png"
        width = 1672
        height = 941
    }
    generatedAt = (Get-Date).ToString("o")
} | ConvertTo-Json -Depth 3

Set-Content -Path (Join-Path $outputDir "manifest.json") -Value $manifest -Encoding UTF8
Write-Host "📄 Manifest created at: $outputDir\manifest.json" -ForegroundColor Cyan
