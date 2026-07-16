//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { VarVal } from "../Values/VarVal";
import { AudioManager } from "../Kernel/AudioManager";
import { StrVal } from "../Values/StrVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { LyGoldFingerLevel } from "./LyGoldFingerLevel";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { LyGoldFingerSucc } from "./LyGoldFingerSucc";
import { LyGuideGetItem } from "./LyGuideGetItem";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { LyGoldFingerUpgrade } from "./LyGoldFingerUpgrade";
import { LyGoldFingerRate } from "./LyGoldFingerRate";

export class LyGoldFinger extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyGoldFinger;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyGoldFinger;
        this.viewResI.comName = "LyGoldFinger";
    }

    goldRoot:any;
    goldItems:any;
    items_len:number;
    static PUMP_ONCE:number = 1;
    static PUMP_MULT:number = 5;
    isInitPageMain:boolean = false;
    isInitPageGolds:boolean = false;
    showItem:any;
    isLastDone:boolean;

    lastSpineName:string;

    itemCount:number;

    public onViewCreate(_params:any):void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        let group_golds:fgui.GComponent = uiPanel.getChild("group_golds");

        this.goldRoot = LocaleData.getGoldFingerRoot();

        // 关闭
        let btn_close = uiPanel.getChild("btn_close")
        btn_close.onClick(()=> {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGoldFinger, 0, null);
        })

        let btn_jiangchi = uiPanel.getChild("btn_jiangchi", fgui.GButton);
        PointRedData.getInstance().registerPoint(btn_jiangchi, PointRedType.LyGoldFingerPump);
        let btn_zhibao = uiPanel.getChild("btn_zhibao", fgui.GButton);
        PointRedData.getInstance().registerPoint(btn_zhibao, PointRedType.LyGoldFingerLevel);

        let selPage = 1;
        let goldItem = LyGoldFinger.getGoldFingerPumpItem();
        if (!goldItem) {
            selPage = 2;
        }
        let initState = () => {
            if (selPage == 1) {
                group_main.visible = true;
                group_golds.visible = false;
                btn_jiangchi.selected = true;
                btn_zhibao.selected = false;
                this.initPageMain();
            } else {
                group_main.visible = false;
                group_golds.visible = true;
                btn_jiangchi.selected = false;
                btn_zhibao.selected = true;
                this.initPageGolds();
                this.updateListGold(); // 等级会变，刷新。
            }
        }

        initState();
        btn_jiangchi.onClick(()=> {
            if (selPage != 1) {
                selPage = 1;
                initState();
            } else {
                btn_jiangchi.selected = true;
            }
        })
        btn_zhibao.onClick(()=> {
            if (selPage != 2) {
                selPage = 2;
                initState();
            } else {
                btn_zhibao.selected = true;
            }
        })
    }

    private initPageGolds():void {
        if (!this.isInitPageGolds) {
            this.isInitPageGolds = true;
        } else {
            return;
        }

        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_golds");

        let label_title = group_main.getChild("label_title", fgui.GTextField);
        label_title.text = StrVal.LYGOLDFINGER.STR101;

        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
        }, group_main.getChild("loader_spine_bj", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_fabaochouqu_bj);

        this.goldItems = LocaleData.getGoldFingerItems();
        this.items_len = Math.floor(this.goldItems.length / 2) + 1;

        let doSetItemData = (goldItem:any, child:fgui.GComponent) => {
            let redpoint:boolean;
            let loader_spine_main:fgui.GLoader3D = child.getChild("loader_spine_main");
            if (goldItem) {
                let loader_name:fgui.GLoader = child.getChild("loader_name");
                loader_name.url = UtilsTool.stringFormat("ui://LyGoldFinger/{0}", [goldItem.iconName]);
                let level = 0;
                let record = GameServerData.getInstance().getGoldFingerRecord(goldItem.id);
                if (record) {
                    level = record.level;
                    redpoint = LyGoldFingerUpgrade.isViewRedPointUpgradeChild(goldItem.id) || LyGoldFingerUpgrade.isViewRedPointCanUseChild(goldItem.id);
                } else {
                    redpoint = false;
                }
                loader_name.grayed = (!record);
                for (let i = 0; i < LyGoldFingerLevel.MAX_GOLDLEVEL; i++) {
                    let img_star:fgui.GImage = child.getChild("img_star" + String(i + 1));
                    img_star.grayed = (i >= level);
                }

                new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                    spp.setGray(!record);
                }, loader_spine_main, goldItem.spineName);
            } else {
                loader_spine_main.freeSpine();
                redpoint = false;
            }
            child.getController("c1").selectedIndex = goldItem ? 0 : 1;
            PointRedData.getInstance().updateManualPoint(child, redpoint);

            child.clearClick();
            child.onClick(() => {
                if (goldItem) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGoldFingerLevel, 0, {goldItem:goldItem});
                }
            })
        }
        // 列表
        let list_golds:fgui.GList = group_main.getChild("list_golds");
        list_golds.setVirtual();
        list_golds.itemRenderer = (index:number, child:fgui.GComponent) => {
            doSetItemData(this.goldItems[index * 2], child.getChild("group_item1"));
            doSetItemData(this.goldItems[index * 2 + 1], child.getChild("group_item2"));
        }
    }

    private updateListGold(): void {
        if (this.isInitPageGolds) {
            let list_golds:fgui.GList = this.getUiPanel().getChild("group_golds", fgui.GComponent).getChild("list_golds");
            UtilsUI.setFguiGlistDelayNumItems(list_golds, this.items_len);
        }
    }

    private initPageMain():void {
        if (!this.isInitPageMain) {
            this.isInitPageMain = true;
        } else {
            return;
        }

        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let label_title = group_main.getChild("label_title", fgui.GTextField);
        label_title.text = StrVal.LYGOLDFINGER.STR1;

        let btn_reward = group_main.getChild("btn_reward", fgui.GButton);
        btn_reward.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGoldFingerRate, 0, {goldItem:this.showItem});
        })

        let loader_icon = group_main.getChild("loader_icon", fgui.GLoader);
        loader_icon.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGoldFingerLevel, 0, {goldItem:this.showItem});
        })

        // let label_time = group_main.getChild("label_time", fgui.GTextField);
        // label_time.text = StrVal.LYGOLDFINGER.STR2;

        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
        }, group_main.getChild("loader_spine_bj", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_fabaochouqu_bj);
        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
        }, group_main.getChild("loader_spine_frame", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_fabaochouqu);
        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
        }, group_main.getChild("loader_spine_star", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_fabaochouqu_star);

        let label_desc1 = group_main.getChild("label_desc1", fgui.GTextField);
        label_desc1.text = StrVal.LYGOLDFINGER.STR3;

        let label_desc2 = group_main.getChild("label_desc2", fgui.GTextField);
        label_desc2.text = StrVal.LYGOLDFINGER.STR5;

        let loader_icon1 = group_main.getChild("loader_icon1", fgui.GLoader);
        loader_icon1.url = UtilsUI.getItemIconUrl(this.goldRoot.raffleId);
        let loader_icon5 = group_main.getChild("loader_icon5", fgui.GLoader);
        loader_icon5.url = loader_icon1.url;

        let dopumpGoldFinger = (num:number) => {
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    UtilsUI.loadSpineEffAndShow(group_main.getChild("loader_spine_exp"), VarVal.UI_EFF.loader_spine_exp, false);
                    this.refreshState2();
                    if (args.bonusesArr) {
                        UtilsUI.showItemReward({bonuseString:GameServerData.getInstance().bonusesResultsToString(args.bonusesArr)});
                    }
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                    if (this.itemCount < num) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.goldRoot.raffleId, "1"), buyCall:() => {
                            this.refreshState();
                        }});
                    }
                }
            }, "pumpGoldFinger", {
                count:num
            });
        }

        let btn_pump1 = group_main.getChild("btn_pump1", fgui.GButton);
        btn_pump1.text = UtilsTool.stringFormat(StrVal.LYGOLDFINGER.STR6, [LyGoldFinger.PUMP_ONCE]);
        btn_pump1.onClick(() => {
            dopumpGoldFinger(LyGoldFinger.PUMP_ONCE);
        })

        let btn_pump5 = group_main.getChild("btn_pump5", fgui.GButton);
        btn_pump5.text = UtilsTool.stringFormat(StrVal.LYGOLDFINGER.STR6, [LyGoldFinger.PUMP_MULT]);
        btn_pump5.onClick(() => {
            dopumpGoldFinger(LyGoldFinger.PUMP_MULT);
        })

        this.refreshState();
        this.refreshState2();
        this.registerRequest((args) => {
            this.refreshState();
            this.updateListGold();
        }, "goldFingerChanged");
        this.registerRequest((args) => {
            this.refreshState2();
        }, "itemInserts");
    }

    private refreshState():void {
        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        let currItem:any;
        let goldItem = LyGoldFinger.getGoldFingerPumpItem();
        if (goldItem) {
            currItem = goldItem;
        } else {
            let goldItems = LocaleData.getGoldFingerItems();
            currItem = goldItems[goldItems.length - 1];
        }
        group_main.getController("c1").selectedIndex = goldItem ? 0 : 1;

        if (this.showItem && ((this.showItem.id != currItem.id) || (!this.isLastDone && !goldItem))) {
            ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyGoldFingerSucc, 0, {goldItem:this.showItem});
        }
        this.showItem = currItem;
        this.isLastDone = (!goldItem);

        let loader_name = group_main.getChild("loader_name", fgui.GLoader);
        loader_name.url = UtilsTool.stringFormat("ui://LyGoldFinger/{0}_2", [this.showItem.iconName]);

        let label_right = group_main.getChild("label_right", fgui.GTextField);
        label_right.text = this.showItem.tip;

        if (this.showItem.spineName != this.lastSpineName) {
            this.lastSpineName = this.showItem.spineName;
            new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            }, group_main.getChild("loader_spine_main", fgui.GLoader3D), this.lastSpineName);
        }

        let goldInfo = GameServerData.getInstance().getGoldFingerInfo();
        let bar_progress = group_main.getChild("bar_progress", fgui.GProgressBar);
        bar_progress.min = 0;
        bar_progress.value = goldInfo.score;
        bar_progress.max = Number(this.showItem.max);
        bar_progress.getChild("label_title", fgui.GTextField).text = UtilsTool.stringFormat(StrVal.LYGOLDFINGER.STR4, [bar_progress.value, bar_progress.max]);
    }

    private refreshState2():void {
        let uiPanel:fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");

        this.itemCount = GameServerData.getInstance().getItemCountByProtoId(this.goldRoot.raffleId);

        let label_need1 = group_main.getChild("label_need1", fgui.GTextField);
        label_need1.text = UtilsTool.stringFormat("{0}/{1}", [this.itemCount, LyGoldFinger.PUMP_ONCE]);
        label_need1.color = UtilsUI.getEnoughColor(this.itemCount >= LyGoldFinger.PUMP_ONCE, 3);

        let label_need5 = group_main.getChild("label_need5", fgui.GTextField);
        label_need5.text = UtilsTool.stringFormat("{0}/{1}", [this.itemCount, LyGoldFinger.PUMP_MULT]);
        label_need5.color = UtilsUI.getEnoughColor(this.itemCount >= LyGoldFinger.PUMP_MULT, 3);

        let btn_pump1 = group_main.getChild("btn_pump1", fgui.GButton);
        PointRedData.getInstance().updateManualPoint(btn_pump1, this.itemCount >= LyGoldFinger.PUMP_ONCE);
        let btn_pump5 = group_main.getChild("btn_pump5", fgui.GButton);
        PointRedData.getInstance().updateManualPoint(btn_pump5, this.itemCount >= LyGoldFinger.PUMP_MULT);
    }

    // 获得当前抽取的宝物
    private static getGoldFingerPumpItem():any {
        let goldItems = LocaleData.getGoldFingerItems();
        for (let i = 0; i < goldItems.length; i++) {
            let record = GameServerData.getInstance().getGoldFingerRecord(goldItems[i].id);
            if (!record) {
                return goldItems[i];
            }
        }
    }

    public static isViewRedPointPump(isMult:boolean):boolean {
        let goldItem = LyGoldFinger.getGoldFingerPumpItem();
        if (goldItem) {
            let goldRoot = LocaleData.getGoldFingerRoot();
            let itemCount = GameServerData.getInstance().getItemCountByProtoId(goldRoot.raffleId);
            if (isMult) {
                return itemCount >= LyGoldFinger.PUMP_MULT;
            } else {
                return itemCount >= LyGoldFinger.PUMP_ONCE;
            }
        }
        return false;
    }
}