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
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { PointRedData } from "../Kernel/PointRedData";
import { VarVal } from "../Values/VarVal";

export class LyStageReward extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyStage";
        this.viewResI.pkgName = "LyStage";
        this.viewResI.comName = "LyStageReward";
    }

    private rewardItems:Array<any>;

    public onViewCreate(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = uiPanel.getChild("group_main");

        let label_title: fgui.GTextField = group_main.getChild("label_title");
        label_title.text = StrVal.LYSTAGE.STR5;
        
        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyStageReward, 0, null);
        })

        let btn_close: fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        this.refreshList();
    }

    private refreshList(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = uiPanel.getChild("group_main");

        this.rewardItems = this.getListData();
        // 列表
        let list_reward:fgui.GList = group_main.getChild("list_reward");
        list_reward.setVirtual();
        list_reward.itemRenderer = (index:number, group_rewarditem:fgui.GComponent) => {
            let stageItem = this.rewardItems[index];
            let label_tips:fgui.GTextField = group_rewarditem.getChild("label_tips");
            label_tips.text = UtilsTool.stringFormat(StrVal.LYSTAGEREWARD.STR5, [stageItem.stage_name, stageItem.chapter_id, stageItem.stage_id]);
            // 奖励
            let bonuseItems:Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(stageItem.chapter_reward);
            if (stageItem.equipId.length > 1) {
                bonuseItems.push(UtilsUI.getBonuseItem(VarVal.bonusType.equip, null, stageItem.equipId, "1"));
            }
            let list_item:fgui.GList = group_rewarditem.getChild("list_item");
            list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
            }
            list_item.numItems = bonuseItems.length;
            // 一键领取
            let btn_take: fgui.GButton = group_rewarditem.getChild("btn_take");
            PointRedData.getInstance().updateManualPoint(btn_take, false);
            let label_take:fgui.GTextField = group_rewarditem.getChild("label_take");
            let img_paster:fgui.GImage = group_rewarditem.getChild("img_paster");
            
            // 是否已领取
            btn_take.visible = false;
            label_take.visible = false;
            img_paster.visible = false;
            let state:number = LyStageReward.getItemState(stageItem);
            if (state == 0) {
                btn_take.visible = true;
                btn_take.enabled = false;
                btn_take.text = StrVal.LYSTAGEREWARD.STR3;
            } else if (state == 1) {
                PointRedData.getInstance().updateManualPoint(btn_take, true);
                btn_take.visible = true;
                btn_take.enabled = true;
                btn_take.text = StrVal.LYSTAGEREWARD.STR2;
                btn_take.clearClick();
                btn_take.onClick(() => {
                    let bonuseItems = this.getEquipBonuseItems();
                    UtilsUI.lockWait();
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait();
                        if (args.errorcode == 0) {
                            if (args.bonusesResultArr && args.bonusesResultArr.length > 0) {
                                let aaa = UtilsUI.getBonuseItemsByString(GameServerData.getInstance().bonusesResultsToString(args.bonusesResultArr));
                                for (let i = 0; i < aaa.length; i++) {
                                    bonuseItems.push(aaa[i]);
                                }
                            }
                            if (bonuseItems.length > 0) {
                                UtilsUI.showItemReward({bonuseItems:bonuseItems});
                                this.refreshList();
                            }
                        } else {
                            UtilsUI.showMsgTip(args.errorcode);
                        }
                    }, "claimchapterreward", null);
                })
            } else {
                label_take.visible = true;
                img_paster.visible = true;
                label_take.text = StrVal.LYSTAGEREWARD.STR1;
            }
        }
        UtilsUI.setFguiGlistDelayNumItems(list_reward, this.rewardItems.length);
    }

    private static getItemState(stageItem: any): number {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo();
        let stageId:number = Number(stageItem.id);
        if (stageId > fullInfo.base.curStageLevel) {
            return 0;
        } else if (stageId > fullInfo.base.curChapterReward) {
            return 1;
        } else {
            return 2;
        }
    }

    private getListData(): Array<any> {
        let __datas:Array<any> = LocaleData.getStageChapterRewardItems();
        // 先按照id排序
        __datas.sort((itemA, itemB) => {
            return Number(itemA.id) - Number(itemB.id);
        })
        // 把可领取的插入开头
        // 把已领取的插入末尾
        let off = 0; // 注意这个偏移量，要的。
        for (let i = __datas.length - 1; i >= 0 + off; i--) {
            let state1 = LyStageReward.getItemState(__datas[i]);
            if (state1 == 2) {
                let arr = __datas.splice(i, 1);
                __datas.push(arr[0]);
            } else if (state1 == 1) {
                let arr = __datas.splice(i, 1);
                __datas.unshift(arr[0]);
                off++;
                i++;
            }
        }
        return __datas;
    }

    private getEquipBonuseItems(): Array<any> {
        let arr = new Array<any>();
        for (let i = 0; i < this.rewardItems.length; i++) {
            let stageItem = this.rewardItems[i];
            if (stageItem.equipId.length > 1) {
                let state = LyStageReward.getItemState(stageItem);
                if (state == 1) {
                    arr.push(UtilsUI.getBonuseItem(VarVal.bonusType.equip, null, stageItem.equipId, "1"));   
                }
            }
        }
        return arr;
    }

    public getIsViewMask(): boolean {
        return false;
    }

    public static isViewRedPoint():boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.adventure)) {
            return false;
        }
        let __datas:Array<any> = LocaleData.getStageChapterRewardItems();
        for (let i = 0; i < __datas.length; i++) {
            let state = LyStageReward.getItemState(__datas[i]);
            if (state == 1) {
                return true;
            }
        }
        return false;
    }
}