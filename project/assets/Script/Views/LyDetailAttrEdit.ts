//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServerData } from "../Kernel/GameServerData";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { BattleTestResShow, LyBattleMain } from "./LyBattleMain";
import { LocaleUser } from "../Kernel/LocaleUser";
import { HorizontalTextAlignment, Overflow, VerticalTextAlignment } from "cc";

interface playerEntityInfo {
    attr: string[],
    elites: string, // protoid,skillid;protoid,skillid... // skillid为0则使用默认skill
    pets: string, // protoid,skillid;protoid,skillid... // skillid为0则使用默认skill
    divines: string, // 原型ID,技能id;... (100101;100201;100203;100201) 神通最多4个，没有传0,0,0,0
}

interface TestBattleSendData {
    attackEntity: playerEntityInfo,
    defenceEntity: playerEntityInfo,
    battleType: number,
    monsterID: number
}

export class LyDetailAttrEdit extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyMainPage";
        this.viewResI.pkgName = "LyMainPage";
        this.viewResI.comName = "LyDetailAttrEdit";
    }

    arr1: number[] = [
        VarVal.ENTITIATTR.HEALTH,
        VarVal.ENTITIATTR.ATTACK,
        VarVal.ENTITIATTR.DEFENSE,
        VarVal.ENTITIATTR.SPEED,
    ]
    arr2: number[] = [
        VarVal.ENTITIATTR.CHANCE_CRITICAL,
        VarVal.ENTITIATTR.CHANCE_VERTIGO,
        VarVal.ENTITIATTR.CHANCE_COMBO,
        VarVal.ENTITIATTR.CHANCE_MISS,
        VarVal.ENTITIATTR.CHANCE_COUNTER,
        VarVal.ENTITIATTR.CHANGE_VAMPIRE,
        VarVal.ENTITIATTR.CHANGE_MAGIC_COMBO,
    ]
    arr3: number[] = [
        VarVal.ENTITIATTR.RESISTANCE_CRITICAL,
        VarVal.ENTITIATTR.RESISTANCE_VERTIGO,
        VarVal.ENTITIATTR.RESISTANCE_COMBO,
        VarVal.ENTITIATTR.RESISTANCE_MISS,
        VarVal.ENTITIATTR.RESISTANCE_COUNTER,
        VarVal.ENTITIATTR.RESISTANCE_VAMPIRE,
    ]
    arr4: number[] = [
        VarVal.ENTITIATTR.IGNORE_BATTLE_ATTR,
        VarVal.ENTITIATTR.IGNORE_BATTLE_RESISTANCE,
        VarVal.ENTITIATTR.FINAL_ADD_DAMADE,
        VarVal.ENTITIATTR.FINAL_REDUCE_DAMADE,
        VarVal.ENTITIATTR.ENHANCE_CIRTIAL,
        VarVal.ENTITIATTR.ENHANCE_HEALING,
        VarVal.ENTITIATTR.ENHANCE_SPIRIT_PET,
        VarVal.ENTITIATTR.ENHANCE_MAGIC,
        VarVal.ENTITIATTR.WEAKNESS_CIRTIAL,
        VarVal.ENTITIATTR.WEAKNESS_HEALING,
        VarVal.ENTITIATTR.WEAKNESS_SPIRIT_PET,
        VarVal.ENTITIATTR.WEAKNESS_MAGIC
    ]
    list_attr1: fgui.GList;
    list_attr2: fgui.GList;
    list_attr3: fgui.GList;
    list_attr4: fgui.GList;
    label_eliteids: fgui.GTextInput;
    label_petid: fgui.GTextInput;
    label_divineid: fgui.GTextInput;

    label_monsterid: fgui.GTextInput;
    label_type: fgui.GTextInput;

    private sendData:TestBattleSendData;
    private isSelfPanel:boolean = true;
    
    public onViewCreate(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = uiPanel.getChild("group_main");

        // 表现效果
        let label_show_buffid:fgui.GTextInput = group_main.getChild("label_show_buffid");
        UtilsUI.setGTextInputAlign(label_show_buffid, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.SHRINK);
        let label_show_spine:fgui.GTextInput = group_main.getChild("label_show_spine");
        UtilsUI.setGTextInputAlign(label_show_spine, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.SHRINK);
        let label_show_mount:fgui.GTextInput = group_main.getChild("label_show_mount");
        UtilsUI.setGTextInputAlign(label_show_mount, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.SHRINK);

        let label_showval1:fgui.GTextInput = group_main.getChild("label_showval1");
        UtilsUI.setGTextInputAlign(label_showval1, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.SHRINK);
        let label_showval2:fgui.GTextInput = group_main.getChild("label_showval2");
        UtilsUI.setGTextInputAlign(label_showval2, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.SHRINK);
        let label_showval3:fgui.GTextInput = group_main.getChild("label_showval3");
        UtilsUI.setGTextInputAlign(label_showval3, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.SHRINK);
        let label_showval4:fgui.GTextInput = group_main.getChild("label_showval4");
        UtilsUI.setGTextInputAlign(label_showval4, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.SHRINK);
        let label_showval5:fgui.GTextInput = group_main.getChild("label_showval5");
        UtilsUI.setGTextInputAlign(label_showval5, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.SHRINK);
        let label_showval6:fgui.GTextInput = group_main.getChild("label_showval6");
        UtilsUI.setGTextInputAlign(label_showval6, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.SHRINK);

        let btn_sidecheck:fgui.GButton = group_main.getChild("btn_sidecheck");
        btn_sidecheck.selected = LyBattleMain.isTestLeftSide;
        btn_sidecheck.onClick(() => {
            LyBattleMain.isTestLeftSide = btn_sidecheck.selected;
        })

        // 关闭
        let btn_close: fgui.GButton = uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            this.labelToSendData();
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyDetailAttrEdit, 0, null);
        })

        this.list_attr1 = group_main.getChild("list_attr1");
        this.list_attr2 = group_main.getChild("list_attr2");
        this.list_attr3 = group_main.getChild("list_attr3");
        this.list_attr4 = group_main.getChild("list_attr4");
        
        this.label_eliteids = group_main.getChild("label_eliteids");
        UtilsUI.setGTextInputAlign(this.label_eliteids, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.SHRINK);

        this.label_petid = group_main.getChild("label_petid");
        UtilsUI.setGTextInputAlign(this.label_petid, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.SHRINK);

        this.label_divineid = group_main.getChild("label_divineid");
        UtilsUI.setGTextInputAlign(this.label_divineid, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.SHRINK);

        this.label_monsterid = group_main.getChild("label_monsterid");
        UtilsUI.setGTextInputAlign(this.label_monsterid, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.SHRINK);

        this.label_type = group_main.getChild("label_type");
        UtilsUI.setGTextInputAlign(this.label_type, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.SHRINK);

        this.sendDataToLabel();

        let red_ziji:fgui.GGraph = group_main.getChild("red_ziji");
        let red_diren:fgui.GGraph = group_main.getChild("red_diren");
        let group_monster:fgui.GGroup = group_main.getChild("group_monster");
        let group_type:fgui.GGroup = group_main.getChild("group_type");
        let group_check:fgui.GGroup = group_main.getChild("group_check");
        let btn_check:fgui.GButton = group_main.getChild("btn_check");
        btn_check.selected = (LocaleUser.getGlobal(VarVal.FIELD_SV.DEBUG_TESTBATTLE_USESELF) != "0");
        btn_check.onClick(() => {
            LocaleUser.setGlobal(VarVal.FIELD_SV.DEBUG_TESTBATTLE_USESELF, btn_check.selected ? "1" : "0");
            LocaleUser.flush();
        })

        // 自己
        let btn_ziji: fgui.GButton = group_main.getChild("btn_ziji");
        btn_ziji.onClick(() => {
            if (!this.isSelfPanel) {
                this.labelToSendData();
                this.isSelfPanel = true;
                this.sendDataToLabel();

                group_monster.visible = false;
                group_type.visible = false;
                group_check.visible = true;
                red_ziji.visible = true;
                red_diren.visible = false;
            }
        })

        // 敌人
        let aaa = () => {
            if (this.isSelfPanel) {
                this.labelToSendData();
                this.isSelfPanel = false;
                this.sendDataToLabel();

                group_monster.visible = true;
                group_type.visible = true;
                group_check.visible = false;
                red_ziji.visible = false;
                red_diren.visible = true;
            }
        }
        let btn_diren: fgui.GButton = group_main.getChild("btn_diren");
        btn_diren.onClick(aaa)
        aaa();

        // 同步
        let btn_tongbu: fgui.GButton = group_main.getChild("btn_tongbu");
        btn_tongbu.onClick(() => {
            this.labelToSendData();
            // 填充属性
            let entity:playerEntityInfo;
            if (this.isSelfPanel) {
                entity = this.sendData.attackEntity;
            } else {
                entity = this.sendData.defenceEntity;
            }
            for (let i = 0; i < VarVal.ENTITIATTR.MAX; i++) {
                entity.attr[i] = GameServerData.getInstance().getEntityPlayerAttr(i + 1);
            }
            this.saveSendData();
            this.sendDataToLabel();
        })

        // 挑战
        let btn_ok: fgui.GButton = group_main.getChild("btn_ok");
        btn_ok.onClick(() => {
            this.labelToSendData();
            let data = {
                attackEntity: this.sendData.attackEntity,
                defenceEntity: this.sendData.defenceEntity,
                battleType: this.sendData.battleType,
                monsterID: this.sendData.monsterID
            }
            if (btn_check.selected) {
                data.attackEntity = undefined;
            }
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    // 表现效果
                    let resShow:BattleTestResShow = {};
                    if (label_show_buffid.text.length > 0) {
                        resShow.buffId = label_show_buffid.text;
                    }
                    if (label_show_spine.text.length > 0) {
                        let ttt = label_show_spine.text.split(",")
                        resShow.spine = ttt[0];
                        resShow.skin = ttt[1] ? ttt[1] : "1";
                    }
                    if (label_show_mount.text.length > 0) {
                        resShow.mount = label_show_mount.text;
                    }
                    if (label_showval1.text.length > 0) {
                        resShow.type = label_showval1.text;
                        resShow.attack_ani = label_showval2.text;
                        resShow.attack_with = label_showval3.text;
                        resShow.bullet_file = label_showval4.text;
                        resShow.fall_file = label_showval5.text;
                        resShow.hit_file = label_showval6.text;
                    }
                    let hasTestRes:boolean = false;
                    if (resShow.spine || resShow.mount || resShow.type || resShow.buffId) {
                        hasTestRes = true;
                    }
                    LyBattleMain.showVirtualBattle(args.battleResult, VarVal.BATTLE_TYPE.TESTGM, hasTestRes ? resShow : null);
                    // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyDetailAttrEdit, 0, null);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "testbattle", data);
        })
    };

    private saveSendData(): void {
        if (this.sendData) {
            LocaleUser.setGlobal(VarVal.FIELD_SV.DEBUG_TESTBATTLE, JSON.stringify(this.sendData));
            LocaleUser.flush();
        }
    }

    private getSendData(): void {
        if (!this.sendData) {
            let saveData = LocaleUser.getGlobal(VarVal.FIELD_SV.DEBUG_TESTBATTLE);
            if (saveData) {
                this.sendData = JSON.parse(saveData);
            } else {
                this.sendData = {
                    attackEntity: {
                        attr: new Array<string>(),
                        elites: "0,0;0,0;0,0",
                        pets: "",
                        divines: "0,0,0,0"
                    },
                    defenceEntity: {
                        attr: new Array<string>(),
                        elites: "0,0;0,0;0,0",
                        pets: "",
                        divines: "0,0,0,0"
                    },
                    battleType: 1,
                    monsterID: undefined,
                }
                for (let i = 0; i < VarVal.ENTITIATTR.MAX; i++) {
                    this.sendData.attackEntity.attr.push("0");
                    this.sendData.defenceEntity.attr.push("0");
                }
            }
        }
    }

    private labelToSendData(): void {
        this.getSendData();

        // 填充属性
        let entity:playerEntityInfo;
        if (this.isSelfPanel) {
            entity = this.sendData.attackEntity;
        } else {
            entity = this.sendData.defenceEntity;
        }
        for (let i = 0; i < this.list_attr1.numChildren; i++) {
            let bbb:fgui.GComponent = this.list_attr1.getChildAt(i);
            let edit_txt:fgui.GTextInput = bbb.getChild("edit_txt");
            entity.attr[this.arr1[i] - 1] = edit_txt.text;
        }
        for (let i = 0; i < this.list_attr2.numChildren; i++) {
            let bbb:fgui.GComponent = this.list_attr2.getChildAt(i);
            let edit_txt:fgui.GTextInput = bbb.getChild("edit_txt");
            entity.attr[this.arr2[i] - 1] = edit_txt.text;
        }
        for (let i = 0; i < this.list_attr3.numChildren; i++) {
            let bbb:fgui.GComponent = this.list_attr3.getChildAt(i);
            let edit_txt:fgui.GTextInput = bbb.getChild("edit_txt");
            entity.attr[this.arr3[i] - 1] = edit_txt.text;
        }
        for (let i = 0; i < this.list_attr4.numChildren; i++) {
            let bbb:fgui.GComponent = this.list_attr4.getChildAt(i);
            let edit_txt:fgui.GTextInput = bbb.getChild("edit_txt");
            entity.attr[this.arr4[i] - 1] = edit_txt.text;
        }
        entity.elites = this.label_eliteids.text;
        entity.pets = this.label_petid.text;
        entity.divines = this.label_divineid.text;

        // 怪物、战斗类型
        if (this.label_monsterid.text.length > 0) {
            this.sendData.monsterID = Number(this.label_monsterid.text);
        } else {
            this.sendData.monsterID = undefined;
        }
        this.sendData.battleType = Number(this.label_type.text);

        this.saveSendData();
    }

    private sendDataToLabel(): void {
        this.getSendData();

        // 填充属性
        let entity:playerEntityInfo;
        if (this.isSelfPanel) {
            entity = this.sendData.attackEntity;
        } else {
            entity = this.sendData.defenceEntity;
        }
        this.loadListData(this.list_attr1, this.arr1, entity.attr)
        this.loadListData(this.list_attr2, this.arr2, entity.attr)
        this.loadListData(this.list_attr3, this.arr3, entity.attr)
        this.loadListData(this.list_attr4, this.arr4, entity.attr)
        this.label_eliteids.text = entity.elites;
        this.label_petid.text = entity.pets;
        this.label_divineid.text = entity.divines;

        // 怪物、战斗类型
        if (this.sendData.monsterID) {
            this.label_monsterid.text = String(this.sendData.monsterID);
        } else {
            this.label_monsterid.text = "";
        }
        this.label_type.text = String(this.sendData.battleType);
    }

    private loadListData(listAttr: fgui.GList, arr: number[], attr:string[]): void {
        listAttr.itemRenderer = ((index: number, child: fgui.GComponent) => {
            let label_txt:fgui.GTextInput = child.getChild("label_txt");
            label_txt.text = StrVal.ENTITI_NAMES[arr[index]];
            let edit_txt:fgui.GTextInput = child.getChild("edit_txt");
            edit_txt.text = attr[arr[index] - 1];
            UtilsUI.setGTextInputAlign(edit_txt, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.SHRINK);
        }).bind(this)
        listAttr.numItems = arr.length
    }

    public getIsViewMask(): boolean {
        return false;
    };

}