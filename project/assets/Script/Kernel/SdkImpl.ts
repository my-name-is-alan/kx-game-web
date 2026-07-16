//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { Md5 } from "../Protos/Md5";
import { VarVal } from "../Values/VarVal";
import { GameServerData } from "./GameServerData";
import { HTTP_METHOD, HttpClient, RESPONSE_TYPE } from "./HttpClient";
import { SdkAdapter } from "./SdkAdapter";
import { UtilsTool } from "./UtilsTool";
import { UtilsUI } from "./UtilsUI";
import { LocaleUser } from "./LocaleUser";
import { sys } from "cc";

export class SdkImpl extends SdkAdapter {
    private static instance:SdkImpl = new SdkImpl();
    private constructor() {
        super();
    }
    public static getInstance():SdkImpl {
        return SdkImpl.instance;
    }

    /*
     * 充值接口类型参数。
     * */
    public PAY_INSDK:string = "PAY_INSDK";

    /*
     * 额外接口类型参数。
     * */
    private REWARD_VIDEO_AD:string = "REWARD_VIDEO_AD";
    private SHARE_GAME:string = "SHARE_GAME";
    private ON_SHARE:string = "ON_SHARE";
    private WX_QUERY:string = "WX_QUERY";
    private CLEAR_STORAGE:string = "CLEAR_STORAGE";
    private COPY_CLIPBOARD:string = "COPY_CLIPBOARD";
    private OPEN_KEFU:string = "OPEN_KEFU";

    /*
     * 游戏内设参数。
     * */
    // 同源 bootstrap：从当前页面 origin 派生 update.json
    private UPDATE_URL:string = (typeof globalThis !== "undefined" && globalThis.location && globalThis.location.origin)
        ? (globalThis.location.origin + "/config/update.json")
        : "http://localhost/config/update.json";
    private ASDKTRACK_URL:string = "";
    private PAY_URL:string = "";
    
    public doSdkParams(args: any): void {
        let ___args:any;
        let updateUrl = this.UPDATE_URL;
        if (typeof globalThis !== "undefined" && globalThis.location && globalThis.location.origin) {
            updateUrl = globalThis.location.origin + "/config/update.json";
        }
        if (globalThis.wx) {
            // 静默更新程序
            globalThis.wx.asdk.asdkAutoUpdate();
            // 参数
            let asdkcfg = globalThis.wx.asdk.asdkCfg();
            let sysinfo = globalThis.wx.asdk.asdkSystemInfoSync();
            // 唯一ID
            let SDK_UUID = LocaleUser.getGlobal(VarVal.FIELD_SV.SDK_UUID);
            let plat:Array<string> = sysinfo.system.split(" ");
            ___args = {
                URL_UPDATE: updateUrl,
                SDK_BIG: "200",
                SDK_SMALL: "10",
                BVER: "1009",

                URL_ASDKTRACK: "",
                sdkPlatInfo: JSON.stringify({
                    gameid:"100971",// asdkcfg.a_gameid,
                    flat:plat[0],
                    pub:asdkcfg.a_pub,
                    gid:SDK_UUID,
                    sdkbv:sysinfo.version,
                    os:sysinfo.system,
                    ua:sysinfo.model,
                    net:"",
                })
            };
        } else if (sys.platform == sys.Platform.DESKTOP_BROWSER || sys.platform == sys.Platform.MOBILE_BROWSER) {
            let SDK_UUID = LocaleUser.getGlobal(VarVal.FIELD_SV.SDK_UUID);
            ___args = {
                URL_UPDATE: updateUrl,
                SDK_BIG: "100",
                SDK_SMALL: "10",
                BVER: "1001",

                URL_ASDKTRACK: this.ASDKTRACK_URL,
                sdkPlatInfo: JSON.stringify({
                    gameid:"100971",
                    flat:sys.platform.toString(),
                    pub:"xxgame_test001",
                    gid:SDK_UUID,
                    sdkbv:sys.osVersion.toString(),
                    os:sys.os.toString(),
                    ua:sys.browserType.toString(),
                    net:sys.getNetworkType().toString(),
                })
            };
        } else {
            ___args = {
                URL_UPDATE: updateUrl,
                SDK_BIG: "100",
                SDK_SMALL: "10",
                BVER: "1",
            };
        }
        this.callJs("doSdkParams", JSON.stringify(___args));
    }

    public doSdkInit(args: any): void {
        if (globalThis.wx) {
            globalThis.wx.asdk.asdkInit((res) => {
                let ___args:any = {
                    isSuccess: (res.code == 0 ? "1" : "0"),
                };
                this.callJs("doSdkInit", JSON.stringify(___args));
            })
        } else {
            let ___args:any = {
                isSuccess: "1",
            };
            this.callJs("doSdkInit", JSON.stringify(___args));
        }
    }

    public doSdkLogin(args: any): void {
        if (globalThis.wx) {
            globalThis.wx.asdk.asdkLogin((res) => {
                let ___args:any = {
                    isUseGameLogin: "0",
                    userId: "",
                    userPass: "",
                    // nickname: "",
                };
                if (res.code == 0) {
                    ___args.userId = res.data.account.accountid;
                    ___args.wxLoginData = res.data;
                } else {
                    ___args.errmsg = res.msg;
                }
                this.callJs("doSdkLogin", JSON.stringify(___args));
            })
        } else {
            let ___args:any = {
                isUseGameLogin: "1",
                // userId: "",
                // userPass: "",
                // nickname: "",
            };
            this.callJs("doSdkLogin", JSON.stringify(___args));   
        }
    }

    public doSdkLogout(args: any): void {
        let ___args:any = {
            isSuccess: "1",
        };
        this.callJs("doSdkLogout", JSON.stringify(___args));
    }

    public doSdkPay(args: any): void {
        if (args.option == this.PAY_INSDK) {
            this.payInSdk(args);
        } else {
            this.callJsFailed("doSdkPay", "无此类型的充值。");
        }
    }

    /**
     * 测试充值接口（生产环境不启用）。
     */
    public static payVirtual(callback:Function, args:any, __payUrl:string): void {
        // 生产环境不启用模拟支付
        callback(null, "充值功能暂未开放。");
    }

    private payInSdk(args:any): void {
        // 普通商品只使用代金券；HDHive 积分仅用于购买代金券。
        this.callJsFailed("doSdkPay", "HDHive 积分只能购买代金券，请先购买代金券。");
    }

    public doSdkSubmit(args: any): void {
        if (globalThis.wx) {
            globalThis.wx.asdk.asdkSendRole({
                playerid: args.roleId,
                playername: args.roleName,
                playerlevel: args.roleLevel,
                serverid: args.serverId,
                servername: args.serverName,
            }, (res) => {})
        }
        let ___args:any = {
            isSuccess: "1",
        };
        this.callJs("doSdkSubmit", JSON.stringify(___args));
    }

    private ad_last_time:number;
    private refreshAdCD(): void {
        this.ad_last_time = Date.now() + 10000;
    }

    public doSdkExtra(args: any): void {
        if (args.option == this.REWARD_VIDEO_AD) {
            let now_time = Date.now();
            if (this.ad_last_time && now_time < this.ad_last_time) {
                let sec = Math.ceil((this.ad_last_time - now_time) / 1000);
                let ___args:any = {
                    isSuccess: "0",
                    option: args.option,
                    errmsg: UtilsTool.stringFormat("冷却中，还需等待{0}秒", [sec]),
                };
                this.callJs("doSdkExtra", JSON.stringify(___args));
                return;
            }
            if (args.isAdTest) {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "提示", 
                "暂无广告，是否直接完成获得奖励？", null, 
                "取消", () => {
                    this.refreshAdCD();
                    let ___args:any = {
                        isSuccess: "0",
                        option: args.option,
                        errmsg: "您已取消观看。",
                    };
                    this.callJs("doSdkExtra", JSON.stringify(___args));
                }, 
                "确定", (isCheckSel:boolean) => {
                    this.refreshAdCD();
                    let ___args:any = {
                        isSuccess: "1",
                        option: args.option,
                    };
                    this.callJs("doSdkExtra", JSON.stringify(___args));
                }, "", null, null)
            } else if (globalThis.wx) {
                let adunit = args.adunits[UtilsTool.random(0, args.adunits.length - 1)];
                if (adunit) {
                    globalThis.wx.asdk.asdkVideoShow((result:any) => {
                        this.refreshAdCD();
                        if (result.code == 1) {
                            let ___args:any = {
                                isSuccess: "1",
                                option: args.option,
                            };
                            this.callJs("doSdkExtra", JSON.stringify(___args));
                        } else {
                            let ___args:any = {
                                isSuccess: "0",
                                option: args.option,
                                errmsg: result.msg,
                            };
                            this.callJs("doSdkExtra", JSON.stringify(___args));
                        }
                    }, adunit);
                } else {
                    this.refreshAdCD();
                    let ___args:any = {
                        isSuccess: "1",
                        option: args.option,
                    };
                    this.callJs("doSdkExtra", JSON.stringify(___args));
                }
            } else {
                args.isAdTest = true;
                this.doSdkExtra(args);
            }
        } else if (args.option == this.ON_SHARE) {
            if (globalThis.wx) {
                globalThis.wx.asdk.asdkSetShareCallback(args.callback);
            }
            let ___args:any = {
                isSuccess: "1",
                option: args.option
            };
            this.callJs("doSdkExtra", JSON.stringify(___args));
        } else if (args.option == this.SHARE_GAME) {
            if (globalThis.wx) {
                globalThis.wx.asdk.asdkShare(args.shareData);
                let ___args:any = {
                    isSuccess: "1",
                    option: args.option,
                };
                this.callJs("doSdkExtra", JSON.stringify(___args));
            } else {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, args.shareData.title, 
                "以下是虚拟分享页面，你可以选择取消，还是完成分享？", null, 
                "取消", () => {
                    let ___args:any = {
                        isSuccess: "0",
                        option: args.option,
                        errmsg: "您已选择取消。",
                    };
                    this.callJs("doSdkExtra", JSON.stringify(___args));
                }, 
                "完成", (isCheckSel:boolean) => {
                    let ___args:any = {
                        isSuccess: "1",
                        option: args.option,
                    };
                    this.callJs("doSdkExtra", JSON.stringify(___args));
                }, "", null, null)
            }
        } else if (args.option == this.WX_QUERY) {
            if (globalThis.wx) {
                let launchOptions = globalThis.wx.asdk.asdkGetLaunchOptionsSync();
                let asdkcfg = globalThis.wx.asdk.asdkCfg();
                let ___args:any = {
                    isSuccess: "1",
                    option: args.option,
                    query: launchOptions.query,
                    asdkcfg: asdkcfg
                };
                this.callJs("doSdkExtra", JSON.stringify(___args));
            } else {
                let ___args:any = {
                    isSuccess: "0",
                    option: args.option,
                    errmsg: "非微信平台。",
                };
                this.callJs("doSdkExtra", JSON.stringify(___args));
            }
        } else if (args.option == this.CLEAR_STORAGE) {
            if (globalThis.wx) {
                globalThis.wx.asdk.asdkClearStorage();
            }
            let ___args:any = {
                isSuccess: "1",
                option: args.option
            };
            this.callJs("doSdkExtra", JSON.stringify(___args));
        } else if (args.option == this.COPY_CLIPBOARD) {
            let ___args:any = {
                isSuccess: "1",
                option: args.option
            };
            if (globalThis.wx) {
                globalThis.wx.asdk.asdkSetClipboardData((isSucc:boolean) => {
                    if (!isSucc) {
                        ___args.isSuccess = "0";
                    }
                    this.callJs("doSdkExtra", JSON.stringify(___args));
                }, args.copytext);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = args.copytext;
                document.body.appendChild(textarea);
                // 选中文本
                textarea.select();
                textarea.setSelectionRange(0, textarea.value.length);
                let result = document.execCommand("copy");
                if (result) {
                    // 成功。
                } else {
                    ___args.isSuccess = "0";
                }
                // 移除临时元素
                document.body.removeChild(textarea);
                this.callJs("doSdkExtra", JSON.stringify(___args));
            }
        } else if (args.option == this.OPEN_KEFU) {
            if (globalThis.wx) {
                globalThis.wx.asdk.asdkKf(args.kfid, (res) => {
                    //
                })
            }
            let ___args:any = {
                isSuccess: "1",
                option: args.option
            };
            this.callJs("doSdkExtra", JSON.stringify(___args));
        } else {
            this.callJsFailed("doSdkExtra", "无此类型的操作。");
        }
    }
}
