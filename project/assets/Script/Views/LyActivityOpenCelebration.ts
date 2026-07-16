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
import { LocaleData } from "../Kernel/LocaleData";
import { PayItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { GameServer } from "../Kernel/GameServer";
import { GuideManager } from "../Kernel/GuideManager";
import { LyActivityShopBuy, ShopBuy } from "./LyActivityShopBuy";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { AudioManager } from "../Kernel/AudioManager";

export class LyActivityOpenCelebration extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyActivityOpenCelebration;
        this.viewResI.pkgName = "LyActivityOpenCelebration";
        this.viewResI.comName = "LyActivityOpenCelebration";
    }

    private dynamicParam:any;

    private list_tab1:fgui.GList;
    private list_tab2:fgui.GList;
    private list_tab3:fgui.GList;
    private list_init:Array<boolean> = new Array<boolean>(false, false, false);

    private payShowType:number;
    private lastGiftData:any;

    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        this.dynamicParam = params.dynamicParam;
        
        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityOpenCelebration, 0, null);
        })

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
        }, group_main.getChild("loader_effect"), VarVal.UI_EFF_NAME.spine_qingdian_denglong);

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
        }, group_main.getChild("loader_effect3"), VarVal.UI_EFF_NAME.spine_qingdian_niao);

        new SpinePlayer().loadSpine((spp:SpinePlayer) => {
        }, group_main.getChild("loader_effect1"), VarVal.UI_EFF_NAME.spine_qingdian_saoguang);

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let lastState = GameServerData.getInstance().getActivityState(this.dynamicParam.id);
        this.registerRequest((args) => {
            if (args.activityState.activityId == this.dynamicParam.id) {
                if (this.payShowType == 3 && this.lastGiftData) {
                    let oldrecord = LyActivityOpenCelebration.getDaysGiftsRecord(this.dynamicParam.id, this.lastGiftData.payId, lastState);
                    let newrecord = LyActivityOpenCelebration.getDaysGiftsRecord(this.dynamicParam.id, this.lastGiftData.payId);
                    if (oldrecord.tookCount != newrecord.tookCount) {
                        UtilsUI.showItemReward({
                            bonuseString:this.lastGiftData.bonuses,
                            rebateBonuseItems:UtilsUI.getRebateBonuseItems()
                        });
                    }
                }
                if (this.payShowType == 1) {
                    this.sortListData(1);
                } else if (this.payShowType == 2) {
                    this.sortListData(2);
                } else if (this.payShowType == 3) {
                    this.sortListData(3);
                }
                this.refreshScoreBonusesGroup();
                lastState = args.activityState;
            }
        }, "activityStateChanged");

        let btn_tab1:fgui.GButton = group_main.getChild("btn_tab1");
        btn_tab1.text = StrVal.LYACTIVITY_OPENCELEBARATION.STR1;
        btn_tab1.onClick(() => {
            if (this.payShowType != 1) {
                this.payShowType = 1;
                this.setViewPage();
            }
        })

        let btn_tab2:fgui.GButton = group_main.getChild("btn_tab2");
        PointRedData.getInstance().registerPoint(btn_tab2, PointRedType.LyActivityOpenCelebrationTask, this.dynamicParam.id);
        btn_tab2.text = StrVal.LYACTIVITY_OPENCELEBARATION.STR2;
        btn_tab2.onClick(() => {
            if (this.payShowType != 2) {
                this.payShowType = 2;
                this.setViewPage();
            }
        })

        let btn_tab3:fgui.GButton = group_main.getChild("btn_tab3");
        PointRedData.getInstance().registerPoint(btn_tab3, PointRedType.LyActivityOpenCelebrationGifts, this.dynamicParam.id);
        btn_tab3.text = StrVal.LYACTIVITY_OPENCELEBARATION.STR3;
        btn_tab3.onClick(() => {
            if (this.payShowType != 3) {
                this.payShowType = 3;
                this.setViewPage();
            }
        })

        let group_scoreicon = group_main.getChild("group_scoreicon", fgui.GComponent);
        group_scoreicon.getChild("loader_icon", fgui.GLoader).url = UtilsUI.getItemIconUrl(VarVal.bonusType.opencelescore);

        let label_time:fgui.GButton = group_main.getChild("label_time");
        let timeCall = () => {
            let remainTime = this.dynamicParam.endTime - GameServerData.getInstance().getServerTime();
            label_time.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_OPENCELEBARATION.STR10, [UtilsTool.parseTimeToString(remainTime)]);
        }
        this.setInterval(timeCall, 1000);
        timeCall();

        this.refreshScoreBonusesGroup();

        this.list_tab1 = group_main.getChild("list_tab1", fgui.GList);
        this.list_tab1.setVirtual();
        this.list_tab1.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let exchangeData = this.dynamicParam.data.exchangeGoodsGroup[index];

            let costBonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.opencelescore, null, null, String(exchangeData.costScore));
            UtilsUI.setUIGroupItem(costBonuseItem, group_item.getChild("group_itemscore", fgui.GComponent), null);

            let bonuseItems = UtilsUI.getBonuseItemsByString(exchangeData.bonuses);
            // 列表
            let list_item:fgui.GList = group_item.getChild("list_item");
            list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], child, null);
            }
            list_item.numItems = bonuseItems.length;

            let maxCount = Number(exchangeData.maxCount);
            let buyCount = 0;
            let record = this.getExchangeRecord(exchangeData.id);
            if (record) {
                buyCount = record.count;
            }

            let label_count:fgui.GTextField = group_item.getChild("label_count");
            if (buyCount > 0) {
                label_count.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR302, [maxCount - buyCount, maxCount]);
                label_count.color = UtilsUI.getEnoughColor(maxCount - buyCount > 0);
            } else {
                label_count.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_OPENCELEBARATION.STR7, [maxCount]);
                label_count.color = UtilsUI.getEnoughColor(true);
            }

            let btn_exchange:fgui.GButton = group_item.getChild("btn_exchange");
            btn_exchange.text = StrVal.LYACTIVITY_OPENCELEBARATION.STR1;
            btn_exchange.clearClick();
            btn_exchange.onClick(() => {
                let shopBuy:ShopBuy = {
                    costBonuseItem: costBonuseItem,
                    bonuseItem: bonuseItems[0],
                    set_need: Number(costBonuseItem.count)
                }
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityShopBuy, 0, { shopBuy: shopBuy, maxCount: maxCount - buyCount, doneCall:(buyCount:number) => {
                    UtilsUI.lockWait();
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait();
                        if (args.errorcode == 0) {
                            UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityShopBuy, 0, null);
                        } else {
                            UtilsUI.showMsgTip(args.errorcode);
                        }
                    }, "openCelebrationExchangeGoods", {
                        activityId:this.dynamicParam.id,
                        goodsId:exchangeData.id,
                        count:buyCount
                    });
                }});
            })
            if (maxCount - buyCount > 0) {
                btn_exchange.grayed = false;
                btn_exchange.enabled = true;
            } else {
                btn_exchange.grayed = true;
                btn_exchange.enabled = false;
                btn_exchange.text = StrVal.LYACTIVITY_OPENCELEBARATION.STR8;
            }
        }

        this.list_tab2 = group_main.getChild("list_tab2", fgui.GList);
        this.list_tab2.setVirtual();
        this.list_tab2.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let taskData = this.dynamicParam.data.taskGroup[index];

            let label_name:fgui.GTextField = group_item.getChild("label_name");
            label_name.text = taskData.name;

            let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.opencelescore, null, null, String(taskData.score));
            // 列表
            let list_item:fgui.GList = group_item.getChild("list_item");
            list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItem, child, null);
            }
            list_item.numItems = 1;

            let state = 0;
            let maxCount = 0;
            let doneCount = 0;

            if (taskData.type == VarVal.openCelebrationTaskType.equip) {
                maxCount = Number(taskData.params.split(",")[0]);
            } else {
                maxCount = Number(taskData.params);
            }
            let record = this.getTasksStatesRecord(taskData.id);
            if (record) {
                state = record.state;
                doneCount = record.value;
            }

            let bar_count:fgui.GProgressBar = group_item.getChild("bar_count");
            bar_count.min = 0;
            bar_count.max = maxCount;
            bar_count.value = doneCount;

            let img_done:fgui.GImage = group_item.getChild("img_done");
            let label_done:fgui.GTextField = group_item.getChild("label_done");
            let btn_go:fgui.GButton = group_item.getChild("btn_go");
            btn_go.clearClick();
            btn_go.onClick(() => {
                if (taskData.type == VarVal.openCelebrationTaskType.cutTree ||
                    taskData.type == VarVal.openCelebrationTaskType.upgrade ||
                    taskData.type == VarVal.openCelebrationTaskType.equip) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.KANSHU,
                    });
                } else if (taskData.type == VarVal.openCelebrationTaskType.treeUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.EVOLUTION,
                    });
                } else if (taskData.type == VarVal.openCelebrationTaskType.vehicleUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.MOUNT_LEVELUP,
                    });
                } else if (taskData.type == VarVal.openCelebrationTaskType.animalUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.PET_LEVELUP,
                    });
                } else if (taskData.type == VarVal.openCelebrationTaskType.animalCall) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.PET_CALL,
                    });
                } else if (taskData.type == VarVal.openCelebrationTaskType.mountainTrigger) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.VEIN_ACTIVE,
                    });
                } else if (taskData.type == VarVal.openCelebrationTaskType.fight) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.DUEL_CHALLENGE,
                    });
                } else if (taskData.type == VarVal.openCelebrationTaskType.challengeMonster) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.KING_MONSTER,
                    });
                } else if (taskData.type == VarVal.openCelebrationTaskType.strangeAnimalInvade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.INVASION,
                    });
                } else if (taskData.type == VarVal.openCelebrationTaskType.passTower) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.MONSTER_TOWER,
                    });
                } else if (taskData.type == VarVal.openCelebrationTaskType.landGatherSelf) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.HAVEN_GET,
                    });
                }else if(taskData.type == VarVal.openCelebrationTaskType.landGatherOthers){
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.HAVEN_FINDOTHER,
                    });
                } else if (taskData.type == VarVal.openCelebrationTaskType.share) {
                    UtilsUI.playerShareGame(() => {
                        UtilsUI.showMsgTip(StrVal.COMMON.STR101);
                    }, {
                        title: StrVal.COMMON.STR301,
                    })
                }
            })
            let btn_take:fgui.GButton = group_item.getChild("btn_take");
            PointRedData.getInstance().updateManualPoint(btn_take, state == 1);
            btn_take.clearClick();
            btn_take.onClick(() => {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        UtilsUI.showItemReward({bonuseItems:[bonuseItem]});
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "takeOpenCelebrationTaskBonuses", {
                    activityId:this.dynamicParam.id,
                    taskId:taskData.id
                });
            })
            if (state == 0) { // 前往
                img_done.visible = false;
                label_done.text = "";
                btn_go.visible = true;
                btn_go.text = StrVal.LYACTIVITY_OPENCELEBARATION.STR4;
                btn_take.visible = false;
            } else if (state == 1) { // 领取
                img_done.visible = false;
                label_done.text = "";
                btn_go.visible = false;
                btn_take.visible = true;
                btn_take.text = StrVal.LYACTIVITY_OPENCELEBARATION.STR5;
            } else if (state == 2) { // 已领取
                img_done.visible = true;
                label_done.text = StrVal.LYACTIVITY_OPENCELEBARATION.STR6;
                btn_go.visible = false;
                btn_take.visible = false;
            }
        }

        this.list_tab3 = group_main.getChild("list_tab3", fgui.GList);
        this.list_tab3.setVirtual();
        this.list_tab3.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let giftData = this.dynamicParam.data.daysGiftsGroup[index];
            let giftItem:PayItem;
            if (giftData.payId > 0) {
                giftItem = LocaleData.getPayItem(giftData.payId);
            } else {
                giftItem = {
                    money:String(giftData.payId)
                }
            }

            let label_name:fgui.GTextField = group_item.getChild("label_name");
            label_name.text = giftData.name;

            let bonuseItems = UtilsUI.getBonuseItemsByString(giftData.bonuses);
            // 列表
            let list_item:fgui.GList = group_item.getChild("list_item");
            list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], child, null);
            }
            list_item.numItems = bonuseItems.length;

            let maxCount = Number(giftData.maxBuyCount);
            let buyCount = 0;
            let record = LyActivityOpenCelebration.getDaysGiftsRecord(this.dynamicParam.id, giftData.payId);
            if (record) {
                buyCount = record.tookCount;
            }

            let label_count:fgui.GTextField = group_item.getChild("label_count");
            if (buyCount > 0) {
                label_count.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR302, [maxCount - buyCount, maxCount]);
                label_count.color = UtilsUI.getEnoughColor(maxCount - buyCount > 0);
            } else {
                label_count.text = UtilsTool.stringFormat(StrVal.LYPAY_RECHARGE.STR301, [maxCount]);
                label_count.color = UtilsUI.getEnoughColor(true);
            }

            UtilsUI.setPayItemRebateComp(group_item.getChild("group_rebeatfan"), giftItem);

            let btn_buy:fgui.GButton = UtilsUI.setPayItemButtonName(group_item.getChild("btn_buy"), giftItem);
            PointRedData.getInstance().updateManualPoint(btn_buy, giftData.payId <= 0 && maxCount - buyCount > 0);
            btn_buy.clearClick();
            btn_buy.onClick(() => {
                this.lastGiftData = giftData;
                if (giftData.payId > 0) {
                    UtilsUI.payRechargeItem((errmsg:string) => {
                        if (errmsg) {
                            UtilsUI.showMsgTip(errmsg);
                        }
                    }, giftItem, VarVal.payType.others, VarVal.payGiftType.daily);
                } else {
                    UtilsUI.lockWait();
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait();
                        if (args.errorcode == 0) {
                            // 事件里刷新
                        } else {
                            UtilsUI.showMsgTip(args.errorcode);
                        }
                    }, "takeOpenCelebrationDaysGiftsBonuses", {
                        activityId:this.dynamicParam.id,
                        payId:giftData.payId
                    });
                }
            })
            if (maxCount - buyCount > 0) {
                btn_buy.grayed = false;
                btn_buy.enabled = true;
            } else {
                btn_buy.grayed = true;
                btn_buy.enabled = false;
                btn_buy.text = StrVal.LYACTIVITY_OPENCELEBARATION.STR8;
            }
        }

        if (params) {
            this.payShowType = params.type;
        } else {
            this.payShowType = 2;
        }
        this.setViewPage();
    }

    private setViewPage():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let btn_tab1:fgui.GButton = group_main.getChild("btn_tab1");
        btn_tab1.selected = this.payShowType == 1;
        let btn_tab2:fgui.GButton = group_main.getChild("btn_tab2");
        btn_tab2.selected = this.payShowType == 2;
        let btn_tab3:fgui.GButton = group_main.getChild("btn_tab3");
        btn_tab3.selected = this.payShowType == 3;

        this.list_tab1.visible = false;
        this.list_tab2.visible = false;
        this.list_tab3.visible = false;

        if (this.payShowType == 1) {
            this.list_tab1.visible = true;
            if (!this.list_init[this.payShowType - 1]) {
                this.list_init[this.payShowType - 1] = true;
                this.sortListData(1);
            }
        } else if (this.payShowType == 2) {
            this.list_tab2.visible = true;
            if (!this.list_init[this.payShowType - 1]) {
                this.list_init[this.payShowType - 1] = true;
                this.sortListData(2);
            }
        } else if (this.payShowType == 3) {
            this.list_tab3.visible = true;
            if (!this.list_init[this.payShowType - 1]) {
                this.list_init[this.payShowType - 1] = true;
                this.sortListData(3);
            }
        }
    }

    private refreshScoreBonusesGroup(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let max_ui_item = 6;
        let scoreBonusesGroup = this.dynamicParam.data.scoreBonusesGroup;
        let curr_score_item = scoreBonusesGroup.length;
        let max_score = 0;
        let remain_score = 0;
        let total_score = 0;
        for (let i = 0; i < scoreBonusesGroup.length; i++) {
            if (scoreBonusesGroup[i].score > max_score) {
                max_score = scoreBonusesGroup[i].score;
            }
        }
        let activityState = GameServerData.getInstance().getActivityState(this.dynamicParam.id);
        if (activityState && activityState.data) {
            remain_score = activityState.data.activityOpenCelebration.score; 
            total_score = activityState.data.activityOpenCelebration.totalScore;
        }

        let label_score:fgui.GTextField = group_main.getChild("label_score");
        label_score.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_OPENCELEBARATION.STR9, [remain_score]);

        let group_scoreicon = group_main.getChild("group_scoreicon", fgui.GComponent);
        group_scoreicon.getChild("label_score", fgui.GTextField).text = String(total_score);

        let done_score_len = 0
        for (let i = 0; i < max_ui_item; i++) {
            if (i < curr_score_item) {
                let scoreData = scoreBonusesGroup[i];
                if (total_score >= scoreData.score) {
                    done_score_len = i + 1;
                }
            }
        }

        let bar_progress:fgui.GProgressBar = group_main.getChild("bar_progress");
        bar_progress.min = 0;
        bar_progress.max = curr_score_item;
        bar_progress.value = done_score_len;

        let bar_split_space = bar_progress.width / curr_score_item;

        for (let i = 0; i < max_ui_item; i++) {
            let group_line = group_main.getChild("group_line" + String(i+1), fgui.GList);
            if (i < curr_score_item) {
                let group_item = group_line.getChild("group_item", fgui.GComponent);
                group_line.setPosition(bar_progress.x + (i + 1) * bar_split_space, bar_progress.y);
                let label_name = group_line.getChild("label_name", fgui.GTextField);

                let scoreData = scoreBonusesGroup[i];
                let isTook = false;
                let record = LyActivityOpenCelebration.getScoreBonuseRecord(this.dynamicParam.id, scoreData.score);
                if (record) {
                    isTook = record.isTook;
                }

                let MAX_SCALE = 0.7;
                if (i != curr_score_item - 1) {
                    group_item.setScale(MAX_SCALE, MAX_SCALE);
                } else {
                    group_line.x = group_line.x + (group_line.width * (1 - MAX_SCALE) * 0.5);
                }
                label_name.y = group_item.y + (group_item.initHeight * group_item.scaleY) / 2;
                label_name.text = scoreData.score;
                let bonuseItems = UtilsUI.getBonuseItemsByString(scoreData.bonuses);
                if (isTook) {
                    this.playAnim(group_line, false);
                    UtilsUI.setUIGroupItem(bonuseItems[0], group_item, null);
                    group_item.getChild("img_check").visible = true;
                    group_item.getChild("img_dark").visible = true;
                } else {
                    if (total_score >= scoreData.score) {
                        this.playAnim(group_line, true);
                        UtilsUI.setUIGroupItem(bonuseItems[0], group_item, () => {
                            UtilsUI.lockWait();
                            GameServer.getInstance().send((args: any) => {
                                UtilsUI.unlockWait();
                                if (args.errorcode == 0) {
                                    UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                                } else {
                                    UtilsUI.showMsgTip(args.errorcode);
                                }
                            }, "takeOpenCelebrationScoreBonuses", {
                                activityId:this.dynamicParam.id,
                                score:scoreData.score
                            });
                        });
                    } else {
                        this.playAnim(group_line, false);
                        UtilsUI.setUIGroupItem(bonuseItems[0], group_item, null);
                    }
                }
            } else {
                group_line.visible = false;
            }
        }
    }

    private playAnim(com:fgui.GComponent, isPlay: boolean){
        if (isPlay) {
            com.getTransition("t0").play(null , -1)
        }else{
            com.getTransition("t0").stop()
        }
    }

    private sortListData(idx: number): any {
        if (idx == 1) {
            let __datas:Array<any> = this.dynamicParam.data.exchangeGoodsGroup;
            // 先按照id排序
            __datas.sort((itemA, itemB) => {
                return Number(itemA.id) - Number(itemB.id);
            })
            // 把已购买的插入末尾
            for (let i = __datas.length - 1; i >= 0; i--) {
                let maxCount1 = Number(__datas[i].maxCount);
                let buyCount1 = 0;
                let record1 = this.getExchangeRecord(__datas[i].id);
                if (record1) {
                    buyCount1 = record1.count;
                }
                if (maxCount1 - buyCount1 <= 0) {
                    let arr = __datas.splice(i, 1);
                    __datas.push(arr[0])
                }
            }

            UtilsUI.setFguiGlistDelayNumItems(this.list_tab1, __datas.length);
        } else if (idx == 2) {
            let __datas:Array<any> = this.dynamicParam.data.taskGroup;
            // 先按照id排序
            __datas.sort((itemA, itemB) => {
                return Number(itemA.id) - Number(itemB.id);
            })
            // 把可领取的插入开头
            // 把已领取的插入末尾
            let off = 0; // 注意这个偏移量，要的。
            for (let i = __datas.length - 1; i >= 0 + off; i--) {
                let state1 = 0;
                let record1 = this.getTasksStatesRecord(__datas[i].id);
                if (record1) {
                    state1 = record1.state;
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

            UtilsUI.setFguiGlistDelayNumItems(this.list_tab2, __datas.length);
        } else if (idx == 3) {
            let __datas:Array<any> = this.dynamicParam.data.daysGiftsGroup;
            // 先按照id排序
            __datas.sort((itemA, itemB) => {
                return Number(itemA.payId) - Number(itemB.payId);
            })
            // 把已购买的插入末尾
            for (let i = __datas.length - 1; i >= 0; i--) {
                let maxCount1 = Number(__datas[i].maxBuyCount);
                let buyCount1 = 0;
                let record1 = LyActivityOpenCelebration.getDaysGiftsRecord(this.dynamicParam.id, __datas[i].payId);
                if (record1) {
                    buyCount1 = record1.tookCount;
                }
                if (maxCount1 - buyCount1 <= 0) {
                    let arr = __datas.splice(i, 1);
                    __datas.push(arr[0])
                }
            }

            UtilsUI.setFguiGlistDelayNumItems(this.list_tab3, __datas.length);
        }
    }

    private static getScoreBonuseRecord(activityId:number | string, score: number): any {
        let activityState = GameServerData.getInstance().getActivityState(activityId);
        if (activityState && activityState.data) {
            let tookScoreBonusesRecords:Array<any> = activityState.data.activityOpenCelebration.tookScoreBonusesRecords;
            for (let i = 0; i < tookScoreBonusesRecords.length; i++) {
                if (tookScoreBonusesRecords[i].score == score) {
                    return tookScoreBonusesRecords[i];
                }
            }
        }
    }

    private getExchangeRecord(id: number): any {
        let activityState = GameServerData.getInstance().getActivityState(this.dynamicParam.id);
        if (activityState && activityState.data) {
            let exchangeGoodsRecords:Array<any> = activityState.data.activityOpenCelebration.exchangeGoodsRecords;
            for (let i = 0; i < exchangeGoodsRecords.length; i++) {
                if (exchangeGoodsRecords[i].id == id) {
                    return exchangeGoodsRecords[i];
                }
            }
        }
    }

    private getTasksStatesRecord(id: number): any {
        let activityState = GameServerData.getInstance().getActivityState(this.dynamicParam.id);
        if (activityState && activityState.data) {
            let tasksStates:Array<any> = activityState.data.activityOpenCelebration.tasksStates;
            for (let i = 0; i < tasksStates.length; i++) {
                if (tasksStates[i].id == id) {
                    return tasksStates[i];
                }
            }
        }
    }

    private static getDaysGiftsRecord(activityId:number | string, payId: number, lastState?:any): any {
        let activityState:any;
        if (lastState) {
            activityState = lastState;
        } else {
            activityState = GameServerData.getInstance().getActivityState(activityId);
        }
        if (activityState && activityState.data) {
            let daysGiftsRecords:Array<any> = activityState.data.activityOpenCelebration.daysGiftsRecords;
            for (let i = 0; i < daysGiftsRecords.length; i++) {
                if (daysGiftsRecords[i].payId == payId) {
                    return daysGiftsRecords[i];
                }
            }
        }
    }

    public getIsViewMask():boolean {
        return false;
    }

    public static isViewRedPointScore(activityId:number | string):boolean {
        let total_score = 0;
        let activityState = GameServerData.getInstance().getActivityState(activityId);
        if (activityState && activityState.data) {
            total_score = activityState.data.activityOpenCelebration.totalScore;
        }
        let scoreBonusesGroup:Array<any> = GameServerData.getInstance().getDynamicActivityParam(activityId).data.scoreBonusesGroup;
        for (let i = 0; i < scoreBonusesGroup.length; i++) {
            let scoreData = scoreBonusesGroup[i];
            let isTook = false;
            let record = LyActivityOpenCelebration.getScoreBonuseRecord(activityId, scoreData.score);
            if (record) {
                isTook = record.isTook;
            }
            if (total_score >= scoreData.score && !isTook) {
                return true;
            }
        }
        return false;
    }

    public static isViewRedPointTask(activityId:number | string):boolean {
        let activityState = GameServerData.getInstance().getActivityState(activityId);
        if (activityState && activityState.data) {
            let tasksStates:Array<any> = activityState.data.activityOpenCelebration.tasksStates;
            for (let i = 0; i < tasksStates.length; i++) {
                if (tasksStates[i].state == 1) {
                    return true;
                }
            }
        }
        return false;
    }

    public static isViewRedPointGifts(activityId:number | string):boolean {
        let dynamicParam = GameServerData.getInstance().getDynamicActivityParam(activityId);
        let daysGiftsGroup:Array<any> = dynamicParam.data.daysGiftsGroup;
        for (let i = 0; i < daysGiftsGroup.length; i++) {
            let giftData = daysGiftsGroup[i];
            if (giftData.payId <= 0) {
                let maxCount = Number(giftData.maxBuyCount);
                let buyCount = 0;
                let record = LyActivityOpenCelebration.getDaysGiftsRecord(activityId, giftData.payId);
                if (record) {
                    buyCount = record.tookCount;
                }
                if (maxCount - buyCount > 0) {
                    return true;
                }
            }
        }
        return false;
    }
}