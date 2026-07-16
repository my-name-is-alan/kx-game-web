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
import { LyActivityMonsterTower } from "./LyActivityMonsterTower";
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { LyGuideDetail } from "./LyGuideDetail";
import { LocaleData } from "../Kernel/LocaleData";

export class LyActivityMonsterTowerOneKey extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyActivityMonsterTower;
        this.viewResI.pkgName = "LyActivityMonsterTower";
        this.viewResI.comName = "LyActivityMonsterTowerOneKey";
    }

    private isOneKeyAdd:boolean;
    private preinstall:Array<number>;

    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("group_main");

        let label_title: fgui.GTextField = group_main.getChild("label_title");
        label_title.text = StrVal.LYACTIVITY_MONSTERTOWER.STR401;

        // 介绍
        let btn_detail: fgui.GButton = group_main.getChild("btn_detail");
        btn_detail.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:StrVal.LYACTIVITY_MONSTERTOWER.STR401, detail:LocaleData.getActivityXml(VarVal.ACTIVITY_ID.MONSTOR_TOWER).detailPreset});
        })

        let label_desc: fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = StrVal.LYACTIVITY_MONSTERTOWER.STR404;

        let label_prop1: fgui.GTextField = group_main.getChild("label_prop1");
        label_prop1.text = StrVal.LYACTIVITY_MONSTERTOWER.STR411;
        let label_prop2: fgui.GTextField = group_main.getChild("label_prop2");
        label_prop2.text = StrVal.LYACTIVITY_MONSTERTOWER.STR412;
        let label_prop3: fgui.GTextField = group_main.getChild("label_prop3");
        label_prop3.text = StrVal.LYACTIVITY_MONSTERTOWER.STR413;
        let label_prop4: fgui.GTextField = group_main.getChild("label_prop4");
        label_prop4.text = StrVal.LYACTIVITY_MONSTERTOWER.STR414;
        let label_prop5: fgui.GTextField = group_main.getChild("label_prop5");
        label_prop5.text = StrVal.LYACTIVITY_MONSTERTOWER.STR415;

        let buffTypes:any = {};
        let allBuffs = LocaleData.getTowerBuffItems();
        for (let i = 0; i < allBuffs.length; i++) {
            let buffItem = allBuffs[i];
            buffTypes[buffItem.buffId] = buffItem.name;
        }
        let comboValues:Array<string> = new Array<string>();
        let comboNames:Array<string> = new Array<string>();
        comboValues.push("0");
        comboNames.push(StrVal.COMMON.STR19);
        for (let key in buffTypes) {
            comboValues.push(key);
            comboNames.push(buffTypes[key]);
        }
        let combos:Array<fgui.GComboBox> = [
            group_main.getChild("combo_prop1"),
            group_main.getChild("combo_prop2"),
            group_main.getChild("combo_prop3"),
            group_main.getChild("combo_prop4"),
            group_main.getChild("combo_prop5")
        ]
        let setAllComboValues = () => {
            for (let slot = 0; slot < combos.length; slot++) {
                let combo_prop = combos[slot];
                let type = String(this.preinstall[slot]);
                for (let iii = 0; iii < comboValues.length; iii++) {
                    if (type == comboValues[iii]) {
                        combo_prop.selectedIndex = iii;
                        break;
                    }
                }
            }
        }
        let onComboChanged = (combo_prop: fgui.GComboBox) => {
            let place = 0;
            let attr = 0;
            for (let iii = 0; iii < combos.length; iii++) {
                if (combo_prop === combos[iii]) {
                    place = iii + 1;
                    attr = Number(comboValues[combo_prop.selectedIndex]);
                    break;
                }
            }
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    this.refreshState();
                    setAllComboValues();
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "towerPreset", {
                place:place,
                attr:attr,
            });
        }
        let onPopup = (combo_prop: fgui.GComboBox) => {
            let list = combo_prop.dropdown.getChild("list", fgui.GList);
            for (let i = 0; i < list.numChildren; i++) {
                let isHit = false;
                for (let jjj = 0; jjj < this.preinstall.length; jjj++) {
                    if (this.preinstall[jjj] == Number(comboValues[i])) {
                        isHit = true;
                        break;
                    }
                }
                list.getChildAt(i, fgui.GComponent).getChild("img_check", fgui.GImage).visible = isHit;
            }
        }
        for (let slot = 0; slot < combos.length; slot++) {
            let combo_prop = combos[slot];
            combo_prop.items = comboNames;
            combo_prop.on(fgui.Event.STATUS_CHANGED, onComboChanged);
            combo_prop.onPopup = onPopup;
        }
        this.refreshState();
        setAllComboValues();

        // 关闭
        let btn_back: fgui.GButton = getUiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityMonsterTowerOneKey, 0, null);
        })

        let btn_close: fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        // 确定
        let btn_comfirm: fgui.GButton = group_main.getChild("btn_comfirm");
        if (this.isOneKeyAdd) {
            btn_comfirm.text = StrVal.LYACTIVITY_MONSTERTOWER.STR403;
        } else {
            btn_comfirm.text = StrVal.LYACTIVITY_MONSTERTOWER.STR402;
        }
        btn_comfirm.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyActivityMonsterTower, 0, {type:2});
                    btn_back.fireClick();
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "towerPreset", {
                place:0,
                attr:0,
            });
        })
    }

    private refreshState(): void {
        this.isOneKeyAdd = false;
        this.preinstall = [0,0,0,0,0];
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.MONSTOR_TOWER);
        if (activityState && activityState.data) {
            this.isOneKeyAdd = (activityState.data.activityTower.preinstallStart == 1);
            this.preinstall = activityState.data.activityTower.preinstall;
        }
    }

    public getIsViewMask(): boolean {
        return false;
    }
}