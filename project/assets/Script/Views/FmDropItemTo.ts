//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { Vec2 } from "cc";
import { UtilsTool } from "../Kernel/UtilsTool";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { VarVal } from "../Values/VarVal";

export class FmDropItemTo extends ViewLayer {
    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.CCommon;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.CCommon;
        this.viewResI.comName = "FmDropItemTo";
    }

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {
        this.touchable = false;
        let uiPanel = this.getUiPanel();
        let loader_icon:fgui.GLoader = uiPanel.getChild("loader_icon");

        let dropStartPos:Vec2;
        if (params.dropStartPos) {
            dropStartPos = uiPanel.globalToLocal(params.dropStartPos.x, params.dropStartPos.y);
        } else {
            dropStartPos = new Vec2(uiPanel.width * 0.5, uiPanel.height * 0.5);
        }
        let dropEndPos = uiPanel.globalToLocal(params.dropEndPos.x, params.dropEndPos.y);
        if (params.dropUrl) {
            loader_icon.url = params.dropUrl;
            loader_icon.setPosition(dropEndPos.x, dropEndPos.y);
        }

        let dropCount = 1;
        if (params.dropCount) {
            dropCount = params.dropCount;
        }
        for (let i = 0; i < dropCount; i++) {
            let loader_temp = new fgui.GLoader();
            uiPanel.addChild(loader_temp);
            loader_temp.setPivot(0.5, 0.5, true);
            loader_temp.align = fgui.AlignType.Center;
            loader_temp.verticalAlign = fgui.VertAlignType.Middle;
            loader_temp.url = UtilsUI.getItemIconUrl(params.protoId);
            UtilsUI.playCommonDropToAni(() => {
                dropCount--;
                if (dropCount == 0) {
                    UtilsUI.playCommonScaleAni(() => {
                        ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_DESTROY, FmDropItemTo, this.getViewUuid(), null);
                    }, loader_icon, 0.5, 0.5)
                }
            }, loader_temp, dropStartPos, UtilsTool.random(-200, 200), 100, dropEndPos);
        }
    }

    public getIsViewMask():boolean {
        return false;
    }
}

export class FmJumpItemTo extends ViewLayer {
    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.CCommon;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.CCommon;
        this.viewResI.comName = "FmDropItemTo";
    }

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {
        this.touchable = false;
        let uiPanel = this.getUiPanel();
        let loader_icon:fgui.GLoader = uiPanel.getChild("loader_icon");

        let bonuseItems:Array<BonuseItem>;
        if (params.bonuseItems) {
            bonuseItems = params.bonuseItems;
        } else {
            bonuseItems = UtilsUI.getBonuseItemsByString(params.bonuseString);
        }

        let jumpStartPos:Vec2;
        if (params.jumpStartPos) {
            jumpStartPos = uiPanel.globalToLocal(params.jumpStartPos.x, params.jumpStartPos.y);
        } else {
            jumpStartPos = new Vec2(uiPanel.width * 0.5, uiPanel.height * 0.5);
        }
        loader_icon.url = params.jumpUrl;
        loader_icon.setPosition(jumpStartPos.x, jumpStartPos.y);

        let dropCount = bonuseItems.length;
        if (bonuseItems.length > 0) {
            for (let i = 0; i < bonuseItems.length; i++) {
                let loader_temp = new fgui.GLoader();
                uiPanel.addChild(loader_temp);
                loader_temp.setPivot(0.5, 0.5, true);
                loader_temp.align = fgui.AlignType.Center;
                loader_temp.verticalAlign = fgui.VertAlignType.Middle;
                loader_temp.url = UtilsUI.getItemIconUrl(bonuseItems[i].proto);
                this.setTimeout(() => {
                    UtilsUI.playCommonJumpToAni(() => {
                        dropCount--;
                        if (dropCount == 0) {
                            UtilsUI.playCommonScaleAni(() => {
                                ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_DESTROY, FmJumpItemTo, this.getViewUuid(), null);
                            }, loader_icon, 0.5, 0.5)
                        }
                    }, loader_temp, jumpStartPos, 200);
                }, 200 * i)
            }
        } else {
            ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_DESTROY, FmJumpItemTo, this.getViewUuid(), null);
        }
    }

    public getIsViewMask():boolean {
        return false;
    }
}