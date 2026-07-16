@echo off
echo start to trans text
@set SRC_PATH=%~dp0common\xmls\
@set DST_PATH=%~dp0..\assets\resources\data\

@perl %~dp0libs\gen_helper.pl xmltojson -dir_src %SRC_PATH% -dir_dst %DST_PATH%
pause