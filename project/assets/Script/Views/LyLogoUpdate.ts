//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { VarVal } from "../Values/VarVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { native, sys } from "cc";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { LyLogin } from "./LyLogin";
import { Md5 } from "../Protos/Md5";
import { LocaleUser } from "../Kernel/LocaleUser";
import JSZip from "jszip";

export class LyLogoUpdate extends ViewLayer {
    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = "LyLogoUpdate";
        this.viewResI.pkgName = "LyLogoUpdate";
        this.viewResI.comName = "LyLogoUpdate";
    }

    private label_text:fgui.GTextField;
    private bar_loading:fgui.GProgressBar;

    private FILE_MATCH:string = "match.txt";
    private matchFile:string;
    private patchFile:string;
    private patchTemp:string;

    private downloader:native.Downloader;
    private patchUrl:string;
    private patchMD5:string;

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {
        let uiPanel:fgui.GComponent = this.getUiPanel();
        let label_version:fgui.GTextField = uiPanel.getChild("label_version");
        label_version.text = PlatformAPI.getFullVersion();
        uiPanel.getChild("label_notice", fgui.GTextField).text = StrVal.LYLOGOUPDATE.STR102;
        this.label_text = uiPanel.getChild("label_text");
        this.label_text.text = StrVal.LYLOGOUPDATE.STR8;
        this.bar_loading = uiPanel.getChild("bar_loading");
        this.bar_loading.value = 100;

        if (sys.isNative) {
            this.matchFile = UtilsTool.stringFormat("{0}/{1}", [PlatformAPI.getSaveRootPath(), this.FILE_MATCH]);
            this.patchFile = UtilsTool.stringFormat("{0}/{1}", [PlatformAPI.getSaveRootPath(), PlatformAPI.getFilePatchZip()]);
            this.patchTemp = UtilsTool.stringFormat("{0}.tmp", [this.patchFile]);
        }
        this.doGetUpdateInfo();
    }

    /**
     * 获取更新服配置信息。
     */
    private doGetUpdateInfo():void {
        PlatformAPI.requestUpdateServerData((isDone:boolean, error:string) => {
            if (isDone) {
                if (PlatformAPI.isBinaryExpire()) {
                    UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_ONE, "", 
                    StrVal.LYLOGOUPDATE.STR2, null, 
                    "", null, 
                    "", null, 
                    StrVal.COMMON.STR34, () => {
                        this.doGetUpdateInfo(); // 这里后续改为跳转。
                    })
                } else {
                    // 原生平台更新，web、小游戏、编辑器不更新。
                    if (sys.isNative && PlatformAPI.isBinaryAllowUpdate()) {
                        let updateData:any = PlatformAPI.getUpdateData();
                        // 当前资源版本号。
                        let resVersion:string = PlatformAPI.getResVersion();
                        let isInVersion:boolean = false;
                        let headVersion:string = "";
                        for (let i = 0; i < updateData.versions.length; i++) {
                            let item:any = updateData.versions[i];
                            if (headVersion == "" || Number(item.ver) > Number(headVersion)) {
                                headVersion = item.ver;
                            }
                            if (Number(item.ver) == Number(resVersion)) {
                                isInVersion = true;
                                this.patchMD5 = item.md5;
                            }
                        }
                        if (isInVersion && resVersion != headVersion) {
                            // 获取更新文件。
                            let platPath = "win";
                            if (sys.os == sys.OS.ANDROID) {
                                platPath = "and";
                            } else if (sys.os == sys.OS.IOS) {
                                platPath = "ios";
                            }
                            let matchInfo:string = UtilsTool.stringFormat("{0}_{1}", [resVersion, headVersion]);
                            this.patchUrl = UtilsTool.stringFormat("{0}{1}/{2}.zip", [updateData.patchUrl, platPath, matchInfo]);
                            // 尝试清理更新残留。
                            let isExist1 = native.fileUtils.isFileExist(this.matchFile);
                            let isExist2 = native.fileUtils.isFileExist(this.patchTemp);
                            if (isExist1) {
                                if (isExist2) {
                                    let _matchInfo = native.fileUtils.getStringFromFile(this.matchFile);
                                    if (_matchInfo != matchInfo) { // 过期。
                                        native.fileUtils.removeFile(this.matchFile);
                                        native.fileUtils.removeFile(this.patchTemp);
                                    } else { // 断点续传。
                                        
                                    }
                                } else {
                                    native.fileUtils.removeFile(this.matchFile);
                                }
                            } else {
                                if (isExist2) {
                                    native.fileUtils.removeFile(this.patchTemp);
                                }
                            }
                            native.fileUtils.writeStringToFile(matchInfo, this.matchFile); // 如果有则覆盖。
                            this.bar_loading.value = 0;
                            this.onDataStart();
                        } else {
                            this.onEnterLogin();
                        }
                    } else {
                        this.onEnterLogin();
                    }
                }
            } else {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_ONE, "", 
                UtilsTool.stringFormat(StrVal.LYLOGOUPDATE.STR1, [error]), null, 
                "", null, 
                "", null, 
                StrVal.COMMON.STR34, () => {
                    this.doGetUpdateInfo();
                })
            }
        })
    }

    /**
     * 下载开始。
     */
    private onDataStart():void {
        PlatformAPI.postSdkPointData(PlatformAPI.ASDK_TRACKID.UPDATE_BEGINE);
        if (!this.downloader) {
            this.downloader = new native.Downloader();
            this.downloader.onError = (task: native.DownloadTask, errorCode: number, errorCodeInternal: number, errorStr: string) => {
                this.onDataResult(errorStr);
            };
            this.downloader.onProgress = (task: native.DownloadTask, bytesReceived: number, totalBytesReceived: number, totalBytesExpected: number) => {
                this.bar_loading.value = totalBytesReceived / totalBytesExpected * 100;
                let received:string = (totalBytesReceived / (1024 * 1024)).toFixed(2);
                let expected:string = (totalBytesExpected / (1024 * 1024)).toFixed(2);
                this.label_text.text = UtilsTool.stringFormat(StrVal.LYLOGOUPDATE.STR3, [received, expected]);
            };
            this.downloader.onSuccess = (task: native.DownloadTask) => {
                this.onDataResult();
                // 重启时可能导致引用未释放报错，危险。
                PlatformAPI.postSdkPointData(PlatformAPI.ASDK_TRACKID.UPDATE_END);
            };
        }
        this.downloader.createDownloadTask(this.patchUrl, this.patchFile);
    }

    /**
     * 解压补丁包。
     */
    private onDataResult(errmsg?:string):void {
        if (errmsg) {
            UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_ONE, "", 
            UtilsTool.stringFormat(StrVal.LYLOGOUPDATE.STR4, [errmsg]), null, 
            "", null, 
            "", null, 
            StrVal.COMMON.STR34, () => {
                this.onDataStart();
            })
        } else {
            // 校验文件完整。
            let isCorrectFile = false;
            if (native.fileUtils.isFileExist(this.patchFile)) {
                this.label_text.text = StrVal.LYLOGOUPDATE.STR6;
                let data = native.fileUtils.getDataFromFile(this.patchFile);
                let dataView = new DataView(data);
                let u8a = new Uint8Array(dataView.buffer, dataView.byteOffset, dataView.byteLength);
                let md5 = new Md5().start().appendByteArray(u8a).end();
                if (this.patchMD5 == "*" || md5 == this.patchMD5) {
                    isCorrectFile = true;
                } else {
                    native.fileUtils.removeFile(this.patchFile);
                }
            }
            if (isCorrectFile) {
                native.fileUtils.removeFile(this.matchFile);
                // 解压。
                /*
                new JSZip()，里面require'stream'失败，会报错，但不影响，暂时忽略。
                ScriptEngine::evalString catch exception:
                ERROR: Uncaught Error: Failed to require file 'stream', not found!, location: (no filename):0:0
                */
                new JSZip().loadAsync(native.fileUtils.getDataFromFile(this.patchFile)).then((zip:JSZip) => {
                    let relativePaths = new Array<string>();
                    zip.forEach((relativePath: string, file: JSZip.JSZipObject) => {
                        relativePaths.push(relativePath);
                    })
                    this.writeDataList(zip, relativePaths, 0);
                })
            } else {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_ONE, "", 
                StrVal.LYLOGOUPDATE.STR5, null, 
                "", null, 
                "", null, 
                StrVal.COMMON.STR34, () => {
                    this.onDataStart();
                })
            }
        }
    }

    private writeDataList(zip:JSZip, relativePaths:Array<string>, idx:number):void {
        let relativePath = relativePaths[idx];
        let fullPath:string = UtilsTool.stringFormat("{0}/{1}", [PlatformAPI.getSaveRootPath(), relativePath]);
        idx = idx + 1;
        this.label_text.text = UtilsTool.stringFormat(StrVal.LYLOGOUPDATE.STR7, [idx, relativePaths.length, relativePath]);

        let file = zip.file(relativePath);
        file.async("arraybuffer").then((content) => {
            if (file.dir) {
                if (!native.fileUtils.isDirectoryExist(fullPath)) {
                    native.fileUtils.createDirectory(fullPath)
                }
            } else {
                let dir = native.fileUtils.getFileDir(fullPath);
                if (!native.fileUtils.isDirectoryExist(dir)) {
                    native.fileUtils.createDirectory(dir)
                }
                native.fileUtils.writeDataToFile(content, fullPath);
            }

            if (idx >= relativePaths.length) {
                // 删除压缩文件。
                native.fileUtils.removeFile(this.patchFile);
                // 重启。
                UtilsUI.restartGame();
            } else {
                this.writeDataList(zip, relativePaths, idx);
            }
        })
    }

    /**
     * 弹出登录页。
     */
    private onEnterLogin():void {
        let SDK_UUID = LocaleUser.getGlobal(VarVal.FIELD_SV.SDK_UUID);
        if (!SDK_UUID) {
            let uuid = String(Date.parse(new Date().toString())) + String(UtilsTool.random(100000, 999999));
            LocaleUser.setGlobal(VarVal.FIELD_SV.SDK_UUID, uuid);
            LocaleUser.flush();
        }
        if (SDK_UUID || sys.platform == sys.Platform.EDITOR_PAGE) { // 编辑器环境下忽略。
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyLogin, 0, null);
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyLogoUpdate, 0, null);
        } else {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyLogin, 0, {autoDoneCall:() => {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyLogoUpdate, 0, null);
            }});
        }
    }
}