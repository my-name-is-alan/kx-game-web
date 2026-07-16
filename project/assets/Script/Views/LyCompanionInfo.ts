//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { Vec2 } from "cc";
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { LocaleUser } from "../Kernel/LocaleUser";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyCompanion } from "./LyCompanion";
import { LyCompanionBattle } from "./LyCompanionBattle";
import { LyCompanionLevel } from "./LyCompanionLevel";
import { LyCompanionLiking } from "./LyCompanionLiking";
import { LyCompanionLock } from "./LyCompanionLock";
import { LyCompanionSkin } from "./LyCompanionSkin";
import { LyGuideGetItem } from "./LyGuideGetItem";
import { LyItemTips } from "./LyItemTips";

export class LyCompanionInfo extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyCompanion";
        this.viewResI.pkgName = "LyCompanion";
        this.viewResI.comName = "LyCompanionInfo";
    }
    private uiPanel: fgui.GComponent
    private companionInfo: any
    private companionXml: any
    private companionId: number
    private companionSkins: any
    private companion: any
    private list_likingProp: fgui.GList
    private btn_battle: fgui.GButton
    public onViewCreate(params): void {
        this.companionId = params.companionId
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyCompanion, 0, null);
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCompanionInfo, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            // ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyCompanion, 0, null);
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCompanionInfo, 0, null);
        })
        this.uiPanel.getChild("label_bxl", fgui.GLabel).text = StrVal.LYCOMPANION.STR13
        let btn_isTen: fgui.GButton = this.uiPanel.getChild("btn_isTen")
        btn_isTen.selected = LocaleUser.getUser(VarVal.FIELD_SV.COMPANION_LIKING) == "1"
        btn_isTen.onClick(() => {
            LocaleUser.setUser(VarVal.FIELD_SV.COMPANION_LIKING, btn_isTen.selected ? "1" : "0");
            LocaleUser.flush()
        })
        btn_isTen.getChild("title").text = StrVal.LYCOMPANION.STR20
        let btn_likingdDtails: fgui.GButton = this.uiPanel.getChild("btn_likingdDtails")
        btn_likingdDtails.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCompanionLiking, 0, { companionInfo: this.companionInfo });
        })
        let label_likingUp: fgui.GLabel = this.uiPanel.getChild("label_likingUp")
        let label_likingStage: fgui.GLabel = this.uiPanel.getChild("label_likingStage")
        let t0: fgui.Transition = this.uiPanel.getTransition("t0")
        let t1: fgui.Transition = this.uiPanel.getTransition("t1")
        let btn_increaseCompanionLiking: fgui.GButton = this.uiPanel.getChild("btn_increaseCompanionLiking")
        btn_increaseCompanionLiking.text = StrVal.LYCOMPANION.STR23
        btn_increaseCompanionLiking.onClick(() => {
            if (this.selectPropId) {
                let itemNum = GameServerData.getInstance().getItemCountByProtoId(this.selectPropId)
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyCompanion, 0, null);
                        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                            spp.playAnimation("stand", false);
                        }, this.uiPanel.getChild("loader_spine_level"), "jm_shouyou_xin")
                        UtilsUI.loadSpineEffAndShow(this.uiPanel.getChild("loader_spine_exp"), VarVal.UI_EFF.loader_spine_exp, false);
                        if (this.companionInfo.phase != args.companion.phase) {
                            let likingData = LocaleData.getCompanionLikingByPhase(this.companionInfo.phase + 1)//s
                            label_likingStage.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR1, [likingData.likingLevel])
                            // t1.play()
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCompanionLevel, 0, { companionInfo: args.companion });
                        } else {
                            let likingValue = LocaleData.getCompanionlikingValueByItemId(this.selectPropId)
                            label_likingUp.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR28, [args.itemRemoves[0].count * Number(likingValue.value)])
                            t0.play()
                        }
                        this.companionInfo = args.companion
                        this.onCompanionInfo()
                    } else {
                        if (itemNum > 0) {
                        } else {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {
                                bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, String(this.selectPropId), "1"), buyCall: () => {
                                }
                            });
                        }
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "increaseCompanionLiking", {
                    companionId: this.companionInfo.companionId,
                    itemId: Number(this.selectPropId),
                    count: btn_isTen.selected ? 10 : 1
                })
            }
        })
        this.btn_battle = this.uiPanel.getChild("btn_battle")
        this.btn_battle.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCompanionBattle, 0, { companionInfo: this.companionInfo });
        })
        let btn_skin: fgui.GButton = this.uiPanel.getChild("btn_skin")
        btn_skin.onClick(() => {
            UtilsUI.showMsgTip(StrVal.LYCOMPANION.STR53)
            return
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCompanionSkin, 0, { companionId: this.companionInfo.companionId });
        })
        let btn_left: fgui.GButton = this.uiPanel.getChild("btn_left")

        btn_left.onClick(() => {
            let selectIndex: number = 0
            for (let i = 0; i < this.allArr.length; i++) {
                if (this.allArr[i].companionId == this.companionId) {
                    selectIndex = i
                }
            }
            selectIndex += 1
            selectIndex = selectIndex >= this.allArr.length ? 0 : selectIndex
            this.companionInfo = this.allArr[selectIndex]
            this.companionId = this.companionInfo.companionId
            this.companion = LocaleData.getCompanionById(this.companionInfo.companionId)
            this.companionXml = this.companion
            let loader_spine: fgui.GLoader3D = this.uiPanel.getChild("loader_spine")
            new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            }, loader_spine, this.companionXml.modelId);

            this.onCompanionInfo()
        })
        let btn_right: fgui.GButton = this.uiPanel.getChild("btn_right")
        btn_right.onClick(() => {
            let selectIndex: number = 0
            for (let i = 0; i < this.allArr.length; i++) {
                if (this.allArr[i].companionId == this.companionId) {
                    selectIndex = i
                }
            }
            selectIndex -= 1
            selectIndex = selectIndex < 0 ? this.allArr.length - 1 : selectIndex
            this.companionInfo = this.allArr[selectIndex]
            this.companionId = this.companionInfo.companionId
            this.companion = LocaleData.getCompanionById(this.companionInfo.companionId)
            this.companionXml = this.companion
            let loader_spine: fgui.GLoader3D = this.uiPanel.getChild("loader_spine")
            new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            }, loader_spine, this.companionXml.modelId);
            this.onCompanionInfo()
        })
        this.onGetCompanionInfo()
        if (this.list_likingProp) {
            this.list_likingProp.selectedIndex = 0
            let likingStr = this.companionXml.likingItemId.split(",")
            this.selectPropId = likingStr[0]
        }
        let label_str19: fgui.GLabel = this.uiPanel.getChild("label_str19")
        label_str19.text = StrVal.LYCOMPANION.STR19
        let label_str29: fgui.GLabel = this.uiPanel.getChild("label_str29")
        label_str29.text = StrVal.LYCOMPANION.STR20
    };
    private allArr: any = []
    public onGetCompanionInfo(): void {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let companionData = fullInfo.companionData
        //         this.allArr = []
        //         companionData.companionCounter.forEach(item => {
        //             let item1 = item
        //             item1.companionId = item1.id
        //             this.allArr.push(item1)
        //         });
        //         companionData.companions.forEach(item => {
        //             this.allArr.push(item)
        //         });
        // s

        companionData.companions.sort((instA, instB) => {
            let companion1: any = LocaleData.getCompanionById(instA.companionId)
            let companion2: any = LocaleData.getCompanionById(instB.companionId)
            return Number(companion1.quality) - Number(companion2.quality);
        })
        let companionCounter1 = [] //可解锁
        let companionCounter2 = [] //不可解锁
        for (let i = 0; i < companionData.companionCounter.length; i++) {
            let item = companionData.companionCounter[i]
            if (item.nowValue < item.targetValue && item.targetValue) {
                companionCounter2.push(item)
            } else {
                companionCounter1.push(item)
            }
        }
        companionCounter1.sort((instA, instB) => {
            let companion1: any = LocaleData.getCompanionById(instA.id)
            let companion2: any = LocaleData.getCompanionById(instB.id)
            return Number(companion1.quality) - Number(companion2.quality);
        })
        companionCounter2.sort((instA, instB) => {
            let companion1: any = LocaleData.getCompanionById(instA.id)
            let companion2: any = LocaleData.getCompanionById(instB.id)
            return Number(companion1.quality) - Number(companion2.quality);
        })
        companionData.companions.forEach(item => {
            this.allArr.push(item)
        });
        companionCounter1.forEach(item => {
            let item1 = item
            item1.companionId = item1.id
            this.allArr.push(item1)
        });
        companionCounter2.forEach(item => {
            let item1 = item
            item1.companionId = item1.id
            this.allArr.push(item1)
        });
        for (let i = 0; i < this.allArr.length; i++) {
            if (this.allArr[i].companionId == this.companionId) {
                this.companionInfo = this.allArr[i]
            }
        }
        this.companion = LocaleData.getCompanionById(this.companionInfo.companionId)
        this.companionXml = this.companion
        this.companionSkins = companionData.companionSkins
        let loader_spine: fgui.GLoader3D = this.uiPanel.getChild("loader_spine")
        new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }, loader_spine, this.companionXml.modelId);
        this.onCompanionInfo()
    }
    private selectPropId: number
    public onCompanionInfo(): void {
        let c1: fgui.Controller = this.uiPanel.getController("c1")
        let label_liking: fgui.GLabel = this.uiPanel.getChild("label_liking")
        let bar_liking: fgui.GProgressBar = this.uiPanel.getChild("bar_liking")
        let img_quality: fgui.GLoader = this.uiPanel.getChild("img_quality")
        img_quality.url = UtilsTool.stringFormat("ui://CCommon/frame_name{0}", [this.companionXml.quality]);
        let label_name: fgui.GLabel = this.uiPanel.getChild("label_name")
        label_name.text = UtilsTool.stringFormat("[color={0}]{1}[/color]", [UtilsUI.getQualityColor1(this.companionXml.quality), this.companionXml.name]);
        let label_upAttr: fgui.GLabel = this.uiPanel.getChild("label_upAttr")
        let label_likingDec: fgui.GLabel = this.uiPanel.getChild("label_likingDec")
        let label_mainAttr: fgui.GLabel = this.uiPanel.getChild("label_mainAttr")
        let label_sideAttr: fgui.GLabel = this.uiPanel.getChild("label_sideAttr")
        let likingData = LocaleData.getCompanionById(this.companionId)
        if (this.companionInfo.counterKey || this.companionInfo.counterKey == "") {//未解锁
            let counterArr = LocaleData.getCounterByKey(this.companionInfo.counterKey)
            if (counterArr) {
                if (counterArr.type == 3) {
                    c1.selectedIndex = 2
                    let label_number: fgui.GTextField = this.uiPanel.getChild("group_number", fgui.GComponent).getChild("label_number")
                    label_number.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR12, [this.companionInfo.nowValue, this.companionInfo.targetValue])
                    label_number.color = UtilsUI.getEnoughColor(this.companionInfo.nowValue >= this.companionInfo.targetValue);
                    let url = LocaleData.getItemProto(counterArr.ext).icon
                    let img_itemIcon: fgui.GLoader = this.uiPanel.getChild("group_number", fgui.GComponent).getChild("img_itemIcon")
                    img_itemIcon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [url]);
                } else {
                    c1.selectedIndex = 1
                }
            } else {
                c1.selectedIndex = 1
            }
            let likingLevel: any = LocaleData.getCompanionLikingLevelByLevel(1)
            bar_liking.value = 0
            bar_liking.max = Number(likingLevel.liking)
            label_liking.text = "0"
            if (likingLevel.attr > 4) {
                label_upAttr.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR3, [LocaleData.getCompanionAttrById(likingLevel.attr).name, likingLevel.value])
            } else {
                label_upAttr.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR52, [LocaleData.getCompanionAttrById(likingLevel.attr).name, likingLevel.value])
            }

            let likingPhase = LocaleData.getCompanionLikingByPhase(1)
            let mainAttrValueStr: string[] = likingData.mainAttrValue.split(",")
            label_likingDec.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR1, [likingPhase.likingLevel])
            label_mainAttr.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR3, [LocaleData.getCompanionAttrById(likingData.mainAttr).name, mainAttrValueStr[0]])
            if (likingData.subAttr == "0") {
                let boostValueStr: string[] = likingData.boostValue.split(",")
                label_sideAttr.text = UtilsTool.stringFormat(LocaleData.getBoostById(likingData.boostId).desc, [boostValueStr[0]])
            } else {
                let subAttrValueStr: string[] = likingData.subAttrValue.split(",")
                label_sideAttr.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR3, [LocaleData.getCompanionAttrById(likingData.subAttr).name, subAttrValueStr[0]])
            }
            let label_lockDec: fgui.GLabel = this.uiPanel.getChild("label_lockDec", fgui.GComponent).getChild("label_lockDec")
            let label_lockNum: fgui.GTextField = this.uiPanel.getChild("label_lockDec", fgui.GComponent).getChild("label_lockNum")
            let btn_lock: fgui.GButton = this.uiPanel.getChild("btn_lock")
            btn_lock.text = StrVal.LYCOMPANION.STR15
            let btn_lock1: fgui.GButton = this.uiPanel.getChild("btn_lock1")
            btn_lock1.text = StrVal.LYCOMPANION.STR51
            let counter: any = LocaleData.getCounterByKey(this.companionXml.unlockCounterKey)
            label_lockDec.text = UtilsTool.stringFormat(this.companionXml.unlockDesc, [this.companionInfo.targetValue])
            if (this.companionInfo.targetValue) {
                if (this.companionInfo.counterKey == "monsterKingStage") {
                    label_lockNum.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR31, [this.companionInfo.nowValue >= this.companionInfo.targetValue ? 1 : 0, 1])
                    label_lockNum.color = UtilsUI.getEnoughColor(this.companionInfo.nowValue >= this.companionInfo.targetValue);
                } else {
                    label_lockNum.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR31, [this.companionInfo.nowValue > this.companionInfo.targetValue ? this.companionInfo.targetValue : this.companionInfo.nowValue, this.companionInfo.targetValue])
                    label_lockNum.color = UtilsUI.getEnoughColor(this.companionInfo.nowValue >= this.companionInfo.targetValue);
                }
                label_lockNum.visible = true
                btn_lock.enabled = this.companionInfo.nowValue >= this.companionInfo.targetValue
            } else {
                btn_lock.enabled = true
                label_lockNum.visible = false
            }
            // btn_lock1.enabled = this.companionInfo.nowValue >= this.companionInfo.targetValue
            btn_lock.clearClick()
            btn_lock.onClick(() => {
                if (this.companionInfo.targetValue && this.companionInfo.nowValue < this.companionInfo.targetValue) {
                } else {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyCompanion, 0, null);
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCompanionLock, 0, { companionInfo: this.companionInfo });
                            if (this.list_likingProp) {
                                this.list_likingProp.selectedIndex = 0
                                let likingStr = this.companionXml.likingItemId.split(",")
                                this.selectPropId = likingStr[0]
                            }
                            this.onGetCompanionInfo()
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    }, "unlockCompanion", { companionId: this.companionInfo.companionId })
                }
            })
            btn_lock1.clearClick()
            btn_lock1.onClick(() => {
                if (this.companionInfo.nowValue >= this.companionInfo.targetValue) {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCompanionLock, 0, { companionInfo: this.companionInfo });
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyCompanion, 0, null);
                            if (this.list_likingProp) {
                                this.list_likingProp.selectedIndex = 0
                                let likingStr = this.companionXml.likingItemId.split(",")
                                this.selectPropId = likingStr[0]
                            }
                            this.onGetCompanionInfo()
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    }, "unlockCompanion", { companionId: this.companionInfo.companionId })
                } else {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {
                        bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, String(counterArr.ext), "1"), buyCall: () => {
                        }
                    });
                }
            })
        } else { // 已解锁
            c1.selectedIndex = 0
            let likingLevel: any = LocaleData.getCompanionLikingLevelByLevel(this.companionInfo.level + 1)
            if (likingLevel && likingLevel.liking) {
            } else {
                likingLevel = LocaleData.getCompanionLikingLevelByLevel(this.companionInfo.level)
            }
            // let companionDuel = LocaleData.getCompanionDuelByPlayer(GameServerData.getInstance().getPlayerFullInfo().base.level, this.companionInfo.liking, this.companionInfo.companionId)
            // let isRed: boolean = companionDuel.phase > this.companionInfo.duelPhase
            PointRedData.getInstance().registerPoint(this.btn_battle, PointRedType.LyCompanionBattle);
            bar_liking.value = this.companionInfo.liking
            bar_liking.max = Number(likingLevel.liking)
            label_liking.text = this.companionInfo.level
            let likingLevelArr: any = this.getCompanionData(likingLevel.attr, this.companionXml.id)
            if (likingLevel.attr > 4) {
                label_upAttr.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR3, [LocaleData.getCompanionAttrById(likingLevel.attr).name, likingLevel.value])
            } else {
                label_upAttr.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR52, [LocaleData.getCompanionAttrById(likingLevel.attr).name, likingLevel.value])
            }
            let likingPhase = LocaleData.getCompanionLikingByPhase(this.companionInfo.phase + 1)//
            let mainAttrValueStr: string[] = likingData.mainAttrValue.split(",")
            label_mainAttr.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR3, [LocaleData.getCompanionAttrById(likingData.mainAttr).name, mainAttrValueStr[this.companionInfo.phase]])
            label_likingDec.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR1, [likingPhase.likingLevel])
            if (likingData.subAttr == "0") {
                let boostValueStr: string[] = likingData.boostValue.split(",")
                label_sideAttr.text = UtilsTool.stringFormat(LocaleData.getBoostById(likingData.boostId).desc, [boostValueStr[this.companionInfo.phase]])
            } else {
                let subAttrValueStr: string[] = likingData.subAttrValue.split(",")
                label_sideAttr.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR3, [LocaleData.getCompanionAttrById(likingData.subAttr).name, subAttrValueStr[this.companionInfo.phase]])
            }
            this.onListLikingProp()
        }
    };
    private onListLikingProp(): void {
        this.list_likingProp = this.uiPanel.getChild("list_likingProp")
        this.list_likingProp.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let likingStr = this.companionXml.likingItemId.split(",")
            let itemNum = GameServerData.getInstance().getItemCountByProtoId(likingStr[index])
            let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, likingStr[index], itemNum.toString());
            UtilsUI.setUIGroupItem(bonuseItem, obj, () => {
                this.selectPropId = likingStr[index]
            });
            // obj.grayed = itemNum > 0
            if (itemNum > 0) {
                obj.alpha = 1
            } else {
                obj.alpha = 0.5
            }
            let btn_select = obj.getChild("btn_select")
            btn_select.clearClick()
            btn_select.onClick(() => {
                if (this.selectPropId == likingStr[index]) {
                    let itemNum = GameServerData.getInstance().getItemCountByProtoId(likingStr[index])
                    let bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, likingStr[index], itemNum.toString());
                    let _params = {
                        bonuseItem: bonuseItem,
                        pos: obj.localToGlobal(0, 0),
                        size: new Vec2(obj.width, obj.height)
                    }
                    ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyItemTips, 0, _params);
                }

            })
        }).bind(this)
        this.list_likingProp.numItems = this.companionXml.likingItemId.split(",").length
    }

    public getCompanionData(attr: string, id: string): string[] {
        let attrArr: string[] = attr.split("|")
        for (let i = 0; i < attrArr.length; i++) {
            let item: string = attrArr[i]
            if (item.split(":")[0] == id) {
                return item.split(":")
            }
        }
    }
    public onViewShowFront(): void {
        this.onListLikingProp()
    }
    public getIsViewMask(): boolean {
        return false;
    };

}