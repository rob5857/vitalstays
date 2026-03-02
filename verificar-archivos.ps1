# Script de verificación para Vital Stays
# Ejecuta este script para verificar que todos los archivos están en su lugar

Write-Host "=== VERIFICACIÓN DE ARCHIVOS VITAL STAYS ===" -ForegroundColor Cyan
Write-Host ""

# Verificar carpeta js/
Write-Host "1. Verificando carpeta js/..." -ForegroundColor Yellow
if (Test-Path "js") {
    Write-Host "   ✓ Carpeta js/ existe" -ForegroundColor Green
    
    $jsFiles = @("admin.js", "supabaseClient.js", "listings.js", "script.js", "contacto.js")
    foreach ($file in $jsFiles) {
        if (Test-Path "js/$file") {
            $size = (Get-Item "js/$file").Length
            Write-Host "   ✓ js/$file existe ($size bytes)" -ForegroundColor Green
        } else {
            Write-Host "   ✗ js/$file NO EXISTE" -ForegroundColor Red
        }
    }
} else {
    Write-Host "   ✗ Carpeta js/ NO EXISTE" -ForegroundColor Red
}

Write-Host ""

# Verificar archivos HTML
Write-Host "2. Verificando archivos HTML..." -ForegroundColor Yellow
$htmlFiles = @("index.html", "listings.html", "apartment-detail.html", "contacto.html", "dashboard.html")
foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file existe" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $file NO EXISTE" -ForegroundColor Red
    }
}

Write-Host ""

# Verificar vercel.json
Write-Host "3. Verificando vercel.json..." -ForegroundColor Yellow
if (Test-Path "vercel.json") {
    Write-Host "   ✓ vercel.json existe" -ForegroundColor Green
} else {
    Write-Host "   ✗ vercel.json NO EXISTE" -ForegroundColor Red
}

Write-Host ""

# Verificar referencias en dashboard.html
Write-Host "4. Verificando referencias en dashboard.html..." -ForegroundColor Yellow
if (Test-Path "dashboard.html") {
    $content = Get-Content "dashboard.html" -Raw
    if ($content -match 'src="js/admin\.js"') {
        Write-Host "   ✓ dashboard.html referencia correctamente a js/admin.js" -ForegroundColor Green
    } else {
        Write-Host "   ✗ dashboard.html NO referencia correctamente a js/admin.js" -ForegroundColor Red
    }
    
    if ($content -match 'src="js/supabaseClient\.js"') {
        Write-Host "   ✓ dashboard.html referencia correctamente a js/supabaseClient.js" -ForegroundColor Green
    } else {
        Write-Host "   ✗ dashboard.html NO referencia correctamente a js/supabaseClient.js" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== VERIFICACIÓN COMPLETA ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si todos los checks están en verde ✓, puedes hacer deploy a Vercel." -ForegroundColor White
Write-Host ""
Write-Host "Para hacer deploy con Vercel CLI:" -ForegroundColor Yellow
Write-Host "  1. npm install -g vercel" -ForegroundColor White
Write-Host "  2. vercel login" -ForegroundColor White
Write-Host "  3. vercel --prod" -ForegroundColor White
Write-Host ""

