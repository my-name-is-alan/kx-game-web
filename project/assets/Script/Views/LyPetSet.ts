//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { GameServer } from "../Kernel/GameServer";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { StrVal } from "../Values/StrVal";
import { LocaleData } from "../Kernel/LocaleData";
import { LyPet } from "./LyPet";

export class LyPetSet extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyPet";
        this.viewResI.pkgName = "LyPet";
        this.viewResI.comName = "LyPetSet";
    }
    private petProtoId: number
    private petArr: any = []
    private uiPanel: fgui.GComponent
    public onViewCreate(_params: any): void {
        this.uiPanel = this.getUiPanel().getChild("group_petSet")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        let btn_close = this.getUiPanel().getChild("btn_close")
        let btn_close1 = this.uiPanel.getChild("btn_close1")
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPetSet, 0, null)
        })
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPetSet, 0, null)
        })

        LocaleData.getPetRoot().guarantees_choice.split(",").forEach(element => {
            let item = LocaleData.getPetProto(element)
            this.petArr.push(item)
        });

        let list_pet: fgui.GList = this.uiPanel.getChild("list_pet")
        list_pet.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            obj.getChild("title").text = this.petArr[index].name
            let img_icon: fgui.GLoader = obj.getChild("img_icon")
            let showInfo = LocaleData.getModelShowInfo(String(this.petArr[index].modelId));
            img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [showInfo.icon_square])
            // obj.getChild("label_level").text = samePet[index].level

        }).bind(this)
        list_pet.selectedIndex = 0
        list_pet.numItems = this.petArr.length
        list_pet.on(fgui.Event.CLICK_ITEM, (onClickitem: fgui.GButton) => {
            let index = list_pet.childIndexToItemIndex(list_pet.getChildIndex(onClickitem))
            this.onPetInfo(index)
        }, this)
        this.onPetInfo(0)
        let btn_setpetpitysystem: fgui.GButton = this.uiPanel.getChild("btn_setpetpitysystem")
        btn_setpetpitysystem.text = StrVal.LYPET.STR64
        btn_setpetpitysystem.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPet, 0, { isPetSet: true });
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPetSet, 0, null)
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "setpetpitysystem", {
                petProtoId: this.petProtoId
            })
        })
        let label_str62: fgui.GLabel = this.uiPanel.getChild("label_str62")
        label_str62.text = StrVal.LYPET.STR62
        let label_str63: fgui.GLabel = this.uiPanel.getChild("label_str63")
        label_str63.text = StrVal.LYPET.STR63
    }
    private onPetInfo(index): void {
        let label_name = this.uiPanel.getChild("label_name")
        label_name.text = this.petArr[index].name
        let label_level = this.uiPanel.getChild("label_level")
        let petLevel: any = LocaleData.getPetLevelByIdLevel(this.petArr[index].id, "1")


        let label_skillDec = this.uiPanel.getChild("label_skillDec")
        label_skillDec.text = LocaleData.getSkillProto(petLevel.skill_id).desc
        this.petProtoId = this.petArr[index].id

        let group_icon: fgui.GComponent = this.uiPanel.getChild("group_icon")
        let img_icon: fgui.GLoader = group_icon.getChild("img_icon")
        let showInfo = LocaleData.getModelShowInfo(String(this.petArr[index].modelId));
        img_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [showInfo.icon_square])
        // label_name.text= this.petArr[index].name
    }

    public getIsViewMask(): boolean {
        return false;
    }
}


