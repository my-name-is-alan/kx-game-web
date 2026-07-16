//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { VarVal } from "../Values/VarVal";
import { StrVal } from "../Values/StrVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { LyGoldFingerLevel } from "./LyGoldFingerLevel";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { LyGuideGetItem } from "./LyGuideGetItem";
import { PointRedData } from "../Kernel/PointRedData";

export class LyGoldFingerUpgrade extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGoldFinger;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyGoldFinger;
        this.viewResI.comName = "LyGoldFingerUpgrade";
    }

    goldRoot:any;
    goldItem:any;

    itemCount:number;
    itemNeed:number;

    public onViewCreate(_params:any):void {
        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        this.goldRoot = LocaleData.getGoldFingerRoot();
        this.goldItem = _params.goldItem;

        // 关闭
        let btn_close = uiPanel.getChild("btn_close")
        btn_close.onClick(()=> {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGoldFingerUpgrade, 0, null);
        })

        let label_title = group_main.getChild("label_title", fgui.GTextField);
        label_title.text = StrVal.LYGOLDFINGER.STR102;

        let loader_name = group_main.getChild("loader_name", fgui.GLoader);
        loader_name.url = UtilsTool.stringFormat("ui://LyGoldFinger/{0}_2", [this.goldItem.iconName]);

        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
        }, group_main.getChild("loader_spine_bj", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_fabaochouqu_bj);
        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
        }, group_main.getChild("loader_spine_frame", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_fabaochouqu);
        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
        }, group_main.getChild("loader_spine_star", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_fabaochouqu_star);

        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
        }, group_main.getChild("loader_spine_main", fgui.GLoader3D), this.goldItem.spineName);

        let label_right = group_main.getChild("label_right", fgui.GTextField);
        label_right.text = this.goldItem.tip;

        let loader_icon = group_main.getChild("loader_icon", fgui.GLoader);
        loader_icon.url = UtilsUI.getItemIconUrl(this.goldRoot.upgradeItem);

        let btn_pump = group_main.getChild("btn_pump", fgui.GButton);
        btn_pump.text = StrVal.LYGOLDFINGER.STR202;
        btn_pump.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    this.refreshState();
                    UtilsUI.showMsgTip(StrVal.LYGOLDFINGER.STR104);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                    if (GameServerData.getInstance().getItemCountByProtoId(this.goldRoot.upgradeItem) < this.itemNeed) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.goldRoot.upgradeItem, "1"), buyCall:() => {
                            this.refreshState();
                        }});
                    }
                }
            }, "levelUpGoldFinger", {
                id:Number(this.goldItem.id)
            });
        })

        this.refreshState();
        this.registerRequest((args) => {
            this.refreshState();
        }, "goldFingerChanged");
    }

    private refreshState():void {
        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let level:number = 0;
        let record = GameServerData.getInstance().getGoldFingerRecord(this.goldItem.id);
        if (record) {
            level = record.level;
        }

        this.itemCount = GameServerData.getInstance().getItemCountByProtoId(this.goldRoot.upgradeItem);
        let needArrs:Array<string> = this.goldRoot.upgradeNum.split(";");
        this.itemNeed = Number(needArrs[needArrs.length - 1]);
        if (needArrs[level]) {
            this.itemNeed = Number(needArrs[level]);
        }

        let label_need = group_main.getChild("label_need", fgui.GTextField);
        label_need.text = UtilsTool.stringFormat("{0}/{1}", [this.itemCount, this.itemNeed]);
        label_need.color = UtilsUI.getEnoughColor(this.itemCount >= this.itemNeed, 3);

        let btn_pump = group_main.getChild("btn_pump", fgui.GButton);
        PointRedData.getInstance().updateManualPoint(btn_pump, LyGoldFingerUpgrade.isViewRedPointUpgradeChild(this.goldItem.id));

        let currItem = LocaleData.getGoldFingerLevelItem(this.goldItem.id, level);
        let nextItem = LocaleData.getGoldFingerLevelItem(this.goldItem.id, level + 1);
        if (!nextItem) {
            nextItem = currItem;
        }
        if (currItem.functionType != nextItem.functionType) {
            group_main.getController("c1").selectedIndex = 1;

            let group_upgradeitem = group_main.getChild("group_upgradeitem2", fgui.GComponent);
            group_upgradeitem.getChild("label_level").text = StrVal.LYGOLDFINGER.STR103;
            group_upgradeitem.getChild("label_leveln").text = StrVal.LYGOLDFINGER.STR103;
            group_upgradeitem.getChild("label_desc").text = LocaleData.getGoldFingerLevelItemDesc(this.goldItem.id, nextItem.level);
            for (let i = 0; i < LyGoldFingerLevel.MAX_GOLDLEVEL; i++) {
                let img_star:fgui.GImage = group_upgradeitem.getChild("img_star" + String(i + 1));
                img_star.grayed = (i >= level);
            }
            for (let i = 0; i < LyGoldFingerLevel.MAX_GOLDLEVEL; i++) {
                let img_star:fgui.GImage = group_upgradeitem.getChild("img_starn" + String(i + 1));
                img_star.grayed = (i >= level + 1);
            }
        } else {
            group_main.getController("c1").selectedIndex = 0;

            let group_upgradeitem = group_main.getChild("group_upgradeitem", fgui.GComponent);
            group_upgradeitem.getController("c1").selectedIndex = 0;
            group_upgradeitem.getChild("label_level").text = StrVal.LYGOLDFINGER.STR103;
            group_upgradeitem.getChild("label_desc").text = LocaleData.getGoldFingerLevelItemDesc(this.goldItem.id, currItem.level);
            for (let i = 0; i < LyGoldFingerLevel.MAX_GOLDLEVEL; i++) {
                let img_star:fgui.GImage = group_upgradeitem.getChild("img_star" + String(i + 1));
                img_star.grayed = (i >= level);
            }

            let group_upgradenext = group_main.getChild("group_upgradenext", fgui.GComponent);
            group_upgradenext.getController("c1").selectedIndex = 1;
            group_upgradenext.getChild("label_level").text = StrVal.LYGOLDFINGER.STR103;
            group_upgradenext.getChild("label_desc").text = LocaleData.getGoldFingerLevelItemDesc(this.goldItem.id, nextItem.level);
            for (let i = 0; i < LyGoldFingerLevel.MAX_GOLDLEVEL; i++) {
                let img_star:fgui.GImage = group_upgradenext.getChild("img_star" + String(i + 1));
                img_star.grayed = (i >= level + 1);
            }
        }
    }

    public static isViewRedPointUpgrade():boolean {
        let goldInfo = GameServerData.getInstance().getGoldFingerInfo();
        for (let i = 0; i < goldInfo.ids.length; i++) {
            if (LyGoldFingerUpgrade.isViewRedPointUpgradeChild(goldInfo.ids[i].id)) {
                return true;
            }
        }
        return false;
    }

    public static isViewRedPointUpgradeChild(id:number):boolean {
        let goldRoot = LocaleData.getGoldFingerRoot();
        let itemCount = GameServerData.getInstance().getItemCountByProtoId(goldRoot.upgradeItem);
        let needArrs:Array<string> = goldRoot.upgradeNum.split(";");
        let record = GameServerData.getInstance().getGoldFingerRecord(id);
        if (record && record.level < LyGoldFingerLevel.MAX_GOLDLEVEL) {
            let itemNeed = Number(needArrs[needArrs.length - 1]);
            if (needArrs[record.level]) {
                itemNeed = Number(needArrs[record.level]);
            }
            if (itemCount >= itemNeed) {
                return true;
            }
        }
        return false;
    }

    public static isViewRedPointCanUse():boolean {
        let goldInfo = GameServerData.getInstance().getGoldFingerInfo();
        for (let i = 0; i < goldInfo.ids.length; i++) {
            if (LyGoldFingerUpgrade.isViewRedPointCanUseChild(goldInfo.ids[i].id)) {
                return true;
            }
        }
        return false;
    }

    public static isViewRedPointCanUseChild(id:number):boolean {
        let record = GameServerData.getInstance().getGoldFingerRecord(id);
        if (record) {
            let ability = LyGoldFingerLevel.getLevelItemAbility(id, record.level);
            let itemPet = ability.get(VarVal.GOLDFINGER_TYPE.PETREPLACE);
            if (itemPet) { // 替换侠侣
                let todayCanSel = LocaleData.getGoldFingerLevelItemMax(itemPet) - GameServerData.getInstance().getGoldFingerLevelItemCount(itemPet.functionType);
                if (todayCanSel > 0) {
                    return true;
                }
            }
            let itemElite = ability.get(VarVal.GOLDFINGER_TYPE.ELITEREPLACE);
            if (itemElite) { // 替换门客碎片
                let todayCanSel = LocaleData.getGoldFingerLevelItemMax(itemElite) - GameServerData.getInstance().getGoldFingerLevelItemCount(itemElite.functionType);
                if (todayCanSel > 0) {
                    return true;
                }
            }
            let itemEquip = ability.get(VarVal.GOLDFINGER_TYPE.EQUIP);
            if (itemEquip) {
                let todayCanSel = LocaleData.getGoldFingerLevelItemMax(itemEquip) - GameServerData.getInstance().getGoldFingerLevelItemCount(itemEquip.functionType);
                if (todayCanSel > 0) {
                    return true;
                }
            }
            let itemTheurgy = ability.get(VarVal.GOLDFINGER_TYPE.SKILLATTR);
            if (itemTheurgy) {
                let todayCanSel = LocaleData.getGoldFingerLevelItemMax(itemTheurgy) - GameServerData.getInstance().getGoldFingerLevelItemCount(itemTheurgy.functionType);
                if (todayCanSel > 0) {
                    return true;
                }
            }
        }
        return false;
    }
}