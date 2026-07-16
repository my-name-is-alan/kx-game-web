//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { LyChallengeDuelMatch } from "../Views/LyChallengeDuelMatch";
import { LyActivityKingMonster } from "../Views/LyActivityKingMonster";
import { LyActivityInvasion } from "../Views/LyActivityInvasion";
import { LyActivityMonsterTower } from "../Views/LyActivityMonsterTower";
import { LyPayFunds } from "../Views/LyPayFunds";
import { VarVal } from "../Values/VarVal";
import { LyActivityOpenCelebration } from "../Views/LyActivityOpenCelebration";
import { GameServerData } from "./GameServerData";
import { LyActivityReincarnationHall } from "../Views/LyActivityReincarnationHall";
import { LyActivityFortune } from "../Views/LyActivityFortune";
import { LyPayGiftDaily } from "../Views/LyPayGiftDaily";
import { LyPayGiftDailyChoose } from "../Views/LyPayGiftDailyChoose";
import { LyPayFirstGift } from "../Views/LyPayFirstGift";
import { LyPayMonthCard } from "../Views/LyPayMonthCard";
import { LyMount } from "../Views/LyMount";
import { LyFriendInvite } from "../Views/LyFriendInvite";
import { LyPalaceMain } from "../Views/LyPalaceMain";
import { LyPalaceGrant } from "../Views/LyPalaceGrant";
import { LyStage } from "../Views/LyStage";
import { LyStageReward } from "../Views/LyStageReward";
import { LyMountSkin } from "../Views/LyMountSkin";
import { LyCrossQunYin } from "../Views/LyCrossQunYin";
import { LyPayAllEntry } from "../Views/LyPayAllEntry";
import { LyFairyGift } from "../Views/LyFairyGift";
import { LyHaven } from "../Views/LyHaven";
import { LyEliteDraw } from "../Views/LyEliteDraw";
import { LyTheurgyDraw } from "../Views/LyTheurgyDraw";
import { LyCompanion } from "../Views/LyCompanion";
import { LyPet } from "../Views/LyPet";
import { LyActivitySevenDays } from "../Views/LyActivitySevenDays";
import { LyBreakStage } from "../Views/LyBreakStage";
import { LyCharacter } from "../Views/LyCharacter";
import { LyTheurgy } from "../Views/LyTheurgy";
import { LyEvolution } from "../Views/LyEvolution";
import { LyVeinSatori } from "../Views/LyVeinSatori";
import { LyVein } from "../Views/LyVein";
import { LyEliteAttack } from "../Views/LyEliteAttack";
import { LyBuddyMass } from "../Views/LyBuddyMass";
import { LyPsychicInsight } from "../Views/LyPsychicInsight";
import { LyTheurgyGroup } from "../Views/LyTheurgyGroup";
import { LyDemonPath } from "../Views/LyDemonPath";
import { LyEliteMonster } from "../Views/LyEliteMonster";
import { LyClanApply } from "../Views/LyClanApply";
import { LyClanShop } from "../Views/LyClanShop";
import { LyClanTask } from "../Views/LyClanTask";
import { LyClanBattle } from "../Views/LyClanBattle";
import { LyClanBattleReward } from "../Views/LyClanBattleReward";
import { LyClanBattleTask } from "../Views/LyClanBattleTask";
import { LyClanMerchant } from "../Views/LyClanMerchant";
import { LyEliteGroup } from "../Views/LyEliteGroup";
import { LyTreeRebate } from "../Views/LyTreeRebate";
import { LyClanSolo } from "../Views/LyClanSolo";
import { LyClanSoloShop } from "../Views/LyClanSoloShop";
import { LyClanSoloGift } from "../Views/LyClanSoloGift";
import { LyClanSoloTask } from "../Views/LyClanSoloTask";
import { LyClanSoloPassport } from "../Views/LyClanSoloPassport";
import { LyActivityOpenRank } from "../Views/LyActivityOpenRank";
import { LyBrumeIsle } from "../Views/LyBrumeIsle";
import { LyBrumeIsleFire } from "../Views/LyBrumeIsleFire";
import { LyBrumeIsleGift } from "../Views/LyBrumeIsleGift";
import { LyGoldFinger } from "../Views/LyGoldFinger";
import { LyGoldFingerUpgrade } from "../Views/LyGoldFingerUpgrade";
import { LyPayUniteWeekCard } from "../Views/LyPayUniteWeekCard";
import { LyConquestSeekRankReward } from "../Views/LyConquestSeekRankReward";
import { LyConquestSeekTask } from "../Views/LyConquestSeekTask";
import { LyPaySevenGiftGroup } from "../Views/LyPaySevenGiftGroup";
import { LyPayExquisite } from "../Views/LyPayExquisite";
import { LyConquestSeekWiner } from "../Views/LyConquestSeekWiner";
import { LyTreeRebateGift } from "../Views/LyTreeRebateGift";

/**
 * 此处新增类型后，记得在树中绑定父子关系。
 * */
export enum PointRedType {
	LyTree = 1, // 第一个从1开始，不要在它上面插入类型。
		// 设置
		LySetting,
			LyPalaceGrantTips, // 主界面头像的tips
				LyPalaceGrant,
		// 坐骑
		LyMount,
			LyMountSkin,
			LyMountLevelUp,
		// 主界面下栏
		LyHomeList,
			LyPalaceMain,
				LyPalaceRoom,
				LyPalaceDianZan,
			LyHaven, //福地
			LyCompanion, //兽友
				LyCompanionInfo,
				LyCompanionBattle,
		LyChallengeList,
			LyChallengeDuel,
				LyChallengeDuelMatch,
			LyActivityKingMonster,
			LyActivityInvasion,
				LyActivityInvasionBattle,
			LyActivityMonsterTower,
				LyActivityMonsterTowerBattle,
			LyCrossQunYin,
		// 冒险
		LyStage,
			LyStageBattle,
			LyStageReward,
		//帮派
		LyClan,
			LyClanApply,
			LyClanShop,
			LyClanTask,
				LyClanTaskGet,
				LyClanTaskEvolve,
			LyClanBattle,
				LyClanBattleDuel,
				LyClanBattleReward,
				LyClanBattleTask,
			LyClanMerchant,
		LyActivityMonsterTowerAuto,
		// 活动栏
		LyPayFirstGift,
			LyPayFirstGiftDay,
			LyPayFirstGiftGroup,
		LyPaySevenGiftGroup,
		LyPayAllEntry,
			LyPayGiftDaily,
			LyPayGiftDailyChoose,
			LyPayMonthCard,
			LyPayFunds,
			totalCharge, //累充
			totalDay, //累充
		LyPayExquisite,
			LyPayExquisiteDaily,
				LyPayExquisiteDailyMain,
				LyPayExquisiteDailyLeiAct,
					LyPayExquisiteDailyLeiActTotal,
					LyPayExquisiteDailyLeiActDay,
			LyPayExquisiteLeiTotal,
			LyPayExquisiteCards,
				LyPayExquisiteCardsMonth,
				LyPayExquisiteCardsWeek,
			LyPayExquisiteFundAll,
				LyPayExquisiteFunds,
		LyFriendInvite,
		LyTreeRebate,
			LyTreeRebatePool,
			LyTreeRebateTask,
			LyTreeRebateGift,
		LyActivityOpenRank,
			LyActivityOpenRankBonuse,
		LyActivityOpenCelebration,
			LyActivityOpenCelebrationScore,
			LyActivityOpenCelebrationTask,
			LyActivityOpenCelebrationGifts,
		LyActivityReincarnationHall,
			LyActivityReincarnationHallTask,
			LyActivityReincarnationHallGifts,
		LyActivityFortune,
			LyActivityFortuneDraw,
			LyActivityFortuneDraw10,
			LyActivityFortuneScore,
			LyActivityFortuneTask,
			LyActivityFortuneGifts,
		LyActivitySevenDays,
		LyFairyGift, //风云录
			LyFairyGiftScore,
			LyFairyGiftTask,
			LyFairyGift3,
		LyConquestSeek, // 八荒
			LyConquestSeekWiner,
			LyConquestSeekTask,
			LyConquestSeekReward,
		LyEliteMonster,//门客
			LyEliteMonsterDraw,
				LyEliteDraw,
				LyEliteFullDer,
				LyEliteCard,
			LyEliteMonsterGroup,
		LyTheurgy,
			LyTheurgyDrawBtn,
				LyTheurgyDrawADbtn,	
				LyTheurgyDrawTenbtn,
			TheurgyRed,
			LyTheurgyGroup,
		LyGoldFinger,
			LyGoldFingerPump,
			LyGoldFingerLevel,
			LyGoldFingerUpgrade,
			LyGoldFingerCanUse,
		LyEvolution,
			LyEvolutionLevelUp,
			LyEvolutionSpeed,
		LyVein,
			LyVeinStimule,
				LyVeinSatori,
		LyEliteAttack,  //开服精怪
			LyEliteAttackTask,
			LyEliteAttackGift,
			LyEliteAttackToUp,
		LyBuddyMass,  //开服伙伴
			LyBuddyMassTask,
			LyBuddyMassGift,
			LyBuddyMassScore,
		LyPsychicInsight, //开服秘籍
			LyPsychicInsightTask,
			LyPsychicInsightShenmai,
			LyPsychicInsightGift,
		LyPet,//侠侣
			LyPetLevel,
			LyPetAD,
		LyBreakStage,//突破
			LyBreakStageBreak,
			LyBreakStageTake,
		LyCharacter,//百相阁
		LyDemonPath,//妖途
		LyClanSolo,//单刀赴会
			LyClanSoloPhysical,
			LyClanSoloShop,
			LyClanSoloGift,
			LyClanSoloTask,
			LyClanSoloPassport,
		LyBrumeIsle,//雾影岛
			LyBrumeIsJoin,
				LyBrumeIsMarkGet,
				LyBrumeFullPower,
			LyBrumeIsFire,
			LyBrumeIsGift,
}

interface PointRedAttach {
    gObject:fgui.GComponent,
    onDispose: Function,
	onReturnPool: Function,
}

interface PointRedNode {
    type:PointRedType, // 类型决定红点部位。
	upid:number, // 同类型中，多个需要用唯一id区别。
    isRed: boolean, // 当前节点是否显示红点。
	attach: PointRedAttach, // 注册的节点。
    childs: Array<PointRedNode> // 节点下的子节点。
	params?: any, // 保存的参数提供给callfunc用。
	callfunc?: Function, // 此节点的刷新逻辑。
}

export class PointRedData {
    private static instance: PointRedData;
	public static getInstance(): PointRedData {
		if (!PointRedData.instance) {
			PointRedData.instance = new PointRedData();
		}
		return PointRedData.instance
	}
	public static destroyInstance() {
		if (PointRedData.instance) {
			PointRedData.instance.clear();
			PointRedData.instance = null;
		}
	}

	private isInit:boolean;
	private pointTree:PointRedNode;
	private constructor() {
		this.pointTree = {
			type: PointRedType.LyTree,
			upid: 1,
			isRed: false,
			attach: undefined,
			childs: [
				// 设置。
				{
					type: PointRedType.LySetting,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyPalaceGrantTips,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
								{
									type: PointRedType.LyPalaceGrant,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: () => {
										return LyPalaceGrant.isViewRedPoint();
									}
								}
							]
						}
					]
				},
				// 坐骑。
				{
					type: PointRedType.LyMount,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyMountSkin,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyMountSkin.isViewRedPoint();
							}
						},
						{
							type: PointRedType.LyMountLevelUp,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyMount.isViewRedPointLevelUp();
							}
						}
					]
				},
				// 主界面“洞府”
				{
					type: PointRedType.LyHomeList,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						// 琅琊榜
						{
							type: PointRedType.LyPalaceMain,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
								{
									type: PointRedType.LyPalaceRoom,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: () => {
										return LyPalaceMain.isViewRedPointRoom();
									}
								},
								{
									type: PointRedType.LyPalaceDianZan,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: () => {
										return LyPalaceMain.isViewRedPointDianZan();
									}
								}
							]
						},
						// 镖局
						{
							type: PointRedType.LyHaven,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyHaven.isViewRedPoint();
							}
						},
						// 兽友
						{
							type: PointRedType.LyCompanion,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
								{
									type: PointRedType.LyCompanionInfo,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: () => {
										return LyCompanion.isViewRedPoint();
									}
								},
								{
									type: PointRedType.LyCompanionBattle,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: () => {
										return LyCompanion.isViewRedPointBattle();
									}
								},
							]
						},
						//百相阁
						{
							type: PointRedType.LyCharacter,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyCharacter.isViewRedPoint();
							}	
						}
					]
				},
				// 主界面“挑战”。
				{
					type: PointRedType.LyChallengeList,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyChallengeDuel,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
								{
									type: PointRedType.LyChallengeDuelMatch,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: () => {
										return LyChallengeDuelMatch.isViewRedPoint();
									}
								}
							]
						},
						{
							type: PointRedType.LyActivityKingMonster,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyActivityKingMonster.isViewRedPoint();
							}
						},
						{
							type: PointRedType.LyActivityInvasion,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
								{
									type: PointRedType.LyActivityInvasionBattle,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: () => {
										return LyActivityInvasion.isViewRedPoint();
									}
								}
							]
						},
						{
							type: PointRedType.LyActivityMonsterTower,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
								{
									type: PointRedType.LyActivityMonsterTowerBattle,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: () => {
										return LyActivityMonsterTower.isViewRedPointBattle();
									}
								}
							]
						},
						{
							type: PointRedType.LyCrossQunYin,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyCrossQunYin.isViewRedPoint();
							}
						},
					]
				},
				// 冒险。
				{
					type: PointRedType.LyStage,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyStageBattle,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyStage.isViewRedPointBattle();
							}
						},
						{
							type: PointRedType.LyStageReward,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyStageReward.isViewRedPoint();
							}
						}
					]
				},
				// 激流塔，加成预设。
				{
					type: PointRedType.LyActivityMonsterTowerAuto,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [],
					callfunc: () => {
						return LyActivityMonsterTower.isViewRedPointAuto();
					}
				},
				// 首充。
				{
					type: PointRedType.LyPayFirstGift,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyPayFirstGiftDay,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyPayFirstGift.isViewRedPointDay();
							}
						},
						{
							type: PointRedType.LyPayFirstGiftGroup,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyPayFirstGift.isViewRedPointGroup();
							}
						}
					]
				},
				// 七天礼包。
				{
					type: PointRedType.LyPaySevenGiftGroup,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [],
					callfunc: () => {
						return LyPaySevenGiftGroup.isViewRedPoint();
					}
				},
				// 充值入口。
				{
					type: PointRedType.LyPayAllEntry,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyPayGiftDaily,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyPayGiftDaily.isViewRedPoint();
							}
						},
						{
							type: PointRedType.LyPayGiftDailyChoose,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyPayGiftDailyChoose.isViewRedPoint();
							}
						},
						{
							type: PointRedType.LyPayMonthCard,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return (LyPayMonthCard.isViewRedPointMonth() || LyPayMonthCard.isViewRedPointLife());
							}
						},
						{
							type: PointRedType.totalCharge,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyPayAllEntry.isTotalChargeViewRedPoint();
							}
						},
						{
							type: PointRedType.totalDay,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyPayAllEntry.isTotalDayViewRedPoint();
							}
						}
					],
				},
				{
					type: PointRedType.LyPayExquisite,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyPayExquisiteDaily,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
								{
									type: PointRedType.LyPayExquisiteDailyLeiAct,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [
										{
											type: PointRedType.LyPayExquisiteDailyLeiActTotal,
											upid: 1,
											isRed: false,
											attach: undefined,
											childs: [],
											callfunc: () => {
												return false//LyPayAllEntry.isTotalChargeViewRedPoint();
											}
										},
										{
											type: PointRedType.LyPayExquisiteDailyLeiActDay,
											upid: 1,
											isRed: false,
											attach: undefined,
											childs: [],
											callfunc: () => {
												return LyPayAllEntry.isTotalDayViewRedPoint();
											}
										}
									]
								},
								{
									type: PointRedType.LyPayExquisiteDailyMain,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: () => {
										return LyPayGiftDaily.isViewRedPoint();
									}
								}
							]
						},
						{
							type: PointRedType.LyPayExquisiteLeiTotal,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyPayExquisite.isViewRedPointLeiTotal();
							}
						},
						{
							type: PointRedType.LyPayExquisiteCards,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
								{
									type: PointRedType.LyPayExquisiteCardsMonth,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: () => {
										return (LyPayMonthCard.isViewRedPointMonth() || LyPayMonthCard.isViewRedPointLife());
									}
								},
								{
									type: PointRedType.LyPayExquisiteCardsWeek,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: () => {
										
									}
								}
							]
						},
						{
							type: PointRedType.LyPayExquisiteFundAll,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: []
						}
					],
				},
				// 邀请好友。
				{
					type: PointRedType.LyFriendInvite,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [],
					callfunc: () => {
						return LyFriendInvite.isViewRedPoint(false);
					}
				},
				// 金竹返利。
				{
					type: PointRedType.LyTreeRebate,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyTreeRebatePool,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyTreeRebate.isViewRedPointPool();
							}
						},
						{
							type: PointRedType.LyTreeRebateTask,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyTreeRebate.isViewRedPointTask();
							}
						},
						{
							type: PointRedType.LyTreeRebateGift,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyTreeRebateGift.isViewRedPoint();
							}
						}
					]
				},
				// 开服7天排行榜。
				{
					type: PointRedType.LyActivityOpenRank,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyActivityOpenRankBonuse,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyActivityOpenRank.isViewRedPointBonuse();
							}
						}
					]
				},
				// 仙缘
				{
					type: PointRedType.LyFairyGift,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyFairyGiftScore,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyFairyGift.LyFairyGiftScore();
							}
						},
						{
							type: PointRedType.LyFairyGiftTask,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyFairyGift.LyFairyGiftTask();
							}
						},
						{
							type: PointRedType.LyFairyGift3,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyFairyGift.LyFairyGift3();;
							}
						},
					],
					callfunc: () => {
						return LyFairyGift.isViewRedPoint();
					}
				},
				// 七日签到
				{
					type: PointRedType.LyConquestSeek,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyConquestSeekWiner,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyConquestSeekWiner.isViewRedPoint();
							}
						},
						{
							type: PointRedType.LyConquestSeekTask,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyConquestSeekTask.isViewRedPoint();
							}
						},
						{
							type: PointRedType.LyConquestSeekReward,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyConquestSeekRankReward.isViewRedPoint();
							}
						}
					]
				},
				// 七日签到
				{
					type: PointRedType.LyActivitySevenDays,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [],
					callfunc: () => {
						return LyActivitySevenDays.isViewRedPoint();
					}
				},
				// 门客
				{
					type: PointRedType.LyEliteMonster,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyEliteMonsterDraw,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
								{
									type: PointRedType.LyEliteDraw,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [
										
									],
									callfunc: () => {
										return LyEliteDraw.isViewRedPoint();
									}
								},
								{
									type: PointRedType.LyEliteCard,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [
										
									],
									callfunc: () => {
										if (!GameServerData.getInstance().isActivationSys(VarVal.SYSYTEM_ID.elite)) {
											return false
										}
										return LyPayUniteWeekCard.isViewRedPointLife() || LyPayUniteWeekCard.unitxWeekTakeData() != null;
									}
								},
							],
						},
						{
							type: PointRedType.LyEliteFullDer,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyEliteMonster.isViewRedPointFull();
							}
						},
						{
							type: PointRedType.LyEliteMonsterGroup,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyEliteGroup.isViewRedPoint();
							}
						},
					],
					
				},
				// 秘籍
				{
					type: PointRedType.LyTheurgy,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyTheurgyDrawBtn,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
								{
									type: PointRedType.LyTheurgyDrawADbtn,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: () => {
										return LyTheurgyDraw.freeADBtn();
									}
								},
								{
									type: PointRedType.LyTheurgyDrawTenbtn,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: () => {
										return LyTheurgyDraw.tenDrawBtn();
									}
								},
								
							],
						},
						{
							type: PointRedType.TheurgyRed,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyTheurgy.isNoUpSeal();
							}
						},
						{
							type: PointRedType.LyTheurgyGroup,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyTheurgyGroup.isViewRedPointGroup();
							}
						},
					],
				},
				// 侠侣
				{
					type: PointRedType.LyPet,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyPetAD,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyPet.isViewRedPointAd();
							}
						},
						{
							type: PointRedType.LyPetLevel,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: () => {
								return LyPet.isViewRedPointLevel();
							}
						},
					],
				},
				// 突破
				{
					type: PointRedType.LyBreakStage,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyBreakStageBreak,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: ()=>{
								return LyBreakStage.isViewRedPointBreak();
							}
						},
						{
							type: PointRedType.LyBreakStageTake,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: ()=>{
								return LyBreakStage.isViewRedPointTake();
							}
						},
					]
				},
				// 金手指
				{
					type: PointRedType.LyGoldFinger,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyGoldFingerPump,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: ()=>{
								return LyGoldFinger.isViewRedPointPump(false);
							}
						},
						{
							type: PointRedType.LyGoldFingerLevel,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
								{
									type: PointRedType.LyGoldFingerUpgrade,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: ()=>{
										return LyGoldFingerUpgrade.isViewRedPointUpgrade();
									}
								},
								{
									type: PointRedType.LyGoldFingerCanUse,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: ()=>{
										return LyGoldFingerUpgrade.isViewRedPointCanUse();
									}
								}
							]
						}
					]
				},
				// 鱼塘
				{
					type: PointRedType.LyEvolution,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyEvolutionLevelUp,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: ()=>{
								return LyEvolution.cnaUpLevel()
							}
						},
						{
							type: PointRedType.LyEvolutionSpeed,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: ()=>{
								return LyEvolution.canAddSpeed()
							}
						},
					],
					callfunc: ()=>{
						// return LyEvolution.isViewRedPoint()
					}
				},
				// 灵脉
				{
					type: PointRedType.LyVein,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyVeinSatori,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
								
							],
							callfunc: ()=>{
								return LyVeinSatori.learnNumber()
							}
						},
						{
							type: PointRedType.LyVeinStimule,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: ()=>{
								return LyVein.isViewRedPointStimule()
							}
						},
					],
				},
				//妖途
				{
					type: PointRedType.LyDemonPath,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [],
					callfunc: ()=>{
						return LyDemonPath.inViewRedPoint()
					}
				},
				// 主界面“帮派”。
				{
					type: PointRedType.LyClan,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyClanShop,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: ()=>{
								return LyClanShop.isViewRedPoint()
							}
						},
						{
							type: PointRedType.LyClanApply,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: ()=>{
								return LyClanApply.isViewRedPoint()
							}
						},
						{
							type: PointRedType.LyClanTask,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
								{
									type: PointRedType.LyClanTaskGet,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: ()=>{
										return LyClanTask.isViewRedPoint()
									}
								},
								{
									type: PointRedType.LyClanTaskEvolve,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: ()=>{
										return LyClanTask.isViewRedPointEvolve()
									}
								},
							]
						},
						{
							type: PointRedType.LyClanBattle,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
								{
									type: PointRedType.LyClanBattleDuel,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: ()=>{
										return LyClanBattle.isViewRedPointDuel()
									}
								},
									{
									type: PointRedType.LyClanBattleTask,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: ()=>{
										return LyClanBattleTask.isViewRedPointTask()
									}
								},
								{
									type: PointRedType.LyClanBattleReward,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [],
									callfunc: ()=>{
										return LyClanBattleReward.isViewRedPointReward()
									}
								},
							],
						},
						{
							type: PointRedType.LyClanMerchant,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: ()=>{
								return LyClanMerchant.isViewRedPoint()
							}
						},
					]
				},
				//单刀赴会
				{
					type: PointRedType.LyClanSolo,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyClanSoloPhysical,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
							],
							callfunc: ()=>{
								return LyClanSolo.isViewRedPoint()
							}
						},
						{
							type: PointRedType.LyClanSoloShop,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: ()=>{
								return LyClanSoloShop.isViewRedPointShop()
							}
						},
						{
							type: PointRedType.LyClanSoloGift,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: ()=>{
								return LyClanSoloGift.isViewRedPointGift()
							}
						},
						{
							type: PointRedType.LyClanSoloTask,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: ()=>{
								return LyClanSoloTask.isViewRedPointTask()
							}
						},
						{
							type: PointRedType.LyClanSoloPassport,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [],
							callfunc: ()=>{
								return LyClanSoloPassport.isViewRedPointPassport()
							}
						},
						
					],
				},
				//雾影岛
				{
					type: PointRedType.LyBrumeIsle,
					upid: 1,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyBrumeIsJoin,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
								{
									type: PointRedType.LyBrumeIsMarkGet,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [
									],
									callfunc: ()=>{
										return LyBrumeIsle.isRedPointMarkDie()
									}
								},
								{
									type: PointRedType.LyBrumeFullPower,
									upid: 1,
									isRed: false,
									attach: undefined,
									childs: [
									],
									callfunc: ()=>{
										return LyBrumeIsle.isRedPointFullPower()
									}
								},
							],
						},
						{
							type: PointRedType.LyBrumeIsFire,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
							],
							callfunc: ()=>{
								return LyBrumeIsleFire.isRedPoint()
							}
						},
						{
							type: PointRedType.LyBrumeIsGift,
							upid: 1,
							isRed: false,
							attach: undefined,
							childs: [
							],
							callfunc: ()=>{
								return LyBrumeIsleGift.inViewRedPointGift()
							}
						},
					],
				},
				// 其他。
			]
		}
	}
	private clear() {
		this.isInit = false;
		this.iterClearChild(this.pointTree);
		this.pointTree = undefined;
	}
	private iterClearChild(child:PointRedNode): void {
		if (child.childs.length > 0) {
			for (let i = 0; i < child.childs.length; i++) {
				this.iterClearChild(child.childs[i]);
			}
		}
		this.clearChildAttach(child);
	}

	/**
	 * 手动刷新树梢末端自定义的红点（无需挂红点树上的，如：免费、可领取、挑战）。
	 * */
	public updateManualPoint(gObject:fgui.GComponent, isRed:boolean): void {
		let img_red_point = gObject.getChild("img_red_point");
		if (img_red_point && !img_red_point.isDisposed) { // 如果是Cocos的node被删除，他先是释放孩子，再释放自己的。
			img_red_point.visible = isRed;
		}
	}

	/**
	 * 刷新对应节点的红点。
	 * */
	private updateChildAttach(child:PointRedNode): void {
		if (child.attach) {
			this.updateManualPoint(child.attach.gObject, child.isRed);
		}
	}

	/**
	 * 清除绑定的UI对象。
	 * */
	private clearChildAttach(child:PointRedNode): void {
		if (child.attach) {
			this.updateManualPoint(child.attach.gObject, false);
			child.attach.gObject.off(fgui.Event.DISPOSE_BEFORE, child.attach.onDispose);
			child.attach.gObject.off(fgui.Event.RETURNPOOL_BEFORE, child.attach.onReturnPool);
			child.attach = undefined;
		}
	}

	/**
	 * 获得对应类型的节点。
	 * */
	private getChildInTree(child:PointRedNode, ptype:PointRedType, pupid:number): PointRedNode {
		if (child.type == ptype && child.upid == pupid) {
			return child;
		} else {
			for (let i = 0; i < child.childs.length; i++) {
				let c = this.getChildInTree(child.childs[i], ptype, pupid);
				if (c) {
					return c;
				}
			}
		}
	}

	/**
	 * 遍历红点树。
	 * @param ptype = null是更新该节点下的所有。
	 * */
	private updateTree(child:PointRedNode, ptype:PointRedType, pupid?:number): void {
		if (!pupid) {pupid = 1}
		if (!ptype || (child.type == ptype && child.upid == pupid)) {
			ptype = null;
		}
		let newRed = false;
		if (child.childs.length > 0) { // 父节点
			for (let i = 0; i < child.childs.length; i++) {
				this.updateTree(child.childs[i], ptype, pupid);
				if (child.childs[i].isRed) {
					newRed = true;
				}
			}
		} else { // 叶节点
			if (child.callfunc) { // 实节点
				if (!ptype) { // 目标节点
					newRed = child.callfunc(child.params);
				} else { // 非目标节点
					newRed = child.isRed;
				}
			} else { // 空节点
				newRed = false;
			}
		}
		if (child.isRed != newRed) {
			child.isRed = newRed;
			this.updateChildAttach(child);
		}
	}

	/**
	 * 初始化红点树。
	 * */
	public initPointTree(): void {
		if (!this.isInit) {
			this.isInit = true;
			this.updateTree(this.pointTree, null);
			
			// 新增动态节点（基金5类，因为最多5个，所以常在内存咯）
			this.createBranchIn(PointRedType.LyPayAllEntry, null, PointRedType.LyPayFunds, Number(VarVal.payOtherType.fundxiuwei), VarVal.payOtherType.fundxiuwei);
			this.createBranchIn(PointRedType.LyPayAllEntry, null, PointRedType.LyPayFunds, Number(VarVal.payOtherType.fundstage), VarVal.payOtherType.fundstage);
			this.createBranchIn(PointRedType.LyPayAllEntry, null, PointRedType.LyPayFunds, Number(VarVal.payOtherType.fundxianshu), VarVal.payOtherType.fundxianshu);
			this.createBranchIn(PointRedType.LyPayAllEntry, null, PointRedType.LyPayFunds, Number(VarVal.payOtherType.fundtower), VarVal.payOtherType.fundtower);
			this.createBranchIn(PointRedType.LyPayExquisiteFundAll, null, PointRedType.LyPayExquisiteFunds, Number(VarVal.payOtherType.fundxiuwei), VarVal.payOtherType.fundxiuwei);
			this.createBranchIn(PointRedType.LyPayExquisiteFundAll, null, PointRedType.LyPayExquisiteFunds, Number(VarVal.payOtherType.fundstage), VarVal.payOtherType.fundstage);
			this.createBranchIn(PointRedType.LyPayExquisiteFundAll, null, PointRedType.LyPayExquisiteFunds, Number(VarVal.payOtherType.fundxianshu), VarVal.payOtherType.fundxianshu);
			this.createBranchIn(PointRedType.LyPayExquisiteFundAll, null, PointRedType.LyPayExquisiteFunds, Number(VarVal.payOtherType.fundtower), VarVal.payOtherType.fundtower);

			// 新增动态节点（运营活动）
			let dynamicParams = GameServerData.getInstance().getDynamicActivityParams();
			for (let id in dynamicParams) {
				this.createDynaActivityBranch(dynamicParams[id]);
			}
		}
	}

	/**
	 * 运营活动创建红点树接口。
	 * */
	public createDynaActivityBranch(dynamicParam:any): void {
		if (dynamicParam.clasz == VarVal.ACTIVITY_CLASZ.OPENCELEBRATION) {
			this.createBranchIn(PointRedType.LyTree, null, PointRedType.LyActivityOpenCelebration, dynamicParam.id, String(dynamicParam.id));
		} else if (dynamicParam.clasz == VarVal.ACTIVITY_CLASZ.REINCARNATIONHALL) {
			this.createBranchIn(PointRedType.LyTree, null, PointRedType.LyActivityReincarnationHall, dynamicParam.id, String(dynamicParam.id));
		} else if (dynamicParam.clasz == VarVal.ACTIVITY_CLASZ.FORTUNE) {
			this.createBranchIn(PointRedType.LyTree, null, PointRedType.LyActivityFortune, dynamicParam.id, String(dynamicParam.id));
		}else if (dynamicParam.clasz == VarVal.ACTIVITY_CLASZ.ELITEMONSTOR_LL) {
			this.createBranchIn(PointRedType.LyTree, null, PointRedType.LyEliteAttack, dynamicParam.id, String(dynamicParam.id));
		}else if (dynamicParam.clasz == VarVal.ACTIVITY_CLASZ.BUDDYMASS) {
			this.createBranchIn(PointRedType.LyTree, null, PointRedType.LyBuddyMass, dynamicParam.id, String(dynamicParam.id));
		}else if (dynamicParam.clasz == VarVal.ACTIVITY_CLASZ.PSYCHICINSIGHT) {
			this.createBranchIn(PointRedType.LyTree, null, PointRedType.LyPsychicInsight, dynamicParam.id, String(dynamicParam.id));
		}
	}

	/**
	 * 移除活动创建红点树接口。
	 * */
	public removeDynaActivityBranch(dynamicParam:any): void {
		if (dynamicParam.clasz == VarVal.ACTIVITY_CLASZ.OPENCELEBRATION) {
			this.removeBranch(PointRedType.LyActivityOpenCelebration, dynamicParam.id);
		} else if (dynamicParam.clasz == VarVal.ACTIVITY_CLASZ.REINCARNATIONHALL) {
			this.removeBranch(PointRedType.LyActivityReincarnationHall, dynamicParam.id);
		} else if (dynamicParam.clasz == VarVal.ACTIVITY_CLASZ.FORTUNE) {
			this.removeBranch(PointRedType.LyActivityFortune, dynamicParam.id);
		}else if (dynamicParam.clasz == VarVal.ACTIVITY_CLASZ.ELITEMONSTOR_LL) {
			this.removeBranch(PointRedType.LyEliteAttack, dynamicParam.id);
		}else if (dynamicParam.clasz == VarVal.ACTIVITY_CLASZ.BUDDYMASS) {
			this.removeBranch(PointRedType.LyBuddyMass, dynamicParam.id);
		}else if (dynamicParam.clasz == VarVal.ACTIVITY_CLASZ.PSYCHICINSIGHT) {
			this.removeBranch(PointRedType.LyPsychicInsight, dynamicParam.id);
		}
	}

	/**
	 * 新增红点树节点。
	 * */
	public createBranchIn(p_ptype:PointRedType, p_upid:number = 1, ptype:PointRedType, pupid:number = 1, params:any): void {
		if (!p_upid) {p_upid = 1}
		if (!pupid) {pupid = 1}

		let treeRoot:PointRedNode;
		if (ptype == PointRedType.LyPayFunds) {
			treeRoot = {
				type: PointRedType.LyPayFunds,
				upid: pupid,
				isRed: false,
				attach: undefined,
				childs: [],
				params: params,
				callfunc: (prm) => {
					return LyPayFunds.getFundState(prm) == 1;
				}
			}
		} else if (ptype == PointRedType.LyPayExquisiteFunds) {
			treeRoot = {
				type: PointRedType.LyPayExquisiteFunds,
				upid: pupid,
				isRed: false,
				attach: undefined,
				childs: [],
				params: params,
				callfunc: (prm) => {
					return LyPayFunds.getFundState(prm) == 1;
				}
			}
		} else if (ptype == PointRedType.LyActivityOpenCelebration) {
			treeRoot = {
				type: PointRedType.LyActivityOpenCelebration,
				upid: pupid,
				isRed: false,
				attach: undefined,
				childs: [
					{
						type: PointRedType.LyActivityOpenCelebrationScore,
						upid: pupid,
						isRed: false,
						attach: undefined,
						childs: [],
						params: params,
						callfunc: (prm) => {
							return LyActivityOpenCelebration.isViewRedPointScore(prm);
						}
					},
					{
						type: PointRedType.LyActivityOpenCelebrationTask,
						upid: pupid,
						isRed: false,
						attach: undefined,
						childs: [],
						params: params,
						callfunc: (prm) => {
							return LyActivityOpenCelebration.isViewRedPointTask(prm);
						}
					},
					{
						type: PointRedType.LyActivityOpenCelebrationGifts,
						upid: pupid,
						isRed: false,
						attach: undefined,
						childs: [],
						params: params,
						callfunc: (prm) => {
							return LyActivityOpenCelebration.isViewRedPointGifts(prm);
						}
					}
				]
			}
		} else if (ptype == PointRedType.LyActivityReincarnationHall) {
			treeRoot = {
				type: PointRedType.LyActivityReincarnationHall,
				upid: pupid,
				isRed: false,
				attach: undefined,
				childs: [
					{
						type: PointRedType.LyActivityReincarnationHallTask,
						upid: pupid,
						isRed: false,
						attach: undefined,
						childs: [],
						params: params,
						callfunc: (prm) => {
							return LyActivityReincarnationHall.isViewRedPointTask(prm);
						}
					},
					{
						type: PointRedType.LyActivityReincarnationHallGifts,
						upid: pupid,
						isRed: false,
						attach: undefined,
						childs: [],
						params: params,
						callfunc: (prm) => {
							return LyActivityReincarnationHall.isViewRedPointGifts(prm);
						}
					}
				]
			}
		} else if (ptype == PointRedType.LyActivityFortune) {
			treeRoot = {
				type: PointRedType.LyActivityFortune,
				upid: pupid,
				isRed: false,
				attach: undefined,
				childs: [
					{
						type: PointRedType.LyActivityFortuneDraw,
						upid: pupid,
						isRed: false,
						attach: undefined,
						childs: [],
						params: params,
						callfunc: (prm) => {
							return LyActivityFortune.isViewRedPointDraw(prm);
						}
					},
					{
						type: PointRedType.LyActivityFortuneDraw10,
						upid: pupid,
						isRed: false,
						attach: undefined,
						childs: [],
						params: params,
						callfunc: (prm) => {
							return LyActivityFortune.isViewRedPointDraw(prm, 10);
						}
					},
					{
						type: PointRedType.LyActivityFortuneScore,
						upid: pupid,
						isRed: false,
						attach: undefined,
						childs: [],
						params: params,
						callfunc: (prm) => {
							return LyActivityFortune.isViewRedPointScore(prm);
						}
					},
					{
						type: PointRedType.LyActivityFortuneTask,
						upid: pupid,
						isRed: false,
						attach: undefined,
						childs: [],
						params: params,
						callfunc: (prm) => {
							return LyActivityFortune.isViewRedPointTask(prm);
						}
					},
					{
						type: PointRedType.LyActivityFortuneGifts,
						upid: pupid,
						isRed: false,
						attach: undefined,
						childs: [],
						params: params,
						callfunc: (prm) => {
							return LyActivityFortune.isViewRedPointGifts(prm);
						}
					}
				]
			}
		} else if (ptype == PointRedType.LyEliteAttack) {
				treeRoot = {
					type: PointRedType.LyEliteAttack,
					upid: pupid,
					isRed: false,
					attach: undefined,
					childs: [
						{
							type: PointRedType.LyEliteAttackTask,
							upid: pupid,
							isRed: false,
							attach: undefined,
							childs: [],
							params: params,
							callfunc: (prm) => {
								return LyEliteAttack.inViewRedPointTask(prm);
							}
						},
						{
							type: PointRedType.LyEliteAttackGift,
							upid: pupid,
							isRed: false,
							attach: undefined,
							childs: [],
							params: params,
							callfunc: (prm) => {
								return LyEliteAttack.inViewRedPointGift(prm);
							}
						},
						{
							type: PointRedType.LyEliteAttackToUp,
							upid: pupid,
							isRed: false,
							attach: undefined,
							childs: [],
							params: params,
							callfunc: (prm) => {
								return LyEliteAttack.inViewRedPointToUp(prm);
							}
						},
					]
				}
		} else if (ptype == PointRedType.LyBuddyMass) {
			treeRoot = {
				type: PointRedType.LyBuddyMass,
				upid: pupid,
				isRed: false,
				attach: undefined,
				childs: [
					{
						type: PointRedType.LyBuddyMassTask,
						upid: pupid,
						isRed: false,
						attach: undefined,
						childs: [],
						params: params,
						callfunc: (prm) => {
							return LyBuddyMass.inViewRedPointTask(prm);
						}
					},
					{
						type: PointRedType.LyBuddyMassGift,
						upid: pupid,
						isRed: false,
						attach: undefined,
						childs: [],
						params: params,
						callfunc: (prm) => {
							return LyBuddyMass.inViewRedPointGift(prm);
						}
					},
					{
						type: PointRedType.LyBuddyMassScore,
						upid: pupid,
						isRed: false,
						attach: undefined,
						childs: [],
						params: params,
						callfunc: (prm) => {
							return LyBuddyMass.inViewRedPointFullScore(prm);
						}
					},
				]
			}
		} else if (ptype == PointRedType.LyPsychicInsight) {
			treeRoot = {
				type: PointRedType.LyPsychicInsight,
				upid: pupid,
				isRed: false,
				attach: undefined,
				childs: [
					{
						type: PointRedType.LyPsychicInsightTask,
						upid: pupid,
						isRed: false,
						attach: undefined,
						childs: [],
						params: params,
						callfunc: (prm) => {
							return LyPsychicInsight.inViewRedPointTask(prm);
						}
					},
					{
						type: PointRedType.LyPsychicInsightShenmai,
						upid: pupid,
						isRed: false,
						attach: undefined,
						childs: [],
						params: params,
						callfunc: (prm) => {
							return LyPsychicInsight.inViewRedPointShenmai(prm);
						}
					},
					{
						type: PointRedType.LyPsychicInsightGift,
						upid: pupid,
						isRed: false,
						attach: undefined,
						childs: [],
						params: params,
						callfunc: (prm) => {
							return LyPsychicInsight.inViewRedPointGift(prm);
						}
					},
				]
			}
		}
		if (treeRoot) {
			let parent = this.getChildInTree(this.pointTree, p_ptype, p_upid);
			parent.childs.push(treeRoot);
			// 刷新子树及其所有节点。
			this.updatePointChild(treeRoot.type, treeRoot.upid);
		}
	}

	/**
	 * 移除红点树节点。
	 * */
	public removeBranch(ptype:PointRedType, pupid:number = 1): void {
		if (!pupid) {pupid = 1}

		this.removeChildIn(this.pointTree, ptype, pupid);
		// 刷新更新所有节点状态，但不重新计算。
		this.updatePointChild(ptype, pupid);
	}

	/**
	 * 更新红点树节点。
	 * */
	private removeChildIn(parent:PointRedNode, ptype:PointRedType, pupid?:number): void {
		for (let i = 0; i < parent.childs.length; i++) {
			let child = parent.childs[i];
			if (child.type == ptype && child.upid == pupid) {
				this.iterClearChild(child);
				parent.childs.splice(i, 1);
				break;
			} else {
				this.removeChildIn(child, ptype, pupid);
			}
		}
	}

	/**
	 * 更新红点树节点。
	 * */
	public updatePointChild(ptype:PointRedType, pupid?:number): void {
		if (!pupid) {pupid = 1}
		this.updateTree(this.pointTree, ptype, pupid);
	}

	/**
	 * 注册红点事件监听（内部去重，并在它销毁时注销监听）。
	 * */
	public registerPoint(gObj:fgui.GComponent, ptype:PointRedType, pupid?:number): void {
		if (!pupid) {pupid = 1}
		let child = this.getChildInTree(this.pointTree, ptype, pupid);
		if (!child) {
			return; // 防错，应该是pupid参数错了。
		}
		this.clearChildAttach(child);
		// 监听销毁
		let onDps = () => {
			this.clearChildAttach(child);
		}
		gObj.on(fgui.Event.DISPOSE_BEFORE, onDps);
		let onRtp = () => {
			this.clearChildAttach(child);
		}
		gObj.on(fgui.Event.RETURNPOOL_BEFORE, onRtp);
		// 构造赋值
		child.attach = {
			gObject: gObj,
			onDispose: onDps,
			onReturnPool: onRtp
		};
		// 当前红点标记
		this.updateChildAttach(child);
	}
}