//////////////////////////////////////////////////////////////////////////////////////
//
//  JasonWW
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
import { LyBrumeIsleJoinReward } from "./LyBrumeIsleJoinReward";
import { LyBrumeIsleAward } from "./LyBrumeIsleAward";
import { LyBrumeIsleGift } from "./LyBrumeIsleGift";
import { LyBrumeNote } from "./LyBrumeNote";
import { LyBrumeIsleFire } from "./LyBrumeIsleFire";
import { LyBrumeIsleRank } from "./LyBrumeIsleRank";
import { PointRedData, PointRedType } from "../Kernel/PointRedData";

export class LyBrumeIsleChoose extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "LyBrumeIsle";
        this.viewResI.pkgName = "LyBrumeIsle";
        this.viewResI.comName = "LyBrumeIsleChoose";
    }
    public pos: Array<Vec2> = [new Vec2(191, 1075), new Vec2(468, 465),  new Vec2(381, 109)]
    // public static joinNoChoose: boolean = false //进入选择界面但是没有选择
    public onViewCreate(params:any): void {
        let getUiPanel: fgui.GComponent = this.getUiPanel();
        let group_main: fgui.GComponent = getUiPanel.getChild("main");
        let main_map: fgui.GComponent= getUiPanel.getChild("main_map")
        // LyBrumeIsleChoose.joinNoChoose = false
        getUiPanel.getChild("btn_back", fgui.GButton).onClick(()=>{
            // LyBrumeIsleChoose.joinNoChoose = true
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleChoose, 0, null);
        }); 
        group_main.getChild("btn_close", fgui.GButton).onClick(()=>{
            // LyBrumeIsleChoose.joinNoChoose = true
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleChoose, 0, null);
        });
        UtilsUI.playCommonGroupAni(group_main, null);
        group_main.getChild("btn_reward", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleAward, 0, null);
        });
        group_main.getChild("btn_gift", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleGift, 0, null);
        });
        group_main.getChild("btn_note", fgui.GButton).onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeNote, 0, null);
        });
        let btn_chests = group_main.getChild("btn_chests", fgui.GButton)
        PointRedData.getInstance().registerPoint(btn_chests, PointRedType.LyBrumeIsFire);
        btn_chests.onClick(()=>{
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleFire, 0, null);
        });

        group_main.getChild("btn_rank", fgui.GButton).onClick(()=>{
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleRank, 0, args);
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "getDomainPRank", {
                from:1,
                to:200,
            });
        });
  
        group_main.getChild("label_title", fgui.GLabel).text = StrVal.LyBRUMEISLE.STR6
        let label_name1 = group_main.getChild("label_name1", fgui.GLabel)
        let label_desc1 = group_main.getChild("label_desc1", fgui.GLabel)
        let label_likaiDec = group_main.getChild("label_likaiDec", fgui.GLabel)
        let label_name2 = group_main.getChild("label_name2", fgui.GLabel)
        let label_desc2 = group_main.getChild("label_desc2", fgui.GLabel)
        let label_likaiDec2 = group_main.getChild("label_likaiDec2", fgui.GLabel)
        let label_rank = group_main.getChild("label_rank", fgui.GLabel)
        let label_score = group_main.getChild("label_score", fgui.GLabel)
        let label_lsScore = group_main.getChild("label_lsScore", fgui.GLabel)
        let label_lkbeil = group_main.getChild("label_lkbeil", fgui.GLabel)
        let label_playerScore = group_main.getChild("label_playerScore", fgui.GLabel)
        let label_scoreRank = group_main.getChild("label_scoreRank", fgui.GLabel)
        let label_saveTime = group_main.getChild("label_saveTime", fgui.GLabel)
        let list_item = group_main.getChild("list_item", fgui.GList)
        let btn_shengxing = group_main.getChild("btn_shengxing", fgui.GButton)
        let btn_zhenfeng = group_main.getChild("btn_zhenfeng", fgui.GButton)
        let btn_shenru = group_main.getChild("btn_shenru", fgui.GButton)
        let btn_likai = group_main.getChild("btn_likai", fgui.GButton)
        let group_mapTx = main_map.getChild("group_mapTx", fgui.GComponent)
        let loader_iconTx = group_mapTx.getChild("loader_icon", fgui.GComponent).getChild("loader_icon", fgui.GLoader)
        let label_power = group_main.getChild("label_power", fgui.GLabel)

        let charInfo = LocaleData.getCharShowResInfoSelf()
        loader_iconTx.url = UtilsTool.stringFormat("ui://CCommon/{0}", [charInfo.icon]);
        let bounArr = []
        btn_shengxing.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    UtilsUI.showItemReward({bonuseItems: bounArr});
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleChoose, 0, null);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"zoneEventDone", null);
        });

        btn_shenru.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    UtilsUI.showItemReward({bonuseItems: bounArr});
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleChoose, 0, null);
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"zoneEventDone", null);
        });

        btn_zhenfeng.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    doAnimMap(()=>{
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyBrumeIsleLand, 0, {zoneEventDoneArgs: args});
                    })
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"zoneEventDone", {toNext:1});
        });

        btn_likai.onClick(()=>{
            UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    doAnimMap(()=>{
                        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyBrumeIsleLand, 0, {zoneEventDoneArgs: args});
                    })
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
            } ,"zoneEventDone", {toNext:1});
        });

        let isleData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster
        let nowLayer = isleData.zoneLevel
        let xmlRoot = LocaleData.getBrumeIsleConfig()        
        group_main.getChild("group_zone3", fgui.GGroup).visible = nowLayer == 3
        label_name1.text = nowLayer < 3 ? StrVal.LyBRUMEISLE.STR7 : StrVal.LyBRUMEISLE.STR8
        label_desc1.text = nowLayer < 3 ? StrVal.LyBRUMEISLE.STR9 : StrVal.LyBRUMEISLE.STR10
        label_likaiDec.text = StrVal.LyBRUMEISLE.STR11
        label_name2.text = nowLayer < 3 ? StrVal.LyBRUMEISLE.STR12 : StrVal.LyBRUMEISLE.STR13
        label_desc2.text = nowLayer < 3 ? StrVal.LyBRUMEISLE.STR14 : StrVal.LyBRUMEISLE.STR15
        let bl = 1 + (Math.floor((isleData.tempZoneInfo.searchCnt + 1)/10) * Number(xmlRoot.integralMarkup))
        bl = Number(bl.toFixed(1)) 
        label_likaiDec2.text = nowLayer < 3 ? StrVal.LyBRUMEISLE.STR16 : UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR17, [bl]) 
        btn_shengxing.visible = nowLayer < 3
        btn_zhenfeng.visible = nowLayer < 3
        btn_shenru.visible = nowLayer == 3
        btn_likai.visible = nowLayer == 3
        // isleData.tempZoneInfo.pRandNum + "   x" + bl
        let groupProbability = LocaleData.getBrumeIsleZone(nowLayer)
        if (nowLayer == 3) {
            label_lsScore.text = UtilsTool.stringFormat("{0}->[color=#6FAA8C]{1}[/color]", [UtilsTool.nToFStr(isleData.tempZoneInfo.pRandNum) ,  UtilsTool.nToFStr(Number(isleData.tempZoneInfo.pRandNum) + Number(groupProbability.refusalPRankNum)) ]) 
            label_lkbeil.text = UtilsTool.stringFormat("{0} -> [color=#6FAA8C]{1}[/color]", [bl, Number((bl + 0.1).toFixed(1)) ])
            let tempScore = Number(isleData.pRankNum) + Number(isleData.tempZoneInfo.pRandNum) 
            label_playerScore.text = UtilsTool.stringFormat("{0}->[color=#6FAA8C]{1}[/color]", [UtilsTool.nToFStr(isleData.pRankNum), UtilsTool.nToFStr(tempScore)])
            UtilsUI.lockWait();
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait();
                if (args.errorcode == 0) {
                    let nowPos = (args.rankOf > 0 && args.rankOf <= 200 ? String(args.rankOf) : StrVal.LYCHALLENGE_DUEL.STR9);
                    let tempRank = 0
                    for (let index = 0; index < args.ranks.length; index++) {
                        let rankItem = args.ranks[index];
                        if (tempScore >= rankItem.score) {
                            tempRank = rankItem.rankOf
                            break
                        }
                    } 
                    if (args.ranks.length == 0) {
                        tempRank = 1
                    }
                    let willPos = (tempRank > 0 && tempRank <= 200 ? String(tempRank) : StrVal.LYCHALLENGE_DUEL.STR9);
                    label_scoreRank.text = UtilsTool.stringFormat("{0} -> [color=#6FAA8C]{1}[/color]", [nowPos, willPos])
                } else {
                    UtilsUI.showMsgTip(args.errorcode);
                }
            }, "getDomainPRank", {
                from:1,
                to:200,
            });
            label_saveTime.visible = true
        }else{
            label_rank.text = isleData.rankOf
            label_score.text =  isleData.pRankNum
            label_saveTime.visible = false
        }
        label_power.text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR52, [UtilsTool.stringFormat("{0}/{1}",[isleData.energy, xmlRoot.energyMax])]) 
        let temps = UtilsUI.getBonuseItemsByBonusesId(groupProbability.refusalBonuses)
        if (groupProbability.refusalPRankNum != "0") {
            bounArr.push(UtilsUI.getBonuseItem(VarVal.bonusType.brumeIsleScore, null,null, groupProbability.refusalPRankNum))
        }
        if (groupProbability.refusalGRankNum != "0") {
            bounArr.push(UtilsUI.getBonuseItem(VarVal.bonusType.brumeIsleClanScore, null,null, groupProbability.refusalGRankNum))
        }
        for (let index = 0; index < temps.length; index++) {
            bounArr.push(temps[index])
        }
        list_item.itemRenderer = (index: number, child:fgui.GComponent)=>{
            UtilsUI.setUIGroupItem(bounArr[index], child, null);
        }
        UtilsUI.setFguiGlistDelayNumItems(list_item, bounArr.length)
        let severTime: number = 0
        let interCallBack = ()=>{
            severTime = GameServerData.getInstance().getServerTime()
            if (isleData.safeTime != 0) {
                label_saveTime.text = UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR44, [UtilsTool.splitTimeString(isleData.safeTime - severTime)]) 
            }else{
                label_saveTime.text =  UtilsTool.stringFormat(StrVal.LyBRUMEISLE.STR44, [StrVal.LyBRUMEISLE.STR49])  
            }
        }

        interCallBack()
        this.setInterval(()=>{
            interCallBack()
        }, 1000);

        UtilsUI.lockWait()
            GameServer.getInstance().send((args: any) => {
                UtilsUI.unlockWait()
                if (args.errorcode == 0) {
                    
                } else {
                    UtilsUI.showMsgTip(args.errorcode)
                }
        } ,"enterDomainActivity", null);
        this.registerRequest((args) => {
            if (String(args.activityState.activityId) == VarVal.ACTIVITY_ID.BRUMEISLE) {
                // this.refreshPage()
            }
        }, "activityStateChanged");

        let anim = main_map.getTransition("t0")
        let doAnimMap = (callBack: Function)=>{
            let target = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.BRUMEISLE).data.activityDomainMonster.zoneLevel
            main_map.visible = true
            group_mapTx.setPosition(this.pos[nowLayer - 1].x, this.pos[nowLayer - 1].y) 
            FguiGTween.new(group_mapTx).to(0.5, {x: this.pos[target - 1].x, y: this.pos[target - 1].y}).call(() => {
                anim.play(()=>{
                    callBack()
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleChoose, 0, null);
                });
            }).start();
        }
      
        let backMap = ()=>{
            group_main.visible = false
            main_map.visible = true
            group_mapTx.setPosition(this.pos[2].x, this.pos[2].y) 
            FguiGTween.new(group_mapTx).to(1, {x: this.pos[1].x, y: this.pos[1].y}).call(() => {
                anim.play(()=>{
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBrumeIsleChoose, 0, null);
                });
            }).start();
        }

        if (params && params.back) {
            backMap()
        }
    }

    public onViewUpdate(params: any): void {
        
    }

    public onViewDestroy(): void {
        ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyBrumeIsleLand, 0, { isUpdate: true });
    }

    public getIsViewMask(): boolean {
        return false;
    }
}


