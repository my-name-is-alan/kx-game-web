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

export class LyBrumeNote extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyBrumeIsle";
        this.viewResI.pkgName = "LyBrumeIsle";
        this.viewResI.comName = "LyBrumeNote";
    }
    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        let main_map: fgui.GComponent= getUiPanel.getChild("main_map")
        getUiPanel.getChild("btn_back", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeNote, 0, null);
        }); 
        group_main.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeNote, 0, null);
        })
        let list_note: fgui.GList = group_main.getChild("list_note")
        let fullInfo = GameServerData.getInstance().getPlayerFullInfo()
        let isLeData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster
        let paseDay = isLeData.openDay
        let noteDatas = LocaleData.getBrumeIsleNote(paseDay, 1)
        let xmlRoot = LocaleData.getBrumeIsleConfig()
        list_note.itemRenderer = (index:number , child:fgui.GComponent)=>{
            let label_name = child.getChild("label_name", fgui.GLabel)
            let list_reward = child.getChild("list_reward", fgui.GList)
            let label_desc = child.getChild("label_desc", fgui.GLabel)
            let loader_img = child.getChild("loader_img", fgui.GLoader)
            let label_rewardName = child.getChild("label_rewardName", fgui.GLabel)
            let note = noteDatas[index];
            let bounItems = []
            if (note.monsterId) { //怪物
                let monsterProto = LocaleData.getMonsterProto(note.monsterId)
                let modelShowInfo = LocaleData.getModelShowInfo(monsterProto.modelId);
                new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                    spp.playAnimation(VarVal.SPINE_ANI_NAME.stand, true)
                }, child.getChild("loader3d_monster"), modelShowInfo.spine);
                label_name.text = modelShowInfo.name
                let boids = note.bonuses.split("-")
                for (let index = 0; index < boids.length; index++) {
                    let id = boids[index];
                    let bs = UtilsUI.getBonuseItemsByBonusesId(id)
                    for (let index = 0; index < bs.length; index++) {
                        const element = bs[index];
                        bounItems.push(element)
                    }
                }
            }else{
                label_name.text = note.name
                bounItems = UtilsUI.getBonuseItemsByBonusesId(note.bonuses)
                if (note.type == "1") { //宝箱
                    loader_img.url = UtilsUI.getItemIconUrl(note.value)
                    if (note.value == VarVal.bonusType.brumeIsleBox1) {
                        bounItems = UtilsUI.getBonuseItemsByBonusesId(xmlRoot.silverBonuse)
                    }else{
                        bounItems = UtilsUI.getBonuseItemsByBonusesId(xmlRoot.goldenBonuse)
                    }
                }else if(note.type == "2"){ //商人
                    loader_img.icon = "ui://LyBrumeIsle/frame_zhaomin"
                }else if(note.type == "3"){ // 白给破车
                    loader_img.url = "ui://LyBrumeIsle/frame_qianrenyiwu"
                }
            }
            list_reward.itemRenderer = (index1: number, child1:fgui.GComponent)=>{
                UtilsUI.setUIGroupItem(bounItems[index1], child1, null);
            };
            UtilsUI.setFguiGlistDelayNumItems(list_reward, bounItems.length);
            let descTextData = LocaleData.getBrumeIsleText(note.descText)
            label_desc.text = descTextData.descText
            label_rewardName.text = descTextData.titleText
        }
        UtilsUI.setFguiGlistDelayNumItems(list_note, noteDatas.length);

        let btn_1 = group_main.getChild("btn_1", fgui.GButton)
        btn_1.text = LocaleData.getBrumeIsleZone(1).name
        let btn_2 = group_main.getChild("btn_2", fgui.GButton)
        btn_2.text = LocaleData.getBrumeIsleZone(2).name
        let btn_3 = group_main.getChild("btn_3", fgui.GButton)
        btn_3.text = LocaleData.getBrumeIsleZone(3).name

        btn_1.onClick(()=>{
            noteDatas = LocaleData.getBrumeIsleNote(paseDay, 1)
            list_note.numItems = noteDatas.length
        });
        btn_2.onClick(()=>{
            noteDatas = LocaleData.getBrumeIsleNote(paseDay, 2)
            list_note.numItems = noteDatas.length
        });
        btn_3.onClick(()=>{
            noteDatas = LocaleData.getBrumeIsleNote(paseDay, 3)
            list_note.numItems = noteDatas.length
        });
    }

    public onViewUpdate(params: any): void {
        
    }
    public getIsViewMask(): boolean {
        return false;
    }
}


