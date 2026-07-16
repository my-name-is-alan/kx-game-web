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
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyClanPopup } from "./LyClanPopup";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanMerchant extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClan";
        this.viewResI.pkgName = "LyClan";
        this.viewResI.comName = "LyClanMerchant";
    }
    private uiPanel: fgui.GComponent
    private spineMerchant;
    public onViewCreate(): void {
        this.uiPanel = this.getUiPanel().getChild("group_clanMerchant")
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanMerchant, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanMerchant, 0, null);
        })
        let btn_calnPopup2: fgui.GButton = this.uiPanel.getChild("btn_calnPopup2");
        btn_calnPopup2.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanPopup, 0, { tispType: 2 });
        })
        this.uiPanel.getChild("label_str105").text = StrVal.LYCLAN.STR105
        let label_merchantStone: fgui.GLabel = this.uiPanel.getChild("label_merchantStone")
        label_merchantStone.text = LocaleData.getClanRoot().merchantStone
        this.spineMerchant = new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            spp.playAnimation("stand_normal", true);
        }, this.uiPanel.getChild("loader_spine"), "cj_kanjiashangren")

        this.onMerchant()
    };
    private onMerchant(): void {
        let label_dec: fgui.GLabel = this.uiPanel.getChild("label_dec")
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanInfo = playerClanInfo.clanInfo
        let myselfInfo = playerClanInfo.myselfInfo
        let clanMember = playerClanInfo.clanMember
        let merchantStatus0 = []//未砍价
        let merchantStatus1 = []//已经砍价/已经购买
        for (let i = 0; i < clanMember.length; i++) {
            const element = clanMember[i];
            if (element.merchantStatus == 0) {
                merchantStatus0.push(element)
            } else {
                merchantStatus1.push(element)
            }
        }
        merchantStatus1.sort((inst1, inst2) => {
            return Number(inst2.bargainPrice) - Number(inst1.bargainPrice);
        })
        let goodsData = LocaleData.getClanMerchantById(clanInfo.merchantId)
        // let merchantGoodsId: string[] = clanInfo.merchantGoodsId.split(",")
        for (let i = 1; i <= 4; i++) {
            let itemId = goodsData["itemId" + i]
            let itemCount = goodsData["itemCount" + i]
            let bonuseItems1: BonuseItem
            if (!LocaleData.isItem(itemId)) {
                // if (goodsData.itemId == VarVal.bonusType.money) {
                let bonusType = LocaleData.getShopItemBonusType(itemId);
                bonuseItems1 = UtilsUI.getBonuseItem(bonusType, null, null, itemCount);
                // bonuseItems1 = UtilsUI.getBonuseItem(VarVal.bonusType.money, null, null, goodsData.itemCount)
            } else {
                bonuseItems1 = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, itemId, itemCount)
            }
            let group_goods: fgui.GComponent = this.uiPanel.getChild("group_goods" + i)
            UtilsUI.setUIGroupItem(bonuseItems1, group_goods, null);
        }
        let label_merchantPrice: fgui.GLabel = this.uiPanel.getChild("label_merchantPrice")
        let clanRoot = LocaleData.getClanRoot()
        label_merchantPrice.text = clanInfo.merchantPrice

        let prices: any = LocaleData.getClanDialogueByPrice(clanInfo.merchantPrice)
        this.spineMerchant.playAnimation(prices.spine, true);


        let label_bargainNumber: fgui.GLabel = this.uiPanel.getChild("label_bargainNumber")
        let label_coinBargain: fgui.GLabel = this.uiPanel.getChild("label_coinBargain")

        let bargainNumber1 = merchantStatus1.length
        let bargainNumber2 = clanInfo.number
        let bargainNumber3 = clanInfo.merchantPrice
        label_bargainNumber.text = UtilsTool.stringFormat(StrVal.LYCLAN.STR12, [bargainNumber1, bargainNumber2])
        label_coinBargain.text = String(Number(LocaleData.getClanRoot().merchantStone) - clanInfo.merchantPrice)
        let btn_clanMerchantBargain: fgui.GButton = this.uiPanel.getChild("btn_clanMerchantBargain")
        btn_clanMerchantBargain.text = StrVal.LYCLAN.STR104
        let merchantStatusStr: string
        btn_clanMerchantBargain.enabled = true
        if (myselfInfo.merchantStatus == 0) {
            merchantStatusStr = "clanMerchantBargain"
            btn_clanMerchantBargain.text = StrVal.LYCLAN.STR64
            label_dec.text = prices.dialogue1
        } else if (myselfInfo.merchantStatus == 1) {
            merchantStatusStr = "clanMerchantBuy"
            btn_clanMerchantBargain.text = StrVal.LYCLAN.STR65
            label_dec.text = prices.dialogue2
        } else if (myselfInfo.merchantStatus == 2) {
            btn_clanMerchantBargain.text = StrVal.LYCLAN.STR66
            btn_clanMerchantBargain.enabled = false
            label_dec.text = prices.dialogue3
        }


        btn_clanMerchantBargain.clearClick()
        btn_clanMerchantBargain.onClick(() => {
            let call = () => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        if (args.itemInserts) {
                            UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([{ inserts: args.itemInserts }]) });
                        }
                        this.onMerchant()
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, merchantStatusStr, null)
            }
            if (myselfInfo.merchantStatus == 1) {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                    UtilsTool.stringFormat(StrVal.LYCLAN.STR28, [clanInfo.merchantPrice, "ui://CCommon/Props-yubi"]), null,
                    StrVal.COMMON.STR32, null,
                    StrVal.COMMON.STR33, () => {

                        call()

                    }, "", null)
            } else {
                call()
            }
        })
        // btn_clanMerchantBargain.
        let list_merchantStatus: fgui.GList = this.uiPanel.getChild("list_merchantStatus")
        list_merchantStatus.itemRenderer = (index: number, obj: fgui.GComponent) => {
            let label_name: fgui.GLabel = obj.getChild("label_name")
            label_name.text = UtilsTool.stringFormat("{0}.{1}", [index + 1, merchantStatus1[index].playerInfo.name])
            let label_bargainPrice: fgui.GLabel = obj.getChild("label_bargainPrice")
            label_bargainPrice.text = merchantStatus1[index].bargainPrice
            let group_status: fgui.GGraph = obj.getChild("group_status")
            group_status.visible = merchantStatus1[index].merchantStatus == 2

            obj.getChild("label_str106").text = StrVal.LYCLAN.STR106
            obj.getChild("label_str66").text = StrVal.LYCLAN.STR66
        }
        list_merchantStatus.numItems = merchantStatus1.length
    }
    public static isViewRedPoint(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.clan) || !GameServerData.getInstance().isClanHas()) {
            return false;
        }
        let currentTime: number = GameServerData.getInstance().getServerTime();
        let playerClanInfo = GameServerData.getInstance().getPlayerFullInfo().clan
        let clanInfo = playerClanInfo.clanInfo
        let myselfInfo = playerClanInfo.myselfInfo
        let time: number = clanInfo.merchantTime - currentTime
        if (time > 0) {
            if (myselfInfo.merchantStatus == 0) {
                return true
            }
        }
        return false
    }



    public getIsViewMask(): boolean {
        return false;
    };

}