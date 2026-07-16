//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
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
import { LyActivityShopBuy, ShopBuy } from "./LyActivityShopBuy";
import { LyGuideGetItem } from "./LyGuideGetItem";

export class LyCrossQunYinShop extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyCrossQunYin";
        this.viewResI.pkgName = "LyCrossQunYin";
        this.viewResI.comName = "LyCrossQunYinShop";
    }
    private uiPanel: fgui.GComponent


    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close = this.getUiPanel().getChild("btn_close")
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCrossQunYinShop, 0, null)
        })
        let btn_close1 = this.uiPanel.getChild("btn_close1")
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCrossQunYinShop, 0, null)
        })

        let label_str27: fgui.GLabel = this.uiPanel.getChild("label_str27")
        label_str27.text = StrVal.LYQUNYIN.STR27
        this.registerRequest(() => {
            this.initialize()
        }, "activityStateChanged")
        this.initialize()
    };
    private initialize(): void {
        let activityQunYin: any = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.QUNYIN).data.activityQunYin;
        let activityXml: any = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.QUNYIN);
        let shopXml: any = activityXml._shop[0]._item;
        let group_icon: fgui.GComponent = this.uiPanel.getChild("group_icon")
        // let url: string = UtilsTool.stringFormat("ui://CCommon/Props-jianling", [LocaleData.getItemProto(petRoot.summon_currency_item).icon]);
        group_icon.getChild("loader_icon", fgui.GLoader).url = "ui://CCommon/Props-jianling"
        group_icon.getChild("label_number", fgui.GLabel).text = activityQunYin.score
        // let btn_add: fgui.GButton = group_icon.getChild("btn_add")
        // btn_add.clearClick()
        // btn_add.onClick(() => {
        //     ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {
        //         bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.qunyin, null, null, "1"), buyCall: () => {
        //             // this.group_icon1.getChild("label_number").text = String(itemCount)
        //         }
        //     });
        // })

        let list_shop: fgui.GList = this.uiPanel.getChild("list_shop")
        list_shop.itemRenderer = (index: number, child: fgui.GComponent) => {
            let rankItem = shopXml[index];
            let dataItem = LocaleData.getItemProto(rankItem.itemId)
            let bonuseItem: BonuseItem;
            if (!LocaleData.isItem(rankItem.itemId)) {
                let bonusType = LocaleData.getShopItemBonusType(rankItem.itemId);
                bonuseItem = UtilsUI.getBonuseItem(bonusType, null, null, rankItem.count);
            } else {
                bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, rankItem.itemId, rankItem.count);
            }
            let label_name: fgui.GTextField = child.getChild("label_name");
            label_name.text = String(bonuseItem.name);
            let group_item: fgui.GComponent = child.getChild("group_item");
            UtilsUI.setUIGroupItem(bonuseItem, group_item, null);
            let label_limit: fgui.GTextField = child.getChild("label_limit");
            let maxCount: number = rankItem.buyCount
            for (let i = 0; i < activityQunYin.shop.length; i++) {
                let item = activityQunYin.shop[i]
                if (item.id == rankItem.id) {
                    maxCount = rankItem.buyCount - item.count
                }
            }
            label_limit.text = UtilsTool.stringFormat(StrVal.LYQUNYIN.STR12, [maxCount]);
            let btn_buy: fgui.GButton = child.getChild("btn_buy")
            btn_buy.text = rankItem.score
            btn_buy.getChild("loader_icon", fgui.GLoader).url = "ui://CCommon/Props-jianling"
            btn_buy.clearClick()
            btn_buy.onClick(() => {
                if (maxCount > 0) {
                    let type = Number(rankItem.itemId) > 100 ? VarVal.bonusType.item : rankItem.itemId
                    let shopBuy: ShopBuy = {
                        costBonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.qunyin, null, null, rankItem.score),
                        bonuseItem: UtilsUI.getBonuseItem(type, null, rankItem.itemId, rankItem.count),
                        set_need: rankItem.score
                    }
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityShopBuy, 0, {
                        shopBuy: shopBuy, maxCount: maxCount, doneCall: (buyCount: number) => {
                            UtilsUI.lockWait();
                            GameServer.getInstance().send((args: any) => {
                                UtilsUI.unlockWait();
                                if (args.errorcode == 0) {
                                    UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                                    this.onViewUpdate();
                                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityShopBuy, 0, null);
                                } else {
                                    UtilsUI.showMsgTip(args.errorcode);
                                }
                            }, "scoreShopBuy", {
                                id: Number(rankItem.id),
                                count: buyCount
                            });
                        }
                    });
                }
            })
        }
        list_shop.numItems = shopXml.length
    }
    public onViewUpdate(): void {
        this.initialize()
    };

    public getIsViewMask(): boolean {
        return false;
    };

}