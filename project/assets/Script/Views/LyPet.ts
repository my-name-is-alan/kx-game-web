//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { GameServerData } from "../Kernel/GameServerData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServer } from "../Kernel/GameServer";
import { MonthCardItemType, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { LyPetDevourpet } from "./LyPetDevourpet";
import { LyPetSet } from "./LyPetSet";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { LyMainPage } from "./LyMainPage";
import { LyPetTisp } from "./LyPetTisp";
import { LyGuideGetItem } from "./LyGuideGetItem";
import { VarVal } from "../Values/VarVal";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { LyPetRefreshBuff } from "./LyPetRefreshBuff";
import { LyPetPopup } from "./LyPetPopup";
import { LyGuideDetail } from "./LyGuideDetail";
import { PointRedData } from "../Kernel/PointRedData";
import { AudioManager } from "../Kernel/AudioManager";
import { LyPayExquisite, PayExquisitePage } from "./LyPayExquisite";
import { LyPetRecruitpet } from "./LyPetRecruitpet";
import { LyPayUniteWeekCard } from "./LyPayUniteWeekCard";
import { applyPetTransferStars, petTransferProgress } from "./PetTransferDisplay";

export class LyPet extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyPet";
        this.viewResI.pkgName = "LyPet";
        this.viewResI.comName = "LyPet";
    }
    private petRecruitingPosition: number = 0//宠物招募选择位置
    private petPosition: number = 0//宠物选择位置
    private btn_recruitpet: fgui.GButton;
    private btn_summonpet: fgui.GButton
    private btn_petrelease: fgui.GButton
    private btn_togglepetlock: fgui.GButton
    private list_pet: fgui.GList
    private group_icon1: fgui.GLabel
    private label_leveluppet: fgui.GTextField
    private label_refresh1: fgui.GTextField
    private loader_quality_eff
    private loader_quality: fgui.GLoader3D

    private btn_jb: fgui.GButton
    private btn_bl: fgui.GButton
    private btn_zh: fgui.GButton
    private btn_leveluppet: fgui.GButton
    private btn_refresh1: fgui.GButton
    private uiPanel: fgui.GComponent
    private fullInfo: any
    private petRoot: any
    public static isSkipPlayAni: boolean;
    public onViewCreate(_params: any): void {
        AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_COMMOM_LAYER);
        this.uiPanel = this.getUiPanel().getChild("group_pet")

        if (LyPet.isSkipPlayAni) {
            LyPet.isSkipPlayAni = false;
        } else {
            UtilsUI.playCommonGroupAni(this.uiPanel);
        }

        let btn_close = this.getUiPanel().getChild("btn_close")
        let btn_close1 = this.uiPanel.getChild("btn_close1")
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPet, 0, null)
        })
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPet, 0, null)
        })
        let btn_close2 = this.uiPanel.getChild("btn_close2")
        btn_close2.onClick(() => {
            btn_zhclose.visible = false
            con_pet.selectedIndex = 0
        })
        let btn_zhclose: fgui.GButton = this.getUiPanel().getChild("btn_zhclose")
        btn_zhclose.visible = false
        btn_zhclose.onClick(() => {
            btn_zhclose.visible = false
            con_pet.selectedIndex = 0
        })
        let con_pet: fgui.Controller = this.uiPanel.getController("con_pet")
        this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        this.petRoot = LocaleData.getPetRoot()

        let label_str51: fgui.GLabel = this.uiPanel.getChild("label_str51")
        label_str51.text = StrVal.LYPET.STR51
        let label_str55: fgui.GLabel = this.uiPanel.getChild("label_str55")
        label_str55.text = StrVal.LYPET.STR55
        let label_str61: fgui.GLabel = this.uiPanel.getChild("label_str61")
        label_str61.text = StrVal.LYPET.STR61
        let label_bxl: fgui.GLabel = this.uiPanel.getChild("label_bxl")
        label_bxl.text = StrVal.LYPET.STR54
        //******************************招募************************************
        let btn_encyclopediaDec = this.uiPanel.getChild("btn_encyclopediaDec")
        btn_encyclopediaDec.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, { title: StrVal.LYPET.STR23, detail: this.petRoot.petEncyDesc });
        })
        let btn_petSummonDesc = this.uiPanel.getChild("btn_petSummonDesc")
        btn_petSummonDesc.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, { title: StrVal.LYPET.STR22, detail: this.petRoot.petSummonDesc });
        })

        let btn_petDesc = this.uiPanel.getChild("btn_petDesc")
        btn_petDesc.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideDetail, 0, { title: StrVal.LYPET.STR24, detail: this.petRoot.petDesc });
        })

        let btn_petSet = this.uiPanel.getChild("btn_petSet")
        btn_petSet.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPetSet, 0, null);
        })
        this.label_refresh1 = this.uiPanel.getChild("label_refresh1")
        this.label_refresh1.text = this.petRoot.refresh_cost_number


        this.group_icon1 = this.uiPanel.getChild("group_icon1")
        let url: string = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getItemProto(this.petRoot.summon_currency_item).icon]);
        this.group_icon1.getChild("loader_icon", fgui.GLoader).url = url
        this.btn_recruitpet = this.uiPanel.getChild("btn_recruitpet")
        this.btn_recruitpet.getChild("group_gold", fgui.GComponent).getChild("loader_icon", fgui.GLoader).url = url
        let itemCount = GameServerData.getInstance().getItemCountByProtoId(this.petRoot.summon_currency_item)
        this.group_icon1.getChild("btn_add").onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {
                bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.petRoot.summon_currency_item, "1"), buyCall: () => {
                    itemCount = GameServerData.getInstance().getItemCountByProtoId(this.petRoot.summon_currency_item)
                    this.group_icon1.getChild("label_number").text = String(itemCount)
                    this.label_refresh1.color = UtilsUI.getEnoughColor(Number(this.label_refresh1.text) <= Number(this.group_icon1.getChild("label_number").text))
                }
            });
        })



        // 购买宠物
        this.btn_recruitpet.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPetTisp, 0, {
                        type: 1,
                        pet: args.pet
                    });
                    this.onPetsInfo()
                    this.onRecruitingAll(0)
                    // this.onRecruitingInfo(this.petRecruitingPosition)
                    this.onEncyclopedia()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                    let itemCount = GameServerData.getInstance().getItemCountByProtoId(this.petRoot.summon_currency_item)
                    if (itemCount <= Number(this.btn_recruitpet.getChild("label_q").text)) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {
                            bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.petRoot.summon_currency_item, "1"), buyCall: () => {
                                itemCount = GameServerData.getInstance().getItemCountByProtoId(this.petRoot.summon_currency_item)
                                this.group_icon1.getChild("label_number").text = String(itemCount)
                                this.label_refresh1.color = UtilsUI.getEnoughColor(Number(this.label_refresh1.text) <= Number(this.group_icon1.getChild("label_number").text))
                            }
                        });
                    }
                }
            }, "recruitpet", {
                petProtoId: Number(this.fullInfo.base.recruitingPets[this.petRecruitingPosition].petProtoId),
                petPosition: Number(this.petRecruitingPosition) + 1,
            })
        })

        this.btn_refresh1 = this.uiPanel.getChild("btn_refresh1")
        this.btn_refresh1.text = StrVal.LYPET.STR52
        // 刷新宠物
        this.btn_refresh1.onClick(() => {
            let isHeight: boolean = false
            for (let index = 0; index < this.fullInfo.base.recruitingPets.length; index++) {
                const element = this.fullInfo.base.recruitingPets[index];
                if (element.state == 1) {
                    let pet: any = LocaleData.getPetProto(element.petProtoId)
                    if (pet.quality >= 4) {
                        isHeight = true
                    }
                }
            }
            let call = () => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        let itemCount = GameServerData.getInstance().getItemCountByProtoId(this.petRoot.summon_currency_item)
                        this.group_icon1.getChild("label_number").text = String(itemCount)
                        this.label_refresh1.color = UtilsUI.getEnoughColor(Number(this.label_refresh1.text) <= Number(this.group_icon1.getChild("label_number").text))
                        this.onRecruitingAll(0, true)
                        // this.onRecruitingInfo(this.petRecruitingPosition)
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                        let itemCount = GameServerData.getInstance().getItemCountByProtoId(this.petRoot.summon_currency_item)
                        if (itemCount <= Number(this.petRoot.refresh_cost_number)) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {
                                bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.petRoot.summon_currency_item, "1"), buyCall: () => {
                                    itemCount = GameServerData.getInstance().getItemCountByProtoId(this.petRoot.summon_currency_item)
                                    this.group_icon1.getChild("label_number").text = String(itemCount)
                                    this.label_refresh1.color = UtilsUI.getEnoughColor(Number(this.label_refresh1.text) <= Number(this.group_icon1.getChild("label_number").text))


                                }
                            });
                        }
                    }
                }, "refreshrecruitingpets", {
                    isADS: 0
                })
            }
            // obj.getChild("img_icon").url = 
            if (isHeight) {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                    StrVal.LYPET.STR138, null,
                    StrVal.COMMON.STR32, null,
                    StrVal.COMMON.STR33, () => {
                        call()
                    }, "", null)
            } else {
                call()
            }

        })


        //******************************宠物************************************
        this.loader_quality = this.uiPanel.getChild("loader_quality")
        this.loader_quality_eff = new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            spp.playAnimation("zi", true);
        }, this.loader_quality, "jm_xialv_mingpai")

        this.btn_togglepetlock = this.uiPanel.getChild("btn_togglepetlock")
        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
            spp.playAnimation("stand", true);
        }, this.uiPanel.getChild("loader_bowen"), "jm_shuibowen")
        this.btn_togglepetlock.onClick(() => {
            this.btn_togglepetlock.selected = (this.petAll[this.petPosition].isLock == 0)
            if (this.petAll[this.petPosition]) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        this.onPetsInfo()
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "togglepetlock", {
                    petId: this.petAll[this.petPosition].id,
                    isLocked: (this.petAll[this.petPosition].isLock == 0) ? 1 : 0
                })
            }
        })
        let btn_devourpet: fgui.GButton = this.uiPanel.getChild("btn_devourpet")
        btn_devourpet.text = StrVal.LYPET.STR57
        btn_devourpet.onClick(() => {
            let data = this.petAll[this.petPosition]
            if (data.devourLevel < Number(this.petRoot.rank_limit)) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPetDevourpet, 0, data);
            } else {
                UtilsUI.showMsgTip(StrVal.LYPET.STR136)
            }
        })
        let btn_refreshBuff: fgui.GButton = this.uiPanel.getChild("btn_refreshBuff")
        btn_refreshBuff.text = StrVal.LYPET.STR15
        btn_refreshBuff.onClick(() => {
            let data = this.petAll[this.petPosition]
            const washProgress = Number(data.tier || 0) + Number(data.devourLevel || 0)
            if (washProgress < 4) {
                UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.LYPET.STR16, [4 - washProgress]))
            } else {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPetRefreshBuff, 0, { petProto: data, petPosition: this.petPosition });
            }
        })
        this.list_pet = this.uiPanel.getChild("list_pet")
        this.list_pet.on(fgui.Event.CLICK_ITEM, (onClickitem: fgui.GButton) => {
            let index = this.list_pet.childIndexToItemIndex(this.list_pet.getChildIndex(onClickitem))
            if (this.petPosition == index) {
                return
            }
            if (index < this.petAll.length) {
                this.petPosition = index
                this.loadPetInfo(index)
            } else if (index == this.fullInfo.base.petBackpackCapacity) {
                let str = UtilsTool.stringFormat(StrVal.LYPET.STR115, [UtilsUI.getItemIconUrl(VarVal.bonusType.stone),
                LocaleData.getPetBackpackByIndex(index - this.petRoot.backpack_initial + 1).currency_cost_number])
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                    str, null,
                    StrVal.COMMON.STR32, null,
                    StrVal.COMMON.STR33, () => {
                        this.list_pet.selectedIndex = this.petPosition
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
                                this.onPetList()
                            } else {
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        }, "expandpetinventory", null)
                    }, "", null)




            } else {
                this.list_pet.selectedIndex = this.petPosition
            }
        }, this)

        let btn_th: fgui.GButton = this.uiPanel.getChild("btn_th")
        let btn_sh: fgui.GButton = this.uiPanel.getChild("btn_sh")
        btn_th.clearClick()
        btn_th.onceClick(() => {
            UtilsUI.showMsgTip(StrVal.LYPET.STR25)
        })
        btn_sh.clearClick()
        btn_sh.onceClick(() => {
            UtilsUI.showMsgTip(StrVal.LYPET.STR25)
        })
        //宠物上阵
        this.btn_summonpet = this.uiPanel.getChild("btn_summonpet")
        this.btn_summonpet.onClick(() => {
            if (this.petAll[this.petPosition]) {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { upShowUi: true });
                        this.onPetsInfo()
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "summonpet", {
                    petId: this.petAll[this.petPosition].id
                })
            }
        })
        //宠物升级
        this.btn_leveluppet = this.uiPanel.getChild("btn_leveluppet")
        this.btn_leveluppet.text = StrVal.LYPET.STR56
        this.btn_leveluppet.onClick(() => {
            if (this.petAll[this.petPosition]) {
                if (this.petAll[this.petPosition].level < Number(this.petRoot.level_limit)) {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { upShowUi: true });
                            new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                                spp.playAnimation("stand", false);
                            }, this.uiPanel.getChild("loader_levelUp"), "jm_tongyonshengji")
                            this.onPetsInfo()
                            // .
                            if (LocaleData.getPetLevelByIdLevel2(args.pet.protoId, args.pet.level)) {
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPetTisp, 0, {
                                    type: 3,
                                    pet: args.pet
                                });
                            }
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                            let pet = LocaleData.getPetProto(this.petAll[this.petPosition].protoId)
                            let material = LocaleData.getPetQualityById(pet.quality)
                            let materialNum = material.upgrade_material_growth
                            let materialId = material.required_material_id
                            let num = Number(materialNum) * Number(this.petAll[this.petPosition].level)
                            if (num > GameServerData.getInstance().getItemCountByProtoId(materialId)) {
                                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {
                                    bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, materialId, "1"), buyCall: () => {
                                        this.onPetsInfo()
                                        // PointRedData.getInstance().updatePointChild(PointRedType.LyPetLevel);
                                        // this.uiPanel.getChild("group_icon3", fgui.GComponent).getChild("label_number").text = String(GameServerData.getInstance().getItemCountByProtoId(materialId))
                                        // this.label_leveluppet.color = UtilsUI.getEnoughColor(GameServerData.getInstance().getItemCountByProtoId(materialId) >= Number(this.label_leveluppet.text))
                                    }
                                });
                            }
                        }
                    }, "leveluppet", {
                        petId: this.petAll[this.petPosition].id
                    })
                } else {
                    UtilsUI.showMsgTip(StrVal.LYPET.STR137)
                }
            }
        })
        let btn_petreset: fgui.GButton = this.uiPanel.getChild("btn_petreset")
        btn_petreset.text = StrVal.LYPET.STR59


        btn_petreset.onClick(() => {
            if (this.petAll[this.petPosition]) {
                if (this.petAll[this.petPosition].level == 1) {
                    UtilsUI.showMsgTip(StrVal.LYPET.STR123)
                    return
                }
                let pet = this.petAll[this.petPosition]
                let petProto = LocaleData.getPetProto(pet.protoId)
                let petQuality = LocaleData.getPetQualityById(petProto.quality)
                let num: number = 0
                for (let i = 1; i < pet.level; i++) {
                    num += i * Number(petQuality.upgrade_material_growth)
                }
                // let num = Number(petQuality.upgrade_material_growth) * (Number(pet.level) - 1)
                let str = UtilsTool.stringFormat(StrVal.LYPET.STR116, [UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getItemProto(petQuality.required_material_id).icon]), num])
                // [UtilsUI.getItemIconUrl(VarVal.bonusType.stone),
                let itemCount = this.fullInfo.base.stone
                // GameServerData.getInstance().getItemCount(petQuality.currency_type_on_reset)
                let color = itemCount > petQuality.currency_cost_on_reset ? "#2B841C" : "#D53026"
                let str1 = UtilsTool.stringFormat(StrVal.LYPET.STR117, [
                    UtilsUI.getItemIconUrl(petQuality.currency_type_on_reset)
                    , color
                    , itemCount
                    , petQuality.currency_cost_on_reset
                ])

                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                    str, null,
                    StrVal.COMMON.STR32, null,
                    StrVal.COMMON.STR33, () => {
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                this.onPetsInfo()
                                UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([{ inserts: args.itemInserts }]) });
                            } else {
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        }, "petreset", {
                            petId: this.petAll[this.petPosition].id
                        })
                    }, "", null, { needCountText: str1 })
            }
        })


        this.btn_petrelease = this.uiPanel.getChild("btn_petrelease")
        this.btn_petrelease.text = StrVal.LYPET.STR60
        this.btn_petrelease.onClick(() => {
            let companionData = this.fullInfo.companionData.companions
            let companionAttr = 0
            for (let i = 0; i < companionData.length; i++) {
                if (companionData[i].companionId == 6) {
                    let boostValue = LocaleData.getCompanionById(6).boostValue
                    companionAttr = boostValue.split(",")[companionData[i].phase - 1]
                }
            }
            let pet = this.petAll[this.petPosition]
            let petProto = LocaleData.getPetProto(pet.protoId)
            let petQuality = LocaleData.getPetQualityById(petProto.quality)
            let num1: number = 0
            for (let i = 1; i < pet.level; i++) {
                num1 += i * Number(petQuality.upgrade_material_growth)
            }

            let num = (num1 * (Number(petQuality.material_return_on_release) / 100))
                + Number(petQuality.material_count_for_pet_blank_value) * (Number(petQuality.material_return_on_release) / 100)
            let str
            if (!companionAttr || companionAttr == 0) {
                str = UtilsTool.stringFormat(StrVal.LYPET.STR118, [
                    UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getItemProto(petQuality.required_material_id).icon])
                    , num
                    , petQuality.material_return_on_release
                ])
            } else {
                let num2 = Math.round(Number(petQuality.currency_required_for_summon) * (companionAttr / 100))
                str = UtilsTool.stringFormat(StrVal.LYPET.STR122, [
                    UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getItemProto(petQuality.required_material_id).icon])
                    , num
                    , petQuality.material_return_on_release
                    , UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getItemProto(this.petRoot.summon_currency_item).icon])
                    , num2
                    , companionAttr
                ])
            }
            if (pet.devourLevel > 0) {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                    StrVal.LYPET.STR119, null,
                    StrVal.COMMON.STR32, null,
                    StrVal.COMMON.STR33, () => {
                        UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                            str, null,
                            StrVal.COMMON.STR32, null,
                            StrVal.COMMON.STR33, () => {
                                if (this.petAll[this.petPosition]) {
                                    UtilsUI.lockWait()
                                    GameServer.getInstance().send((args: any) => {
                                        UtilsUI.unlockWait()
                                        if (args.errorcode == 0) {
                                            this.petPosition = 0
                                            this.onPetsInfo()
                                            let allBon = []
                                            if (args.itemInserts) {
                                                let bounsItems = UtilsUI.getBonuseItemsByString(GameServerData.getInstance().bonusesResultsToString([{ inserts: args.itemInserts }]))
                                                for (let index = 0; index < bounsItems.length; index++) {
                                                    const element = bounsItems[index];
                                                    allBon.push(element)
                                                }
                                            }
                                            if (args.boostItemInserts) {
                                                let bounsItems = UtilsUI.getBonuseItemsByString(GameServerData.getInstance().bonusesResultsToString([{ inserts: args.boostItemInserts }]))
                                                for (let index = 0; index < bounsItems.length; index++) {
                                                    const element = bounsItems[index];
                                                    allBon.push(element)
                                                }
                                            }
                                            UtilsUI.showItemReward({ bonuseItems: allBon });
                                        } else {
                                            UtilsUI.showMsgTip(args.errorcode)
                                        }
                                    }, "petrelease", {
                                        petId: this.petAll[this.petPosition].id
                                    })
                                }
                            }, "", null)
                    }, "", null)
            } else {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                    str, null,
                    StrVal.COMMON.STR32, null,
                    StrVal.COMMON.STR33, () => {
                        if (this.petAll[this.petPosition]) {
                            UtilsUI.lockWait()
                            GameServer.getInstance().send((args: any) => {
                                UtilsUI.unlockWait()
                                if (args.errorcode == 0) {
                                    this.petPosition = 0
                                    this.onPetsInfo()
                                    let allBon = []
                                    if (args.itemInserts) {
                                        let bounsItems = UtilsUI.getBonuseItemsByString(GameServerData.getInstance().bonusesResultsToString([{ inserts: args.itemInserts }]))
                                        for (let index = 0; index < bounsItems.length; index++) {
                                            const element = bounsItems[index];
                                            allBon.push(element)
                                        }
                                    }
                                    if (args.boostItemInserts) {
                                        let bounsItems = UtilsUI.getBonuseItemsByString(GameServerData.getInstance().bonusesResultsToString([{ inserts: args.boostItemInserts }]))
                                        for (let index = 0; index < bounsItems.length; index++) {
                                            const element = bounsItems[index];
                                            allBon.push(element)
                                        }
                                    }
                                    UtilsUI.showItemReward({ bonuseItems: allBon });
                                } else {
                                    UtilsUI.showMsgTip(args.errorcode)
                                }
                            }, "petrelease", {
                                petId: this.petAll[this.petPosition].id
                            })
                        }
                    }, "", null)
            }
            // if (this.petAll[this.petPosition]) {
            //     UtilsUI.lockWait()
            //     GameServer.getInstance().send((args: any) => {
            //         UtilsUI.unlockWait()
            //         if (args.errorcode == 0) {
            //             this.onPetsInfo()
            //         } else {
            //             UtilsUI.showMsgTip(args.errorcode)
            //         }
            //     }, "petrelease", {
            //         petId: this.petAll[this.petPosition].id
            //     })
            // }
        })
        let btn_qualityDec: fgui.GButton = this.uiPanel.getChild("btn_qualityDec")
        btn_qualityDec.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPetPopup, 0, { type: 1 });
        })
        let btn_skillDec: fgui.GButton = this.uiPanel.getChild("btn_skillDec")
        btn_skillDec.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPetPopup, 0, { type: 2, petData: this.petAll[this.petPosition] });
        })
        let btn_buffDec: fgui.GButton = this.uiPanel.getChild("btn_buffDec")
        btn_buffDec.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPetPopup, 0, { type: 3 });
        })
        this.btn_bl = this.uiPanel.getChild("btn_bl")
        this.btn_jb = this.uiPanel.getChild("btn_jb")
        this.onPetsInfo()

        let isOneJb: boolean = true
        this.btn_jb.onClick(() => {
            //***********图鉴********** */
            if (isOneJb) {
                isOneJb = false
                this.onEncyclopedia()
            }
        })
        this.btn_zh = this.uiPanel.getChild("btn_zh")
        let isOnezh: boolean = true
        PointRedData.getInstance().updateManualPoint(this.btn_zh, this.fullInfo.petModuleInfo.petADSCount > 0);
        this.btn_zh.onClick(() => {
            //***********招募********** */
            btn_zhclose.visible = true
            if (isOnezh) {
                isOnezh = false
                // this.onRecruitingInfo(0)
                this.onRecruitingAll(0)
            }
        })
        // list_encyclopedia.on(fgui.Event.CLICK_ITEM, (onClickitem: fgui.GButton) => {
        // let index = list_encyclopedia.childIndexToItemIndex(list_encyclopedia.getChildIndex(onClickitem))
        // let petData: string[] = encyclopedia[index].activation_required_pet_id.split(",")
        // let mGCom = fgui.UIPackage.createObject("LyPet", "group_dec").asCom
        // let pet: any = LocaleData.getPetProto(petData[index])
        // if (pet) {
        // mGCom.getChild("label_name").text = pet.name
        // mGCom.getChild("label_dec").text = pet.description
        // fgui.GRoot.inst.showPopup(mGCom, onClickitem)
        // }
        // }, this)
        this.list_pet.selectedIndex = 0


        this.registerRequest((args) => {
            let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
            let group_icon4: fgui.GComponent = this.uiPanel.getChild("group_icon4")
            group_icon4.getChild("label_number").text = String(fullInfo.base.stone)
            let group_icon2: fgui.GComponent = this.uiPanel.getChild("group_icon2")
            group_icon2.getChild("label_number").text = String(fullInfo.base.stone)
        }, "playerAttrChanged");
    }

    private onEncyclopedia(): void {
        let list_encyclopedia: fgui.GList = this.uiPanel.getChild("list_encyclopedia")
        let encyclopedia: any = LocaleData.getEncyclopedia()
        let ownerPetRecord: number[] = this.fullInfo.petModuleInfo.ownerPetRecord
        list_encyclopedia.setVirtual();
        list_encyclopedia.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            let openNum = 0
            let petData: string[] = encyclopedia[index].activation_required_pet_id.split(",")
            obj.getChild("label_name").text = encyclopedia[index].pictorial_name
            let list_pet: fgui.GList = obj.getChild("list_pet")
            list_pet.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                let pet: any = LocaleData.getPetProto(petData[index1])
                let title = obj1.getChild("title")
                let img_icon: fgui.GLoader = obj1.getChild("img_icon")
                title.text = "???"
                img_icon.url = UtilsTool.stringFormat("ui://LyPet/frame_xialvren{0}", [pet.quality])
                ownerPetRecord.forEach(element => {
                    if (petData[index1] == String(element)) {
                        if (pet) {
                            openNum++
                            title.text = pet.name
                            let showInfo = LocaleData.getModelShowInfo(String(pet.modelId));
                            img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [showInfo.icon_square])
                        }
                    }
                });
            }).bind(this)
            //  UtilsUI.setFguiGlistDelayNumItems(list_pet, petData.length);
            list_pet.numItems = petData.length

            let attrTypeData: string[] = encyclopedia[index].acquired_attribute_type.split(",")
            let attrData: string[] = encyclopedia[index].attribute_type_value_percent.split(",")
            let list_attr: fgui.GList = obj.getChild("list_attr")

            list_attr.enabled = (openNum == petData.length)

            list_attr.itemRenderer = ((index1: number, obj1: fgui.GComponent) => {
                obj1.getChild("label_attr").text = UtilsTool.stringFormat(StrVal.LYPET.STR8,
                    [StrVal.EQUIPATTR_NAMES[Number(attrTypeData[index1]) - 1], attrData[index1]])
            }).bind(this)

            list_attr.numItems = attrData.length
        }).bind(this)
        list_encyclopedia.numItems = encyclopedia.length
    }

    private oldPet: number = 0
    private loadPetInfo(index): void {
        this.list_pet.selectedIndex = index
        let petData = this.petAll[index]
        if (petData) {
            let pet = LocaleData.getPetProto(petData.protoId)
            let petLevel: any = LocaleData.getPetLevelByIdLevel(petData.protoId, petData.level)
            let img_quality: fgui.GLoader = this.uiPanel.getChild("img_quality")
            img_quality.url = UtilsTool.stringFormat("ui://CCommon/frame_name{0}", [pet.quality]);
            let label_petName: fgui.GTextField = this.uiPanel.getChild("label_petName")
            label_petName.text = UtilsTool.stringFormat("[color={0}]{1}[/color]", [UtilsUI.getQualityColor1(pet.quality), pet.name]);
            if (pet.quality > 3) {
                this.loader_quality.visible = true
                this.loader_quality_eff.playAnimation("hong+cheng", true)
            } else if (pet.quality > 2) {
                this.loader_quality.visible = true
                this.loader_quality_eff.playAnimation("zi", true)
            } else {
                this.loader_quality.visible = false
            }
            // label_petName.color = this.onColor(pet.quality)s

            this.btn_togglepetlock.selected = (this.petAll[this.petPosition].isLock == 0)
            let starArr: fgui.GLoader[] = []
            let group_star: fgui.GComponent = this.uiPanel.getChild("group_star")
            for (let i = 1; i < 6; i++) {
                let starItem: fgui.GLoader = group_star.getChild("img_star" + i)
                starArr.push(starItem)
            }
            let group_starAll: fgui.GGroup = this.uiPanel.getChild("group_starAll")
            applyPetTransferStars(starArr, petData.devourLevel)
            group_starAll.visible = petData.devourLevel >= 1
            if (this.oldPet != pet.modelId) {
                new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
                }, this.uiPanel.getChild("loader_spine"), pet.modelId);
            }
            this.oldPet = pet.modelId
            let label_petLevel: fgui.GLabel = this.uiPanel.getChild("label_petLevel")
            if (pet.quality >= 4) {
                label_petLevel.text = UtilsTool.stringFormat(StrVal.LYPET.STR5, [petData.level, petData.tier])
            } else {
                label_petLevel.text = UtilsTool.stringFormat(StrVal.LYPET.STR9, [petData.level])
            }
            label_petLevel.text += "  " + petTransferProgress(petData.devourLevel)
            let label_petAttr1: fgui.GLabel = this.uiPanel.getChild("label_petAttr1")
            label_petAttr1.text = UtilsTool.stringFormat(StrVal.LYPET.STR1, [petData.healthPercentage])
            let label_petAttr2: fgui.GLabel = this.uiPanel.getChild("label_petAttr2")
            label_petAttr2.text = UtilsTool.stringFormat(StrVal.LYPET.STR2, [petData.attackPercentage])
            let label_petAttr3: fgui.GLabel = this.uiPanel.getChild("label_petAttr3")
            label_petAttr3.text = UtilsTool.stringFormat(StrVal.LYPET.STR3, [petData.defensePercentage])
            let label_petSkill: fgui.GLabel = this.uiPanel.getChild("label_petSkill", fgui.GComponent).getChild("label_petSkill")
            label_petSkill.text = UtilsTool.stringFormat(StrVal.LYPET.STR134, [(6 - Number(LocaleData.getPetLevelByIdLevel1(petData.protoId, petData.level)))
                , LocaleData.getSkillProto(petLevel.skill_id).desc])
            this.btn_summonpet.enabled = petData.id != this.fullInfo.base.summonPet

            this.btn_petrelease.enabled = petData.id != this.fullInfo.base.summonPet
            if (this.btn_petrelease.enabled) {
                this.btn_petrelease.enabled = this.btn_togglepetlock.selected
            }
            let material = LocaleData.getPetQualityById(pet.quality)
            let materialNum = material.upgrade_material_growth
            let materialId = material.required_material_id
            this.label_leveluppet = this.uiPanel.getChild("label_leveluppet")
            this.label_leveluppet.text = String(Number(materialNum) * Number(petData.level))
            this.label_leveluppet.color = UtilsUI.getEnoughColor(GameServerData.getInstance().getItemCountByProtoId(materialId) >= Number(this.label_leveluppet.text))

            let group_buffs: Array<fgui.GComponent> = []
            for (let i = 0; i < 8; i++) {
                let group_buff: fgui.GComponent = this.uiPanel.getChild("group_buff" + (i + 1))
                group_buffs.push(group_buff)
                let group_level: fgui.GGraph = group_buff.getChild("group_level")
                group_level.visible = false
                let img_quality: fgui.GLoader = group_buff.getChild("img_quality")
                img_quality.url = "ui://CCommon/frame_fangkuaidi0"
                let title: fgui.GLabel = group_buff.getChild("title")
                title.text = ""
                let img_wenhao: fgui.GImage = group_buff.getChild("img_wenhao")
                img_wenhao.visible = true
                group_buff.touchable = false
            }
            for (let i = 0; i < petData.buffSkill.length; i++) {
                let item = petData.buffSkill[i];
                let group_buff = group_buffs[i]

                UtilsUI.onPetQualityItem(group_buff, item)
            }
            let group_leveluppet: fgui.GGroup = this.uiPanel.getChild("group_leveluppet")
            let isRed: boolean = petData.id == this.fullInfo.base.summonPet
            if (isRed) {
                isRed = GameServerData.getInstance().getItemCountByProtoId(materialId) >= Number(this.label_leveluppet.text)
            }
            PointRedData.getInstance().updateManualPoint(this.btn_leveluppet, isRed);
            PointRedData.getInstance().updateManualPoint(this.btn_bl, isRed);
            this.btn_leveluppet.enabled = petData.level < Number(this.petRoot.level_limit)
            if (petData.level < Number(this.petRoot.level_limit)) {
                this.btn_leveluppet.text = StrVal.LYPET.STR56
                group_leveluppet.visible = true
            } else {
                group_leveluppet.visible = false
                this.btn_leveluppet.text = StrVal.LYPET.STR67
            }
        }
        let group_noPet: fgui.GGraph = this.uiPanel.getChild("group_noPet")
        if (this.fullInfo.petModuleInfo.pet.length < 1) {
            this.petPosition = -1
        }
        group_noPet.visible = this.fullInfo.petModuleInfo.pet.length < 1

    }
    private petAll: any
    private onPetsInfo(): void {
        let oldPetId
        if (this.petAll && this.petAll[this.petPosition] && this.petAll[this.petPosition].id) {
            oldPetId = this.petAll[this.petPosition].id
        }
        this.petAll = []
        this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        for (let i = 0; i < this.fullInfo.petModuleInfo.pet.length; i++) {
            let item = this.fullInfo.petModuleInfo.pet[i]
            if (this.fullInfo.base.summonPet != item.id) {
                this.petAll.push(item)
            }
        }
        this.petAll.sort((instA, instB) => {
            let pet1 = LocaleData.getPetProto(instA.protoId)
            let pet2 = LocaleData.getPetProto(instB.protoId)
            if (Number(pet1.quality) == Number(pet2.quality)) {
                if (Number(instA.level) == Number(instB.level)) {
                    if (Number(instA.protoId) == Number(instB.protoId)) {
                        if (Number(instA.devourLevel) == Number(instB.devourLevel)) {
                        } else {
                            return Number(instB.devourLevel) - Number(instA.devourLevel);
                        }
                    } else {
                        return Number(instB.protoId) - Number(instA.protoId);
                    }
                } else {
                    return Number(instB.level) - Number(instA.level);
                }
            } else {
                return Number(pet2.quality) - Number(pet1.quality);
            }
        })
        for (let i = 0; i < this.fullInfo.petModuleInfo.pet.length; i++) {
            let item = this.fullInfo.petModuleInfo.pet[i]
            if (this.fullInfo.base.summonPet == item.id) {
                // this.petAll.push(item)
                this.petAll.unshift(item)
            }
        }
        if (oldPetId) {
            for (let i = 0; i < this.petAll.length; i++) {
                const element = this.petAll[i];
                if (element.id == oldPetId) {
                    this.petPosition = i
                }
            }
        }
        this.loadPetInfo(this.petPosition)
        this.onPetList()
    }
    private onPetList(): void {
        this.group_icon1.getChild("label_number").text = String(GameServerData.getInstance().getItemCountByProtoId(this.petRoot.summon_currency_item))
        this.group_icon1 = this.uiPanel.getChild("group_icon1")
        this.group_icon1.getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getItemProto(this.petRoot.summon_currency_item).icon]);
        this.label_refresh1.color = UtilsUI.getEnoughColor(Number(this.label_refresh1.text) <= Number(this.group_icon1.getChild("label_number").text))
        let group_icon2: fgui.GComponent = this.uiPanel.getChild("group_icon2")
        group_icon2.getChild("loader_icon", fgui.GLoader).url = "ui://CCommon/Props-yubi";
        group_icon2.getChild("label_number").text = String(this.fullInfo.base.stone)
        let btn_add1: fgui.GButton = group_icon2.getChild("btn_add")
        if (PlatformAPI.isBinaryExamine() && PlatformAPI.isMiniGameOniOS()) {
            btn_add1.visible = false;
        }
        btn_add1.clearClick()
        btn_add1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, { page: PayExquisitePage.RECHARGE });
        })

        let materialId = LocaleData.getPetQualityById("1").required_material_id
        let group_icon3: fgui.GComponent = this.uiPanel.getChild("group_icon3")
        group_icon3.getChild("loader_icon", fgui.GLoader).url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getItemProto(materialId).icon]);
        group_icon3.getChild("label_number").text = String(GameServerData.getInstance().getItemCountByProtoId(materialId))

        let group_icon4: fgui.GComponent = this.uiPanel.getChild("group_icon4")
        group_icon4.getChild("loader_icon", fgui.GLoader).url = "ui://CCommon/Props-yubi";
        group_icon4.getChild("label_number").text = String(this.fullInfo.base.stone)
        let btn_add2: fgui.GButton = group_icon4.getChild("btn_add")
        if (PlatformAPI.isBinaryExamine() && PlatformAPI.isMiniGameOniOS()) {
            btn_add2.visible = false;
        }
        btn_add2.clearClick()
        btn_add2.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayExquisite, 0, { page: PayExquisitePage.RECHARGE });
        })

        let img_leveluppet: fgui.GLoader = this.uiPanel.getChild("img_leveluppet")
        img_leveluppet.url = UtilsTool.stringFormat("ui://CCommon/{0}", [LocaleData.getItemProto(materialId).icon]);


        let label_petCount: fgui.GLabel = this.uiPanel.getChild("label_petCount")
        label_petCount.text = UtilsTool.stringFormat(StrVal.LYPET.STR4, [this.petAll.length, this.fullInfo.base.petBackpackCapacity])
        this.list_pet.setVirtual();
        this.list_pet.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            let c1: fgui.Controller = obj.getController("c1")
            if (index < this.petAll.length) {
                c1.selectedIndex = 0
                let val = this.petAll[index]
                obj.getChild("group_summonPet").visible = val.id == this.fullInfo.base.summonPet
                let isRed: boolean = val.id == this.fullInfo.base.summonPet
                if (isRed) {
                    isRed = GameServerData.getInstance().getItemCountByProtoId(materialId) >= Number(this.label_leveluppet.text)
                }
                PointRedData.getInstance().updateManualPoint(obj, isRed);

                obj.getChild("group_isLock").visible = val.isLock == 1
                obj.getChild("label_level").text = UtilsTool.stringFormat(StrVal.LYPET.STR9, [val.level])
                    + "  " + petTransferProgress(val.devourLevel)
                let img_icon: fgui.GLoader = obj.getChild("img_icon")
                let pet = LocaleData.getPetProto(val.protoId)
                let showInfo = LocaleData.getModelShowInfo(String(pet.modelId));
                img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [showInfo.icon_square])
                let starArr: fgui.GLoader[] = []
                for (let i = 1; i < 6; i++) {
                    let starItem: fgui.GLoader = obj.getChild("img_star" + i)
                    starArr.push(starItem)
                }
                applyPetTransferStars(starArr, val.devourLevel, "starSmall_")
            } else if (index < this.fullInfo.base.petBackpackCapacity) {
                c1.selectedIndex = 1
            } else if (index == this.fullInfo.base.petBackpackCapacity) {
                c1.selectedIndex = 2
                let label_cellGold: fgui.GTextField = obj.getChild("label_cellGold")
                label_cellGold.text = LocaleData.getPetBackpackByIndex(
                    index - this.petRoot.backpack_initial + 1).currency_cost_number
                label_cellGold.color = UtilsUI.getEnoughColor(this.fullInfo.base.stone >= Number(label_cellGold.text))
            } else {
                c1.selectedIndex = 3
            }
        }).bind(this)
        UtilsUI.setFguiGlistDelayNumItems(this.list_pet, LocaleData.getPetBackpackByIndex("").length);
        // this.list_pet.numItems = LocaleData.getPetBackpackByIndex("").length
        if (this.btn_petrelease.enabled) {
            this.btn_petrelease.enabled = this.petAll.length > 1
        }
    }
    private onPetSetDec(): void {
        let label_petSetCount: fgui.GLabel = this.uiPanel.getChild("label_petSetCount")
        let label_petSetDec: fgui.GLabel = this.uiPanel.getChild("label_petSetDec")
        let img_petSet: fgui.GLoader = this.uiPanel.getChild("img_petSet")
        if (this.fullInfo.base.petPitySystemId) {
            let petPitySystemIdArr = LocaleData.getPetProto(this.fullInfo.base.petPitySystemId)
            label_petSetDec.text = UtilsTool.stringFormat(StrVal.LYPET.STR7, [petPitySystemIdArr.name])
            label_petSetDec.visible = true
            let showInfo = LocaleData.getModelShowInfo(petPitySystemIdArr.modelId);
            img_petSet.url = UtilsTool.stringFormat("ui://CCommon/{0}", [showInfo.icon_square])
            img_petSet.visible = true
            label_petSetCount.visible = true
        } else {
            label_petSetDec.visible = false
            img_petSet.visible = false
            label_petSetCount.visible = false
        }
    }


    //召唤宠物列表
    private list_recruitingPet: fgui.GList;
    private onRecruitingAll(index: number, isRefresh?: boolean): void {
        if (isRefresh) {
            for (let i = 0; i < this.list_recruitingPet.numItems; i++) {
                let obj1: fgui.GComponent = this.list_recruitingPet.getChildAt(i)
                let obj: fgui.GComponent = obj1.getChild("group_petItem")
                obj.alpha = 0
            }
        }
        this.list_recruitingPet = this.uiPanel.getChild("list_recruitingPet")
        this.list_recruitingPet.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            let val = this.fullInfo.base.recruitingPets[index]
            // obj.getChild("img_icon").url = 
            let pet: any = LocaleData.getPetProto(val.petProtoId)
            let item: fgui.GComponent = obj.getChild("group_petItem")
            // item.getChild("label_name").text = UtilsTool.stringFormat("[color={0}]{1}[/color]", [this.onColor(pet.quality), pet.name]);
            item.getChild("label_name").text = pet.name
            item.getChild("group_gold", fgui.GComponent).getChild("label_gold").text = LocaleData.getPetQualityById(pet.quality).currency_required_for_summon
            item.getChild("group_state2").visible = val.state == 0
            new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            }, item.getChild("loader_spine"), pet.modelId);

            let img_quality: fgui.GLoader = item.getChild("img_quality")
            img_quality.url = UtilsTool.stringFormat("ui://LyPet/frame{0}", [pet.quality]);
            let img_quality2: fgui.GLoader = item.getChild("img_quality2")
            img_quality2.url = UtilsTool.stringFormat("ui://LyPet/qualityItem{0}", [pet.quality]);
            let loader_upLevel: fgui.GLoader3D = item.getChild("loader_upLevel")
            item.clearClick()
            item.onClick(() => {
                this.onRecruitingInfo(index)
            })
            if (isRefresh) {
                this.btn_jb.touchable = false
                this.btn_bl.touchable = false
                this.btn_zh.touchable = false
                this.btn_refresh1.touchable = false
                let ani: fgui.Transition = obj.getTransition("ani")
                ani.play(() => {
                    if (index == this.fullInfo.base.recruitingPets.length - 1) {
                        this.btn_jb.touchable = true
                        this.btn_bl.touchable = true
                        this.btn_zh.touchable = true
                        this.btn_refresh1.touchable = true
                    }
                    if (pet.quality > 2) {
                        new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                            spp.playAnimation(pet.quality, false);
                        }, loader_upLevel, "jm_xialv_fanpai")
                    }
                }, 1, index / 4)
            }
        }).bind(this)
        this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        this.list_recruitingPet.numItems = this.fullInfo.base.recruitingPets.length
        this.onRecruitingInfo(index)
    }

    private onWeekCardUi(): void {
        //周卡
        this.fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let group_left: fgui.GComponent = this.uiPanel.getChild("group_left")
        let group_uniteItem: fgui.GComponent = group_left.getChild("GroupItem")
        let canUniteTakeData = LyPayUniteWeekCard.unitxWeekTakeData(3)
        group_left.visible = canUniteTakeData != null
        if (canUniteTakeData != null) {
            let bounitems = UtilsUI.getBonuseItemsByBonusesId(LocaleData.getPayWeekCard(canUniteTakeData.id).bonuses)
            UtilsUI.setUIGroupItem(bounitems[0], group_uniteItem, () => {
                let xml = LyPayUniteWeekCard.getUniteXml(canUniteTakeData.id)
                if (xml.isFree == "1") {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayUniteWeekCard, 0, { type: 1 });
                } else {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.onWeekCardUi()
                            UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString(args.bonusesArr) });
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    }, "takeWeekCard", { id: Number(canUniteTakeData.id) });
                }
            });
        }

        //终身卡
        //    if (LyPayUniteWeekCard.isViewRedPointLife()) {
        let group_right: fgui.GComponent = this.uiPanel.getChild("group_right")
        if (this.fullInfo.petCardTake == 1 || this.fullInfo.petCard == 0) {
            group_right.visible = false
        } else {
            let group_zsItem: fgui.GComponent = group_right.getChild("GroupItem")
            group_right.visible = true
            let rewardXml = LocaleData.getPayRoot()._compositeLifeCard[0]._item[1]
            let bounitems = UtilsUI.getBonuseItemsByBonusesId(rewardXml.bonuses)
            UtilsUI.setUIGroupItem(bounitems[0], group_zsItem, () => {
                UtilsUI.lockWait();
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait();
                    if (args.errorcode == 0) {
                        this.onWeekCardUi()
                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                    } else {
                        UtilsUI.showMsgTip(args.errorcode);
                    }
                }, "takePetCard", null);
            });
        }
    }
    //召唤灵兽
    private onRecruitingInfo(index: number): void {
        let label_hxDesc: fgui.GLabel = this.uiPanel.getChild("label_hxDesc")
        let guarantees: any = LocaleData.getPetSpecialGuarantees()
        let btn_zs: fgui.GButton = this.uiPanel.getChild("btn_zs")
        btn_zs.clearClick()
        btn_zs.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayUniteWeekCard, 0, { type: 3 });
        })
        let btn_card = this.uiPanel.getChild("btn_card")
        btn_card.visible = !PlatformAPI.isBinaryExamine()
        btn_card.clearClick()
        btn_card.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayUniteWeekCard, 0, { type: 1 });
        });
        this.onWeekCardUi()
        let petConsumption = this.fullInfo.base.petConsumption

        while (petConsumption > Number(guarantees[guarantees.length - 1].consumption)) {
            petConsumption -= Number(guarantees[guarantees.length - 1].consumption)
        }
        let guarantees1: any = LocaleData.getPetSpecialGuarantees1(petConsumption)
        label_hxDesc.text = UtilsTool.stringFormat(StrVal.LYPET.STR26, [Number(guarantees1.consumption) - petConsumption])
        let loader_bx3: fgui.GButton = this.uiPanel.getChild("loader_bx3")
        loader_bx3.clearClick()
        loader_bx3.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPetRecruitpet, 0, null);
        })

        for (let i = 0; i < this.list_recruitingPet.numItems; i++) {
            let obj1: fgui.GComponent = this.list_recruitingPet.getChildAt(i)
            let obj: fgui.GComponent = obj1.getChild("group_petItem")

            let loader_select1: fgui.GLoader3D = obj.getChild("loader_select1")
            let loader_select2: fgui.GLoader3D = obj.getChild("loader_select2")
            // new SpinePlayer().loadSpine(null, loader_select1, "jm_xialvchouka_1")
            // new SpinePlayer().loadSpine(null, loader_select2, "jm_xialvchouka_2")

            new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                spp.playAnimation("stand", true);
            }, loader_select1, "jm_xialvchouka_1");

            new SpinePlayer().loadSpine((spp: SpinePlayer) => {
                spp.playAnimation("stand", true);
            }, loader_select2, "jm_xialvchouka_2");

            loader_select1.visible = i == index
            loader_select2.visible = i == index
        }
        let label_refresh2: fgui.GLabel = this.uiPanel.getChild("label_refresh2")
        label_refresh2.text = UtilsTool.stringFormat(StrVal.LYPET.STR14, [this.fullInfo.petModuleInfo.petADSCount, 3])
        let btn_refresh2: fgui.GButton = this.uiPanel.getChild("btn_refresh2")
        PointRedData.getInstance().updateManualPoint(btn_refresh2, this.fullInfo.petModuleInfo.petADSCount > 0);
        PointRedData.getInstance().updateManualPoint(this.btn_zh, this.fullInfo.petModuleInfo.petADSCount > 0);
        btn_refresh2.enabled = this.fullInfo.petModuleInfo.petADSCount > 0
        btn_refresh2.text = StrVal.LYPET.STR53
        // 刷新宠物
        btn_refresh2.clearClick()
        btn_refresh2.onClick(() => {
            let isHeight: boolean = false
            for (let index = 0; index < this.fullInfo.base.recruitingPets.length; index++) {
                const element = this.fullInfo.base.recruitingPets[index];
                if (element.state == 1) {
                    let pet: any = LocaleData.getPetProto(element.petProtoId)
                    if (pet.quality >= 4) {
                        isHeight = true
                    }
                }
            }
            let call = () => {
                PlatformAPI.doSdkRewardVideoAD((errmsg: string) => {
                    if (errmsg) {
                        UtilsUI.showMsgTip(errmsg);
                    } else {
                        UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                            UtilsUI.unlockWait()
                            if (args.errorcode == 0) {
                                this.onRecruitingAll(0, true)
                            } else {
                                UtilsUI.showMsgTip(args.errorcode)
                            }
                        }, "refreshrecruitingpets", {
                            isADS: 1
                        })
                    }
                }, UtilsUI.getMonthLifeCardActiveItem(MonthCardItemType.skip_ad))
            }
            if (isHeight) {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                    StrVal.LYPET.STR138, null,
                    StrVal.COMMON.STR32, null,
                    StrVal.COMMON.STR33, () => {
                        call()
                    }, "", null)
            } else {
                call()
            }
        })
        let label_petSetCount: fgui.GLabel = this.uiPanel.getChild("label_petSetCount")
        label_petSetCount.text = UtilsTool.stringFormat(StrVal.LYPET.STR6, [this.petRoot.gurantees_trigger - this.fullInfo.base.petPitySystemCount, this.petRoot.gurantees_trigger])
        this.onPetSetDec()
        let label_str50: fgui.GLabel = this.uiPanel.getChild("label_str50")

        label_str50.visible = !PlatformAPI.isBinaryExamine()
        if (GameServerData.getInstance().isHaveLifeCard()) {
            label_str50.text = UtilsTool.stringFormat(StrVal.LYPET.STR49, [this.fullInfo.petModuleInfo.petDrawCount])
        } else {
            label_str50.text = StrVal.LYPET.STR50
        }

        this.petRecruitingPosition = index
        let recruitingPet = this.fullInfo.base.recruitingPets[index]
        let label_recruitingAttr1: fgui.GLabel = this.uiPanel.getChild("label_recruitingAttr1")
        let label_recruitingAttr2: fgui.GLabel = this.uiPanel.getChild("label_recruitingAttr2")
        let label_recruitingAttr3: fgui.GLabel = this.uiPanel.getChild("label_recruitingAttr3")
        let petQuality: any = LocaleData.getPetQualityById(LocaleData.getPetProto(recruitingPet.petProtoId).quality)
        let dimensionalList = petQuality.initial_dimensional_value.split(",")
        label_recruitingAttr1.text = UtilsTool.stringFormat(StrVal.LYPET.STR1, [dimensionalList[2]])
        label_recruitingAttr2.text = UtilsTool.stringFormat(StrVal.LYPET.STR2, [dimensionalList[0]])
        label_recruitingAttr3.text = UtilsTool.stringFormat(StrVal.LYPET.STR3, [dimensionalList[1]])
        let label_recruitingDec: fgui.GLabel = this.uiPanel.getChild("label_recruitingDec")
        let petLevel: any = LocaleData.getPetLevelByIdLevel(recruitingPet.petProtoId, "1")
        this.btn_recruitpet.enabled = recruitingPet.state == 1
        this.btn_recruitpet.getChild("label_q").text = petQuality.currency_required_for_summon
        label_recruitingDec.text = LocaleData.getSkillProto(petLevel.skill_id).desc



    };

    public static isViewRedPointAd(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.pet)) {
            return false;
        }
        return GameServerData.getInstance().getPlayerFullInfo().petModuleInfo.petADSCount > 0
    }
    public static isViewRedPointLevel(): boolean {
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.pet)) {
            return false;
        }
        let isRed: boolean = false
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        for (let i = 0; i < fullInfo.petModuleInfo.pet.length; i++) {
            const element = fullInfo.petModuleInfo.pet[i];
            if (element.id == fullInfo.base.summonPet) {
                let pet = LocaleData.getPetProto(element.protoId)
                let material = LocaleData.getPetQualityById(pet.quality)
                let materialNum = material.upgrade_material_growth
                let materialId = material.required_material_id
                isRed = GameServerData.getInstance().getItemCountByProtoId(materialId) >= (Number(Number(materialNum) * Number(element.level)))
                return isRed
            }
        }
        return false
    }

    public onViewShowFront(): void {
        this.onWeekCardUi();
    }

    public onViewUpdate(params: any): void {
        if (params) {
            if (params.petPosition) {
                this.petPosition = params.petPosition
            }
            if (params.isPetSet) {
                this.onPetSetDec()
            } else {
                this.onPetsInfo()
            }
        } else {
            this.onPetsInfo()
        }
    }
    public getIsViewMask(): boolean {
        return false;
    }
}


