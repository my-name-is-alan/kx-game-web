@echo off
echo start to set errorcode
@set SRC_PATH=%~dp0common\errorcode.lua
@set COM_PATH=%~dp0common\commonconst.lua
@set VAL_PATH=%~dp0..\assets\Script\Values\PErrCode.ts
@set STR_PATH=%~dp0..\assets\Script\Values\StrVal.ts

@perl %~dp0libs\gen_helper.pl errorcode -src_path %SRC_PATH% -com_path %COM_PATH% -val_path %VAL_PATH% -str_path %STR_PATH%
pause