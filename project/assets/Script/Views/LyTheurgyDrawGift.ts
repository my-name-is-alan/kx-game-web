//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { GameServerData } from "../Kernel/GameServerData";
import { GameServer } from "../Kernel/GameServer";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { LocaleData } from "../Kernel/LocaleData";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";
import { VarVal } from "../Values/VarVal";

export class LyTheurgyDrawGift extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyTheurgy";
        this.viewResI.pkgName = "LyTheurgy";
        this.viewResI.comName = "LyTheurgyDrawGift";
    }
    public useItemId = 120041
    private effArr = []
    private showReward : Function
    private time = 0
    public onViewCreate(_params:any):void {
        let playBase =  GameServerData.getInstance().getPlayerFullInfo().base

        this.getUiPanel().getChild("btn_back", fgui.GButton).onClick(()=>{
            PointRedData.getInstance().updatePointChild(PointRedType.LyTheurgy)
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgyDrawGift, 0, null)
        })
        let uiPanel = this.getUiPanel().getChild("main", fgui.GComponent)
        let btn_close = uiPanel.getChild("btn_close")
        btn_close.onClick(()=> {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyTheurgyDrawGift, 0, null)
        })
        UtilsUI.playCommonGroupAni(uiPanel, null)
        
        //theurgyDeriveSpecialBonusesList
        let group_arr : Array<fgui.GComponent> = []
        for (let index = 1; index <= 10; index++) {
            group_arr.push(uiPanel.getChild("group_item" + index))
        }

        for (let index = 0; index < group_arr.length; index++) {
            let child = group_arr[index]
            let group_item = child.getChild("Group_item", fgui.GComponent)
            let data = LocaleData.getTheurgProbability(index + 1)
            UtilsUI.setUIGroupItem(UtilsUI.getBonuseItem(VarVal.bonusType.item, "", data.bonusesId, "1"), group_item, null, true);
            group_item.getChild("loader_back").visible = false
        }
        let group_get = uiPanel.getChild("group_get", fgui.GGroup)
        let draw = uiPanel.getChild("draw", fgui.GButton)
        let pro_score = draw.getChild("pro_score", fgui.GProgressBar);
        let list_item = draw.getChild("list_item", fgui.GList);
        let group_itemMax = uiPanel.getChild("group_itemMax", fgui.GComponent)
        let btn_dw = uiPanel.getChild("btn_dw", fgui.GButton)
        let btn_get = uiPanel.getChild("btn_get", fgui.GButton)
        let label_have = btn_dw.getChild("label_have", fgui.GLabel)
        let loader_use = btn_dw.getChild("loader_use", fgui.GLoader)
        loader_use.url = UtilsUI.getItemIconUrl(this.useItemId)
        let loader3D_book = uiPanel.getChild("loader3D_book", fgui.GLoader3D)
        let spine_book = new SpinePlayer().loadSpine((spp:SpinePlayer) => {
            spp.playAnimation("Stand2", true);
        }, loader3D_book, "jm_feipan_shu");

        let guar = LocaleData.getTheurgAllGuarantees()
        pro_score.width = 61 * guar.length + (22 * (guar.length))
        let maxGuar = guar[guar.length - 1]
        UtilsUI.setUIGroupItem(UtilsUI.getBonuseItemsByBonusesId(maxGuar.bonuses)[0], group_itemMax, null, true);
        group_itemMax.getChild("loader_back").visible = false
        uiPanel.getChild("n3", fgui.GLabel).text = guar[guar.length - 1].time
        list_item.itemRenderer = (index:number, child: fgui.GComponent)=>{
            let label_score = child.getChild("label_score")
            let con_type = child.getController("c1")
            if (index == 0) {
                con_type.selectedIndex = 0
                label_score.text = "0"
                child.getChild("group_item", fgui.GComponent).visible = false
            }else{
                let data = guar[index -1]
                if (playBase.theurgyDeriveSpecialCount >= Number(data.time)) {
                    con_type.selectedIndex = 0
                }else{
                    con_type.selectedIndex = 1
                }
                UtilsUI.setUIGroupItem(UtilsUI.getBonuseItemsByBonusesId(data.bonuses)[0], child.getChild("group_item", fgui.GComponent), null)
                label_score.text = data.time
            }
        }
        
        let allBonuseItems = []
        let timeAdd = 0
        let clickTimes = 0

        this.showReward = ()=>{
            if (allBonuseItems.length > 0) {
                UtilsUI.showItemReward({ bonuseItems: allBonuseItems});
            }
            for (let index = 0; index < this.effArr.length; index++) {
                this.effArr[index].dispose()
            }
            allBonuseItems = []
            clickTimes = 0
            btn_dw.enabled = false
            this.setTimeout(()=>{
                btn_dw.enabled = true
            }, 500)
        }
       
        btn_dw.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    clickTimes = clickTimes + 1
                    let mGCom :fgui.GComponent = fgui.UIPackage.createObject("LyTheurgy", "group_effect").asCom;
                    group_arr[args.id - 1].addChild(mGCom)
                    mGCom.setPosition(10,10)
                    new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                        spp.playAnimation("animation", false);
                    }, mGCom.getChild("loader_effect", fgui.GLoader3D), "jm_miji_feibian");
                    this.effArr.push(mGCom)
                    let onuseItems = UtilsUI.getBonuseItemsByString(GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]));
                    for (let index = 0; index < onuseItems.length; index++) {
                        allBonuseItems.push(onuseItems[index]) ;
                    }
                    console.log("clickTimes" + clickTimes)
                    if (clickTimes >= 10) {
                        this.time = 0
                        this.showReward()
                    }else{
                        this.time = 1
                    }
                    refrehUI()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } , "takeTheurgySpecialLottery", null);
        });
        this.setViewBehaviour(true)
        btn_get.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult]) });
                    refrehUI()
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } , "takeTheurgySpecialBonuses", null);
        });
    
        let refrehUI = ()=>{
            playBase =  GameServerData.getInstance().getPlayerFullInfo().base
            label_have.text = String(GameServerData.getInstance().getItemCount(this.useItemId)) 
            pro_score.getChild("bar").width = pro_score.width * (playBase.theurgyDeriveSpecialCount / Number(maxGuar.time))
            list_item.numItems = guar.length
            if (playBase.theurgyDeriveSpecialBonusesList && playBase.theurgyDeriveSpecialBonusesList.length > 0) {
                group_get.visible = true
            }else{
                group_get.visible = false
            }
        }
        refrehUI()
        draw.scrollPane.posX = pro_score.getChild("bar").width
        this.refreshPage()
    }
   

    private refreshPage(){
        
    }

    public getIsViewMask(): boolean {
        return false;
    };

    public onViewDestroy(): void {
        for (let index = 0; index < this.effArr.length; index++) {
            this.effArr[index].dispose()
        }
    }

    onBehaviourUpdate(deltaTime: number): void {
        if (this.time > 0) {
            this.time = this.time - deltaTime
            if (this.time <= 0) {
                this.showReward()
                this.time = 0
            }
        }
    }
}


