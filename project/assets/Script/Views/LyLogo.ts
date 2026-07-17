//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { VarVal } from "../Values/VarVal";
import { Asset, assetManager, resources } from "cc";
import { AudioManager } from "../Kernel/AudioManager";
import { LocaleUser } from "../Kernel/LocaleUser";
import { FguiGTween } from "../Kernel/FguiGTween";
import { LyLogoUpdate } from "./LyLogoUpdate";
import { GameServer } from "../Kernel/GameServer";
import { StrVal } from "../Values/StrVal";
import { BmGameBack } from "./BmGameBack";

export class LyLogo extends ViewLayer {

    /**
     * 启动时候需要加载fgui包的资源名称。
     */
    public static resName = "LyLogo";

    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = "LyLogo";
        this.viewResI.pkgName = "LyLogo";
        this.viewResI.comName = "LyLogo";
    }

    private bar_loading:fgui.GProgressBar;

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {
        if (assetManager.cacheManager) {
            assetManager.cacheManager.cacheEnabled = true;
            // assetManager.cacheManager.autoClear = true;
        }

        // 获得fgui编辑器创建的组件。
        let uiPanel:fgui.GComponent = this.getUiPanel();

        // 清理缓存
        let btn_clear:fgui.GButton = uiPanel.getChild("btn_clear");
        btn_clear.text = StrVal.LYLOGIN.STR11;
        btn_clear.onClick(() => {
            let clickTimes = LocaleUser.getGlobal("CLEANCACHE_ONE")
            clickTimes = clickTimes != undefined ? clickTimes: "0"
            clickTimes = String(Number(clickTimes) + 1)
            if (clickTimes != "3") {
                if (clickTimes == "1") {
                    PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.CLEANCACHE_ONE)
                }else if(clickTimes == "2"){
                    PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.CLEANCACHE_TWO)
                }
                LocaleUser.setGlobal("CLEANCACHE_ONE", clickTimes)
                LocaleUser.flush()
            }
            if (assetManager.cacheManager) {
                assetManager.cacheManager.clearCache();
                console.log("cacheManager -> clearCache");
            }
        })
		btn_clear.visible = false;

        uiPanel.getChild("label_text", fgui.GTextField).text = StrVal.LYLOGOUPDATE.STR101;
        uiPanel.getChild("label_notice", fgui.GTextField).text = StrVal.LYLOGOUPDATE.STR102;

        this.bar_loading = uiPanel.getChild("bar_loading");
        let logo_addiction:fgui.GComponent = uiPanel.getChild("logo_addiction");

        let trigger = 2;
        let doneCall = () => {
            trigger--;
            if (trigger == 0) {
                this.onLoadResDone();
            }
        }
        // 创建一个针对目标的Tween对象（需要在界面删除时移除tween，否则会成为游离状态执行）
        logo_addiction.alpha = 0;
        FguiGTween.new(logo_addiction).to(0.3, {alpha:1}).delay(1).call(doneCall).start();
        PlatformAPI.postSdkPointData(PlatformAPI.ASDK_TRACKID.LOADRES_BEGIN);
        this.onLoadResBegin(() => {
            PlatformAPI.postSdkPointData(PlatformAPI.ASDK_TRACKID.LOADRES_END);
            PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.LOONG_END);
            doneCall();
        });
        
        PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.LOING_ONE);
    }

    private onLoadResBegin(finishCall:Function):void {
        let dataAddrInfos = resources.getDirWithPath(VarVal.RESOURCE_DIR.DATA);
        let fguis:Array<string> = new Array<string>();
        for (let key in VarVal.PACKAGE_FGUIS) {
            fguis.push(VarVal.PACKAGE_FGUIS[key]);
        }
        let loadMax:number = dataAddrInfos.length + 1 + fguis.length;
        let loadCount:number = 0;
        let doneCall:Function = () => {
            loadCount++;
            this.bar_loading.value = loadCount / loadMax * 100;
            if (loadCount == loadMax) {
                finishCall();
            }
        }
        // 加载json配置表文件。
        for (let i = 0; i < dataAddrInfos.length; i++) {
            let addrInfo = dataAddrInfos[i];
            PlatformAPI.getResourceAsync((asset:Asset) => {
                if (asset) {
                    PlatformAPI.setCacheResource(addrInfo.path, asset);
                    doneCall();
                } else {
                    // 重新加载？
                    console.warn("预加载资源失败->", addrInfo.path);
                }
            }, addrInfo.path);
        }
        // 加载sproto协议定义文件。
        PlatformAPI.getResourceAsync((asset:Asset) => {
            if (asset) {
                GameServer.loadSproto(asset);
                doneCall();
            } else {
                // 重新加载？
                console.warn("预加载资源失败->", VarVal.SPROTO_FILE);
            }
        }, VarVal.SPROTO_FILE);
        // 加载fgui包文件。
        for (let i = 0; i < fguis.length; i++) {
            let name:string = fguis[i];
            PlatformAPI.loadUiPackage((err:any, isDone:boolean) => {
                if (isDone) {
                    doneCall();
                } else {
                    // 重新加载？
                    console.warn("预加载资源失败->", name);
                }
            }, name, false);
        }
    }

    /**
     * 后台预加载。
     */
    private preloadAll(): void {
        PlatformAPI.loadAllFontTTF();
        // 加载font必要字体文件。
        PlatformAPI.loadFontTTF(VarVal.FONT_NAME.ART_BIG, () => {
            this._partner.callLater(() => { // 微信小游戏装载字体到系统有延迟，异步，在开发者工具中测试延迟1秒无效，延迟2秒生效，这里延迟3秒。
                ViewDispatcher.viewRecreateFguiGObject(ViewDispatcher.getViewContainer().parent, VarVal.FONT_NAME.ART_BIG);
            }, 3)
        });
        PlatformAPI.loadFontTTF(VarVal.FONT_NAME.COMMON, () => {
            this._partner.callLater(() => {
                ViewDispatcher.viewRecreateFguiGObject(ViewDispatcher.getViewContainer().parent, VarVal.FONT_NAME.COMMON);
            }, 3)
        });
        /*
        let imagePaths = new Array<string>();
        let uiAddrInfos = resources.getDirWithPath(VarVal.RESOURCE_DIR.UI);
        for (let i = 0; i < uiAddrInfos.length; i++) {
            let addrInfo = uiAddrInfos[i];
            if (addrInfo.ctor == ImageAsset) {
                imagePaths.push(addrInfo.path);
            }
        }
        let spineAddrInfos = resources.getDirWithPath(VarVal.RESOURCE_DIR.SPINE);
        for (let i = 0; i < spineAddrInfos.length; i++) {
            let addrInfo = spineAddrInfos[i];
            if (addrInfo.ctor == ImageAsset) {
                imagePaths.push(addrInfo.path);
            }
        }
        resources.preload(imagePaths, (finished: number, total: number, item: AssetManager.RequestItem) => {
            // total会随时增加，奇怪？
            console.log("preload->", item.info["path"])
        }, (err: Error, data: AssetManager.RequestItem[]) => {
            if (err) {
                console.warn("预加载资源preload失败->", err);
            }
        });
        */
        resources.preloadDir(VarVal.RESOURCE_DIR.UI); // 回调参数同上，此处不加了。
        // resources.preloadDir(VarVal.RESOURCE_DIR.SPINE);
    }

    private onLoadResDone():void {
        // ********************** 以下是预加载资源启动 **********************
        this.preloadAll();

        // 默认按钮点击音效。
        fgui.UIConfig.buttonSound = fgui.UIPackage.getItemURL(VarVal.PACKAGE_FGUIS.CMemory, VarVal.AUDIO_SOURCE_FGUICOMMOM_CLICK);

        // 音效开关设置。
        let AUDIO_BGM_ENABLED = LocaleUser.getGlobal(VarVal.FIELD_SV.AUDIO_BGM_ENABLED);
        if (!AUDIO_BGM_ENABLED) {
            AUDIO_BGM_ENABLED = "1";
            LocaleUser.setGlobal(VarVal.FIELD_SV.AUDIO_BGM_ENABLED, AUDIO_BGM_ENABLED);
            LocaleUser.flush()
        }
        let AUDIO_EFT_ENABLED = LocaleUser.getGlobal(VarVal.FIELD_SV.AUDIO_EFT_ENABLED);
        if (!AUDIO_EFT_ENABLED) {
            AUDIO_EFT_ENABLED = "1";
            LocaleUser.setGlobal(VarVal.FIELD_SV.AUDIO_EFT_ENABLED, AUDIO_EFT_ENABLED);
            LocaleUser.flush()
        }
        AudioManager.setBGMEnabled(AUDIO_BGM_ENABLED == "1");
        AudioManager.setEFTEnabled(AUDIO_EFT_ENABLED == "1");
        let AUDIO_ALL_VOLUME = LocaleUser.getGlobal(VarVal.FIELD_SV.AUDIO_ALL_VOLUME);
        if (!AUDIO_ALL_VOLUME) {
            AUDIO_ALL_VOLUME = "100";
        }
        let AUDIO_BGM_VOLUME = LocaleUser.getGlobal(VarVal.FIELD_SV.AUDIO_BGM_VOLUME);
        if (!AUDIO_BGM_VOLUME) {
            AUDIO_BGM_VOLUME = "100";
        }
        let AUDIO_EFT_VOLUME = LocaleUser.getGlobal(VarVal.FIELD_SV.AUDIO_EFT_VOLUME);
        if (!AUDIO_EFT_VOLUME) {
            AUDIO_EFT_VOLUME = "100";
        }
        AudioManager.setALLVolume(Number(AUDIO_ALL_VOLUME));
        AudioManager.setBGMVolume(Number(AUDIO_BGM_VOLUME));
        AudioManager.setEFTVolume(Number(AUDIO_EFT_VOLUME));
        // 弹出登录页。
        ViewDispatcher.pushBackEvent(null, ViewDispatcher.EVENT_PUSH, BmGameBack, 0, null);
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyLogoUpdate, 0, null);
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyLogo, 0, null);
    }

    public getIsSafeMask(): boolean {
        return false;
    }
}
