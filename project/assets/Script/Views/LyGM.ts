//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { GameServer } from "../Kernel/GameServer";
import { BattleResultParams, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { LyBattleMain } from "./LyBattleMain";
import { GameServerData } from "../Kernel/GameServerData";
import { VarVal } from "../Values/VarVal";
import { HorizontalTextAlignment, Overflow, VerticalTextAlignment } from "cc";
import { AudioManager } from "../Kernel/AudioManager";
import { GuideManager } from "../Kernel/GuideManager";
import { LocaleData } from "../Kernel/LocaleData";
import { FmDebugStatus } from "./FmDebugStatus";
import { UtilsTool } from "../Kernel/UtilsTool";
import { PlatformAPI } from "../Kernel/PlatformAPI";

export class LyGM extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = "CCommon";
        this.viewResI.pkgName = "CCommon";
        this.viewResI.comName = "LyGM";
    }

    public onViewCreate(_params:any):void {
        // 生产环境直接销毁 GM 面板
        if (!PlatformAPI.isBinaryDebug()) {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGM, 0, null);
            return;
        }
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GComponent = uiPanel.getChild("group_main");
        
        // 关闭
        let btn_back: fgui.GButton = uiPanel.getChild("btn_back");
        btn_back.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyGM, 0, null)
        })

        let btn_close:fgui.GButton = group_main.getChild("btn_close");
        btn_close.onClick(() => {
            btn_back.fireClick();
        })

        // 列表
        let GMData = [
            { 
                str: "增加主角属性[属性类型,数值]",
                callBack: (str) => {
                    let params = str.split(",")
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("已添加。")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } , "addAttrEntity", {type: Number(params[0]), value:Number(params[1])})
                }, 
            },
            {
                str: "开启所有系统",
                callBack: (str) => {
              
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("已开启")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"setActivationSkip", {})
                },
            },
            { 
                str: "添加物品[protoId,数量]",
                callBack: (str) => {
                    let params = str.split(",")
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("已添加。")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"addItem", {protoId: Number(params[0]), count: Number(params[1])})
                },
            },
            {
                str: "物品表所有物品+10000",
                callBack: (str) => {
                    let parStr = "";
                    let items: Array<any> = LocaleData.getAllItemProto()
                    for (let index = 0; index < items.length; index++) {
                        parStr = parStr + (items[index].id + ",10000;")
                    }
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"addItems", {
                        param: parStr,
                    })
                },
            },
            {
                str: "所有神通碎片+51",
                callBack: (str) => {
                    let parStr = "";
                    let items: Array<any> = LocaleData.getTheurgyRoot()._theurgy[0]._item;
                    for (let index = 0; index < items.length; index++) {
                        parStr = parStr + (items[index].id + ",51;")
                    }
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"addItems", {
                        param: parStr,
                    })
                },
            }, {
                str: "雾影岛 2- 9",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"testsetzoneLevel", {
                        level: 2,
                        searchCnt: 9,
                    })
                },
            }, {
                str: "攻城掠地下一个阶段",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"siegeNextState", null)
                },
            },{ 
                str: "免费礼包领取[1免费]",
                callBack: (str) => {
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("已添加")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } , "siegeGift", {id:Number(str)})
                }, 
            },{
                str: "所有门客碎片+5000",
                callBack: (str) => {
                    let parStr = "";
                    let items: Array<any> = LocaleData.getEliteMonsterRoot()._elitemonster[0]._item;
                    for (let index = 0; index < items.length; index++) {
                        parStr = parStr + (items[index].debris_id + ",5000;")
                    }
    
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"addItems", {
                        param: parStr,
                    })
                },
            },
            { 
                str: "金币(云英、灵石)[数量]",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("已添加。")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"addattr", {type: VarVal.playerAttrChanged.money , value:Number(str)})
                },
            },
            { 
                str: "钻石(玉壁、仙玉) [数量]",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("已添加。")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"addattr", {type: VarVal.playerAttrChanged.stone , value:Number(str)})
                },
            },
            { 
                str: "升到指定等级",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("已添加。")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"directLevel", { targetLevel:Number(str)})
                },
            },
            { 
                str: "加经验[数量]",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("已添加。")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"addExp", { exp:Number(str)})
                },
            },
            { 
                str: "设置主线任务[ID]只往后调",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("已添加。")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"finishMainTask", { taskId:Number(str)})
                },
            },
            {
                str: "挑战指定关卡[id]",
                callBack: (str) => {
                    UtilsUI.lockWait();
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait();
                        if (args.errorcode == 0) {
                            let resultParams:BattleResultParams = {
                                battleResult: args.battleResult,
                                bonuseString: GameServerData.getInstance().bonusesResultsToString([args.bonusesResult, args.chapterBonusesResult]),
                                typeInfo: {
                                    type: VarVal.BATTLE_TYPE.STAGE,
                                }
                            }
                            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBattleMain, 0, {
                                resultParams:resultParams,
                            });
                        } else {
                            UtilsUI.showMsgTip(args.errorcode);
                        }
                    }, "testchallengestage", {
                        stageId:Number(str)
                    });
                }
            },
            {
                str: "设置仙树等级",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("已添加。")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"evolveUp",null)
                },
            },
            {
                str: "入住琅琊榜[宫殿id,玩家id]不填玩家则是自己",
                callBack: (str:string) => {
                    let ttt = str.split(",")
                    let guid = ttt[1];
                    if (!guid || guid.length < 2) {
                        guid = undefined;
                    }
                    UtilsUI.lockWait()
                    GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("已添加。")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"palaceListed", {
                        palaceId:Number(ttt[0]),
                        playerId:guid
                    })
                },
            },
            {
                str: "设置开服天数",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("已添加。")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"setopenday", {day:Number(str)})
                },
            },
            {
                str: "加服务器时间[天数,小时,分钟,秒]",
                callBack: (str) => {
                    let id = GameServer.getLoginParams().serverItem.serverId;
                    if (id != 110) {
                        UtilsUI.showMsgTip("此接口暂停使用。")
                        return;
                    }
                    let params = str.split(",")
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("已添加。" + UtilsTool.TimeToStr( String(GameServerData.getInstance().getServerTime())) )
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"settime", {
                        day:Number(params[0]),
                        hour:Number(params[1]),
                        min:Number(params[2]),
                        sec:Number(params[3]),
                    })
                },
            },
            {
                str: "状态调试面板[1显示0不显]",
                callBack: (str) => {
                    if (str == "1") {
                        ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_PUSH, FmDebugStatus, 0, null);
                    } else {
                        ViewDispatcher.pushNotiEvent(null, ViewDispatcher.EVENT_DESTROY, FmDebugStatus, 0, null);
                    }
                },
            },
            {
                str: "坊市限购刷新[1刷日月限-2仅刷日限]",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("已添加。")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"shopUp", {
                        day:Number(str)
                    })
                },
            }, 
            
            {
                str: "累充累天 开关 id = 0累充 = 1累天 type 活动id 例如输入: 0,1 开启累充",
                callBack: (str) => {
                    let params = str.split(",")
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("累充累天开启")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"onOpenTotalCharge", {
                        id:Number(params[0]),
                        type:Number(params[1]),
                    })
                },
            },
            {
                str: "刷新帮派日常",
                callBack: (str) => {
                
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("刷新帮派日常")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"clanRefreshDaily", {
                    })
                },
            },
            {
                str: "神通所有表印记+1",
                callBack: (str) => {
                    let parStr = "";
                    let items: Array<any> = LocaleData.getTheurgyRoot()._seal[0]._item;
                    for (let index = 0; index < items.length; index++) {
                        parStr = parStr + (items[index].id + ",1;")
                    }

                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"addItems", {
                        param: parStr,
                    })
                },
            },
            {
                str: "播放音乐/音效[填路径如audio/eft_getitem]",
                callBack: (str) => {
                    AudioManager.playEFT(str);
                },
            },
            {
                str: "测试引导[引导类型]",
                callBack: (str) => {
                    GuideManager.startGuide({
                        guideType: str,
                        isForce: true,
                    });
                },
            },
            {
                str: "刷新帮派神秘商人",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("刷新帮派神秘商人")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"clanRefreshMerchant", {
                    })
                },
            },
            {
                str: "发放装备",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("发放装备")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"deliveryEquip",  {
                        cfgId: str,
                    })
                },
            },
            {
                str: "仙缘积分增加",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("仙缘积分增加")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"addxyscore",  {
                        score: Number(str) ,
                    })
                },
            },
            {
                str: "设置修行等级",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("成功")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"addVeinLevel",  {
                        level : Number(str) ,
                    })
                },
            },       
            {
                str: "开启帮派充值",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("开启帮派充值")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"clanStartRechargeAct", {
                        id:1
                    })
                },
            },
            {
                str: "添加所有宠物",
                callBack: (str) => {
                    let parStr = "";
                    let items: Array<any> = LocaleData.getPetProto("E")
                    console.log(GameServerData.getInstance().getPlayerFullInfo().base.petBackpackCapacity)
                    for (let index = 0; index < GameServerData.getInstance().getPlayerFullInfo().base.petBackpackCapacity ; index++) {
                        parStr = parStr + (items[index].id + ",1;")
                    }
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"addItems", {
                        param: parStr,
                    })
                },
            },
            {
                str: "增加帮派经验",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("成功")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"clanAddExp",  {
                        exp : Number(str) ,
                    })
                },
            },   
            {
                str: "增加个人贡献和战功",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("成功")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"addClanPoint",  {
                        count : Number(str) ,
                    })
                },
            },
            // {
            //     str: "八荒进入下一个阶段",
            //     callBack: (str) => {
            //         UtilsUI.lockWait()
            //             GameServer.getInstance().send((args: any) => {
            //             UtilsUI.unlockWait()   
            //             if (args.errorcode == 0) {
            //                 UtilsUI.showMsgTip("成功")
            //             } else {
            //                 UtilsUI.showMsgTip(args.errorcode)
            //             }
            //         } ,"conquestNextPhase",  {
            //         })
            //     },
            // },
            {
                str: "八荒增加玩家进入场景",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("成功")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"conquestAddPlayer",  {
                        count : Number(str) ,
                    })
                },
            },
            {
                str: "单刀赴会增加声望",
                callBack: (str) => {
                    UtilsUI.lockWait()
                        GameServer.getInstance().send((args: any) => {
                        UtilsUI.unlockWait()
                        if (args.errorcode == 0) {
                            UtilsUI.showMsgTip("成功")
                        } else {
                            UtilsUI.showMsgTip(args.errorcode)
                        }
                    } ,"clanSoloAddPrestige",  {
                        prestige : Number(str) ,
                    })
                },
            },

        ]

        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.itemRenderer = ((index: number, obj: fgui.GButton) => {
            let data = GMData[index]
            let label_des:fgui.GTextInput = obj.getChild("label_des")
            UtilsUI.setGTextInputAlign(label_des, HorizontalTextAlignment.LEFT, VerticalTextAlignment.CENTER, Overflow.SHRINK);
            label_des.promptText = data.str
            obj.getChild("btn_sure").onClick(()=>{
                data.callBack(label_des.text)
            })
        }).bind(this)
        list_item.numItems = GMData.length;
    }

    public getIsViewMask():boolean {
        return false;
    }
}