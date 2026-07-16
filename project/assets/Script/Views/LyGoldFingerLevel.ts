//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { LyGoldFingerUpgrade } from "./LyGoldFingerUpgrade";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { LyGoldFingerEliteSel } from "./LyGoldFingerEliteSel";
import { LyGoldFingerPetSel } from "./LyGoldFingerPetSel";
import { PointRedData } from "../Kernel/PointRedData";
import { LyGoldFingerEquipSel } from "./LyGoldFingerEquipSel";
import { LyGoldFingerTheurgySel } from "./LyGoldFingerTheurgySel";

export class LyGoldFingerLevel extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGoldFinger;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyGoldFinger;
        this.viewResI.comName = "LyGoldFingerLevel";
    }

    public static MAX_GOLDLEVEL:number = 5;

    goldItem:any;
    ability:Map<string, any>;
    level:number = 0;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        this.goldItem = params.goldItem;

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGoldFingerLevel, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let label_name = group_main.getChild("label_name", fgui.GTextField);
        label_name.text = this.goldItem.name;

        let label_owner = group_main.getChild("label_owner", fgui.GTextField);
        let record = GameServerData.getInstance().getGoldFingerRecord(this.goldItem.id);
        label_owner.text = UtilsTool.stringFormat(StrVal.LYGOLDFINGER.STR201, [record ? GameServerData.getInstance().getPlayerFullInfo().base.name : StrVal.LYGOLDFINGER.STR204]);

        let label_desc = group_main.getChild("label_desc", fgui.GTextField);
        label_desc.text = this.goldItem.desc;

        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
        }, group_main.getChild("loader_spine_main", fgui.GLoader3D), this.goldItem.spineName);

        let label_tips0 = group_main.getChild("label_tips0", fgui.GTextField);
        label_tips0.text = LocaleData.getGoldFingerLevelItemDesc(this.goldItem.id, 0);
        for (let i = 0; i < LyGoldFingerLevel.MAX_GOLDLEVEL; i++) {
            let label_tips = group_main.getChild("label_tips" + String(i + 1), fgui.GTextField);
            label_tips.text = LocaleData.getGoldFingerLevelItemDesc(this.goldItem.id, i + 1);
        }

        let btn_upgrade = group_main.getChild("btn_upgrade", fgui.GButton);
        btn_upgrade.text = StrVal.LYGOLDFINGER.STR202;
        btn_upgrade.onClick(() => {
            if (!this.ability) {
                UtilsUI.showMsgTip(StrVal.LYGOLDFINGER.STR206);
            } else if (this.level >= LyGoldFingerLevel.MAX_GOLDLEVEL) {
                UtilsUI.showMsgTip(StrVal.LYGOLDFINGER.STR207);
            } else {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGoldFingerUpgrade, 0, {goldItem:this.goldItem});
            }
        })

        let btn_use = group_main.getChild("btn_use", fgui.GButton);
        btn_use.text = StrVal.LYGOLDFINGER.STR203;
        btn_use.onClick(() => {
            if (this.ability) {
                let itemPet = this.ability.get(VarVal.GOLDFINGER_TYPE.PETREPLACE);
                let itemElite = this.ability.get(VarVal.GOLDFINGER_TYPE.ELITEREPLACE);
                let itemEquip = this.ability.get(VarVal.GOLDFINGER_TYPE.EQUIP);
                let itemTheurgy = this.ability.get(VarVal.GOLDFINGER_TYPE.SKILLATTR);
                if (itemPet) { // 替换侠侣
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGoldFingerPetSel, 0, {levelItem:itemPet});
                } else if (itemElite) { // 替换门客碎片
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGoldFingerEliteSel, 0, {levelItem:itemElite});
                } else if (itemEquip) { // 装备
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGoldFingerEquipSel, 0, {levelItem:itemEquip});
                } else if (itemTheurgy) { // 秘籍
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGoldFingerTheurgySel, 0, {levelItem:itemTheurgy});
                } else {
                    UtilsUI.showMsgTip(StrVal.LYGOLDFINGER.STR205);
                }
            } else {
                UtilsUI.showMsgTip(StrVal.LYGOLDFINGER.STR206);
            }
        })

        this.refreshState();
        this.registerRequest((args) => {
            this.refreshState();
        }, "goldFingerChanged");
    }

    private refreshState():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");

        this.ability = undefined;
        this.level = 0;
        let record = GameServerData.getInstance().getGoldFingerRecord(this.goldItem.id);
        if (record) {
            this.level = record.level;
            this.ability = LyGoldFingerLevel.getLevelItemAbility(this.goldItem.id, this.level);
        }

        let label_tips0 = group_main.getChild("label_tips0", fgui.GTextField);
        label_tips0.text = LocaleData.getGoldFingerLevelItemDesc(this.goldItem.id, 0);
        for (let i = 0; i < LyGoldFingerLevel.MAX_GOLDLEVEL; i++) {
            let img_star:fgui.GImage = group_main.getChild("img_star" + String(i + 1));
            img_star.grayed = (i >= this.level);

            let img_stepgray = group_main.getChild("img_stepgray" + String(i + 1), fgui.GImage);
            img_stepgray.visible = (i >= this.level);
            let img_step = group_main.getChild("img_step" + String(i + 1), fgui.GImage);
            img_step.visible = !img_stepgray.visible;
        }
        let img_stepgray0 = group_main.getChild("img_stepgray0", fgui.GImage);
        img_stepgray0.visible = (record ? false : true);
        let img_step0 = group_main.getChild("img_step0", fgui.GImage);
        img_step0.visible = !img_stepgray0.visible;

        let btn_upgrade = group_main.getChild("btn_upgrade", fgui.GButton);
        PointRedData.getInstance().updateManualPoint(btn_upgrade, LyGoldFingerUpgrade.isViewRedPointUpgradeChild(this.goldItem.id));
        btn_upgrade.grayed = false;
        if (!this.ability) {
            btn_upgrade.grayed = true;
        } else if (this.level >= LyGoldFingerLevel.MAX_GOLDLEVEL) {
            btn_upgrade.grayed = true;
        } else {
        }

        let btn_use = group_main.getChild("btn_use", fgui.GButton);
        PointRedData.getInstance().updateManualPoint(btn_use, LyGoldFingerUpgrade.isViewRedPointCanUseChild(this.goldItem.id));
        btn_use.grayed = false;
        if (this.ability) {
            if (this.ability.get(VarVal.GOLDFINGER_TYPE.PETREPLACE) // 替换侠侣
                || this.ability.get(VarVal.GOLDFINGER_TYPE.ELITEREPLACE) // 替换门客碎片
                || this.ability.get(VarVal.GOLDFINGER_TYPE.EQUIP) // 装备
                || this.ability.get(VarVal.GOLDFINGER_TYPE.SKILLATTR)) { // 秘籍
            } else {
                btn_use.grayed = true;
            }
        } else {
            btn_use.grayed = true;
        }
    }

    public static getLevelItemAbility(id:string | number, level:string | number):Map<string, any> {
        level = Number(level);
        let map = new Map<string, any>();
        for (let i = 0; i < level + 1; i++) {
            let levelItem = LocaleData.getGoldFingerLevelItem(id, i);
            if (levelItem) {
                map.set(levelItem.functionType, levelItem)
            }
        }
        return map;
    }

    public getIsViewMask():boolean {
        return false;
    }
}