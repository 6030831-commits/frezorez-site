' Запуск ночного сбора позиций БЕЗ окна консоли.
' Планировщик, запуская node.exe в сеансе пользователя, показывает чёрный
' терминал — он вылезал поверх работы (2026-08-09). Run(..., 0, False) не
' показывает окно вообще.
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
site = fso.GetParentFolderName(fso.GetParentFolderName(WScript.ScriptFullName))
sh.CurrentDirectory = site
sh.Run """C:\Program Files\nodejs\node.exe"" --env-file=.env scripts/track-positions.mjs", 0, False
