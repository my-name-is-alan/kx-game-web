@echo off
echo start to gen proto bin file
@set SRC_PATH=%~dp0common\protos\parser.lua
@set DST_PATH=%~dp0..\assets\resources\proto\sp.bin

@perl %~dp0libs\gen_helper.pl genprotobin -dir_src %SRC_PATH% -dir_dst %DST_PATH%
pause