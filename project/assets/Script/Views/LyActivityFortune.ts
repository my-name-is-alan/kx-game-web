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
import { BonuseItem, PayItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { GameServer } from "../Kernel/GameServer";
import { GuideManager } from "../Kernel/GuideManager";
import { LyGuideDetail } from "./LyGuideDetail";
import { FguiGTween } from "../Kernel/FguiGTween";
import { Vec2 } from "cc";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { LyGuideDesc } from "./LyGuideDesc";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { PErrCode } from "../Values/PErrCode";
import { LocaleUser } from "../Kernel/LocaleUser";
import { AudioManager } from "../Kernel/AudioManager";

export class LyActivityFortune extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyActivityFortune;
        this.viewResI.pkgName = "LyActivityFortune";
        this.viewResI.comName = "LyActivityFortune";
    }

    private static isCheckSel:boolean = false;

    private dynamicParam:any;

    private list_tab1:fgui.GGroup;
    private list_tab2:fgui.GList;
    private list_tab3:fgui.GList;
    private list_init:Array<boolean> = new Array<boolean>(false, false, false);

    private payShowType:number;
    private goodStartPos:Array<Vec2>;
    private tweens:Array<FguiGTween>;
    private isAddTween:boolean;
    private lastGiftData:any;
    private MIN_COUNT:number = 1;

    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        this.dynamicParam = params.dynamicParam;

        // 初始位置
        this.goodStartPos = new Array<Vec2>();
        for (let i = 0; i < 10; i++) {
            let group_drawitem = group_main.getChild("group_drawitem" + String(i + 1), fgui.GComponent);
            this.goodStartPos.push(new Vec2(group_drawitem.x, group_drawitem.y));
        }

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityFortune, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let btn_detail:fgui.GButton = group_main.getChild("btn_detail");
        btn_detail.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:this.dynamicParam.name, detail:this.dynamicParam.detail});
        })

        let loader_title = group_main.getChild("loader_title", fgui.GLoader);
        // this.dynamicParam.data.background = "frame_ruyimijiqian"
        loader_title.url = UtilsTool.stringFormat("ui://LyActivityFortune/{0}", [this.dynamicParam.data.background]);

        let btn_rate:fgui.GButton = group_main.getChild("btn_rate");
        btn_rate.onClick(() => {
            let contentItems = new Array<any>();
            let fortuneGoodsGroup:Array<any> = this.dynamicParam.data.fortuneGoodsGroup;
            for (let i = 0; i < fortuneGoodsGroup.length; i++) {
                let fortuneGood = fortuneGoodsGroup[i];
                let bonuseItem = UtilsUI.getBonuseItem(String(fortuneGood.type), null, String(fortuneGood.protoId), String(fortuneGood.count));
                contentItems.push({
                    name:UtilsTool.stringFormat("{0} x{1}", [bonuseItem.name, bonuseItem.count]),
                    desc:UtilsTool.stringFormat("{0}%", [fortuneGood.rate / 100]),
                });
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDesc, 0, {title:StrVal.LYACTIVITY_FORTUNE.STR14, contentItems:contentItems});
        })

        let lastState = GameServerData.getInstance().getActivityState(this.dynamicParam.id);
        this.registerRequest((args) => {
            if (args.activityState.activityId == this.dynamicParam.id) {
                if (this.payShowType == 3 && this.lastGiftData) {
                    let oldrecord = LyActivityFortune.getDaysGiftsRecord(this.dynamicParam.id, this.lastGiftData.id, lastState);
                    let newrecord = LyActivityFortune.getDaysGiftsRecord(this.dynamicParam.id, this.lastGiftData.id);
                    if (oldrecord.tookCount != newrecord.tookCount) {
                        let bonuseItems = UtilsUI.getBonuseItemsByString(this.lastGiftData.bonuses);
                        if (this.lastGiftData.score > 0) {
                            let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.fortunescore, null, null, String(this.lastGiftData.score));
                            bonuseItems.push(bonuseItem);
                        }
                        UtilsUI.showItemReward({
                            bonuseItems:bonuseItems,
                            rebateBonuseItems:UtilsUI.getRebateBonuseItems()
                        });
                    }
                }
                if (this.payShowType == 1) {
                } else if (this.payShowType == 2) {
                    this.sortListData(2);
                } else if (this.payShowType == 3) {
                    this.sortListData(3);
                }
                // 活动重置的时候，其实也可以重置动画对吧。
                // this.isAddTween = false;
                // this.addTween(null, null, true);
                this.refreshScoreBonusesGroup();
                this.resetSkipAniShow();
                lastState = args.activityState;
            }
        }, "activityStateChanged");

        let btn_tab1:fgui.GButton = group_main.getChild("btn_tab1");
        PointRedData.getInstance().registerPoint(btn_tab1, PointRedType.LyActivityFortuneScore, this.dynamicParam.id);
        btn_tab1.text = StrVal.LYACTIVITY_FORTUNE.STR1;
        btn_tab1.onClick(() => {
            if (this.payShowType != 1) {
                this.payShowType = 1;
                this.setViewPage();
            }
        })

        let btn_tab2:fgui.GButton = group_main.getChild("btn_tab2");
        PointRedData.getInstance().registerPoint(btn_tab2, PointRedType.LyActivityFortuneTask, this.dynamicParam.id);
        btn_tab2.text = StrVal.LYACTIVITY_FORTUNE.STR2;
        btn_tab2.onClick(() => {
            if (this.payShowType != 2) {
                this.payShowType = 2;
                this.setViewPage();
            }
        })

        let btn_tab3:fgui.GButton = group_main.getChild("btn_tab3");
        PointRedData.getInstance().registerPoint(btn_tab3, PointRedType.LyActivityFortuneGifts, this.dynamicParam.id);
        btn_tab3.text = StrVal.LYACTIVITY_FORTUNE.STR3;
        btn_tab3.onClick(() => {
            if (this.payShowType != 3) {
                this.payShowType = 3;
                this.setViewPage();
            }
        })

        let group_scoreicon = group_main.getChild("group_scoreicon", fgui.GComponent);
        group_scoreicon.getChild("loader_icon", fgui.GLoader).url = UtilsUI.getItemIconUrl(VarVal.bonusType.fortunescore);

        let label_time_act:fgui.GButton = group_main.getChild("label_time_act");
        label_time_act.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_FORTUNE.STR10, [
            UtilsTool.TimeToStr(this.dynamicParam.startTime, "/"),
            UtilsTool.TimeToStr(this.dynamicParam.endTime, "/")
        ]);

        let label_time:fgui.GButton = group_main.getChild("label_time");
        let timeCall = () => {
            let serverTime = GameServerData.getInstance().getServerTime() * 1000;
            let lastTime = UtilsTool.getNextDateTime(serverTime);
            let remain = lastTime - serverTime;
            label_time.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_FORTUNE.STR11, [UtilsTool.splitTimeString(remain / 1000)]);
        }
        this.setInterval(timeCall, 1000);
        timeCall();
        
        let spinePlayer = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation("stand", true);
        }, group_main.getChild("loader_spine", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_fortune);

        // 跳过动画
        let btn_check:fgui.GButton = group_main.getChild("btn_check");
        btn_check.onClick(() => {
            if (btn_check.selected) {
                if (this.getDrawCount() < this.MIN_COUNT) {
                    btn_check.selected = false;
                    UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYACTIVITY_FORTUNE.STR15, [this.MIN_COUNT]));
                } else {
                    LocaleUser.setUser(VarVal.FIELD_SV.FORTUNE_DRAW, "1");
                    LocaleUser.flush();
                }
            } else {
                LocaleUser.setUser(VarVal.FIELD_SV.FORTUNE_DRAW, "0");
                LocaleUser.flush();
            }
        })
        this.resetSkipAniShow();
        let label_quick = group_main.getChild("label_quick")
        label_quick.text = StrVal.LYACTIVITY_FORTUNE.STR16;
        // 跳过动画

        this.list_tab1 = group_main.getChild("list_tab1", fgui.GGroup);
        let label_tips:fgui.GTextField = group_main.getChild("label_tips");
        label_tips.text = StrVal.LYACTIVITY_FORTUNE.STR8;
        let dododofortuneDraw = (count:number) => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    // UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult], true)});
                    UtilsUI.showItemReward({bonuseItems:this.getDrawBonuseItems(args.ids)});
                    // 事件中刷新。
                    spinePlayer.playAnimation("stand", true);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "fortuneDraw", {
                activityId:this.dynamicParam.id,
                count:count
            });
        }
        let dofortuneDraw = (count:number) => {
            if (!LyActivityFortune.isViewRedPointDraw(this.dynamicParam.id, count)) {
                UtilsUI.showMsgTip(PErrCode.fortune_score_not_enough);
            } else {
                if (btn_check.selected) {
                    dododofortuneDraw(count);
                } else {
                    UtilsUI.lockMask();
                    spinePlayer.playAnimation("start", false, null, null, () => {
                        UtilsUI.unlockMask();
                        dododofortuneDraw(count);
                    }, true)
                }
            }
        }
        let aaaaa = UtilsUI.getItemIconUrl(VarVal.bonusType.fortunescore);
        group_main.getChild("loader_icon1", fgui.GLoader).url = aaaaa;
        group_main.getChild("loader_icon10", fgui.GLoader).url = aaaaa;
        let btn_draw1:fgui.GButton = group_main.getChild("btn_draw1");
        PointRedData.getInstance().registerPoint(btn_draw1, PointRedType.LyActivityFortuneDraw, this.dynamicParam.id);
        btn_draw1.text = StrVal.LYACTIVITY_FORTUNE.STR12;
        btn_draw1.onClick(() => {
            dofortuneDraw(1);
        })
        let btn_draw10:fgui.GButton = group_main.getChild("btn_draw10");
        PointRedData.getInstance().registerPoint(btn_draw10, PointRedType.LyActivityFortuneDraw10, this.dynamicParam.id);
        btn_draw10.text = StrVal.LYACTIVITY_FORTUNE.STR13;
        btn_draw10.onClick(() => {
            dofortuneDraw(10);
        })

        this.list_tab2 = group_main.getChild("list_tab2", fgui.GList);
        this.list_tab2.setVirtual();
        this.list_tab2.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let taskData = this.dynamicParam.data.taskGroup[index];

            let label_name:fgui.GTextField = group_item.getChild("label_name");
            label_name.text = taskData.name;

            let bonuseItems = UtilsUI.getBonuseItemsByString(taskData.bonuses);
            if (taskData.score > 0) {
                let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.fortunescore, null, null, String(taskData.score));
                bonuseItems.push(bonuseItem);
            }
            // 列表
            let list_item:fgui.GList = group_item.getChild("list_item");
            list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], child, null);
            }
            list_item.numItems = bonuseItems.length;

            let state = 0;
            let maxCount = Number(taskData.params);
            let doneCount = 0;

            let record = this.getTasksStatesRecord(taskData.id);
            if (record) {
                state = record.state;
                doneCount = record.value;
            }

            let label_count:fgui.GTextField = group_item.getChild("label_count");
            label_count.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_FORTUNE.STR7, [doneCount, maxCount]);
            label_count.color = UtilsUI.getEnoughColor(doneCount == maxCount);

            let img_done:fgui.GImage = group_item.getChild("img_done");
            let label_done:fgui.GTextField = group_item.getChild("label_done");
            let btn_go:fgui.GButton = group_item.getChild("btn_go");
            btn_go.clearClick();
            btn_go.onClick(() => {
                if (taskData.type == VarVal.FortuneTaskType.cutTree) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.KANSHU,
                    });
                } else if (taskData.type == VarVal.FortuneTaskType.animalUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.PET_LEVELUP,
                    });
                } else if (taskData.type == VarVal.FortuneTaskType.animalCall) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.PET_CALL,
                    });
                } else if (taskData.type == VarVal.FortuneTaskType.theurgyUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.THEURG_LEVELUP,
                    });
                } else if (taskData.type == VarVal.FortuneTaskType.theurgyPump) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.THEURG_CALL,
                    });
                } else if (taskData.type == VarVal.FortuneTaskType.dhamaUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.FABAO_LEVELUP,
                    });
                } else if (taskData.type == VarVal.FortuneTaskType.dhamaPump) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.FABAO_CALL,
                    });
                } else if (taskData.type == VarVal.FortuneTaskType.gremlinUpgrade) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.ELITE_LEVELUP,
                    });
                } else if (taskData.type == VarVal.FortuneTaskType.gremlinCall) {
                    GuideManager.startGuide({
                        guideType: VarVal.GUIDE_TYPE.ELITE_CALL,
                    });
                } else if (taskData.type == VarVal.FortuneTaskType.share) {
                    UtilsUI.playerShareGame(() => {
                        UtilsUI.showMsgTip(StrVal.COMMON.STR101);
                    }, {
                        title: StrVal.COMMON.STR301,
                    })
                } else if (taskData.type == VarVal.FortuneTaskType.forumSign ||
                    taskData.type == VarVal.FortuneTaskType.gameHub) {
                    UtilsUI.showMsgTip("正在建设中");
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
                        UtilsUI.showItemReward({bonuseItems:bonuseItems});
                        // 事件中刷新。
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "takeFortuneTaskBonuses", {
                    activityId:this.dynamicParam.id,
                    taskId:taskData.id
                });
            })
            if (state == 0) { // 前往
                img_done.visible = false;
                label_done.text = "";
                btn_go.visible = true;
                btn_go.text = StrVal.LYACTIVITY_FORTUNE.STR4;
                btn_take.visible = false;
            } else if (state == 1) { // 领取
                img_done.visible = false;
                label_done.text = "";
                btn_go.visible = false;
                btn_take.visible = true;
                btn_take.text = StrVal.LYACTIVITY_FORTUNE.STR5;
            } else if (state == 2) { // 已领取
                img_done.visible = true;
                label_done.text = StrVal.LYACTIVITY_FORTUNE.STR6;
                btn_go.visible = false;
                btn_take.visible = false;
            }
        }

        let doTakeFortuneDaysGiftsBonuses = (id:number) => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    // 事件里刷新
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "takeFortuneDaysGiftsBonuses", {
                activityId:this.dynamicParam.id,
                id:id
            });
        }

        this.list_tab3 = group_main.getChild("list_tab3", fgui.GList);
        this.list_tab3.setVirtual();
        this.list_tab3.itemRenderer = (index:number, group_item:fgui.GComponent) => {
            let giftData = this.dynamicParam.data.daysGiftsGroup[index];
            let giftItem:PayItem;
            if (giftData.type == VarVal.FortuneGiftType.free) {
                giftItem = {
                    money:String(giftData.param) // 0,-1
                }
            } else if (giftData.type == VarVal.FortuneGiftType.recharge) {
                giftItem = LocaleData.getPayItem(giftData.param);
            }

            let label_name:fgui.GTextField = group_item.getChild("label_name");
            label_name.text = giftData.name;

            let bonuseItems = UtilsUI.getBonuseItemsByString(giftData.bonuses);
            if (giftData.score > 0) {
                let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.fortunescore, null, null, String(giftData.score));
                bonuseItems.push(bonuseItem);
            }
            // 列表
            let list_item:fgui.GList = group_item.getChild("list_item");
            list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], child, null);
            }
            list_item.numItems = bonuseItems.length;

            let maxCount = giftData.maxBuyCount;
            let buyCount = 0;
            let record = LyActivityFortune.getDaysGiftsRecord(this.dynamicParam.id, giftData.id);
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

            let btn_buy:fgui.GButton;
            if (giftData.type == VarVal.FortuneGiftType.stone) {
                group_item.getChild("group_rebeatfan").visible = false;
                btn_buy = group_item.getChild("btn_buy");
                UtilsUI.setButtonIcon(btn_buy, VarVal.bonusType.stone, String(giftData.param));
            } else {
                UtilsUI.setPayItemRebateComp(group_item.getChild("group_rebeatfan"), giftItem);
                btn_buy = UtilsUI.setPayItemButtonName(group_item.getChild("btn_buy"), giftItem);
            }
            PointRedData.getInstance().updateManualPoint(btn_buy, giftData.type == VarVal.FortuneGiftType.free && maxCount - buyCount > 0);
            btn_buy.clearClick();
            btn_buy.onClick(() => {
                this.lastGiftData = giftData;
                if (giftData.type == VarVal.FortuneGiftType.recharge) {
                    UtilsUI.payRechargeItem((errmsg:string) => {
                        if (errmsg) {
                            UtilsUI.showMsgTip(errmsg);
                        }
                    }, giftItem, VarVal.payType.others, VarVal.payGiftType.daily);
                } else if (giftData.type == VarVal.FortuneGiftType.stone) {
                    if (LyActivityFortune.isCheckSel) {
                        doTakeFortuneDaysGiftsBonuses(giftData.id);
                    } else {
                        UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "", 
                        UtilsTool.stringFormat(StrVal.LYACTIVITY_FORTUNE.STR17, [giftData.param, UtilsUI.getItemIconUrl(VarVal.bonusType.stone), giftData.name]), null, 
                        StrVal.COMMON.STR32, null, 
                        StrVal.COMMON.STR33, (isCheckSel:boolean) => {
                            LyActivityFortune.isCheckSel = isCheckSel;
                            doTakeFortuneDaysGiftsBonuses(giftData.id);
                        }, "", null, {
                            checkBoxText: StrVal.COMMON.STR35
                        })
                    }
                } else {
                    doTakeFortuneDaysGiftsBonuses(giftData.id);
                }
            })
            if (maxCount - buyCount > 0) {
                btn_buy.grayed = false;
                btn_buy.enabled = true;
            } else {
                btn_buy.grayed = true;
                btn_buy.enabled = false;
                UtilsUI.setButtonIcon(btn_buy, null, StrVal.LYPAY_ACTIVITYS.STR102);
            }
        }

        this.refreshScoreBonusesGroup();

        if (params) {
            this.payShowType = params.type;
        } else {
            this.payShowType = 1;
        }
        this.setViewPage();
    }

    private setViewPage():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        group_main.getController("c1").selectedIndex = this.payShowType - 1;

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

    private getDrawBonuseItems(ids: Array<number>): Array<BonuseItem> {
        let temps:Array<BonuseItem> = new Array<BonuseItem>();
        let fortuneGoodsGroup = this.dynamicParam.data.fortuneGoodsGroup;
        for (let jjj = 0; jjj < ids.length; jjj++) {
            for (let i = 0; i < 10; i++) {
                let fortuneGood = fortuneGoodsGroup[i];
                if (fortuneGood.id == ids[jjj]) {
                    let bonuseItem = UtilsUI.getBonuseItem(String(fortuneGood.type), null, String(fortuneGood.protoId), String(fortuneGood.count));
                    temps.push(bonuseItem);
                    break;
                }
            }
        }
        return temps;
    }

    private refreshScoreBonusesGroup(): void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let max_ui_item = 5;
        let drawCountBonusesGroup = this.dynamicParam.data.drawCountBonusesGroup;
        let curr_item_len = drawCountBonusesGroup.length;
        let max_drawcount = 0;
        for (let i = 0; i < drawCountBonusesGroup.length; i++) {
            if (drawCountBonusesGroup[i].count > max_drawcount) {
                max_drawcount = drawCountBonusesGroup[i].count;
            }
        }

        let remain_score = 0;
        let curr_drawcount = 0;
        let activityState = GameServerData.getInstance().getActivityState(this.dynamicParam.id);
        if (activityState && activityState.data) {
            remain_score = activityState.data.activityFortune.score; 
            curr_drawcount = activityState.data.activityFortune.drawCount;
        }

        let group_scoreicon = group_main.getChild("group_scoreicon", fgui.GComponent);
        group_scoreicon.getChild("label_score", fgui.GTextField).text = String(curr_drawcount);

        let done_item_len = 0
        for (let i = 0; i < max_ui_item; i++) {
            if (i < curr_item_len) {
                let drawData = drawCountBonusesGroup[i];
                if (curr_drawcount >= drawData.count) {
                    done_item_len = i + 1;
                }
            }
        }

        let bar_progress:fgui.GProgressBar = group_main.getChild("bar_progress");
        bar_progress.min = 0;
        bar_progress.max = curr_item_len;
        bar_progress.value = done_item_len;
        
        let bar_split_space = bar_progress.width / curr_item_len;

        for (let i = 0; i < max_ui_item; i++) {
            let group_line = group_main.getChild("group_line" + String(i+1), fgui.GList);
            if (i < curr_item_len) {
                let group_item = group_line.getChild("group_item", fgui.GComponent);
                group_line.setPosition(bar_progress.x + (i + 1) * bar_split_space, bar_progress.y);
                let label_name = group_line.getChild("label_name", fgui.GTextField);

                let drawData = drawCountBonusesGroup[i];
                let isTook = false;
                let record = this.getScoreBonuseRecord(drawData.count);
                if (record) {
                    isTook = record.isTook;
                }

                let MAX_SCALE = 0.7;
                if (i != curr_item_len - 1) {
                    group_item.setScale(MAX_SCALE, MAX_SCALE);
                } else {
                    group_line.x = group_line.x + (group_line.width * (1 - MAX_SCALE) * 0.5);
                }
                label_name.y = group_item.y + (group_item.initHeight * group_item.scaleY) / 2;
                label_name.text = drawData.count;
                let bonuseItems = UtilsUI.getBonuseItemsByString(drawData.bonuses);
                if (isTook) {
                    this.playAnim(group_line, false);
                    UtilsUI.setUIGroupItem(bonuseItems[0], group_item, null);
                    group_item.getChild("img_check").visible = true;
                    group_item.getChild("img_dark").visible = true;
                } else {
                    if (curr_drawcount >= drawData.count) {
                        this.playAnim(group_line, true);
                        UtilsUI.setUIGroupItem(bonuseItems[0], group_item, () => {
                            UtilsUI.lockWait();
                            GameServer.getInstance().send((args: any) => {
                                UtilsUI.unlockWait();
                                if (args.errorcode == 0) {
                                    UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                                    // 事件中刷新。
                                } else {
                                    UtilsUI.showMsgTip(args.errorcode);
                                }
                            }, "takeFortuneTotalDrawBonuses", {
                                activityId:this.dynamicParam.id,
                                count:drawData.count
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

        // 抽卡券数量
        let label_need1 = group_main.getChild("label_need1", fgui.GTextField);
        label_need1.text = UtilsTool.stringFormat("{0}/{1}", [remain_score, 1]);
        label_need1.color = UtilsUI.getEnoughColor(remain_score >= 1);
        let label_need10 = group_main.getChild("label_need10", fgui.GTextField);
        label_need10.text = UtilsTool.stringFormat("{0}/{1}", [remain_score, 10]);
        label_need10.color = UtilsUI.getEnoughColor(remain_score >= 10);

        // 抽奖泡泡
        if (!this.tweens) {
            this.tweens = new Array<FguiGTween>();
        }
        let fortuneGoodsGroup = this.dynamicParam.data.fortuneGoodsGroup;
        for (let i = 0; i < 10; i++) {
            let fortuneGood = fortuneGoodsGroup[i];
            let group_drawitem = group_main.getChild("group_drawitem" + String(i + 1), fgui.GComponent);
            if (fortuneGood) {
                let pos = this.goodStartPos[i];
                group_drawitem.x = pos.x;
                group_drawitem.y = pos.y;
                if (!this.isAddTween) {
                    this.addTween(group_drawitem, i, false);
                }

                let bonuseItem = UtilsUI.getBonuseItem(String(fortuneGood.type), null, String(fortuneGood.protoId), String(fortuneGood.count));
                UtilsUI.setUIGroupItem(bonuseItem, group_drawitem, null);

                // 保底相关
                group_drawitem.getController("c1").selectedIndex = fortuneGood.maxCount > 0 ? 1 : 0;
                if (fortuneGood.maxCount > 0) {
                    let label_drop = group_drawitem.getChild("label_drop", fgui.GTextField);
                    label_drop.text = UtilsTool.stringFormat(StrVal.LYACTIVITY_FORTUNE.STR9, [fortuneGood.maxCount - this.getGoodDrawCount(fortuneGood.id), fortuneGood.maxCount]);
                }
                let bar_draw = group_drawitem.getChild("bar_draw", fgui.GProgressBar);
                if (fortuneGood.guarantee > 0) {
                    bar_draw.min = 0;
                    bar_draw.max = fortuneGood.guarantee;
                    bar_draw.value = this.getGoodGuarantee();
                } else {
                    bar_draw.visible = false;
                }
            } else {
                group_drawitem.visible = false;
            }
            if (i == 10-1) {
                this.isAddTween = true;
            }
        }
    }

    private addTween(com:fgui.GComponent, idx:number, isClear: boolean){
        if (isClear) {
            for (let i = 0; i < this.tweens.length; i++) {
                this.tweens[i].kill();
            }
            this.tweens.length = 0;
        } else {
            let yyy = 30;
            let ttt = 4;
            this.setTimeout(() => {
                if (!com.isDisposed) {
                    let tw = FguiGTween.new(com).by(ttt, {y:yyy}, {easing: fgui.EaseType.SineOut}).by(ttt, {y:-yyy}, {easing: fgui.EaseType.SineOut}).repeat().start();
                    this.tweens.push(tw);
                }
            }, 1000 * ((idx + 1) / 10))
        }
    }

    private playAnim(com:fgui.GComponent, isPlay: boolean){
        let t0 = com.getTransition("t0");
        if (isPlay) {
            if (!t0.playing) {
                t0.play(null , -1)
            }
        }else{
            t0.stop()
        }
    }

    private sortListData(idx: number): any {
        if (idx == 2) {
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
                return itemA.id - itemB.id;
            })
            // 把已购买的插入末尾
            for (let i = __datas.length - 1; i >= 0; i--) {
                let maxCount1 = Number(__datas[i].maxBuyCount);
                let buyCount1 = 0;
                let record1 = LyActivityFortune.getDaysGiftsRecord(this.dynamicParam.id, __datas[i].id);
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

    private resetSkipAniShow() {
        let FORTUNE_DRAW = LocaleUser.getUser(VarVal.FIELD_SV.FORTUNE_DRAW);
        if (FORTUNE_DRAW == "1") {
            let group_main:fgui.GComponent = this.getUiPanel().getChild("group_main");
            let btn_check:fgui.GButton = group_main.getChild("btn_check");
            btn_check.selected = true;
            if (this.getDrawCount() < this.MIN_COUNT) {
                btn_check.selected = false;
                LocaleUser.setUser(VarVal.FIELD_SV.FORTUNE_DRAW, "0");
                LocaleUser.flush();
            }
        }
    }

    private getDrawCount(): number {
        let drawCount = 0;
        let activityState = GameServerData.getInstance().getActivityState(this.dynamicParam.id);
        if (activityState && activityState.data) {
            drawCount = activityState.data.activityFortune.drawCount;
        }
        return drawCount;
    }

    private getGoodGuarantee(): number {
        let count = 0;
        let activityState = GameServerData.getInstance().getActivityState(this.dynamicParam.id);
        if (activityState && activityState.data) {
            count = activityState.data.activityFortune.guarantee;
        }
        return count;
    }

    private getGoodDrawCount(id:number | string): number {
        id = Number(id);
        let count = 0;
        let activityState = GameServerData.getInstance().getActivityState(this.dynamicParam.id);
        if (activityState && activityState.data) {
            let drawRecords:Array<any> = activityState.data.activityFortune.drawRecords;
            for (let i = 0; i < drawRecords.length; i++) {
                if (drawRecords[i].id == id) {
                    count = drawRecords[i].count;
                }
            }
        }
        return count;
    }

    private getScoreBonuseRecord(count: number): any {
        let activityState = GameServerData.getInstance().getActivityState(this.dynamicParam.id);
        if (activityState && activityState.data) {
            let totalDrawBonusesRecords:Array<any> = activityState.data.activityFortune.totalDrawBonusesRecords;
            for (let i = 0; i < totalDrawBonusesRecords.length; i++) {
                if (totalDrawBonusesRecords[i].count == count) {
                    return totalDrawBonusesRecords[i];
                }
            }
        }
    }

    private getTasksStatesRecord(id: number): any {
        let activityState = GameServerData.getInstance().getActivityState(this.dynamicParam.id);
        if (activityState && activityState.data) {
            let tasksStates:Array<any> = activityState.data.activityFortune.tasksStates;
            for (let i = 0; i < tasksStates.length; i++) {
                if (tasksStates[i].id == id) {
                    return tasksStates[i];
                }
            }
        }
    }

    private static getDaysGiftsRecord(activityId:number | string, id: number, lastState?:any): any {
        let activityState:any;
        if (lastState) {
            activityState = lastState;
        } else {
            activityState = GameServerData.getInstance().getActivityState(activityId);
        }
        if (activityState && activityState.data) {
            let daysGiftsRecords:Array<any> = activityState.data.activityFortune.daysGiftsRecords;
            for (let i = 0; i < daysGiftsRecords.length; i++) {
                if (daysGiftsRecords[i].id == id) {
                    return daysGiftsRecords[i];
                }
            }
        }
    }

    public getIsViewMask():boolean {
        return false;
    }

    public static isViewRedPointDraw(activityId:number | string, count?:number):boolean {
        let score = 0;
        let activityState = GameServerData.getInstance().getActivityState(activityId);
        if (activityState && activityState.data) {
            score = activityState.data.activityFortune.score;
        }
        return score >= (count ? count : 1);
    }

    public static isViewRedPointScore(activityId:number | string):boolean {
        if (LyActivityFortune.isViewRedPointDraw(activityId, 1)) {
            return true;
        }
        let drawCount = 0;
        let activityState = GameServerData.getInstance().getActivityState(activityId);
        if (activityState && activityState.data) {
            drawCount = activityState.data.activityFortune.drawCount;
            let totalDrawBonusesRecords:Array<any> = activityState.data.activityFortune.totalDrawBonusesRecords;
            for (let i = 0; i < totalDrawBonusesRecords.length; i++) {
                let record = totalDrawBonusesRecords[i];
                if (drawCount >= record.count && !record.isTook) {
                    return true;
                }
            }
        }
        return false;
    }

    public static isViewRedPointTask(activityId:number | string):boolean {
        let activityState = GameServerData.getInstance().getActivityState(activityId);
        if (activityState && activityState.data) {
            let tasksStates:Array<any> = activityState.data.activityFortune.tasksStates;
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
            if (giftData.type == VarVal.FortuneGiftType.free) {
                let maxCount = giftData.maxBuyCount;
                let buyCount = 0;
                let record = LyActivityFortune.getDaysGiftsRecord(activityId, giftData.id);
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