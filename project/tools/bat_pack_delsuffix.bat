@echo off
echo start to delete file by suffix
@set DST_PATH=E:\xinxingame\art\Ui
@set SUFFIX=psd
@perl %~dp0libs\gen_helper.pl delsuffixfile -dir_dst %DST_PATH% -suffix %SUFFIX%
pause