@ECHO OFF
IF EXIST .\dist GOTO CHECKPLUGINDIR
md .\dist
:CHECKPLUGINDIR
IF EXIST .\dist\sitmun-plugin-demo\geoadmin-module-lib GOTO CHECKMODULEDIR
md .\dist\sitmun-plugin-demo
:CHECKMODULEDIR
IF EXIST .\dist\sitmun-plugin-demo\geoadmin-module-lib GOTO COPYRESOURCES
echo 'Create directory'
md .\dist\sitmun-plugin-demo\geoadmin-module-lib
:COPYRESOURCES
echo 'Copy resources'
xcopy .\src\main\angular-library\projects\sitmun-plugin-demo\src\lib\geoadmin-module\geoadmin-module-lib .\dist\sitmun-plugin-demo\geoadmin-module-lib /E /H /Y
ng build sitmun-plugin-demo