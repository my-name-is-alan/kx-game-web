//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { FguiGTween } from "../Kernel/FguiGTween";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { LocaleUser } from "../Kernel/LocaleUser";
import { PointRedData } from "../Kernel/PointRedData";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyCompanionInfo } from "./LyCompanionInfo";
import { LyCompanionTravel } from "./LyCompanionTravel";
import { LyCompanionUse, ShopBuy } from "./LyCompanionUse";
import { LyGuideDetail } from "./LyGuideDetail";
import { LyItemRewardExplore } from "./LyItemRewardExplore";
import { AudioManager } from "../Kernel/AudioManager";

export class LyCompanion extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyCompanion";
        this.viewResI.pkgName = "LyCompanion";
        this.viewResI.comName = "LyCompanion";
    }
    private uiPanel: fgui.GComponent
    private list_companion: fgui.GList
    private btn_addExploreStamina: fgui.GButton
    private companionData: any
    private fullInfoBase: any
    public static isSkipPlayAni: boolean;
    public onViewCreate(): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        this.uiPanel = this.getUiPanel().getChild("main")
        if (LyCompanion.isSkipPlayAni) {
            LyCompanion.isSkipPlayAni = false;
        } else {
            UtilsUI.playCommonGroupAni(this.uiPanel);
        }
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCompanion, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCompanion, 0, null);
        })

        this.btn_addExploreStamina = this.uiPanel.getChild("btn_addExploreStamina")
        this.list_companion = this.uiPanel.getChild("list_companion")
        this.list_companion.on(fgui.Event.CLICK_ITEM, (onClickitem: fgui.GButton) => {
            let index = this.list_companion.childIndexToItemIndex(this.list_companion.getChildIndex(onClickitem))
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCompanionInfo, 0, { companionId: this.allArr[index].companionId });
        }, this)

        let companionRoot: any = LocaleData.getCompanionRoot()
        let btn_what: fgui.GButton = this.uiPanel.getChild("btn_what")
        btn_what.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, { title: StrVal.LYCOMPANION.STR54, detail: companionRoot.companionGameplayGuide });
        })
        let btn_what2: fgui.GButton = this.uiPanel.getChild("btn_what2")
        btn_what2.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, { title: StrVal.LYCOMPANION.STR55, detail: companionRoot.exploreGameplayGuide });
        })

        this.fullInfoBase = GameServerData.getInstance().getPlayerFullInfo().base
        let btn_openTen: fgui.GButton = this.uiPanel.getChild("btn_openTen")

        btn_openTen.visible = Number(this.fullInfoBase.level) < Number(companionRoot.tenExplorePlayerLevel)
        btn_openTen.onClick(() => {
            UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYCOMPANION.STR50, [Number(companionRoot.tenExplorePlayerLevel)]))
        })
        let btn_ten: fgui.GButton = this.uiPanel.getChild("btn_ten")
        btn_ten.selected = LocaleUser.getUser(VarVal.FIELD_SV.COMPANION_EXPLORE) == "1"
        btn_ten.getChild("title").text = StrVal.LYCOMPANION.STR6
        btn_ten.onClick(() => {
            LocaleUser.setUser(VarVal.FIELD_SV.COMPANION_EXPLORE, btn_ten.selected ? "1" : "0");
            LocaleUser.flush()
        })
        this.btn_addExploreStamina.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.btn_addExploreStamina.touchable = false
                    // this.companionData.preStaminaRecoverTime = args.preStaminaRecoverTime
                    // this.companionData.stamina = args.stamina
                    this.loadExplore()
                    this.loadCompanion()
                    this.onTravel([args.dropReward], args.encounterCompanion)
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "explore", { ten: btn_ten.selected ? 1 : 0 })
        })
        this.group_placeArr = []
        for (let i = 0; i < 7; i++) {
            let item: fgui.GComponent = this.uiPanel.getChild("group_place" + i)
            item.visible = false
            this.group_placeArr.push(item)
        }
        let explore = LocaleData.getCompanionExplore()
        for (let i = 0; i < explore.length; i++) {
            this.group_placeArr[i].visible = true
            this.group_placeArr[i].clearClick()
            this.group_placeArr[i].onClick(() => {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCompanionTravel, 0, { explore: explore[i] });
            })
            this.group_placeArr[i].getChild("label_name").text = explore[i].placeName
        }
        this.onGetCompanionInfo()
        let label_str16: fgui.GLabel = this.uiPanel.getChild("label_str16")
        label_str16.text = StrVal.LYCOMPANION.STR16
        let charInfo = LocaleData.getCharShowResInfo(this.fullInfoBase.character, this.fullInfoBase.phase, this.fullInfoBase.appearance, this.fullInfoBase.avatar);
        let mount = GameServerData.getInstance().getPlayerFullInfo().mount;
        let mountInfo = LocaleData.getMountShowResInfo(mount.tid, mount.cid);
        // if (mountInfo) {
        //     new SpinePlayer().loadSpine((spp: SpinePlayer) => {
        //         spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        //     }, loader_spine_mount, mountInfo.spine);
        // }
        let group_spine_ram: fgui.GComponent = this.uiPanel.getChild("group_spine_ram")
        new SpineRoldMountPlayer(group_spine_ram).loadSpineRole(charInfo).loadSpineMount(mountInfo);
        // new SpineRoldMountPlayer(group_main.getChild("group_spine_ram")).loadSpineRole(LocaleData.getCharShowResInfoSelf());
        this.group_player = this.uiPanel.getChild("group_player")
        this.group_player.visible = false
        let btn_buy: fgui.GButton = this.uiPanel.getChild("btn_buy")

        let maxStamina: any = LocaleData.getCompanionStaminaByLevel(this.fullInfoBase.level).maxStamina
        btn_buy.onClick(() => {
            let itemNum = GameServerData.getInstance().getItemCountByProtoId(companionRoot.staminaRecoverItemId)
            let maxCount: number = itemNum > (maxStamina - this.companionData.stamina) ? (maxStamina - this.companionData.stamina) : itemNum
            let shopBuy: ShopBuy = {
                costBonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.stone, null, null, "1"),
                bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, companionRoot.staminaRecoverItemId, "1"),
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyCompanionUse, 0, {
                shopBuy: shopBuy, maxCount: maxCount, doneCall: (buyCount: number) => {
                    if (buyCount > 0) {
                        UtilsUI.lockWait();
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait();
                            if (args.errorcode == 0) {
                                this.onGetCompanionInfo()
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyCompanionUse, 0, null);
                            } else {
                                UtilsUI.showMsgTip(args.errorcode);
                            }
                        }, "addExploreStamina", {
                            count: buyCount
                        });
                    } else {
                        UtilsUI.showMsgTip(StrVal.LYCOMPANION.STR49);
                    }
                }
            });

        })
        let label_bxl: fgui.GLabel = this.uiPanel.getChild("label_bxl")
        this.uiPanel.getChild("btn_xy", fgui.GButton).onClick(() => {
            label_bxl.text = StrVal.LYCOMPANION.STR13
        })
        this.uiPanel.getChild("btn_yl", fgui.GButton).onClick(() => {
            if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.COMPANION_EXPLORE)) {
                UtilsUI.onShowActivationTisp(VarVal.SYSYTEM_ID.COMPANION_EXPLORE);
                this.uiPanel.getController("c1").selectedIndex = 0
                return;
            }
            label_bxl.text = StrVal.LYCOMPANION.STR41
        })
        label_bxl.text = StrVal.LYCOMPANION.STR13

        this.registerRequest((args) => {
            // if (String(args.type) == VarVal.taskType.clan) {
            this.loadExplore()
            // }
        }, "onExploreStaminaChange");
    };
    private group_placeArr: Array<fgui.GComponent>;
    private group_player: fgui.GGraph;
    private onTravel(dropReward, encounterCompanion): void {
        let explore = []
        for (let i = 0; i < LocaleData.getCompanionExplore().length; i++) {
            const element = LocaleData.getCompanionExplore()[i];
            explore.push(element)
        }
        explore = explore.sort(() => Math.random() - 0.5)
        let iiii: number = 0
        if (encounterCompanion && encounterCompanion.length > 0) {
            let encounterCompanionStr = encounterCompanion[0].companionId
            for (let i = 0; i < explore.length; i++) {
                const element = explore[i];
                let itemArr = element.companion.split(",")
                for (let j = 0; j < itemArr.length; j++) {
                    const str = itemArr[j].split(":")[0];
                    if (str == encounterCompanionStr) {
                        iiii = Number(element.id) - 1
                        break
                    }
                }
            }
        }
        else {
            let bonuseStrings = GameServerData.getInstance().bonusesResultsToString(dropReward).split(";")[0].split(",")[1]
            for (let i = 0; i < explore.length; i++) {
                const element = explore[i];
                let itemArr = element.item.split(",")
                for (let j = 0; j < itemArr.length; j++) {
                    const str = itemArr[j].split(":")[0];
                    if (str == bonuseStrings) {
                        iiii = Number(element.id) - 1
                        break
                    }
                }
            }
        }
        this.group_player.visible = true
        FguiGTween.new(this.group_player).to(1, { x: this.group_placeArr[iiii].x, y: this.group_placeArr[iiii].y + 100 }, { easing: fgui.EaseType.CubicOut }).call(() => {
            // if (callback) {callback()}
            this.group_player.visible = false
            this.btn_addExploreStamina.touchable = true
            this.group_player.x = this.btn_addExploreStamina.x + 150
            this.group_player.y = this.btn_addExploreStamina.y + 100
            // UtilsUI.showItemRewardExplore({ bonuseString: GameServerData.getInstance().bonusesResultsToString(dropReward) });
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH_MULTI, LyItemRewardExplore, 0, {
                bonuseString: GameServerData.getInstance().bonusesResultsToString(dropReward),
                encounterCompanion: encounterCompanion,
                tip: explore[iiii].tip
            });
        }).start();
        // }
    }
    public onGetCompanionInfo(): void {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        this.companionData = fullInfo.companionData
        this.loadCompanion()
        this.loadExplore()
    }
    private allArr: any = []
    public loadCompanion(): void {
        this.allArr = []
        this.companionData.companions.sort((instA, instB) => {
            let companion1: any = LocaleData.getCompanionById(instA.companionId)
            let companion2: any = LocaleData.getCompanionById(instB.companionId)
            return Number(companion1.quality) - Number(companion2.quality);
        })
        let companionCounter1 = [] //可解锁
        let companionCounter2 = [] //不可解锁
        for (let i = 0; i < this.companionData.companionCounter.length; i++) {
            let item = this.companionData.companionCounter[i]
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
        this.companionData.companions.forEach(item => {
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
        this.list_companion.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            let indexLock: number = 0 //0已解锁，1未解锁，2道具解锁,3可解锁(道具)4可解锁（任务）

            if (this.allArr[index].counterKey || this.allArr[index].counterKey == "") {
                let counter = LocaleData.getCounterByKey(this.allArr[index].counterKey)
                if (this.allArr[index].counterKey == "") {
                    indexLock = 4
                } else {
                    if (counter.type == 3) {
                        indexLock = 2
                        let label_number: fgui.GTextField = obj.getChild("label_number")
                        label_number.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR12, [this.allArr[index].nowValue, this.allArr[index].targetValue])
                        label_number.color = UtilsUI.getEnoughColor(this.allArr[index].nowValue >= this.allArr[index].targetValue);

                        let url = LocaleData.getItemProto(counter.ext).icon
                        let img_itemIcon: fgui.GLoader = obj.getChild("img_itemIcon")
                        img_itemIcon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [url]);
                        if (this.allArr[index].nowValue >= this.allArr[index].targetValue) {
                            indexLock = 3
                        }
                    } else {
                        if (this.allArr[index].nowValue >= this.allArr[index].targetValue) {
                            indexLock = 4
                        } else {
                            indexLock = 1
                        }
                    }
                }
            } else {
                obj.getChild("label_liking").text = this.allArr[index].level
            }
            let isRed: boolean = indexLock == 3 || indexLock == 4
            if (!isRed && indexLock == 0) {
                let companionDuel = LocaleData.getCompanionDuelByPlayer(this.fullInfoBase.level, this.allArr[index].liking, this.allArr[index].companionId)
                isRed = companionDuel.phase > this.allArr[index].duelPhase
            }
            PointRedData.getInstance().updateManualPoint(obj, isRed);

            let companionArr: any = LocaleData.getCompanionById(this.allArr[index].companionId)
            obj.getChild("label_name").text = companionArr.name
            obj.getController("c1").selectedIndex = indexLock
            // obj.getChild("label_gold").text = LocaleData.getPetQualityById(LocaleData.getPetById(val.petProtoId).quality).currency_required_for_summon
            // obj.getChild("group_state2").visible = val.state == 0
            // obj.getChild("img_icon").url = 
            let img_qualityBg: fgui.GLoader = obj.getChild("img_qualityBg")
            img_qualityBg.url = UtilsTool.stringFormat("ui://LyCompanion/companion_bg{0}", [companionArr.quality]);
            let likingData = LocaleData.getCompanionById(this.allArr[index].companionId)
            // let mainAttr: string[] = this.getCompanionData(likingData.mainAttr, this.allArr[index].companionId)
            // this.skinArr = LocaleData.getCompanionSkin(this.companionXml.id)
            let mainAttrValueStr: string[] = likingData.mainAttrValue.split(",")
            let phaseIndex: number = this.allArr[index].phase ? this.allArr[index].phase : 0
            let label_attr: fgui.GLabel = obj.getChild("label_attr")
            if (indexLock == 0) {
                label_attr.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR3, [LocaleData.getCompanionAttrById(likingData.mainAttr).name, mainAttrValueStr[phaseIndex]])
            } else {
                label_attr.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR30, [LocaleData.getCompanionAttrById(likingData.mainAttr).name])
            }
            let models = LocaleData.getModelItem(companionArr.modelId)
            let img_icon: fgui.GLoader = obj.getChild("img_icon")
            img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [models.thumbnail]);
        }).bind(this)
        this.list_companion.numItems = this.allArr.length
        let companionAttrs: string[] = this.companionData.companionAttrs
        if (companionAttrs.length > 0) {
        } else {
            for (let i = 0; i < LocaleData.getCompanionAttrById("").length; i++) {
                companionAttrs.push("0")
            }
        }
        let list_moreAttr: fgui.GList = this.uiPanel.getChild("list_moreAttr")
        let label_attr0: fgui.GLabel = this.uiPanel.getChild("label_attr0")
        let label_attr1: fgui.GLabel = this.uiPanel.getChild("label_attr1")
        let label_attr2: fgui.GLabel = this.uiPanel.getChild("label_attr2")
        label_attr0.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR3, [LocaleData.getCompanionAttrById(1).name, companionAttrs[20]])
        label_attr1.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR3, [LocaleData.getCompanionAttrById(2).name, companionAttrs[21]])
        label_attr2.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR3, [LocaleData.getCompanionAttrById(3).name, companionAttrs[22]])
        list_moreAttr.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            // totalAttrs[index]
            if (index < 4) {
                obj.getChild("label_txt").text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR9, [LocaleData.getCompanionAttrById(index + 1).name, companionAttrs[index]])
            } else {
                obj.getChild("label_txt").text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR3, [LocaleData.getCompanionAttrById(index + 1).name, companionAttrs[index]])
            }

        })
        list_moreAttr.numItems = companionAttrs.length - 3
    }
    private onTime = null

    private preStaminaRecoverTimeIndex = 0
    public loadExplore(): void {
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let nextStaminaRecoverTime = fullInfo.companionData.nextStaminaRecoverTime
        let maxStamina: number = Number(LocaleData.getCompanionStaminaByLevel(fullInfo.base.level).maxStamina)
        let label_time: fgui.GLabel = this.uiPanel.getChild("label_time")
        let serverTime = GameServerData.getInstance().getServerTime()
        let time = nextStaminaRecoverTime - serverTime

        if (fullInfo.companionData.stamina >= maxStamina) {
            label_time.text = StrVal.LYCOMPANION.STR8
        } else {
            if (this.onTime) {
                this.clearInterval(this.onTime)
                this.onTime = null
            }
            this.onTime = this.setInterval(() => {
                time--
                if (time <= 0) {
                    this.clearInterval(this.onTime)
                    this.onTime = null
                    this.loadExplore()
                } else {
                    label_time.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR7, [UtilsTool.splitTimeString(time)]);
                }
            }, 1000);
        }
        // this.preStaminaRecoverTimeIndex = preStaminaRecoverTime.length
        // for (let i = 0; i < preStaminaRecoverTime.length; i++) {
        //     let item = preStaminaRecoverTime[i]
        //     if (item > serverTime) {
        //         this.preStaminaRecoverTimeIndex--
        //     }
        // }
        // let timeNum = preStaminaRecoverTime[this.preStaminaRecoverTimeIndex]
        this.btn_addExploreStamina.getChild("title").text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR18,
            [this.companionData.stamina, maxStamina])

        // if (this.companionData.stamina < maxStamina && timeNum) {
        //     if (this.onTime) {
        //         this.clearInterval(this.onTime)
        //         this.onTime = null
        //     }
        // this.onTime = this.setInterval(() => {
        //     let time = nextStaminaRecoverTime - serverTime


        // if (time <= 0) {
        //     this.companionData.stamina++
        //     this.clearInterval(this.onTime)
        //     this.onTime = null
        //     this.loadExplore()
        // } else {
        //     label_time.text = UtilsTool.stringFormat(StrVal.LYCOMPANION.STR7, [UtilsTool.splitTimeString(time)]);
        // }
        // }, 1000);
        // } else {
        //     if (this.onTime) {
        //         this.clearInterval(this.onTime)
        //         this.onTime = null
        //     }
        //     label_time.text = StrVal.LYCOMPANION.STR8
        // }
    };
    public getCompanionData(attr: string, id: string): string[] {
        let attrArr: string[] = attr.split("|")
        for (let i = 0; i < attrArr.length; i++) {
            let item: string = attrArr[i]
            if (item.split(":")[0] == id) {
                return item.split(":")
            }
        }
    }

    public static isViewRedPoint(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.companion)) {
            return false;
        }
        let isRed: boolean = false
        if (GameServerData.getInstance().getPlayerFullInfo().companionData && GameServerData.getInstance().getPlayerFullInfo().companionData.companionCounter) {
            let companionData = GameServerData.getInstance().getPlayerFullInfo().companionData.companionCounter
            for (let i = 0; i < companionData.length; i++) {
                const element = companionData[i];
                if (element.nowValue >= element.targetValue || element.counterKey == "") {
                    isRed = true
                }
            }
        }
        return isRed
    }



    public static isViewRedPointBattle(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.companion)) {
            return false;
        }
        let fullInfoLevel = GameServerData.getInstance().getPlayerFullInfo().base.level
        let companions = GameServerData.getInstance().getPlayerFullInfo().companionData.companions
        let isRed: boolean = false
        for (let index = 0; index < companions.length; index++) {
            let item = companions[index]
            let companionDuel = LocaleData.getCompanionDuelByPlayer(fullInfoLevel, item.liking, item.companionId)
            isRed = companionDuel.phase > item.duelPhase
        }
        return isRed
    }

    public onViewUpdate(params: any): void {
        this.onGetCompanionInfo()
    }
    public getIsViewMask(): boolean {
        return false;
    };

}