@set SRC_PATH=%~dp0\patches_src\
@set DST_PATH=%~dp0\patches_dst\
@perl %~dp0libs\gen_helper.pl genpatches -dir_src %SRC_PATH% -dir_dst %DST_PATH%
@REM %errorlevel% == 0
@pause