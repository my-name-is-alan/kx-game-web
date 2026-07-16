//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { Color } from "cc";
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanSoloPassportGift extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClanSolo";
        this.viewResI.pkgName = "LyClanSolo";
        this.viewResI.comName = "LyClanSoloPassportGift";
    }
    private uiPanel: fgui.GComponent
    private giftType: number//1中级礼包，2高级礼包
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        this.giftType = params.type
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloPassportGift, 0, null);
        })
        // let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        // btn_close1.onClick(() => {
        //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloPassportGift, 0, null);
        // })

        this.registerRequest((args) => {
            // UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloPassportGift, 0, null);

            let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.stone, null, null, args.stone);
            UtilsUI.showItemReward({ bonuseItems: [bonuseItem], rebateBonuseItems: UtilsUI.getRebateBonuseItems() });


        }, "onClanSoloPayPassport");

        let buyData: any = null


        let btn_buy: fgui.GButton = this.uiPanel.getChild("btn_buy")
        btn_buy.onClick(() => {
            UtilsUI.payRechargeItem((errmsg: string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
            }, buyData, buyData.type, buyData.value);
        })
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let clanSoloPlayer: any = fullInfo.clanSoloPlayer
        let clanSoloMyselfInfo: any = clanSoloPlayer.clanSoloMyselfInfo

        let clanSoloRoot = LocaleData.getClanSoloRoot()
        let label_stone: fgui.GLabel = this.uiPanel.getChild("label_stone")
        let label_giftStone: fgui.GLabel = this.uiPanel.getChild("label_giftStone")
        let label_passportStone: fgui.GLabel = this.uiPanel.getChild("label_passportStone")
        this.uiPanel.getChild("label_str36", fgui.GLabel).text = StrVal.LYCLANSOLO.STR36
        let list_itemAll: fgui.GList = this.uiPanel.getChild("list_itemAll")
        let list_item: fgui.GList = this.uiPanel.getChild("list_item")
        let playerbase = GameServerData.getInstance().getPlayerFullInfo().base
        label_stone.text = playerbase.stone
        let passportXml = LocaleData.getClanSoloPassport()
        let img_title: fgui.GLoader = this.uiPanel.getChild("img_title")
        if (this.giftType == 1) {
            img_title.url = "ui://LyClanSolo/word_shirupozhu"
            let itemAllArr = []
            for (let i = 0; i < passportXml.length; i++) {
                let item1 = passportXml[i]
                let data = {
                    midItemId: item1.midItemId,
                    midItemCount: Number(item1.midItemCount),
                }
                if (itemAllArr.length > 0) {
                    let isNew = true
                    for (let j = 0; j < itemAllArr.length; j++) {
                        let item2 = itemAllArr[j]
                        if (item2.midItemId == data.midItemId) {
                            item2.midItemCount += data.midItemCount
                            isNew = false
                        }
                    }
                    if (isNew) {
                        itemAllArr.push(data)
                    }
                } else {
                    itemAllArr.push(data)
                }
            }
            list_itemAll.itemRenderer = (index: number, child: fgui.GComponent) => {
                let data = itemAllArr[index]
                let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, data.midItemId, data.midItemCount)
                UtilsUI.setUIGroupItem(bonuseItem, child, null);
            }
            list_itemAll.numItems = itemAllArr.length
            //===============================
            // let itemArr = []
            // passportXml[i]
            // for (let i = 0; i < passportXml.length; i++) {
            //     let item1 = passportXml[i]
            //     let data = {
            //         midItemId: item1.midItemId,
            //         midItemCount: Number(item1.midItemCount),
            //     }
            //     if (itemArr.length > 0) {
            //         let isNew = true
            //         for (let j = 0; j < itemArr.length; j++) {
            //             let item2 = itemArr[j]
            //             if (item2.midItemId == data.midItemId) {
            //                 item2.midItemCount += data.midItemCount
            //                 isNew = false
            //             }
            //         }
            //         if (isNew) {
            //             itemArr.push(data)
            //         }
            //     } else {
            //         itemArr.push(data)
            //     }
            // }
            let item = passportXml[(clanSoloMyselfInfo.passportLevel - 1) < 0 ? 0 : (clanSoloMyselfInfo.passportLevel - 1)]
            list_item.itemRenderer = (index: number, child: fgui.GComponent) => {
                let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, item.midItemId, item.midItemCount)
                UtilsUI.setUIGroupItem(bonuseItem, child, null);
            }
            list_item.numItems = 1
            //=============================== 
            label_giftStone.text = clanSoloRoot.passportMidPriceTip
            buyData = LocaleData.getPayItem(clanSoloRoot.passportMidPayId)
            UtilsUI.setButtonIcon(btn_buy, VarVal.bonusType.chance, String(Number(buyData.money) / 100))
            label_passportStone.text = clanSoloRoot.passportMidStone

            let group_rebeatfan: fgui.GComponent = this.uiPanel.getChild("group_rebeatfan")
            UtilsUI.setPayItemRebateComp(group_rebeatfan, buyData);
        } else if (this.giftType == 2) {
            img_title.url = "ui://LyClanSolo/word_suoxiangpimi"
            let itemAllArr = []
            for (let i = 0; i < passportXml.length; i++) {
                let item1 = passportXml[i]
                let data = {
                    highItemId: item1.highItemId,
                    highItemCount: Number(item1.highItemCount),
                }
                if (itemAllArr.length > 0) {
                    let isNew = true
                    for (let j = 0; j < itemAllArr.length; j++) {
                        let item2 = itemAllArr[j]
                        if (item2.highItemId == data.highItemId) {
                            item2.highItemCount += data.highItemCount
                            isNew = false
                        }
                    }
                    if (isNew) {
                        itemAllArr.push(data)
                    }
                } else {
                    itemAllArr.push(data)
                }
            }
            for (let i = 0; i < passportXml.length; i++) {
                let item1 = passportXml[i]
                let data = {
                    highItemId: item1.highItemId2,
                    highItemCount: Number(item1.highItemCount2),
                }
                if (itemAllArr.length > 0) {
                    let isNew = true
                    for (let j = 0; j < itemAllArr.length; j++) {
                        let item2 = itemAllArr[j]
                        if (item2.highItemId == data.highItemId) {
                            item2.highItemCount += data.highItemCount
                            isNew = false
                        }
                    }
                    if (isNew) {
                        itemAllArr.push(data)
                    }
                } else {
                    itemAllArr.push(data)
                }
            }
            list_itemAll.itemRenderer = (index: number, child: fgui.GComponent) => {
                let data = itemAllArr[index]
                let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, data.highItemId, data.highItemCount)
                UtilsUI.setUIGroupItem(bonuseItem, child, null);
            }
            list_itemAll.numItems = itemAllArr.length

            let passportItem = passportXml[(clanSoloMyselfInfo.passportLevel - 1) < 0 ? 0 : (clanSoloMyselfInfo.passportLevel - 1)]
            let itemArr
            if (passportItem.highItemId == passportItem.highItemId2) {
                let data1 = {
                    highItemId: passportItem.highItemId,
                    highItemCount: Number(passportItem.highItemCount) + Number(passportItem.highItemCount2),
                }

                itemArr = [data1]
            } else {
                let data1 = {
                    highItemId: passportItem.highItemId,
                    highItemCount: Number(passportItem.highItemCount),
                }
                let data2 = {
                    highItemId: passportItem.highItemId2,
                    highItemCount: Number(passportItem.highItemCount2),
                }
                itemArr = [data1, data2]
            }
            list_item.itemRenderer = (index: number, child: fgui.GComponent) => {
                let item = itemArr[index]
                let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, item.highItemId, String(item.highItemCount))
                UtilsUI.setUIGroupItem(bonuseItem, child, null);
            }
            list_item.numItems = itemArr.length
            label_giftStone.text = clanSoloRoot.passportHighPriceTip
            buyData = LocaleData.getPayItem(clanSoloRoot.passportHighPayId)
            UtilsUI.setButtonIcon(btn_buy, VarVal.bonusType.chance, String(Number(buyData.money) / 100))
            label_passportStone.text = clanSoloRoot.passportHighStone
            let group_rebeatfan: fgui.GComponent = this.uiPanel.getChild("group_rebeatfan")
            UtilsUI.setPayItemRebateComp(group_rebeatfan, buyData);
        }
    };

    public getIsViewMask(): boolean {
        return false;
    };

}
