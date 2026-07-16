//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { PlatformAPI } from "./PlatformAPI";

export abstract class SdkAdapter {

    private doSdkPkgInfo(args:any): void {
        let ___args:any = {
            appName: "",
            pkgName: "",
            verName: "",
            verCode: "",
            sysInfo: "",
        };
        this.callJs("doSdkPkgInfo", JSON.stringify(___args));
    }

    private doSdkInstall(args:any): void {
        let ___args:any = {
            isSuccess: "1",
        };
        this.callJs("doSdkInstall", JSON.stringify(___args));
    }

    // #########################################################################################################################
    /*
     * 回传游戏初始化参数接口，如果有闪屏也可以写在这里。
     * 必须成功！回传所有游戏配置参数。
     * */
    public abstract doSdkParams(args:any): void;

    /*
     * 此处实现初始化SDK接口，接口会重复调用，注意不要重复初始化。
     * */
    public abstract doSdkInit(args:any): void;

    /*
     * 此处实现登录SDK接口，接口会重复调用。
     * */
    public abstract doSdkLogin(args:any): void;

    /*
     * 此处实现登出SDK接口，接口会重复调用。
     * */
    public abstract doSdkLogout(args:any): void;

    /*
     * 此处实现充值SDK接口，接口会重复调用。
     * */
    public abstract doSdkPay(args:any): void;

    /*
     * 此处实现上报SDK接口，接口会重复调用。
     * */
    public abstract doSdkSubmit(args:any): void;

    /*
     * 此处实现额外功能接口，接口会重复调用。
     * */
    public abstract doSdkExtra(args:any): void;

    /*
     * 通知游戏登出接口。
     * */
    protected envSdkLogout():void {
        let ___args:any = {
            isSuccess: "1",
        };
        this.callJs("envSdkLogout", JSON.stringify(___args));
    }

    /*
     * 失败的话，只回传一个字段 String errmsg 就好了，这里只是封装一下。
     * */
    protected callJsFailed(cmd:string, errmsg:string): void {
        let ___args:any = {
            errmsg:errmsg,
        };
        this.callJs(cmd, JSON.stringify(___args));
    }

    /*
     * 注册js调用native接口。
     * */
    public sendToNative(args0:string, recvData:string): void {
        let obj:any = JSON.parse(recvData);
        let cmd:string = obj.cmd;
        let args:any = null;
        if (obj.args) {
            let jsonStr:string = obj.args;
            if (jsonStr.length > 0) {
                args = JSON.parse(jsonStr);
            }
        }
        if (cmd == "doSdkParams") {
            this.doSdkParams(args);
        }
        else if (cmd == "doSdkInit") {
            this.doSdkInit(args);
        }
        else if (cmd == "doSdkLogin") {
            this.doSdkLogin(args);
        }
        else if (cmd == "doSdkLogout") {
            this.doSdkLogout(args);
        }
        else if (cmd == "doSdkPay") {
            this.doSdkPay(args);
        }
        else if (cmd == "doSdkSubmit") {
            this.doSdkSubmit(args);
        }
        else if (cmd == "doSdkExtra") {
            this.doSdkExtra(args);
        }
        else if (cmd == "doSdkPkgInfo") {
            this.doSdkPkgInfo(args);
        }
        else if (cmd == "doSdkInstall") {
            this.doSdkInstall(args);
        }
        else {
            this.callJsFailed(cmd, "未定义的接口名称，调用Native接口失败。");
        }
    }

    /*
     * native调用js接口。
     * */
    protected callJs(cmd:string, args:string): void {
        let obj = {
            cmd:cmd,
            args:args,
        };
        PlatformAPI.onNative("callJS", JSON.stringify(obj));
    }
}