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
import { Color, color, math } from "cc";
import { GameServer } from "../Kernel/GameServer";
import { GuideManager } from "../Kernel/GuideManager";
import { LocaleUser } from "../Kernel/LocaleUser";

export class LyBuddyMassGL extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyEliteMonster";
        this.viewResI.pkgName = "LyEliteMonster";
        this.viewResI.comName = "LyBuddyMassGL";
    }
    
    public onViewCreate(params:any): void {
        let rewardData = params
        this.getUiPanel().getChild("btn_back").onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBuddyMassGL, 0, null);
        });
        let uiPanel = this.getUiPanel().getChild("main", fgui.GComponent);
        UtilsUI.playCommonGroupAni(uiPanel, null);
        uiPanel.getChild("label_title", fgui.GLabel).text = StrVal.LYBUDDYMASS.STR11;
        uiPanel.getChild("btn_close", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBuddyMassGL, 0, null);
        });
        let list_all: fgui.GList = uiPanel.getChild("list_all")
        let all = []
        for (let index = 0; index < rewardData.length; index++) {
            const element1 = rewardData[index];
            if (all.length == 0) {
                all.push([element1])
            }else{
                let isOwn = false
                for (let index2 = 0; index2 < all.length; index2++) {
                    const element2 = all[index2];
                    for (let index3 = 0; index3 < element2.length; index3++) {
                        const element3 = element2[index3];
                        if (element3.quality == element1.quality) {
                            all[index2].push(element1)
                            isOwn = true
                            break
                        }
                    }
                    if (isOwn) {
                        break
                    }
                }
                if (!isOwn) {
                    all.push([element1])
                }
            }
        }

        all.sort((a, b): number=>{
            return Number(b[0].quality)  - Number(a[0].quality)
        });

        // for (let index = 0; index < all.length; index++) {
        //     all[index].sort((a, b):number=>{
        //         return Number(a.quality) - Number(b.quality)
        //     });
        // }
        let quaQz = []
        let allqz = 0
        for (let index = 0; index < all.length; index++) {
            let element = all[index];
            let quanzhong = 0
            for (let index2 = 0; index2 < element.length; index2++) {
                let element2 = element[index2];
                quanzhong = Number(element2.rate) + quanzhong
                allqz = allqz + Number(element2.rate)
            }    
            quaQz.push(quanzhong)
        }

        let NAME =["稀有奖励", "高级奖励", "普通奖励"]
        list_all.itemRenderer= (index:number, child:fgui.GComponent)=>{
            let oneData = all[index] 
            child.getChild("label_desc", fgui.GLabel).text = NAME[index];
            child.getChild("label_gv", fgui.GLabel).text = ((quaQz[index] / allqz)*100).toFixed(2) + "%"
            let list_item: fgui.GList = child.getChild("list_item")
            let bonArr = []
            for (let index2 = 0; index2 < oneData.length; index2++) {
                let bonuseItem = null
                if (Number(oneData[index2].type) == 1) {
                    bonuseItem = UtilsUI.getBonuseItem(VarVal.bonusType.item, null, oneData[index2].protoId, oneData[index2].count)
                }else{
                    bonuseItem = UtilsUI.getBonuseItem(oneData[index2].type, null, null, oneData[index2].count)
                }
                bonArr.push(bonuseItem)
            }
            bonArr.sort((a, b): number=>{
                let aqua = Number(a.proto.quality)
                let bqua = Number(b.proto.quality)
                return bqua - aqua
            });
            list_item.itemRenderer = (index2: number, child2:fgui.GComponent)=>{
                let group_item = child2.getChild("group_item", fgui.GComponent)
                let label_name = child2.getChild("label_name", fgui.GTextField)
                let bonuseItem = bonArr[index2]
                UtilsUI.setUIGroupItem(bonuseItem, group_item, null);
                label_name.text = bonuseItem.proto.name;
                label_name.color = new Color(106, 106, 106)
            }
            list_item.numItems = bonArr.length
        }
        list_all.numItems = all.length
    }
   
    public getIsViewMask(): boolean {
        return false;
    }
}


