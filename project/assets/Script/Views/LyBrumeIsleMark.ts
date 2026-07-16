//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { LyGuideDetail } from "./LyGuideDetail";
import { LyChatRoom } from "./LyChatRoom";
import { GameServer } from "../Kernel/GameServer";
import { LyBrumeIsleLand } from "./LyBrumeIsleLand";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { Vec2 } from "cc";
import { FguiGTween } from "../Kernel/FguiGTween";

export class LyBrumeIsleMark extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyBrumeIsle";
        this.viewResI.pkgName = "LyBrumeIsle";
        this.viewResI.comName = "LyBrumeIsleMark";
    }
    public onViewCreate(params:any): void {

        let isLeData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        getUiPanel.getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleMark, 0, null);
        }); 
        group_main.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleMark, 0, null);
        })
        UtilsUI.playCommonGroupAni(group_main, null);
        
        let group_now: fgui.GComponent = group_main.getChild("group_now")
        let group_next: fgui.GComponent = group_main.getChild("group_next")
        let btn_get = group_main.getChild("btn_get", fgui.GButton)
        btn_get.text = StrVal.LyBRUMEISLE.STR28
        btn_get.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleMark, 0, null);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"markMonsterHelp", null);
        });

        let monsterData = isLeData.moarkMonsterList[0]
        let setGroup = (group:fgui.GComponent , monsterDataId, i: number)=>{
            let monsterEvent = LocaleData.getBrumeIsleMonster(monsterDataId)
            console.log(monsterEvent)
            let monsterProto = LocaleData.getMonsterProto(monsterEvent.monsterId)
            let modelShowInfo = LocaleData.getModelShowInfo(monsterProto.modelId);
            new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true)
            }, group.getChild("loader3d_monster"), modelShowInfo.spine);
            group.getChild("label_monstername").text = modelShowInfo.name
            let boids = monsterEvent.bonuses.split("-")
            let bounItems = []
            for (let index = 0; index < boids.length; index++) {
                let id = boids[index];
                let bs = UtilsUI.getBonuseItemsByBonusesId(id)
                for (let index = 0; index < bs.length; index++) {
                    const element = bs[index];
                    bounItems.push(element)
                }
            }
            let list_item: fgui.GList = group.getChild("list_item")
            list_item.itemRenderer = (index1: number, child1:fgui.GComponent)=>{
                UtilsUI.setUIGroupItem(bounItems[index1], child1, null);
            };
            UtilsUI.setFguiGlistDelayNumItems(list_item, bounItems.length);
            
            let bar_hp: fgui.GProgressBar = group.getChild("bar_hp")

            let loader_now = group.getChild("loader_now", fgui.GLoader)
            if (i == 1) { //当前
                bar_hp.max = isLeData.curMonsterMaxHP
                bar_hp.value = isLeData.curMonsterHP
                loader_now.url = "ui://LyBrumeIsle/frame_dangqian"
            }else{ //已标记
                bar_hp.max = monsterData.monsterMAXHP
                bar_hp.value = monsterData.monsterCURHP
                loader_now.url =  "ui://LyBrumeIsle/frame_yibiao" 
            }
            group.getChild("label_desc", fgui.GLabel).text = LocaleData.getBrumeIsleText(monsterEvent.descText).titleText
        }
        setGroup(group_now, params.markMonsterId, 1)
        setGroup(group_next, monsterData.monsterConfigID, 2)
    }

    public onViewDestroy(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyBrumeIsleLand, 0, { isUpdate: true });
    }
    public getIsViewMask(): boolean {
        return false;
    }
}


