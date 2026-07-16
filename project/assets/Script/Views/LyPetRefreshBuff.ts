//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { applyPetTransferStars, petBuffLevel, petTransferProgress } from "./PetTransferDisplay";
import { GameServer } from "../Kernel/GameServer";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { LyPet } from "./LyPet";
import { GameServerData } from "../Kernel/GameServerData";
import { Color } from "cc";
import { VarVal } from "../Values/VarVal";
import { SpinePlayer } from "../Kernel/SpinePlayer";

export class LyPetRefreshBuff extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyPet";
        this.viewResI.pkgName = "LyPet";
        this.viewResI.comName = "LyPetRefreshBuff";
    }
    private static isCancel: boolean = false;
    private petProtoId: number
    private petArr: any = []
    private uiPanel: fgui.GComponent
    private petProto: any
    private petPosition: number
    private params: any
    public onViewCreate(_params: any): void {
        this.params = _params
        this.petPosition = this.params.petPosition
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        let btn_close = this.getUiPanel().getChild("btn_close")
        let btn_close1 = this.uiPanel.getChild("btn_close1")
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPetRefreshBuff, 0, null)
        })
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPetRefreshBuff, 0, null)
        })
        // this.petProto.refreshBuffSkill = [1, 105, 111, 1]
        this.uiPanel.getChild("label_str124").text = StrVal.LYPET.STR124
        this.uiPanel.getChild("label_str125").text = StrVal.LYPET.STR125
        this.uiPanel.getChild("label_str126").text = StrVal.LYPET.STR126
        this.uiPanel.getChild("label_str127").text = StrVal.LYPET.STR127
        this.uiPanel.getChild("label_str129").text = StrVal.LYPET.STR129


        this.initialize()
        this.uiPanel.getChild("label_str129").text = StrVal.LYPET.STR129
            + "  " + petTransferProgress(this.petProto.devourLevel)
        let pet = LocaleData.getPetProto(this.petProto.protoId)
        new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
            spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
        }, this.uiPanel.getChild("loader_spine"), pet.modelId);
        let starArr: fgui.GLoader[] = []
        let group_star: fgui.GComponent = this.uiPanel.getChild("group_star")
        for (let i = 1; i < 6; i++) {
            let starItem: fgui.GLoader = group_star.getChild("img_star" + i)
            starArr.push(starItem)
        }

        applyPetTransferStars(starArr, this.petProto.devourLevel)
    }
    private lockArr: number[] = [0, 0, 0, 0]
    private initialize() {
        let petArr = GameServerData.getInstance().getPlayerFullInfo().petModuleInfo.pet
        for (let i = 0; i < petArr.length; i++) {
            let element = petArr[i];
            if (element.id == this.params.petProto.id) {
                this.petProto = element
                break
            }
        }
        let group_buffs: Array<fgui.GComponent> = []
        for (let i = 0; i < 4; i++) {
            let group_buff: fgui.GComponent = this.uiPanel.getChild("group_oldBuff" + (i + 1))
            group_buffs.push(group_buff)
        }
        for (let i = 0; i < this.petProto.buffSkill.length; i++) {
            let item = this.petProto.buffSkill[i];
            let group_buff = group_buffs[i]
            UtilsUI.onPetQualityItem(group_buff, item)

            if (this.petProto.refreshBuffSkill.length > 0) {
                let group_suo = group_buff.getChild("group_suo")
                group_suo.visible = this.petProto.refreshBuffSkill[i] == 1
            }
        }
        for (let i = 0; i < 4; i++) {
            let btn_suo: fgui.GButton = this.uiPanel.getChild("btn_suo" + (i + 1))
            group_buffs[i].getChild("group_suo").visible = this.lockArr[i] == 1
            btn_suo.selected = this.lockArr[i] == 1
            btn_suo.clearClick()
            btn_suo.onClick(() => {
                let a = 0
                for (let j = 0; j < this.lockArr.length; j++) {
                    const element = this.lockArr[j];
                    if (this.lockArr[j] == 1) {
                        a++
                    }
                }
                if (a < 3 || this.lockArr[i] == 1) {
                    group_buffs[i].getChild("group_suo").visible = !btn_suo.selected
                    btn_suo.selected = !btn_suo.selected
                    this.lockArr[i] = !btn_suo.selected ? 0 : 1
                } else {
                    UtilsUI.showMsgTip(StrVal.LYPET.STR17)
                }
                this.onRefreshBuffGroup()
            })
        }

        let c1: fgui.Controller = this.uiPanel.getController("c1")
        let btn_refreshBuffSkill: fgui.GButton = this.uiPanel.getChild("btn_refreshBuffSkill")
        btn_refreshBuffSkill.text = StrVal.LYPET.STR128
        btn_refreshBuffSkill.clearClick()
        btn_refreshBuffSkill.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    this.onRefreshBuffSkill(args.buffArr)
                    c1.selectedIndex = 1
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "refreshBuffSkill", {
                instID: this.petProto.id,
                lockArr: this.lockArr
            })
        })
        if (this.petProto.refreshBuffSkill.length > 0) {
            c1.selectedIndex = 1
            this.onRefreshBuffSkill(this.petProto.refreshBuffSkill)
        } else {
            c1.selectedIndex = 0
        }
        let btn_cancel: fgui.GButton = this.uiPanel.getChild("btn_cancel")
        btn_cancel.text = StrVal.LYPET.STR130
        btn_cancel.clearClick()
        btn_cancel.onClick(() => {
            this.onSaveRefreshBuffSkill(false)

        })
        let btn_saveRefreshBuffSkill: fgui.GButton = this.uiPanel.getChild("btn_saveRefreshBuffSkill")
        btn_saveRefreshBuffSkill.text = StrVal.LYPET.STR131
        btn_saveRefreshBuffSkill.clearClick()
        btn_saveRefreshBuffSkill.onClick(() => {

            if (LyPetRefreshBuff.isCancel) {
                this.onSaveRefreshBuffSkill(true)
            } else {
                UtilsUI.showMsgBox(VarVal.LyMsgBox.STYLE_TWO, "",
                    StrVal.LYPET.STR121, null,
                    StrVal.COMMON.STR32, null,
                    StrVal.COMMON.STR33, (isCheckSel: boolean) => {
                        LyPetRefreshBuff.isCancel = isCheckSel;
                        this.onSaveRefreshBuffSkill(true)
                    }, "", null, {
                    checkBoxText: StrVal.COMMON.STR35
                })
            }
        })
        this.onRefreshBuffGroup()
    }

    private onRefreshBuffGroup(): void {
        let c2: fgui.Controller = this.uiPanel.getController("c2")
        let lockIndex = 0

        for (let j = 0; j < this.lockArr.length; j++) {
            const element = this.lockArr[j];
            if (this.lockArr[j] == 1) {
                lockIndex++
            }
        }
        let group_coin1: fgui.GComponent = this.uiPanel.getChild("group_coin1")
        let group_coin2: fgui.GComponent = this.uiPanel.getChild("group_coin2")

        let refreshBuffGroup = LocaleData.getPetrefreshBuffGroupByLockCnt(lockIndex)
        let bounseArr = refreshBuffGroup.costID.split(";")

        let loader_item1: fgui.GLoader = group_coin1.getChild("loader_item")
        let label_number1: fgui.GTextField = group_coin1.getChild("label_number")

        let item1 = bounseArr[0].split(",")
        let item1Proto = LocaleData.getItemProto(item1[1])
        let item1Count = GameServerData.getInstance().getItemCountByProtoId(item1[1])
        label_number1.text = UtilsTool.stringFormat("{0}/{1}", [item1Count, item1[2]])
        label_number1.color = UtilsUI.getEnoughColor(Number(item1Count) >= Number(item1[2]));

        loader_item1.url = UtilsTool.stringFormat("ui://CCommon/{0}", [item1Proto.icon]);
        if (lockIndex == 0) {
            c2.selectedIndex = 0
        } else {
            let loader_item2: fgui.GLoader = group_coin2.getChild("loader_item")
            let label_number2: fgui.GTextField = group_coin2.getChild("label_number")

            let item2 = bounseArr[1].split(",")
            let item2Proto = LocaleData.getItemProto(item2[1])
            let item2Count = GameServerData.getInstance().getItemCountByProtoId(item2[1])
            label_number2.text = UtilsTool.stringFormat("{0}/{1}", [item2Count, item2[2]])
            label_number2.color = UtilsUI.getEnoughColor(Number(item2Count) >= Number(item2[2]));
            loader_item2.url = UtilsTool.stringFormat("ui://CCommon/{0}", [item2Proto.icon]);


            c2.selectedIndex = 1
        }
    }
    private onSaveRefreshBuffSkill(isSave: boolean): void {
        UtilsUI.lockWait()
        GameServer.getInstance().send((args: any) => {
            UtilsUI.unlockWait()
            if (args.errorcode == 0) {
                this.initialize()
                ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPet, 0, { petPosition: this.petPosition });
            } else {
                UtilsUI.showMsgTip(args.errorcode)
            }
        }, "saveRefreshBuffSkill", {
            instID: this.petProto.id,
            isSave: isSave
        })
    }

    private onRefreshBuffSkill(buffArr): void {
        let group_buffs: Array<fgui.GComponent> = []
        for (let i = 0; i < 4; i++) {
            let group_buff: fgui.GComponent = this.uiPanel.getChild("group_newBuff" + (i + 1))
            group_buffs.push(group_buff)
        }
        for (let i = 0; i < buffArr.length; i++) {
            let item = buffArr[i];
            // let item = this.petProto.buffSkill[i];
            let item1 = this.petProto.buffSkill[i]

            let group_buff = group_buffs[i]
            let label_level: fgui.GLabel = group_buff.getChild("label_level")
            let title: fgui.GTextField = group_buff.getChild("title")
            let img_quality: fgui.GLoader = group_buff.getChild("img_quality")
            let buff = LocaleData.getPetBuffById(item == 1 ? item1.buffId : item)

            let colorStr
            if (buff.buffQuality == "1") {
                colorStr = new Color(32, 69, 164, 255);
            } else if (buff.buffQuality == "2") {
                colorStr = new Color(106, 56, 138, 255);
            } else if (buff.buffQuality == "3") {
                colorStr = new Color(164, 81, 32, 255);
            }

            title.strokeColor = colorStr
            title.text = buff.buffName
            label_level.text = petBuffLevel(item1.buffLevel)
            img_quality.url = UtilsTool.stringFormat("ui://CCommon/frame_fangkuaidi{0}", [buff.buffQuality]);
            let group_level: fgui.GGraph = group_buff.getChild("group_level")
            group_level.visible = true
            let img_wenhao: fgui.GImage = group_buff.getChild("img_wenhao")
            img_wenhao.visible = false
            // UtilsUI.onPetQualityItem(group_buff, item)
        }

    }

    public getIsViewMask(): boolean {
        return false;
    }
}


