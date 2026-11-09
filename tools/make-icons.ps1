# Gera os ícones PNG do PWA (monograma "NE" geométrico, fundo #09090B).
# Uso (na raiz do projeto):  powershell -ExecutionPolicy Bypass -File tools\make-icons.ps1
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$out  = Join-Path $root "icons"
New-Item -ItemType Directory -Force -Path $out | Out-Null

function New-Icon([int]$size, [double]$content, [string]$name) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = "AntiAlias"
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml("#09090B"))   # sem transparência (exigido pelo iOS)

  $k = $size / 512.0 * $content                  # escala do desenho (content < 1 => zona segura "maskable")
  $ox = ($size - 512 * $k) / 2
  function P($x, $y) { New-Object System.Drawing.PointF ([single]($ox + $x * $k)), ([single]($ox + $y * $k)) }

  $pen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#F4F4F5")), ([single](30 * $k))
  $pen.LineJoin = "Miter"; $pen.StartCap = "Flat"; $pen.EndCap = "Flat"

  # N
  $white = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#F4F4F5"))
  $g.FillPolygon($white, [System.Drawing.PointF[]]@((P 103 342),(P 103 170),(P 135 170),(P 217 293),(P 217 170),(P 247 170),(P 247 342),(P 215 342),(P 133 219),(P 133 342)))
  # E
  $g.DrawLines($pen, @((P 394 170), (P 282 170), (P 282 342), (P 394 342)))
  $g.DrawLine($pen, (P 282 256), (P 378 256))
  # detalhe discreto (cinza metálico)
  $pen2 = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#71717A")), ([single](10 * $k))
  $g.DrawLine($pen2, (P 118 392), (P 394 392))

  $bmp.Save((Join-Path $out $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
  "ok  icons/$name"
}

New-Icon 180 1.0 "apple-touch-icon.png"
New-Icon 192 1.0 "icon-192.png"
New-Icon 512 1.0 "icon-512.png"
New-Icon 512 0.72 "icon-maskable-512.png"

