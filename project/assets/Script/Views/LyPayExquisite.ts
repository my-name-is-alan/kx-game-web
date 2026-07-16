//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { VarVal } from "../Values/VarVal";
import { StrVal } from "../Values/StrVal";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { LocaleData } from "../Kernel/LocaleData";
import { MonthCardItemType, MonthCardType, UtilsUI } from "../Kernel/UtilsUI";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { LyActivityOpenRank } from "./LyActivityOpenRank";
import { AudioManager } from "../Kernel/AudioManager";
import { FguiGTween } from "../Kernel/FguiGTween";
import { GameServer } from "../Kernel/GameServer";
import { LyPayFundPreview } from "./LyPayFundPreview";
import { Color } from "cc";
import { LyPayAllEntry } from "./LyPayAllEntry";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { LyPayFunds } from "./LyPayFunds";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { LyGoldFingerLevel } from "./LyGoldFingerLevel";

enum CardTabPage {
    CARDS,
    WEEK,
}

export enum PayExquisitePage {
    GIFT_DAILY,
    LEITOTAL,
    MONTHCARD,
    FUNDS,
    RECHARGE,
}

export class LyPayExquisite extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPayExquisite;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyPayExquisite;
        this.viewResI.comName = "LyPayExquisite";
    }

    private PAGE_ITEMS = [
        "group_page_giftdaily",
        "group_page_leitotal",
        "group_page_monthcard",
        "group_page_funds",
        "group_page_recharge"
    ]

    private group_main:fgui.GComponent;
    private onRemovePage:Function;
    private currPage:PayExquisitePage;

    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_bottom:fgui.GComponent = uiPanel.getChild("group_bottom");

        // 关闭
        let btn_close:fgui.GButton = group_bottom.getChild("btn_close");
        btn_close.text = StrVal.LYPAYALLENTRY.STR101;
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPayExquisite, 0, null);
        })

        let list_page:fgui.GList = group_bottom.getChild("list_page");
        // list_page.setVirtual();
        list_page.itemRenderer = (index:number, group_item:fgui.GButton) => {
            if (index == PayExquisitePage.GIFT_DAILY) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyPayExquisiteDaily);
            } else if (index == PayExquisitePage.LEITOTAL) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyPayExquisiteLeiTotal);
            } else if (index == PayExquisitePage.MONTHCARD) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyPayExquisiteCards);
            } else if (index == PayExquisitePage.FUNDS) {
                PointRedData.getInstance().registerPoint(group_item, PointRedType.LyPayExquisiteFundAll);
            }
            group_item.text = StrVal.LYPAYALLENTRY.STR102[index];
            group_item.clearClick()
            group_item.onClick(() => {
                if (index != this.currPage) {
                    this.onListPageClick(index);
                }
            })
        }
        let initPage:PayExquisitePage;
        if (PlatformAPI.isBinaryExamine()) {
            if (params && params.page) {
                initPage = params.page;
            } else {
                initPage = PayExquisitePage.RECHARGE;
            }
            list_page.numItems = 0;
        } else {
            if (params && params.page) {
                initPage = params.page;
            } else {
                initPage = PayExquisitePage.GIFT_DAILY;
            }
            list_page.numItems = this.PAGE_ITEMS.length;
        }
        this.onListPageClick(initPage, params);
    }

    private onListPageClick(ePage:PayExquisitePage, params?:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_bottom:fgui.GComponent = uiPanel.getChild("group_bottom");
        let list_page:fgui.GList = group_bottom.getChild("list_page");

        this.currPage = ePage;

        let isPushView:boolean = false; // 是否弹窗？switchPage是切换页签
        let resName = this.PAGE_ITEMS[ePage];
        if (resName.length > 0) {
            this.switchPage(resName);
            if (ePage == PayExquisitePage.GIFT_DAILY) {
                this.initPageGiftDaily(params);
            } else if (ePage == PayExquisitePage.LEITOTAL) {
                this.initPageLeiTotal(params);
            } else if (ePage == PayExquisitePage.MONTHCARD) {
                this.initPageMonthCard(params);
            } else if (ePage == PayExquisitePage.FUNDS) {
                this.initPageFunds(params);
            } else if (ePage == PayExquisitePage.RECHARGE) {
                this.initPageRecharge(params);
            }
        } else {
            this.switchPage(null);
        }
        if (!isPushView) {
            let childIdx = list_page.itemIndexToChildIndex(ePage);
            for (let i: number = 0; i < list_page.numChildren; i++) {
                let btn_frame: fgui.GButton = list_page.getChildAt(i);
                btn_frame.selected = (i == childIdx);
            }
        }
    }

    private list_daily:fgui.GList;
    private isListSort:boolean;
    private payItems:Array<any>;
    private initPageGiftDaily(params?:any):void {
        let group_main = this.group_main;

        this.payItems = LocaleData.getPayGiftDailyItems();

        let group_value_chance = group_main.getChild("group_value_chance", fgui.GComponent);
        group_value_chance.getChild("loader_icon", fgui.GLoader).onClick(() => {
            this.onListPageClick(PayExquisitePage.RECHARGE);
        })
        let group_value_stone = group_main.getChild("group_value_stone", fgui.GComponent);
        group_value_stone.getChild("loader_icon", fgui.GLoader).url = UtilsUI.getItemIconUrl(VarVal.bonusType.stone)

        let btn_rank:fgui.GButton = group_main.getChild("btn_rank");
        PointRedData.getInstance().registerPoint(btn_rank, PointRedType.LyActivityOpenRank);
        btn_rank.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityOpenRank, 0, null);
        })
        let openRankState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.OPEN_RANK);
        if (openRankState && openRankState.data && GameServerData.getInstance().getServerCreateDay() < 8
        && GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.pet)) {} else {
            btn_rank.visible = false;
        }

        let btn_leichong:fgui.GButton = group_main.getChild("btn_leichong");
        PointRedData.getInstance().registerPoint(btn_leichong, PointRedType.LyPayExquisiteDailyLeiAct);
        btn_leichong.onClick(() => {
            if (LyPayAllEntry.isTotalChargeOpen() || LyPayAllEntry.isTotalDayChargeOpen()) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayAllEntry, 0, {isNewEnter:true});
            } else {
                UtilsUI.showMsgTip(StrVal.COMMON.STR8);
            }
        })
        btn_leichong.visible = LyPayAllEntry.isTotalDayChargeOpen()//(LyPayAllEntry.isTotalChargeOpen() || LyPayAllEntry.isTotalDayChargeOpen())

        let label_time:fgui.GButton = group_main.getChild("label_time");
        let timeCall = () => {
            let serverTime = GameServerData.getInstance().getServerTime() * 1000;
            let lastTime = UtilsTool.getNextDateTime(serverTime);
            let remain = lastTime - serverTime;
            label_time.text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR105, [UtilsTool.splitTimeString(remain / 1000)]);
        }
        let intervalId = this.setInterval(timeCall, 1000);
        timeCall();

        this.onRemovePage = () => {
            this.payItems = undefined;
            this.clearInterval(intervalId);
            this.list_daily = undefined;
            this.isListSort = undefined;
        }

        // 列表
        this.list_daily = group_main.getChild("list_daily");
        this.list_daily.setVirtual();
        this.list_daily.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let giftItem = LocaleData.getPayGiftItem(this.payItems[index].id);

            let label_name:fgui.GTextField = group_item.getChild("label_name");
            label_name.text = giftItem.name;

            let bonuseItems = LocaleData.getPayChooseBonuseItemsByGroup(giftItem.fixItems);
            // 列表
            let list_item:fgui.GList = group_item.getChild("list_item");
            list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], child, null);
            }
            list_item.numItems = bonuseItems.length;

            let maxCount = Number(giftItem.buyCount);
            let buyCount = 0;
            let record = GameServerData.getInstance().getPayDailyGiftRecord(giftItem.id);
            if (record) {
                buyCount = record.count;
            }

            let label_xian:fgui.GTextField = group_item.getChild("label_xian");
            label_xian.text = StrVal.LYPAYALLENTRY.STR115;

            let label_count:fgui.GTextField = group_item.getChild("label_count");
            label_count.text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR116, [maxCount - buyCount]);

            let bbb = (<string>giftItem.background).split(",");
            let loader_tai:fgui.GLoader = group_item.getChild("loader_tai");
            loader_tai.url = UtilsTool.stringFormat("ui://LyPayExquisite/{0}", [bbb[0]])
            let loader_icon:fgui.GLoader = group_item.getChild("loader_icon");
            loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [bbb[1]])

            UtilsUI.setPayItemRebateComp(group_item.getChild("group_rebeatfan"), giftItem);

            let btn_buy:fgui.GButton = UtilsUI.setPayItemButtonName(group_item.getChild("btn_buy"), giftItem);
            PointRedData.getInstance().updateManualPoint(btn_buy, Number(giftItem.money) <= 0 && maxCount - buyCount > 0);
            btn_buy.clearClick();
            btn_buy.onClick(() => {
                UtilsUI.payRechargeItem((errmsg:string) => {
                    if (errmsg) {
                        UtilsUI.showMsgTip(errmsg);
                    }
                }, giftItem, VarVal.payType.gift, VarVal.payGiftType.daily);
            })

            let c1 = group_item.getController("c1");
            if (maxCount - buyCount > 0) {
                c1.selectedIndex = 0;
            } else {
                c1.selectedIndex = 1;
                group_item.getChild("label_done", fgui.GTextField).text = StrVal.LYPAYALLENTRY.STR104;
            }
        }

        this.refreshStoneChance();
        this.setCommonLeiTotalComp();
        this.onViewUpdate({page:PayExquisitePage.GIFT_DAILY});
    }

    private sortListData(): void {
        if (!this.isListSort) {
            this.isListSort = true;

            let __datas:Array<any> = this.payItems;
            // 先按照id排序
            __datas.sort((itemA, itemB) => {
                return Number(itemA.id) - Number(itemB.id);
            })
            // 把已购买的插入末尾
            for (let i = __datas.length - 1; i >= 0; i--) {
                let giftItem = LocaleData.getPayGiftItem(__datas[i].id);
                let maxCount1 = Number(giftItem.buyCount);
                let buyCount1 = 0;
                let record1 = GameServerData.getInstance().getPayDailyGiftRecord(giftItem.id);
                if (record1) {
                    buyCount1 = record1.count;
                }
                if (maxCount1 - buyCount1 <= 0) {
                    let arr = __datas.splice(i, 1);
                    __datas.push(arr[0])
                }
            }
        }
        UtilsUI.setFguiGlistDelayNumItems(this.list_daily, this.payItems.length);
    }

    private perpetual_money:number;
    private leiTotalItems:Array<any>;
    private list_leitotal:fgui.GList;
    private initPageLeiTotal(params?:any):void {
        let group_main = this.group_main;

        let group_value_chance = group_main.getChild("group_value_chance", fgui.GComponent);
        group_value_chance.getChild("loader_icon", fgui.GLoader).onClick(() => {
            this.onListPageClick(PayExquisitePage.RECHARGE);
        })
        let group_value_stone = group_main.getChild("group_value_stone", fgui.GComponent);
        group_value_stone.getChild("loader_icon", fgui.GLoader).url = UtilsUI.getItemIconUrl(VarVal.bonusType.stone)

        this.onRemovePage = () => {
            this.perpetual_money = undefined;
            this.leiTotalItems = undefined;
            this.list_leitotal = undefined;
        }

        this.leiTotalItems = []
        let items = LocaleData.getLeiTotalItems();
        for (let i = 0; i < items.length; i++) {
            this.leiTotalItems.push(items[i])
        }

        this.list_leitotal = group_main.getChild("list_leitotal");
        this.list_leitotal.setVirtual();
        this.list_leitotal.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let currItem = this.leiTotalItems[index];

            let label_name = group_item.getChild("label_name", fgui.GTextField);

            let remain = Number(currItem.money) - this.perpetual_money;
            if (remain > 0) {
                label_name.text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR109, [remain / 100]);
            } else {
                label_name.text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR110, [Number(currItem.money) / 100]);
            }

            let bar_progress = group_item.getChild("bar_progress", fgui.GProgressBar);
            bar_progress.max = Number(currItem.money) / 100;
            bar_progress.min = 0;
            bar_progress.value = this.perpetual_money / 100;

            let bonuseItems = UtilsUI.getBonuseItemsByBonusesId(currItem.bonuseID);

            let graph_click = group_item.getChild("graph_click", fgui.GGraph)
            graph_click.clearClick()

            let loader_spine_main = group_item.getChild("loader_spine_main", fgui.GLoader3D)
            if (currItem.fingerID.length > 0) {
                group_item.getController("c2").selectedIndex = 0;

                let goldItem = LocaleData.getGoldFingerItem(currItem.fingerID)
                new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                }, loader_spine_main, goldItem.spineName);

                let loader_name = group_item.getChild("loader_name", fgui.GLoader);
                loader_name.url = UtilsTool.stringFormat("ui://LyGoldFinger/{0}_2", [goldItem.iconName]);

                graph_click.onClick(() => {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGoldFingerLevel, 0, {goldItem:goldItem});
                })

                // 列表
                let list_item:fgui.GList = group_item.getChild("list_item");
                list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                    UtilsUI.setUIGroupItem(bonuseItems[index], child, null);
                }
                list_item.numItems = bonuseItems.length;
            } else {
                group_item.getController("c2").selectedIndex = 1;

                loader_spine_main.freeSpine()

                UtilsUI.setUIGroupItem(bonuseItems[0], group_item.getChild("group_item", fgui.GComponent), null);
            }

            let state = 0;
            let record = this.getLeiTatalRecord(currItem.money);
            if (record) {
                state = record.start
            }

            let btn_goto = group_item.getChild("btn_goto", fgui.GButton)
            btn_goto.text = StrVal.LYPAYALLENTRY.STR112
            btn_goto.clearClick()
            let btn_take = group_item.getChild("btn_take", fgui.GButton)
            PointRedData.getInstance().updateManualPoint(btn_take, (state == 1));
            btn_take.text = StrVal.LYPAYALLENTRY.STR113
            btn_take.clearClick()

            let c1 = group_item.getController("c1")
            if (state == 2) {
                c1.selectedIndex = 2;
            } else if (state == 1) {
                c1.selectedIndex = 1;
                btn_take.onClick(() => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            if (args.bonusesResultArr) {
                                UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString(args.bonusesResultArr)});
                            }
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } , "totalCharge", {
                        id: 2,
                        type: 1
                    })
                })
            } else {
                c1.selectedIndex = 0;
                btn_goto.onClick(() => {
                    this.onListPageClick(PayExquisitePage.RECHARGE);
                })
            }
        }

        this.refreshStoneChance();
        this.onViewUpdate({page:PayExquisitePage.LEITOTAL});
    }

    private refreshLeiTatalData(): void {
        this.perpetual_money = 0;
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.PAYACC);
        if (activityState && activityState.data) {
            let perpetual = activityState.data.totalCharge.perpetual;
            if (perpetual && perpetual.money) {
                this.perpetual_money = perpetual.money;
            }
        }

        let __datas:Array<any> = this.leiTotalItems;
        // 先按照id排序
        __datas.sort((itemA, itemB) => {
            return Number(itemA.id) - Number(itemB.id);
        })
        // 把可领取的插入开头
        // 把已领取的插入末尾
        let off = 0; // 注意这个偏移量，要的。
        for (let i = __datas.length - 1; i >= 0 + off; i--) {
            let state1 = 0;
            let record1 = this.getLeiTatalRecord(__datas[i].money);
            if (record1) {
                state1 = record1.start;
            }
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
        UtilsUI.setFguiGlistDelayNumItems(this.list_leitotal, __datas.length);

        let label_time:fgui.GButton = this.group_main.getChild("label_time");
        label_time.text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR111, [this.perpetual_money / 100]);
    }

    private getLeiTatalRecord(money:string | number): any {
        money = Number(money)
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.PAYACC);
        if (activityState && activityState.data) {
            let perpetual = activityState.data.totalCharge.perpetual;
            if (perpetual && perpetual.perpetual) {
                let charge:Array<any> = perpetual.perpetual;
                for (let i = 0; i < charge.length; i++) {
                    if (money == charge[i].money) {
                        return charge[i];
                    }
                }
            }
        }
    }

    public static isViewRedPointLeiTotal(): boolean {
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.PAYACC);
        if (activityState && activityState.data) {
            let perpetual = activityState.data.totalCharge.perpetual;
            if (perpetual && perpetual.perpetual) {
                let charge:Array<any> = perpetual.perpetual;
                for (let i = 0; i < charge.length; i++) {
                    if (charge[i].start == 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private setCommonLeiTotalComp(): void {
        let group_main = this.group_main;
        let group_leichong = group_main.getChild("group_leichong", fgui.GComponent);
        if (group_leichong) {
            let tual_money = 0;
            let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.PAYACC);
            if (activityState && activityState.data) {
                let perpetual = activityState.data.totalCharge.perpetual;
                if (perpetual && perpetual.money) {
                    tual_money = perpetual.money;
                }
            }

            let temps = []
            let items = LocaleData.getLeiTotalItems();
            for (let i = 0; i < items.length; i++) {
                temps.push(items[i])
            }
            temps.sort((itemA, itemB) => {
                return Number(itemA.money) - Number(itemB.money);
            })
            let currItem:any;
            for (let i = 0; i < temps.length; i++) {
                if (Number(temps[i].money) > tual_money) {
                    currItem = temps[i];
                    break;
                }
            }

            if (currItem) {
                group_leichong.visible = true;

                let bonuseItems = UtilsUI.getBonuseItemsByBonusesId(currItem.bonuseID);
                UtilsUI.setUIGroupItem(bonuseItems[0], group_leichong.getChild("group_item"), null);

                let remain = Number(currItem.money) - tual_money;
                let label_desc = group_leichong.getChild("label_desc", fgui.GTextField);
                label_desc.text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR114, [remain / 100]);

                let bar_progress = group_leichong.getChild("bar_progress", fgui.GProgressBar);
                bar_progress.max = Number(currItem.money) / 100;
                bar_progress.min = 0;
                bar_progress.value = tual_money / 100;
            } else {
                group_leichong.visible = false;
            }
        }
    }

    private CARD_TAB:CardTabPage; // 当前子叶
    private isInitTabCard:boolean;
    private isInitTabWeek:boolean;
    private SEL_TYPE:MonthCardType; // 当前选择
    private isPlaying:boolean;
    private initPageMonthCard(params?:any):void {
        let group_main = this.group_main;

        let group_value_chance = group_main.getChild("group_value_chance", fgui.GComponent);
        group_value_chance.getChild("loader_icon", fgui.GLoader).onClick(() => {
            this.onListPageClick(PayExquisitePage.RECHARGE);
        })
        let group_value_stone = group_main.getChild("group_value_stone", fgui.GComponent);
        group_value_stone.getChild("loader_icon", fgui.GLoader).url = UtilsUI.getItemIconUrl(VarVal.bonusType.stone)

        this.onRemovePage = () => {
            this.CARD_TAB = undefined;
            this.isInitTabCard = undefined;
            this.isInitTabWeek = undefined;
            this.SEL_TYPE = undefined;
            this.isPlaying = undefined;
        }

        let btn_cards:fgui.GButton = group_main.getChild("btn_cards");
        PointRedData.getInstance().registerPoint(btn_cards, PointRedType.LyPayExquisiteCardsMonth);
        let btn_week:fgui.GButton = group_main.getChild("btn_week");
        btn_week.visible = false;
        PointRedData.getInstance().registerPoint(btn_week, PointRedType.LyPayExquisiteCardsWeek);

        this.CARD_TAB = CardTabPage.CARDS;
        let playCardType:MonthCardType = MonthCardType.Month;
        let onCardTabClick = () => {
            group_main.getChild("group_cards", fgui.GComponent).visible = this.CARD_TAB == CardTabPage.CARDS;
            group_main.getChild("group_week", fgui.GComponent).visible = this.CARD_TAB == CardTabPage.WEEK;
            if (this.CARD_TAB == CardTabPage.CARDS) {
                if (!this.isInitTabCard) {
                    this.isInitTabCard = true;
                    this.initMonthCard();
                    this.initLifeCard();
                    this.setAndPlayCardAni(playCardType);
                }
            } else {
                if (!this.isInitTabWeek) {
                    this.isInitTabWeek = true;
                }
            }
            btn_cards.selected = this.CARD_TAB == CardTabPage.CARDS;
            btn_week.selected = this.CARD_TAB == CardTabPage.WEEK;
        }
        btn_cards.onClick(() => {
            if (this.CARD_TAB != CardTabPage.CARDS) {
                this.CARD_TAB = CardTabPage.CARDS;
                onCardTabClick();
            }
        })
        btn_week.onClick(() => {
            if (this.CARD_TAB != CardTabPage.WEEK) {
                this.CARD_TAB = CardTabPage.WEEK;
                onCardTabClick();
            }
        })

        if (params && (params.type == MonthCardType.Month || params.type == MonthCardType.Life)) {
            playCardType = params.type;
            this.CARD_TAB = CardTabPage.CARDS;
        }
        onCardTabClick();

        this.refreshStoneChance();
    }

    private setAndPlayCardAni(type:MonthCardType): void {
        if (!this.isPlaying && this.SEL_TYPE != type) {
            this.isPlaying = true;
            this.SEL_TYPE = type;

            let group_main = this.group_main.getChild("group_cards", fgui.GComponent);
            let group_mask = group_main.getChild("group_mask");
            
            let srcChild:fgui.GComponent;
            let dstChild:fgui.GComponent;
            if (this.SEL_TYPE == MonthCardType.Month) {
                srcChild = group_main.getChild("group_month");
                dstChild = group_main.getChild("group_life");
            } else {
                srcChild = group_main.getChild("group_life");
                dstChild = group_main.getChild("group_month");
            }

            dstChild.sortingOrder = 0;
            group_mask.sortingOrder = 1;
            srcChild.sortingOrder = 2;

            srcChild.getChild("graph_front", fgui.GGraph).visible = false;
            dstChild.getChild("graph_front", fgui.GGraph).visible = true;

            let count = 2;
            let doneCall = () => {
                count--;
                if (count == 0) {
                    this.isPlaying = false;

                    srcChild.getChild("btn_frame", fgui.GButton).selected = true;
                    dstChild.getChild("btn_frame", fgui.GButton).selected = false;
                }
            }

            let TIME = 0.2;
            let SCALE = 0.9;
            srcChild.setScale(SCALE, SCALE);
            FguiGTween.new(srcChild).to(TIME, {scaleX:1, scaleY:1}).call(doneCall).start();
            FguiGTween.new(dstChild).to(TIME, {scaleX:SCALE, scaleY:SCALE}).call(doneCall).start();
        }
    }

    private initMonthCard(): void {
        let group_main:fgui.GComponent = this.group_main.getChild("group_cards", fgui.GComponent).getChild("group_month");

        let CARD_TYPE:MonthCardType = MonthCardType.Month; // 月卡
        let monthCardItem = LocaleData.getPayItemByOtherType(VarVal.payOtherType.monthcard);

        let label_tip0:fgui.GTextField = group_main.getChild("label_tip0");
        label_tip0.text = UtilsUI.getMonthCardDesc0New(CARD_TYPE);

        let label_tip1:fgui.GTextField = group_main.getChild("label_tip1");
        label_tip1.text = StrVal.LYPAY_RECHARGE.STR230;

        let label_tip2:fgui.GTextField = group_main.getChild("label_tip2");
        label_tip2.text = StrVal.LYPAY_RECHARGE.STR211;

        let label_desc:fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = UtilsUI.getMonthCardDescNew(CARD_TYPE);

        let graph_front:fgui.GGraph = group_main.getChild("graph_front");
        graph_front.onClick(() => {
            this.setAndPlayCardAni(CARD_TYPE);
        })

        UtilsUI.setPayItemRebateComp(group_main.getChild("group_rebeatfan"), monthCardItem);

        let btn_pay:fgui.GButton = group_main.getChild("btn_pay");
        UtilsUI.setButtonIcon(btn_pay, VarVal.bonusType.chance, String(Number(monthCardItem.money) / 100));
        btn_pay.onClick(() => {
            UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
            }, monthCardItem, VarVal.payType.others, VarVal.payOtherType.monthcard);
        })

        let btn_renew:fgui.GButton = group_main.getChild("btn_renew");
        UtilsUI.setButtonIcon(btn_renew, VarVal.bonusType.chance,
            UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR10, [String(Number(monthCardItem.money) / 100)]));
        btn_renew.onClick(() => {
            btn_pay.fireClick();
        })

        let btn_take:fgui.GButton = group_main.getChild("btn_take");
        PointRedData.getInstance().updateManualPoint(btn_take, true);
        btn_take.text = StrVal.LYPAY_RECHARGE.STR201;
        btn_take.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    let bonuseItems = UtilsUI.getMonthCardGiveBonuseItems(CARD_TYPE, MonthCardItemType.give_daily);
                    UtilsUI.showItemReward({bonuseItems:bonuseItems});
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "takePayCard", {
                type:Number(CARD_TYPE)
            });
        })

        let label_take:fgui.GTextField = group_main.getChild("label_take");
        label_take.text = StrVal.LYPAY_RECHARGE.STR200;

        this.refreshMonthCard();
    }

    private refreshMonthCard(): void {
        let group_main:fgui.GComponent = this.group_main.getChild("group_cards", fgui.GComponent).getChild("group_month");

        let btn_pay:fgui.GButton = group_main.getChild("btn_pay");
        let btn_renew:fgui.GButton = group_main.getChild("btn_renew");
        let btn_take:fgui.GButton = group_main.getChild("btn_take");
        let label_take:fgui.GButton = group_main.getChild("label_take");
        let label_time:fgui.GTextField = group_main.getChild("label_time");

        btn_pay.visible = false;
        btn_renew.visible = false;
        btn_take.visible = false;
        label_take.visible = false;

        if (GameServerData.getInstance().isHaveMonthCard()) {
            let fullInfo = GameServerData.getInstance().getPlayerFullInfo();
            btn_renew.visible = true;
            btn_take.visible = (fullInfo.monthCardTake != 1);
            label_take.visible = (fullInfo.monthCardTake == 1);
            label_time.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR204, [fullInfo.monthCardDays]);
            if (fullInfo.monthCardDays > 3) {
            } else {
                label_time.color = UtilsUI.getEnoughColor(true);
            }
        } else {
            btn_pay.visible = true;
            label_time.text = "";
        }
    }

    public initLifeCard():void {
        let group_main:fgui.GComponent = this.group_main.getChild("group_cards", fgui.GComponent).getChild("group_life");

        let CARD_TYPE:MonthCardType = MonthCardType.Life; // 终身卡
        let lifeCardItem = LocaleData.getPayItemByOtherType(VarVal.payOtherType.lifecard);

        let label_tip0:fgui.GTextField = group_main.getChild("label_tip0");
        label_tip0.text = UtilsUI.getMonthCardDesc0New(CARD_TYPE);

        let label_tip1:fgui.GTextField = group_main.getChild("label_tip1");
        label_tip1.text = StrVal.LYPAY_RECHARGE.STR231;

        let label_tip2:fgui.GTextField = group_main.getChild("label_tip2");
        label_tip2.text = StrVal.LYPAY_RECHARGE.STR211;

        let label_desc:fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = UtilsUI.getMonthCardDescNew(CARD_TYPE);

        let graph_front:fgui.GGraph = group_main.getChild("graph_front");
        graph_front.onClick(() => {
            this.setAndPlayCardAni(CARD_TYPE);
        })

        UtilsUI.setPayItemRebateComp(group_main.getChild("group_rebeatfan"), lifeCardItem);

        let btn_pay:fgui.GButton = group_main.getChild("btn_pay");
        UtilsUI.setButtonIcon(btn_pay, VarVal.bonusType.chance, String(Number(lifeCardItem.money) / 100));
        btn_pay.onClick(() => {
            UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
            }, lifeCardItem, VarVal.payType.others, VarVal.payOtherType.lifecard);
        })

        let btn_take:fgui.GButton = group_main.getChild("btn_take");
        PointRedData.getInstance().updateManualPoint(btn_take, true);
        btn_take.text = StrVal.LYPAY_RECHARGE.STR201;
        btn_take.onClick(() => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    let bonuseItems = UtilsUI.getMonthCardGiveBonuseItems(CARD_TYPE, MonthCardItemType.give_daily);
                    UtilsUI.showItemReward({bonuseItems:bonuseItems});
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "takePayCard", {
                type:Number(CARD_TYPE)
            });
        })

        let label_take:fgui.GTextField = group_main.getChild("label_take");
        label_take.text = StrVal.LYPAY_RECHARGE.STR200;

        this.refreshLifeCard();
    }

    private refreshLifeCard(): void {
        let group_main:fgui.GComponent = this.group_main.getChild("group_cards", fgui.GComponent).getChild("group_life");

        let btn_pay:fgui.GButton = group_main.getChild("btn_pay");
        let btn_take:fgui.GButton = group_main.getChild("btn_take");
        let label_take:fgui.GButton = group_main.getChild("label_take");

        btn_pay.visible = false;
        btn_take.visible = false;
        label_take.visible = false;

        if (GameServerData.getInstance().isHaveLifeCard()) {
            let fullInfo = GameServerData.getInstance().getPlayerFullInfo();
            btn_take.visible = (fullInfo.lifeCardTake != 1);
            label_take.visible = (fullInfo.lifeCardTake == 1);
        } else {
            btn_pay.visible = true;
        }
    }

    private payItem:any;
    private payOtherType:string;

    private currLevel:number;
    private isHaveRecharge:boolean;
    private awardId:number;
    private awardExtraId:number;

    private list_item:fgui.GList;
    private fundItems:Array<any>;
    private initPageFunds(params?:any):void {
        let group_main = this.group_main;

        let group_value_chance = group_main.getChild("group_value_chance", fgui.GComponent);
        group_value_chance.getChild("loader_icon", fgui.GLoader).onClick(() => {
            this.onListPageClick(PayExquisitePage.RECHARGE);
        })
        let group_value_stone = group_main.getChild("group_value_stone", fgui.GComponent);
        group_value_stone.getChild("loader_icon", fgui.GLoader).url = UtilsUI.getItemIconUrl(VarVal.bonusType.stone)

        if (params && params.payOtherType) {
            this.payOtherType = params.payOtherType;
        } else {
            if (LyPayFunds.getFundState(VarVal.payOtherType.fundtower) == 1) {
                this.payOtherType = VarVal.payOtherType.fundtower;
            } else if (LyPayFunds.getFundState(VarVal.payOtherType.fundxianshu) == 1) {
                this.payOtherType = VarVal.payOtherType.fundxianshu;
            } else if (LyPayFunds.getFundState(VarVal.payOtherType.fundstage) == 1) {
                this.payOtherType = VarVal.payOtherType.fundstage;
            } else if (LyPayFunds.getFundState(VarVal.payOtherType.fundxiuwei) == 1) {
                this.payOtherType = VarVal.payOtherType.fundxiuwei;
            } else {
                this.payOtherType = VarVal.payOtherType.fundtower;
            }
        }

        let btn_preview:fgui.GButton = group_main.getChild("btn_preview");
        btn_preview.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayFundPreview, 0, {payOtherType:this.payOtherType});
        })

        let onpayXyEventChanged = (args) => {
            this.onViewUpdate({page:PayExquisitePage.FUNDS});
            // 返还
            let rebate = UtilsUI.getRebateBonuseItems();
            if (rebate) {
                UtilsUI.showItemReward({rebateBonuseItems:rebate});
            }
        }
        this.registerRequest(onpayXyEventChanged, "payXyEventChanged");

        let controller = group_main.getController("c1");
        let label_tips:fgui.GTextField = group_main.getChild("label_tips");
        let label_desc1:fgui.GTextField = group_main.getChild("label_desc1");
        label_desc1.text = StrVal.LYPAY_FUNDS.STR100;
        if (this.payOtherType == VarVal.payOtherType.fundxiuwei) {
            label_tips.text = StrVal.LYPAY_FUNDS.STR101;
            controller.selectedIndex = 3;
        } else if (this.payOtherType == VarVal.payOtherType.fundstage) {
            label_tips.text = StrVal.LYPAY_FUNDS.STR102;
            controller.selectedIndex = 2;
        } else if (this.payOtherType == VarVal.payOtherType.fundxianshu) {
            label_tips.text = StrVal.LYPAY_FUNDS.STR103;
            controller.selectedIndex = 1;
        } else if (this.payOtherType == VarVal.payOtherType.fundtower) {
            label_tips.text = StrVal.LYPAY_FUNDS.STR104;
            controller.selectedIndex = 0;
        }

        this.payItem = LocaleData.getPayItemByOtherType(this.payOtherType);

        UtilsUI.setPayItemRebateComp(group_main.getChild("group_rebeatfan"), this.payItem);

        let btn_pay:fgui.GButton = UtilsUI.setPayItemButtonName(group_main.getChild("btn_pay"), this.payItem);
        btn_pay.onClick(() => {
            UtilsUI.payRechargeItem((errmsg:string) => {
                if (errmsg) {
                    UtilsUI.showMsgTip(errmsg);
                }
            }, this.payItem, VarVal.payType.others, this.payOtherType);
        })

        let label_tab1:fgui.GTextField = group_main.getChild("label_tab1");
        label_tab1.text = StrVal.LYPAY_FUNDS.STR1;
        let label_tab2:fgui.GTextField = group_main.getChild("label_tab2");
        label_tab2.text = StrVal.LYPAY_FUNDS.STR2;

        this.onRemovePage = () => {
            this.unregisterRequest(onpayXyEventChanged, "payXyEventChanged");
            this.payItem = undefined;
            this.payOtherType = undefined;
            this.currLevel = undefined;
            this.isHaveRecharge = undefined;
            this.awardId = undefined;
            this.awardExtraId = undefined;
            this.list_item = undefined;
            this.fundItems = undefined;
        }

        let doSendGetReward = () => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString(args.bonusesResultArr)});
                    this.onViewUpdate({page:PayExquisitePage.FUNDS});
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "takeFundsBonuses", {
                id: Number(LocaleData.getFundRootByType(this.payOtherType).id),
                payOtherType:this.payOtherType // 协议维护中使用
            })
        }

        this.fundItems = LocaleData.getFundItemsByType(this.payOtherType);
        // 列表
        this.list_item = group_main.getChild("list_item", fgui.GList);
        this.list_item.setVirtual();
        this.list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let fundItem = this.fundItems[index];
            let needlevel = Number(fundItem.condition);

            let label_level:fgui.GTextField = group_item.getChild("label_level");
            if (this.payOtherType == VarVal.payOtherType.fundxiuwei) {
                label_level.text = UtilsTool.stringFormat(StrVal.LYPAY_FUNDS.STR54, [fundItem.condition]);
            } else if (this.payOtherType == VarVal.payOtherType.fundstage) {
                let stageItem = LocaleData.getStageItem(fundItem.condition);
                if (stageItem) {
                    label_level.text = UtilsTool.stringFormat(StrVal.LYPAY_FUNDS.STR64, [stageItem.chapter_id, stageItem.stage_id]);
                }
            } else if (this.payOtherType == VarVal.payOtherType.fundxianshu) {
                label_level.text = UtilsTool.stringFormat(StrVal.LYPAY_FUNDS.STR54, [fundItem.condition]);
            } else if (this.payOtherType == VarVal.payOtherType.fundtower) {
                let towerItem = LocaleData.getTowerItem(fundItem.condition);
                if (towerItem) {
                    label_level.text = UtilsTool.stringFormat(StrVal.LYPAY_FUNDS.STR64, [towerItem.tierID, towerItem.stageID]);
                }
            }

            let ggg_item = group_item.getChild("group_item", fgui.GComponent);
            this.playAnim(group_item, false);
            let img_dark:fgui.GGraph = ggg_item.getChild("img_dark");
            let img_check:fgui.GImage = ggg_item.getChild("img_check");
            if (Number(fundItem.id) <= this.awardId) {
                img_dark.visible = true;
                img_check.visible = true;
                UtilsUI.setUIGroupItem(UtilsUI.getBonuseItemsByBonusesId(fundItem.bonuseID)[0], ggg_item, null);
            } else {
                img_dark.visible = false;
                img_check.visible = false;
                if (this.currLevel >= needlevel) {
                    this.playAnim(group_item, true);
                    UtilsUI.setUIGroupItem(UtilsUI.getBonuseItemsByBonusesId(fundItem.bonuseID)[0], ggg_item, doSendGetReward);
                } else {
                    UtilsUI.setUIGroupItem(UtilsUI.getBonuseItemsByBonusesId(fundItem.bonuseID)[0], ggg_item, null);
                }
            }

            let bonuseItems = UtilsUI.getBonuseItemsByBonusesId(fundItem.extraBonuseID);
            // 列表
            let list_item:fgui.GList = group_item.getChild("list_item");
            list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                let ggg_item:fgui.GComponent = child.getChild("group_item");
                let img_lock:fgui.GImage = ggg_item.getChild("img_lock");
                let img_dark:fgui.GGraph = ggg_item.getChild("img_dark");
                let img_check:fgui.GImage = ggg_item.getChild("img_check");
                this.playAnim(child, false);
                if (this.isHaveRecharge) {
                    img_lock.visible = false;
                    if (Number(fundItem.id) <= this.awardExtraId) {
                        img_dark.visible = true;
                        img_check.visible = true;
                        UtilsUI.setUIGroupItem(bonuseItems[index], ggg_item, null);
                    } else {
                        img_dark.visible = false;
                        img_check.visible = false;
                        if (this.currLevel >= needlevel) {
                            // 摇晃
                            this.playAnim(child, true);
                            UtilsUI.setUIGroupItem(bonuseItems[index], ggg_item, doSendGetReward);
                        } else {
                            UtilsUI.setUIGroupItem(bonuseItems[index], ggg_item, null);
                        }
                    }
                } else {
                    img_lock.visible = true;
                    img_dark.visible = true;
                    img_check.visible = false;
                    UtilsUI.setUIGroupItem(bonuseItems[index], ggg_item, null);
                }
            }
            list_item.numItems = bonuseItems.length;

            let img_light:fgui.GImage = group_item.getChild("img_light");
            let img_gray:fgui.GImage = group_item.getChild("img_gray");
            if (needlevel <= this.currLevel) {
                img_light.visible = true;
                img_gray.visible = false;
            } else {
                img_light.visible = false;
                img_gray.visible = true;
            }

            let img_bar_gray:fgui.GImage = group_item.getChild("img_bar_gray");
            let img_bar_gray1:fgui.GImage = group_item.getChild("img_bar_gray1");
            let img_bar_light:fgui.GImage = group_item.getChild("img_bar_light");
            let img_bar_light1:fgui.GImage = group_item.getChild("img_bar_light1");

            if (this.currLevel > needlevel) {
                img_bar_gray.visible = false;
                img_bar_gray1.visible = false;
                img_bar_light.visible = true;
                img_bar_light1.visible = true;
            } else if (this.currLevel == needlevel) {
                img_bar_gray.visible = false;
                img_bar_gray1.visible = true;
                img_bar_light.visible = true;
                img_bar_light1.visible = false;
            } else {
                img_bar_gray.visible = true;
                img_bar_gray1.visible = true;
                img_bar_light.visible = false;
                img_bar_light1.visible = false;
                label_level.color = new Color(255,255,255);
            }
            if (index == 0) {
                img_bar_gray.visible = false;
                img_bar_light.visible = false;
            } else if (index == this.fundItems.length - 1) {
                img_bar_gray1.visible = false;
                img_bar_light1.visible = false;
            }
        }

        let onTabPageClick = (type:string) => {
            if (this.payOtherType != type) {
                this.onListPageClick(PayExquisitePage.FUNDS, {payOtherType:type});
            }
        }
        let btn_fundtab1 = group_main.getChild("btn_fundtab1", fgui.GButton);
        PointRedData.getInstance().registerPoint(btn_fundtab1, PointRedType.LyPayExquisiteFunds, Number(VarVal.payOtherType.fundtower));
        btn_fundtab1.selected = (this.payOtherType == VarVal.payOtherType.fundtower);
        btn_fundtab1.onClick(() => {
            onTabPageClick(VarVal.payOtherType.fundtower);
        })
        let btn_fundtab2 = group_main.getChild("btn_fundtab2", fgui.GButton);
        PointRedData.getInstance().registerPoint(btn_fundtab2, PointRedType.LyPayExquisiteFunds, Number(VarVal.payOtherType.fundxianshu));
        btn_fundtab2.selected = (this.payOtherType == VarVal.payOtherType.fundxianshu);
        btn_fundtab2.onClick(() => {
            onTabPageClick(VarVal.payOtherType.fundxianshu);
        })
        let btn_fundtab3 = group_main.getChild("btn_fundtab3", fgui.GButton);
        PointRedData.getInstance().registerPoint(btn_fundtab3, PointRedType.LyPayExquisiteFunds, Number(VarVal.payOtherType.fundstage));
        btn_fundtab3.selected = (this.payOtherType == VarVal.payOtherType.fundstage);
        btn_fundtab3.onClick(() => {
            onTabPageClick(VarVal.payOtherType.fundstage);
        })
        let btn_fundtab4 = group_main.getChild("btn_fundtab4", fgui.GButton);
        PointRedData.getInstance().registerPoint(btn_fundtab4, PointRedType.LyPayExquisiteFunds, Number(VarVal.payOtherType.fundxiuwei));
        btn_fundtab4.selected = (this.payOtherType == VarVal.payOtherType.fundxiuwei);
        btn_fundtab4.onClick(() => {
            onTabPageClick(VarVal.payOtherType.fundxiuwei);
        })

        this.refreshStoneChance();
        this.onViewUpdate({page:PayExquisitePage.FUNDS});
    }

    private playAnim(com:fgui.GComponent, isPlay: boolean){
        if (isPlay) {
            com.getTransition("t0").play(null , -1)
        }else{
            com.getTransition("t0").stop()
        }
    }

    private payShowType:string;
    private stoneItems:Array<any>;
    private baseChanceItems:Array<any>;
    private chanceItems:Array<any>;
    private voucherPricesReady:boolean = false;
    private voucherPricesLoading:boolean = false;
    private voucherPriceLoadFailed:boolean = false;
    private voucherPriceQueryGeneration:number = 0;
    private lastStone:number;
    private lastChance:number;
    private initPageRecharge(params?:any):void {
        let group_main = this.group_main;

        let group_value_stone = group_main.getChild("group_value_stone", fgui.GComponent);
        group_value_stone.getChild("loader_icon", fgui.GLoader).url = UtilsUI.getItemIconUrl(VarVal.bonusType.stone)

        let btn_stone:fgui.GButton = group_main.getChild("btn_stone");
        btn_stone.onClick(() => {
            if (this.payShowType != VarVal.bonusType.stone) {
                this.invalidateVoucherPriceQuery();
                this.payShowType = VarVal.bonusType.stone;
                this.onViewUpdate({page:PayExquisitePage.RECHARGE, isClick:true});
            }
        })

        let btn_chance:fgui.GButton = group_main.getChild("btn_chance");
        btn_chance.onClick(() => {
            if (this.payShowType != VarVal.bonusType.chance) {
                this.payShowType = VarVal.bonusType.chance;
                this.onViewUpdate({page:PayExquisitePage.RECHARGE, isClick:true});
            } else if (!this.voucherPricesReady && !this.voucherPricesLoading) {
                this.queryVoucherPrices();
            }
        })

        let label_time:fgui.GTextField = group_main.getChild("label_time");
        label_time.onClick(() => {
            if (this.payShowType == VarVal.bonusType.chance
                && !this.voucherPricesReady
                && !this.voucherPricesLoading) {
                this.queryVoucherPrices();
            }
        })

        this.onRemovePage = () => {
            this.invalidateVoucherPriceQuery();
            this.payShowType = undefined;
            this.stoneItems = undefined;
            this.baseChanceItems = undefined;
            this.lastStone = undefined;
            this.lastChance = undefined;
        }

        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.setVirtual();
        list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            let loader_icon = child.getChild("loader_icon", fgui.GLoader);

            let showItem:any;
            if (this.payShowType == VarVal.bonusType.stone) {
                showItem = this.stoneItems[index];
                loader_icon.url = UtilsTool.stringFormat("ui://LyPayExquisite/pisces jade{0}", [index < 8 ? index + 1 : 8]);
            } else {
                showItem = this.chanceItems[index];
                loader_icon.url = UtilsTool.stringFormat("ui://LyPayExquisite/coupon{0}", [index < 8 ? index + 1 : 8]);
            }

            let label_count:fgui.GTextField = child.getChild("label_count");
            label_count.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR4, [UtilsUI.getItemIconUrl(this.payShowType), showItem.value]);

            let label_rmb:fgui.GTextField = child.getChild("label_rmb");
            if (this.payShowType == VarVal.bonusType.chance) {
                label_rmb.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR3, [showItem.points]);
            } else {
                label_rmb.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR8, [String(Number(showItem.money) / 100)]);
            }

            // 是否首购？
            let c1 = child.getController("c1");
            let label_tip:fgui.GTextField = child.getChild("label_tip");
            let label_give:fgui.GTextField = child.getChild("label_give");

            let givstone:string;
            if (this.payShowType == VarVal.bonusType.stone) {
                if (GameServerData.getInstance().isHavePayRecharge(showItem.id)) {
                    givstone = showItem.data2;
                } else {
                    givstone = showItem.data1;
                }
            } else {
                if (GameServerData.getInstance().isHavePayRecharge(showItem.id)) {
                    givstone = "";
                } else {
                    givstone = showItem.data2;
                }
            }
            if (givstone.length > 0) {
                if (this.payShowType == VarVal.bonusType.stone) {
                    if (GameServerData.getInstance().isHavePayRecharge(showItem.id)) { // 再充送
                        c1.selectedIndex = 3;
                        label_give.text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR108, [UtilsUI.getItemIconUrl(VarVal.bonusType.stone), givstone]);
                    } else {
                        if (givstone == showItem.value) { // 首充双倍
                            c1.selectedIndex = 2;
                            label_tip.text = StrVal.LYPAYALLENTRY.STR106;
                            label_give.text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR108, [UtilsUI.getItemIconUrl(VarVal.bonusType.stone), givstone]);
                        } else { // 首充送
                            c1.selectedIndex = 2;
                            label_tip.text = StrVal.LYPAYALLENTRY.STR107;
                            label_give.text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR108, [UtilsUI.getItemIconUrl(VarVal.bonusType.stone), givstone]);
                        }
                    }
                } else { // 首充送
                    c1.selectedIndex = 2;
                    label_tip.text = StrVal.LYPAYALLENTRY.STR107;
                    label_give.text = UtilsTool.stringFormat(StrVal.LYPAYALLENTRY.STR108, [UtilsUI.getItemIconUrl(VarVal.bonusType.stone), givstone]);
                }
            } else {
                c1.selectedIndex = 0;
            }

            if (this.payShowType == VarVal.bonusType.stone) {
                UtilsUI.setPayItemRebateComp(child.getChild("group_rebeatfan"), showItem);
            } else {
                child.getChild("group_rebeatfan").visible = false;
            }

            child.clearClick();
            child.onClick(() => {
                let payType = VarVal.payType.chance;
                if (this.payShowType == VarVal.bonusType.stone) {
                    payType = VarVal.payType.stone;
                    this.lastStone = Number(showItem.value);
                    if (givstone.length > 0) {
                        this.lastStone += Number(givstone);
                    }
                } else {
                    if (!this.voucherPricesReady) {
                        UtilsUI.showMsgTip(this.voucherPricesLoading
                            ? StrVal.LYPAY_RECHARGE.STR6
                            : StrVal.LYPAY_RECHARGE.STR7);
                        if (!this.voucherPricesLoading) {
                            this.queryVoucherPrices();
                        }
                        return;
                    }
                    this.lastChance = Number(showItem.value);
                    if (givstone.length > 0) {
                        this.lastStone = Number(givstone);
                    }
                }
                UtilsUI.payRechargeItem((errmsg:string) => {
                    if (errmsg) {
                        UtilsUI.showMsgTip(errmsg);
                    }
                }, showItem, payType, null);
            })
        }

        this.stoneItems = LocaleData.getPayItemsByType(VarVal.payType.stone);
        this.baseChanceItems = LocaleData.getPayItemsByType(VarVal.payType.chance);
        this.invalidateVoucherPriceQuery();
        if (params && params.type) {
            this.payShowType = params.type;
        } else {
            this.payShowType = VarVal.bonusType.stone;
        }
        this.refreshStoneChance();
        this.setCommonLeiTotalComp();
        this.onViewUpdate({page:PayExquisitePage.RECHARGE, isClick:true});
    }

    private invalidateVoucherPriceQuery():void {
        this.voucherPriceQueryGeneration++;
        this.voucherPricesReady = false;
        this.voucherPricesLoading = false;
        this.voucherPriceLoadFailed = false;
        this.chanceItems = [];
    }

    private mergeVoucherPrices(prices:Array<any>):Array<any> {
        let staticItems:{[id:string]:any} = {};
        let baseItems = this.baseChanceItems || [];
        for (let i = 0; i < baseItems.length; i++) {
            staticItems[String(baseItems[i].id)] = baseItems[i];
        }

        let seen:{[id:string]:boolean} = {};
        let merged:Array<any> = [];
        for (let i = 0; i < prices.length; i++) {
            let row = prices[i];
            let id = Number(row && row.id);
            let points = Number(row && row.points);
            let chance = Number(row && row.chance);
            let money = Number(row && row.money);
            let firstStone = Number(row && row.first_stone);
            let key = String(id);
            let baseItem = staticItems[key];
            let valid = id > 0 && id == Math.floor(id)
                && points > 0 && points <= 100000 && points == Math.floor(points)
                && chance == points * 10
                && money == points * 1000
                && firstStone == points * 100;
            if (!valid || !baseItem || seen[key]) {
                continue;
            }

            let item:any = {};
            for (let field in baseItem) {
                if (Object.prototype.hasOwnProperty.call(baseItem, field)) {
                    item[field] = baseItem[field];
                }
            }
            item.id = String(id);
            item.type = VarVal.payType.chance;
            item.points = points;
            item.value = String(chance);
            item.money = String(money);
            item.data2 = String(firstStone);
            seen[key] = true;
            merged.push(item);
        }
        return merged;
    }

    private queryVoucherPrices():void {
        if (this.voucherPricesLoading) {
            return;
        }

        let queryGeneration = ++this.voucherPriceQueryGeneration;
        let rechargeGroup = this.group_main;
        this.voucherPricesReady = false;
        this.voucherPricesLoading = true;
        this.voucherPriceLoadFailed = false;
        this.chanceItems = [];
        this.onViewUpdate({page:PayExquisitePage.RECHARGE});

        GameServer.getInstance().send((args:any) => {
            if (this.isDisposed
                || queryGeneration != this.voucherPriceQueryGeneration
                || this.currPage != PayExquisitePage.RECHARGE
                || this.group_main != rechargeGroup) {
                return;
            }

            this.voucherPricesLoading = false;
            if (!args || args.errorcode != 0) {
                this.voucherPricesReady = false;
                this.voucherPriceLoadFailed = true;
                this.chanceItems = [];
                this.onViewUpdate({page:PayExquisitePage.RECHARGE});
                return;
            }

            let prices = Array.isArray(args.prices) ? args.prices : [];
            let items = this.mergeVoucherPrices(prices);
            if (items.length == 0) {
                this.voucherPricesReady = false;
                this.voucherPriceLoadFailed = true;
                this.chanceItems = [];
            } else {
                this.voucherPricesReady = true;
                this.voucherPriceLoadFailed = false;
                this.chanceItems = items;
            }
            this.onViewUpdate({page:PayExquisitePage.RECHARGE});
        }, "queryHdhiveVoucherPrices", {});
    }

    private refreshStoneChance(): void {
        let group_main = this.group_main;
        let group_value_chance = group_main.getChild("group_value_chance", fgui.GComponent);
        let group_value_stone = group_main.getChild("group_value_stone", fgui.GComponent);
        if (group_value_chance) {
            let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
            group_value_chance.getChild("label_count", fgui.GTextField).text = String(fullInfo.base.chance);
            group_value_stone.getChild("label_count", fgui.GTextField).text = UtilsTool.nToFStr(fullInfo.base.stone);
        }
    }

    public onViewUpdate(params: any): void {
        if (params && params.switchToPage != undefined) {
            this.onListPageClick(params.switchToPage);
            return;
        }
        if (params && params.isCommonLeiTotal) {
            this.setCommonLeiTotalComp();
            return;
        }
        if (params && params.isCommonStoneChance) {
            this.refreshStoneChance();
            return;
        }
        if (params && params.page == this.currPage) {
            let group_main = this.group_main;
            if (params.page == PayExquisitePage.GIFT_DAILY) {
                this.sortListData();
            } else if (params.page == PayExquisitePage.LEITOTAL) {
                this.refreshLeiTatalData();
            } else if (params.page == PayExquisitePage.MONTHCARD) {
                if (this.group_main.getChild("group_cards", fgui.GComponent).visible) {
                    this.refreshMonthCard();
                    this.refreshLifeCard();
                } else {

                }
            } else if (params.page == PayExquisitePage.FUNDS) {
                this.currLevel = GameServerData.getInstance().getFundLevel(this.payOtherType);
                let fundState = GameServerData.getInstance().getFundState(this.payOtherType);
                this.awardId = fundState.awardId;
                this.awardExtraId = fundState.awardExtraId;

                this.isHaveRecharge = GameServerData.getInstance().isHavePayRecharge(this.payItem.id);
                if (this.isHaveRecharge) {
                    let btn_pay:fgui.GButton = group_main.getChild("btn_pay");
                    btn_pay.text = StrVal.LYPAY_ACTIVITYS.STR102;
                    btn_pay.enabled = false;
                }

                this.list_item.numItems = this.fundItems.length;

                // 滚动到能领取
                let minIdx = -1;
                let finalFundItem = this.fundItems[this.fundItems.length - 1];
                if ((Number(finalFundItem.id) == this.awardId) && (Number(finalFundItem.id) == this.awardExtraId)) { // 全部已领取
                    minIdx = this.fundItems.length - 1;
                    // 入口消失
                    // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayAllEntry, 0, null);
                } else {
                    let takeIdx1 = -1;
                    let takeIdx2 = -1;
                    for (let idx = 0; idx < this.fundItems.length; idx++) {
                        let fundItem = this.fundItems[idx];
                        // 基础
                        if (Number(fundItem.id) > this.awardId) { // 未领取
                            if (takeIdx1 < 0) {
                                takeIdx1 = idx;
                            }
                        }
                        // 额外
                        if (this.isHaveRecharge) {
                            if (Number(fundItem.id) > this.awardExtraId) { // 未领取
                                if (takeIdx2 < 0) {
                                    takeIdx2 = idx;
                                }
                            }
                        }
                    }
                    if (takeIdx2 < 0) { // 仅计算基础的
                        if (takeIdx1 >= 0) {
                            minIdx = takeIdx1;
                        }
                    } else if (takeIdx2 >= 0) {
                        minIdx = Math.min(takeIdx1, takeIdx2)
                    }
                }
                if (minIdx >= 0) {
                    this.list_item.scrollToView(minIdx, true, true);
                }
            } else if (params.page == PayExquisitePage.RECHARGE) {
                let label_time:fgui.GTextField = group_main.getChild("label_time");
                if (this.payShowType == VarVal.bonusType.stone) {
                    label_time.text = StrVal.LYPAY_RECHARGE.STR1;
                    group_main.getController("c1").selectedIndex = 1;
                } else {
                    if (this.voucherPricesLoading) {
                        label_time.text = StrVal.LYPAY_RECHARGE.STR6;
                    } else if (this.voucherPriceLoadFailed || !this.voucherPricesReady) {
                        label_time.text = StrVal.LYPAY_RECHARGE.STR7;
                    } else {
                        label_time.text = StrVal.LYPAY_RECHARGE.STR2;
                    }
                    group_main.getController("c1").selectedIndex = 0;
                }
    
                let btn_stone:fgui.GButton = group_main.getChild("btn_stone");
                btn_stone.selected = this.payShowType == VarVal.bonusType.stone;
                let btn_chance:fgui.GButton = group_main.getChild("btn_chance");
                btn_chance.selected = this.payShowType != VarVal.bonusType.stone;
    
                let list_item:fgui.GList = group_main.getChild("list_item");
                if (this.payShowType == VarVal.bonusType.stone) {
                    // 首充标志刷新。
                    UtilsUI.setFguiGlistDelayNumItems(list_item, this.stoneItems.length);
                } else {
                    // 首充标志刷新。
                    UtilsUI.setFguiGlistDelayNumItems(list_item,
                        this.voucherPricesReady ? this.chanceItems.length : 0);
                }
    
                if (params && params.isClick) {
                    this.lastStone = undefined;
                    this.lastChance = undefined;
                }
                // 虚拟获得奖励弹窗
                let bonuseStone;
                let bonuseChance;
                if (this.lastStone) {
                    bonuseStone = UtilsUI.getBonuseItem(VarVal.bonusType.stone, null, null, String(this.lastStone));
                    this.lastStone = undefined;
                }
                if (this.lastChance) {
                    bonuseChance = UtilsUI.getBonuseItem(VarVal.bonusType.chance, null, null, String(this.lastChance));
                    this.lastChance = undefined;
                }
                if (bonuseStone || bonuseChance) {
                    let bonuseItems = [];
                    if (bonuseChance) {
                        bonuseItems.push(bonuseChance);
                    }
                    if (bonuseStone) {
                        bonuseItems.push(bonuseStone);
                    }
                    UtilsUI.showItemReward({
                        bonuseItems:bonuseItems,
                        rebateBonuseItems:UtilsUI.getRebateBonuseItems()
                    });
                }

                if (params && params.isClick
                    && this.payShowType == VarVal.bonusType.chance) {
                    this.queryVoucherPrices();
                }
            }
        }
    }

    public onViewDestroy():void {
        this.invalidateVoucherPriceQuery();
    }

    /**
     * 添加显示页签并设置节点宽高。
     */
    private switchPage(comName:string):void {
        if (this.onRemovePage) {
            this.onRemovePage();
            this.onRemovePage = undefined;
        }
        if (this.group_main) {
            this.group_main.removeFromParent();
            this.group_main = undefined;
        }
        if (comName) {
            let displayObject:fgui.GComponent = fgui.UIPackage.createObject(this.viewResI.pkgName, comName)?.asCom;
            if (displayObject) {
                let uiPanel: fgui.GComponent = this.getUiPanel();
                displayObject.setSize(uiPanel.width, uiPanel.height);
                uiPanel.addChildAt(displayObject, 0);
            }
            this.group_main = displayObject;
        }
    }
}
