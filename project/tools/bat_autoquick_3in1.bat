echo start to set errorcode
@set SRC_PATH=%~dp0common\errorcode.lua
@set COM_PATH=%~dp0common\commonconst.lua
@set VAL_PATH=%~dp0..\assets\Script\Values\PErrCode.ts
@set STR_PATH=%~dp0..\assets\Script\Values\StrVal.ts
@perl %~dp0libs\gen_helper.pl errorcode -src_path %SRC_PATH% -com_path %COM_PATH% -val_path %VAL_PATH% -str_path %STR_PATH%

echo start to gen proto bin file
@set SRC_PATH=%~dp0common\protos\parser.lua
@set DST_PATH=%~dp0..\assets\resources\proto\sp.bin
@perl %~dp0libs\gen_helper.pl genprotobin -dir_src %SRC_PATH% -dir_dst %DST_PATH%

echo start to trans text
@set SRC_PATH=%~dp0common\xmls\
@set DST_PATH=%~dp0..\assets\resources\data\
@perl %~dp0libs\gen_helper.pl xmltojson -dir_src %SRC_PATH% -dir_dst %DST_PATH%
pause