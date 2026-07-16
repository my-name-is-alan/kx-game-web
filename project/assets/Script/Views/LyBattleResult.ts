//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { AudioManager } from "../Kernel/AudioManager";
import { VarVal } from "../Values/VarVal";
import { BattleResultParams, BattleTypeInfo, BonuseItem, UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { SpinePlayer } from "../Kernel/SpinePlayer";
import { GuideManager } from "../Kernel/GuideManager";
import { LyPayGiftGroup } from "./LyPayGiftGroup";

interface AllInSet {
    bonuseItem:BonuseItem,
    url:string,
}

export class LyBattleResult extends ViewLayer {

    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyItemReward;
        this.viewResI.pkgName = "LyItemReward";
        this.viewResI.comName = "LyBattleResult";
    }

    private battleParams:BattleResultParams;
    private typeInfo:BattleTypeInfo;
    private isWin:boolean;
    private btn_back:fgui.GButton;

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_result:fgui.GComponent = uiPanel.getChild("group_result");
        let group_result_duel:fgui.GComponent = uiPanel.getChild("group_result_duel");
        let group_result_qunyin:fgui.GComponent = uiPanel.getChild("group_result_qunyin");
        let group_result_clanDuel:fgui.GComponent = uiPanel.getChild("group_result_clanDuel");
        let group_result_clanSolo:fgui.GComponent = uiPanel.getChild("group_result_clanSolo");
        let group_result_brumeIsle1:fgui.GComponent = uiPanel.getChild("group_result_brumeIsle1");

        this.battleParams = params;
        this.typeInfo = this.battleParams.typeInfo;
        if (!this.typeInfo) {
            this.typeInfo = <any>{};
        }
        this.isWin = true;
        if (this.battleParams.battleResult) {
            this.isWin = this.battleParams.battleResult.isWin;
        }

        this.btn_back = uiPanel.getChild("btn_back");
        this.btn_back.onClick(() => {
            if (this.battleParams.closeBack) {
                this.battleParams.closeBack();
            }
            if (this.typeInfo.callBack) {
                this.typeInfo.callBack()
            }
            if (!this.isWin && this.typeInfo.type != VarVal.BATTLE_TYPE.INVASION && this.typeInfo.type != VarVal.BATTLE_TYPE.CLAN) {
                UtilsUI.tryShowPayFirstGift(2);
            }
            if (!this.isWin && this.typeInfo.type != VarVal.BATTLE_TYPE.CLAN) {
                LyPayGiftGroup.tryShowPayGiftGroupBattle();
            }
            if (this.battleParams.bonuseStringGoldFinger) {
                UtilsUI.showJumpItems({
                    bonuseString:this.battleParams.bonuseStringGoldFinger
                });
            }
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBattleResult, 0, null);
        })
        group_result_brumeIsle1.visible = false
        group_result_clanSolo.visible = false;
        if (this.typeInfo.type == VarVal.BATTLE_TYPE.DUEL) {
            group_result.visible = false;
            group_result_qunyin.visible = false;
            group_result_clanDuel.visible = false;
            group_result_clanSolo.visible = false;
            group_result_brumeIsle1.visible = false;
            this.initDuelMain(group_result_duel);
            this.initCommonMain(group_result_duel);
        } else if(this.typeInfo.type == VarVal.BATTLE_TYPE.CROSS_QUNYIN){
            group_result.visible = false;
            group_result_duel.visible = false;
            group_result_clanDuel.visible = false;
            group_result_clanSolo.visible = false;
            group_result_brumeIsle1.visible = false;
            this.initQunyinMain(group_result_qunyin);
            this.initCommonMain(group_result_qunyin);
        } else if(this.typeInfo.type == VarVal.BATTLE_TYPE.CLAN){
            group_result.visible = false;
            group_result_duel.visible = false;
            group_result_qunyin.visible = false;
            group_result_clanSolo.visible = false;
            group_result_brumeIsle1.visible = false;
            this.initClanDuelMain(group_result_clanDuel);
        } else if(this.typeInfo.type == VarVal.BATTLE_TYPE.CLANSOLO){
            group_result.visible = false;
            group_result_clanSolo.visible = true;
            group_result_duel.visible = false;
            group_result_qunyin.visible = false;
            group_result_clanDuel.visible = false;
            this.initClansoloMain(group_result_clanSolo);
            this.initCommonMain(group_result_clanSolo);
        } else if(this.typeInfo.type == VarVal.BATTLE_TYPE.BRUMELISLE_ATTACK){
            group_result.visible = false;
            group_result_duel.visible = false;
            group_result_qunyin.visible = false;
            group_result_clanDuel.visible = false
            group_result_brumeIsle1.visible = true
     
            this.initBrumeIsle1(group_result_brumeIsle1);
        } 
        else {
            group_result_duel.visible = false;
            group_result_qunyin.visible = false;
            group_result_clanDuel.visible = false;
            group_result_clanSolo.visible = false;
            group_result_brumeIsle1.visible = false;
            this.initBattleMain(group_result);
            this.initCommonMain(group_result);
        }
    }

    public initBattleMain(group_main:fgui.GComponent):void {
        if (this.isWin) {
        } else {
            let label_lost_tips1 = group_main.getChild("label_lost_tips1", fgui.GTextField);
            label_lost_tips1.text = StrVal.LYBATTLE_RESULT.STR4;
            let label_lost_tips2 = group_main.getChild("label_lost_tips2", fgui.GTextField);
            label_lost_tips2.text = StrVal.LYBATTLE_RESULT.STR5;

            let btn_lostGo1 = group_main.getChild("btn_lostGo1", fgui.GTextField);
            btn_lostGo1.onClick(() => { // 升级鱼塘
                GuideManager.startGuide({
                    guideType: VarVal.GUIDE_TYPE.EVOLUTION,
                });
            })
            let btn_lostGo2 = group_main.getChild("btn_lostGo2", fgui.GTextField);
            btn_lostGo2.onClick(() => { // 抽取宠物
                GuideManager.startGuide({
                    guideType: VarVal.GUIDE_TYPE.PET_CALL,
                });
            })
            let btn_lostGo3 = group_main.getChild("btn_lostGo3", fgui.GTextField);
            btn_lostGo3.onClick(() => { // 获取装备
                GuideManager.startGuide({
                    guideType: VarVal.GUIDE_TYPE.KANSHU,
                });
            })
        }

        // 战斗类型参数。
        let btn_tower_cd:fgui.GButton = group_main.getChild("btn_tower_cd");
        let label_tower_level:fgui.GTextField = group_main.getChild("label_tower_level");
        btn_tower_cd.visible = false;
        label_tower_level.visible = false;

        if (this.typeInfo.type == VarVal.BATTLE_TYPE.INVASION) { // 异兽入侵
            let label_damage:fgui.GTextField = group_main.getChild("label_damage");
            label_damage.text = UtilsTool.stringFormat(StrVal.LYBATTLE_RESULT.STR2, [UtilsTool.nToFStr(this.typeInfo.damage)]);
        } else if (this.typeInfo.type == VarVal.BATTLE_TYPE.MONSTER_TOWER) { // 镇妖塔
            if (this.typeInfo.towerCDCall && this.isWin) {
                btn_tower_cd.visible = true;
                btn_tower_cd.onClick(() => {
                    this.btn_back.fireClick();
                    this.typeInfo.towerCDCall();
                })
                let CURR_CD = 4;
                let timeCall = () => {
                    CURR_CD = CURR_CD - 1;
                    btn_tower_cd.text = UtilsTool.stringFormat(StrVal.LYBATTLE_RESULT.STR1, [CURR_CD]);
                    if (CURR_CD == 0) {
                        btn_tower_cd.fireClick();
                    }
                }
                this.setInterval(timeCall, 1000);
                timeCall();

                label_tower_level.visible = true;
                label_tower_level.text = this.typeInfo.towerCDText;
            }
        }
    }   
    
    public initClanDuelMain(group_main:fgui.GComponent):void {
        let label_desc1:fgui.GLabel = group_main.getChild("label_desc1");
        label_desc1.text = this.typeInfo.desc1
        let label_desc2:fgui.GLabel = group_main.getChild("label_desc2");
        label_desc2.text = StrVal.LYCLAN.STR143
        label_desc2.visible = this.isWin
        let label_desc3:fgui.GLabel = group_main.getChild("label_desc3");
        label_desc3.text = this.typeInfo.desc3
    }

	public initClansoloMain(group_main:fgui.GComponent):void {
        let bar_hp_left: fgui.GProgressBar = group_main.getChild("bar_hp_left") 
        if (this.isWin) {
           bar_hp_left.value = this.typeInfo.clansoloHpValue1==0? 1 : this.typeInfo.clansoloHpValue1
        }else{
           bar_hp_left.value = this.typeInfo.clansoloHpValue1==0? 0 : this.typeInfo.clansoloHpValue1
        }
        bar_hp_left.max = this.typeInfo.clansoloHpMax1==0 ? 1 : this.typeInfo.clansoloHpMax1
        let bar_hp_right: fgui.GProgressBar = group_main.getChild("bar_hp_right")
        bar_hp_right.value = this.isWin ? 0:this.typeInfo.clansoloHpValue2
        bar_hp_right.max = this.typeInfo.clansoloHpMax2

        let label_score:fgui.GLabel = group_main.getChild("label_score");
        let str :string =this.isWin? StrVal.LYCLANSOLO.STR78:StrVal.LYCLANSOLO.STR79
        label_score.text = UtilsTool.stringFormat(str,[this.typeInfo.playerScore,this.typeInfo.scoreChange])
        
        let group_head_left:fgui.GComponent = group_main.getChild("group_head_left");
        let loader_icon_left:fgui.GLoader = group_head_left.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        loader_icon_left.url = UtilsTool.stringFormat("ui://CCommon/{0}", [this.typeInfo.duelIcon1]);

        let group_head_right:fgui.GComponent = group_main.getChild("group_head_right");
        let loader_icon_right:fgui.GLoader = group_head_right.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        loader_icon_right.url = UtilsTool.stringFormat("ui://CCommon/{0}", [this.typeInfo.duelIcon2]);

        let label_name_left:fgui.GComponent = group_main.getChild("label_name_left");
        label_name_left.text = this.typeInfo.duelName1;

        let label_name_right:fgui.GComponent = group_main.getChild("label_name_right");
        label_name_right.text = this.typeInfo.duelName2;
    }
    

    public initBrumeIsle1(group_main:fgui.GComponent):void {
        // tween动画
        // UtilsUI.playCommonResultAni(group_main.getChild("back_win"), () => {
        //     group_main.getChild("group_outani").visible = true;
        // });
        let label_desc1:fgui.GLabel = group_main.getChild("label_desc1");
        label_desc1.text = this.typeInfo.desc1
        let bonuseItems:Array<BonuseItem> = this.typeInfo.bonunItems
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            child.getChild("label_name", fgui.GTextField).text = bonuseItems[index].name;
            UtilsUI.setUIGroupItem(bonuseItems[index], child.getChild("group_item", fgui.GComponent), null);
        }
        list_item.numItems = bonuseItems.length
    }

    public initQunyinMain(group_main:fgui.GComponent):void {
        let label_reward:fgui.GComponent = group_main.getChild("label_reward");
        label_reward.text = StrVal.LYBATTLE_RESULT.STR101;

        let group_vs = group_main.getChild("group_vs", fgui.GGroup);
        if (!this.isWin) {
            group_vs.y = (group_main.height - group_vs.height) / 3;
        }

        let group_head_left:fgui.GComponent = group_main.getChild("group_head_left");
        let loader_icon_left:fgui.GLoader = group_head_left.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        loader_icon_left.url = UtilsTool.stringFormat("ui://CCommon/{0}", [this.typeInfo.duelIcon1]);

        let group_head_right:fgui.GComponent = group_main.getChild("group_head_right");
        let loader_icon_right:fgui.GLoader = group_head_right.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        loader_icon_right.url = UtilsTool.stringFormat("ui://CCommon/{0}", [this.typeInfo.duelIcon2]);

        let label_name_left:fgui.GComponent = group_main.getChild("label_name_left");
        label_name_left.text = this.typeInfo.duelName1;

        let label_name_right:fgui.GComponent = group_main.getChild("label_name_right");
        label_name_right.text = this.typeInfo.duelName2;

        let label_rankDec:fgui.GLabel = group_main.getChild("label_rankDec");
        if (this.typeInfo.qunyinRank) {
            label_rankDec.text = UtilsTool.stringFormat(StrVal.LYBATTLE_RESULT.STR201,[this.typeInfo.qunyinRank,this.typeInfo.qunyinRankUp]) 
        }else{
            label_rankDec.text = UtilsTool.stringFormat(StrVal.LYBATTLE_RESULT.STR202,[this.typeInfo.qunyinCount]) 
        }

        let bonuseItems = [UtilsUI.getBonuseItem(VarVal.bonusType.qunyin, null, null,String(this.typeInfo.qunyinScore))]
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            child.getChild("label_name", fgui.GTextField).text = bonuseItems[index].name;
            UtilsUI.setUIGroupItem(bonuseItems[index], child.getChild("group_item", fgui.GComponent), null);
        }
        UtilsUI.setFguiGlistDelayNumItems(list_item, bonuseItems.length);
    }

    public initDuelMain(group_main:fgui.GComponent):void {
        let label_reward:fgui.GComponent = group_main.getChild("label_reward");
        label_reward.text = StrVal.LYBATTLE_RESULT.STR101;

        let group_vs = group_main.getChild("group_vs", fgui.GGroup);
        if (!this.isWin) {
            group_vs.y = (group_main.height - group_vs.height) / 3;
        }

        let group_head_left:fgui.GComponent = group_main.getChild("group_head_left");
        let loader_icon_left:fgui.GLoader = group_head_left.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        loader_icon_left.url = UtilsTool.stringFormat("ui://CCommon/{0}", [this.typeInfo.duelIcon1]);

        let group_head_right:fgui.GComponent = group_main.getChild("group_head_right");
        let loader_icon_right:fgui.GLoader = group_head_right.getChild("group_icon", fgui.GComponent).getChild("loader_icon");
        loader_icon_right.url = UtilsTool.stringFormat("ui://CCommon/{0}", [this.typeInfo.duelIcon2]);

        let label_name_left:fgui.GComponent = group_main.getChild("label_name_left");
        label_name_left.text = this.typeInfo.duelName1;

        let label_name_right:fgui.GComponent = group_main.getChild("label_name_right");
        label_name_right.text = this.typeInfo.duelName2;

        let label_score_left:fgui.GComponent = group_main.getChild("label_score_left");
        label_score_left.text = UtilsTool.stringFormat(this.typeInfo.duelScoreAdd1 >= 0 ? StrVal.LYBATTLE_RESULT.STR102 : StrVal.LYBATTLE_RESULT.STR103,
            [this.typeInfo.duelScore1,
            UtilsUI.getEnoughColorToHEX(this.typeInfo.duelScoreAdd1 > 0, 1),
            this.typeInfo.duelScoreAdd1]
        );

        let label_score_right:fgui.GComponent = group_main.getChild("label_score_right");
        label_score_right.text = UtilsTool.stringFormat(this.typeInfo.duelScoreAdd2 >= 0 ? StrVal.LYBATTLE_RESULT.STR102 : StrVal.LYBATTLE_RESULT.STR103,
            [this.typeInfo.duelScore2,
            UtilsUI.getEnoughColorToHEX(this.typeInfo.duelScoreAdd2 > 0, 1),
            this.typeInfo.duelScoreAdd2]
        );
    }

    /**
     * 共同的地方。
     */
    public initCommonMain(group_main:fgui.GComponent):void {
        UtilsUI.playCommonGroupAni(group_main);

        let label_tips = group_main.getChild("label_tips", fgui.GTextField);
        label_tips.text = StrVal.COMMON.STR9;

        let control = group_main.getController("c1");
        if (this.isWin) {
            control.selectedIndex = 1;
            AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_BATTLERESULT_WIN);

            new SpinePlayer().loadSpine((spp:SpinePlayer) => {
                spp.playAnimation("stand_sl", true);
                group_main.getChild("title_win").visible = false;
            }, group_main.getChild("loader_spine", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_result);
            new SpinePlayer().loadSpine(null, group_main.getChild("loader_spine2", fgui.GLoader3D), VarVal.UI_EFF_NAME.spine_result2);
        } else {
            control.selectedIndex = 0;
            AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_BATTLERESULT_LOST);
        }

        // tween动画
        UtilsUI.playCommonResultAni(group_main.getChild(this.isWin ? "back_win" : "back_lost"), () => {
            group_main.getChild("group_outani").visible = true;
        });

        // 列表
        if (this.battleParams.bonuseString) {
            let bonuseItems:Array<BonuseItem> = UtilsUI.getBonuseItemsByString(this.battleParams.bonuseString);

            let allInSet:Array<AllInSet> = new Array<AllInSet>();
            for (let i = 0; i < bonuseItems.length; i++) {
                allInSet.push({
                    bonuseItem:bonuseItems[i],
                    url:undefined,
                });
            }
            if (this.battleParams.bonuseStringCompanion) {
                let companion = UtilsUI.getBonuseItemsByString(this.battleParams.bonuseStringCompanion);
                for (let i = 0; i < companion.length; i++) {
                    allInSet.push({
                        bonuseItem:companion[i],
                        url:"ui://CCommon/frame_shouyou",
                    });
                }
            }

            let list_item:fgui.GList = group_main.getChild("list_item");
            list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
                child.getChild("label_name", fgui.GTextField).text = allInSet[index].bonuseItem.name;
                let group_item = child.getChild("group_item", fgui.GComponent);
                UtilsUI.setUIGroupItem(allInSet[index].bonuseItem, group_item, null);
                if (allInSet[index].url) {
                    let loader_superscript = group_item.getChild("loader_superscript", fgui.GLoader);
                    loader_superscript.url = allInSet[index].url;
                }
            }
            UtilsUI.setFguiGlistDelayNumItems(list_item, allInSet.length);
        }

        let btn_replay:fgui.GButton = group_main.getChild("btn_replay");
        if (btn_replay) {
            if (this.battleParams.replayBack) {
                btn_replay.visible = true;
                btn_replay.onClick(() => {
                    this.battleParams.replayBack();
                    ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyBattleResult, 0, null);
                })
            } else {
                btn_replay.visible = false;
            }
        }
    }

    public getIsViewMask():boolean {
        return false;
    }
}