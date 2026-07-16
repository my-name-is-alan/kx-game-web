//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LocaleData } from "../Kernel/LocaleData";
import { AudioManager } from "../Kernel/AudioManager";

export enum LyDetailAttrType {
    MAINPAGE = 1,
    MOUNTSKIN = 2,
    STAGEMONSTER = 3,
    CHARACTER = 4,
    COMPANION = 5,
}

export class LyDetailAttr extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyMainPage";
        this.viewResI.pkgName = "LyMainPage";
        this.viewResI.comName = "LyDetailAttr";
    }
    private params: any
    public onViewCreate(params): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        this.params = params
        if (params.type == LyDetailAttrType.MAINPAGE) {
            params = {
                vals: params.attr,
                arr1: [
                    VarVal.ENTITIATTR.FINAL_HP,
                    VarVal.ENTITIATTR.FINAL_ATTACK,
                    VarVal.ENTITIATTR.FINAL_DEFENSE,
                    VarVal.ENTITIATTR.FINAL_SPEED,
                ],
                arr2: [
                    VarVal.ENTITIATTR.CHANCE_CRITICAL,
                    VarVal.ENTITIATTR.CHANCE_VERTIGO,
                    VarVal.ENTITIATTR.CHANCE_COMBO,
                    VarVal.ENTITIATTR.CHANCE_MISS,
                    VarVal.ENTITIATTR.CHANCE_COUNTER,
                    VarVal.ENTITIATTR.CHANGE_VAMPIRE,
                ],
                arr3: [
                    VarVal.ENTITIATTR.RESISTANCE_CRITICAL,
                    VarVal.ENTITIATTR.RESISTANCE_VERTIGO,
                    VarVal.ENTITIATTR.RESISTANCE_COMBO,
                    VarVal.ENTITIATTR.RESISTANCE_MISS,
                    VarVal.ENTITIATTR.RESISTANCE_COUNTER,
                    VarVal.ENTITIATTR.RESISTANCE_VAMPIRE,
                ],
                arr4: [
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
            }
        } else if (params.type == LyDetailAttrType.MOUNTSKIN) {
            let vals = new Array<string>()
            for (let i = 0; i < VarVal.ENTITIATTR.MAX; i++) {
                vals.push("0");
            }
            for (let key in params.cactivate) {
                let clothesItem = LocaleData.getMountClothesItem(key);
                let val = params.cactivate[key] * Number(clothesItem.attribute)
                if (clothesItem.attributeId == "0") {
                    UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_CRITICAL, val)
                    UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_VERTIGO, val)
                    UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_COMBO, val)
                    UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_MISS, val)
                    UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_COUNTER, val)
                    UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_VAMPIRE, val)
                } else {
                    UtilsTool.addEntitiAttrVal(vals, Number(clothesItem.attributeId), val)
                }
            }
            params = {
                isAddVal: true,
                title: StrVal.LYDETAILATTR.STR102,
                vals: vals,
                arr1: [
                    VarVal.ENTITIATTR.FINAL_HP,
                    VarVal.ENTITIATTR.FINAL_ATTACK,
                    VarVal.ENTITIATTR.FINAL_DEFENSE,
                    VarVal.ENTITIATTR.FINAL_SPEED,
                ],
                arr2: [
                    VarVal.ENTITIATTR.CHANCE_CRITICAL,
                    VarVal.ENTITIATTR.CHANCE_VERTIGO,
                    VarVal.ENTITIATTR.CHANCE_COMBO,
                    VarVal.ENTITIATTR.CHANCE_MISS,
                    VarVal.ENTITIATTR.CHANCE_COUNTER,
                    VarVal.ENTITIATTR.CHANGE_VAMPIRE,
                ],
                arr3: [
                    VarVal.ENTITIATTR.RESISTANCE_CRITICAL,
                    VarVal.ENTITIATTR.RESISTANCE_VERTIGO,
                    VarVal.ENTITIATTR.RESISTANCE_COMBO,
                    VarVal.ENTITIATTR.RESISTANCE_MISS,
                    VarVal.ENTITIATTR.RESISTANCE_COUNTER,
                    VarVal.ENTITIATTR.RESISTANCE_VAMPIRE,
                ],
                arr4: [
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
            }
        } else if (params.type == LyDetailAttrType.STAGEMONSTER) {
            let vals = new Array<string>()
            for (let i = 0; i < VarVal.ENTITIATTR.MAX; i++) {
                vals.push("0");
            }
            let monsterProto = params.monsterProto;
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.FINAL_ATTACK, monsterProto.atk);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.FINAL_HP, monsterProto.hp);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.FINAL_DEFENSE, monsterProto.def);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.FINAL_SPEED, monsterProto.spd);

            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.CHANCE_VERTIGO, monsterProto.stun);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.CHANCE_CRITICAL, monsterProto.crit);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.CHANCE_COMBO, monsterProto.combo);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.CHANCE_MISS, monsterProto.eva);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.CHANCE_COUNTER, monsterProto.counter);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.CHANGE_VAMPIRE, monsterProto.lifesteal);

            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_VERTIGO, monsterProto.stun_resis);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_CRITICAL, monsterProto.crit_resis);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_COMBO, monsterProto.combo_resis);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_MISS, monsterProto.eva_resis);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_COUNTER, monsterProto.counter_resis);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_VAMPIRE, monsterProto.lifesteal_resis);
            params = {
                title: StrVal.LYDETAILATTR.STR103,
                vals: vals,
                arr1: [
                    VarVal.ENTITIATTR.FINAL_HP,
                    VarVal.ENTITIATTR.FINAL_ATTACK,
                    VarVal.ENTITIATTR.FINAL_DEFENSE,
                    VarVal.ENTITIATTR.FINAL_SPEED,
                ],
                arr2: [
                    VarVal.ENTITIATTR.CHANCE_CRITICAL,
                    VarVal.ENTITIATTR.CHANCE_VERTIGO,
                    VarVal.ENTITIATTR.CHANCE_COMBO,
                    VarVal.ENTITIATTR.CHANCE_MISS,
                    VarVal.ENTITIATTR.CHANCE_COUNTER,
                    VarVal.ENTITIATTR.CHANGE_VAMPIRE,
                ],
                arr3: [
                    VarVal.ENTITIATTR.RESISTANCE_CRITICAL,
                    VarVal.ENTITIATTR.RESISTANCE_VERTIGO,
                    VarVal.ENTITIATTR.RESISTANCE_COMBO,
                    VarVal.ENTITIATTR.RESISTANCE_MISS,
                    VarVal.ENTITIATTR.RESISTANCE_COUNTER,
                    VarVal.ENTITIATTR.RESISTANCE_VAMPIRE,
                ],
                arr4: [
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
            }
        } else if (params.type == LyDetailAttrType.CHARACTER) {
            let vals = new Array<string>()
            for (let i = 0; i < params.attr.length; i++) {
                vals.push(params.attr[i]);
            }
            let arr1 = []
            for (let i = 1; i < 5; i++) {
                arr1.push(i)
            }
            let arr2 = []
            for (let i = 5; i < 11; i++) {
                arr2.push(i)
            }
            let arr3 = []
            for (let i = 11; i < 17; i++) {
                arr3.push(i)
            }
            let arr4 = []
            for (let i = 17; i < 31; i++) {
                arr4.push(i)
            }
            params = {
                isAddVal: true,
                title: StrVal.LYDETAILATTR.STR102,
                vals: vals,
                arr1: arr1,
                arr2: arr2,
                arr3: arr3,
                arr4: arr4
            }
        } else if (params.type == LyDetailAttrType.COMPANION) {
            let vals = new Array<string>()
            for (let i = 0; i < VarVal.ENTITIATTR.MAX; i++) {
                vals.push("0");
            }
            let attr = params.attr;
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.FINAL_HP, attr[0]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.FINAL_ATTACK, attr[1]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.FINAL_DEFENSE, attr[2]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.FINAL_SPEED, attr[3]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.HEALTH_GROWUP_PCT, attr[20]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.ATTACK_GROWUP_PCT, attr[21]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.DEFENSE_GROWUP_PCT, attr[22]);

            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.CHANCE_COMBO, attr[4]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.CHANCE_COUNTER, attr[5]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.CHANCE_CRITICAL, attr[6]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.CHANCE_MISS, attr[7]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.CHANGE_VAMPIRE, attr[8]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.CHANCE_VERTIGO, attr[9]);

            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_COMBO, attr[10]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_COUNTER, attr[11]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_CRITICAL, attr[12]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_MISS, attr[13]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_VAMPIRE, attr[14]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.RESISTANCE_VERTIGO, attr[15]);

            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.FINAL_ADD_DAMADE, attr[16]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.FINAL_REDUCE_DAMADE, attr[17]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.ENHANCE_SPIRIT_PET, attr[18]);
            UtilsTool.addEntitiAttrVal(vals, VarVal.ENTITIATTR.ENHANCE_MAGIC, attr[19]);
            params = {
                isAddVal: true,
                title: StrVal.LYDETAILATTR.STR102,
                vals: vals,
                arr1: [
                    VarVal.ENTITIATTR.FINAL_HP,
                    VarVal.ENTITIATTR.FINAL_ATTACK,
                    VarVal.ENTITIATTR.FINAL_DEFENSE,
                    VarVal.ENTITIATTR.FINAL_SPEED,

                    VarVal.ENTITIATTR.HEALTH_GROWUP_PCT,
                    VarVal.ENTITIATTR.ATTACK_GROWUP_PCT,
                    VarVal.ENTITIATTR.DEFENSE_GROWUP_PCT,
                ],
                arr2: [
                    VarVal.ENTITIATTR.CHANCE_COMBO,
                    VarVal.ENTITIATTR.CHANCE_COUNTER,
                    VarVal.ENTITIATTR.CHANCE_CRITICAL,
                    VarVal.ENTITIATTR.CHANCE_MISS,
                    VarVal.ENTITIATTR.CHANGE_VAMPIRE,
                    VarVal.ENTITIATTR.CHANCE_VERTIGO,
                ],
                arr3: [
                    VarVal.ENTITIATTR.RESISTANCE_COMBO,
                    VarVal.ENTITIATTR.RESISTANCE_COUNTER,
                    VarVal.ENTITIATTR.RESISTANCE_CRITICAL,
                    VarVal.ENTITIATTR.RESISTANCE_MISS,
                    VarVal.ENTITIATTR.RESISTANCE_VAMPIRE,
                    VarVal.ENTITIATTR.RESISTANCE_VERTIGO,
                ],
                arr4: [
                    VarVal.ENTITIATTR.FINAL_ADD_DAMADE,
                    VarVal.ENTITIATTR.FINAL_REDUCE_DAMADE,
                    VarVal.ENTITIATTR.ENHANCE_SPIRIT_PET,
                    VarVal.ENTITIATTR.ENHANCE_MAGIC,
                ]
            }
        }
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        // 关闭
        let btn_close: fgui.GButton = getUiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyDetailAttr, 0, null);
        })
        let btn_close1: fgui.GButton = getUiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyDetailAttr, 0, null);
        })
        //文字描述
        let label_xxsx: fgui.GLabel = getUiPanel.getChild("label_xxsx");
        let label_jcsx: fgui.GLabel = getUiPanel.getChild("label_jcsx");
        let label_zdsx: fgui.GLabel = getUiPanel.getChild("label_zdsx");
        let label_xxkx: fgui.GLabel = getUiPanel.getChild("label_xxkx");
        let label_zdkx: fgui.GLabel = getUiPanel.getChild("label_zdkx");
        if (params.title) {
            label_xxsx.text = params.title;
        } else {
            label_xxsx.text = StrVal.LYDETAILATTR.STR101;
        }
        label_jcsx.text = StrVal.LYDETAILATTR.STR2
        label_zdsx.text = StrVal.LYDETAILATTR.STR3
        label_xxkx.text = StrVal.LYDETAILATTR.STR4
        label_zdkx.text = StrVal.LYDETAILATTR.STR5
        // 数据
        let list_attr1: fgui.GList = getUiPanel.getChild("list_attr1");
        let list_attr2: fgui.GList = getUiPanel.getChild("list_attr2");
        let list_attr3: fgui.GList = getUiPanel.getChild("list_attr3");
        let list_attr4: fgui.GList = getUiPanel.getChild("list_attr4");
        this.loadListData(list_attr1, params.arr1, params)
        this.loadListData(list_attr2, params.arr2, params)
        this.loadListData(list_attr3, params.arr3, params)
        this.loadListData(list_attr4, params.arr4, params)
    };
    private intArr: number[] = [
        VarVal.ENTITIATTR.FINAL_HP,
        VarVal.ENTITIATTR.FINAL_ATTACK,
        VarVal.ENTITIATTR.FINAL_DEFENSE,
        VarVal.ENTITIATTR.FINAL_SPEED,
    ]
    private loadListData(listAttr: fgui.GList, arr: number[], params: any): void {
        let vals: string[] = params.vals;
        listAttr.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            let val: string;
            if (vals) {
                val = vals[arr[index] - 1];
            } else {
                val = GameServerData.getInstance().getEntityPlayerAttr(arr[index]);
            }
            let valStr: string;
            let perStr: string;
            if (params.isAddVal) {
                valStr = StrVal.LYDETAILATTR.STR203;
                perStr = StrVal.LYDETAILATTR.STR204;
            } else {
                valStr = StrVal.LYDETAILATTR.STR201;
                perStr = StrVal.LYDETAILATTR.STR202;
            }
            if (this.params.type == LyDetailAttrType.CHARACTER) {
                let str: string = UtilsTool.stringFormat(perStr, [LocaleData.getCharacterAttrById(arr[index]).name, UtilsTool.nToFStr(val)])
                if (arr[index] < 5) {
                    str = UtilsTool.stringFormat(valStr, [LocaleData.getCharacterAttrById(arr[index]).name, UtilsTool.nToFStr(val)])
                }
                obj.getChild("label_txt").text = str
            } else {
                let str: string = UtilsTool.stringFormat(perStr, [StrVal.ENTITI_NAMES[arr[index]], UtilsTool.nToFStr(val)])
                this.intArr.forEach(element => {
                    if (element == arr[index]) {
                        str = UtilsTool.stringFormat(valStr, [StrVal.ENTITI_NAMES[arr[index]], UtilsTool.nToFStr(val)])
                    }
                });
                obj.getChild("label_txt").text = str
            }

        }).bind(this)
        listAttr.numItems = arr.length
        listAttr.touchable = arr.length > 6
    }

    public getIsViewMask(): boolean {
        return false;
    };

}