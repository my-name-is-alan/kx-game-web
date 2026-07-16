@set SRC_PATH=%~dp0..\build\
@set DST_PATH=%~dp0\
@perl %~dp0libs\gen_helper.pl genpackage -dir_src %SRC_PATH% -dir_dst %DST_PATH%
@REM %errorlevel% == 0
@pause