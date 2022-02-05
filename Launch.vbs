Dim objFSO
Set objFSO = CreateObject("Scripting.FileSystemObject")
Dim CurrentDirectory
CurrentDirectory = objFSO.GetAbsolutePathName(".")

Set WshShell = CreateObject("WScript.Shell") 
WshShell.Run chr(34) & CurrentDirectory & "\startup.bat" & Chr(34), 0
Set WshShell = Nothing