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
import { LyClanSoloPassportGift } from "./LyClanSoloPassportGift";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanSoloPassport extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClanSolo";
        this.viewResI.pkgName = "LyClanSolo";
        this.viewResI.comName = "LyClanSoloPassport";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloPassport, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloPassport, 0, null);
        })
        this.uiPanel.getChild("str16", fgui.GLabel).text = StrVal.LYCLANSOLO.STR16
        this.uiPanel.getChild("str17", fgui.GLabel).text = StrVal.LYCLANSOLO.STR17
        this.uiPanel.getChild("str18", fgui.GLabel).text = StrVal.LYCLANSOLO.STR18
        this.uiPanel.getChild("str19", fgui.GLabel).text = StrVal.LYCLANSOLO.STR19
        this.registerRequest((args) => {
            this.initialize()
        }, "onClanSoloPayPassport");
        // this.uiPanel.getChild("str20", fgui.GLabel).text = StrVal.LYCLANSOLO.STR20
        this.initialize()
    };

    private initialize(): void {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let clanSoloPlayer: any = fullInfo.clanSoloPlayer
        let clanSoloMyselfInfo: any = clanSoloPlayer.clanSoloMyselfInfo
        let clanSoloInfo: any = clanSoloPlayer.clanSoloInfo
        let passportXml = LocaleData.getClanSoloPassport()
        let label_winCount: fgui.GLabel = this.uiPanel.getChild("label_winCount")
        label_winCount.text = clanSoloMyselfInfo.winCount

        let label_level: fgui.GLabel = this.uiPanel.getChild("label_level")
        label_level.text = clanSoloMyselfInfo.passportLevel >= passportXml.length ? StrVal.LYCLANSOLO.STR82 : UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR60, [clanSoloMyselfInfo.winCount % 6, 6])
        let bar_level: fgui.GProgressBar = this.uiPanel.getChild("bar_level")
        bar_level.getChild("title").visible = false
        bar_level.value = clanSoloMyselfInfo.winCount % 6
        bar_level.max = 6
        let btn_midItem: fgui.GButton = this.uiPanel.getChild("btn_midItem");
        btn_midItem.clearClick()
        btn_midItem.onClick(() => {
            if (clanSoloMyselfInfo.passport == 0 || clanSoloMyselfInfo.passport == 2) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloPassportGift, 0, { type: 1 });
            }
        })
        let btn_highItem: fgui.GButton = this.uiPanel.getChild("btn_highItem");
        btn_highItem.clearClick()
        btn_highItem.onClick(() => {
            if (clanSoloMyselfInfo.passport == 0 || clanSoloMyselfInfo.passport == 1) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloPassportGift, 0, { type: 2 });
            }
        })

        let list_passport: fgui.GList = this.uiPanel.getChild("list_passport")
        list_passport.itemRenderer = (index: number, child: fgui.GComponent) => {
            let data = passportXml[index];
            let label_target: fgui.GLabel = child.getChild("label_target")
            let group_gray: fgui.GGraph = child.getChild("group_gray")
            let img_gray1: fgui.GGraph = child.getChild("img_gray1")
            let img_gray2: fgui.GGraph = child.getChild("img_gray2")
            let group_yellow: fgui.GGraph = child.getChild("group_yellow")
            let img_yellow1: fgui.GGraph = child.getChild("img_yellow1")
            let img_yellow2: fgui.GGraph = child.getChild("img_yellow2")

            let group_lowItem: fgui.GComponent = child.getChild("group_lowItem")
            let group_midItem: fgui.GComponent = child.getChild("group_midItem")
            let group_highItem: fgui.GComponent = child.getChild("group_highItem")
            let group_highItem2: fgui.GComponent = child.getChild("group_highItem2")

            let group_midLock: fgui.GGroup = child.getChild("group_midLock")
            let group_highLock: fgui.GGroup = child.getChild("group_highLock")

            label_target.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR15, [data.level])
            if (index == 0) {
                img_gray1.visible = false
                img_yellow1.visible = false
            }
            if (index == passportXml.length - 1) {
                img_gray2.visible = false
                img_yellow2.visible = false
            }
            let lowBonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, data.lowItemId, data.lowItemCount)
            let midBonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, data.midItemId, data.midItemCount)
            let highBonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, data.highItemId, data.highItemCount)
            let highBonuseItem2 = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, data.highItemId2, data.highItemCount2)
            UtilsUI.setUIGroupItem(lowBonuseItem, group_lowItem, null);
            UtilsUI.setUIGroupItem(midBonuseItem, group_midItem, null);
            UtilsUI.setUIGroupItem(highBonuseItem, group_highItem, null);
            UtilsUI.setUIGroupItem(highBonuseItem2, group_highItem2, null);
            group_midLock.visible = false
            group_highLock.visible = false
            if (clanSoloMyselfInfo.passport == 0 || clanSoloMyselfInfo.passport == 2) {
                group_midLock.visible = true
            }
            if (clanSoloMyselfInfo.passport == 0 || clanSoloMyselfInfo.passport == 1) {
                group_highLock.visible = true
            }
            if (clanSoloMyselfInfo.passportLevel < index + 1) {
                group_yellow.visible = false
                group_lowItem.getChild("img_dark").visible = true
                group_lowItem.getChild("img_lock").visible = true

                group_midItem.getChild("img_dark").visible = true
                group_midItem.getChild("img_lock").visible = true

                group_highItem.getChild("img_dark").visible = true
                group_highItem.getChild("img_lock").visible = true

                group_highItem2.getChild("img_dark").visible = true
                group_highItem2.getChild("img_lock").visible = true

            } else {
                group_yellow.visible = true
                group_lowItem.getChild("img_dark").visible = false
                group_lowItem.getChild("img_lock").visible = false

                if (clanSoloMyselfInfo.passport == 1 || clanSoloMyselfInfo.passport == 3) {
                    group_midItem.getChild("img_dark").visible = false
                    group_midItem.getChild("img_lock").visible = false
                } else {
                    group_midItem.getChild("img_dark").visible = true
                    group_midItem.getChild("img_lock").visible = true
                }
                if (clanSoloMyselfInfo.passport == 2 || clanSoloMyselfInfo.passport == 3) {
                    group_highItem.getChild("img_dark").visible = false
                    group_highItem.getChild("img_lock").visible = false

                    group_highItem2.getChild("img_dark").visible = false
                    group_highItem2.getChild("img_lock").visible = false
                } else {
                    group_highItem.getChild("img_dark").visible = true
                    group_highItem.getChild("img_lock").visible = true

                    group_highItem2.getChild("img_dark").visible = true
                    group_highItem2.getChild("img_lock").visible = true
                }
                if (clanSoloMyselfInfo.lowPassportClaimedLevel > index) {
                    group_lowItem.getChild("img_dark").visible = true
                    group_lowItem.getChild("img_check").visible = true
                }
                if (clanSoloMyselfInfo.midPassportClaimedLevel > index) {
                    group_midItem.getChild("img_dark").visible = true
                    group_midItem.getChild("img_check").visible = true
                }
                if (clanSoloMyselfInfo.highPassportClaimedLevel > index) {
                    group_highItem.getChild("img_dark").visible = true
                    group_highItem.getChild("img_check").visible = true

                    group_highItem2.getChild("img_dark").visible = true
                    group_highItem2.getChild("img_check").visible = true
                }
            }
            let ani_lowItem: fgui.Transition = child.getTransition("ani_lowItem")
            let ani_midItem: fgui.Transition = child.getTransition("ani_midItem")
            let ani_highItem: fgui.Transition = child.getTransition("ani_highItem")

            let group_lowGet = child.getChild("group_lowGet")
            let group_midGet = child.getChild("group_midGet")
            let group_highGet = child.getChild("group_highGet")
            group_lowGet.visible = false
            group_midGet.visible = false
            group_highGet.visible = false
            if (group_lowItem.getChild("img_dark").visible) {
                ani_lowItem.stop()
            } else {
                if (!ani_lowItem.playing) {
                    ani_lowItem.play(null, -1)
                }
                group_lowGet.visible = true
            }
            if (group_midItem.getChild("img_dark").visible) {
                ani_midItem.stop()
            } else {
                if (!ani_midItem.playing) {
                    ani_midItem.play(null, -1)
                }
                group_midGet.visible = true
            }
            if (group_highItem.getChild("img_dark").visible) {
                ani_highItem.stop()
            } else {
                if (!ani_highItem.playing) {
                    ani_highItem.play(null, -1)
                }
                group_highGet.visible = true
            }

            group_lowGet.clearClick()
            group_lowGet.onClick(() => {
                this.onClanSoloClaimPassportReward()
            })
            group_midGet.clearClick()
            group_midGet.onClick(() => {
                this.onClanSoloClaimPassportReward()
            })
            group_highGet.clearClick()
            group_highGet.onClick(() => {
                this.onClanSoloClaimPassportReward()
            })


            // group_lowItem.clearClick()
            // group_lowItem.onClick(() => {
            //     if (!group_lowItem.getChild("img_dark").visible) {
            //         //已经解锁
            //         this.onClanSoloClaimPassportReward()
            //     }
            // })
            // group_midItem.clearClick()
            // group_midItem.onClick(() => {
            //     if (!group_midItem.getChild("img_dark").visible) {
            //         //已经解锁
            //         this.onClanSoloClaimPassportReward()
            //     }
            // })
            // group_highItem.clearClick()
            // group_highItem.onClick(() => {
            //     if (!group_highItem.getChild("img_dark")) {
            //         //已经解锁
            //         this.onClanSoloClaimPassportReward()
            //     }
            // })
            // group_highItem2.clearClick()
            // group_highItem2.onClick(() => {
            //     if (!group_highItem2.getChild("img_dark").visible) {
            //         //已经解锁
            //         this.onClanSoloClaimPassportReward()
            //     }
            // })





            group_midLock.clearClick()
            group_midLock.onClick(() => {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloPassportGift, 0, { type: 1 });
            })
            group_highLock.clearClick()
            group_highLock.onClick(() => {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyClanSoloPassportGift, 0, { type: 2 });
            })
            // let label_des: fgui.GLabel = child.getChild("label_des")
            // let label_day: fgui.GLabel = child.getChild("label_day")
            // let list_item: fgui.GList = child.getChild("list_item")
            // let btn_go: fgui.GButton = child.getChild("btn_go")
            // label_des.text = data.name
            // label_day.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR14, data.dailyLimit)
            // // btn_go.
            // if (data.currencyType == "1") {
            //     btn_go.text = data.price
            //     // btn_go.getChild("loader_icon", fgui.GLoader).url = ""
            // } else if (data.currencyType == "2") {
            //     // btn_go.getChild("loader_icon", fgui.GLoader).url = ""
            //     btn_go.text = "￥" + data.price
            // }

            // let bonuseItems: Array<BonuseItem> = UtilsUI.getBonuseItemsByBonusesId(data.bonusesId);
            // list_item.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
            //     UtilsUI.setUIGroupItem(bonuseItems[index1], obj1, null);
            // }).bind(this)
            // list_item.numItems = bonuseItems.length
        }
        list_passport.numItems = passportXml.length
        let label_time: fgui.GLabel = this.uiPanel.getChild("label_time")

        this.onTime(label_time, clanSoloInfo.endTime)
    }
    // endTime
    private onTime1 = null
    private onTime(label_txt: fgui.GLabel, nextStateTime: number): void {
        let serverTime = GameServerData.getInstance().getServerTime()
        let time = nextStateTime - serverTime
        label_txt.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR96, [UtilsTool.parseTimeToString(time)])
        if (this.onTime1 == null) {
            let timeCall = () => {
                time--
                label_txt.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR96, [UtilsTool.parseTimeToString(time)])
            }
            this.onTime1 = this.setInterval(timeCall, 1000);
            timeCall()
        }
    }

    private onClanSoloClaimPassportReward(): void {
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                this.initialize()
                UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([{ inserts: args.itemInserts }]) });
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        }, "clanSoloClaimPassportReward", {
        })
    }
    public static isViewRedPointPassport(): boolean {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let clanSoloPlayer: any = fullInfo.clanSoloPlayer
        if (clanSoloPlayer) {
            let clanSoloMyselfInfo: any = clanSoloPlayer.clanSoloMyselfInfo
            //0：低级 1：中级 2：高级 3：中高级都有
            if (clanSoloMyselfInfo.passportLevel > clanSoloMyselfInfo.lowPassportClaimedLevel) {
                return true
            }
            if (clanSoloMyselfInfo.passport == 0) {
            } else if (clanSoloMyselfInfo.passport == 1) {
                if (clanSoloMyselfInfo.passportLevel > clanSoloMyselfInfo.midPassportClaimedLevel) {
                    return true
                }
            } else if (clanSoloMyselfInfo.passport == 2) {
                if (clanSoloMyselfInfo.passportLevel > clanSoloMyselfInfo.highPassportClaimedLevel) {
                    return true
                }
            } else if (clanSoloMyselfInfo.passport == 3) {
                if (clanSoloMyselfInfo.passportLevel > clanSoloMyselfInfo.midPassportClaimedLevel) {
                    return true
                }
                if (clanSoloMyselfInfo.passportLevel > clanSoloMyselfInfo.highPassportClaimedLevel) {
                    return true
                }
            }
        }
        return false
    }


    public getIsViewMask(): boolean {
        return false;
    };

}