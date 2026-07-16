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
import { VarVal } from "../Values/VarVal";
import { LocaleUser } from "../Kernel/LocaleUser";
import { LyEliteGiftChoose } from "./LyEliteGiftChoose";
import { Vec2 } from "cc";
import { LyItemTips } from "./LyItemTips";

export class LyEliteDrawGift extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyEliteMonster";
        this.viewResI.pkgName = "LyEliteMonster";
        this.viewResI.comName = "LyEliteDrawGift";
    }

    private chooseId = null
    private refreshUI = null
    public onViewCreate(_params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        let group_null: fgui.GComponent = group_main.getChild("group_null")
        // let xmlRoot = LocaleData.getBrumeIsleConfig()
        getUiPanel.getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteDrawGift, 0, null);
        });
        group_main.getChild("btn_close").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyEliteDrawGift, 0, null);
        });
        let root = LocaleData.getEliteMonsterRoot()
        let playBase = GameServerData.getInstance().getPlayerFullInfo().base;
        let rewardData = playBase.elityMonsterDrawCardReward

        let showRewardData = [] 
        // for (let index = 0; index < rewardData.length; index++) {
        //     const element = rewardData[index];
        //     let inst:Boolean = true;
        //     for (let index2 = 0; index2 < showRewardData.length; index2++) {
        //         let data = showRewardData[index2];
        //         if (element == data.id) {
        //             inst = false
        //             data.count += 1
        //         }
        //     }
        //     if (inst) {
        //         let temp = {}
        //         temp["proto"] = LocaleData.getEliteDrawReward(element)
        //         temp["id"] = element
        //         temp["count"] = 1
        //         showRewardData.push(temp)
        //     }
        // }

        // showRewardData.sort((a, b): number=>{
        //     if (a.proto.quality == b.proto.quality) {
        //         return a.id - b.id
        //     }else{
        //         return Number(a.proto.quality) - Number(b.proto.quality)
        //     }
        // });

      

        let allDraw = root._specialguarantees[0]._item
        let bigBox =  group_main.getChild("n27", fgui.GLoader)
        bigBox.onClick(()=>{
            let _params = {
                bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, "", allDraw[allDraw.length-1].icon, "1"),
                pos:bigBox.localToGlobal(0, 0),
                size:new Vec2(bigBox.width, bigBox.height)
            }
            ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyItemTips, 0, _params);
        });
        group_main.getChild("label_title", fgui.GLabel).text  = StrVal.LYELITEMONSTER.STR56
        let group_pro = group_main.getChild("group_pro", fgui.GComponent)
        let list_box = group_main.getChild("list_n", fgui.GList)
        let pro_score = group_pro.getChild("pro_score", fgui.GProgressBar)
        let list_item = group_pro.getChild("list_item", fgui.GList)
        list_item.itemRenderer = (index: number, child: fgui.GComponent)=>{
            child.clearClick()
            let group_item: fgui.GComponent = child.getChild("item")
            let label_score: fgui.GLabel = child.getChild("label_score")
            let img = child.getChild("n12", fgui.GImage)
            if (index == 0) {
                group_item.visible = false
                label_score.text = "0"
                child.getChild("n10").visible = false
                label_score.grayed = false
                img.grayed = false
            }else{
                index = index - 1
                let drawProt = allDraw[index]
                group_item.visible = true
                label_score.text = drawProt.times
                child.getChild("n10").visible = true
                label_score.grayed = playBase.elityMonsterDrawCardRewardCount < Number(drawProt.times)
                img.grayed = playBase.elityMonsterDrawCardRewardCount < Number(drawProt.times)
                let proto = LocaleData.getItemProto(drawProt.icon)
                group_item.getChild("loader_back", fgui.GLoader3D).url =  UtilsTool.stringFormat("ui://CCommon/item_back{0}", [proto.quality]);
                group_item.getChild("loader_icon", fgui.GLoader3D).url =  UtilsTool.stringFormat("ui://CCommon/{0}", [proto.icon]);

                
                child.onClick(()=>{
                    let _params = {
                        bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, "", proto.id, "1"),
                        pos:group_item.localToGlobal(0, 0),
                        size:new Vec2(group_item.width, group_item.height)
                    }
                    ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, LyItemTips, 0, _params);
                });
            }
        }

        list_box.itemRenderer = (index: number, child:fgui.GComponent) =>{
            let data = showRewardData[index]
            let group_show = child.getChild("group_show", fgui.GComponent)
            let label_name = child.getChild("label_name", fgui.GLabel)
            let label_own = child.getChild("label_own", fgui.GLabel)
            let btn_com = child.getChild("btn_com", fgui.GButton)
            let proto = LocaleData.getItemProto(data[0].proto.icon)
            group_show.getChild("loader_back", fgui.GLoader3D).url =  UtilsTool.stringFormat("ui://CCommon/item_back{0}", [proto.quality]);
            group_show.getChild("loader_icon", fgui.GLoader3D).url =  UtilsTool.stringFormat("ui://CCommon/{0}", [proto.icon]);
            label_name.text = data[0].proto.text
            label_own.text = UtilsTool.stringFormat(StrVal.LYELITEMONSTER.STR57, [data.length]);
            btn_com.clearClick()
            btn_com.onClick(()=>{
                if (data[0].proto.type == "1") {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyEliteGiftChoose, 0, data[0].proto);
                }else{
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            this.chooseId = null
                            this.refreshUI()
                            UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([{ inserts: args.itemInserts }]) });
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } , "openSpecialguarantees", { itemId: Number(data[0].id), eliteMonsterProtoId: this.chooseId })
                }
            });
        }
        this.refreshUI = ()=>{
            playBase = GameServerData.getInstance().getPlayerFullInfo().base;
            rewardData = playBase.elityMonsterDrawCardReward
            showRewardData = [] 
            for (let index = 0; index < rewardData.length; index++) {
                const element = rewardData[index];
                let inst:Boolean = true;
                for (let index2 = 0; index2 < showRewardData.length; index2++) {
                    let data = showRewardData[index2];
                    let elProto = LocaleData.getEliteDrawReward(element)
                    if (elProto.group == data[0].proto.group) {
                        inst = false
                        data.count += 1
                        let temp = {}
                        temp["proto"] = elProto
                        temp["id"] = element
                        showRewardData[index2].push(temp)
                    }
                }
                if (inst) {
                    let showTemp = []
                    let temp = {}
                    temp["proto"] = LocaleData.getEliteDrawReward(element)
                    temp["id"] = element
                    showTemp.push(temp)
                    showRewardData.push(showTemp)
                }
            }
            showRewardData.sort((a, b): number=>{
                return Number(b[0].proto.group) - Number(a[0].proto.group)
            });
            pro_score.value = playBase.elityMonsterDrawCardRewardCount 

            group_pro.scrollPane.posX = (pro_score.value / pro_score.max) * pro_score.width
            pro_score.max = 200
            UtilsUI.setFguiGlistDelayNumItems(list_item, allDraw.length)
            UtilsUI.setFguiGlistDelayNumItems(list_box, showRewardData.length)
            group_null.visible = showRewardData.length == 0

        }
        this.refreshUI()
    }

  
    public onViewDestroy(): void {
        
    }

    private giftId:number;
    public onViewUpdate(params: any): void {
        this.refreshUI()
    }
   
    public getIsViewMask(): boolean {
        return false;
    }

    public static isViewRedPoint(){
        if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.elite)) {
            return false
        }
        let root = LocaleData.getEliteMonsterRoot() 
        let count = GameServerData.getInstance().getItemCountByProtoId(root.recruit_cost_item)
        if (count >= 5 && LocaleUser.getUser("LyEliteDrawRedPoint") != UtilsTool.TimeToDateStr( GameServerData.getInstance().getServerTime())) {
            return true
        }
    }
}


