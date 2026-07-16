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
import { LocaleData, ModelShowInfo } from "../Kernel/LocaleData";
import { SpinePlayer, SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { UtilsTool } from "../Kernel/UtilsTool";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { VarVal } from "../Values/VarVal";
import { LyClanSolo } from "./LyClanSolo";
import { LyClanSoloMain } from "./LyClanSoloMain";
import { LyCompanionInfo } from "./LyCompanionInfo";

export class LyClanSoloBattleResult extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyClanSolo";
        this.viewResI.pkgName = "LyClanSolo";
        this.viewResI.comName = "LyClanSoloBattleResult";
    }
    private uiPanel: fgui.GComponent
    private battleOver: any
    public onViewCreate(params): void {
        this.battleOver = params.battleOver
        this.uiPanel = this.getUiPanel().getChild("main")
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClanSolo, 0, null);
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloMain, 0, null);
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloBattleResult, 0, null);
        })
        let label_ok: fgui.GButton = this.uiPanel.getChild("label_ok");
        label_ok.text = StrVal.LYCLANSOLO.STR55
        label_ok.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClanSolo, 0, null);
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloMain, 0, null);
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyClanSoloBattleResult, 0, null);
        })

        this.uiPanel.getChild("label_str52", fgui.GLabel).text = StrVal.LYCLANSOLO.STR52
        this.uiPanel.getChild("label_str53", fgui.GLabel).text = StrVal.LYCLANSOLO.STR53
        this.uiPanel.getChild("label_str54", fgui.GLabel).text = StrVal.LYCLANSOLO.STR54

        let img_title: fgui.GLoader = this.uiPanel.getChild("img_title")
        let label_dec: fgui.GLabel = this.uiPanel.getChild("label_dec")
        let win = LocaleData.getClanSoloWin()

        if (this.battleOver.onceWinCount >= this.battleOver.clanNumber) {
            for (let i = 0; i < win.length; i++) {
                const element = win[i];
                if (element.winCountRange == "-1") {
                    label_dec.text = UtilsTool.stringFormat(element.text, [this.battleOver.server, this.battleOver.clanName, this.battleOver.onceWinCount])
                    img_title.url = UtilsTool.stringFormat("ui://LyClanSolo/{0}", [element.icon]);
                    break
                }
            }
        } else if (this.battleOver.onceWinCount == 0) {
            for (let i = 0; i < win.length; i++) {
                const element = win[i];
                if (element.winCountRange == "0" || element.winCountRange == "") {
                    label_dec.text = UtilsTool.stringFormat(element.text, [this.battleOver.server, this.battleOver.clanName, this.battleOver.onceWinCount])
                    img_title.url = UtilsTool.stringFormat("ui://LyClanSolo/{0}", [element.icon]);
                    break
                }
            }
        } else {
            for (let i = 0; i < win.length; i++) {
                const element = win[i];
                let winCountRangeStr = element.winCountRange.split(",")
                if (winCountRangeStr[1]) {
                    if (Number(winCountRangeStr[0]) <= this.battleOver.onceWinCount && Number(winCountRangeStr[1]) >= this.battleOver.onceWinCount) {
                        label_dec.text = UtilsTool.stringFormat(element.text, [this.battleOver.server, this.battleOver.clanName, this.battleOver.onceWinCount])
                        img_title.url = UtilsTool.stringFormat("ui://LyClanSolo/{0}", [element.icon]);
                        break
                    }
                }
            }
        }

        let label_oncePrestige: fgui.GLabel = this.uiPanel.getChild("label_oncePrestige")
        label_oncePrestige.text = this.battleOver.fightFrom == 0 ? "+100" : "+200"

        let label_winScoreChange: fgui.GLabel = this.uiPanel.getChild("label_winScoreChange")
        label_winScoreChange.text = "+" + this.battleOver.winScoreChange
        let label_opponentClanScoreChange: fgui.GLabel = this.uiPanel.getChild("label_opponentClanScoreChange")
        label_opponentClanScoreChange.text = "-" + this.battleOver.lossScoreChange
        let label_onceWinCount: fgui.GLabel = this.uiPanel.getChild("label_onceWinCount")
        label_onceWinCount.text = UtilsTool.stringFormat(StrVal.LYCLANSOLO.STR51, [this.battleOver.onceWinCount])

        let group_spine_ram: fgui.GComponent = this.uiPanel.getChild("group_spine_ram")
        let loader_spine_pet: fgui.GLoader3D = this.uiPanel.getChild("loader_spine_pet")

        let fullInfoBase: any = GameServerData.getInstance().getPlayerFullInfo().base
        let charInfo: ModelShowInfo = LocaleData.getCharShowResInfo(fullInfoBase.character, fullInfoBase.phase, fullInfoBase.appearance, fullInfoBase.avatar);
        let mountInfo = LocaleData.getMountShowResInfo(fullInfoBase.mountType, fullInfoBase.mountSkin);
        new SpineRoldMountPlayer(group_spine_ram).loadSpineRole(charInfo).loadSpineMount(mountInfo);
        if (fullInfoBase.summonPet && String(fullInfoBase.summonPet).length > 1) {
            let petProto = LocaleData.getPetProto(GameServerData.getInstance().getProtoIdByItemInstId().protoId);
            new SpinePlayer().loadSpineByModelId((spp: SpinePlayer) => {
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true);
            }, loader_spine_pet, petProto.modelId);
        }
    };

    public getIsViewMask(): boolean {
        return false;
    };

}