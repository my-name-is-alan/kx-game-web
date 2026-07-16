//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { VarVal } from "../Values/VarVal";
import { GameServer } from "../Kernel/GameServer";

export class LyPetRecruitpet extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyPet";
        this.viewResI.pkgName = "LyPet";
        this.viewResI.comName = "LyPetRecruitpet";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(_params: any): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        // UtilsUI.playCommonGroupAni(this.uiPanel, null)
        let btn_close = this.getUiPanel().getChild("btn_close")
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPetRecruitpet, 0, null)
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPetRecruitpet, 0, null);
        })

        this.uiPanel.getChild("label_title", fgui.GLabel).text = StrVal.LYPET.STR27
        this.uiPanel.getChild("label_str28", fgui.GLabel).text = StrVal.LYPET.STR28

        this.onBonusesList()
    }
    private petConsumption: any
    private fullInfoBase: any
    private petConsumptionReward: any

    private selectIndex: number = 0
    private onBonusesList(): void {
        // let group_pointArr: fgui.GComponent[] = []
        this.fullInfoBase = GameServerData.getInstance().getPlayerFullInfo().base
        this.petConsumptionReward = []
        for (let i = 0; i < this.fullInfoBase.petConsumptionReward.length; i++) {
            let item = this.fullInfoBase.petConsumptionReward[i]
            if (item.bonuses.length > 0 || i == this.fullInfoBase.petConsumptionReward.length - 1) {
                this.petConsumptionReward.push(item)
            }
        }
        let btn_left: fgui.GButton = this.uiPanel.getChild("btn_left")
        btn_left.clearClick()
        btn_left.onClick(() => {
            if (this.selectIndex > 0) {
                this.selectIndex--
                this.onBonusesList()
            }
        })
        let btn_right: fgui.GButton = this.uiPanel.getChild("btn_right")
        btn_right.clearClick()
        btn_right.onClick(() => {
            if (this.selectIndex < this.petConsumptionReward.length - 1) {
                this.selectIndex++
                this.onBonusesList()
            }
        })
        let addNum = this.selectIndex > 5 ? this.selectIndex - 5 : 0
        for (let i = 0; i < 6; i++) {
            let group_point: fgui.GButton = this.uiPanel.getChild("group_point" + (i + 1))
            if (this.petConsumptionReward.length > i! || i == 0) {
                group_point.text = String(addNum + i)
                group_point.visible = true
                group_point.clearClick()
                group_point.onClick(() => {
                    this.selectIndex = addNum + i
                    this.onBonusesList()
                })
            } else {
                group_point.visible = false
            }
            if (this.selectIndex == addNum + i) {
                group_point.selected = true
            }
        }
        let petConsumptionRewardItem = this.petConsumptionReward[this.selectIndex]
        let guarantees: any = LocaleData.getPetSpecialGuarantees()

        this.petConsumption = this.fullInfoBase.petConsumption
        while (this.petConsumption > Number(guarantees[guarantees.length - 1].consumption)) {
            this.petConsumption -= Number(guarantees[guarantees.length - 1].consumption)
        }
        let isGray: boolean = true
        let list_bonuses: fgui.GList = this.uiPanel.getChild("list_bonuses")
        list_bonuses.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            let item = guarantees[index]
            let isGet: boolean = false
            if (this.petConsumption >= Number(item.consumption) || this.selectIndex < this.petConsumptionReward.length - 1) {
                isGet = true
                if (petConsumptionRewardItem) {
                    for (let j = 0; j < petConsumptionRewardItem.bonuses.length; j++) {
                        const element = petConsumptionRewardItem.bonuses[j];
                        if (element == Number(item.id)) {
                            isGet = false
                        }
                    }
                }
            } else {
                isGet = false
            }
            let label_consumption: fgui.GLabel = obj.getChild("label_consumption")
            label_consumption.text = item.consumption
            let group_gray: fgui.GGroup = obj.getChild("group_gray")
            let group_yellow: fgui.GGroup = obj.getChild("group_yellow")
            group_gray.visible = this.petConsumption < Number(item.consumption)
            group_yellow.visible = this.petConsumption >= Number(item.consumption) || this.selectIndex < this.petConsumptionReward.length - 1
            let img_gray1 = obj.getChild("img_gray1")
            let img_yellow1 = obj.getChild("img_yellow1")
            img_gray1.visible = img_yellow1.visible = index != 0

            let img_gray2 = obj.getChild("img_gray2")
            let img_yellow2 = obj.getChild("img_yellow2")
            img_gray2.visible = img_yellow2.visible = index != guarantees.length - 1
            let group_bubble: fgui.GGroup = obj.getChild("group_bubble")
            if (isGray && this.petConsumption < Number(item.consumption) && this.selectIndex == this.petConsumptionReward.length - 1) {
                isGray = false
                group_bubble.visible = true
                let label_need: fgui.GLabel = obj.getChild("label_need")
                let label_str29: fgui.GLabel = obj.getChild("label_need")
                label_str29.text = StrVal.LYPET.STR29
                label_need.text = this.petConsumption
            } else {
                group_bubble.visible = false
            }

            let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(item.bonuses);
            let list_item: fgui.GList = obj.getChild("list_item")
            list_item.itemRenderer = (i: number, group_item: fgui.GComponent) => {
                let GroupItem: fgui.GComponent = group_item.getChild("GroupItem")
                let group_suo: fgui.GGroup = group_item.getChild("group_suo")
                group_suo.visible = !group_yellow.visible
                let group_isget: fgui.GGroup = group_item.getChild("group_isget")
                group_isget.visible = isGet

                let aniBox = group_item.getTransition("t0")
                if (!group_suo.visible && !group_isget.visible) {
                    aniBox.play(null, -1)
                } else {
                    aniBox.stop()
                }
                UtilsUI.setUIGroupItem(bonuseItems[i], GroupItem, null);
            }
            UtilsUI.setFguiGlistDelayNumItems(list_item, bonuseItems.length);
            let group_box: fgui.GList = obj.getChild("group_box")
            if (item.box != "0") {
                group_box.visible = true
                let bonuseItemBox = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, item.box, "1")
                UtilsUI.setUIGroupItem(bonuseItemBox, group_box.getChild("GroupItem"), null);
                let group_suo: fgui.GGroup = group_box.getChild("group_suo")
                group_suo.visible = !group_yellow.visible
                let group_isget: fgui.GGroup = group_box.getChild("group_isget")
                group_isget.visible = isGet
                let aniBox = group_box.getTransition("t0")
                if (!group_suo.visible && !group_isget.visible) {
                    aniBox.play(null, -1)
                } else {
                    aniBox.stop()
                }
            } else {
                group_box.visible = false
            }

            let btn_get = obj.getChild("btn_get")
            btn_get.visible = (this.petConsumption >= Number(item.consumption) || this.selectIndex < this.petConsumptionReward.length - 1) && !isGet
            btn_get.clearClick()
            btn_get.onClick(() => {
                let takeConsumptionBonuseId: number = 0
                for (let i = 0; i < petConsumptionRewardItem.bonuses.length; i++) {
                    const element = petConsumptionRewardItem.bonuses[i];
                    if (item.id == element) {
                        takeConsumptionBonuseId = i + 1
                    }
                }
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.onBonusesList()
                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "takeConsumptionBonuse", {
                    groupId: petConsumptionRewardItem.id,
                    id: takeConsumptionBonuseId
                })
            })

        }).bind(this)
        // list_bonuses.numItems = 0
        UtilsUI.setFguiGlistDelayNumItems(list_bonuses, guarantees.length);
    }

    public getIsViewMask(): boolean {
        return false;
    }
}


