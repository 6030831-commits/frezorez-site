@echo off
REM Ежедневный трекинг позиций frezorez.ru. Запускается Планировщиком Windows.
cd /d "C:\Users\60308\Desktop\Frezorez_новая_сборка\frezorez-site\site"
"C:\Program Files\nodejs\node.exe" --env-file=.env scripts/track-positions.mjs >> "scripts\track-positions.log" 2>&1
