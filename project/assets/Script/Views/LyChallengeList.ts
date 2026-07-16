//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { LyChallengeDuel } from "./LyChallengeDuel";
import { LyActivityKingMonster } from "./LyActivityKingMonster";
import { LyActivityInvasion } from "./LyActivityInvasion";
import { LyActivityMonsterTower } from "./LyActivityMonsterTower";
import { LyCrossQunYin } from "./LyCrossQunYin";
import { LocaleData } from "../Kernel/LocaleData";
import { GameServerData } from "../Kernel/GameServerData";
import { VarVal } from "../Values/VarVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";

export enum CHALLENGE_TYPES {
    DUEL,
    KING_MONSTER,
    INVASION,
    MONSTER_TOWER,
    CROSS_QUNYIN,
}

export class LyChallengeList extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyMainPage";
        this.viewResI.pkgName = "LyMainPage";
        this.viewResI.comName = "LyChallengeList";
    }

    private CHALLENGE_ITEMS = [
        {id: CHALLENGE_TYPES.DUEL, name: "江湖擂台", backimg:"frame_doufa"},
        {id: CHALLENGE_TYPES.KING_MONSTER, name: "心魔试炼", backimg:"frame_tiaozhanyaowang"},
        {id: CHALLENGE_TYPES.INVASION, name: "魔教来袭", backimg:"frame_yishouruqin"},
        {id: CHALLENGE_TYPES.MONSTER_TOWER, name: "激流塔", backimg:"frame_zhenyaota"},
        {id: CHALLENGE_TYPES.CROSS_QUNYIN, name: "华山论剑", backimg:"frame_qunyingbang"}
    ];

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        // 列表
        let list_item:fgui.GList = uiPanel.getChild("list_item");
        list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let item = this.CHALLENGE_ITEMS[index];
            group_item.data = item

            let label_title: fgui.GTextField = group_item.getChild("label_title");
            label_title.text = item.name;

            let label_desc:fgui.GTextField = group_item.getChild("label_desc");
            
            let btn_challenge: fgui.GLoader = group_item.getChild("btn_challenge");
            btn_challenge.url = UtilsTool.stringFormat("ui://LyMainPage/{0}", [item.backimg]);

            if (item.id == CHALLENGE_TYPES.DUEL) {
                let isActivationSys: boolean = !GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.duel)
                if (!isActivationSys) {
                    PointRedData.getInstance().registerPoint(group_item, PointRedType.LyChallengeDuel);
                    let evolutionRoot = LocaleData.getEvolutionRoot();
                    let proto = LocaleData.getItemProto(evolutionRoot.duelItemId);
                    let count:number = GameServerData.getInstance().getItemCountByProtoId(evolutionRoot.duelItemId);
                    label_desc.text = UtilsTool.stringFormat(StrVal.ACTIVITY_KINGMONSTER.STR9, [proto.name, count]);
                    label_desc.color = UtilsUI.getEnoughColor(count > 0);
                }
                // 点击
                btn_challenge.grayed = isActivationSys
                btn_challenge.onClick(() => {
                    if (isActivationSys) {
                        UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.duel)
                        return
                    }
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyChallengeDuel, 0, {outItem:item});
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyChallengeList, 0, null);
                })
            } else if (item.id == CHALLENGE_TYPES.KING_MONSTER) {
                let isActivationSys: boolean = !GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.king_monster)
                if (!isActivationSys) {
                    PointRedData.getInstance().registerPoint(group_item, PointRedType.LyActivityKingMonster);
                    let quickData:any = LyActivityKingMonster.getQuickData();
                    label_desc.text = UtilsTool.stringFormat(StrVal.ACTIVITY_KINGMONSTER.STR8, [quickData.quickMax - quickData.quickCnt])
                    label_desc.color = UtilsUI.getEnoughColor(quickData.quickMax - quickData.quickCnt > 0);
                }
                // 点击
                btn_challenge.grayed = isActivationSys
                btn_challenge.onClick(() => {
                    if (isActivationSys) {
                        UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.king_monster)
                        return
                    }
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityKingMonster, 0, {outItem:item});
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyChallengeList, 0, null);
                })
            } else if (item.id == CHALLENGE_TYPES.INVASION) {
                let isActivationSys: boolean = !GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.invasion)
                if (!isActivationSys) {
                    PointRedData.getInstance().registerPoint(group_item, PointRedType.LyActivityInvasion);
                    let remainCount:number = LyActivityInvasion.getRemainCount();
                    label_desc.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_INVASION.STR14, [remainCount]);
                    label_desc.color = UtilsUI.getEnoughColor(remainCount > 0);
                }
                // 点击
                btn_challenge.grayed = isActivationSys
                btn_challenge.onClick(() => {
                    if (isActivationSys) {
                        UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.invasion)
                        return
                    }
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityInvasion, 0, {outItem:item});
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyChallengeList, 0, null);
                })
            } else if (item.id == CHALLENGE_TYPES.MONSTER_TOWER) {
                let isActivationSys: boolean = !GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.monster_tower)
                if (!isActivationSys) {
                    PointRedData.getInstance().registerPoint(group_item, PointRedType.LyActivityMonsterTower);
                    let curTier = 0;
                    let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.MONSTOR_TOWER);
                    if (activityState && activityState.data) {
                        curTier = activityState.data.activityTower.curTier;
                    }
                    let towerItem = LocaleData.getTowerItem(curTier + 1);
                    if (!towerItem) {
                        towerItem = LocaleData.getTowerItem(curTier);
                    }
                    label_desc.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_MONSTERTOWER.STR1, [towerItem.tierID, towerItem.stageID]);
                    label_desc.color = UtilsUI.getEnoughColor(true);
                }
                // 点击
                btn_challenge.grayed = isActivationSys
                btn_challenge.onClick(() => {
                    if (isActivationSys) {
                        UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.monster_tower)
                        return
                    }
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityMonsterTower, 0, {outItem:item});
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyChallengeList, 0, null);
                })
            } else if (item.id == CHALLENGE_TYPES.CROSS_QUNYIN) {
                let isActivationSys: boolean = !GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.qunyin)
                if (!isActivationSys) {
                    PointRedData.getInstance().registerPoint(group_item, PointRedType.LyCrossQunYin);
                    let qunyinItem = LocaleData.getItemProtoBySubType(VarVal.itemtype.qunyin_challenge)
                    let itemCount:number = GameServerData.getInstance().getItemCountByProtoId(qunyinItem.id)
                    label_desc.text = UtilsTool.stringFormat(StrVal.ACTIVITY_KINGMONSTER.STR9, [qunyinItem.name, itemCount]);
                    label_desc.color = UtilsUI.getEnoughColor(itemCount > 0);
                }
                // 点击
                btn_challenge.grayed = isActivationSys
                btn_challenge.onClick(() => {
                    if (isActivationSys) {
                        UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.qunyin)
                        return
                    }
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCrossQunYin, 0, {outItem:item});
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyChallengeList, 0, null);
                })
            }
        }
        list_item.numItems = this.CHALLENGE_ITEMS.length;

        // 重置高度适配（如果编辑器里高度跟当前高度相同，margin计算就会出问题）
        list_item.height = this.CHALLENGE_ITEMS.length * list_item.getChildAt(0).height
        + (this.CHALLENGE_ITEMS.length - 1) * list_item.lineGap
        + list_item.margin.top + list_item.margin.bottom;

        // 背景
        let img_back: fgui.GTextField = uiPanel.getChild("img_back");
        img_back.height = img_back.height - list_item.initHeight + list_item.height;

        let btn_back:fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyChallengeList, 0, null);
        })
    }

    public getIsViewMask():boolean {
        return false;
    }
}