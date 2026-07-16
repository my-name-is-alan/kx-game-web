//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { GameServer } from "../Kernel/GameServer";
import { LyGuideDetail } from "./LyGuideDetail";
import { AudioManager } from "../Kernel/AudioManager";
import { LyActivityOpenRankRecord } from "./LyActivityOpenRankRecord";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { GuideManager } from "../Kernel/GuideManager";

export interface openRankItem {
    guid: string,
    name: string,
    rank: number,
    realPeople: boolean,
    value: number,
    uid: string,
    phase: number,
    character: number,
    appearance: number,
    title: number,
    combatPower: string,
    avatar: number,
    avatarBorder: number;
    chance: string,
}

export class LyActivityOpenRank extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyActivityOpenRank;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyActivityOpenRank;
        this.viewResI.comName = VarVal.PACKAGE_FGUIS.LyActivityOpenRank;
    }

    private TITLE_imgS = [
        "word_xialv·1-1",
        "word_xialv·2-1",
        "word_menke·1-1",
        "word_menke·2-1",
        "word_miji·1-1",
        "word_miji·2-1",
    ]

    activityXml:any;

    private searchDay:number;
    private searchPage:number;
    private rankSaves:Array<any>;
    private MAX_RANK0:number = 3;
    private MAX_RANK1:number = 200;

    private group_players:Array<fgui.GComponent>;

    public onViewCreate(params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");
        UtilsUI.playCommonGroupAni(group_main);

        this.activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.OPEN_RANK);

        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyActivityOpenRank, 0, null);
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        let btn_detail:fgui.GButton = group_main.getChild("btn_detail");
        btn_detail.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, {title:this.activityXml.name, detail:this.activityXml.detail});
        })

        // 下面是三个冠军位置
        this.group_players = [
            group_main.getChild("group_top1"),
            group_main.getChild("group_top2"),
            group_main.getChild("group_top3")
        ];
        for (let i = 0; i < 3; i++) {
            let group_player = this.group_players[i];
            let label_name = group_player.getChild("label_name", fgui.GTextField)
            label_name.strokeColor = UtilsUI.getRankColor(i + 1);

            let loader_back = group_player.getChild("loader_back", fgui.GLoader)
            loader_back.url = UtilsTool.stringFormat("ui://LyActivityOpenRank/frame_rank{0}_vertical", [i + 1]);

            let loader_score = group_player.getChild("loader_score", fgui.GLoader)
            loader_score.url = UtilsTool.stringFormat("ui://LyActivityOpenRank/frame_rank{0}_score", [i + 1]);

            let loader_lock = group_player.getChild("loader_lock", fgui.GLoader)
            loader_lock.url = UtilsTool.stringFormat("ui://LyActivityOpenRank/pic_vacant{0}", [i + 1]);

            let loader_rank = group_player.getChild("loader_rank", fgui.GLoader)
            loader_rank.url = UtilsTool.stringFormat("ui://LyActivityOpenRank/pic_rank{0}", [i + 1]);

            let label_rank = group_player.getChild("label_rank", fgui.GTextField)
            label_rank.text = String(i + 1);
            label_rank.strokeColor = UtilsUI.getRankColor(i + 1);

            group_player.getController("c1").selectedIndex = 1;
        }

        let label_sort:fgui.GButton = group_main.getChild("label_sort");
        label_sort.text = StrVal.ACTIVITY_OPENRANK.STR2;
        let label_score:fgui.GButton = group_main.getChild("label_score");
        label_score.text = StrVal.ACTIVITY_OPENRANK.STR3;
        let label_reward:fgui.GButton = group_main.getChild("label_reward");
        label_reward.text = StrVal.ACTIVITY_OPENRANK.STR4;

        // 列表
        let list_rank:fgui.GList = group_main.getChild("list_rank");
        list_rank.setVirtual();
        list_rank.itemRenderer = (index:number, child:fgui.GComponent) => {
            let stepNum1 = (index == (list_rank.numItems - 1));
            if (stepNum1) {
                this.fillListItem(child, index + 4, this.MAX_RANK1);
            } else {
                this.fillListItem(child, index + 4);
            }
        }
        let touch_begin = false;
        list_rank.on(fgui.Event.TOUCH_BEGIN, () => {
            touch_begin = true;
        })
        list_rank.on(fgui.Event.SCROLL, () => {
            if (touch_begin) {
                if (-list_rank.scrollPane._container.position.y <= -list_rank.scrollPane._overlapSize.y - 50) {
                    touch_begin = false;
                    // this.getRanData();
                }
            }
        })
        list_rank.on(fgui.Event.TOUCH_END, () => {
            touch_begin = false;
        })

        let label_time:fgui.GButton = group_main.getChild("label_time");
        let timeCall = () => {
            let openDay = GameServerData.getInstance().getServerCreateDay();
            if (this.searchDay < openDay) {
                label_time.text = StrVal.ACTIVITY_OPENRANK.STR7;
            } else {
                let serverTime = GameServerData.getInstance().getServerTime() * 1000;
                let lastTime:number = UtilsTool.getNextDateTime(serverTime);
                label_time.text = UtilsTool.stringFormat(StrVal.ACTIVITY_OPENRANK.STR42, [UtilsTool.splitTimeString((lastTime - serverTime) / 1000, true)]);
            }
        }
        this.setInterval(timeCall, 1000)
        timeCall();

        let group_self:fgui.GButton = group_main.getChild("group_self");
        group_self.onClick(() => {
            if (LyActivityOpenRank.isCanTakeDayBonuse(this.searchDay) == 1) {
                GameServer.getInstance().send((args: any) => {
                    if (args.errorcode == 0) {
                        let list_item_self:fgui.GList = group_self.getChild("list_item");
                        list_item_self.numItems = list_item_self.numItems;
                        UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString([args.bonusesResult])});
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "takeOpenRankBonuses", null);
            }
        })
        let charInfoself = LocaleData.getCharShowResInfoSelf();
        let group_headself:fgui.GComponent = group_self.getChild("group_head");
        let loader_iconself:fgui.GLoader = group_headself.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        loader_iconself.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfoself.icon]);

        let fullInfo = GameServerData.getInstance().getPlayerFullInfo();
        let label_name:fgui.GButton = group_self.getChild("label_name");
        label_name.text = fullInfo.base.name;

        let btn_goto:fgui.GButton = group_main.getChild("btn_goto");
        btn_goto.text = StrVal.ACTIVITY_OPENRANK.STR45;
        btn_goto.onClick(() => {
            if (this.searchDay < 3) {
                GuideManager.startGuide({
                    guideType: VarVal.GUIDE_TYPE.PET_CALL,
                });
            } else if (this.searchDay < 5) {
                GuideManager.startGuide({
                    guideType: VarVal.GUIDE_TYPE.ELITE_CALL,
                });
            } else if (this.searchDay < 7) {
                GuideManager.startGuide({
                    guideType: VarVal.GUIDE_TYPE.THEURG_CALL,
                });
            }
        })

        let resetState = () => {
            btn_openrecord.touchable = true;
            btn_openrecord.selected = false;
            btn_openrank.touchable = false;
            btn_openrank.selected = true;
            UtilsUI.updateTabButtonColor(btn_openrank);
            UtilsUI.updateTabButtonColor(btn_openrecord);
        }
        let btn_openrecord:fgui.GButton = group_main.getChild("btn_openrecord");
        PointRedData.getInstance().registerPoint(btn_openrecord, PointRedType.LyActivityOpenRank);
        btn_openrecord.text = StrVal.ACTIVITY_OPENRANK.STR31;
        btn_openrecord.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyActivityOpenRankRecord, 0, null);
            resetState();
        })
        let btn_openrank:fgui.GButton = group_main.getChild("btn_openrank");
        btn_openrank.text = StrVal.ACTIVITY_OPENRANK.STR32;
        btn_openrank.onClick(() => {})
        resetState();

        let day:number;
        if (params) {
            day = params.day;
        } else {
            day = GameServerData.getInstance().getServerCreateDay();
            day = Math.min(day, this.TITLE_imgS.length);
        }
        this.initDay(day);
    }

    public onViewUpdate(params: any): void {
        if (params && params.day) {
            this.initDay(params.day);
        }
    }

    private initDay(day:number):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");

        this.searchDay = day;

        let loader_title:fgui.GLoader = group_main.getChild("loader_title");
        loader_title.url = UtilsTool.stringFormat("ui://LyActivityOpenRank/{0}", [this.TITLE_imgS[this.searchDay - 1]]);

        let label_top:fgui.GButton = group_main.getChild("label_top");
        label_top.text = UtilsTool.stringFormat(StrVal.ACTIVITY_OPENRANK.STR1, [3, this.getChanceLimit(3, this.searchDay)]);

        this.rankSaves = new Array<any>();
        this.searchPage = 0;
        this.getRanData();
    }

    private getRanData():void {
        this.searchPage++;
        GameServer.getInstance().send((args: any) => {
            let isPush = false;
            if (args.errorcode == 0) {
                if (!this.isDisposed) {
                    let datds:Array<openRankItem> = args.data;
                    for (let i = 0; i < datds.length; i++) {
                        if (datds[i].realPeople) {
                            this.rankSaves.push(datds[i]);
                            isPush = true;
                        }
                    }
                    if (isPush) {
                        this.rankSaves.sort((itemA, itemB) => {
                            return itemA.rank - itemB.rank;
                        })
                    }
                    this.doRefreshRank(args);
                }
            } else {
                UtilsUI.showMsgTip(args.errorcode);
            }
            if (isPush) {
                // 
            } else {
                this.searchPage--;
            }
        }, "viewOpenRanks", {
            page:this.searchPage,
            day:this.searchDay
        });
    }

    private fillListItem(child:fgui.GComponent, num:number, replaceNum?:number): void {
        let label_rank:fgui.GTextField = child.getChild("label_rank");
        if (replaceNum) {
            label_rank.text = UtilsTool.stringFormat(">{0}", [replaceNum]);
            // num = replaceNum;
        } else {
            label_rank.text = String(num);
        }

        let loader_rank:fgui.GLoader = child.getChild("loader_rank");
        loader_rank.url = UtilsTool.stringFormat("ui://LyActivityOpenRank/pic_rank{0}", [num <= 3 ? num : 4]);
        loader_rank.visible = (num <= 5);

        if (replaceNum) {
            child.getController("c1").selectedIndex = 2;
        } else {
            let rankItem = this.getRankRecord(num);
            if (rankItem) {
                let charInfo = LocaleData.getCharShowResInfo(rankItem.character, rankItem.phase, rankItem.appearance, rankItem.avatar);
                let group_head:fgui.GComponent = child.getChild("group_head");
                let loader_icon:fgui.GLoader = group_head.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
                loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
                let btn_frame:fgui.GButton = group_head.getChild("btn_frame");
                btn_frame.clearClick();
                btn_frame.onClick(() => {
                    UtilsUI.onShowPlayerInfo(rankItem.guid);
                })

                let label_name:fgui.GTextField = child.getChild("label_name");
                label_name.text = rankItem.name;

                let label_score:fgui.GTextField = child.getChild("label_score");
                label_score.text = String(rankItem.value);
            }
            child.getController("c1").selectedIndex = rankItem ? 0 : 1;
        }

        let label_top:fgui.GTextField = child.getChild("label_top");
        if (label_top) {
            let chanceItem = this.getChanceItem(num);
            if (chanceItem) {
                child.height = child.initHeight + 40;
                label_top.visible = true;
                label_top.text = UtilsTool.stringFormat(StrVal.ACTIVITY_OPENRANK.STR1, [chanceItem.rank, this.searchDay >= 2 ? chanceItem.chance2 : chanceItem.chance]);
            } else {
                child.height = child.initHeight;
                label_top.visible = false;
            }
        }

        let list_item:fgui.GList = child.getChild("list_item");
        list_item.setVirtual();
        let bonuseId = this.getBonuseId(num, this.searchDay);
        if (bonuseId) {
            let bonuseItems = UtilsUI.getBonuseItemsByBonusesId(bonuseId);
            list_item.itemRenderer = (index:number, group_item:fgui.GComponent) => {
                UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
            }
            UtilsUI.setFguiGlistDelayNumItems(list_item, bonuseItems.length);
        } else {
            list_item.numItems = 0;
        }
    }

    private playAnim(com:fgui.GComponent, isPlay: boolean){
        if (isPlay) {
            com.getTransition("t0").play(null , -1)
        }else{
            com.getTransition("t0").stop()
        }
    }

    private doRefreshRank(args:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");

        let desc:string = this.activityXml.desc.split(";")[this.searchDay - 1]
        if (!desc) {desc = ""}

        let label_desc:fgui.GTextField = group_main.getChild("label_desc");
        label_desc.text = desc;

        let chance:number = 0;
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.OPEN_RANK);
        if (activityState && activityState.data) {
            chance = activityState.data.activityOpenRank.chance;
        }
        let label_today:fgui.GButton = group_main.getChild("label_today");
        label_today.text = UtilsTool.stringFormat(StrVal.ACTIVITY_OPENRANK.STR44, [chance]);

        let btn_goto:fgui.GButton = group_main.getChild("btn_goto");
        btn_goto.enabled = (this.searchDay < 7);
        btn_goto.visible = (desc.length > 0);

        let group_self:fgui.GButton = group_main.getChild("group_self");

        let label_rank:fgui.GButton = group_self.getChild("label_rank");
        label_rank.text = args.selfrank > 0 ? args.selfrank : StrVal.LYCHALLENGE_DUEL.STR9;
        let label_score:fgui.GButton = group_self.getChild("label_score");
        label_score.text = args.value;

        let list_item_self:fgui.GList = group_self.getChild("list_item");
        list_item_self.setVirtual();

        let bonuseItems:BonuseItem[];
        let bonuseIdSelf = this.getBonuseId(args.selfrank, this.searchDay);
        if (bonuseIdSelf && args.selfrank > 0) {
            bonuseItems = UtilsUI.getBonuseItemsByBonusesId(bonuseIdSelf);
        }
        list_item_self.itemRenderer = (index:number, child:fgui.GComponent) => {
            let group_item = child.getChild("group_item", fgui.GComponent);
            let isTake = LyActivityOpenRank.isCanTakeDayBonuse(this.searchDay);
            UtilsUI.setUIGroupItem(bonuseItems[index], group_item, null);
            group_item.getChild("img_dark").visible = isTake == 2;
            group_item.getChild("img_check").visible = isTake == 2;
            if (isTake == 1) {
                this.playAnim(child, true);
            } else {
                this.playAnim(child, false);
            }
        }
        if (bonuseItems) {
            UtilsUI.setFguiGlistDelayNumItems(list_item_self, bonuseItems.length);
        } else {
            list_item_self.numItems = 0;
        }

        // 列表
        let list_rank:fgui.GList = group_main.getChild("list_rank");
        UtilsUI.setFguiGlistDelayNumItems(list_rank, this.MAX_RANK1 - this.MAX_RANK0 + 1);
        group_main.getChild("img_empty_mask").visible = (list_rank.numItems == 0);

        // 下面是三个冠军位置
        for (let i = 0; i < 3; i++) {
            this.fillListItem(this.group_players[i], i + 1);
        }
    }

    private getRankRecord(rank:number):any {
        for (let i = 0; i < this.rankSaves.length; i++) {
            if (this.rankSaves[i].rank == rank) {
                return this.rankSaves[i];
            }
        }
    }

    private getChanceItem(rank:number):any {
        rank = Number(rank);
        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.OPEN_RANK);
        let items:Array<any> = activityXml._chance[0]._item;
        for (let i = 0; i < items.length; i++) {
            if (rank == Number(items[i].rank)) {
                return items[i];
            }
        }
    }
    
    private getChanceLimit(rank:number, day:number):string {
        rank = Number(rank);
        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.OPEN_RANK);
        let items:Array<any> = activityXml._chance[0]._item;
        items.sort((itemA, itemB) => {
            return Number(itemA.rank) - Number(itemB.rank);
        })
        for (let i = 0; i < items.length; i++) {
            if (rank <= Number(items[i].rank)) {
                if (day >= 2) {
                    return items[i].chance2;
                } else {
                    return items[i].chance;
                }
            }
        }
        return "1";
    }

    private getBonuseId(rank:number, day:number):string {
        rank = Number(rank);
        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.OPEN_RANK);
        let days:Array<any> = activityXml["_day" + day];
            let items:Array<any> = days[0]._item;
            items.sort((itemA, itemB) => {
                return Number(itemA.rank) - Number(itemB.rank);
            })
            for (let i = 0; i < items.length; i++) {
                if (rank <= Number(items[i].rank)) {
                    return items[i].bonuses;
                }
            }
    }

    public static isCanTakeDayBonuse(day:number):number {
        day = Number(day);
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.OPEN_RANK);
        if (activityState && activityState.data) {
            let takes:Array<number> = activityState.data.activityOpenRank.take;
            if (takes[day - 1]) {
                return takes[day - 1];
            }
        }
        return 0;
    }

    public getIsViewMask():boolean {
        return false;
    }

    public static isViewRedPointBonuse():boolean {
        let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.OPEN_RANK);
        if (activityState && activityState.data) {
            let takes:Array<number> = activityState.data.activityOpenRank.take;
            for (let i = 0; i < takes.length; i++) {
                if (takes[i] == 1) {
                    return true;
                }
            }
        }
        return false;
    }
}