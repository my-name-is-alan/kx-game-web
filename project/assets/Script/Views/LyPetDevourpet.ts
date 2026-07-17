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
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { LyPet } from "./LyPet";
import { LyPetTisp } from "./LyPetTisp";
import { VarVal } from "../Values/VarVal";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { applyPetTransferStars, PET_TRANSFER_MAX } from "./PetTransferDisplay";

export class LyPetDevourpet extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyPet";
        this.viewResI.pkgName = "LyPet";
        this.viewResI.comName = "LyPetDevourpet";
    }
    private group_preyPet: fgui.GComponent

    private group_select1: fgui.GComponent
    private group_selectPet: fgui.GComponent
    private uiPanel: fgui.GComponent
    private devourerPet: any
    public onViewCreate(_params: any): void {
        this.devourerPet = _params
        let petInfo: any = LocaleData.getPetProto(this.devourerPet.protoId)
        this.uiPanel = this.getUiPanel().getChild("group_petDevourpet")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        let btn_close = this.getUiPanel().getChild("btn_close")
        let btn_close1 = this.uiPanel.getChild("btn_close1")
        this.group_selectPet = this.uiPanel.getChild("group_selectPet")
        this.group_select1 = this.uiPanel.getChild("group_select1")

        let c1: fgui.Controller = this.group_select1.getController("c1")

        btn_close.onClick(() => {
            if (this.group_select1.visible) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPetDevourpet, 0, null)
            } else {
                this.group_select1.visible = true
                // this.group_selectPet.visible = false
            }
        })
        btn_close1.onClick(() => {
            if (this.group_select1.visible) {
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPetDevourpet, 0, null)
            } else {
                this.group_select1.visible = true
                // this.group_selectPet.visible = false
            }
        })
        let samePet: any = []
        GameServerData.getInstance().getPlayerFullInfo().petModuleInfo.pet.forEach(item => {
            // if (item.protoId == pet.protoId && item.id != pet.id && item.isLock == 0 &&
            if (item.protoId == this.devourerPet.protoId && item.id != this.devourerPet.id &&
                GameServerData.getInstance().getPlayerFullInfo().base.summonPet != item.id) {
                samePet.push(item)
            }
        });
        let group_devourerPet: fgui.GComponent = this.group_select1.getChild("group_devourerPet")
        group_devourerPet.getChild("label_name").text = petInfo.name
        group_devourerPet.getChild("label_level").text = UtilsTool.stringFormat(StrVal.LYPET.STR9, [this.devourerPet.level])

        let petProto: any = LocaleData.getPetProto(this.devourerPet.protoId)
        LyPetDevourpet.onPetGroup(group_devourerPet, this.devourerPet)
        group_devourerPet.getChild("img_quality", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyPet/frame{0}", [petProto.quality]);

        new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }, group_devourerPet.getChild("loader_spine"), petProto.modelId);

        LyPetDevourpet.onStar(group_devourerPet.getChild("group_star"), this.devourerPet)
        let group_select: fgui.GLoader = this.group_select1.getChild("group_select")
        group_select.onClick(() => {
            this.group_select1.visible = false
            // this.group_selectPet.visible = true
        })
        this.group_preyPet = this.group_select1.getChild("group_preyPet")
        this.group_preyPet.onClick(() => {
            this.group_select1.visible = false
            // this.group_selectPet.visible = true
        })
        this.uiPanel.getChild("label_str57").text = StrVal.LYPET.STR57
        let list_preyPet: fgui.GList = this.group_selectPet.getChild("list_preyPet")
        list_preyPet.setVirtual()
        list_preyPet.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            obj.getChild("label_name").text = samePet[index].proto.name
            obj.getChild("label_level").text = UtilsTool.stringFormat(StrVal.LYPET.STR9, [samePet[index].level])
            obj.getChild("img_lock").visible = samePet[index].isLock == 1

            obj.getChild("img_quality", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyPet/frame{0}", [samePet[index].proto.quality]);
            LyPetDevourpet.onPetGroup(obj, samePet[index])

            new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            }, obj.getChild("loader_spine"), samePet[index].proto.modelId);
            LyPetDevourpet.onStar(obj.getChild("group_star"), samePet[index])
            obj.getChild("img_bg").onClick(() => {
                if (samePet[index].isLock == 0) {

                    this.group_select1.visible = true
                    // this.group_selectPet.visible = false
                    c1.selectedIndex = 1
                    preyPetId = samePet[index]
                    this.onpreyPet(samePet[index])
                } else {
                    UtilsUI.showMsgTip(StrVal.LYPET.STR135)
                }
            })
        }).bind(this)
        list_preyPet.numItems = samePet.length
        let group_isPet: fgui.GGroup = this.group_selectPet.getChild("group_isPet")
        group_isPet.visible = samePet.length == 0
        let preyPetId
        // list_preyPet.on(fgui.Event.CLICK_ITEM, (onClickitem: fgui.GButton) => {
        //     let index = list_preyPet.childIndexToItemIndex(list_preyPet.getChildIndex(onClickitem))
        //     this.group_select1.visible = true
        //     // this.group_selectPet.visible = false
        //     c1.selectedIndex = 1
        //     preyPetId = samePet[index].id
        //     this.onpreyPet(samePet[index])
        // }, this)

        this.group_select1.visible = true
        // this.group_selectPet.visible = false

        let btn_devourpet: fgui.GButton = this.group_select1.getChild("btn_devourpet")
        btn_devourpet.text = StrVal.LYPET.STR105
        btn_devourpet.onClick(() => {
            if (c1.selectedIndex == 1) {
                if (preyPetId.devourLevel > 0) {
                    UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                        StrVal.LYPET.STR120, null,
                        StrVal.COMMON.STR32, null,
                        StrVal.COMMON.STR33, () => {
                            UtilsUI.lockWait()
                            GameServer.getInstance().send((args: any) => {
                                UtilsUI.unlockWait()
                                if (args.errorcode == 0) {
                                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPetTisp, 0, {
                                        type: 2,
                                        pet: args.devourerPet,
                                        oldPet: this.devourerPet
                                    });
                                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPetDevourpet, 0, null)
                                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPet, 0, null);

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
                            }, "devourpet", {
                                devourerPetId: this.devourerPet.id,
                                preyPetId: preyPetId.id
                            })
                        }, "", null)
                } else {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPetTisp, 0, {
                                type: 2,
                                pet: args.devourerPet,
                                oldPet: this.devourerPet
                            });
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPetDevourpet, 0, null)
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPet, 0, null);

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
                    }, "devourpet", {
                        devourerPetId: this.devourerPet.id,
                        preyPetId: preyPetId.id
                    })
                }
            }
        })
        let label_zk: fgui.GLabel = this.group_select1.getChild("label_zk")
        label_zk.text = StrVal.LYPET.STR102
        let label_sy: fgui.GLabel = this.group_select1.getChild("label_sy")
        label_sy.text = StrVal.LYPET.STR103
        let label_zw: fgui.GLabel = this.group_select1.getChild("label_zw")
        label_zw.text = StrVal.LYPET.STR104
        let label_cg: fgui.GLabel = this.group_select1.getChild("label_cg")
        label_cg.text = StrVal.LYPET.STR106
        let label_str108: fgui.GLabel = this.group_selectPet.getChild("label_str108")
        label_str108.text = StrVal.LYPET.STR108
    }


    private onDevourpet(): void {

    }
    private onpreyPet(preyPet: any): void {
        let petInfo: any = LocaleData.getPetProto(preyPet.protoId)

        this.group_preyPet.getChild("label_name").text = petInfo.name
        this.group_preyPet.getChild("label_level").text = UtilsTool.stringFormat(StrVal.LYPET.STR9, [preyPet.level])
        let petProto1: any = LocaleData.getPetProto(preyPet.protoId)
        this.group_preyPet.getChild("img_quality", fgui.GLoader).url = UtilsTool.stringFormat("ui://LyPet/frame{0}", [petProto1.quality]);

        new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }, this.group_preyPet.getChild("loader_spine"), petProto1.modelId);

        LyPetDevourpet.onStar(this.group_preyPet.getChild("group_star"), preyPet)
        LyPetDevourpet.onPetGroup(this.group_preyPet, preyPet)
        let qualityArr: string[] = LocaleData.getPetQualityById(petInfo.quality).dimensional_gain_per_devour.split(",")
        let label_addLevel: fgui.GLabel = this.group_select1.getChild("label_addLevel")
        let devourLevel = Math.min(PET_TRANSFER_MAX,
            Math.max(0, Number(this.devourerPet.devourLevel) || 0)
            + Math.max(0, Number(preyPet.devourLevel) || 0) + 1)
        label_addLevel.text = UtilsTool.stringFormat(StrVal.LYPET.STR107, [devourLevel])

        let label_petAttr1: fgui.GLabel = this.group_select1.getChild("label_petAttr1")
        label_petAttr1.text = UtilsTool.stringFormat(StrVal.LYPET.STR1, [devourLevel * Number(qualityArr[2])])
        let label_petAttr2: fgui.GLabel = this.group_select1.getChild("label_petAttr2")
        label_petAttr2.text = UtilsTool.stringFormat(StrVal.LYPET.STR2, [devourLevel * Number(qualityArr[0])])
        let label_petAttr3: fgui.GLabel = this.group_select1.getChild("label_petAttr3")
        label_petAttr3.text = UtilsTool.stringFormat(StrVal.LYPET.STR3, [devourLevel * Number(qualityArr[1])])
    }

    public static onStar(group_star: fgui.GComponent, petData): void {
        let starArr: fgui.GLoader[] = []
        for (let i = 1; i < 6; i++) {
            let starItem: fgui.GLoader = group_star.getChild("img_star" + i)
            starArr.push(starItem)
        }
        applyPetTransferStars(starArr, petData.devourLevel)
    }


    public static onPetGroup(group_pet: fgui.GComponent, petData: any): void {
        let group_buffs: Array<fgui.GComponent> = []
        for (let i = 0; i < 8; i++) {
            let group_buff: fgui.GComponent = group_pet.getChild("group_buff" + (i + 1))
            group_buffs.push(group_buff)
            let group_level: fgui.GGraph = group_buff.getChild("group_level")
            group_level.visible = false
            let img_quality: fgui.GLoader = group_buff.getChild("img_quality")
            img_quality.url = "ui://CCommon/frame_fangkuaidi0"
            let title: fgui.GLabel = group_buff.getChild("title")
            title.text = ""
            let img_wenhao: fgui.GImage = group_buff.getChild("img_wenhao")
            img_wenhao.visible = true
        }
        for (let i = 0; i < petData.buffSkill.length; i++) {
            let item = petData.buffSkill[i];
            let group_buff = group_buffs[i]

            UtilsUI.onPetQualityItem(group_buff, item)
        }

    }
    public getIsViewMask(): boolean {
        return false;
    }
}


