//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { PlatformAPI, ServerItem, ServerStatus } from "../Kernel/PlatformAPI";
import { GameServer } from "../Kernel/GameServer";
import { LyLoginNotice } from "./LyLoginNotice";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { LyLoginServerList } from "./LyLoginServerList";
import { PErrCode } from "../Values/PErrCode";
import { AudioManager } from "../Kernel/AudioManager";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { LocaleUser } from "../Kernel/LocaleUser";
import { assetManager, sys } from "cc";
import { UtilsTool } from "../Kernel/UtilsTool";

export class LyLogin extends ViewLayer {

    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = "LyLogin";
        this.viewResI.pkgName = "LyLogin";
        this.viewResI.comName = "LyLogin";
    }

    private userInfo:any;
    private serverItem:ServerItem;

    private btn_sign:fgui.GButton;
    private btn_server:fgui.GButton;

    private autoDoneCall:Function;

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {
        AudioManager.playBGM(VarVal.AUDIO_SOURCE.BGM_LOGIN);
        let getUiPanel:fgui.GComponent = this.getUiPanel();

        if (params) {
            this.autoDoneCall = params.autoDoneCall;
        }

        // 公告
        let btn_notice:fgui.GButton = getUiPanel.getChild("btn_notice");
        btn_notice.text = StrVal.LYLOGIN.STR10;
        btn_notice.onClick(() => {
            this.onNoticeClick(true);
        })

        // 清理缓存
        let btn_clear:fgui.GButton = getUiPanel.getChild("btn_clear");
        btn_clear.text = StrVal.LYLOGIN.STR11;
        btn_clear.onClick(() => {
            UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "", 
            StrVal.COMMON.STR25, null, 
            StrVal.COMMON.STR32, null, 
            StrVal.COMMON.STR33, () => {
                let clickTimes = LocaleUser.getGlobal("CHOOSE_CLEANCACHEONE")
                clickTimes = clickTimes != undefined ? clickTimes: "0"
                clickTimes = String(Number(clickTimes) + 1)
                if (clickTimes != "3") {
                    if (clickTimes == "1") {
                        PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.CHOOSE_CLEANCACHEONE)
                    }else if(clickTimes == "2"){
                        PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.CHOOSE_CLEANCACHETWO)
                    }
                    LocaleUser.setGlobal("CHOOSE_CLEANCACHEONE", clickTimes)
                    LocaleUser.flush()
                }
                if (assetManager.cacheManager) {
                    assetManager.cacheManager.clearCache();
                    console.log("cacheManager -> clearCache");
                }
                UtilsUI.lockMask();
                this.setTimeout(() => {
                    UtilsUI.unlockMask();
                    UtilsUI.restartGame();
                }, 1000);
            }, "", null)
        })

        // 版权信息
        let label_copyright:fgui.GLabel = getUiPanel.getChild("label_copyright");
        label_copyright.text = PlatformAPI.getCopyrightText();

        // 切换账号
        this.btn_sign = getUiPanel.getChild("btn_sign");
        this.btn_sign.onClick(() => {
            this.onSignClick();
        });
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            this.btn_sign.visible = false;
        }

        // 选择服务器
        this.btn_server = getUiPanel.getChild("btn_server");
        this.btn_server.onClick(() => {
            this.onServerClick();
        });

        // 进入游戏
        let btn_login:fgui.GButton = getUiPanel.getChild("btn_login");
        btn_login.onClick(() => {
            let clickTimes = LocaleUser.getGlobal("onEnterGameClick")
            clickTimes = clickTimes != undefined ? clickTimes: "0"
            clickTimes = String(Number(clickTimes) + 1)
            if (clickTimes != "3") {
                if (clickTimes == "1") {
                    PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.JOIN_ONE)
                }else if(clickTimes == "2"){
                    PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.JOIN_TWO)
                }
                LocaleUser.setGlobal("onEnterGameClick", clickTimes)
                LocaleUser.flush()
            }
            this.onEnterGameClick(true);
        });

        // 版本号
        let label_version:fgui.GLabel = getUiPanel.getChild("label_version");
        label_version.text = PlatformAPI.getFullVersion();

        if (!this.autoDoneCall) {
            this.addFullSpine();
        }

        this.setUserInfo(null); // 显示未登录
        this.setServerInfo(); // 显示选择服务器
        this.getServersFirst();
        PlatformAPI.doSdkOnShareGame();
        PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.CHOOSE_SHOW)
    }

    private addFullSpine():void {
        let getUiPanel:fgui.GComponent = this.getUiPanel();
        new SpinePlayer().loadSpine(null, getUiPanel.getChild("loader_spine", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_login);
    }

    private doAutoFailCall(isDone:boolean):void {
        if (this.autoDoneCall) {
            this.autoDoneCall();
            this.autoDoneCall = undefined;
            if (!isDone) {
                this.addFullSpine();
            }
        }
    }

    private getServersFirstIter(errmsg:string):void {
        UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_ONE, "", 
        errmsg, null, 
        "", null, 
        "", null, 
        StrVal.COMMON.STR33, () =>  {
            this.getServersFirst();
        });
    }

    private getServersFirst():void {
        PlatformAPI.postSdkPointData(PlatformAPI.ASDK_TRACKID.INIT_SDK_DO);
        UtilsUI.lockWait();
		PlatformAPI.doSdkInit((args) => {
            UtilsUI.unlockWait();
			if (args.errmsg) {
                PlatformAPI.postSdkPointData(PlatformAPI.ASDK_TRACKID.INIT_SDK_FAIL);
                this.getServersFirstIter(args.errmsg);
                this.doAutoFailCall(false);
            } else {
                PlatformAPI.postSdkPointData(PlatformAPI.ASDK_TRACKID.INIT_SDK_SUCC);
				PlatformAPI.postSdkPointData(PlatformAPI.ASDK_TRACKID.LUNCH_LOGIN);
				PlatformAPI.doSdkLogin((_userInfo:any, _serverInfo:any) => {
                    if (_userInfo.errmsg) {
                        PlatformAPI.postSdkPointData(PlatformAPI.ASDK_TRACKID.LUNCH_LOGIN_FAIL);
                        this.getServersFirstIter(_userInfo.errmsg);
                        this.doAutoFailCall(false);
                    } else {
                        PlatformAPI.postSdkPointData(PlatformAPI.ASDK_TRACKID.LUNCH_LOGIN_SUCC);
                        // 刷新已登录显示
                        this.setUserInfo(_userInfo);
                        // 获得推荐服务器
                        this.setRecommendServerItem(_serverInfo.recommendId);
						// 定时更新服务器
						this.doSetTimeoutGetServerList();
                        // 弹出公告 || 直接进服务器
                        if (!this.autoDoneCall || sys.platform == sys.Platform.EDITOR_PAGE) { // 编辑器环境下忽略。
						    this.onNoticeClick(false);
                        } else {
                            this.onEnterGameClick(false);
                        }

						// 获取平台信息
                        /*
						PlatformAPI.doSdkPkgInfo((args) => {
                            if (args) {
								args.sysInfo = JSON.parse(args.sysInfo);
								appInfo = args;
                            }
                        })
                        */
                    }
                }, true)
            }
        })
    }

    private setUserInfo(_userInfo:any):void {
        this.userInfo = _userInfo;
        if (this.userInfo) {
            this.btn_sign.text = StrVal.LYLOGIN.STR3;
        } else {
            this.btn_sign.text = StrVal.LYLOGIN.STR2;
            this.serverItem = null; // 同时清除当前服务器
        }
    }

    private setServerInfo():void {
        if (this.serverItem) {
            this.serverItem = PlatformAPI.getGameServerItem(this.serverItem.serverId);
        }
        if (this.serverItem) {
            this.btn_server.text = this.serverItem.name;
        } else {
            this.btn_server.text = StrVal.LYLOGIN.STR5;
        }
    }

    /*
     * 即使是已登陆，也未必有选中服务器，但未登陆则肯定没有。
    */
    private setRecommendServerItem(serverId:number):void {
        this.serverItem = null;
        if (serverId && serverId > 0) {
            this.serverItem = PlatformAPI.getGameServerItem(serverId);
        }
        if (!this.serverItem) { // 最近登陆最近一个
            this.serverItem = PlatformAPI.getLastPlayerGameServerItem();
        }
        if (!this.serverItem) { // 状态4（推荐）ID最大的
            this.serverItem = PlatformAPI.getMaxIdGameServerItem(ServerStatus.RECOMMEND);
        }
        if (!this.serverItem) { // 状态3（新服）ID最大的
            this.serverItem = PlatformAPI.getMaxIdGameServerItem(ServerStatus.NEW);
        }
        if (!this.serverItem) { // ID最大的
            this.serverItem = PlatformAPI.getMaxIdGameServerItem(null);
        }
        this.setServerInfo();
    }

    private onSignClick():void {
        if (this.userInfo) {
            UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "", 
            StrVal.LYLOGIN.STR8, null, 
            StrVal.COMMON.STR32, null, 
            StrVal.COMMON.STR33, () => {
                PlatformAPI.doSdkLogout((args) => {
                    LocaleUser.setGlobal(VarVal.FIELD_SV.LOGIN_CH_ACC, "1");
                    LocaleUser.flush();
                    
                    this.setUserInfo(null);
                    this.setServerInfo();
                })
            }, "", null)
        } else {
            PlatformAPI.postSdkPointData(PlatformAPI.ASDK_TRACKID.LUNCH_LOGIN);
            PlatformAPI.doSdkLogin((_userInfo:any, _serverInfo:any) => {
                if (_userInfo.errmsg) {
                    PlatformAPI.postSdkPointData(PlatformAPI.ASDK_TRACKID.LUNCH_LOGIN_FAIL);
                    UtilsUI.showMsgTip(_userInfo.errmsg);
                } else {
                    PlatformAPI.postSdkPointData(PlatformAPI.ASDK_TRACKID.LUNCH_LOGIN_SUCC);
                    // 刷新已登录显示
                    this.setUserInfo(_userInfo);
                    // 获得推荐服务器
                    this.setRecommendServerItem(_serverInfo.recommendId);
                }
            }, false)
        }
    }

    private onServerClick():void {
        if (!this.userInfo) {
            this.onSignClick();
            return
        }

        PlatformAPI.getGameServerList((_userInfo:any, _serverInfo:any) => {
            if (_userInfo.errmsg) {
                UtilsUI.showMsgTip(_userInfo.errmsg);
            } else {
                // 刷新当前服务器
                if (this.serverItem) {
                    this.setRecommendServerItem(this.serverItem.serverId);
                }

                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyLoginServerList, 0, _serverInfo);
            }
        })
    }

    private onEnterGameClick(isClick:boolean):void {
        if (!this.userInfo) {
            this.onSignClick();
            return
        }
        PlatformAPI.getGameServerList((_userInfo:any, _serverInfo:any) => {
            if (_userInfo.errmsg) {
                this.doAutoFailCall(false);
                if (!isClick) {
                    this.onNoticeClick(false);
                }
                UtilsUI.showMsgTip(_userInfo.errmsg);
            } else {
                // 刷新当前服务器
                if (this.serverItem) {
                    this.setRecommendServerItem(this.serverItem.serverId);
                }
                
                if (!this.serverItem) {
                    this.doAutoFailCall(false);
                    if (!isClick) {
                        this.onNoticeClick(false);
                    }
                    this.onServerClick();
                    return
                }
                if (this.serverItem.status <= ServerStatus.WAIT) {
                    this.doAutoFailCall(false);
                    if (!isClick) {
                        this.onNoticeClick(false);
                    }

                    let desc:string = this.serverItem.desc;
                    if (!desc || desc.length == 0) {
                        if (this.serverItem.status == ServerStatus.WAIT) {
                            desc = UtilsTool.stringFormat(StrVal.COMMON.STR26, [this.serverItem.openTime]);
                        } else {
                            desc = StrVal.COMMON.STR11;
                        }
                    }
                    UtilsUI.showMsgTip(desc);
                    return;
                }
                
                UtilsUI.lockWait();
                GameServer.getInstance().connect((args) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0 || args.errorcode == PErrCode.user_login_nochar) {
                        if (args.errorcode == 0) {
                            this.doAutoFailCall(true);
                            
                            PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.LOGIN_SUCC);
                            let loginTimes = LocaleUser.getGlobal("GAMEPOINTLOGINSUCC")
                            loginTimes = loginTimes != undefined ? loginTimes: "0"
                            loginTimes = String(Number(loginTimes) + 1)
                            if (loginTimes != "4") {
                                if (loginTimes == "2") {
                                    PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.LOGIN_TWO)
                                }else if(loginTimes == "3"){
                                    PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.LOGIN_THREE)
                                }
                                LocaleUser.setGlobal("GAMEPOINTLOGINSUCC", loginTimes)
                                LocaleUser.flush()
                            }
                        }
                    } else {
                        this.doAutoFailCall(false);
                        if (!isClick) {
                            this.onNoticeClick(false);
                        }
                        UtilsUI.showMsgTip(args.errorcode);
                        
                        PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.CHOOSE_JOINFAIL);
                        this.setTimeout(()=>{
                            PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.CHOOSE_JOINFAILTHREE);
                        }, 3000)
                    }
                }, {
                    userInfo:this.userInfo,
                    serverItem:this.serverItem,
                })
            }
        }, this.autoDoneCall ? true : false)
    }

    private onNoticeClick(isClick:boolean):void {
        PlatformAPI.onAnnouncement((announcement:any) => {
            if (announcement) {
                PlatformAPI.postSdkPointData(PlatformAPI.ASDK_TRACKID.LUNCH_NOTICE_VIEW);
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyLoginNotice, 0, {notice: announcement});
            } else {
                if (isClick) {
                    UtilsUI.showMsgTip(StrVal.LYLOGIN.STR9);
                }
            }
        })
    }

    /*
     * 选服界面回调，选服界面弹出的前提是已登陆。
    */
    public onViewUpdate(params:any):void {
        this.setRecommendServerItem(params);
    }

    private doSetTimeoutGetServerList():void {
        this.setTimeout(() => {
            if (!this.isDisposed) { // 当前界面未被销毁
                if (this.userInfo) { // 未登出才获取
                    PlatformAPI.getGameServerList((_userInfo:any, _serverInfo:any) => {
                        if (!this.isDisposed && !_userInfo.errmsg && this.serverItem) {
                            // 刷新当前服务器
                            this.setRecommendServerItem(this.serverItem.serverId);
                        }
                    }, false, true)
                }
                this.doSetTimeoutGetServerList();
            }
        }, 20000)
    }

    /*
     * 界面被删除后调用。
    */
    public onViewDestroy():void {
        //
    }
}