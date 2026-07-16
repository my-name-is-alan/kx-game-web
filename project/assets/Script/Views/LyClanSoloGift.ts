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
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { PointRedData } from "../Kernel/PointRedData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, MonthCardItemType, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanSoloGift extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClanSolo";
        this.viewResI.pkgName = "LyClanSolo";
        this.viewResI.comName = "LyClanSoloGift";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloGift, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloGift, 0, null);
        })
        this.uiPanel.getChild("label_title", fgui.GLabel).text = StrVal.LYCLANSOLO.STR2

        this.registerRequest((args) => {
            this.initialize()
            UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]), rebateBonuseItems: UtilsUI.getRebateBonuseItems() });
        }, "onClanSoloPayGift");

        this.initialize()
    };

    private initialize(): void {
        let giftXml = LocaleData.getClanSoloGift()
        let list_gift: fgui.GList = this.uiPanel.getChild("list_gift")
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let clanSoloBuyGift: any = fullInfo.clanSoloPlayer.clanSoloBuyGift
        list_gift.setVirtual();
        list_gift.itemRenderer = (index: number, child: fgui.GComponent) => {
            let data = giftXml[index];
            let label_des: fgui.GLabel = child.getChild("label_des")
            let label_day: fgui.GLabel = child.getChild("label_day")
            let list_item: fgui.GList = child.getChild("list_item")
            let btn_go: fgui.GButton = child.getChild("btn_go")
            let get: fgui.GButton = child.getChild("get")
            let group_rebeatfan: fgui.GComponent = child.getChild("group_rebeatfan")
            group_rebeatfan.visible = false
            label_des.text = data.name
            let maxCoun = Number(data.dailyLimit)
            for (let i = 0; i < clanSoloBuyGift.length; i++) {
                const element = clanSoloBuyGift[i];
                if (data.id == element.cfgId) {
                    maxCoun = maxCoun - element.count
                }
            }
            label_day.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR14, [maxCoun])
            let payData = null
            PointRedData.getInstance().updateManualPoint(btn_go, false);
            if (data.type == "1") {
                if (data.param == "") {
                    btn_go.getChild("icon", fgui.GLoader).url = ""
                    UtilsUI.setButtonIcon(btn_go, null, StrVal.LYCLANSOLO.STR99)
                    PointRedData.getInstance().updateManualPoint(btn_go, true);
                } else {
                    btn_go.getChild("icon", fgui.GLoader).url = UtilsUI.getItemIconUrl(VarVal.bonusType.stone)
                    UtilsUI.setButtonIcon(btn_go, null, data.param)
                }
            } else if (data.type == "2") {
                btn_go.getChild("icon", fgui.GLoader).url = ""
                payData = LocaleData.getPayItem(data.param)
                UtilsUI.setButtonIcon(btn_go, VarVal.bonusType.chance, String(Number(payData.money) / 100))
                UtilsUI.setPayItemRebateComp(group_rebeatfan, payData)
            } else if (data.type == "3") {
                UtilsUI.setButtonIcon(btn_go, null, StrVal.LYCLANSOLO.STR59)
                btn_go.getChild("icon", fgui.GLoader).url = "ui://CCommon/icon_watch video"
            }
            btn_go.visible = maxCoun > 0
            if (group_rebeatfan.visible) {
                group_rebeatfan.visible = maxCoun > 0
            }
            get.visible = !btn_go.visible
            btn_go.clearClick()
            btn_go.onClick(() => {
                if (data.type == "1") {
                    if (data.param == "") {
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                this.initialize()
                                UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                            } else {
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        }, "clanSoloGiftBuy", {
                            giftId: Number(data.id)
                        })
                    } else {
                        UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                            UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR103, [data.param, UtilsUI.getItemIconUrl(VarVal.bonusType.stone)]), null,
                            StrVal.COMMON.STR32, null,
                            StrVal.COMMON.STR33, () => {
                                UtilsUI.lockWait()
                                GameServer.getInstance().send((args: any) => {
                                    UtilsUI.unlockWait()
                                    if (args.errorcode == 0) {
                                        this.initialize()
                                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                                    } else {
                                        UtilsUI.showMsgTip(args.errorcode)
                                    }
                                }, "clanSoloGiftBuy", {
                                    giftId: Number(data.id)
                                })
                            }, "", null)
                    }
                } else if (data.type == "2") {
                    UtilsUI.payRechargeItem((errmsg: string) => {
                        if (errmsg) {
                            UtilsUI.showMsgTip(errmsg);
                        }
                    }, payData, payData.type, payData.value);
                } else if (data.type == "3") {
                    PlatformAPI.doSdkRewardVideoAD((errmsg: string) => {
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                this.initialize()
                                UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                            } else {
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        }, "clanSoloGiftBuy", {
                            giftId: Number(data.id)
                        })
                    }, UtilsUI.getMonthLifeCardActiveItem(MonthCardItemType.skip_ad))
                }
            })

            let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(data.bonusesId);
            list_item.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index1], obj1, null);
            }).bind(this)
            list_item.numItems = bonuseItems.length
        }
        // list_gift.numItems = giftXml.length
        UtilsUI.setFguiGlistDelayNumItems(list_gift, giftXml.length);
    }

    public static isViewRedPointGift(): boolean {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let clanSoloPlayer: any = fullInfo.clanSoloPlayer
        if (clanSoloPlayer) {
            let clanSoloBuyGift: any = clanSoloPlayer.clanSoloBuyGift
            let giftXml: any = LocaleData.getClanSoloGift()
            for (let i = 0; i < giftXml.length; i++) {
                const element = giftXml[i];
                let maxCount
                if ((element.type == "1" && element.param == "")) {
                    if (clanSoloBuyGift.length == 0) {
                        return true
                    }
                    for (let i = 0; i < clanSoloBuyGift.length; i++) {
                        let item = clanSoloBuyGift[i]
                        if (item.cfgId == Number(element.id)) {
                            maxCount = element.dailyLimit - item.count
                        }
                    }
                }
                if (maxCount > 0) {
                    return true
                }
            }
            return false
        }
        return false
    }
    public getIsViewMask(): boolean {
        return false;
    };

}
