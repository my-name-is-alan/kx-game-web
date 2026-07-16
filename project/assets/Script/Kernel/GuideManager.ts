//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { UtilsUI } from "./UtilsUI";
import { GameServer } from "./GameServer";
import { GameServerData } from "./GameServerData";
import { ViewDispatcher } from "./ViewDispatcher";
import { Vec2 } from "cc";
import { ViewLayer } from "./ViewLayer";
import { VarVal } from "../Values/VarVal";
import { LyGuideStart } from "../Views/LyGuideStart";
import { LyMainPage, MAINPAGE_ACTIVITY } from "../Views/LyMainPage";
import { LyStage } from "../Views/LyStage";
import { LyMount } from "../Views/LyMount";
import { LyPet } from "../Views/LyPet";
import { LyVein } from "../Views/LyVein";
import { LyEvolution } from "../Views/LyEvolution";
import { LyChallengeDuel } from "../Views/LyChallengeDuel";
import { CHALLENGE_TYPES, LyChallengeList } from "../Views/LyChallengeList";
import { LyActivityInvasion } from "../Views/LyActivityInvasion";
import { LyActivityMonsterTower } from "../Views/LyActivityMonsterTower";
import { HOME_TYPES, LyHomeList } from "../Views/LyHomeList";
import { LyEliteMonster } from "../Views/LyEliteMonster";
import { LyTheurgy } from "../Views/LyTheurgy";
import { LyAttachEquip } from "../Views/LyAttachEquip";
import { LyPalaceMain } from "../Views/LyPalaceMain";
import { LyHaven } from "../Views/LyHaven";
import { LyHavenResInfo } from "../Views/LyHavenResInfo";
import { LyHavenFind } from "../Views/LyHavenFind";
import { LyHavenManage } from "../Views/LyHavenManage";
import { LyCrossQunYin } from "../Views/LyCrossQunYin";
import { LyCompanion } from "../Views/LyCompanion";
import { LyGoldFinger } from "../Views/LyGoldFinger";

export interface GuideData {
	isTest?: boolean, // 是否测试的引导。
	isForce?: boolean, // 是否强制引导。
	openSysId?: string, // 系统开启ID。
	guideDetail?: string, // 引导文本。
	guideItem?: any, // 引导绑定的策划XML数据。
	guideType: string, // 纯客户端引导需要手动填充，服务器绑定时读取guideItem的类型。
}

export class GuideManager {
    private constructor () {}
	private static guideData:GuideData; // 锁定引导
	private static guideStep:number = 0; // 单个引导中的执行步骤

	/**
     * 清空引导锁定。
     */
	public static clear():void {
		GuideManager.guideData = null;
		GuideManager.guideStep = 0;
	}

	/**
     * 是否引导中。
     */
	public static isGuiding():boolean {
		if (GuideManager.guideData) {
			return true;
		} else {
			return false;
		}
	}

	/**
     * 测试引导。
     */
	public static startGuide(guideData:GuideData, phaseInfo?:any):void {
		if ((guideData.guideDetail && guideData.guideDetail.length > 0) // 有对话
			|| (guideData.guideType && guideData.guideType.length > 0 && guideData.guideType != "0")) { // 或有引导
			GuideManager.guideData = guideData; // 如果已存在未指引完的引导，会被覆盖。
			GuideManager.guideStep = 0;
			GuideManager.triggerGuide(phaseInfo);
		}
	}

	/**
     * 尝试触发引导。
     */
	public static triggerGuide(phaseInfo:any):void {
		// 这行根据下面注释描述编写代码。
		/**
		 * 这里怕引导过程中，出现弹窗，弹窗会出现在界面与LyGuide中间（LyGuide优先级比弹窗高级），导致有问题
		 * 解决方法：（两个方案看来LyGuide的优先级是一定要改成默认的了）
		 * 1、解除LyGuide的优先级，改成默认，其始终覆盖在被指引层上。（现在使用）
		 * 2、解除LyGuide的优先级，改成默认，然后当triggerGuide触发时，检查有LyGuide，且最上层不是LyGuide，则删除这个被遮盖的LyGuide，且设置guideData = false，继续执行进入后续代码。
		 * 不能根据guideData判断是否有LyGuide，LyGuideDialogues也会更改guideData，如果正在进行的不是LyGuide而是LyGuideDialogues，走第2方案也是没问题的，毕竟检查没有LyGuide，然后依然是guideData = true，就不会继续进入后续代码。
		 */
		/*
		if (!GuideManager.guideData && GameServer.getInstance().isGameEnter()) {
			let viewLayer = ViewDispatcher.getViewTop();
			if (viewLayer) {
				let viewCtor = viewLayer.getViewCtor();
				let guides = GameServerData.getInstance().getGuides();
				for (let i = 0; i < guides.length; i++) {
					let guide = guides[i];
					if (guide.guideType == VarVal.GUIDE_TYPE.CHALLENGE_STAGE) {
						if (viewCtor == LyMainPage) {
							GuideManager.guideData = guide;
							break;
						}
					}
				}
			}
		}
		*/
		GuideManager.doGuideStep(phaseInfo);
	}

	/**
     * 完成所有的系统开启引导（测试协议）。
     */
    public static testfinishAllGuide(callback:Function):void {
		GuideManager.clear();
		
		let doneCount = 0;
		let datas = GameServerData.getInstance().getActivationSysAll();
		for (let i = 0; i < datas.length; i++) {
			let data = datas[i];
			if (data.finish == 0) {
				doneCount++;
				UtilsUI.lockWait();
				GameServer.getInstance().send((args:any) => {
					UtilsUI.unlockWait();
					if (args.errorcode == 0) {
						doneCount--;
						if (doneCount == 0) {
							callback();
						}
					} else {
						UtilsUI.showMsgTip(args.errorcode);
					}
				}, "finishGuide", {
					id:data.id,
				});
			}
		}
		if (doneCount == 0) {
			callback();
		}
    }

	/**
     * 提交完成的引导。
     */
    public static finishCurrGuide(callback:Function):void {
		if (GuideManager.guideData) {
			GuideManager.doFinishGuide(callback, GuideManager.guideData);
		} else {
			GuideManager.clear();
			if (callback) {
				callback(null, true);
			}
		}
    }

	/**
     * 提交完成的引导。
     */
    private static doFinishGuide(callback:Function, guide:GuideData):void {
		if (guide.isTest || !guide.openSysId) {
			GuideManager.clear();
			if (callback) {
				callback(guide, true);
			}
		} else {
			if (GameServerData.getInstance().isActivationSysGuide(guide.openSysId)) {
				GameServerData.getInstance().setVirGuidesFinish(guide.openSysId, true); // 不让主界面捕获。
				UtilsUI.lockWait();
				GameServer.getInstance().send((args:any) => {
					UtilsUI.unlockWait();
					if (args.errorcode == 0) {
						GuideManager.clear();
						if (callback) {
							callback(guide, true);
						}
					} else {
						GameServerData.getInstance().setVirGuidesFinish(guide.openSysId, false); // 还原让下一次继续被捕获。
						UtilsUI.showMsgTip(args.errorcode);
						if (callback) {
							callback(guide, false);
						}
					}
				}, "finishGuide", {
					id:Number(guide.openSysId),
				});
			} else {
				GuideManager.clear();
				if (callback) {
					callback(guide, true);
				}
			}
		}
    }

	/**
     * 触发当前锁定的引导。
     */
    private static doGuideStep(phaseInfo:any):void {
		if (GuideManager.guideData) {
			let viewLayer = ViewDispatcher.getViewTop();
			if (viewLayer) {
				GuideManager.doGuideMask(viewLayer, phaseInfo);
			}
		}
    }

	/**
     * 辅助函数。
     */
    private static getUIRectPosEX(comp:fgui.GComponent):Array<Vec2> {
		let posArr:Array<Vec2> = new Array<Vec2>();
		posArr.push(UtilsUI.coverUIToRootPos(comp, new Vec2(0, comp.height / 2)));
		posArr.push(UtilsUI.coverUIToRootPos(comp, new Vec2(comp.width / 2, 0)));
		posArr.push(UtilsUI.coverUIToRootPos(comp, new Vec2(comp.width, comp.height / 2)));
		posArr.push(UtilsUI.coverUIToRootPos(comp, new Vec2(comp.width / 2, comp.height)));
		return posArr;
    }

	/**
     * 引导界面。
     */
    private static doGuideStart(guideObject:fgui.GComponent, detail:string, clickCall:Function, isForce:boolean): void {
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideStart, 0, {
			guideObject:guideObject,
			detail:detail,
			clickCall:clickCall,
			isForce:isForce
		});
    }

	/**
     * 触发引导。
     */
    private static doGuideMask(viewLayer:ViewLayer, phaseInfo:any):void {
		let viewCtor = viewLayer.getViewCtor();
		let uiPanel = viewLayer.getUiPanel();
		let guideData = GuideManager.guideData;
		let isForce:boolean = guideData.isForce;
		let guideDetail:string = guideData.guideDetail;
		if (guideData.guideType == VarVal.GUIDE_TYPE.KANSHU) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.doGuideStart(uiPanel.getChild("btn_operate"), guideDetail, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.CLAN) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.doGuideStart(uiPanel.getChild("btn_clan"), guideDetail, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.MAIN_TASK) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.doGuideStart(uiPanel.getChild("group_task", fgui.GComponent).getChild("img_di"), guideDetail, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.ACTIVITY_SHOP
			|| guideData.guideType == VarVal.GUIDE_TYPE.MONTH_CARD
			|| guideData.guideType == VarVal.GUIDE_TYPE.DAILY_GIFT
			|| guideData.guideType == VarVal.GUIDE_TYPE.LEI_TOTAL) {
			// 不应该引导去坊市，而是直接弹出购买页面，或提示已售罄。
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.TREE_REBEAT) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					let child:fgui.GComponent = GuideManager.getActivityListChild(uiPanel.getChild("list_activity"), MAINPAGE_ACTIVITY.TREE_REBATE);
					if (child) {
						GuideManager.doGuideStart(child, guideDetail, null, isForce);
					}
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.EVOLUTION) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					GuideManager.doGuideStart(uiPanel.getChild("btn_evolution"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyEvolution) {
					let baseInfo = GameServerData.getInstance().getPlayerFullInfo().base
					if (baseInfo.evolveFinishTime == 0) {
						GuideManager.doGuideStart(uiPanel.getChild("btn_up", fgui.GComponent), null, null, isForce);
					}
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.CHALLENGE_STAGE) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					LyStage.isSkipPlayAni = true;
					GuideManager.doGuideStart(uiPanel.getChild("btn_adventure"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
							LyStage.isSkipPlayAni = false;
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyStage) {
					GuideManager.doGuideStart(uiPanel.getChild("group_main", fgui.GComponent).getChild("btn_battle"), null, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.MOUNT_LEVELUP) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					LyMount.isSkipPlayAni = true;
					GuideManager.doGuideStart(uiPanel.getChild("btn_mount"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
							LyMount.isSkipPlayAni = false;
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyMount) {
					GuideManager.doGuideStart(uiPanel.getChild("group_main", fgui.GComponent).getChild("btn_uplevel"), null, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.PET_LEVELUP || guideData.guideType == VarVal.GUIDE_TYPE.TASK_PET_LEVELUP) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					LyPet.isSkipPlayAni = true;
					GuideManager.doGuideStart(uiPanel.getChild("btn_pet"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
							LyPet.isSkipPlayAni = false;
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyPet) {
					GuideManager.doGuideStart(uiPanel.getChild("group_pet", fgui.GComponent).getChild("btn_leveluppet", fgui.GComponent), null, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.PET_CALL || guideData.guideType == VarVal.GUIDE_TYPE.TASK_PET_CALL) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					LyPet.isSkipPlayAni = true;
					GuideManager.doGuideStart(uiPanel.getChild("btn_pet"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
							LyPet.isSkipPlayAni = false;
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyPet) {
					GuideManager.guideStep = 100; // 先挂起，因为下一个点击在同一个界面。
					GuideManager.doGuideStart(uiPanel.getChild("group_pet", fgui.GComponent).getChild("btn_zh", fgui.GComponent), null, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						} else {
							GuideManager.guideStep = 3;
							GuideManager.doGuideStep(phaseInfo); // 手动触发。
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 3) {
				if (viewCtor == LyPet) {
					GuideManager.doGuideStart(uiPanel.getChild("group_pet", fgui.GComponent).getChild("btn_recruitpet", fgui.GComponent), null, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.VEIN_ACTIVE) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					GuideManager.doGuideStart(uiPanel.getChild("btn_gem"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyVein) {
					GuideManager.doGuideStart(uiPanel.getChild("btn_stimulate", fgui.GComponent), null, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.DUEL_CHALLENGE) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					GuideManager.doGuideStart(uiPanel.getChild("btn_challenge"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyChallengeList) {
					GuideManager.guideStep = 3;
					let child:fgui.GComponent = GuideManager.getChallengeListChild(uiPanel.getChild("list_item"), CHALLENGE_TYPES.DUEL);
					if (child) {
						LyChallengeDuel.isSkipPlayAni = true;
						GuideManager.doGuideStart(child.getChild("btn_challenge"), null, (isClickObj:boolean) => {
							if (!isClickObj) { // 如果没有点击到引导目标。
								GuideManager.doFinishGuide(null, guideData);
								LyChallengeDuel.isSkipPlayAni = false;
							}
						}, isForce);
					} else {
						GuideManager.doFinishGuide(null, guideData);
					}
				}
			} else if (GuideManager.guideStep == 3) {
				if (viewCtor == LyChallengeDuel) {
					GuideManager.doGuideStart(uiPanel.getChild("group_main", fgui.GComponent).getChild("btn_duel"), null, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.KING_MONSTER) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					GuideManager.doGuideStart(uiPanel.getChild("btn_challenge"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyChallengeList) {
					let child:fgui.GComponent = GuideManager.getChallengeListChild(uiPanel.getChild("list_item"), CHALLENGE_TYPES.KING_MONSTER);
					if (child) {
						GuideManager.doGuideStart(child.getChild("btn_challenge"), null, null, isForce);
					}
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.INVASION) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					GuideManager.doGuideStart(uiPanel.getChild("btn_challenge"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyChallengeList) {
					GuideManager.guideStep = 3;
					let child:fgui.GComponent = GuideManager.getChallengeListChild(uiPanel.getChild("list_item"), CHALLENGE_TYPES.INVASION);
					if (child) {
						LyActivityInvasion.isSkipPlayAni = true;
						GuideManager.doGuideStart(child.getChild("btn_challenge"), null, (isClickObj:boolean) => {
							if (!isClickObj) { // 如果没有点击到引导目标。
								GuideManager.doFinishGuide(null, guideData);
								LyActivityInvasion.isSkipPlayAni = false;
							}
						}, isForce);
					} else {
						GuideManager.doFinishGuide(null, guideData);
					}
				}
			} else if (GuideManager.guideStep == 3) {
				if (viewCtor == LyActivityInvasion) {
					GuideManager.doGuideStart(uiPanel.getChild("group_main", fgui.GComponent).getChild("btn_battle"), null, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.QUNYIN) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					GuideManager.doGuideStart(uiPanel.getChild("btn_challenge"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyChallengeList) {
					GuideManager.guideStep = 3;
					let child:fgui.GComponent = GuideManager.getChallengeListChild(uiPanel.getChild("list_item"), CHALLENGE_TYPES.CROSS_QUNYIN);
					if (child) {
						GuideManager.doGuideStart(child.getChild("btn_challenge"), null, (isClickObj:boolean) => {
							if (!isClickObj) { // 如果没有点击到引导目标。
								GuideManager.doFinishGuide(null, guideData);
							}
						}, isForce);
					} else {
						GuideManager.doFinishGuide(null, guideData);
					}
				}
			} else if (GuideManager.guideStep == 3) {
				if (viewCtor == LyCrossQunYin) {
					// GuideManager.doGuideStart(uiPanel.getChild("group_main", fgui.GComponent).getChild("btn_battle"), null, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.MONSTER_TOWER) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					GuideManager.doGuideStart(uiPanel.getChild("btn_challenge"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyChallengeList) {
					GuideManager.guideStep = 3;
					let child:fgui.GComponent = GuideManager.getChallengeListChild(uiPanel.getChild("list_item"), CHALLENGE_TYPES.MONSTER_TOWER);
					if (child) {
						LyActivityMonsterTower.isSkipPlayAni = true;
						GuideManager.doGuideStart(child.getChild("btn_challenge"), null, (isClickObj:boolean) => {
							if (!isClickObj) { // 如果没有点击到引导目标。
								GuideManager.doFinishGuide(null, guideData);
								LyActivityMonsterTower.isSkipPlayAni = false;
							}
						}, isForce);
					} else {
						GuideManager.doFinishGuide(null, guideData);
					}
				}
			} else if (GuideManager.guideStep == 3) {
				if (viewCtor == LyActivityMonsterTower) {
					GuideManager.doGuideStart(uiPanel.getChild("group_main", fgui.GComponent).getChild("btn_battle"), null, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.HAVEN_GET) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					GuideManager.doGuideStart(uiPanel.getChild("btn_home"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyHomeList) {
					GuideManager.guideStep = 3;
					LyHaven.isSkipPlayAni = true
					let child:fgui.GComponent = GuideManager.getHomeListChild(uiPanel.getChild("list_item"), HOME_TYPES.HAVEN);
					if (child) {
						GuideManager.doGuideStart(child.getChild("btn_challenge"), null, (isClickObj:boolean) => {
							if (!isClickObj) { // 如果没有点击到引导目标。
								GuideManager.doFinishGuide(null, guideData);
								LyHaven.isSkipPlayAni = false
							}
						}, isForce);
					}
					// 最后一步完成后，记得清除引导锁定。
					let havenResData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN).data.activityHaven.resource
					let breakguide = true
					for (let index = 0; index < havenResData.length; index++) {
						let element = havenResData[index];
						if (element.itemId != 0) {
							breakguide = false
							break
						}
					}
					if (breakguide) {
						GuideManager.doFinishGuide(null, guideData);
					}
				}
			} else if (GuideManager.guideStep == 3) {
				if (viewCtor == LyHaven) {
					GuideManager.guideStep = 4;
					let havenResData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN).data.activityHaven.resource
					let itemIndex = havenResData.length
					for (let index = 0; index < havenResData.length; index++) {
						let element = havenResData[index];
						if (element.itemId != 0) {
							if (itemIndex > index) {
								itemIndex = index + 1
							}
						}
					}
					let child:fgui.GComponent = uiPanel.getChild("main", fgui.GComponent).getChild("item" + itemIndex, fgui.GComponent)
					if (child && child.visible) {
						LyHavenResInfo.isSkipPlayAni = true
						GuideManager.doGuideStart(child.getChild("grip"), null, (isClickObj:boolean) => {
							if (!isClickObj) { // 如果没有点击到引导目标。
								GuideManager.doFinishGuide(null, guideData);
								LyHavenResInfo.isSkipPlayAni = false
							}
						}, isForce);
					}else{
						GuideManager.doFinishGuide(null, guideData);
					}
				}
			} else if (GuideManager.guideStep == 4) {
				if (viewCtor == LyHavenResInfo) {
					let child:fgui.GComponent = uiPanel.getChild("main", fgui.GComponent).getChild("btn_go")
					if (child) {
						GuideManager.doGuideStart(child, null, null, isForce);
					}
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		}else if (guideData.guideType == VarVal.GUIDE_TYPE.HAVEN_FINDOTHER || guideData.guideType == VarVal.GUIDE_TYPE.TASK_HAVEN_FINDOTHER) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					GuideManager.doGuideStart(uiPanel.getChild("btn_home"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyHomeList) {
					GuideManager.guideStep = 3;
					LyHaven.isSkipPlayAni = true
					let child:fgui.GComponent = GuideManager.getHomeListChild(uiPanel.getChild("list_item"), HOME_TYPES.HAVEN);
					if (child) {
						GuideManager.doGuideStart(child.getChild("btn_challenge"), null, (isClickObj:boolean) => {
							if (!isClickObj) { // 如果没有点击到引导目标。
								GuideManager.doFinishGuide(null, guideData);
								LyHaven.isSkipPlayAni = false
							}
						}, isForce);
					}
					// 最后一步完成后，记得清除引导锁定。
					let havenResData = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.HAVEN).data.activityHaven.resource
					let breakguide = true
					for (let index = 0; index < havenResData.length; index++) {
						let element = havenResData[index];
						if (element.itemId != 0) {
							breakguide = false
							break
						}
					}
					if (breakguide) {
						GuideManager.doFinishGuide(null, guideData);
					}
				}
			} else if (GuideManager.guideStep == 3) {
				if (viewCtor == LyHaven) {
					LyHavenFind.isSkipPlayAni = true
					GuideManager.guideStep = 4;
					let child:fgui.GComponent = uiPanel.getChild("main", fgui.GComponent).getChild("btn_find", fgui.GComponent)
					if (child) {
						LyHavenResInfo.isSkipPlayAni = true
						GuideManager.doGuideStart(child, null, (isClickObj:boolean) => {
							if (!isClickObj) { // 如果没有点击到引导目标。
								GuideManager.doFinishGuide(null, guideData);
								LyHavenResInfo.isSkipPlayAni = false
							}
						}, isForce);
					}else{
						GuideManager.doFinishGuide(null, guideData);
					}
				}
			} else if (GuideManager.guideStep == 4) {
				if (viewCtor == LyHavenFind) {
					let child:fgui.GComponent = uiPanel.getChild("main", fgui.GComponent).getChild("group_dragCom", fgui.GComponent).getChild("group_nearby", fgui.GComponent).getChild("list_allItem",fgui.GList).getChildAt(0)
					if (child) {
						GuideManager.doGuideStart(child.getChild("btn_go"), null, (isClickObj:boolean) => {
							if (!isClickObj) { // 如果没有点击到引导目标。
								GuideManager.doFinishGuide(null, guideData);
							}
						}, isForce);
					}
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		}else if (guideData.guideType == VarVal.GUIDE_TYPE.HAVEN_GETMOUSE || guideData.guideType == VarVal.GUIDE_TYPE.TASK_HAVEN_GETMOUSE) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					GuideManager.doGuideStart(uiPanel.getChild("btn_home"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyHomeList) {
					GuideManager.guideStep = 3;
					LyHaven.isSkipPlayAni = true
					let child:fgui.GComponent = GuideManager.getHomeListChild(uiPanel.getChild("list_item"), HOME_TYPES.HAVEN);
					if (child) {
						GuideManager.doGuideStart(child.getChild("btn_challenge"), null, (isClickObj:boolean) => {
							if (!isClickObj) { // 如果没有点击到引导目标。
								GuideManager.doFinishGuide(null, guideData);
								LyHaven.isSkipPlayAni = false
							}
						}, isForce);
					}
				}
			} else if (GuideManager.guideStep == 3) {
				if (viewCtor == LyHaven) {
					LyHavenManage.isSkipPlayAni = true
					GuideManager.guideStep = 4;
					let child:fgui.GComponent = uiPanel.getChild("main", fgui.GComponent).getChild("btn_manage", fgui.GComponent)
					if (child) {
						GuideManager.doGuideStart(child, null, (isClickObj:boolean) => {
							if (!isClickObj) { // 如果没有点击到引导目标。
								GuideManager.doFinishGuide(null, guideData);
								LyHavenManage.isSkipPlayAni = false
							}
						}, isForce);
					}else{
						GuideManager.doFinishGuide(null, guideData);
					}
				}
			} else if (GuideManager.guideStep == 4) {
				if (viewCtor == LyHavenManage) {
					let child:fgui.GComponent = uiPanel.getChild("mian", fgui.GComponent).getChild("btn_gy", fgui.GComponent)
					if (child) {
						GuideManager.doGuideStart(child, null, (isClickObj:boolean) => {
							if (!isClickObj) { // 如果没有点击到引导目标。
								GuideManager.doFinishGuide(null, guideData);
							}
						}, isForce);
					}
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		}else if (guideData.guideType == VarVal.GUIDE_TYPE.ELITE_CALL) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					LyEliteMonster.isSkipPlayAni = true
					GuideManager.guideStep = 2;
					GuideManager.doGuideStart(uiPanel.getChild("loader_elite"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
							LyEliteMonster.isSkipPlayAni = false
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyEliteMonster) {
					GuideManager.doGuideStart(uiPanel.getChild("group_main", fgui.GComponent).getChild("btn_darwCard", fgui.GComponent), null, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		}
		else if (guideData.guideType == VarVal.GUIDE_TYPE.ELITE_CALL) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					GuideManager.doGuideStart(uiPanel.getChild("loader_elite"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyEliteMonster) {
					GuideManager.doGuideStart(uiPanel.getChild("group_main", fgui.GComponent).getChild("btn_darwCard", fgui.GComponent), null, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.ELITE_LEVELUP || guideData.guideType == VarVal.GUIDE_TYPE.TASK_PET_LEVELUP) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.doGuideStart(uiPanel.getChild("loader_elite", fgui.GComponent), guideDetail, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.THEURG_CALL) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					LyTheurgy.isSkipPlayAni = true
					GuideManager.doGuideStart(uiPanel.getChild("btn_theurgy"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
							LyTheurgy.isSkipPlayAni = false
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyTheurgy) {
					GuideManager.doGuideStart(uiPanel.getChild("main", fgui.GComponent).getChild("btn_draw", fgui.GComponent), null, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.THEURG_LEVELUP) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.doGuideStart(uiPanel.getChild("btn_theurgy", fgui.GComponent), guideDetail, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.COMPANION) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					GuideManager.doGuideStart(uiPanel.getChild("btn_home"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyHomeList) {
					LyCompanion.isSkipPlayAni = true
					let child:fgui.GComponent = GuideManager.getHomeListChild(uiPanel.getChild("list_item"), HOME_TYPES.COMPANION);
					if (child) {
						GuideManager.doGuideStart(child.getChild("btn_challenge"), null, (isClickObj:boolean) => {
							if (!isClickObj) { // 如果没有点击到引导目标。
								GuideManager.doFinishGuide(null, guideData);
								LyCompanion.isSkipPlayAni = false
							}
						}, isForce);
					}
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		}  else if (guideData.guideType == VarVal.GUIDE_TYPE.COMPANION_EXPLORE) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					GuideManager.doGuideStart(uiPanel.getChild("btn_home"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyHomeList) {
					GuideManager.guideStep = 3
					LyCompanion.isSkipPlayAni = true
					let child:fgui.GComponent = GuideManager.getHomeListChild(uiPanel.getChild("list_item"), HOME_TYPES.COMPANION);
					if (child) {
						GuideManager.doGuideStart(child.getChild("btn_challenge"), null, (isClickObj:boolean) => {
							if (!isClickObj) { // 如果没有点击到引导目标。
								GuideManager.doFinishGuide(null, guideData);
								LyCompanion.isSkipPlayAni = false
							}
						}, isForce);
					}
				}
			} else if (GuideManager.guideStep == 3) {
				if (viewCtor == LyCompanion) {
					GuideManager.guideStep = 4
					GuideManager.doGuideStart(uiPanel.getChild("main",fgui.GComponent).getChild("btn_yl"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			}else if (GuideManager.guideStep == 4) {
				if (viewCtor == LyCompanion) {
					GuideManager.doGuideStart(uiPanel.getChild("main",fgui.GComponent).getChild("btn_addExploreStamina"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.ELITE) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					LyEliteMonster.isSkipPlayAni = true
					GuideManager.doGuideStart(uiPanel.getChild("loader_elite"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
							LyEliteMonster.isSkipPlayAni = false;
						}
					}, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.PET) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					LyPet.isSkipPlayAni = true;
					GuideManager.doGuideStart(uiPanel.getChild("btn_pet"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
							LyPet.isSkipPlayAni = false;
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyPet) {
					GuideManager.doGuideStart(uiPanel.getChild("group_pet",fgui.GComponent).getChild("btn_summonpet"), null, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.PALACE) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					GuideManager.doGuideStart(uiPanel.getChild("btn_home"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyHomeList) {
					GuideManager.guideStep = 3;
					let child:fgui.GComponent = GuideManager.getHomeListChild(uiPanel.getChild("list_item"), HOME_TYPES.PALACE);
					if (child) {
						LyPalaceMain.isSkipPlayAni = true;
						GuideManager.doGuideStart(child.getChild("btn_challenge"), null, (isClickObj:boolean) => {
							if (!isClickObj) { // 如果没有点击到引导目标。
								GuideManager.doFinishGuide(null, guideData);
								LyPalaceMain.isSkipPlayAni = false;
							}
						}, isForce);
					} else {
						GuideManager.doFinishGuide(null, guideData);
					}
				}
			} else if (GuideManager.guideStep == 3) {
				if (viewCtor == LyPalaceMain) {
					GuideManager.doGuideStart(uiPanel.getChild("btn_dianzan"), null, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.STAGE) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.doGuideStart(uiPanel.getChild("btn_stage"), guideDetail, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.TASK_WELCOME) {
			if (GuideManager.guideStep == 0) {
				if (viewCtor == LyMainPage) {
					LyAttachEquip.isGuideCanPush = true;
					GuideManager.guideStep = 1;
					if (guideDetail) {
						guideDetail = guideDetail.split("@")[0];
					}
					GuideManager.doGuideStart(uiPanel.getChild("btn_operate"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						} else {
							UtilsUI.lockMask();
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyAttachEquip) {
					UtilsUI.unlockMask();
					let btn_attach:fgui.GButton;
					if (uiPanel.getController("c1").selectedIndex == 1) { // 适配引导断开情况
						GuideManager.guideStep = 2;
						btn_attach = uiPanel.getChild("btn_attach1");
					} else {
						GuideManager.guideStep = 6;
						btn_attach = uiPanel.getChild("btn_attach");
					}
					GuideManager.doGuideStart(btn_attach, null, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 3;
					if (guideDetail) {
						guideDetail = guideDetail.split("@")[1];
					}
					GuideManager.doGuideStart(uiPanel.getChild("btn_operate"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						} else {
							UtilsUI.lockMask();
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 3) {
				if (viewCtor == LyAttachEquip) {
					UtilsUI.unlockMask();
					let btn_attach:fgui.GButton;
					if (uiPanel.getController("c1").selectedIndex == 1) { // 适配引导断开情况
						GuideManager.guideStep = 4;
						btn_attach = uiPanel.getChild("btn_attach1");
					} else {
						GuideManager.guideStep = 6;
						btn_attach = uiPanel.getChild("btn_attach");
					}
					GuideManager.doGuideStart(btn_attach, null, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 4) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 5;
					if (guideDetail) {
						guideDetail = guideDetail.split("@")[2];
					}
					GuideManager.doGuideStart(uiPanel.getChild("btn_operate"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						} else {
							UtilsUI.lockMask();
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 5) {
				if (viewCtor == LyAttachEquip) {
					UtilsUI.unlockMask();
					let btn_attach:fgui.GButton;
					if (uiPanel.getController("c1").selectedIndex == 1) { // 适配引导断开情况
						GuideManager.guideStep = 7;
						btn_attach = uiPanel.getChild("btn_attach1");
					} else {
						GuideManager.guideStep = 6;
						btn_attach = uiPanel.getChild("btn_attach");
					}
					GuideManager.doGuideStart(btn_attach, null, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 6) {
				if (viewCtor == LyAttachEquip) {
					GuideManager.guideStep = 7;
					GuideManager.doGuideStart(uiPanel.getChild("btn_breakdown"), null, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 7) {
				if (viewCtor == LyMainPage) {
					if (guideDetail) {
						guideDetail = guideDetail.split("@")[3];
					}
					GuideManager.doGuideStart(uiPanel.getChild("group_task", fgui.GComponent).getChild("img_di"), guideDetail, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
					LyAttachEquip.isGuideCanPush = false;
				}
			}
		} else if (guideData.guideType == VarVal.GUIDE_TYPE.TASK_GOLDFINGER) {
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				if (viewCtor != LyMainPage) {
					// 直接清除上层UI界面。
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
					// 删除到最后会触发。
				} else {
					// 跳转触发。
					GuideManager.doGuideStep(phaseInfo);
				}
			} else if (GuideManager.guideStep == 1) {
				if (viewCtor == LyMainPage) {
					GuideManager.guideStep = 2;
					GuideManager.doGuideStart(uiPanel.getChild("btn_finger"), guideDetail, (isClickObj:boolean) => {
						if (!isClickObj) { // 如果没有点击到引导目标。
							GuideManager.doFinishGuide(null, guideData);
						}
					}, isForce);
				}
			} else if (GuideManager.guideStep == 2) {
				if (viewCtor == LyGoldFinger) {
					GuideManager.doGuideStart(uiPanel.getChild("btn_zhibao", fgui.GButton), null, null, isForce);
					// 最后一步完成后，记得清除引导锁定。
					GuideManager.doFinishGuide(null, guideData);
				}
			}
		} else { // 仅对话！（如果没有实现的类型也会走这里，并且会自动结束）
			if (GuideManager.guideStep == 0) {
				GuideManager.guideStep = 1;
				// 直接清除上层UI界面。
				// ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_CLEARTO, LyMainPage, 0, null);
				GuideManager.doGuideStart(null, guideDetail, null, isForce);
				// 最后一步完成后，记得清除引导锁定。
				GuideManager.doFinishGuide(null, guideData);
			}
		}
    }

	/**
     * 辅助函数。
     */
    private static getActivityListChild(list_item:fgui.GList, type:MAINPAGE_ACTIVITY): fgui.GComponent {
		for (let i = 0; i < list_item.numChildren; i++) {
			let child:fgui.GComponent = list_item.getChildAt(i);
			if (child.data.type == type) {
				return child;
			}
		}
    }

	/**
     * 辅助函数。
     */
    private static getChallengeListChild(list_item:fgui.GList, type:CHALLENGE_TYPES): fgui.GComponent {
		for (let i = 0; i < list_item.numChildren; i++) {
			let child:fgui.GComponent = list_item.getChildAt(i);
			if (child.data.id == type) {
				return child;
			}
		}
    }

	/**
     * 辅助函数。
     */
    private static getHomeListChild(list_item:fgui.GList, type:HOME_TYPES): fgui.GComponent {
		for (let i = 0; i < list_item.numChildren; i++) {
			let child:fgui.GComponent = list_item.getChildAt(i);
			if (child.data.id == type) {
				return child;
			}
		}
    }
}