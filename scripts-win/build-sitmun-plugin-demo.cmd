@ECHO OFF
ng build sitmun-plugin-demo
IF EXIST '.\dist\sitmun-plugin-demo\geoadmin-module-lib' GOTO COPYRESOURCES
md '.\dist\sitmun-plugin-demo\geoadmin-module-lib'
:COPYRESOURCES
xcopy '.\src\main\angular-library\projects\sitmun-plugin-demo\src\lib\geoadmin-module\geoadmin-module-lib' '.\dist\sitmun-plugin-demo\'