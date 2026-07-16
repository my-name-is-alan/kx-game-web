//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";

export class LyChangeCharacter extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyCharacter";
        this.viewResI.pkgName = "LyCharacter";
        this.viewResI.comName = "LyChangeCharacter";
    }
    private uiPanel: fgui.GComponent
    public onViewCreate(params): void {
        this.uiPanel = this.getUiPanel()
        // 关闭
        let btn_close: fgui.GButton = this.uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyChangeCharacter, 0, null);
        })
        let fullInfo: any = GameServerData.getInstance().getPlayerFullInfo()

        let list_player: fgui.GList = this.uiPanel.getChild("list_player")
        let playerItems: any = LocaleData.getCharacterItems()
        let playerArr: any = []
        for (let i = 0; i < playerItems.length; i++) {
            let item = playerItems[i];
            if (item.id != fullInfo.base.character) {
                playerArr.push(item)
            }
        }
        let label_str26: fgui.GLabel = this.uiPanel.getChild("label_str26")
        label_str26.text = StrVal.LYCHARACTER.STR26
        let group_needItem: fgui.GComponent = this.uiPanel.getChild("group_needItem")
        let label_needItemCount: fgui.GLabel = group_needItem.getChild("label_number")
        let loader_item2: fgui.GLoader = group_needItem.getChild("loader_item")
        let dataItem: any = LocaleData.getCharacterRoot()
        loader_item2.url = UtilsTool.stringFormat("ui://CCommon/{0}", [dataItem.changeCharacterItemId])
        let itemCount = GameServerData.getInstance().getItemCountByProtoId(dataItem.changeCharacterItemId)
        label_needItemCount.text = UtilsTool.stringFormat("{0}/1", [itemCount])
        this.loader_spine = this.uiPanel.getChild("loader_spine")

        // list_player.itemRenderer = ((index: number, obj: fgui.GComponent) => {
        //     let title: fgui.GLabel = obj.getChild("title")
        //     title.text = playerArr[index].name
        // }).bind(this)
        let character: number = playerArr[0].id
        list_player.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            obj.onClick(() => {
                this.loadStage(playerArr[index])
                character = playerArr[index].id
            })
        }).bind(this)

        list_player.numItems = playerArr.length
        this.loadStage(playerArr[0])

        let btn_changeCharacter: fgui.GButton = this.uiPanel.getChild("btn_changeCharacter")
        btn_changeCharacter.text = StrVal.LYCHARACTER.STR27
        btn_changeCharacter.onClick(() => {
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyChangeCharacter, 0, null);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            }, "changeCharacter", {
                character: Number(character)
            })
        })
    };
    private loader_spine: fgui.GLoader3D
    private loadStage(playerArr: any): void {
        let satgeArr: any = LocaleData.getCharacterSuitArr(playerArr.suitGroup)
        let list_stage: fgui.GList = this.uiPanel.getChild("list_stage")
        list_stage.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            let title: fgui.GLabel = obj.getChild("title")
            if (LocaleData.getPlayerPhaseById(satgeArr[index].phase)) {
                title.text = LocaleData.getPlayerPhaseById(satgeArr[index].phase).phaseName
            }
            let models = LocaleData.getModelItem(satgeArr[index].modelId)
            let icon: fgui.GLoader = obj.getChild("icon")
            icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [models.avatar]);
            icon.clearClick()
            icon.onClick(() => {
                // UtilsUI.loadSpineAndShow(this.loader_spine, satgeArr[index].modelId);
            })
        }).bind(this)
        list_stage.numItems = satgeArr.length
        // UtilsUI.loadSpineAndShow(this.loader_spine, satgeArr[0].modelId);
    }




    public getIsViewMask(): boolean {
        return false;
    };

}