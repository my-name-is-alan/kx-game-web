//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { VarVal } from "../Values/VarVal";
import { LyEvolution } from "../Views/LyEvolution";
import { LyMainPage } from "../Views/LyMainPage";
import { LyPayFirstGift } from "../Views/LyPayFirstGift";
import { LyPayGiftDaily } from "../Views/LyPayGiftDaily";
import { LyPayGiftDailyChoose } from "../Views/LyPayGiftDailyChoose";
import { LyPayMonthCard } from "../Views/LyPayMonthCard";
import { LyPayRecharge } from "../Views/LyPayRecharge";
import { GameServer } from "./GameServer";
import { LocaleData } from "./LocaleData";
import { LocaleUser } from "./LocaleUser";
import { PlatformAPI, ServerItem } from "./PlatformAPI";
import { MonthCardItemType, MonthCardType, UtilsUI } from "./UtilsUI";
import { ViewDispatcher } from "./ViewDispatcher";
import { LyFairyGift } from "../Views/LyFairyGift";
import { LyPayGiftGroup } from "../Views/LyPayGiftGroup";
import { LyActivityShop } from "../Views/LyActivityShop";
import { LySetting } from "../Views/LySetting";
import { AudioManager } from "./AudioManager";
import { LyTheurgy } from "../Views/LyTheurgy";
import { UtilsTool } from "./UtilsTool";
import { CHAT_CHANNELTYPE, LyChatRoom } from "../Views/LyChatRoom";
import { LyActivityReincarnationHall } from "../Views/LyActivityReincarnationHall";
import { LyClan } from "../Views/LyClan";
import { LyTheurgyDraw } from "../Views/LyTheurgyDraw";
import { PointRedData, PointRedType } from "./PointRedData";
import { LyEliteDraw } from "../Views/LyEliteDraw";
import { LyEliteDrawReward } from "../Views/LyEliteDrawReward";
import { LyMount } from "../Views/LyMount";
import { LyPalaceMain } from "../Views/LyPalaceMain";
import { FmPalaceBuffHit } from "../Views/FmPalaceBuffHit";
import { LyCrossQunYin } from "../Views/LyCrossQunYin";
import { LyPayAllEntry } from "../Views/LyPayAllEntry";
import { LyFriendInvite } from "../Views/LyFriendInvite";
import { LyPaySevenGiftGroup } from "../Views/LyPaySevenGiftGroup";
import { LyBrumeIsle } from "../Views/LyBrumeIsle";
import { LyBrumeIsleLand } from "../Views/LyBrumeIsleLand";
import { LyBrumeIsleDown } from "../Views/LyBrumeIsleDown";
import { ConquestState, LyConquestSeek } from "../Views/LyConquestSeek";
import { LyConquestSeekStart } from "../Views/LyConquestSeekStart";
import { LyPayExquisite, PayExquisitePage } from "../Views/LyPayExquisite";
import { GrabCityState, LyGrabCity } from "../Views/LyGrabCity";
import { LyGrabCityTower } from "../Views/LyGrabCityTower";
import { LyGrabCityZone } from "../Views/LyGrabCityZone";
import { LyGrabCityBattle } from "../Views/LyGrabCityBattle";
import { LyConquestSeekMain } from "../Views/LyConquestSeekMain";

export function remainingItemCount(currentCount: number, removedCount: number): number {
	return Math.max(0, currentCount - removedCount);
}

export class GameServerData {
	private static instance: GameServerData;
	public static getInstance(): GameServerData {
		if (!GameServerData.instance) {
			GameServerData.instance = new GameServerData();
		}
		return GameServerData.instance
	}
	public static destroyInstance() {
		if (GameServerData.instance) {
			GameServerData.instance.clear();
			GameServerData.instance = null;
		}
	}

	// 以下是自动变量
	private viewStack: Array<any>;
	private regRequests: any;
	private constructor() {
		this.regRequests = {};
	}
	private clear(): void {}

	private fullInfo: any;
	private serverTime: number;
	private clientTime: number;
	private lastCombatPower: string;
	// private globalInsts: Array<any>;

	/**
     * 上报数据接口。
     * */
	public submitSdkInfo(envType: string): void {
		let loginParams:any = GameServer.getLoginParams();
		let serverItem:ServerItem = loginParams.serverItem;
		let submitInfo: any = {
			envType: envType,
			serverId: serverItem.serverId,
			serverName: serverItem.name,
			roleId: String(this.fullInfo.base.guid),
			roleSex: String(this.fullInfo.base.sex),
			roleName: this.fullInfo.base.name,
			roleLevel: String(this.fullInfo.base.level),
			roleVipLevel: String(this.fullInfo.base.vipLevel),
			roleCTime: String(this.fullInfo.base.createTime),
			isWelcome: String(this.fullInfo.base.welcome),
			fightPower:String(this.fullInfo.base.combatPower),
			currStone: String(this.fullInfo.base.stone),
			factionName: "",
		}
		PlatformAPI.doSdkSubmit((data: any) => {
			if (data.errmsg) {
				UtilsUI.showMsgTip(data.errmsg);
			}
		}, submitInfo);
	}

	/**
     * 上报崩溃错误。
     * */
	public getExceptionUserInfo():any {
		let info:any = {};
		let loginParams:any = GameServer.getLoginParams();
		if (loginParams) {
			let serverItem:ServerItem = loginParams.serverItem;
			info.serverId = serverItem.serverId;
		}
		if (this.fullInfo) {
			info.guid = this.fullInfo.base.guid;
			info.name = this.fullInfo.base.name;
		}
		return info;
	}

	/**
     * 没有不用管。
     * */
	public env_logout(args: any): void {}

	/**
     * 账号在别处登录，或者被踢下线。
     * */
	 public env_replaceuser(args: any): void {
		GameServer.getInstance().kickClose();
	}

	/**
     * 数据维护之后，服务器事件触发接口（非特殊情况，不能使用）。
     * */
	public onInvokeRequest(name: string, args: any): void {
		let callbacks: Array<Function> = this.regRequests[name];
		if (callbacks && callbacks.length > 0) {
			for (let i = 0; i < callbacks.length; i++) {
				callbacks[i](args);
			}
		}
	}
	/**
     * 注册服务器事件监听（非特殊情况，不能使用）。
     * */
	public registerRequest(callf: Function, name: string): boolean {
		let callbacks: Array<Function> = this.regRequests[name];
		if (!callbacks) {
			this.regRequests[name] = callbacks = new Array<Function>();
		} else {
			// 避免同一类事件重复注册，一个函数只能注册一次。
			for (let i = 0; i < callbacks.length; i++) {
				if (callbacks[i] === callf) {
					return false;
				}
			}
		}
		callbacks.push(callf);
		return true;
	}
	/**
     * 注销服务器事件监听（非特殊情况，不能使用）。
     * */
	public unregisterRequest(callf: Function, name: string): void {
		let callbacks: Array<Function> = this.regRequests[name];
		if (callbacks) {
			for (let i = 0; i < callbacks.length; i++) {
				if (callbacks[i] === callf) {
					callbacks.splice(i, 1);
					break;
				}
			}
			if (callbacks.length == 0) {
				delete this.regRequests[name];
			}
		}
	}

	/**
     * 压入界面信息。
     * */
	public pushViewStack(viewName: string, params: any): void {
		if (!this.viewStack) {
			this.viewStack = new Array<any>();
		}
		this.viewStack.push({viewName:viewName, params:params});
	}
	/**
     * 弹出界面信息。
     * */
	public popViewStack(): any {
		if (!this.viewStack) {
			this.viewStack = new Array<any>();
		}
		return this.viewStack.pop();
	}
	/**
     * 清空界面信息。
     * */
	public clearViewStack(): void {
		this.viewStack = null;
	}

	// ##################################################以下是公共维护接口区域##################################################

	/**
     * 插入全局实例。
     * */
	private insertGlobalInst(inst: any): void {
		// this.globalInsts.push(inst);
	}
	/**
     * 移除全局实例。
     * */
	private removeGlobalInst(id: string): void {
		/*
		let globalInsts: Array<any> = this.globalInsts;
		for (let i = 0; i < globalInsts.length; i++) {
			if (globalInsts[i].id == id) {
				globalInsts.splice(i, 1);
				break;
			}
		}
		*/
	}
	/**
     * 插入物品实例。
     * */
	private insertItemInst(itemInst: any): void {
		this.fullInfo.items.push(itemInst)
	}

	/**
     * 插入灵兽实例。
     * */
	 private insertPetInst(petInst: any): void {
		this.fullInfo.petModuleInfo.pet.push(petInst)
	}
	/**
     * 插入精怪实例。
     * */
	private insertElitemonster(itemInst: any): void {
		this.fullInfo.elitemonsterInfo.elitemonster.push(itemInst)
	}

	/**
     * 插入精怪碎片物品实例。
     * */
	private insertElitemonsterDebris(itemInst: any): void {
		this.fullInfo.elitemonsterInfo.elitemonsterDebris.push(itemInst)
	}

	// /**
    //  * 插入神通碎片物品实例。
    //  * */
	private insertTheurgyFrag(itemInst: any): void {
		this.fullInfo.theurgyInfo.theurgyFrag.push(itemInst)
	}
	/**
     * 插入神通印记物品实例。
     * */
	private insertTheurgySeal(itemInst: any): void {
		this.fullInfo.theurgyInfo.theurgySeal.push(itemInst)
	}
	/**
     * 移除物品实例。
     * */
	private removeItemInst(id: string): void {
		for (let index = 0; index < this.fullInfo.items.length; index++) {
			let item = this.fullInfo.items[index]
			if (item.id == id) {
				this.fullInfo.items.splice(index, 1)
				break
			}
		}
	}
	/**
     * 移除灵兽实例。
     * */
	private removePetInst(id: string): void {
		for (let i = 0; i < this.fullInfo.petModuleInfo.pet.length; i++) {
			if (this.fullInfo.petModuleInfo.pet[i].id == id) {
				this.fullInfo.petModuleInfo.pet.splice(i, 1);
				break;
			}
		}
	}
	
	/**
     * 移除精怪卡片实例。
     * */
	private removeElitemonsterDebrisInst(id: string): void {
		for (let index = 0; index < this.fullInfo.elitemonsterInfo.elitemonsterDebris.length; index++) {
			let item = this.fullInfo.elitemonsterInfo.elitemonsterDebris[index]
			if (item.id == id) {
				this.fullInfo.elitemonsterInfo.elitemonsterDebris.splice(index, 1)
				break
			}
		}
	}

	/**
     * 移除精怪卡片实例。
     * */
	private removeElitemonsterInst(id: string): void {
		for (let index = 0; index < this.fullInfo.elitemonsterInfo.elitemonster.length; index++) {
			let item = this.fullInfo.elitemonsterInfo.elitemonster[index]
			if (item.id == id) {
				this.fullInfo.elitemonsterInfo.elitemonster.splice(index, 1)
				break
			}
		}
	}

	/**
     * 移除印记。
     * */
	private removeTheurgySeal(id: string): void {
		for (let index = 0; index < this.fullInfo.theurgyInfo.theurgySeal.length; index++) {
			let item = this.fullInfo.theurgyInfo.theurgySeal[index]
			if (item.id == id) {
				this.fullInfo.theurgyInfo.theurgySeal.splice(index, 1)
				break
			}
		}
	}
	/**
     * 移除神通碎片。
     * */
	private removeTheurgyFrag(id: string): void {
		for (let index = 0; index < this.fullInfo.theurgyInfo.theurgyFrag.length; index++) {
			let item = this.fullInfo.theurgyInfo.theurgyFrag[index]
			if (item.id == id) {
				this.fullInfo.theurgyInfo.theurgyFrag.splice(index, 1)
				break
			}
		}
	}
	
	/**
     * 填充原型。
     * */
	private fillProtoItem(itemInst: any): void {
		itemInst.proto = LocaleData.getItemProto(itemInst.protoId);
		itemInst.INST_TYPE = VarVal.INST_TYPE.ITEM;
		this.insertGlobalInst(itemInst);
	}
	private fillProtoPet(petInst: any): void {
		petInst.proto = LocaleData.getPetProto(petInst.protoId);
		petInst.INST_TYPE = VarVal.INST_TYPE.PET;
		this.insertGlobalInst(petInst);
	}
	private fillProtoEquip(equipInst: any): void {
		equipInst.proto = LocaleData.getEquipProto(equipInst.protoId);
		equipInst.INST_TYPE = VarVal.INST_TYPE.EQUIP;
		this.insertGlobalInst(equipInst);
	}
	private fillProtoElitemonster(elitemonsterInst: any): void {
		elitemonsterInst.proto = LocaleData.getEliteMonsterProto(elitemonsterInst.protoId);
		elitemonsterInst.INST_TYPE = VarVal.INST_TYPE.ELITEMONSTER;
	}
	private fillProtoElitemonsterDebris(elitemonsterDebrisInst: any): void {
		elitemonsterDebrisInst.proto = LocaleData.getEliteMonsterDebProto(elitemonsterDebrisInst.protoId);
		elitemonsterDebrisInst.INST_TYPE = VarVal.INST_TYPE.ELITMONSTERDEBRIS;
	}
	private fillProtoTheurgyFrag(theurgyFragInst: any): void {
		theurgyFragInst.proto = LocaleData.getTheurgyById(theurgyFragInst.protoId);
		theurgyFragInst.INST_TYPE = VarVal.INST_TYPE.THEURGYFRAG;
	}
	private fillProtoTheurgySeal(theurgySealInst: any): void {
		theurgySealInst.proto = LocaleData.getTheurgSealByItemId(theurgySealInst.protoId);
		theurgySealInst.INST_TYPE = VarVal.INST_TYPE.THEURGYSEAL;
	}
	public fillProtoGuide(guide: any): void {
		guide.guideItem = LocaleData.getGuideItem(guide.id);
		guide.params = {};
		let params:string = guide.guideItem.params;
		let strs:Array<string> = params.split("@");
		for (let i = 0; i < strs.length; i++) {
			let t = strs[i].split("&");
			guide.params[t[0]] = t[1];
		}
	}
	/**
     * 插入实例结构数组。
     * */
	private insertItems(itemInserts: Array<any>): void {
		if (itemInserts) {
			// 判断subType
			let subType:string = "";

			// 是否存在枸杞
			let item_gouqi = 0;
			// 是否存在江湖令
			let item_jianghuling = 0;
			// 是否存在珊瑚
			let item_shanhu = 0;
			// 是否存在陨星砂
			let item_yunxingsha = 0;
			// 是否存在激发灵脉
			let item_jifalingmai = 0;
			// 是否存在灵脉悟性
			let item_lingmaiwuxing = 0;
			// 是否存在神通抽卡券
			let item_shentongchouka = 0;
			// 是否存在精怪抽卡券
			let item_jingguaichouka = 0;
			// 是否存在朝露
			let item_chaolu = 0;
			// 是否存在群英
			let item_qunyin = 0;
			// 是否存在寻宝罗盘
			let item_goldpump = 0;
			// 是否存在武魂砂
			let item_goldupgrade = 0;

			for (let i = 0; i < itemInserts.length; i++) {
				let insert: any = itemInserts[i];
				if (insert.create == 1) {
					if (insert.itemInst.item) {
						let itemInst: any = insert.itemInst.item;
						this.fillProtoItem(itemInst);
						this.insertItemInst(itemInst);
						// 记录
						subType = itemInst.proto.subType;
						if (insert.itemInst.item.protoId == VarVal.itemProtoId.gouqi) {
							item_gouqi += insert.itemInst.item.count;
						} else if (insert.itemInst.item.protoId == VarVal.itemProtoId.jianghuling) {
							item_jianghuling += insert.itemInst.item.count;
						} else if (insert.itemInst.item.protoId == VarVal.itemProtoId.shanhu) {
							item_shanhu += insert.itemInst.item.count;
						} else if (insert.itemInst.item.protoId == VarVal.itemProtoId.yunxingsha) {
							item_yunxingsha += insert.itemInst.item.count;
						} else if (insert.itemInst.item.protoId == VarVal.itemProtoId.jifalingmai) {
							item_jifalingmai += insert.itemInst.item.count;
						} else if (insert.itemInst.item.protoId == VarVal.itemProtoId.lingmaiwuxing) {
							item_lingmaiwuxing += insert.itemInst.item.count;
						} else if (insert.itemInst.item.protoId == VarVal.itemProtoId.shentongchouka) {
							item_shentongchouka += insert.itemInst.item.count;
						} else if (insert.itemInst.item.protoId == VarVal.itemProtoId.jinggaichouka) {
							item_jingguaichouka += insert.itemInst.item.count;
						} else if (insert.itemInst.item.protoId == VarVal.itemProtoId.chaolu) {
							item_chaolu += insert.itemInst.item.count;
						} else if (insert.itemInst.item.protoId == VarVal.itemProtoId.qunyin) {
							item_qunyin += insert.itemInst.item.count;
						} else if (insert.itemInst.item.protoId == VarVal.itemProtoId.goldpump) {
							item_goldpump += insert.itemInst.item.count;
						} else if (insert.itemInst.item.protoId == VarVal.itemProtoId.goldupgrade) {
							item_goldupgrade += insert.itemInst.item.count;
						}
					} else if (insert.itemInst.pet) {
						let petInst: any = insert.itemInst.pet;
						this.fillProtoPet(petInst);
						this.insertPetInst(petInst);
					} else if(insert.itemInst.elitemonster){
						let itemInst: any = insert.itemInst.elitemonster;
						this.fillProtoElitemonster(insert)
						this.insertElitemonster(itemInst)
					} else if(insert.itemInst.elitemonsterdebris){
						let itemInst: any = insert.itemInst.elitemonsterdebris;
						this.fillProtoElitemonsterDebris(itemInst)
						this.insertElitemonsterDebris(itemInst)
					} else if(insert.itemInst.theurgyFrag){
						let itemInst: any = insert.itemInst.theurgyFrag;
						this.fillProtoTheurgyFrag(itemInst)
						this.insertTheurgyFrag(itemInst)
					} else if(insert.itemInst.theurgySeal){
						let itemInst: any = insert.itemInst.theurgySeal;
						this.fillProtoTheurgySeal(itemInst)
						this.insertTheurgySeal(itemInst)
					}
					// 如果在这里添加新类型，请在GameServerData.bonusesResultsToString里也要进行修改！
				}
				else {
					let inst: any = this.getGlobalInst(insert.itemid);
					if (inst) {
						inst.count += insert.addCount;

						// 记录
						subType = inst.proto.subType;
						if (inst.protoId == VarVal.itemProtoId.gouqi) {
							item_gouqi += insert.addCount;
						} else if (inst.protoId == VarVal.itemProtoId.jianghuling) {
							item_jianghuling += insert.addCount;
						} else if (inst.protoId == VarVal.itemProtoId.shanhu) {
							item_shanhu += insert.addCount;
						} else if (inst.protoId == VarVal.itemProtoId.yunxingsha) {
							item_yunxingsha += insert.addCount;
						} else if (inst.protoId == VarVal.itemProtoId.jifalingmai) {
							item_jifalingmai += insert.addCount;
						} else if (inst.protoId == VarVal.itemProtoId.lingmaiwuxing) {
							item_lingmaiwuxing += insert.addCount;
						} else if (inst.protoId == VarVal.itemProtoId.shentongchouka) {
							item_shentongchouka += insert.addCount;
						} else if (inst.protoId == VarVal.itemProtoId.jinggaichouka) {
							item_jingguaichouka += insert.addCount;
						} else if (inst.protoId == VarVal.itemProtoId.chaolu) {
							item_chaolu += insert.addCount;
						} else if (inst.protoId == VarVal.itemProtoId.qunyin) {
							item_qunyin += insert.addCount;
						} else if (inst.protoId == VarVal.itemProtoId.goldpump) {
							item_goldpump += insert.addCount;
						} else if (inst.protoId == VarVal.itemProtoId.goldupgrade) {
							item_goldupgrade += insert.addCount;
						}
					} else {
						console.error("itemInsert id not found -> " + String(insert.itemid));
					}
				}
			}
			
			if (item_gouqi > 0) {
				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {isPlayerAttrChanged:true});
			}
			if (item_jianghuling > 0) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyChallengeDuelMatch);
				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyCrossQunYin, 0, {});
			}
			if (item_shanhu > 0 || item_yunxingsha > 0) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyMountLevelUp);
				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMount, 0, {itemCount: true});
			}
			if (subType == VarVal.itemtype.mount) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyMountSkin);
			}
			if (subType == VarVal.itemtype.character) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyCharacter);
			}
			if (item_jifalingmai > 0 || item_lingmaiwuxing  > 0) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyVein)
			}
			if (item_shentongchouka > 0) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyTheurgyDrawTenbtn)
			}
			if (item_jingguaichouka > 0) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyEliteDraw)
			}
			if (item_chaolu > 0) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyPetLevel)
			}
			if (item_qunyin > 0) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyCrossQunYin)
			}
			if (item_goldpump > 0) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyGoldFingerPump);
			}
			if (item_goldupgrade > 0) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyGoldFingerUpgrade);
			}
		}
	}

	private insertbonusesResult(bonusesResult: any): void {
		if (bonusesResult && bonusesResult.inserts) {
			this.insertItems(bonusesResult.inserts);
		}
	}

	private insertBonusesResults(bonusesResults: Array<any>): void {
		if (bonusesResults) {
			for (let i = 0; i < bonusesResults.length; i++) {
				this.insertbonusesResult(bonusesResults[i]);
			}
		}
	}

	private addToBonusesArray(bonus_arr: Array<{bonusType:string; protoId:string|number; count:number;}>, bonus:{bonusType:string; protoId:string|number; count:number;}, isSkipMerge:boolean): void {
		if (bonus_arr && bonus) {
			if (isSkipMerge) {
				bonus_arr.push(bonus);
			} else {
				let is_insert:boolean = false;
				for (let i = 0; i < bonus_arr.length; i++) {
					let temp = bonus_arr[i];
					if (temp.bonusType == bonus.bonusType && temp.protoId == bonus.protoId) {
						temp.count = temp.count + bonus.count;
						is_insert = true;
						break
					}
				}
				if (!is_insert) {
					bonus_arr.push(bonus);
				}
			}
		}
	}

	/**
     * bonusesResult转换为字符串奖励结构，提供给奖励界面显示用。
     * */
	public bonusesResultsToString(bonusesResults: Array<any>, isSkipMerge?:boolean): string {
		let bonus_arr: Array<{bonusType:string; protoId:string|number; count:number;}> = new Array();
		if (bonusesResults && bonusesResults.length > 0) {
			for (let i = 0; i < bonusesResults.length; i++) {
				let bonusesResult = bonusesResults[i];
				if (bonusesResult) {
					if (bonusesResult.inserts) {
						for (let i = 0; i < bonusesResult.inserts.length; i++) {
							let insert = bonusesResult.inserts[i];
							let protoId:number;
							let count:number;
							if (insert.itemInst) {
								if (insert.itemInst.item) {
									protoId = insert.itemInst.item.protoId;
								} else if (insert.itemInst.equip) {
									protoId = insert.itemInst.equip.protoId;
								} else if(insert.itemInst.elitemonster){
									protoId = insert.itemInst.elitemonster.protoId;
								} else if(insert.itemInst.elitemonsterdebris){
									protoId = insert.itemInst.elitemonsterdebris.protoId;
								} else if(insert.itemInst.theurgyFrag){
									protoId = insert.itemInst.theurgyFrag.protoId;
								} else if(insert.itemInst.theurgySeal){
									protoId = insert.itemInst.theurgySeal.protoId;
								} else if(insert.itemInst.pet){
									protoId = insert.itemInst.pet.protoId;
								}
								count = insert.addCount ? insert.addCount : 1;
							} else {
								let inst: any = this.getGlobalInst(insert.itemid);
								if (inst) {
									protoId = inst.protoId;
									count = insert.addCount;
								} else {
									console.error("itemInsert id not found -> " + String(insert.itemid));
								}
							}
							this.addToBonusesArray(bonus_arr, {bonusType:VarVal.bonusType.item, protoId:protoId, count:count}, isSkipMerge);
						}
					}
					for (let key in VarVal.bonusType) {
						if (bonusesResult[key]) {
							this.addToBonusesArray(bonus_arr, {bonusType:VarVal.bonusType[key], protoId:null, count:bonusesResult[key]}, isSkipMerge);
						}
					}
				}
			}
		}

		let attaches: string = "";
		if (bonus_arr.length > 0) {
			for (let i = 0; i < bonus_arr.length; i++) {
				let bonus = bonus_arr[i];
				// attaches = (attaches == "") ? "" : (attaches + ";")
				if (bonus.bonusType == VarVal.bonusType.item) {
					attaches = attaches + `;${bonus.bonusType},${bonus.protoId},${bonus.count}`;
				} else {
					attaches = attaches + `;${bonus.bonusType},${bonus.count}`;
				}
			}
			attaches = attaches.slice(1);
		}
		return attaches;
	}
	/**
     * 移除奖励结构。
     * */
	private removeCostResult(costResult: any): void {
		if (costResult) {
			this.removeItems(costResult.itemRemoves);
		}
		// 数值型数据不需要维护，同时会有事件通知（事件里面维护）。
	}
	/**
     * 移除实例结构数组。
     * */
	private removeItems(itemRemoves: Array<any>): void {
		if (itemRemoves) {
			// 判断subType
			let subType:string = "";
			// 是否存在枸杞
			let item_gouqi = 0;
			// 是否存在江湖令
			let item_jianghuling = 0;
			// 是否存在珊瑚
			let item_shanhu = 0;
			// 是否存在陨星砂
			let item_yunxingsha = 0;
			// 是否存在朝露
			let item_chaolu = 0;
			// 是否存在群英
			let item_qunyin = 0;
			// 是否存在寻宝罗盘
			let item_goldpump = 0;
			// 是否存在武魂砂
			let item_goldupgrade = 0;

			for (let i = 0; i < itemRemoves.length; i++) {
				let itemRemove: any = itemRemoves[i];
				let inst: any = this.getGlobalInst(itemRemove.itemid);
				if (inst) {
					if (inst.INST_TYPE == VarVal.INST_TYPE.ITEM) {
						if (itemRemove.destory == 1) {
							this.removeItemInst(inst.id);
							this.removeGlobalInst(inst.id);
						} else {
							inst.count = remainingItemCount(inst.count, itemRemove.count);
						}

						// 记录
						subType = inst.proto.subType;
						if (inst.protoId  == VarVal.itemProtoId.gouqi) {
							item_gouqi -= itemRemove.count;
						} else if (inst.protoId == VarVal.itemProtoId.jianghuling) {
							item_jianghuling -= itemRemove.count;
						} else if (inst.protoId == VarVal.itemProtoId.shanhu) {
							item_shanhu -= itemRemove.count;
						} else if (inst.protoId == VarVal.itemProtoId.yunxingsha) {
							item_yunxingsha -= itemRemove.count;
						} else if (inst.protoId == VarVal.itemProtoId.chaolu) {
							item_chaolu -= itemRemove.count;
						} else if (inst.protoId == VarVal.itemProtoId.qunyin) {
							item_qunyin -= itemRemove.count;
						} else if (inst.protoId == VarVal.itemProtoId.goldpump) {
							item_goldpump -= itemRemove.count;
						} else if (inst.protoId == VarVal.itemProtoId.goldupgrade) {
							item_goldupgrade -= itemRemove.count;
						}
					} else if (inst.INST_TYPE == VarVal.INST_TYPE.PET) {
						this.removePetInst(inst.id);
						this.removeGlobalInst(inst.id);
					} else if (inst.INST_TYPE == VarVal.INST_TYPE.ELITMONSTERDEBRIS) {
						if (itemRemove.destory == 1) {
							this.removeElitemonsterDebrisInst(inst.id)
							this.removeGlobalInst(inst.id);
						} else {
							inst.count = remainingItemCount(inst.count, itemRemove.count);
						}
					} else if (inst.INST_TYPE == VarVal.INST_TYPE.ELITEMONSTER) {
						if (itemRemove.destory == 1) {
							this.removeElitemonsterInst(inst.id)
							this.removeGlobalInst(inst.id);
						} else {
							inst.count = remainingItemCount(inst.count, itemRemove.count);
						}
					} else if (inst.INST_TYPE == VarVal.INST_TYPE.THEURGYSEAL) {
						if (itemRemove.destory == 1) {
							this.removeTheurgySeal(inst.id)
							this.removeGlobalInst(inst.id);
						} else {
							inst.count = remainingItemCount(inst.count, itemRemove.count);
							inst.placeCount -= itemRemove.count
							if (inst.placeCount == 0) {
								inst.placeCount = null
							}
						}
					} else if (inst.INST_TYPE == VarVal.INST_TYPE.THEURGYFRAG) {
						if (itemRemove.destory == 1) {
							this.removeTheurgyFrag(inst.id)
							this.removeGlobalInst(inst.id);
						} else {
							inst.count = remainingItemCount(inst.count, itemRemove.count);
						}
					} else {
						console.log("API[removeItems] global inst type not used! type = " + inst.INST_TYPE);
					}
				}
				else {
					console.log("API[removeItems] global inst not found! itemid = " + itemRemove.itemid);
				}
			}
			if (item_gouqi < 0) {
				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {isPlayerAttrChanged:true});
			}
			if (item_jianghuling < 0) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyChallengeDuelMatch);
			}
			if (item_chaolu < 0 ) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyPetLevel)
			}	
			if (item_qunyin < 0) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyCrossQunYin)
			}
			if (item_goldpump < 0) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyGoldFingerPump);
			}
			if (item_goldupgrade < 0) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyGoldFingerUpgrade);
			}
			if (item_shanhu < 0 || item_yunxingsha < 0) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyMountLevelUp);
			}
			if (subType == VarVal.itemtype.mount) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyMountSkin);
			}
			if (subType == VarVal.itemtype.character) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyCharacter);
			}
		}
	}
	public getClientTime(): number {
		return Date.parse(new Date().toString()) / 1000;
	}

	/**
	 * 服务器时间（秒）。
	 * */
	public getServerTime(): number {
		return this.getClientTime() - this.clientTime + this.serverTime;
	}

	/**
	 * 将数组arr转换为以每项的usekey的值为索引的键值表，key会变为string！
	 * */
	public getArrayToMap(arr:Array<any>, usekey:string):any {
		let map = {};
		for (let i = 0; i < arr.length; i++) {
			let item = arr[i];
			map[String(item[usekey])] = item;
		}
		return map;
	}
	// ##################################################以下是特定数据维护接口区域##################################################

	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$characterproto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_entergame(args: any): void {
		this.fullInfo = args.info;
		this.serverTime = args.time;
		this.clientTime = this.getClientTime();
		// this.globalInsts = new Array<any>();

		// 设置当前本地存储关联角色
		LocaleUser.setUserId(this.fullInfo.base.guid);

		// 协议缺字段时兜底，避免红点/任务逻辑读 length 崩溃
		if (!this.fullInfo.items) { this.fullInfo.items = []; }
		if (!this.fullInfo.breakTask) { this.fullInfo.breakTask = []; }
		if (!this.fullInfo.dailyTask) { this.fullInfo.dailyTask = []; }
		if (!this.fullInfo.weekTask) { this.fullInfo.weekTask = []; }
		if (!this.fullInfo.xianyuanTask) { this.fullInfo.xianyuanTask = []; }
		if (!this.fullInfo.factionTask) { this.fullInfo.factionTask = []; }
		if (!this.fullInfo.inviteTask) { this.fullInfo.inviteTask = []; }
		if (!this.fullInfo.battleEquips) { this.fullInfo.battleEquips = []; }
		if (!this.fullInfo.forgeEquips) { this.fullInfo.forgeEquips = []; }
		if (!this.fullInfo.mails) { this.fullInfo.mails = []; }
		if (!this.fullInfo.petModuleInfo) { this.fullInfo.petModuleInfo = { pet: [] }; }
		if (!this.fullInfo.petModuleInfo.pet) { this.fullInfo.petModuleInfo.pet = []; }
		if (!this.fullInfo.elitemonsterInfo) { this.fullInfo.elitemonsterInfo = { elitemonster: [], elitemonsterDebris: [] }; }
		if (!this.fullInfo.elitemonsterInfo.elitemonster) { this.fullInfo.elitemonsterInfo.elitemonster = []; }
		if (!this.fullInfo.elitemonsterInfo.elitemonsterDebris) { this.fullInfo.elitemonsterInfo.elitemonsterDebris = []; }
		if (!this.fullInfo.theurgyInfo) { this.fullInfo.theurgyInfo = { theurgySeal: [], theurgyFrag: [] }; }
		if (!this.fullInfo.theurgyInfo.theurgySeal) { this.fullInfo.theurgyInfo.theurgySeal = []; }
		if (!this.fullInfo.theurgyInfo.theurgyFrag) { this.fullInfo.theurgyInfo.theurgyFrag = []; }

		for (let key = 0; key < this.fullInfo.items.length; key++) {
			let itemInst: any = this.fullInfo.items[key];
			this.fillProtoItem(itemInst)
		}
		for (let key = 0; key < this.fullInfo.petModuleInfo.pet.length; key++) {
			let itemInst: any = this.fullInfo.petModuleInfo.pet[key];
			this.fillProtoPet(itemInst)
		}
		for (let key = 0; key < this.fullInfo.elitemonsterInfo.elitemonster.length; key++) {
			let itemInst: any = this.fullInfo.elitemonsterInfo.elitemonster[key];
			this.fillProtoElitemonster(itemInst)
		}
		for (let key = 0; key < this.fullInfo.elitemonsterInfo.elitemonsterDebris.length; key++) {
			let itemInst: any = this.fullInfo.elitemonsterInfo.elitemonsterDebris[key];
			this.fillProtoElitemonsterDebris(itemInst)
		}
		for (let key = 0; key < this.fullInfo.theurgyInfo.theurgySeal.length; key++) {
			let itemInst: any = this.fullInfo.theurgyInfo.theurgySeal[key];
			this.fillProtoTheurgySeal(itemInst)
		}
		for (let key = 0; key < this.fullInfo.theurgyInfo.theurgyFrag.length; key++) {
			let itemInst: any = this.fullInfo.theurgyInfo.theurgyFrag[key];
			this.fillProtoTheurgyFrag(itemInst)
		}
		// 邮件
		this.fullInfo.mails.sort(this.sortMail);
		
		// 活动&运营活动
		// 里面的id不需要用到，当作废弃，运营活动的id就是activityId。
		this.fullInfo.activityStates = this.getArrayToMap(this.fullInfo.activityStates, "activityId");
		// 里面的id就是activityId。
		let dynamicParams = this.getArrayToMap(this.fullInfo.dynamicActivityParams, "id");
		for (let id in dynamicParams) {
			let param = dynamicParams[id];
			if (param.data) {
				param.data = JSON.parse(param.data);
			}
		}
		this.fullInfo.dynamicActivityParams = dynamicParams;
		// 里面的id就是activityId。
		this.fullInfo.activityOpenStates = this.getArrayToMap(this.fullInfo.activityOpenStates, "id");
		// 里面的id不需要用到，当作废弃，运营活动的id就是activityId。
		this.fullInfo.activityGlobalStates = this.getArrayToMap(this.fullInfo.activityGlobalStates, "activityId");

		// 充值档次记录
		if (!this.fullInfo.payIds) {
			this.fullInfo.payIds = [];
		}
		// 每日礼包
		if (!this.fullInfo.dailyGift) {
			this.fullInfo.dailyGift = [];
		}
		// 每日自选礼包
		if (!this.fullInfo.opGift) {
			this.fullInfo.opGift = [];
		}
		// 限时礼包组
		if (!this.fullInfo.xianyouGroup) {
			this.fullInfo.xianyouGroup = [];
		}
		// 开服七天礼包
		if (!this.fullInfo.openGift) {
			this.fullInfo.openGift = [];
		}

		// 跑马灯数据
		if (!this.fullInfo.notice) {
			this.fullInfo.notice = [];
		}

		// 斗法数据
		if (!this.fullInfo.duelInfo) {
			this.fullInfo.duelInfo = {};
		}
		
		this.lastCombatPower = String(this.fullInfo.base.combatPower);
		this.submitSdkInfo("ENTER_SERVER");
		PlatformAPI.doSdkOnShareGame(null, LyFriendInvite.getWXQuery());
	}

	public on_createcharcter(args: any): void {
		this.on_entergame(args);
	}

	/*
	public on_applyServerOrder(args: any): void {
		this.insertbonusesResult(args.bonusesResult);
	}
	*/

	public on_editPersonalization(args: any, sarg: any): void {
		if (sarg.type == VarVal.Personalization.MODEL_SUIT || sarg.type == VarVal.Personalization.MODEL_ACTIVITY) {
            this.fullInfo.base.appearance = sarg.cfgId
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {UpDataSkin:true});
        } else if (sarg.type == VarVal.Personalization.HEAD_SUIT || sarg.type == VarVal.Personalization.HEAD_ACTIVITY || sarg.type == VarVal.Personalization.HEAD_ELITEMONSTER || sarg.type == VarVal.Personalization.HEAD_PET) {
            this.fullInfo.base.avatar = sarg.cfgId
        } else if (sarg.type == VarVal.Personalization.HEADK) {
            this.fullInfo.base.avatarBorder = sarg.cfgId
        } else if (sarg.type == VarVal.Personalization.BUBBLE) {
            this.fullInfo.base.chatBubble = sarg.cfgId
        } else if (sarg.type ==VarVal.Personalization. TITLE_ACTIVITY || sarg.type == VarVal.Personalization.TITLE_SPECIAL || sarg.type == VarVal.Personalization.TITLE_MEDAL) {
            this.fullInfo.base.title = sarg.cfgId
        }
	}
	public on_changeCharacter(args: any, sarg: any): void {
		this.fullInfo.base.character = sarg.character
		this.removeItems(args.itemRemoves)
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {UpDataSkin:true});
	}
	public on_rename(args: any, sarg: any): void {
		this.fullInfo.base.name = sarg.name
		this.fullInfo.base.renameNum--
		this.removeItems(args.itemRemoves)
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {updatePlayerShow:true});
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LySetting, 0, {});
	}
	public on_cdkey(args: any): void{
		this.insertbonusesResult(args.bonusesResult);
	}
	
	public on_levelUpAppearance(args: any, sarg: any): void {
		// this.fullInfo.base.character = sarg.character
		this.removeItems(args.itemRemoves)
		// for (let i = 0; i < this.fullInfo.personalization.length; i++) {
		// 	let item:any = this.fullInfo.personalization[i];
		// 	if (item.cfgId == sarg.cfgId) {
		// 		item.value = args.level
		// 		return
		// 	}
		// }
		// let data = {
		// 	type :VarVal.Personalization.MODEL_ACTIVITY,
		// 	cfgId: args.cfgId,
		// 	value: 0,
		// 	expire: 0
		// }
		// this.fullInfo.personalization.push(data)
	}
	public env_personalizationChange(args: any):void{
		if (args.change == 1) {
			for (let i = 0; i < this.fullInfo.personalization.length; i++) {
				let item:any = this.fullInfo.personalization[i];
				if (item.cfgId == args.cfgId && item.type == args.type) {
					item.value = args.value
					item.expire = args.expire
					//新增
					PointRedData.getInstance().updatePointChild(PointRedType.LyCharacter);
					return
				}
			}
			let data = {
				type :args.type,
				cfgId: args.cfgId,
				value: args.value,
				expire: args.expire,
			}
			this.fullInfo.personalization.push(data)
		}
		PointRedData.getInstance().updatePointChild(PointRedType.LyCharacter);
	}
	public on_unlockAvatarBorder(args: any, sarg: any): void {
		this.removeItems(args.itemRemoves)
		let item :any ={
			type : VarVal.Personalization.HEADK,
			cfgId : sarg.id,
			value : "1",
			expire : args.expire
		}
		this.fullInfo.personalization.push(item)
	}
	public on_unlockChatBubble(args: any, sarg: any): void {
		this.removeItems(args.itemRemoves)
		let item :any ={
			type : VarVal.Personalization.BUBBLE,
			cfgId : sarg.id,
			value : "1",
			expire : args.expire
		}
		this.fullInfo.personalization.push(item)
	}

	public on_pumpGoldFinger(args: any): void {
		this.removeItems(args.itemRemoves);
		this.insertBonusesResults(args.bonusesArr);
	}

	public on_levelUpGoldFinger(args: any): void {
		this.removeItems(args.itemRemoves);
	}

	public on_replacePetInst(args: any, sarg: any): void {
		this.removePetInst(sarg.petId);
		this.fillProtoPet(args.pet);
		this.fullInfo.petModuleInfo.pet.push(args.pet);
		/* 改为上阵后的不让换。
		if (this.fullInfo.base.summonPet == sarg.petId) { // 下阵。
			this.fullInfo.base.summonPet = "0";
			PointRedData.getInstance().updatePointChild(PointRedType.LyPetLevel);
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { upShowUi: true });
		}
		*/
	}

	public on_exchangeDebris(args: any): void {
		this.removeItems(args.itemRemoves);
		this.insertItems(args.itemInserts);
	}

	// 角色基础属性变化（货币类型）
	public env_playerAttrChanged(args: any): void {
		let val:any = this.fullInfo.base[args.key];
		if (val !== undefined) {
			if (typeof val == 'number') {
				this.fullInfo.base[args.key] = Number(args.value);
			}
			else {
				this.fullInfo.base[args.key] = args.value; // string
			}
			if (val != this.fullInfo.base[args.key]) {
				args.isNewValue = true;
			}
			if (this.fullInfo.IS_REFRESH_RECHARGE && (args.key == "chance" || args.key == "stone")) {
				this.fullInfo.IS_REFRESH_RECHARGE = false;
				AudioManager.playEFT(VarVal.AUDIO_SOURCE.EFT_PAY_RESULT);
				
				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayRecharge, 0, null);
				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayExquisite, 0, {page:PayExquisitePage.RECHARGE});
			}
			if (args.key == "chance" || args.key == "stone") {
				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyActivityShop, 0, null);
				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyActivityReincarnationHall, 0, null);
				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayExquisite, 0, {isCommonStoneChance:true});
			}
			
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {isPlayerAttrChanged:true});

			if (args.key == "money") {
				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyEvolution, 0, null);
				PointRedData.getInstance().updatePointChild(PointRedType.LyEvolutionLevelUp)
			}
		} 
	}

	public env_dailyLoginChanceGranted(args:any):void {
		this.fullInfo.base.chance = String(args.chance);
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {isPlayerAttrChanged:true});
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayRecharge, 0, null);
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayExquisite, 0, {isCommonStoneChance:true});
		UtilsUI.showMsgTip('每日登录赠送 ' + args.amount + ' 代金券');
	}

	// 附属属性变化（计算类型）
	public env_entityPlayerAttrChanged(args: any): void {
		this.fullInfo.playerEntityAttr[args.key - 1] = args.value;
	}
	// 角色所有属性变化
	public env_playerAllEntityAttrChanged(args: any): void {
		this.fullInfo.playerEntityAttr = args.attrs
	}
	// 角色战斗力变化
	public env_playerCombatPowerChanged(args:any):void{
		UtilsUI.showMsgPower(this.lastCombatPower, String(args.combatPower));

		this.fullInfo.base.combatPower = args.combatPower;
		this.lastCombatPower = String(this.fullInfo.base.combatPower);
		
		PointRedData.getInstance().updatePointChild(PointRedType.LyStageBattle);
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {updatePlayerShow : true})
	}
	public env_playerModelEntityAttrChanged(args: any): void {
		// if (args.module == "GEMS") {
		// 	this.fullInfo.veinInfo.attrs = args.attrs
		// }
	}
	// 等级改变
	public env_playerLevelChanged(args: any): void {
		this.fullInfo.base.level = args.newLevel;
		// this.fullInfo.base.physical = args.newPhysical;
		// this.insertbonusesResult(args.bonusesResult);
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {isPlayerAttrChanged:true});
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayFunds, Number(VarVal.payOtherType.fundxiuwei));
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayExquisiteFunds, Number(VarVal.payOtherType.fundxiuwei));
		GameServerData.getInstance().submitSdkInfo("LEVEL_UP");
	}

	// 领取首冲礼包奖励。
	public on_takeFirstPayBonuses(args: any): void {
		this.insertItems(args.itemInserts);
	}

	// 首充礼包变化。
	public env_firstPayChanged(args: any): void {
		/*
		// 先显示奖励。
		let firstGiftItem = LocaleData.getFirstGiftItem();
		if (firstGiftItem) {
			UtilsUI.showItemReward({bonuseItems:LocaleData.getPayChooseBonuseItemsByGroup(firstGiftItem.fixItems)});
		} else {
			args.isCreate = true;
		}
		// 再刷新数据
		this.fullInfo.firstPay = args;

		// 刷新一下首充页面。
		if (firstGiftItem) {
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayFirstGift, 0, null);
		}

		firstGiftItem = LocaleData.getFirstGiftItem();
		if (!firstGiftItem) {
			args.isRemove = true;
		}
		*/

		if (args.firstGift) {
			// 是否刚开启
			if (!this.fullInfo.firstPay) {
				args.isCreate = true;
			} else {
				if (this.fullInfo.firstPay.isLast == 0 && args.firstGift.isLast == 1) {
					args.isRemove = true;
				}
			}
			
			this.fullInfo.firstPay = args.firstGift;
		} else {
			// 是否领取每日奖励
			let takeGiftId:number;
			let items:Array<any> = this.fullInfo.firstPay.items;
			for (let i = 0; i < items.length; i++) {
				if (items[i].id == args.item.id) {
					if (items[i].state == 1 && args.item.state == 2) {
						takeGiftId = args.item.id;
					}
					items[i] = args.item;
					break;
				}
			}
			if (takeGiftId) {
				let giftItem = LocaleData.getPayGiftItem(takeGiftId);
				UtilsUI.showItemReward({bonuseItems:LocaleData.getPayChooseBonuseItemsByGroup(giftItem.fixItems)});
			}
		}

		// 返还
		let rebate = UtilsUI.getRebateBonuseItems();
		if (rebate) {
			UtilsUI.showItemReward({rebateBonuseItems:rebate});
		}

		// 刷新界面
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayFirstGift, 0, null);
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayFirstGift);
	}

	// 每日礼包变化。
	public env_dailyGiftChanged(args: any): void {
		// 先显示奖励。
		let giftItem = LocaleData.getPayGiftItem(args.id);
		UtilsUI.showItemReward({
			bonuseItems:LocaleData.getPayChooseBonuseItemsByGroup(giftItem.fixItems),
			rebateBonuseItems:UtilsUI.getRebateBonuseItems()
		});
		// 再刷新数据
		let giftData:any;
		let dailyGifts:Array<any> = this.fullInfo.dailyGift;
		for (let i = 0; i < dailyGifts.length; i++) {
			if (dailyGifts[i].id == args.id) {
				giftData = dailyGifts[i];
			}
		}
		if (giftData) {
			giftData.count = args.count;
		} else {
			dailyGifts.push(args);
		}
		// 刷新一下页面。
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayExquisite, 0, {page:PayExquisitePage.GIFT_DAILY});
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayExquisiteDailyMain);

		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayGiftDaily, 0, null);
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayGiftDaily);
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayAllEntry, 0, {scrollToIndex:true});
	}

	// 每日自选礼包变化。
	public env_opGiftChanged(args: any): void {
		// 先显示奖励。
		// let giftItem = LocaleData.getPayGiftItem(args.id);
		// UtilsUI.showItemReward({bonuseItems:LocaleData.getPayChooseBonuseItemsByGroup(giftItem.fixItems)}); // 此处缺少已选择的奖励，在界面上显示吧。
		// 再刷新数据
		let giftData:any;
		let opGifts:Array<any> = this.fullInfo.opGift;
		for (let i = 0; i < opGifts.length; i++) {
			if (opGifts[i].id == args.id) {
				giftData = opGifts[i];
				break;
			}
		}
		if (giftData) {
			let lastCount = giftData.count;
			giftData.count = args.count;
			giftData.opItems = args.opItems;

			// 奖励
			if (lastCount != giftData.count) {
				let giftItem = LocaleData.getPayGiftItem(giftData.id);
				let bonuseItems = LocaleData.getPayChooseBonuseItemsByGroup(giftItem.fixItems);
				if (giftData.opItems) {
					for (let i = 0; i < giftData.opItems.length; i++) {
						let bItems = LocaleData.getPayChooseBonuseItems(giftData.opItems[i]);
						bonuseItems.push(bItems[0]);
					}
				}
				UtilsUI.showItemReward({
					bonuseItems:bonuseItems,
					rebateBonuseItems:UtilsUI.getRebateBonuseItems()
				});
			}
		} else {
			opGifts.push(args);
		}
		// 刷新一下页面。
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayGiftDailyChoose, 0, args);
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayGiftDailyChoose);
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayAllEntry, 0, {scrollToIndex:true});
	}

	// 仙缘礼包变化。
	public env_xyGiftChanged(args: any): void {
		for (let index = 0; index < this.fullInfo.xyGift.length; index++) {
			if (this.fullInfo.xyGift[index].id == args.id) {
				this.fullInfo.xyGift[index].count = args.count
			}
		}
		let giftItem = LocaleData.getPayGiftItem(args.id);
		UtilsUI.showItemReward({
			bonuseItems:LocaleData.getPayChooseBonuseItemsByGroup(giftItem.fixItems),
			rebateBonuseItems:UtilsUI.getRebateBonuseItems()
		});
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyFairyGift, 0, args);
	}

	// 每日礼包重置。
	public env_dailyGiftReset(args: any): void {
		this.fullInfo.dailyGift = [];
		// 刷新一下页面。
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayExquisite, 0, {page:PayExquisitePage.GIFT_DAILY});
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayExquisiteDailyMain);
		
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayGiftDaily, 0, null);
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayGiftDaily);
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayAllEntry, 0, {scrollToIndex:true});
	}

	// 每日自选礼包重置。
	public env_opGiftReset(args: any): void {
		this.fullInfo.opGift = [];
		// 刷新一下页面。
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayGiftDailyChoose, 0, null);
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayGiftDailyChoose);
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayAllEntry, 0, {scrollToIndex:true});
	}

	// 仙缘礼包重置。
	public env_xyGiftReset(args: any): void {
		for (let index = 0; index < this.fullInfo.xyGift.length; index++) {
			this.fullInfo.xyGift[index].count = 0
		}
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyFairyGift, 0, args);
	}

	// 充值次数变化。
	public env_payCountChanged(args: any): void {
		this.fullInfo.stonePaycount = args.stonePaycount;
		this.fullInfo.chancePaycount = args.chancePaycount;
		this.fullInfo.module = args.module;

		this.fullInfo.IS_REFRESH_RECHARGE = true; // 在随后事件playerAttrChanged刷新页面。
	}

	// 限时礼包变化。
	public env_expiredGiftChanged(args: any): void {
		let giftGroups:Array<any> = this.fullInfo.xianyouGroup;
		for (let i = 0; i < giftGroups.length; i++) { // 旧礼包状态变化
			if (args.id == giftGroups[i].id) {
				giftGroups[i].count = giftGroups[i].count + 1;

				let giftItem = LocaleData.getPayGiftItem(args.id);
				UtilsUI.showItemReward({
					bonuseItems:LocaleData.getPayChooseBonuseItemsByGroup(giftItem.fixItems),
					rebateBonuseItems:UtilsUI.getRebateBonuseItems()
				});

				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayGiftGroup, 0, null);
				break;
			}
		}
	}

	// 限时礼包新增。
	public env_expiredGiftsAdd(args: any): void {
		let giftGroups:Array<any> = this.fullInfo.xianyouGroup;
		for (let i = 0; i < args.gifts.length; i++) { // 旧礼包状态变化
			giftGroups.push(args.gifts[i]);
		}
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayGiftGroup, 0, null);
		// 弹出礼包界面。 // 当有界面需要延迟弹出时，交给界面安排何时弹出。
		let giftId:number = args.gifts[0].id;
		let giftItem = LocaleData.getPayGiftItem(giftId);
		if (giftItem.giftGroupId == VarVal.GIFT_GROU.GIFT_GROU_BATTLERPOWER_ID) {
			// 由战斗结束后主动拉取弹窗
			LyPayGiftGroup.waitBattleGiftId = giftId;
		} else {
			if (ViewDispatcher.isViewExist(LyTheurgyDraw)) {
				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyTheurgyDraw, 0, {giftId:giftId});
			} else if(ViewDispatcher.isViewExist(LyEliteDraw)){
				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyEliteDraw, 0, {giftId:giftId});
			} else if(ViewDispatcher.isViewExist(LyEliteDrawReward)){
				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyEliteDrawReward, 0, {giftId:giftId});
			} else {
				if (!PlatformAPI.isBinaryExamine()) {
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyPayGiftGroup, 0, {giftId:giftId});
				}
			}
		}
	}

	// 限时礼包过期。
	public env_expiredGiftExipred(args: any): void {
		let giftGroups:Array<any> = this.fullInfo.xianyouGroup;
		for (let i = giftGroups.length - 1; i >= 0; i--) {
			if (giftGroups[i].id == args.id) {
				giftGroups.splice(i, 1);
				break;
			}
		}
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayGiftGroup, 0, null);
	}

	// 开服礼包变化。
	public env_openGiftChanged(args: any): void {
		let __openGift:Array<any> = this.fullInfo.openGift;
		for (let i = 0; i < __openGift.length; i++) { // 旧礼包状态变化
			if (args.id == __openGift[i].id) {
				__openGift[i].count = __openGift[i].count + 1;

				let giftItem = LocaleData.getPayGiftItem(args.id);
				UtilsUI.showItemReward({
					bonuseItems:LocaleData.getPayChooseBonuseItemsByGroup(giftItem.fixItems),
					rebateBonuseItems:UtilsUI.getRebateBonuseItems()
				});

				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPaySevenGiftGroup, 0, {giftId:args.id});
				break;
			}
		}
	}

	// 开服礼包消失
	public env_openGiftDisappeared(args: any): void {
		if (args.id) { // 凌晨清除当前组礼包的事件。
			// 后会来openGiftAdd事件，其实在那边清除就行，还保险些。
		} else { // 整个活动结束。
			// this.fullInfo.openGift = []; // 不这样处理，买完界面当前显示要保存，现在要仅入口消失。
			// 当天买完的时候，会先触发openGiftChanged事件，再触发这里。
			// 当天是最后一天晚12点时，仅触发这里。
			let __openGift:Array<any> = this.fullInfo.openGift;
			for (let i = 0; i < __openGift.length; i++) {
				let record = __openGift[i];
				let giftItem = LocaleData.getPayGiftItem(record.id);
				if (record.count < Number(giftItem.buyCount)) {
					record.count = Number(giftItem.buyCount); // 把所有都设置为售罄。
				}
			}
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPaySevenGiftGroup, 0, {isDone:true});
		}
	}

	// 返利礼包变化。
	public env_rebateGiftChanged(args: any): void {
		let __rebateGift:Array<any> = this.fullInfo.rebateGift;
		for (let i = 0; i < __rebateGift.length; i++) { // 旧礼包状态变化
			if (args.id == __rebateGift[i].id) {
				__rebateGift[i].count = args.count;

				let giftItem = LocaleData.getPayGiftItem(args.id);
				UtilsUI.showItemReward({
					bonuseItems:LocaleData.getPayChooseBonuseItemsByGroup(giftItem.fixItems),
					rebateBonuseItems:UtilsUI.getRebateBonuseItems()
				});
				PointRedData.getInstance().updatePointChild(PointRedType.LyTreeRebateGift);
				break;
			}
		}
	}

	// 出现新的开服礼包组
	public env_openGiftAdd(args: any): void {
		this.fullInfo.openGift = args.gifts;
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPaySevenGiftGroup, 0, {isNewDay:true});
		PointRedData.getInstance().updatePointChild(PointRedType.LyPaySevenGiftGroup);
	}

	// 充值卡变化。
	public env_payCardChanged(args: any): void {
		let days = this.fullInfo.monthCardDays;
		let isLife = this.isHaveLifeCard();

		this.fullInfo.monthCard = args.monthCard;
		this.fullInfo.monthCardDays = args.monthCardDays;
		this.fullInfo.monthCardTake = args.monthCardTake;
		this.fullInfo.lifeCardTake = args.lifeCardTake;
		this.fullInfo.lifeCard = args.lifeCard;
		this.fullInfo.eliteMonsterCard = args.eliteMonsterCard;
		this.fullInfo.eliteMonsterCardTake = args.eliteMonsterCardTake;
		this.fullInfo.theurgyCard = args.theurgyCard;
		this.fullInfo.theurgyCardTake = args.theurgyCardTake;
		this.fullInfo.petCard = args.petCard;
		this.fullInfo.petCardTake = args.petCardTake;
		// 刷新一下月卡页面。
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayExquisite, 0, {page:PayExquisitePage.MONTHCARD});
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayExquisiteCardsMonth);
		
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayMonthCard, 0, null);
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayMonthCard);

		// 购买奖励显示
		if (this.fullInfo.monthCardDays > days) {
			let bonuseItems = UtilsUI.getMonthCardGiveBonuseItems(MonthCardType.Month, MonthCardItemType.give_now);
        	UtilsUI.showItemReward({
				bonuseItems:bonuseItems,
				rebateBonuseItems:UtilsUI.getRebateBonuseItems()
			});
		}
		if (!isLife && this.isHaveLifeCard()) {
			let bonuseItems = UtilsUI.getMonthCardGiveBonuseItems(MonthCardType.Life, MonthCardItemType.give_now);
        	UtilsUI.showItemReward({
				bonuseItems:bonuseItems,
				rebateBonuseItems:UtilsUI.getRebateBonuseItems()
			});
		}
	}

	// 仙缘充值数据变化。
	public env_payXyEventChanged(args: any): void {
		this.fullInfo.payIds = args.payIds ? args.payIds : [];

		this.fullInfo.xyTime = args.xyTime;
		this.fullInfo.xyBuyCount = args.xyBuyCount;
		this.fullInfo.hasTakeFreeXy = args.hasTakeFreeXy;
		this.fullInfo.score = args.score;
		this.fullInfo.xyTakeMax = args.xyTakeMax;
		this.fullInfo.xyCloseTime = args.xyCloseTime;
		this.fullInfo.xyflTakes = args.xyflTakes;
		this.fullInfo.module = args.module;

		PointRedData.getInstance().updatePointChild(PointRedType.LyFairyGift);
	}

	// 仙缘福利任务。
	public env_xyTaskCreated(args: any): void {
		this.fullInfo.xianyuanTask = args.tasks
	}

	// 仙缘福利任务消失。
	public env_xyTaskDisappeared(args: any): void {
		this.fullInfo.xianyuanTask = []
	}

	public on_takeXianYuanScoreBonuses(args: any){
		//走通用事件插入维护
	}

	public on_takeXyfl(args: any){
		this.insertbonusesResult(args.bonusesResult);
	}
	public on_blockPlayer(args: any){
		this.fullInfo.blacklist = args.blacklist
	}
	
	public on_totalCharge(args: any): void{
		this.insertBonusesResults(args.bonusesResultArr);
	}

	public on_takeWeekCard(args: any): void{
		this.insertBonusesResults(args.bonusesArr);
		PointRedData.getInstance().updatePointChild(PointRedType.LyEliteCard);
	}

	public on_takeEliteMonsterCardCard(args: any): void{
		this.insertbonusesResult(args.bonusesResult);
		PointRedData.getInstance().updatePointChild(PointRedType.LyEliteCard);
	}

	public on_takeTheurgyCard(args: any): void{
		this.insertbonusesResult(args.bonusesResult);
		// PointRedData.getInstance().updatePointChild(PointRedType.LyEliteCard);
	}
	public on_takePetCard(args: any): void{
		this.insertbonusesResult(args.bonusesResult);
		// PointRedData.getInstance().updatePointChild(PointRedType.LyEliteCard);
	}
	

	public env_weekCardChanged(args: any): void{
		this.fullInfo.weekCard = args.weekCard
	}

	public on_finishGuide(args: any): void{
		let newsys = args.guideItem;
		let hitIdx = -1;
		let _sys:Array<any> = this.fullInfo.activation.sys;
		for (let i = 0; i < _sys.length; i++) {
			if (_sys[i].id == newsys.id) {
				hitIdx = i;
				break;
			}
		}
		if (hitIdx >= 0) {
			_sys[hitIdx] = newsys;
		} else {
			_sys.push(newsys);
		}
	}

	public on_takeGuideBonuses(args: any): void{
		this.on_finishGuide(args);
		this.insertbonusesResult(args.bonusesResult);
		PointRedData.getInstance().updatePointChild(PointRedType.LyDemonPath)
	}
	
	public env_activationNotify(args: any):void{
		if (args.type == "sys") {
			this.on_finishGuide({guideItem:args.sys});

			let sysId:number = args.sys.id;
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {upActivationNotify:sysId});

			if (args.sys.take != 0) {
			// 	系统开启，需要大节点刷新。其他地方的用法，哪里变化就刷新局部，不要在节点刷！
			if (sysId == VarVal.SYSYTEM_ID.adventure) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyStage);
			} else if (sysId == VarVal.SYSYTEM_ID.duel) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyChallengeDuel);
			} else if (sysId == VarVal.SYSYTEM_ID.mount) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyMount);
			} else if (sysId == VarVal.SYSYTEM_ID.king_monster) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyActivityKingMonster);
			} else if (sysId == VarVal.SYSYTEM_ID.invasion) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyActivityInvasion);
			} else if (sysId == VarVal.SYSYTEM_ID.monster_tower) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyActivityMonsterTower);
			} else if (sysId == VarVal.SYSYTEM_ID.palace) {
				UtilsUI.showEnterGameSend(VarVal.CROSS_SYS_TYPE.PALACE);
			} else if (sysId == VarVal.SYSYTEM_ID.qunyin) {
				UtilsUI.showEnterGameSend(VarVal.CROSS_SYS_TYPE.QUNYIN);
			} else if (sysId == VarVal.SYSYTEM_ID.GrabCity) {
				UtilsUI.showEnterGameSend(VarVal.CROSS_SYS_TYPE.GRABCITY);
			}
			PointRedData.getInstance().updatePointChild(PointRedType.LyDemonPath);
			// 运营活动在红点树中没限制，只有入口显示限制。
			// 比如爬塔，他的入口未开启，但可见，所以要在此刷新红点。
			// 比如运势，他的入口未开启，不开启就不可见，这里不用刷新红点，在活动更新处刷新就行。
			}
		}
	}

	public env_inviteCountChanged(args: any):void{
		this.fullInfo.inviteCount = args.count;
	}

	public env_goldFingerChanged(args: any):void{
		this.fullInfo.goldFinger = args.goldFinger;
		PointRedData.getInstance().updatePointChild(PointRedType.LyGoldFinger);
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {UpGoldFinger:true});
	}
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$fundsProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_takeFundsBonuses(args: any, argv: any): void {
		let state = this.getFundState(argv.payOtherType);
		state.awardId = args.awardId;
		state.awardExtraId = args.awardExtraId;
		this.insertBonusesResults(args.bonusesResultArr);
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayFunds, argv.payOtherType);
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayExquisiteFunds, argv.payOtherType);
	}
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$itemproto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public env_itemInserts(args: any): void {
		this.insertItems(args.itemInserts);
		if (args.source == VarVal.bonusesEventSourceType.goldFinger) {
			UtilsUI.showJumpItems({
				bonuseString:GameServerData.getInstance().bonusesResultsToString([{inserts:args.itemInserts}])
			});
		}
	}

	public env_itemRemoves(args: any): void {
		this.removeItems(args.itemRemoves);
	}

	public on_mergeItem(args: any): void {
		this.insertItems(args.itemInserts);
		this.removeItems(args.itemRemoves);
	}

	public on_useitem(args: any): void {
		this.removeItems(args.itemRemoves);
		if (args.effectResult) {
			this.insertBonusesResults(args.effectResult.bonusesResultArr);
		}
	}

	public on_openChest(args: any): void {
		this.removeItems(args.itemRemoves);
		this.insertbonusesResult(args.bonusesResult);
	}
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$stageProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_challengestage(args: any): void {
		this.fullInfo.base.curStageLevel = args.stageId;
		this.insertbonusesResult(args.bonusesResult);

		PointRedData.getInstance().updatePointChild(PointRedType.LyStageReward);
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayFunds, Number(VarVal.payOtherType.fundstage));
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayExquisiteFunds, Number(VarVal.payOtherType.fundstage));
	}

	public on_claimchapterreward(args: any): void {
		this.fullInfo.base.curChapterReward = this.fullInfo.base.curStageLevel;
		this.insertBonusesResults(args.bonusesResultArr);

		PointRedData.getInstance().updatePointChild(PointRedType.LyStageReward);
	}
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$MailProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_readMail(args: any): void {
		for (let i = 0; i < this.fullInfo.mails.length; i++) {
			if (this.fullInfo.mails[i].id == args.mailId && this.fullInfo.mails[i].state == 0) {
				this.fullInfo.mails[i].state = 1;
				break;
			}
		}
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {updateMail:true});
	}

	public on_takeMailBonuses(args): void {
		this.insertbonusesResult(args.bonusesResult);
		for (let i = 0; i < this.fullInfo.mails.length; i++) {
			if (this.fullInfo.mails[i].id == args.mailId) {
				this.fullInfo.mails[i].state = 2;
				break;
			}
		}
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {updateMail:true});
	}

	public on_deleteMail(args): void {
		for (let i = 0; i < this.fullInfo.mails.length; i++) {
			if (this.fullInfo.mails[i].id == args.mailId) {
				this.fullInfo.mails.splice(i, 1);
				break;
			}
		}
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {updateMail:true});
	}

	public env_insertMail(args): void {
		let isInsert: boolean = false;
		for (let i = this.fullInfo.mails.length - 1; i >= 0; i--) {
			if (this.sortMail(args.mail, this.fullInfo.mails[i]) >= 0) {
				this.fullInfo.mails.splice(i + 1, 0, args.mail);
				isInsert = true;
				break;
			}
		}
		if (!isInsert) {
			this.fullInfo.mails.splice(0, 0, args.mail);
		}
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {updateMail:true});
	}

	public env_removeMail(args): void {
		for (let i = 0; i < this.fullInfo.mails.length; i++) {
			if (this.fullInfo.mails[i].id == args.id) {
				this.fullInfo.mails.splice(i, 1);
				break;
			}
		}
	}

	public on_quickDeleteMails(args): void{
		for (let j = 0; j < args.mailIds.length; j++) {
			for (let i = 0; i < this.fullInfo.mails.length; i++) {
				if (this.fullInfo.mails[i].id == args.mailIds[j]) {
					this.fullInfo.mails.splice(i, 1);
					break
				}
			}
		}
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {updateMail:true});
	}

	public on_quickTakeMailBonuses(args): void{
		this.insertbonusesResult(args.bonusesResult);
		for (let j = 0; j < args.mailIds.length; j++) {
			for (let i = 0; i < this.fullInfo.mails.length; i++) {
				if (this.fullInfo.mails[i].id == args.mailIds[j]) {
					this.fullInfo.mails[i].state = 2;
					break
				}
			}
		}
		for (let j = 0; j < args.readMailIds.length; j++) {
			for (let i = 0; i < this.fullInfo.mails.length; i++) {
				if (this.fullInfo.mails[i].id == args.readMailIds[j]) {
					this.fullInfo.mails[i].state = 1;
					break
				}
			}
		}
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {updateMail:true});
	}
	public on_breakthrough(args: any): void{
		this.fullInfo.base.phase = args.phase
		this.fullInfo.base.level = args.level
		this.fullInfo.base.exp = args.exp
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {isPlayerAttrChanged:true});
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {UpDataSkin:true});
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayFunds, Number(VarVal.payOtherType.fundxiuwei));
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayExquisiteFunds, Number(VarVal.payOtherType.fundxiuwei));
		GameServerData.getInstance().submitSdkInfo("LEVEL_UP");
		PointRedData.getInstance().updatePointChild(PointRedType.LyBreakStage);
	}
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$仙数$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_evolve(args: any): void{
		this.fullInfo.base.evolveFinishTime = args.evolveFinishTime
		PointRedData.getInstance().updatePointChild(PointRedType.LyEvolution)
	}
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$grabCityProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public env_siegeStateChage(args: any): void{
		if (this.fullInfo.grabCityPlayer) {
			let lastState = this.fullInfo.grabCityPlayer.state;
			this.fullInfo.grabCityPlayer.state = args.state;
			if (lastState != args.state) {
				if (args.state == GrabCityState.close) { // 关闭入口
					ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {sendCrossServer:VarVal.CROSS_SYS_TYPE.GRABCITY});
				} else if (args.state == GrabCityState.signUp) { // 打开入口
					UtilsUI.showEnterGameSend(VarVal.CROSS_SYS_TYPE.GRABCITY);
				} else if (args.state == GrabCityState.ready1) {
				
				} else if (args.state == GrabCityState.battle1) {
					
				} else if (args.state == GrabCityState.ready2) {
				
				} else if (args.state == GrabCityState.battle2) {
					
				} else if (args.state == GrabCityState.over) {
					
				}
				GameServer.getInstance().send((args: any) => {
					if (args.errorcode == 0) {
						
					} else {
						UtilsUI.showMsgTip(args.errorcode);
					}
				}, "siegeGetDatail", null)
			}
		}
	}

	public on_siegeGetDatail(args: any): void{
		this.fullInfo.grabCityPlayer = args
		this.fullInfo.grabCityPlayer.lastActItem = []
	}

	public on_siegeDonate(args: any): void{
		this.fullInfo.grabCityPlayer.clanState = args.clanState
		this.fullInfo.grabCityPlayer.lastActItem = this.fullInfo.grabCityPlayer.playerInfo.activityItem
		if (args.activityItem) {
			this.fullInfo.grabCityPlayer.playerInfo.activityItem = args.activityItem
		}
		this.insertbonusesResult(args.bonusesResult);
	}	

	public on_siegeBattle(args: any): void{
		this.insertbonusesResult(args.bonusesResult);
		if (args.activityItem) {
			this.fullInfo.grabCityPlayer.lastActItem = this.fullInfo.grabCityPlayer.playerInfo.activityItem
			this.fullInfo.grabCityPlayer.playerInfo.activityItem = args.activityItem
		}
		this.fullInfo.grabCityPlayer.clanState = args.clanState
	}

	public on_siegeSkill(args: any): void{
		this.insertbonusesResult(args.bonusesResult);
		if (args.activityItem) {
			this.fullInfo.grabCityPlayer.lastActItem = this.fullInfo.grabCityPlayer.playerInfo.activityItem
			this.fullInfo.grabCityPlayer.playerInfo.activityItem = args.activityItem
		}
		this.fullInfo.grabCityPlayer.clanState = args.clanState
	}

	public on_siegeTowerOpen(args: any): void{
		this.insertBonusesResults(args.bonusesResult);
		this.fullInfo.grabCityPlayer.playerInfo.tower = args.tower;
		if (args.towerOpen != undefined) {
			this.fullInfo.grabCityPlayer.playerInfo.towerOpen = args.towerOpen;
		}
		this.fullInfo.grabCityPlayer.playerInfo.activityItem = args.activityItem;
		this.fullInfo.grabCityPlayer.playerInfo.towerLog = args.towerLog;
	}

	public on_siegeTowerAllOpen(args: any): void{
		this.insertBonusesResults(args.bonusesResult);
		this.fullInfo.grabCityPlayer.playerInfo.tower = args.tower;
		if (args.towerOpen != undefined) {
			this.fullInfo.grabCityPlayer.playerInfo.towerOpen = args.towerOpen;
		}
		this.fullInfo.grabCityPlayer.playerInfo.activityItem = args.activityItem;
		this.fullInfo.grabCityPlayer.playerInfo.towerLog = args.towerLog;
		this.fullInfo.grabCityPlayer.playerInfo.towerTier = args.towerTier;
	}

	public on_siegeTowerNext(args: any): void{
		this.fullInfo.grabCityPlayer.playerInfo.tower = args.tower;
		this.fullInfo.grabCityPlayer.playerInfo.towerOpen = 0;
		this.fullInfo.grabCityPlayer.playerInfo.towerTier = args.towerTier;
		this.fullInfo.grabCityPlayer.playerInfo.towerLog = args.towerLog;
	}

	public on_siegeGuessing(args: any, sarg: any): void { // 竞猜后要数据维护，目前没有事件通知
		let clanPlayerInfo = this.getGrabCityClanPlayerInfo();
		clanPlayerInfo.guessing = sarg.guessing;
	}

	public on_siegeGuessingAward(args: any): void { // 竞猜后要数据维护，目前没有事件通知
		this.insertbonusesResult(args.bonusesResult);
		this.fullInfo.grabCityPlayer.playerInfo.activityItem = args.activityItem;
		let clanPlayerInfo = this.getGrabCityClanPlayerInfo();
		clanPlayerInfo.guessingAward = 1;
	}

	public on_siegeGroupPacketClanRank(args: any): void{
		// this.fullInfo.grabCityPlayer = args
	}

	public on_siegeGift(args: any): void{
		this.insertbonusesResult(args.bonusesResult);
		if (args.activityItem) {
			this.fullInfo.grabCityPlayer.lastActItem = this.fullInfo.grabCityPlayer.playerInfo.activityItem
			this.fullInfo.grabCityPlayer.playerInfo.activityItem = args.activityItem
		}
		this.fullInfo.grabCityPlayer.playerInfo.giftLog = args.giftLog
	}

	public on_siegePayAward(args: any): void{
		this.insertbonusesResult(args.bonusesResult);
		if (args.activityItem) {
			this.fullInfo.grabCityPlayer.lastActItem = this.fullInfo.grabCityPlayer.playerInfo.activityItem
			this.fullInfo.grabCityPlayer.playerInfo.activityItem = args.activityItem
		}
		this.fullInfo.grabCityPlayer.clanState.playerInfo[this.fullInfo.grabCityPlayer.selfRank -1].payAward = args.payAward
	}

	public env_siegeOnPayMoney(args: any): void{
		this.insertbonusesResult(args.bonusesResult);
		if (args.activityItem) {
			this.fullInfo.grabCityPlayer.lastActItem = this.fullInfo.grabCityPlayer.playerInfo.activityItem
			this.fullInfo.grabCityPlayer.playerInfo.activityItem = args.activityItem
		}
		this.fullInfo.grabCityPlayer.playerInfo.giftLog = args.giftLog
	}

	public env_siegeClanStateChage(args: any): void{
		if (this.fullInfo.grabCityPlayer && args.siegeClanState) {
			this.fullInfo.grabCityPlayer.clanState = args.siegeClanState
		}
	}
	
	public on_siegePraiseAward(args: any): void{
		this.insertbonusesResult(args.bonusesResult);
		this.fullInfo.grabCityPlayer.clanState.playerInfo[this.fullInfo.grabCityPlayer.selfRank -1].praiseAward = args.praiseAward
	}
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$equipProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_forge(args: any): void {
        this.removeItems(args.itemRemoves);
		this.insertItems(args.itemInserts);
		this.fullInfo.forgeEquips = args.forgeEquips
		this.insertbonusesResult(args.dropReward)
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {updateInfo:true});
	}
	public on_onReplaceEquip(args: any): void {
		this.fullInfo.forgeEquips.push(args.equip);
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {UpDateEquips: true, data: this.fullInfo.forgeEquips, isForgeEquipAdd:true});
	}
	public on_attachEquip(args: any): void {
		this.fullInfo.battleEquips = args.battleEquips
		this.fullInfo.forgeEquips = args.forgeEquips
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {updateInfo:true});
		PointRedData.getInstance().updatePointChild(PointRedType.LyBreakStage);
		
	}
	public on_breakdown(args: any): void {
		this.fullInfo.forgeEquips = args.forgeEquips
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {updateInfo:true});
		PointRedData.getInstance().updatePointChild(PointRedType.LyBreakStage);
	}

	public env_onEvolveFinish(args: any): void{
		if (args.evolutionLevel) {
			this.fullInfo.base.evolutionLevel = args.evolutionLevel
			PointRedData.getInstance().updatePointChild(PointRedType.LyPayFunds, Number(VarVal.payOtherType.fundxianshu));
			PointRedData.getInstance().updatePointChild(PointRedType.LyPayExquisiteFunds, Number(VarVal.payOtherType.fundxianshu));
		}
		this.fullInfo.base.evolveFinishTime = args.evolveFinishTime
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyEvolution, 0, { up: true });
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {updatePlayerShow : true})
		PointRedData.getInstance().updatePointChild(PointRedType.LyEvolution)
	}
	
	public on_speedUpEvolve(args: any): void{
		this.fullInfo.base.evolveFinishTime = args.evolveFinishTime
        this.removeItems(args.itemRemoves);
		PointRedData.getInstance().updatePointChild(PointRedType.LyEvolution)
	}

	public on_speedUpEvolveForAd(args: any): void{
		this.fullInfo.base.evolveFinishTime = args.evolveFinishTime
		PointRedData.getInstance().updatePointChild(PointRedType.LyEvolution)
	}

	public env_onEvolveTimeChange(args: any): void{
		this.fullInfo.base.evolveFinishTime = args.evolveFinishTime
		PointRedData.getInstance().updatePointChild(PointRedType.LyEvolutionLevelUp)
	}
	public env_onForgeEquipAdd(args: any): void{
		this.fullInfo.forgeEquips.push(args.forgeEquip)
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, { UpDateEquips: true, data: this.fullInfo.forgeEquips,isForgeEquipAdd:true });
	}
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$VeinProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_veinExcite(args: any): void{
		this.removeItems(args.itemRemoves)
		this.fullInfo.veinInfo.pendingGems = args.pendingGems
		PointRedData.getInstance().updatePointChild(PointRedType.LyVeinStimule)
	}

	public on_veinLearn(args: any): void{
		this.fullInfo.veinInfo.learnLevel = args.learnLevel
		this.removeItems(args.itemRemoves)
		PointRedData.getInstance().updatePointChild(PointRedType.LyVeinSatori)
	}

	public on_attachGems(args: any): void{
		this.fullInfo.veinInfo.battleGems = args.battleGems
		this.fullInfo.veinInfo.pendingGems = args.pendingGems
		this.insertItems(args.itemInserts)
		if (args.veinLevel) {
			this.fullInfo.veinInfo.veinLevel = args.veinLevel
		}
		if (args.veinExp) {
			this.fullInfo.veinInfo.veinExp = args.veinExp
		}
		this.fullInfo.veinInfo.attrs = args.attrs
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {upActivationNotify:true});
	}

	public on_discardGems(args: any): void{
		this.fullInfo.veinInfo.pendingGems = args.pendingGems
		this.insertItems(args.itemInserts)
		this.fullInfo.veinInfo.veinExp = args.veinExp
		if (args.veinLevel) {
			this.fullInfo.veinInfo.veinLevel = args.veinLevel
		}
	}
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$chatProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public env_chatInfoChanged(args: any): void {
		let datas:Array<any> = this.getChatRoomInfos(args.chatInfo.channelType, args.chatInfo.activityId);
		datas.push(args.chatInfo);
		if (args.chatInfo.channelType == CHAT_CHANNELTYPE.WORLD ||
			args.chatInfo.channelType == CHAT_CHANNELTYPE.FACTION) {
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {isChatRoomMsg:true});
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPalaceMain, 0, {isChatRoomMsg:true});
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {isChatRoomMsg:true});
			// ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LySpringPlace, 0, {isChatRoomMsg:true});
			// ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LySpring, 0, {isChatRoomMsg:true});
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyBrumeIsle, 0, {isChatRoomMsg:true});
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyBrumeIsleLand, 0, {isChatRoomMsg:true});
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyConquestSeek, 0, {isChatRoomMsg:true});
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyConquestSeekMain, 0, {isChatRoomMsg:true});
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyGrabCity, 0, {isChatRoomMsg:true});
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyGrabCityTower, 0, {isChatRoomMsg:true});
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyGrabCityZone, 0, {isChatRoomMsg:true});
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyGrabCityBattle, 0, {isChatRoomMsg:true});
		}
	}

	public env_tickerInfoChanged(args: any): void {
		let datas:Array<any> = this.fullInfo.notice;
		let tinfo = args.tickerInfo;
		let tickerItem = LocaleData.getTickerItem(tinfo.tickerId);
		let phaseName:string = "";
		if (tinfo.phase) {
			phaseName = tinfo.phase; // 笑哭，直接给的就是名字。
			// phaseName = LocaleData.getPlayerPhaseById(tinfo.phase).name;
		}
		let noticData = {
			tickerInfo: tinfo,
			content: UtilsTool.stringFormat(tickerItem.content, [
				tinfo.playerName, // {0}玩家姓名
				phaseName, // {1}阶段名
				tinfo.artifact, // {2}法宝名
				tinfo.treeLevel, // {3}仙树等级
				tinfo.winnerServer, // {4}胜者服务器名
				tinfo.winnerName, // {5}胜者名
				tinfo.loserServer, // {6}败者服务器名
				tinfo.loserName, // {7}败者名
				tinfo.winStreak, // {8}连胜次数
				tinfo.endStreak, // {9}终结对方连胜次数
				tinfo.reward, // {10}奖励名
				tinfo.rewardAmount, // {11}奖励数量
				tinfo.pet, // {12}宠物名
				tinfo.time, // {13}当前时间
				tinfo.eliteMonsterName, // {14}精怪名
				tinfo.goldFingerName // {15}金手指名字
			])
		}
		datas.push(noticData);
		let MAXNUM = 20;
		if (datas.length > MAXNUM) { // 最大保存数量
			datas.splice(0, datas.length - MAXNUM);
		}
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {isNotice:true});
	}
    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$eliteMonsterProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_editteamcomposition(args: any): void{
		this.fullInfo.base.eliteMonsterTeam = args.eliteMonsterTeam
	}

	public on_setelitemonsterbattleteamid(args: any): void{
		this.fullInfo.base.eliteMonsterBattleTeamId = args.teamId
	}
	
	public on_recruitsingleelitemonster(args: any): void{
		this.fullInfo.base.elityMonsterPitySystemCount = this.fullInfo.base.elityMonsterPitySystemCount + 1
		this.insertItems(args.itemInserts)
		this.removeItems(args.itemRemoves)		
		this.fullInfo.elitemonsterInfo.eliteMonsterRecruitLimit = args.eliteMonsterRecruitLimit
		this.fullInfo.base.elityMonsterDrawCardRewardCount = args.elityMonsterDrawCardRewardCount
		this.fullInfo.base.elityMonsterDrawCardReward = args.elityMonsterDrawCardReward
		PointRedData.getInstance().updatePointChild(PointRedType.LyEliteMonster)
	}

	public on_recruitmultipleelitemonsters(args: any): void{
		this.fullInfo.base.elityMonsterPitySystemCount = this.fullInfo.base.elityMonsterPitySystemCount + 5
		this.insertItems(args.itemInserts)
		this.removeItems(args.itemRemoves)	
		PointRedData.getInstance().updatePointChild(PointRedType.LyEliteMonster)
		this.fullInfo.elitemonsterInfo.eliteMonsterRecruitLimit = args.eliteMonsterRecruitLimit
		this.fullInfo.base.elityMonsterDrawCardRewardCount = args.elityMonsterDrawCardRewardCount
		this.fullInfo.base.elityMonsterDrawCardReward = args.elityMonsterDrawCardReward

	}
	

	public on_recruitEliteMonsterForAd(args: any): void{
		this.fullInfo.base.elityMonsterPitySystemCount = this.fullInfo.base.elityMonsterPitySystemCount + 5
		this.insertItems(args.itemInserts)
		this.fullInfo.elitemonsterInfo.eliteMonsterRecruitLimit = args.eliteMonsterRecruitLimit
		PointRedData.getInstance().updatePointChild(PointRedType.LyEliteMonster)
		this.fullInfo.base.elityMonsterDrawCardRewardCount = args.elityMonsterDrawCardRewardCount
		this.fullInfo.base.elityMonsterDrawCardReward = args.elityMonsterDrawCardReward
	}

	public on_openSpecialguarantees(args: any): void{
		this.insertItems(args.itemInserts)
		this.fullInfo.base.elityMonsterDrawCardReward = args.elityMonsterDrawCardReward
	}

	public on_activiteEliteMonster(args: any): void{
		this.insertItems(args.itemInserts)
		this.removeItems(args.itemRemoves)
		this.fullInfo.elitemonsterInfo.activityEliteMonsterAttrs = args.attrs
		PointRedData.getInstance().updatePointChild(PointRedType.LyEliteMonster)
	}

	public on_levelUpEliteMonster(args: any): void{
		this.removeItems(args.itemRemoves)
		let elitemonster = this.fullInfo.elitemonsterInfo.elitemonster;
		for (let index = 0; index < elitemonster.length; index++) {
			if(elitemonster[index].id == args.elitemonster.id) {
				elitemonster[index] = args.elitemonster;
				break;
			}	
		}
		this.fullInfo.elitemonsterInfo.activityEliteMonsterAttrs = args.attrs
		PointRedData.getInstance().updatePointChild(PointRedType.LyEliteMonster)
	}

	public on_activateOrUpgradeEliteMonsterEncyclopedia(args: any): void{
		let isInsert: boolean = true;
		
		for (let index = 0; index < this.fullInfo.elitemonsterInfo.activityEliteMonsterEncyclopedia.length; index++) {
			if (this.fullInfo.elitemonsterInfo.activityEliteMonsterEncyclopedia[index].resonanceId == args.resonanceId) {
				isInsert = false;
				this.fullInfo.elitemonsterInfo.activityEliteMonsterEncyclopedia[index].resonanceLevel = args.resonanceLevel;
				break;
			}
		}
		if (isInsert) {
			this.fullInfo.elitemonsterInfo.activityEliteMonsterEncyclopedia.push({ resonanceId:args.resonanceId, resonanceLevel:args.resonanceLevel })
		}
		this.fullInfo.elitemonsterInfo.activityEliteMonsterAttrs = args.attrs
		PointRedData.getInstance().updatePointChild(PointRedType.LyEliteMonsterGroup)
	}

	public env_onEliteMonsterRecruitReset(args: any): void {
		this.fullInfo.elitemonsterInfo.eliteMonsterRecruitLimit = args.eliteMonsterRecruitLimit
	}
    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$theurgyProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_theurgyDerive(args: any): void{
		this.insertItems(args.itemInserts)
		this.removeItems(args.itemRemoves)
		for (let index = 0; index < args.newTheurgies.length; index++) {
			let the = args.newTheurgies[index];
			the["new"] = true
			this.fullInfo.theurgyInfo.theurgies.push(the)
		}
		this.fullInfo.theurgyInfo.guaranteedCount = args.guaranteedCount
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyTheurgy, 0, null);
		PointRedData.getInstance().updatePointChild(PointRedType.TheurgyRed)
		PointRedData.getInstance().updatePointChild(PointRedType.LyTheurgyDrawTenbtn)
		this.fullInfo.base.theurgyDeriveSpecialCount = args.theurgyDeriveSpecialCount
		this.fullInfo.base.theurgyDeriveSpecialBonusesList = args.theurgyDeriveSpecialBonusesList
	}
	public on_theurgyAttach(args: any, sargs: any): void{
		for (let index = 0; index < this.fullInfo.theurgyInfo.theurgies.length; index++) {
			if (args.theurgy) {
				if (this.fullInfo.theurgyInfo.theurgies[index].cfgId == args.theurgy.cfgId) {
					this.fullInfo.theurgyInfo.theurgies[index] = args.theurgy
				}
			}
			if (this.fullInfo.theurgyInfo.theurgies[index].cfgId == sargs.theurgyId) {
				this.fullInfo.theurgyInfo.theurgies[index].status = 1
			}
		}
		PointRedData.getInstance().updatePointChild(PointRedType.TheurgyRed)
	}
	public on_theurgyLevelUp(args: any): void{
		this.removeItems(args.itemRemoves)
		for (let index = 0; index < this.fullInfo.theurgyInfo.theurgies.length; index++) {
			if (this.fullInfo.theurgyInfo.theurgies[index].cfgId == args.theurgy.cfgId) {
				this.fullInfo.theurgyInfo.theurgies[index] = args.theurgy
			}
		}
		PointRedData.getInstance().updatePointChild(PointRedType.TheurgyRed)
	}
	public on_theurgyCatalogLevelUp(args: any): void{
		let isInsert: boolean = true;
		for (let index = 0; index < this.fullInfo.theurgyInfo.theurgyCatalog.length; index++) {
			if (this.fullInfo.theurgyInfo.theurgyCatalog[index].id == args.theurgyCatalog.id) {
				this.fullInfo.theurgyInfo.theurgyCatalog[index] = args.theurgyCatalog
				isInsert = false
			}
		}
		if (isInsert) {
			this.fullInfo.theurgyInfo.theurgyCatalog.push(args.theurgyCatalog)
		}
		PointRedData.getInstance().updatePointChild(PointRedType.LyTheurgyGroup)
	}
	public on_theurgyBreakthrough(args: any): void{
		this.removeItems(args.itemRemoves)
		if (this.fullInfo.theurgyInfo.theurgies.length == 0) {
			this.fullInfo.theurgyInfo.theurgies.push(args.theurgy)
		}else{
			let inst = true
			for (let index = 0; index < this.fullInfo.theurgyInfo.theurgies.length; index++) {
				if (this.fullInfo.theurgyInfo.theurgies[index].cfgId == args.theurgy.cfgId) {
					this.fullInfo.theurgyInfo.theurgies[index] = args.theurgy
					inst = false
				}
			}
			if (inst) {
				this.fullInfo.theurgyInfo.theurgies.push(args.theurgy)
			}
		}
		PointRedData.getInstance().updatePointChild(PointRedType.LyTheurgyGroup)
	}
	public on_theurgyReset(args: any): void{
		this.insertItems(args.itemInserts)
		for (let index = 0; index < this.fullInfo.theurgyInfo.theurgies.length; index++) {
			if (this.fullInfo.theurgyInfo.theurgies[index].cfgId == args.theurgy.cfgId) {
				this.fullInfo.theurgyInfo.theurgies[index] = args.theurgy
			}
		}

		if (args.detachTheurgySeals) {
			for (let index = 0; index < args.detachTheurgySeals.length; index++) {
				let seal = args.detachTheurgySeals[index]
				this.fillProtoTheurgySeal(seal)
				this.fullInfo.theurgyInfo.theurgySeal.push(seal)
			}
		}
		PointRedData.getInstance().updatePointChild(PointRedType.TheurgyRed)
	}
	public on_theurgyAttachSeal(args: any): void{
		this.removeItems(args.itemRemoves)
		for (let index = 0; index < this.fullInfo.theurgyInfo.theurgies.length; index++) {
			if (this.fullInfo.theurgyInfo.theurgies[index].cfgId == args.theurgy.cfgId) {
				this.fullInfo.theurgyInfo.theurgies[index] = args.theurgy
			}
		}
		for (let index = 0; index < this.fullInfo.theurgyInfo.theurgySeal.length; index++) {
			let sealInst = this.fullInfo.theurgyInfo.theurgySeal[index]
			if (args.attachTheurgySeal) {
				if (sealInst.id == args.attachTheurgySeal.id) {
					this.fullInfo.theurgyInfo.theurgySeal[index] = args.attachTheurgySeal
					this.fillProtoTheurgySeal(this.fullInfo.theurgyInfo.theurgySeal[index])
				}
			}
			if (args.detachTheurgySeal) {
				if (sealInst.id == args.detachTheurgySeal.id) {
					this.fullInfo.theurgyInfo.theurgySeal[index] = args.detachTheurgySeal
					this.fillProtoTheurgySeal(this.fullInfo.theurgyInfo.theurgySeal[index])
				}
			}
		}
		PointRedData.getInstance().updatePointChild(PointRedType.TheurgyRed)
	}
	public on_theurgyDetachSeal(args: any): void{
		this.removeItems(args.itemRemoves)
		for (let index = 0; index < this.fullInfo.theurgyInfo.theurgies.length; index++) {
			if (this.fullInfo.theurgyInfo.theurgies[index].cfgId == args.theurgy.cfgId) {
				this.fullInfo.theurgyInfo.theurgies[index] = args.theurgy
			}
		}

		for (let index = 0; index < this.fullInfo.theurgyInfo.theurgySeal.length; index++) {
			if (this.fullInfo.theurgyInfo.theurgySeal[index].id == args.theurgySeal.id) {
				this.fullInfo.theurgyInfo.theurgySeal[index] = args.theurgySeal
				this.fillProtoTheurgySeal(this.fullInfo.theurgyInfo.theurgySeal[index])
			}
		}
		PointRedData.getInstance().updatePointChild(PointRedType.TheurgyRed)
		
	}

	public on_mergeSealByType(args: any): void{
		this.removeItems(args.itemRemoves)
		this.insertItems(args.itemInserts)
	}

	public on_theurgyDeriveForAd(args: any): void{
		this.removeItems(args.itemRemoves)
		this.insertItems(args.itemInserts)
		for (let index = 0; index < args.newTheurgies.length; index++) {
			let the = args.newTheurgies[index];
			the["new"] = true
			this.fullInfo.theurgyInfo.theurgies.push(the)
		}
		this.fullInfo.theurgyInfo.guaranteedCount = args.guaranteedCount
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyTheurgy, 0, null);
		// let adData = this.getAdData(VarVal.adTimesType.theurgyDarw)
		// adData.count = adData.count + 1
		PointRedData.getInstance().updatePointChild(PointRedType.LyTheurgy)
	}

	public on_replaceTheurgyFrag(args: any): void {
		this.removeItems(args.itemRemoves);
		this.insertItems(args.itemInserts);
		for (let index = 0; index < args.newTheurgies.length; index++) {
			let the = args.newTheurgies[index];
			the["new"] = true;
			this.fullInfo.theurgyInfo.theurgies.push(the);
		}
		PointRedData.getInstance().updatePointChild(PointRedType.TheurgyRed);
	}

	public on_takeTheurgySpecialBonuses(args: any): void {
		this.insertbonusesResult(args.bonusesResult);
	}

	public on_takeTheurgySpecialLottery(args: any): void {
		this.removeItems(args.itemRemoves);
		this.insertbonusesResult(args.bonusesResult);
	}


	//广告刷新
	public env_adRefresh(args: any): void {
		this.fullInfo.ad = args.ad
	}

	public on_hireAndTrainMouse(args: any): void{
		if (args.costResult) {
			this.removeCostResult(args.costResult);
		}
	}

	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ mountProto $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_mountOpen(args: any): void{
		this.fullInfo.mount = args.mount;
		PointRedData.getInstance().updatePointChild(PointRedType.LyMountLevelUp);
	}
	public on_mountUnlock(args: any): void{
		this.fullInfo.mount = args.mount;
	}
	public on_mountClothes(args: any): void{
		this.fullInfo.mount = args.mount;
		this.removeCostResult(args.costResult);
	}
	public on_mountUpgrades(args: any): void{
		this.fullInfo.mount = args.mount;
		this.removeCostResult(args.costResult);
	}
	public on_mountCat(args: any): void{
		this.fullInfo.mount = args.mount;
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {UpMountSkin:true});
	}
	public on_mountCatClothes(args: any): void{
		this.fullInfo.mount = args.mount;
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {UpMountSkin:true});
	}
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ palaceProto $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_palaceGetInfo(args: any): void{
		this.fullInfo.palaceHallData = args;
		PointRedData.getInstance().updatePointChild(PointRedType.LyPalaceMain);
		PointRedData.getInstance().updatePointChild(PointRedType.LyPalaceGrant);
	}
	public on_palaceLike(args: any, argv: any): void{
		if (argv.likeType == 1) {
			let __palace = this.fullInfo.palaceHallData;
			if (__palace) {
				__palace.buffId = args.buffId;
			}
		}
	}
	public setPalaceLikeExpire(playerId: string): void{
		let __palace = this.fullInfo.palaceHallData;
		if (__palace) {
			__palace.likeInfo.grant.push(playerId);
		}
	}
	public on_palaceGrant(args: any): void{
		this.insertItems(args.itemInserts);
		// 这里没有事件来，我手动刷一下
		let __palace = this.fullInfo.palaceHallData;
		if (__palace) {
			__palace.isGrant = true;
		}
		PointRedData.getInstance().updatePointChild(PointRedType.LyPalaceGrant);
	}
	public on_palaceBuyGoods(args: any, argv: any): void{
		this.removeItems(args.itemRemoves);
		this.insertItems(args.itemInserts);
		this.fullInfo.palaceBuyGoods.push(String(argv.goodsId));
	}
	public env_onPalaceReceiveGrant(args: any): void{
		let __palace = this.fullInfo.palaceHallData;
		if (__palace) {
			__palace.grantInfo.push(args);
		}
		// 向主界面请求弹窗。
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {receiveGrant:true});
	}
	public env_onPalaceBuffEffect(args: any): void{
		let __palace = this.fullInfo.palaceHallData;
		if (__palace) {
			__palace.buffId = args.buffId;
			__palace.buffCount = args.buffCount;
			// args.value;
		}
		ViewDispatcher.pushNotiEvent({isIgnoreQueue:true}, ViewDispatcher.EVENT_PUSH_MULTI, FmPalaceBuffHit, 0, {buffId:args.buffId});
	}
	public env_onPalaceListed(args: any): void{
		let __palace = this.fullInfo.palaceHallData;
		if (__palace) {
			__palace.palaceInfo.push(args.palaceInfo);
		}
		PointRedData.getInstance().updatePointChild(PointRedType.LyPalaceMain);
		PointRedData.getInstance().updatePointChild(PointRedType.LyPalaceGrant);
	}
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ activityProto $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public env_activityStateChanged(args: any): boolean {
		if (!args || !args.activityState || args.activityState.activityId == null) {
			return false;
		}
		if (!this.fullInfo.activityStates) {
			this.fullInfo.activityStates = {};
		}
		let activityId = String(args.activityState.activityId);
		console.log(UtilsTool.stringFormat("clasz({0})   activityId   {1}", [args.activityState.clasz, activityId]));

		let lastState = this.fullInfo.activityStates[activityId];
		if (!lastState) {
			args.isCreate = true;
		}
		this.fullInfo.activityStates[activityId] = args.activityState;
		// 刷新红点
		if (activityId == VarVal.ACTIVITY_ID.KING_MONSTER) {
			PointRedData.getInstance().updatePointChild(PointRedType.LyActivityKingMonster);
		} else if (activityId == VarVal.ACTIVITY_ID.INVASION) {
			PointRedData.getInstance().updatePointChild(PointRedType.LyActivityInvasionBattle);
		} else if (activityId == VarVal.ACTIVITY_ID.MONSTOR_TOWER) {
			PointRedData.getInstance().updatePointChild(PointRedType.LyActivityMonsterTowerBattle);
			PointRedData.getInstance().updatePointChild(PointRedType.LyActivityMonsterTowerAuto);
			if (!lastState || (lastState.data && lastState.data.activityTower.highTier != args.activityState.data.activityTower.highTier)) {
				PointRedData.getInstance().updatePointChild(PointRedType.LyPayFunds, Number(VarVal.payOtherType.fundtower));
				PointRedData.getInstance().updatePointChild(PointRedType.LyPayExquisiteFunds, Number(VarVal.payOtherType.fundtower));
			}
		} else if (activityId == VarVal.ACTIVITY_ID.PALACE) {
			let __palace = this.fullInfo.palaceHallData;
			if (__palace && args.activityState.data.activityPalace) {
				let activityPalace = args.activityState.data.activityPalace;
				__palace.isGrant = activityPalace.isGrant;
				__palace.likeInfo = activityPalace.likeInfo;
				__palace.buffId = activityPalace.buffId;
				__palace.buffCount = activityPalace.buffCount;
			}
			PointRedData.getInstance().updatePointChild(PointRedType.LyPalaceMain);
			PointRedData.getInstance().updatePointChild(PointRedType.LyPalaceGrant);
		
		} else if(activityId == VarVal.ACTIVITY_ID.PAYACC) {
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayExquisite, 0, {isCommonLeiTotal:true});

			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyPayExquisite, 0, {page:PayExquisitePage.LEITOTAL});
			PointRedData.getInstance().updatePointChild(PointRedType.LyPayExquisiteLeiTotal);

			PointRedData.getInstance().updatePointChild(PointRedType.LyPayExquisiteDailyLeiActTotal);
			PointRedData.getInstance().updatePointChild(PointRedType.LyPayExquisiteDailyLeiActDay);
			PointRedData.getInstance().updatePointChild(PointRedType.totalCharge);
			PointRedData.getInstance().updatePointChild(PointRedType.totalDay);
		} else if (activityId == VarVal.ACTIVITY_ID.HAVEN) {
			PointRedData.getInstance().updatePointChild(PointRedType.LyHaven);
		} else if (activityId == VarVal.ACTIVITY_ID.SEVENDAYS) {
			PointRedData.getInstance().updatePointChild(PointRedType.LyActivitySevenDays);
		} else if (activityId == VarVal.ACTIVITY_ID.TREE_REBATE) {
			PointRedData.getInstance().updatePointChild(PointRedType.LyTreeRebatePool);
		} else if (activityId == VarVal.ACTIVITY_ID.OPEN_RANK) {
			PointRedData.getInstance().updatePointChild(PointRedType.LyActivityOpenRankBonuse);
		} else if (args.activityState.clasz == VarVal.ACTIVITY_CLASZ.OPENCELEBRATION) { // 运营活动
			PointRedData.getInstance().updatePointChild(PointRedType.LyActivityOpenCelebration, args.activityState.activityId);
		} else if (args.activityState.clasz == VarVal.ACTIVITY_CLASZ.REINCARNATIONHALL) { // 运营活动
			PointRedData.getInstance().updatePointChild(PointRedType.LyActivityReincarnationHall, args.activityState.activityId);
		} else if (args.activityState.clasz == VarVal.ACTIVITY_CLASZ.FORTUNE) { // 运营活动
			PointRedData.getInstance().updatePointChild(PointRedType.LyActivityFortune, args.activityState.activityId);
		} else if (args.activityState.clasz == VarVal.ACTIVITY_CLASZ.ELITEMONSTOR_LL) { // 运营活动
			PointRedData.getInstance().updatePointChild(PointRedType.LyEliteAttack, args.activityState.activityId);
		} else if (args.activityState.clasz == VarVal.ACTIVITY_CLASZ.BUDDYMASS) { // 运营活动
			PointRedData.getInstance().updatePointChild(PointRedType.LyBuddyMass, args.activityState.activityId);
		} else if (args.activityState.clasz == VarVal.ACTIVITY_CLASZ.PSYCHICINSIGHT) { // 运营活动
			PointRedData.getInstance().updatePointChild(PointRedType.LyPsychicInsight, args.activityState.activityId);
		} else if (activityId == VarVal.ACTIVITY_ID.BRUMEISLE) { 
			PointRedData.getInstance().updatePointChild(PointRedType.LyBrumeIsle);
		}
	}

	public env_activityStateRemoveChanged(args: any): void {
		delete this.fullInfo.activityStates[String(args.activityId)];
	}

	public env_activityOpenState(args: any): void {
		this.fullInfo.activityOpenStates[String(args.id)] = args;
	}

	public env_activityGlobalStateChanged(args: any): void {
		this.fullInfo.activityGlobalStates[String(args.activityGlobalState.activityId)] = args.activityGlobalState;
	}

	public env_dynamicActivityInsert(args: any): void {
		if (args.dynamicActivityParam.data) {
			args.dynamicActivityParam.data = JSON.parse(args.dynamicActivityParam.data);
		}
		this.fullInfo.dynamicActivityParams[String(args.dynamicActivityParam.id)] = args.dynamicActivityParam;
		PointRedData.getInstance().createDynaActivityBranch(args.dynamicActivityParam);
	}

	public env_dynamicActivityRemove(args: any): void {
		let dynamicParam = this.fullInfo.dynamicActivityParams[String(args.id)];
		delete this.fullInfo.dynamicActivityParams[String(args.id)];
		if (dynamicParam) { // 服务器上活动时出错了，客户端会没同步到数据，然后触发本事件会导致null。
			PointRedData.getInstance().removeDynaActivityBranch(dynamicParam);
		}
	}

	public env_dynamicActivityStateChanged(args: any): void {
		let p = this.fullInfo && this.fullInfo.dynamicActivityParams
			? this.fullInfo.dynamicActivityParams[String(args.id)] : null;
		if (!p) { return; }
		p.state = args.state;
	}

	public env_dynamicActivitySortIndex(args: any): void {
		let p = this.fullInfo && this.fullInfo.dynamicActivityParams
			? this.fullInfo.dynamicActivityParams[String(args.id)] : null;
		if (!p) { return; }
		p.sortIndex = args.sortIndex;
	}

	// 坊市
	public on_shopBuy(args: any): void {
		this.insertbonusesResult(args.bonusesResult);
	}

	public on_bazaarVoucherBuy(args: any): void {
		this.insertbonusesResult(args.bonusesResult);
	}

	// 挑战妖王
	public on_monsterKingChallenge(args: any): void {
		this.removeCostResult(args.costResult);
		this.insertbonusesResult(args.bonusesResult);
		this.insertbonusesResult(args.companionBoostBonuses);
		this.insertbonusesResult(args.palaceBoostBonuses);
	}
	
	// 异兽入侵
	public on_challengeInvasion(args: any): void {
		this.insertBonusesResults(args.bonusesResultArr);
	}

	// 领取每日福利
	public on_takeWelfare(args: any): void {
		this.insertbonusesResult(args.bonusesResult);
	}

	// 妖塔
	public on_towerFight(args: any): void {
		this.insertBonusesResults(args.bonusesResultArr);
	}

	//群英
	public on_challengeOpp(args: any):void {
		this.removeItems(args.itemRemoves);
		this.insertItems(args.itemInserts);
	}
	public on_queryChallengeList(args: any):void {
		PointRedData.getInstance().updatePointChild(PointRedType.LyCrossQunYin);
	}
	public on_refreshQunYinList(args: any):void {
		this.fullInfo.base.qunyinRefreshCount = args.qunyinRefreshCount
	}
	public on_qunyin_buy(args: any):void {
		this.insertItems(args.itemInserts);
	}
	public on_takeQunYinAchievement(args: any):void {
		this.insertbonusesResult(args.bonusesResult);
	}

	public env_qunyinChaBuyCountChanged(args: any):void{
		this.fullInfo.chaBuyCount = args.count
		this.fullInfo.chaBuyTime = args.chaBuyTime
		if (args.chaRecoverTime) {
			this.fullInfo.chaRecoverTime = args.chaRecoverTime
		}
	}

	public on_takeOpenRankBonuses(args: any):void {
		this.insertbonusesResult(args.bonusesResult);
	}

	public on_sevenDays(args: any):void{
		this.insertbonusesResult(args.bonusesResultArr);
	}	
	public on_scoreShopBuy(args: any):void{
		this.insertbonusesResult(args.bonusesResult);
	}

	//福地
	public on_enterHaven(args: any):void {
		this.insertItems(args.itemInserts);
	}

	public env_activityGetItems(args: any):void {
		this.insertItems(args.itemInserts);
	}

	// 开服庆典
	public on_takeOpenCelebrationScoreBonuses(args: any):void {
		this.insertbonusesResult(args.bonusesResult);
	}

	public on_openCelebrationExchangeGoods(args: any):void {
		this.insertbonusesResult(args.bonusesResult);
	}

	public on_takeOpenCelebrationDaysGiftsBonuses(args: any):void {
		this.insertbonusesResult(args.bonusesResult);
	}

	// 轮回殿
	public on_takeReincarnationHallTaskBonuses(args: any):void {
		this.insertbonusesResult(args.bonusesResult);
	}

	public on_takeReincarnationHallGiftsBonuses(args: any):void {
		this.insertbonusesResult(args.bonusesResult);
	}

	// 运势
	public on_takeFortuneTaskBonuses(args: any):void {
		this.insertbonusesResult(args.bonusesResult);
	}

	public on_takeFortuneTotalDrawBonuses(args: any):void {
		this.insertbonusesResult(args.bonusesResult);
	}

	public on_fortuneDraw(args: any):void {
		this.insertbonusesResult(args.bonusesResult);
	}

	public on_takeFortuneDaysGiftsBonuses(args: any):void {
		this.insertbonusesResult(args.bonusesResult);
	}
	
	//精怪入侵
	public on_takeGremlinExperienceGiftsBonuses(args: any):void {
		this.insertbonusesResult(args.bonusesResult);
	}
	public on_takeGremlinExperienceTotalRechargeBonuses(args: any):void {
		this.insertbonusesResult(args.bonusesResult);
	}

	public on_takeAnimalFairylandGiftsBonuses(args: any):void {
		this.insertbonusesResult(args.bonusesResult);
	}

	public on_animalFairylandDraw(args: any):void {
		this.insertbonusesResult(args.bonusesResult);
	}

	public on_gremlinExperienceExorcise(args: any):void {
		this.insertbonusesResult(args.bonusesResult);
	}

	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$duelProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_duel(args: any): void {
		this.removeItems(args.itemRemoves);
		this.insertItems(args.itemInserts);
		this.insertbonusesResult(args.victoryReward);
		this.insertbonusesResult(args.companionBoostReward);
		this.fullInfo.duelInfo.rankOf = args.rankOf;
		this.fullInfo.duelInfo.duelScore = args.duelScore;
		this.fullInfo.duelInfo.duelRecord = args.duelRecord;
		this.fullInfo.duelInfo.duelList = args.duelList;
	}

	public on_refreshDuelList(args: any): void {
		this.fullInfo.duelInfo.duelList = args.duelList;
	}

	public on_getDuelRank(args: any): void {
		this.fullInfo.duelInfo.rankOf = args.rankOf;
		this.fullInfo.duelInfo.duelScore = args.duelScore;

		this.fullInfo.duelInfo.ranks = args.ranks; // 特殊存储；别学
	}

	public env_onDuelInfoChange(args: any): void {
		this.fullInfo.duelInfo.rankOf = args.rankOf;
		this.fullInfo.duelInfo.duelScore = args.duelScore;
		this.fullInfo.duelInfo.duelRecord = args.duelRecord;
	}

	public env_onDuelListChange(args: any): void {
		this.fullInfo.duelInfo.duelList = args.duelList;
	}
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$testProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_addItem(args: any): void {
		this.insertItems(args.itemInserts);
	}
	public on_addItems(args: any): void {
		this.insertItems(args.itemInserts);
	}
	public on_testchallengestage(args: any): void {
		this.insertbonusesResult(args.chapterBonusesResult);
		this.on_challengestage(args);
	}

	public on_setopenday(args: any): void {
		this.fullInfo.openDay = args.openDay;
	}

	public on_settime(args: any): void {
		this.serverTime = args.time;
		this.clientTime = this.getClientTime();
	}

	public on_directLevel(args: any): void {
		this.fullInfo.base.level = args.level;
		this.fullInfo.base.phase = args.phase;
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayFunds, Number(VarVal.payOtherType.fundxiuwei));
		PointRedData.getInstance().updatePointChild(PointRedType.LyPayExquisiteFunds, Number(VarVal.payOtherType.fundxiuwei));
		GameServerData.getInstance().submitSdkInfo("LEVEL_UP");
	}

	public on_addVeinLevel(args: any): void {
		this.fullInfo.veinInfo.veinLevel = args.veinLevel;
	}
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$petProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	
	public on_recruitpet(args: any): void {
		this.fullInfo.base.recruitingPets = args.petArr
		this.removeItems(args.itemRemoves);
		this.insertItems(args.itemInserts); // 宠物也在这里。
	}
	public on_refreshrecruitingpets(args: any): void {
		this.fullInfo.base.recruitingPets = args.petArr
		this.removeItems(args.itemRemoves);
		this.fullInfo.base.petPitySystemCount = args.petPitySystemCount
		if (this.isHaveLifeCard()) {
			this.fullInfo.petModuleInfo.petDrawCount = args.petDrawCount
		}
		PointRedData.getInstance().updatePointChild(PointRedType.LyPetAD);
	}
	public on_summonpet(args: any): void {
		this.fullInfo.base.summonPet = args.petId
		PointRedData.getInstance().updatePointChild(PointRedType.LyPetLevel);
	}
	public on_leveluppet(args: any): void {
		this.removeCostResult(args.costResult);
		for (let i = 0; i < this.fullInfo.petModuleInfo.pet.length; i++) {
			if (this.fullInfo.petModuleInfo.pet[i].id == args.pet.id) {
				this.fillProtoPet(args.pet);
				this.fullInfo.petModuleInfo.pet[i] = args.pet
				PointRedData.getInstance().updatePointChild(PointRedType.LyPetLevel);
				break;
			}
		}
	}
	public on_petreset(args: any): void {
		this.removeCostResult(args.costResult);
		this.insertItems(args.itemInserts);
		for (let i = 0; i < this.fullInfo.petModuleInfo.pet.length; i++) {
			if (this.fullInfo.petModuleInfo.pet[i].id == args.pet.id) {
				this.fillProtoPet(args.pet);
				this.fullInfo.petModuleInfo.pet[i] = args.pet
				break;
			}
		}
	}
	public on_petrelease(args: any): void {
		this.removePetInst(args.pet.id)
		this.insertItems(args.itemInserts);
		this.insertItems(args.boostItemInserts);
	}
	public on_expandpetinventory(args: any): void {
		this.fullInfo.base.petBackpackCapacity = args.petBackpackCapacity
		this.removeItems(args.itemRemoves);
	}
	public on_refreshBuffSkill(args: any): void {
		this.removeCostResult(args.costResult);
		for (let i = 0; i < this.fullInfo.petModuleInfo.pet.length; i++) {
			if (this.fullInfo.petModuleInfo.pet[i].id == args.instID) {
				this.fullInfo.petModuleInfo.pet[i].refreshBuffSkill = args.buffArr
				return
			}
		}
	}
	public on_saveRefreshBuffSkill(args: any,sargs:any): void {
		for (let i = 0; i < this.fullInfo.petModuleInfo.pet.length; i++) {
			if (this.fullInfo.petModuleInfo.pet[i].id == sargs.instID) {
				if (args.buffSkill) {
					this.fullInfo.petModuleInfo.pet[i].buffSkill=args.buffSkill
				}
				this.fullInfo.petModuleInfo.pet[i].refreshBuffSkill = []
				return
			}
		}
	}
	public on_devourpet(args: any): void {
		for (let i = 0; i < this.fullInfo.petModuleInfo.pet.length; i++) {
			if (this.fullInfo.petModuleInfo.pet[i].id == args.devourerPet.id) {
				this.fillProtoPet(args.devourerPet);
				this.fullInfo.petModuleInfo.pet[i] = args.devourerPet
				break;
			}
		}
		this.removePetInst(args.preyPet.id)
		this.insertItems(args.itemInserts);
		this.insertItems(args.boostItemInserts);
	}
	public on_setpetpitysystem(args: any): void{
		this.fullInfo.base.petPitySystemId = args.petProtoId
	}
	public on_togglepetlock(args: any): void{
		for (let i = 0; i < this.fullInfo.petModuleInfo.pet.length; i++) {
			if (this.fullInfo.petModuleInfo.pet[i].id == args.petId) {
				this.fullInfo.petModuleInfo.pet[i].isLock = args.isLocked
				break;
			}
		}
	}
	public on_takeConsumptionBonuse(args: any): void{
		console.log(args);
		console.log(this.fullInfo.base.petConsumptionReward);
		
		this.fullInfo.base.petConsumptionReward = args.petConsumptionReward
		console.log(this.fullInfo.base.petConsumptionReward);
		console.log("this.fullInfo.base.petConsumptionReward");

		this.insertbonusesResult(args.bonusesResult);
	}
	public env_activityencyclopedia(args: any): void {
		this.fullInfo.petModuleInfo.activityPetEncyclopedia = args.petEncyclopedia
	}
	public env_insertPetRecord(args: any): void {
		this.fullInfo.petModuleInfo.ownerPetRecord.push(args.petProtoID)
	}
	public env_petADSCountChange(args: any): void {
		this.fullInfo.petModuleInfo.petADSCount = args.petADSCount
	}
	public env_updateConsumptionBonuse(args: any): void {
		this.fullInfo.base.petConsumption = args.petConsumption
		this.fullInfo.base.petConsumptionReward = args.petConsumptionReward
	}
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$companionProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_explore(args: any): void{
		this.insertbonusesResult(args.dropReward)
		let companionData = this.fullInfo.companionData
		companionData.stamina = args.stamina
		companionData.staminaRecoverTime = args.staminaRecoverTime
		companionData.nextStaminaRecoverTime = args.nextStaminaRecoverTime
		if (args.companions) {
			companionData.companions = args.companions
		}
	}
	public on_addExploreStamina(args: any): void{
		this.removeItems(args.itemRemoves);
		let companionData = this.fullInfo.companionData
		companionData.stamina = args.stamina
		companionData.staminaRecoverTime = args.staminaRecoverTime
		companionData.nextStaminaRecoverTime = args.nextStaminaRecoverTime
	}
	public on_increaseCompanionLiking(args: any): void{
		this.removeItems(args.itemRemoves);
		let companionData = this.fullInfo.companionData
		companionData.companionAttrs = args.companionAttrs
		for (let i = 0; i < companionData.companions.length; i++) {
			const element = companionData.companions[i];
			if (element.companionId == args.companion.companionId) {
				companionData.companions[i]= args.companion
				break
			}
		}
	}
	public on_duelCompanion(args: any): void{
		this.insertbonusesResult(args.dropReward);
		let companionData = this.fullInfo.companionData
		for (let i = 0; i < companionData.companions.length; i++) {
			const element = companionData.companions[i];
			if (element.companionId == args.companion.companionId) {
				companionData.companions[i]= args.companion
				break
			}
		}
		PointRedData.getInstance().updatePointChild(PointRedType.LyCompanionBattle);
	}
	public on_unlockCompanion(args: any): void{
		this.removeItems(args.itemRemoves);
		let companionData = this.fullInfo.companionData
		companionData.companionAttrs = args.companionAttrs
		companionData.companions.push(args.companion)
		for (let i = 0; i < companionData.companionCounter.length; i++) {
			const element = companionData.companionCounter[i];
			if (element.id == args.companion.companionId) {
				companionData.companionCounter.splice(i, 1)
				break
			}
		}
		PointRedData.getInstance().updatePointChild(PointRedType.LyCompanionInfo);
		PointRedData.getInstance().updatePointChild(PointRedType.LyCompanionBattle);
	}
	public on_unlockCompanionSkin(args: any): void{
		this.removeItems(args.itemRemoves);
		let companionData = this.fullInfo.companionData
		companionData.companionSkinAttrs = args.companionSkinAttrs
		for (let i = 0; i < companionData.companionSkins.length; i++) {
			const element = companionData.companionSkins[i];
			if (element.skinId == args.companionSkin.skinId) {
				companionData.companionSkins[i] = args.companionSkin
				return
			}
		}
		companionData.companionSkins.push(args.companionSkin)
	}
	public on_changeCompanionSkin(args: any,sargs:any): void{
		this.removeItems(args.itemRemoves);
		let companionData = this.fullInfo.companionData
		for (let i = 0; i < companionData.companions.length; i++) {
			const element = companionData.companions[i];
			if (element.companionId == sargs.companionId) {
				companionData.companions[i].skinId = sargs.skinId
				break
			}
		}
	}
	
	public env_companionUnlockValueChanged(args:any): void{
		let companionData = this.fullInfo.companionData
		for (let i = 0; i < companionData.companionCounter.length; i++) {
			const element = companionData.companionCounter[i];
			if (element.id == args.companionCounter.id) {
				companionData.companionCounter[i]=args.companionCounter
				break
			}
		}
		PointRedData.getInstance().updatePointChild(PointRedType.LyCompanionInfo);
	}
	public env_onExploreStaminaChange(args:any): void{
		let companionData = this.fullInfo.companionData
		companionData.stamina = args.stamina
		companionData.staminaRecoverTime = args.staminaRecoverTime
		companionData.nextStaminaRecoverTime = args.nextStaminaRecoverTime
		// PointRedData.getInstance().updatePointChild(PointRedType.LyCompanionInfo);
	}
	//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$clanProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

	// private clanInfo: any;
	public on_getMyClanInfo(args: any): void{
		this.fullInfo.clan= args
	}
	public on_joinClan(args: any): void{
		// console.log("on_joinClan-================加入帮派");
		// console.log(args);
		this.fullInfo.clan = args
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanApply);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanShop);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanTaskGet);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanTaskEvolve);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanBattleDuel);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanBattleReward);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanBattleTask);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanMerchant);
	}
	public on_createClan(args: any): void{
		this.fullInfo.clan = args
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanApply);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanShop);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanTaskGet);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanTaskEvolve);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanBattleDuel);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanBattleReward);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanBattleTask);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanMerchant);
	}
	public on_transferLeader(args: any): void{
		this.fullInfo.clan = args
	}
	public on_clanDesignateMember(args: any): void{
		// console.log("clanDesignateMember-================任命");
		// console.log(args);
		let calnData = this.fullInfo.clan
		for (let i = 0; i < calnData.clanMember.length; i++) {
			const element = calnData.clanMember[i];
			if (element.playerId == args.clanMember.playerId) {
				calnData.clanMember[i]=args.clanMember
				break
			}
		}
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanApply);
	}
	public on_leaveClan(args: any): void{
		// console.log("on_leaveClan-================退出帮派");
		this.fullInfo.clan = {}
	}
	public on_dissolveClan(args: any): void{
		// console.log("on_dissolveClan-================解散帮派");
		this.fullInfo.clan = {}
	}
	public on_clanKickMember(args: any,sargs:any): void{
		let calnData = this.fullInfo.clan
		// console.log("on_clanKickMember-================踢出成员");
		// console.log(args);
		for (let i = 0; i < calnData.clanMember.length; i++) {
			const element = calnData.clanMember[i];
			if (element.playerId == sargs.playerId) {
				calnData.clanMember.splice(i, 1)
				calnData.clanInfo = args.clanInfo
				break
			}
		}
	}
	public on_clanRename(args: any): void{
		this.fullInfo.clan.clanInfo= args.clanInfo
	}

	public on_clanEditInfo(args: any,sargs:any): void{
		this.fullInfo.clan.clanInfo= args.clanInfo
	}
	public on_watchad(args: any): void{
		this.insertItems(args.itemInserts);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanTaskGet);
	}

	public on_clanApproveMember(args: any): void{
		// console.log("on_clanApproveMember==============审批准成员");
		// console.log(args);
		let calnData = this.fullInfo.clan
		calnData.clanApply = args.clanApply
		calnData.clanMember = args.clanMember
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanApply);
	}
	
	public on_clanDuelBuff(args: any): void{
		// console.log("on_clanDuelBuff==============禁地布阵");
		// console.log(args);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanBattleDuel);
		
	}

	public on_clanDuel(args: any): void{
		// console.log("on_clanDuel==============禁地挑战");
		// console.log(args);
		// this.insertbonusesResult(args.duelClaimReward);
		// this.insertBonusesResults(args.damageClaimReward);
		// let calnData = this.fullInfo.clan
		// calnData.clanApply = args.clanApply
		// calnData.clanMember = args.clanMember
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanBattleReward);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanBattleTask);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanBattleDuel);
	}
	public on_clanBuyGoods(args: any): void{
		this.insertItems(args.itemInserts);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanShop);
	}
	public on_clanMerchantBuy(args: any): void{
		// console.log("on_clanMerchantBuy==============神秘商人 购买");
		// console.log(args);
		this.insertItems(args.itemInserts);
	}
	public on_clanMerchantBargain(args: any): void{
		// console.log("on_clanMerchantBargain==============神秘商人 砍价");
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanMerchant);
	}
	public on_clanEvolveSpeedUp(args: any): void{
		// console.log("on_clanEvolveSpeedUp==============助力鱼塘");
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanTaskEvolve);
	}
	public on_clanClaimActive(args: any): void{
		// console.log("on_clanClaimActive==============领取活跃奖励");
		// console.log(args);
		this.insertbonusesResult(args.claimReward);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanTaskGet);
	}
	public on_clanDuelClaimReward(args: any): void{
		// console.log("clanDuelClaimReward==============禁地领取奖励");
		// console.log(args);
		this.insertbonusesResult(args.claimReward);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanBattleReward);
	}
	public on_clanClaimRecharge(args: any): void{
		// console.log("clanClaimRecharge==============领取帮派充值奖励");
		// console.log(args);
		this.insertbonusesResult(args.claimReward);
	}
	
	
	public env_onClanInfoChange(args: any): void{
		// console.log("=============帮派信息变动=============");
		// console.log(args);
		let calnData = this.fullInfo.clan
		calnData.clanInfo = args.clanInfo
	}
	public env_onClanMemberChange(args: any): void{
		// console.log("=============帮派成员变动=============");
		// console.log(args);
		let isAdd = true
		let calnData = this.fullInfo.clan
		if (calnData.clanMember) {
			for (let i = 0; i < calnData.clanMember.length; i++) {
				let item = calnData.clanMember[i];
				if (item.playerId == args.clanMember.playerId) {
					calnData.clanMember[i] = args.clanMember
					isAdd = false
					break
				}
			}
			if (isAdd) {
				calnData.clanMember.push(args.clanMember)
			}
			if (calnData.myselfInfo.playerId == args.clanMember.playerId) {
				calnData.myselfInfo = args.clanMember
			}
		}
	}
	public env_onClanApplyChange(args: any): void{
		// console.log("=============帮派申请变动=============");
		// console.log(args);
		let calnData = this.fullInfo.clan
		calnData.clanApply = args.clanApply
	}

	public env_onClanApplyAdd(args: any): void{
		// console.log("=============帮派申请新增=============");
		// console.log(args);
		let calnData = this.fullInfo.clan
		calnData.clanApply.push(args.clanApply)
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanApply);
	}

	public env_onClanApplyRemove(args: any): void{
		// console.log("=============帮派申请移除=============");
		// console.log(args);
		let calnData = this.fullInfo.clan
		let clanApply = calnData.clanApply
		for (let i = 0; i < clanApply.length; i++) {
			const element = clanApply[i];
			if (element.playerId == args.playerId) {
				calnData.clanApply.splice(i, 1)
			}
		}
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanApply);
	}
	public env_onClanLogAdd(args: any): void{
		// console.log("=============帮派动态添加=============");
		// console.log(args);
		let calnData = this.fullInfo.clan
		if (calnData.clanLog) {
			calnData.clanLog.push(args.clanLog)
		}else{
			calnData.clanLog=[]
			calnData.clanLog.push(args.clanLog)
		}
	}
	public env_onClanBuyChange(args: any): void{
		// console.log("=============帮派购买信息变动=============");
		// console.log(args);
		let calnData = this.fullInfo.clan
		let clanBuy = calnData.clanBuy 
		// calnData.clanBuy = args.clanBuy
		for (let i = 0; i < clanBuy.length; i++) {
			const element = clanBuy[i];
			if (element.goodsId == args.clanBuy.goodsId) {
				clanBuy[i] = args.clanBuy
				return
			}
		}
		clanBuy.push(args.clanBuy)
	}
	public env_onClanRechargeAdd(args: any): void{
		// console.log("=============帮派充值新增=============");
		// console.log(args);
		let calnData = this.fullInfo.clan
		let clanRecharge = calnData.clanRecharge 
		// calnData.clanBuy = args.clanBuy
		if (clanRecharge) {
			for (let i = 0; i < clanRecharge.length; i++) {
				const element = clanRecharge[i];
				if (element.playerId == args.clanRecharge.playerId) {
					clanRecharge[i] = args.clanRecharge
					return
				}
			}
		}else{
			clanRecharge = []
		}
		clanRecharge.push(args.clanRecharge)
		// console.log(clanRecharge);
		
	}
	
	public env_onKicked(args: any): void{
		// console.log("=============被踢出帮派=============");
		// console.log(args);
		let calnData = this.fullInfo.clan
		calnData = {}
	}
	public env_onClanDuelLogClean(args: any): void{
		// console.log("=============帮派禁地挑战动态清空=============");
		// console.log(args);
	}
	public env_onDuelBuffAdd(args: any): void{
		// console.log("=============布阵=============");
		// console.log(args);
	}
	public env_onMerchantCreate(args: any): void{
		// console.log("=============神秘商人创建=============");
		// console.log(args);
		let calnData = this.fullInfo.clan
		calnData.merchantGoodsId = args.merchantGoodsId
		calnData.merchantTime = args.merchantTime
		ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyClan, 0, {});
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanMerchant);
	}
	public env_onClanEvolveHelpReceive(args: any): void{
		// console.log("=============收到协助请求=============");
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanTaskEvolve);
	}

	public env_onClanDailyRefresh(args: any): void{
		// console.log("=============帮派日常刷新=============");
		// console.log(args);
		// // PointRedData.getInstance().updatePointChild(PointRedType.LyClanTaskEvolve);
		// let calnData = this.fullInfo.clan
		// let	clanInfo = calnData.clanInfo
		// let	clanMember = calnData.clanMember
		// let	myselfInfo = calnData.myselfInfo
		// clanInfo.duelMonsterId = args.duelMonsterId
		// clanInfo.duelMonsterHP = args.duelMonsterHP
		// clanInfo.duelRewardNum = args.duelRewardNum
		// clanInfo.duelBuffCount = args.duelBuffCount
		// clanInfo.dailyActiveScore = args.dailyActiveScore
		// myselfInfo.dailyPoint = args.dailyPoint
		// myselfInfo.dailyActiveNode = args.dailyActiveNode
		// myselfInfo.dailyDuelBuffTime = args.dailyDuelBuffTime
		// myselfInfo.dailyDuelAvailableCount = args.dailyDuelAvailableCount
		// myselfInfo.dailyDuelDamage = args.dailyDuelDamage
		// myselfInfo.dailyDuelRewardNum = args.dailyDuelRewardNum
		// myselfInfo.dailyDuelMonsterReward = args.dailyDuelMonsterReward
		// for (let i = 0; i < clanMember.length; i++) {
		// 	let item = clanMember[i];
		// 	if (item.playerId == myselfInfo.playerId) {
		// 		clanMember[i].dailyPoint = args.dailyPoint
		// 		clanMember[i].dailyActiveNode = args.dailyActiveNode
		// 		clanMember[i].dailyDuelBuffTime = args.dailyDuelBuffTime
		// 		clanMember[i].dailyDuelAvailableCount = args.dailyDuelAvailableCount
		// 		clanMember[i].dailyDuelDamage = args.dailyDuelDamage
		// 		clanMember[i].dailyDuelRewardNum = args.dailyDuelRewardNum
		// 		clanMember[i].dailyDuelMonsterReward = args.dailyDuelMonsterReward
		// 	}
		// }
		
		// PointRedData.getInstance().updatePointChild(PointRedType.LyClanApply);
		// PointRedData.getInstance().updatePointChild(PointRedType.LyClanShop);
		// PointRedData.getInstance().updatePointChild(PointRedType.LyClanTaskGet);
		// PointRedData.getInstance().updatePointChild(PointRedType.LyClanTaskEvolve);
		// PointRedData.getInstance().updatePointChild(PointRedType.LyClanBattleDuel);
		// PointRedData.getInstance().updatePointChild(PointRedType.LyClanBattleReward);
		// PointRedData.getInstance().updatePointChild(PointRedType.LyClanBattleTask);
		// PointRedData.getInstance().updatePointChild(PointRedType.LyClanMerchant);
	}
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$clanSoloProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_clanSoloGetInfo(args: any): void{
		this.fullInfo.clanSoloPlayer = args;
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanSolo);
	}
	public on_clanSoloGoodsBuy(args: any): void{
		let	clanSoloMyselfInfo = this.fullInfo.clanSoloPlayer.clanSoloMyselfInfo
		clanSoloMyselfInfo.prestige = args.prestige
		this.fullInfo.clanSoloPlayer.clanSoloBuyGoods = args.clanSoloBuyGoods
		this.insertItems(args.itemInserts);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanSoloShop);
	}
	public on_clanSoloFightMatch(args: any): void{
		let clanSoloPlayer =this.fullInfo.clanSoloPlayer
		let	clanSoloMyselfInfo = clanSoloPlayer.clanSoloMyselfInfo
		let	myselfClanInfo = clanSoloPlayer.myselfClanInfo
		clanSoloMyselfInfo.physical = args.physical
		clanSoloMyselfInfo.nextPhysicalRecoverTime = args.nextPhysicalRecoverTime
		clanSoloMyselfInfo.energy = args.energy
		clanSoloMyselfInfo.fightHP = args.fightHP
		clanSoloMyselfInfo.isFighting = args.isFighting
		clanSoloMyselfInfo.combatPower = args.combatPower
		clanSoloMyselfInfo.buffId = args.buffId
		clanSoloMyselfInfo.onceWinCount = args.onceWinCount
		clanSoloMyselfInfo.winScoreChange = 0
		clanSoloMyselfInfo.fightCount = args.fightCount

		clanSoloPlayer.opponentClanInfo = args.opponentClanInfo
		clanSoloPlayer.opponentPlayers = args.opponentPlayers
		
		myselfClanInfo.fightCount = args.clanFightCount
		// this.insertItems(args.itemInserts);
		this.removeItems(args.itemRemoves)
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanSoloTask);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanSoloPhysical);
	}
	public on_clanSoloBuyBuff(args: any,sarg: any): void{
		let	clanSoloMyselfInfo = this.fullInfo.clanSoloPlayer.clanSoloMyselfInfo
		clanSoloMyselfInfo.fightHP = args.fightHP
		clanSoloMyselfInfo.fightHPMax = args.fightHPMax
		clanSoloMyselfInfo.fightAttrs = args.fightAttrs
		clanSoloMyselfInfo.combatPower = args.combatPower
		clanSoloMyselfInfo.buffId = sarg.buffId
		this.insertItems(args.itemInserts);
		// UtilsUI.showMsgPower(String(args.combatPower-args.combatPowerChange), String(args.combatPower));
	}
	public on_clanSoloFight(args: any): void{
		// UtilsUI.showMsgPower(String(args.combatPower-args.combatPowerChange), String(args.combatPower));
		let clanSoloPlayer =this.fullInfo.clanSoloPlayer
		let	clanSoloMyselfInfo = clanSoloPlayer.clanSoloMyselfInfo
		clanSoloMyselfInfo.prestige = args.prestige
		clanSoloMyselfInfo.oncePrestige = args.oncePrestige
		clanSoloMyselfInfo.passportLevel = args.passportLevel
		clanSoloMyselfInfo.winCount = args.winCount
		clanSoloMyselfInfo.onceWinCount = args.onceWinCount
		clanSoloMyselfInfo.energy = args.energy
		clanSoloMyselfInfo.fightHP = args.fightHP
		clanSoloMyselfInfo.fightHPMax = args.fightHPMax
		clanSoloMyselfInfo.fightAttrs = args.fightAttrs
		clanSoloMyselfInfo.combatPower = args.combatPower
		clanSoloMyselfInfo.isFighting = args.isFighting
		clanSoloMyselfInfo.combatPower = args.combatPower
		clanSoloMyselfInfo.winScoreChange = args.winScoreChange
		clanSoloMyselfInfo.score = args.playerScore
		clanSoloMyselfInfo.rankOf = args.playerRankOf
		let	myselfClanInfo = clanSoloPlayer.myselfClanInfo
		myselfClanInfo.score = args.clanScore
		myselfClanInfo.rankOf = args.clanRankOf
		// clanSoloPlayer.opponentClanInfo= args.opponentClanInfo
		clanSoloPlayer.opponentPlayers= args.opponentPlayers
		this.insertItems(args.itemInserts);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanSoloPassport);
	}
	public on_clanSoloFinishTask(args: any): void{
		let	clanSoloMyselfInfo = this.fullInfo.clanSoloPlayer.clanSoloMyselfInfo
		if (args.playerTaskCount) {
			clanSoloMyselfInfo.playerTaskCount = args.playerTaskCount
		}
		if (args.clanTaskCount) {
			clanSoloMyselfInfo.clanTaskCount = args.clanTaskCount
		}
		this.insertbonusesResult(args.bonusesResult);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanSoloTask);
	}

	public on_clanSoloGiftBuy(args: any): void{
		this.insertbonusesResult(args.bonusesResult);
		this.fullInfo.clanSoloPlayer.clanSoloBuyGift = args.clanSoloBuyGift
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanSoloGift);
	}

	public on_clanSoloClaimPassportReward(args: any): void{
		this.insertItems(args.itemInserts);
		let	clanSoloMyselfInfo = this.fullInfo.clanSoloPlayer.clanSoloMyselfInfo
		clanSoloMyselfInfo.lowPassportClaimedLevel = args.lowPassportClaimedLevel
		clanSoloMyselfInfo.midPassportClaimedLevel = args.midPassportClaimedLevel
		clanSoloMyselfInfo.highPassportClaimedLevel = args.highPassportClaimedLevel
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanSoloPassport);
	}

	public on_clanSoloLike(args: any): void{
		this.insertItems(args.itemInserts);
		let	clanSoloMyselfInfo = this.fullInfo.clanSoloPlayer.clanSoloMyselfInfo
		clanSoloMyselfInfo.isLiking = true
	}

	public on_clanSoloChallenge(args: any): void{
		this.insertItems(args.itemInserts);
		let clanSoloPlayer =this.fullInfo.clanSoloPlayer
		let	clanSoloMyselfInfo = clanSoloPlayer.clanSoloMyselfInfo
		clanSoloMyselfInfo.buffId = args.buffId
		clanSoloMyselfInfo.fightHP = args.fightHP
		clanSoloMyselfInfo.fightHPMax = args.fightHPMax
		clanSoloMyselfInfo.fightAttrs = args.fightAttrs
		clanSoloMyselfInfo.combatPower = args.combatPower
		clanSoloMyselfInfo.isFighting = args.isFighting
		clanSoloMyselfInfo.onceWinCount = args.onceWinCount
		clanSoloMyselfInfo.fightCount = args.fightCount
		clanSoloMyselfInfo.winScoreChange = 0

		clanSoloMyselfInfo.energy = args.energy
		this.fullInfo.clanSoloPlayer.opponentClanInfo = args.opponentClanInfo
		this.fullInfo.clanSoloPlayer.opponentPlayers = args.opponentPlayers

		let	myselfClanInfo = clanSoloPlayer.myselfClanInfo
		myselfClanInfo.fightCount = args.clanFightCount
		this.removeItems(args.itemRemoves)
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanSoloTask);
	}

	public env_onClanSoloPhysicalChange(args: any): void{
		let	clanSoloMyselfInfo = this.fullInfo.clanSoloPlayer.clanSoloMyselfInfo
		clanSoloMyselfInfo.physical = args.physical
		clanSoloMyselfInfo.nextPhysicalRecoverTime = args.nextPhysicalRecoverTime
	}
	public env_onClanSoloClanFightCountChange(args: any): void{
		let	myselfClanInfo = this.fullInfo.clanSoloPlayer.myselfClanInfo
		myselfClanInfo.fightCount = args.clanFightCount
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanSoloTask);
	}
	public env_onClanSoloPayGift(args: any): void{
		this.insertbonusesResult(args.bonusesResult);
		this.fullInfo.clanSoloPlayer.clanSoloBuyGift = args.clanSoloBuyGift
	}
	public env_onClanSoloPayPassport(args: any): void{
		// this.insertbonusesResult(args.bonusesResult);
		let	clanSoloMyselfInfo = this.fullInfo.clanSoloPlayer.clanSoloMyselfInfo
		clanSoloMyselfInfo.passport = args.passport
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanSoloPassport);
	}

	public env_onClanSoloOpen(args: any): void{
		this.fullInfo.clanSoloOpen = args.clanSoloOpen
		UtilsUI.showEnterGameSend(VarVal.CROSS_SYS_TYPE.CLANSOLO);
	}

	public env_onClanSoloShopRefresh(args: any): void{
		let clanSoloPlayer =this.fullInfo.clanSoloPlayer
		clanSoloPlayer.clanSoloBuyGoods = args.clanSoloBuyGoods
		clanSoloPlayer.clanSoloBuyGift = args.clanSoloBuyGift
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanSoloShop);
		PointRedData.getInstance().updatePointChild(PointRedType.LyClanSoloGift);
	}
	
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$conquestProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_getConquestInfo(args: any): void {
		console.log(args);
		console.log("on_getConquestInfo获取八荒信息---");
		this.fullInfo.conquestPlayer = args;
	}

	public on_conquestEnroll(args: any): void {
		this.fullInfo.conquestPlayer.myInfo.isEnroll = true;
	}

	public on_conquestLeave(args: any, sarg: any): void {
		this.fullInfo.conquestPlayer.features = []
		this.fullInfo.conquestPlayer.playerRange = [];
		this.fullInfo.conquestPlayer.monsterRange = [];
	}


	public on_conquestFinishTask(args: any): void {
		console.log(args);
		console.log("conquestFinishTask-----------");
		this.fullInfo.conquestPlayer.tasks = args.tasks;
		this.fullInfo.conquestPlayer.unclaimedReward = args.unclaimedReward;
		this.insertbonusesResult(args.bonusesResult);
		PointRedData.getInstance().updatePointChild(PointRedType.LyConquestSeekTask);
	}

	public on_conquestEnterScene(args: any): void {
		console.log(args);
		console.log("on_conquestEnterScene八荒进入场景---");
		if (!this.fullInfo.conquestPlayer.features) {
			this.fullInfo.conquestPlayer.features = [];
		}
	}
	public on_conquestClaimFightReward(args: any): void {
		console.log(args);
		console.log("conquestClaimFightReward八荒领取战斗奖励（任务和击败）---");
		this.insertbonusesResult(args.bonusesResult);
		this.fullInfo.conquestPlayer.unclaimedReward=[]
	}		

	public on_conquestClaimRankReward(args: any, sarg: any): void {
		if (sarg.type == 1) {
			this.fullInfo.conquestPlayer.myInfo.claimClanScoreReward = true;
		} else {
			this.fullInfo.conquestPlayer.myInfo.claimPlayerKillReward = true;
		}
		this.insertbonusesResult(args.bonusesResult);
	}

	public env_onConquestOpen(args: any): void {
		this.fullInfo.conquestOpen = args.isOpen;
		UtilsUI.showEnterGameSend(VarVal.CROSS_SYS_TYPE.CONQUSET);
	}

	public env_onConquestPhaseChange(args: any): void {
		console.log(args);
		if (!this.fullInfo.conquestPlayer) { // 数据需要向服务器发请求，可能之前没请求到也可能服务器发错（防错）
			UtilsUI.showEnterGameSend(VarVal.CROSS_SYS_TYPE.CONQUSET);
			return;
		}
		let lastPhase = this.fullInfo.conquestPlayer.activityInfo.phase;

		this.fullInfo.conquestPlayer.activityInfo.phase = args.phase;
		this.fullInfo.conquestPlayer.activityInfo.nextPhaseTime = args.nextPhaseTime;
		this.fullInfo.conquestPlayer.activityInfo.startTime = args.startTime;
		this.fullInfo.conquestPlayer.activityInfo.endTime = args.endTime;
		// this.fullInfo.conquestPlayer.activityInfo.sceneId = args.sceneId;

		if (lastPhase != args.phase) {
			if (args.phase == ConquestState.BATTLE) {
				LyConquestSeekStart.isWaitForOpen = true;
    			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {tryConquestSeek:true});
			} else if (args.phase == ConquestState.CLOSE) {
				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {sendCrossServer:VarVal.CROSS_SYS_TYPE.CONQUSET}); // 移除活动
			} else if (args.phase == ConquestState.READY) {
				UtilsUI.showEnterGameSend(VarVal.CROSS_SYS_TYPE.CONQUSET); // 插入活动
			} else if (args.phase == ConquestState.OVER) {
				UtilsUI.showEnterGameSend(VarVal.CROSS_SYS_TYPE.CONQUSET); // 刷新排行榜奖励红点
			}
		}
	}

	public env_onConquestSceneChange(args: any): void {
		console.log(args);
		console.log("onConquestSceneChange-----------场景变化 延迟 （全区域）");
		if (this.fullInfo.conquestPlayer) {
			this.fullInfo.conquestPlayer.scene = args
		}
	}

	public env_onConquestMyselfChange(args: any): void {
		// console.log(args);
		// console.log("env_onConquestMyselfChange-----------玩家自己变动");
		this.fullInfo.conquestPlayer.myself = args.myself;
	}

	public env_onConquestRangePlayerChange(args: any): void {
		// console.log(args);
		// console.log("env_onConquestRangePlayerChange-----------周围玩家变动");
		console.log(args);
		if (args.change ==1) {
			console.log("env_onConquestRangePlayerChange-----------周围玩家变动：进入区域:"+args.player.id+"x:"+args.player.x+"-y:"+args.player.y);
		}
		else if (args.change == 2) {
			console.log("env_onConquestRangePlayerChange-----------周围玩家变动：离开区域 :"+args.player.id+"x:"+args.player.x+"-y:"+args.player.y);
		}
		if (this.fullInfo.conquestPlayer) {
			let playerRange = this.fullInfo.conquestPlayer.playerRange
			if (!playerRange) {
				playerRange = []
			}
			if (args.change == 1) {
				for (let i = 0; i < playerRange.length; i++) {
					const element = playerRange[i];
					if (element.id == args.player.id) {
						playerRange[i] = args.player
						return
					}
				}
				playerRange.push(args.player)
			} else if (args.change == 2) {
				for (let i = 0; i < playerRange.length; i++) {
					const element = playerRange[i];
					if (element.id == args.player.id) {
						playerRange.splice(i, 1)
						return
					}
				}
			}
		}
	}
	

	public env_onConquestRangeMonsterChange(args: any): void {
		if (args.change ==1) {
		// 	console.log(args);
			// console.log("env_onConquestRangeMonsterChange-----------周围怪物变动：进入区域:"+args.monster.monsterForkId+"x:"+args.monster.x+"-y:"+args.monster.y);
		}else if (args.change == 2) {
		// 	console.log(args);
			console.log("env_onConquestRangeMonsterChange-----------周围怪物变动：离开区域 :"+args.monster.monsterForkId+"x:"+args.monster.x+"-y:"+args.monster.y);
		}
		if (this.fullInfo.conquestPlayer) {
			let monsterRange = this.fullInfo.conquestPlayer.monsterRange
			if (!monsterRange) {
				monsterRange = []
			}
			if (args.change == 1) {
				for (let i = 0; i < monsterRange.length; i++) {
					const element = monsterRange[i];
					if (element.monsterForkId == args.monster.monsterForkId) {
						monsterRange[i] = args.monster
						return
					}
				}
				monsterRange.push(args.monster)
			} else if (args.change == 2) {
				for (let i = 0; i < monsterRange.length; i++) {
					const element = monsterRange[i];
					if (element.monsterForkId == args.monster.monsterForkId) {
						monsterRange.splice(i, 1)
						return
					}
				}
			}
		}
	}

	public env_onConquestKillChange(args: any): void {
		console.log(args);
		console.log("onConquestKillChange-----------击杀变化");
		let myself=	this.fullInfo.conquestPlayer.myself 
		if (myself.id == args.attacker) {
			myself.streakKill = args.streakKill
			myself.totalKill = args.totalKill

			let myInfo=	this.fullInfo.conquestPlayer.myInfo 
			myInfo.streakKill = args.streakKill
			myInfo.totalKill = args.totalKill
		}
		//  else{
		// 	let conquestPlayer = this.fullInfo.conquestPlayer
		// 	for (let i = 0; i < conquestPlayer.length; i++) {
		// 		const element = conquestPlayer[i];
		// 		if (element.id == args.attacker) {
		// 			element.streakKill == args.streakKill
		// 			element.totalKill == args.totalKill
		// 		} 
		// 	}
		// }
	}

	public env_onConquestTaskChange(args: any): void {
		console.log(args);
		console.log("onConquestTaskChange-----------任务变化");
		let __tasks:Array<any> = this.fullInfo.conquestPlayer.tasks;
		for (let i = 0; i < __tasks.length; i++) {
			if (__tasks[i].taskId == args.taskId) {
				__tasks[i] = args;
				break;
			}
		}
		PointRedData.getInstance().updatePointChild(PointRedType.LyConquestSeekTask);
	}

	public env_onConquestPlayerFeatureChange(args: any): void {
		console.log(args);
		console.log("onConquestPlayerFeatureChange-----------玩家信息变动");
		if (!this.fullInfo.conquestPlayer.features) {
			this.fullInfo.conquestPlayer.features = []
		}
		if (this.fullInfo.conquestPlayer.features.length > 0) {
			for (let i = 0; i < this.fullInfo.conquestPlayer.features.length; i++) {
				let item = this.fullInfo.conquestPlayer.features[i]
				if (item.playerId == args.features.playerId) {
					return
				}
			}
			for (let i = 0; i < args.features.length; i++) {
				const element = args.features[i];
				this.fullInfo.conquestPlayer.features.push(element)
			}
		}else{
			this.fullInfo.conquestPlayer.features = args.features
		}
	}

	public env_onConquestPlayerRewardChange(args: any): void {
		console.log(args);
		console.log("onConquestPlayerRewardChange-----------玩家奖励变动");
		this.fullInfo.conquestPlayer.unclaimedReward = args.unclaimedReward
	}

	public env_onConquestPlayerKillRankChange(args: any): void {
		console.log(args);
		console.log("onConquestPlayerKillRankChange-----------玩家击杀排名变化");
		let myInfo=	this.fullInfo.conquestPlayer.myInfo 
		myInfo.playerKillRankOf = args.rankOf
		myInfo.totalKill = args.totalKill
	}

	public env_onConquestClanScoreRankChange(args: any): void {
		console.log(args);
		console.log("onConquestClanScoreRankChange-----------帮派积分排名变化");
		let myClanInfo=	this.fullInfo.conquestPlayer.myClanInfo 
		myClanInfo.rankOf = args.rankOf
		myClanInfo.score = args.score
	}

	public on_conquestLiking(args: any): void {
		this.fullInfo.conquestPlayer.myInfo.isLiking = true;
		PointRedData.getInstance().updatePointChild(PointRedType.LyConquestSeekWiner);
	}
	// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$taskProto$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	public on_takeTaskBonuses(args: any): void{
		let taskInfo: any = LocaleData.getTaskRoot(args.id)
		this.insertbonusesResult(args.bonusesResult);
		if (taskInfo.type == VarVal.taskType.main) {
			if (args.id == this.fullInfo.mainTaskId) {
				this.fullInfo.mainState = 3;
				ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {UpDataTask:true});
			}
		} else if (taskInfo.type == VarVal.taskType.rebate) {
			if (args.id == this.fullInfo.rebateTaskId) {
				this.fullInfo.rebateState = 3;
			}
		} else if (taskInfo.type == VarVal.taskType.clan) {
			// let calnData = this.fullInfo.clan
			// if (args.clanExp && args.clanExp != 0) {
			// 	calnData.exp += args.clanExp
			// }
			// if (args.clanContribution && args.clanContribution != 0) {
			// 	for (let i = 0; i < calnData.clanMember.length; i++) {
			// 		const element = calnData.clanMember[i];
			// 		if (element.playerId == this.fullInfo.guid) {
			// 			element.point += args.clanContribution
			// 			break
			// 		}
			// 	}
			// 	calnData.myselfInfo.point += args.clanContribution
			// }
			// if (args.activeScore && args.activeScore != 0) {
			// 	calnData.dailyActiveScore += args.activeScore
			// }
			PointRedData.getInstance().updatePointChild(PointRedType.LyClanTaskGet);
			PointRedData.getInstance().updatePointChild(PointRedType.LyClanBattleTask);
		} else if(taskInfo.type == VarVal.taskType.break) {
			PointRedData.getInstance().updatePointChild(PointRedType.LyBreakStage);
		}
	}
	public env_taskChanged(args: any): void {
		let _type = String(args.type);
		if (_type == VarVal.taskType.main) {
		if (args.task.id >= this.fullInfo.mainTaskId) { // 现在不会发3已领取的状态，之前出现先发10002的状态1，再发10001的状态3
			this.fullInfo.mainTaskId = args.task.id;
			this.fullInfo.mainState = args.task.state;
			this.fullInfo.mainCount = args.task.count;
			this.fullInfo.finishCount = args.finishCount;
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_UPDATE, LyMainPage, 0, {UpDataTask:true});
		}
		} else if (_type == VarVal.taskType.rebate) {
		if (args.task.id >= this.fullInfo.rebateTaskId) { // 之前出现先发10002的状态1，再发10001的状态3
			this.fullInfo.rebateTaskId = args.task.id;
			this.fullInfo.rebateState = args.task.state;
			this.fullInfo.rebateCount = args.task.count;
			this.fullInfo.rebateFinishCount = args.finishCount;
			PointRedData.getInstance().updatePointChild(PointRedType.LyTreeRebateTask);
		}
		} else {
			let states:Array<any>;
			if (_type == VarVal.taskType.break) {
				states = this.fullInfo.breakTask;
			}else if(_type == VarVal.taskType.xianyuan) {
				states = this.fullInfo.xianyuanTask;
			}else if(_type == VarVal.taskType.clan){
				states = this.fullInfo.factionTask;
			}else if(_type == VarVal.taskType.invite){
				states = this.fullInfo.inviteTask;
			}
			if (states) {
				for (let i = 0; i < states.length; i++) {
					let state = states[i];
					if (state.id == args.task.id) {
						state.state = args.task.state;
						state.count = args.task.count;
						break;
					}
				}
				if (_type == VarVal.taskType.invite) {
					PointRedData.getInstance().updatePointChild(PointRedType.LyFriendInvite);
					// 主界面消失入口，就让他重新刷新的时候自动处理吧。
				} else if(_type == VarVal.taskType.break) {
					PointRedData.getInstance().updatePointChild(PointRedType.LyBreakStage);
				} else if(_type == VarVal.taskType.clan) {
					PointRedData.getInstance().updatePointChild(PointRedType.LyClanTaskGet);
				} else if(_type == VarVal.taskType.xianyuan) {
					PointRedData.getInstance().updatePointChild(PointRedType.LyFairyGift);
				}
			}
		}
	}

	public env_xyTaskResetChanged(args: any): void {
		for (let i = 0; i < this.fullInfo.xianyuanTask.length; i++) {
			this.fullInfo.xianyuanTask[i].state = 1
			this.fullInfo.xianyuanTask[i].count = 0
		}
	}
	
	public env_factionTaskResetChanged(args: any): void {
		for (let i = 0; i < this.fullInfo.factionTask.length; i++) {
			this.fullInfo.factionTask[i].state = 1
			this.fullInfo.factionTask[i].count = 0
		}
	}
	public env_newBreakTaskChanged(args: any): void {
		this.fullInfo.breakTask = args.tasks || [];
	}
	//#################################### 神通灌顶(1000006) ###########################
	public on_takeTheurgyAbhisecaTaskBonuses(args: any): void {
		this.insertbonusesResult(args.bonusesResult);
	}
	public on_takeTheurgyAbhisecaGiftsBonuses(args: any): void {
		this.insertbonusesResult(args.bonusesResult);
	}
	public on_takeTheurgyAbhisecaPumpBonuses(args: any): void {
		this.insertbonusesResult(args.bonusesResult);
	}
	//#################################### 雾隐岛 ###########################
	public on_zoneEventDone(args: any): void {
		this.insertbonusesResult(args.bonusesResult);
	}
	public env_onDomainBattleEvent(args: any): void {
		if (args.domianBattleInfo.isLeaveMaxZone == 1) {
			ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyBrumeIsleDown, 0, args.domianBattleInfo);
		}
	}
	public on_domainHelpBatle(args: any): void {
		this.insertbonusesResult(args.bonusesResult);
	}
	public on_getMarkMonsterDieBonuses(args: any): void {
		this.insertbonusesResult(args.bonusesResult);
	}

	public env_onDomainGiftBonuses(args: any): void {
		this.insertbonusesResult(args.bonusesResult);
	}

	public on_takePropertyBonses(args: any): void {
		this.insertbonusesResult(args.bonusesResult);
		this.removeCostResult(args.costResult);
	}

	public on_buyFreeGift(args: any): void {
		if (args.costResult) {
			this.removeCostResult(args.costResult);
		}
		this.insertbonusesResult(args.bonusesResult);
	}

	public on_getDomainGRank(args: any): void {
		if (args.bonusesResult) {
			this.insertbonusesResult(args.bonusesResult);
		}
	}

	public on_domainTakeTaskBonuses(args: any): void {
		if (args.bonusesResult) {
			this.insertbonusesResult(args.bonusesResult);
		}
	}

	public on_getDomainPRank(args: any): void {
		if (args.bonusesResult) {
			this.insertbonusesResult(args.bonusesResult);
		}
	}
	// ##################################################以下是获取数据接口区域##################################################
	/**
     * 获得服务器开服时间。
     */
	public getServerCreateMilliseconds(): number {
		return UtilsTool.getUnixTimeMilliseconds(this.fullInfo.openTime);
	}

	/**
     * 获得服务器开服天数。
     */
	public getServerCreateDay(): number {
		if (this.fullInfo.openDay) {
			return this.fullInfo.openDay;
		} else {
			let openday = Math.ceil((this.getServerTime() * 1000 - UtilsTool.getStartDateTime(this.getServerCreateMilliseconds())) / UtilsTool.ONEDAY_MILLISECONDS);
			return openday;
		}
	}

	/**
     * 获得玩家完整信息。
     * */
	public getPlayerFullInfo(): any {
		return this.fullInfo;
	}
	
	/**
     * 生成装备的显示实例结构。
     * */
	public newEquipShowInst(id:string | number): any {
		id = String(id);
		let info:any = {};
		let equips:Array<any> = this.fullInfo.battleEquips;
		for (let i = 0; i < equips.length; i++) {
			let equip = equips[i];
            if (id == equip.slot) {
				info.eid = equip.eid;
				info.cid = equip.cid;
				info.slot = equip.slot;
				info.quality = equip.quality;
				info.level = equip.level;
				info.attrs = equip.attrs;
				break;
			}
		}
		return info;
	}

	// 获得附属属性（计算类型）
	public getEntityPlayerAttr(type: number): string {
		return this.fullInfo.playerEntityAttr[type - 1];
	}

	/**
     * 获得全局实例。
     * */
	public getGlobalInst(id: string): any {
		for (let key = 0; key < this.fullInfo.items.length; key++) {
			let itemInst: any = this.fullInfo.items[key];
			if (id == itemInst.id) {
				return itemInst
			}
		}
		for (let key = 0; key < this.fullInfo.elitemonsterInfo.elitemonster.length; key++) {
			let itemInst: any = this.fullInfo.elitemonsterInfo.elitemonster[key];
			if (id == itemInst.id) {
				return itemInst
			}
		}
		for (let key = 0; key < this.fullInfo.elitemonsterInfo.elitemonsterDebris.length; key++) {
			let itemInst: any = this.fullInfo.elitemonsterInfo.elitemonsterDebris[key];
			if (id == itemInst.id) {
				return itemInst
			}
		}
		for (let index = 0; index < this.fullInfo.theurgyInfo.theurgyFrag.length; index++) {
			let itemInst = this.fullInfo.theurgyInfo.theurgyFrag[index];
			if (id == itemInst.id) {
				return itemInst
			}
		}
		for (let key = 0; key < this.fullInfo.theurgyInfo.theurgySeal.length; key++) {
			let itemInst: any = this.fullInfo.theurgyInfo.theurgySeal[key];
			if (id == itemInst.id) {
				return itemInst
			}
		}
	}

	/**
     * 获得对应protoId物品实例（道具、装备、鱼）。（只返回最先找到的实例）
     * */
	 public getItemInstByProtoId(protoId: string|number): any {
		let _protoId:number = Number(protoId);
		let item:any;
		if (LocaleData.isItem(String(_protoId))) {
			item = this.fullInfo.items;
		}
		for (let key = 0; key < item.length; key++) {
			let itemInst: any = item[key];
			if (itemInst.protoId == _protoId) {
				return itemInst;
			}
		}
	}
	/**
     * 获得上阵宠物
     * */
	 public getProtoIdByItemInstId(): any {
		let item:any = this.fullInfo.petModuleInfo.pet
		for (let key = 0; key < item.length; key++) {
			let itemInst: any = item[key];
			if (itemInst.id == this.fullInfo.base.summonPet) {
				return itemInst;
			}
		}
	}
	
	/**
     * 获得所有对应品质的门客碎片实例
     * */
	public getEliteItemInstsByQuality(quality:string | number): Array<any> {
		quality = String(quality);
		let temps = new Array<any>();
		for (let index = 0; index < this.fullInfo.elitemonsterInfo.elitemonsterDebris.length; index++) {
			let inst = this.fullInfo.elitemonsterInfo.elitemonsterDebris[index];
			if (inst.proto.quality == quality) {
				temps.push(inst);
			}
		}
		return temps;
	}

	/**
     * 获得对应protoId物品数量。
     * */
	public getItemCountByProtoId(protoId: string|number): number {
		protoId = Number(protoId);
		let count: number = 0;
		let items:Array<any> = this.fullInfo.items;
		for(let i = 0; i < items.length; i++) {
			if (items[i].protoId == protoId) {
				count += items[i].count;
			}
		}
		return count;
	}

	/**
     * 通过proto获取物品、装备、精怪、宠物、神通等数量 0未拥有
     * */
	public getItemCount(protoId: string|number): number{
		//物品
		if (LocaleData.isItem(protoId)) {
			return this.getItemCountByProtoId(protoId) 
		}
		//装备
		else if (LocaleData.isEquip(protoId)) {
			return 0
		}
		//精怪
		else if(LocaleData.isEliteMonster(protoId)){
			if (this.getLyEliteMonsterByProto(protoId) != null) {
				return 1
			}else 
			{ 
				return 0 
			}
		}else if(LocaleData.isEliteMonsterDebris(protoId)){
			let elitemonsterDebri = this.getEliteMonsterDebByProtoId(protoId)
			if (elitemonsterDebri != null) {
				return elitemonsterDebri.count
			}else 
			{ 
				return 0 
			}
		}
		//宠物
		else if(LocaleData.isPet(protoId)){
			// return false
			return GameServerData.getInstance().getPetNum(protoId)
		}
		//神通
		else if(LocaleData.isTheurgySeal(protoId)){
			if (this.getTheurgyByProto(protoId) != null) {
				return 1
			}else {
				return 0
			}
		}
	}


	/**
     * 获得对应货币数量。
     * */
	public getValueTypeCount(bonuseType: string): number {
		let count:number = 0;
		let base = this.fullInfo.base;
		if (bonuseType == VarVal.bonusType.money) {
			count = base.money;
		} else if (bonuseType == VarVal.bonusType.physical) {
			count = base.physical;
		} else if (bonuseType == VarVal.bonusType.chance) {
			count = base.chance;
		} else if (bonuseType == VarVal.bonusType.stone) {
			count = base.stone;
		} else if (bonuseType == VarVal.bonusType.exp) {
			count = base.exp;
		} else if (bonuseType == VarVal.bonusType.opencelescore) {
			let dynamicParams = this.getDynamicActivityParamsByClasZ(VarVal.ACTIVITY_CLASZ.OPENCELEBRATION);
			if (dynamicParams[0]) {
				let activityState = GameServerData.getInstance().getActivityState(dynamicParams[0].id);
				if (activityState && activityState.data) {
					count = activityState.data.activityOpenCelebration.score;
				}
			}
		} else if (bonuseType == VarVal.bonusType.qunyin) {
			let activityState = GameServerData.getInstance().getActivityState(VarVal.ACTIVITY_ID.QUNYIN);
			if (activityState && activityState.data) {
				count = activityState.data.activityQunYin.score;
			}
		} else if(bonuseType == VarVal.bonusType.clanPoint){
			let clanInfo = this.fullInfo.clan;
			if (clanInfo && clanInfo.myselfInfo) {
				count = clanInfo.myselfInfo.point;
			}
		} else if(bonuseType == VarVal.bonusType.clanGlory){
			let clanInfo = this.fullInfo.clan;
			if (clanInfo && clanInfo.myselfInfo) {
				count = clanInfo.myselfInfo.glory;
			}
		} else if(bonuseType == VarVal.bonusType.clanRare){
			let clanInfo = this.fullInfo.clan;
			if (clanInfo && clanInfo.myselfInfo) {
				count = clanInfo.myselfInfo.rare;
			}
		} else if(bonuseType == VarVal.bonusType.clansolo){
			let clanSoloPlayer = this.fullInfo.clanSoloPlayer;
			if (clanSoloPlayer && clanSoloPlayer.clanSoloMyselfInfo && clanSoloPlayer.clanSoloMyselfInfo.prestige) {
				count = clanSoloPlayer.clanSoloMyselfInfo.prestige;
			}
		} else if(bonuseType == VarVal.bonusType.grabCityTiger
			|| VarVal.bonusType.grabCitysw
			|| VarVal.bonusType.grabCityDonate
			|| VarVal.bonusType.grabCityDraw) {
			if (this.fullInfo.grabCityPlayer && this.fullInfo.grabCityPlayer.playerInfo) {
				let playerInfo = this.fullInfo.grabCityPlayer.playerInfo;
				if (bonuseType == VarVal.bonusType.grabCityTiger) {
					count = playerInfo.activityItem[0];
				} else if (bonuseType == VarVal.bonusType.grabCitysw) {
					count = playerInfo.activityItem[1];
				} else if (bonuseType == VarVal.bonusType.grabCityDonate) {
					count = playerInfo.activityItem[2];
				} else if (bonuseType == VarVal.bonusType.grabCityDraw) {
					count = playerInfo.activityItem[3];
				}
			}
		}
		return count;
	}

	/**
	 * 获取拥有的兽友。
	 */
	public getCompanionData(protoId: number|string): any {
		protoId = Number(protoId);
		let __companions = this.fullInfo.companionData.companions;
		for (let i = 0; i < __companions.length; i++) {
			if (__companions[i].companionId == protoId) {
				return __companions[i];
			}
		}
	}

	/**
	 * 获取活动状态
	 */
	public getActivityState(activityId: number|string): any {
		return this.fullInfo.activityStates[String(activityId)];
	}

	/**
	 * 获取全局活动状态
	 */
	public getActivityGlobalState(activityId: number|string): any {
		return this.fullInfo.activityGlobalStates[String(activityId)];
	}

	/**
	 * 获取活动开启状态
	 */
	public getActivityOpenState(activityId: number|string) : any {
		return this.fullInfo.activityOpenStates[String(activityId)];
	}

	/**
	 * 获取运营活动数据（运营活动id就是activityId，clasz是类型，例：clasz=1000001，id=1001001=activityId）
	 */
	public getDynamicActivityParams(): any {
		return this.fullInfo.dynamicActivityParams;
	}

	/**
	 * 获取运营活动数据（运营活动id就是activityId，clasz是类型，例：clasz=1000001，id=1001001=activityId）
	 */
	public getDynamicActivityParam(activityId: number|string): any {
		return this.fullInfo.dynamicActivityParams[String(activityId)];
	}

	/**
	 * 获取运营活动类型组数据（运营活动id就是activityId，clasz是类型，例：clasz=1000001，id=1001001=activityId）
	 */
	 public getDynamicActivityParamsByClasZ(_clasz: number|string): Array<any> {
		_clasz = Number(_clasz);
		let temps = new Array<any>();
		let dynamicParams = this.fullInfo.dynamicActivityParams;
		for (let id in dynamicParams) {
			if (dynamicParams[id].clasz == _clasz) {
				temps.push(dynamicParams[id]);
			}
		}
		return temps;
	}

	/**
     * 系统开启数据。
     * */
	public getActivationSysAll(): Array<any> {
		return this.fullInfo.activation.sys;
	}

	/**
     * 是否系统开启。
     * */
	public getActivationSys(id: string | number): any {
		id = Number(id);
		let _sys:Array<any> = this.fullInfo.activation.sys;
		for (let i = 0; i < _sys.length; i++) {
			if (_sys[i].id == id) {
				return _sys[i];
			}
		}
		return null;
	}

	/**
     * 是否系统开启。
     * */
	public isActivationSys(id: string | number): boolean {
		id = Number(id);
		let _sys:Array<any> = this.fullInfo.activation.sys;
		for (let i = 0; i < _sys.length; i++) {
			if (_sys[i].id == id) {
				return (_sys[i].take != 0);
			}
		}
		return false;
	}

	/**
     * 获得系统开启的第一个未完成引导。
     * */
	public getActivationSysGuide(): any {
		let openSysItem:any;
		let _sys:Array<any> = this.fullInfo.activation.sys;
		for (let i = 0; i < _sys.length; i++) { // 可以无顺序？其实无所谓
			if (_sys[i].take != 0 && _sys[i].finish == 0) { // 是否未完成？
				let item = LocaleData.getActivation(_sys[i].id);
				if (item) { // 如果没有则是主线任务引导。
					// desc&guideId判断功能弹窗后是否有引导。
					if (item.desc.length > 1 || item.guideId.length > 0) {
						openSysItem = item;
						break;
					}
				}
			}
		}
		return openSysItem;
	}

	/**
     * 是否该系统未完成引导。
     * */
	public isActivationSysGuide(actiId:number | string): boolean {
		actiId = Number(actiId);
		let _sys:Array<any> = this.fullInfo.activation.sys;
		for (let i = 0; i < _sys.length; i++) { // 可以无顺序？其实无所谓
			if (_sys[i].id == actiId) {
				if (_sys[i].finish == 0) { // 是否未完成？
					return true;
				} else {
					return false;
				}
			}
		}
		return false;
	}

	/**
     * 因提交引导关系，网络延迟，先预设引导完成。
     * */
	public setVirGuidesFinish(id: string | number, isFinish:boolean): void {
		id = Number(id);
		let _sys:Array<any> = this.fullInfo.activation.sys;
		for (let i = 0; i < _sys.length; i++) {
			if (_sys[i].id == id) {
				_sys[i].finish = isFinish ? 1 : 0;
				break;
			}
		}
	}

	/**
     * 邮件排序
     * */
	private sortMail(mail1, mail2): number {
		return mail1.createTime - mail2.createTime;
	}

	/**
	 * 获取所有邮件
	 */
	public getMails(): any {
		return this.fullInfo.mails
	}

	public getItems(): any{
		return this.fullInfo.items;
	}

	/**
	 * 是否在自己黑名单。
	 */
	public isPlayerBlacklist(playerId:string):boolean{
        let blacklist = this.fullInfo.blacklist;
        if (blacklist) {
            for (let i = 0; i < blacklist.length; i++) {
                const element = blacklist[i];
                if (element.guid == playerId) {
                    return true;
                }
            }
        }
        return false;
    }

	/**
	 * 抽取首条跑马灯数据。
	 */
	public getInsertNotice(): any {
		let datas:Array<any> = this.fullInfo.notice;
		if (datas.length > 0) {
			return datas.shift();
		}
	}

	/**
	 * 金手指数据。
	 */
	public getGoldFingerInfo(): any {
		return this.fullInfo.goldFinger;
	}

	public getGoldFingerLevelItemCount(type:string): number {
		let num = this.fullInfo.goldFinger.param[Number(type) - 1];
		return num ? num : 0;
	}

	public getGoldFingerRecord(id:number | string):any {
		id = Number(id);
        let ids:Array<any> = this.fullInfo.goldFinger.ids;
		for (let i = 0; i < ids.length; i++) {
			if (id == ids[i].id) {
				return ids[i];
			}
		}
    }

	private getChatRoomInfos(channelType:CHAT_CHANNELTYPE, activityId?:String | Number): Array<any> {
		activityId = Number(activityId);
		let records:any = this.fullInfo.chatHistory;
		let datas:Array<any>;
		if (channelType == CHAT_CHANNELTYPE.WORLD) {
			if (!records.world) {
				records.world = [];
			}
			datas = records.world;
		} else if (channelType == CHAT_CHANNELTYPE.FACTION) {
			if (!records.laborUnion) {
				records.laborUnion = [];
			}
			datas = records.laborUnion;
		} else if (channelType == CHAT_CHANNELTYPE.ACTIVITY) {
			if (!records.activity) {
				records.activity = [];
			}
			datas = records.activity;
		} else if (channelType == CHAT_CHANNELTYPE.SYSTEM) {
			if (!records.system) {
				records.system = [];
			}
			datas = records.system;
		} else if (channelType == CHAT_CHANNELTYPE.PLAYER) {
			if (!records.private) {
				records.private = [];
			}
			datas = records.private;
		}
		return datas;
	}

	/**
	 * 获取聊天消息。
	 */
	public getChatRoomMsgs(channelType:CHAT_CHANNELTYPE, activityId?:String | Number): Array<any> {
		let datasUsed = Array<any>();
		let datas:Array<any> = this.getChatRoomInfos(channelType, activityId);
		if (datas) {
			for (let i = 0; i < datas.length; i++) {
				if (!this.isPlayerBlacklist(datas[i].senderInfo.guid)) {
					datasUsed.push(datas[i]);
				}
			}
		}
		return datasUsed;
	}

	private isChatRoomLimit(limitTimes:Array<number>, sstime:number): boolean {
		if (limitTimes) {
			for (let idx = 0; idx < limitTimes.length; idx++) {
				if (sstime >= limitTimes[idx] && sstime <= limitTimes[idx] + 7200) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 是否被前端禁言（当前发送时间）。
	 */
	public isChatRoomLimitSend(channelType:CHAT_CHANNELTYPE, activityId?:String | Number): any {
		let datas:Array<any> = this.getChatRoomInfos(channelType, activityId);
		if (datas) {
			let ret:any;
			let limitTimes:Array<number>;
			let selfId:string = this.fullInfo.base.guid;
			for (let iii = 0; iii < datas.length; iii++) {
				let chatData = datas[iii];
				if (chatData.senderInfo.guid == selfId && !LyChatRoom.isChatContentEmoji(chatData.content)) { // 自己发言的检测，不含表情。
					if (!this.isChatRoomLimit(limitTimes, chatData.time)) { // 限制中不检测，限制中的内容都是虚拟内容，不经过服务器。
						let sameCount:number = 0;
						for (let jjj = iii-1; jjj >= 0; jjj--) {
							let data = datas[jjj];
							if (chatData.time - data.time <= 300) { // 本消息前5分钟内、相同内容
								if (data.senderInfo.guid == selfId && data.content == chatData.content) {
									sameCount++;
									if (sameCount >= 2) { // 前面有2条相同
										ret = chatData;
										if (!limitTimes) {
											limitTimes = [];
										}
										limitTimes.push(chatData.time);
										break;
									}
								}
							} else {
								break;
							}
						}
					}
				}
			}
			if (this.isChatRoomLimit(limitTimes, this.getServerTime())) {
				return ret;
			}
		}
	}

	/**
	 * 获取琅琊榜信息。
	 */
	public getPalaceHallData(): any {
		return this.fullInfo.palaceHallData;
	}

	/**
	 * 获取琅琊榜商店道具是否购买。
	 */
	public getPalaceShopIsBuy(id:string):boolean {
        let __Goods:Array<string> = this.fullInfo.palaceBuyGoods;
        for (let i = 0; i < __Goods.length; i++) {
            if (__Goods[i] == id) {
                return true;
            }
        }
        return false;
    }

	/**
	 * 获取琅琊榜某宫殿入住玩家。
	 */
	public getPalaceInfos(palaceId:string | number): Array<any> {
		palaceId = Number(palaceId);
		let temps = new Array<any>();
		let __palace = this.fullInfo.palaceHallData;
		if (__palace) {
			for (let i = 0; i < __palace.palaceInfo.length; i++) {
				if (__palace.palaceInfo[i].palaceId == palaceId) {
					temps.push(__palace.palaceInfo[i]);
				}
			}
		}
		// 由大到小
		temps.sort((itemA, itemB) => {
			return itemB.startTime - itemA.startTime;
		})
		return temps;
	}

	/**
	 * 琅琊榜是否可点赞（0未开放1可点赞2已点赞）。
	 */
	public getSelfPalaceLike(palaceId:string | number): number {
		let __palace = this.fullInfo.palaceHallData;
		if (__palace) {
			if (palaceId) { // 宫殿内点赞
				palaceId = String(palaceId);
				let isHit = false;
				let palace:Array<string> = __palace.likeInfo.palace;
				for (let i = 0; i < palace.length; i++) {
					if (palaceId == palace[i]) {
						isHit = true;
						break;
					}
				}
				if (isHit) { // 此宫殿已点赞
					return 2;
				} else {
					let infos = this.getPalaceInfos(palaceId);
					return infos.length > 0 ? 1 : 0;
				}
			} else { // 大厅点赞
				if (__palace.likeInfo.daily) {
					return 2;
				} else {
					return 1;
				}
			}
		} else {
			return 0;
		}
	}

	/**
	 * 是否琅琊榜可赐福（0未入主1可赐福2已赐福）。
	 */
	public getSelfPalaceState(): number {
		let __palace = this.fullInfo.palaceHallData;
		if (__palace) {
			let guid = this.fullInfo.base.guid;
			let isSelfInPalace = false;
			for (let i = 0; i < __palace.palaceInfo.length; i++) {
				if (__palace.palaceInfo[i].playerId == guid) {
					isSelfInPalace = true;
					break;
				}
			}
			if (isSelfInPalace) { // 自己在榜（可以赐福）。
				if (__palace.isGrant) {
					return 2;
				} else {
					return 1;
				}
			} else { // 不在榜
				return 0;
			}
		} else { // 未开启
			return 0;
		}
	}

	/**
	 * 获取琅琊榜被赐福，而未被点赞玩家。
	 */
	public getGrantInfo(isAll?:boolean): any {
		let __palace = this.fullInfo.palaceHallData;
		if (__palace) {
			let temps:Array<any>;
			if (isAll) {
				temps = new Array<any>();
			}
			let grantInfo:Array<any> = __palace.grantInfo;
			let grants:Array<string> = __palace.likeInfo.grant;
			for (let idx = grantInfo.length - 1; idx >= 0; idx--) {
				let info = grantInfo[idx];
				let isLike = false;
				for (let i = 0; i < grants.length; i++) {
					if (grants[i] == info.playerId) {
						isLike = true; // 被点赞过。
						break;
					}
				}
				if (!isLike) {
					if (isAll) {
						temps.push(info);
					} else {
						return info;
					}
				} else { // 删除节省性能
					grantInfo.splice(idx, 1);
				}
			}
			if (isAll) {
				return temps;
			}
		}
	}

	/**
	 * 获取基金状态。
	 */
	public getFundState(payOtherType:string): any {
		let data:any;
		let __funds:any = this.fullInfo.funds;
		if (payOtherType == VarVal.payOtherType.fundxiuwei) {
			if (!__funds.level) {__funds.level = {};}
			data = __funds.level;
		} else if (payOtherType == VarVal.payOtherType.fundstage) {
			if (!__funds.stage) {__funds.stage = {};}
			data = __funds.stage;
		} else if (payOtherType == VarVal.payOtherType.fundxianshu) {
			if (!__funds.evolution) {__funds.evolution = {};}
			data = __funds.evolution;
		} else if (payOtherType == VarVal.payOtherType.fundtower) {
			if (!__funds.tower) {__funds.tower = {};}
			data = __funds.tower;
		} else if (payOtherType == VarVal.payOtherType.fundfabao) {
			if (!__funds.dhama) {__funds.dhama = {};}
			data = __funds.dhama;
		}
		if (data.awardId == undefined) {
			data.awardId = 0;
			data.awardExtraId = 0;
		}
		return data;
	}

	/**
	 * 获取基金等级。
	 */
	public getFundLevel(payOtherType:string): number {
		if (payOtherType == VarVal.payOtherType.fundxiuwei) {
            return this.fullInfo.base.level;
        } else if (payOtherType == VarVal.payOtherType.fundstage) {
            return this.fullInfo.base.curStageLevel;
        } else if (payOtherType == VarVal.payOtherType.fundxianshu) {
            return this.fullInfo.base.evolutionLevel;
        } else if (payOtherType == VarVal.payOtherType.fundtower) {
            let activityState = this.getActivityState(VarVal.ACTIVITY_ID.MONSTOR_TOWER);
            if (activityState && activityState.data) {
                return activityState.data.activityTower.highTier;
            } else {
				return 0;
			}
        } else if (payOtherType == VarVal.payOtherType.fundfabao) {
			return 0;
        }
	}

	public isHaveModule(id): boolean{
		id = Number(id)
		if (id <= this.fullInfo.module.length) {
			return this.fullInfo.module[id - 1] > 0
		}
		return false
	}

	/**
     * 是否有月卡。
     * */
	public isHaveMonthCard(): boolean {
		return (this.fullInfo.monthCard == 1); // 或剩余时间大于0。
	}

	/**
     * 是否有终身卡。
     * */
	public isHaveLifeCard(): boolean {
		return (this.fullInfo.lifeCard == 1);
	}

	/**
     * 是否有购买充值档次。
     * */
	public isHavePayRecharge(id: string | number): boolean {
		id = Number(id);
		let payIdss:Array<number> = this.fullInfo.payIds;
		for (let i = 0; i < payIdss.length; i++) {
			if (payIdss[i] == id) {
				return true;
			}
		}
		return false;
	}

	/**
     * 是否有充值过。
     * */
	public isHavePay(): boolean {
		return this.fullInfo.payIds.length > 0;
	}

	/**
     * 购买礼包记录。
     * */
	public getPayDailyGiftRecord(id: string | number): any {
		id = Number(id);
		let dailyGifts:Array<any> = this.fullInfo.dailyGift;
		for (let i = 0; i < dailyGifts.length; i++) {
			if (dailyGifts[i].id == id) {
				return dailyGifts[i];
			}
		}
	}

	/**
     * 购买自选礼包记录。
     * */
	public getPayDailyGiftChooseRecord(id: string | number): any {
		id = Number(id);
		let opGifts:Array<any> = this.fullInfo.opGift;
		for (let i = 0; i < opGifts.length; i++) {
			if (opGifts[i].id == id) {
				return opGifts[i];
			}
		}
	}

	/**
     * 购买返利礼包记录。
     * */
	public getPayRebateGiftRecord(id: string | number): any {
		id = Number(id);
		let rebateGifts:Array<any> = this.fullInfo.rebateGift;
		for (let i = 0; i < rebateGifts.length; i++) {
			if (rebateGifts[i].id == id) {
				return rebateGifts[i];
			}
		}
	}

	/**
     * 购买限时礼包组记录。
     * */
	public getPayGiftGroupRecord(id: string | number): any {
		id = Number(id);
		let xianyouGroup:Array<any> = this.fullInfo.xianyouGroup;
		for (let i = 0; i < xianyouGroup.length; i++) {
			if (xianyouGroup[i].id == id) {
				return xianyouGroup[i];
			}
		}
	}

	/**
     * 购买七天礼包记录。
     * */
	public getPaySevenGiftGroupRecord(id: string | number): any {
		id = Number(id);
		let __openGift:Array<any> = this.fullInfo.openGift;
		for (let i = 0; i < __openGift.length; i++) {
			if (__openGift[i].id == id) {
				return __openGift[i];
			}
		}
	}

	/**
	 * 是否购买了首充。
	 */
	public isHasFirstPay(): boolean {
		let _first = this.fullInfo.firstPay;
		if (_first) {
			for (let i = 0; i < _first.items.length; i++) {
				if (_first.items[i].hasPay == 1) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 获得首充数据(type=1活动未结束时2有未充值时>2任何数据)。
	 */
	public getFirstPayItems(type:number): Array<any> {
		let _first = this.fullInfo.firstPay;
		if (_first) {
			if (type == 1) {
				if (_first.isLast != 1) {
					return _first.items;
				}
			} else if (type == 2) {
				for (let i = 0; i < _first.items.length; i++) {
					if (_first.items[i].hasPay == 0) {
						return _first.items;
					}
				}
			} else {
				return _first.items;
			}
		}
	}

	/**
	 * 是否已进入（开启）坐骑
	 */
	public isMountOpend(): boolean {
		return (this.fullInfo.mount && this.fullInfo.mount.tid);
	}

	/**
	 * 是否已有帮派。
	 */
	public isClanHas(): boolean {
		if (this.fullInfo.clan.clanInfo && this.fullInfo.clan.clanInfo.guid) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 根据proto获取自身精怪
	 */
	public getLyEliteMonsterByProto(protoId): any {
		protoId = String(protoId)
		for (let index = 0; index < this.fullInfo.elitemonsterInfo.elitemonster.length; index++) {
			let elitemonster = this.fullInfo.elitemonsterInfo.elitemonster[index]
			if (elitemonster.protoId == protoId) {
				return elitemonster
			}
		}
		return null
	}

	public getEliteMonsterById(id): any {
		id = String(id)
		for (let index = 0; index < this.fullInfo.elitemonsterInfo.elitemonster.length; index++) {
			let elitemonster = this.fullInfo.elitemonsterInfo.elitemonster[index]
			if (elitemonster.id == id) {
				return elitemonster
			}
		}
		return null
	}

	public getEliteMonsterDebByProtoId(protoId): any {
		protoId = String(protoId)
		for (let index = 0; index < this.fullInfo.elitemonsterInfo.elitemonsterDebris.length; index++) {
			let elitemonsterDebri = this.fullInfo.elitemonsterInfo.elitemonsterDebris[index]
			if (elitemonsterDebri.protoId == protoId) {
				return elitemonsterDebri
			}
		}
		return null
	}

	/**
	 * 根据proto获取自身神通
	 */
	public getTheurgyByProto(protoId: string|number): any {
		protoId = Number(protoId)
		for (let index = 0; index < this.fullInfo.theurgyInfo.theurgies.length; index++) {
			let theurgiInst = this.fullInfo.theurgyInfo.theurgies[index]
			if (theurgiInst.cfgId == protoId) {
				return theurgiInst
			}
		}
		return null
	}

	/**
	 * 获得斗法数据
	 */
	public getDuelInfo(): any {
		let info = this.fullInfo.duelInfo;
		if (info.rankOf == undefined) {info.rankOf = -1}
		if (info.duelScore == undefined) {info.duelScore = 0}
		if (info.duelRecord == undefined) {info.duelRecord = []}
		if (info.duelList == undefined) {info.duelList = []}
		if (info.ranks == undefined) {info.ranks = []} // 特殊存储；别学
		return info;
	}

	/**
	 * 获得任务状态数据。
	 */
	public getTaskState(_type: string | number): Array<any> {
		_type = String(_type);
		let states:Array<any>;
		if (_type == VarVal.taskType.break) {
			states = this.fullInfo.breakTask;
		}else if(_type == VarVal.taskType.xianyuan) {
			states = this.fullInfo.xianyuanTask;
		}else if(_type == VarVal.taskType.clan){
			states = this.fullInfo.factionTask;
		}else if(_type == VarVal.taskType.invite){
			states = this.fullInfo.inviteTask;
		}
		return states || [];
	}

	/**
	 * 获取广告数据
	*/
	public getAdData(id): any{
		id = Number(id)
		for (let index = 0; index < this.fullInfo.ad.length; index++) {
			let adData = this.fullInfo.ad[index]
			if (adData.adId == id) {
				return adData
			}
		}
		return null
	}

	public getConquestInfo(): any {
		return this.fullInfo.conquestPlayer;
	}

	public getGrabCityPlayer(): any {
		return this.fullInfo.grabCityPlayer;
	}

	/**
	 * 获取攻城战当前玩家自己的信息
	*/
	public getGrabCityClanPlayerInfo(): any {
		if (this.fullInfo.grabCityPlayer && this.fullInfo.grabCityPlayer.clanState) {
			let playerInfo:Array<any> = this.fullInfo.grabCityPlayer.clanState.playerInfo;
			if (playerInfo) {
				let base = this.fullInfo.base;
				for (let i = 0; i < playerInfo.length; i++) {
					let info = playerInfo[i];
					if (info.guid == base.guid) {
						return info;
					}
				}
			}
		}
	}

	/**
	 * 获取该侠侣的数量
	*/
	public getPetNum(protoId: string|number): number{
		protoId = Number(protoId)
		let petNum:number = 0
		for (let index = 0; index < this.fullInfo.petModuleInfo.pet.length; index++) {
			let petData = this.fullInfo.petModuleInfo.pet[index]
			if (petData.protoId == protoId) {
				petNum++
			}
		}
		return petNum
	}

	/**
	 * 获取该侠侣
	*/
	public getPetByProto(protoId: string|number): Array<any>{
		protoId = Number(protoId)
		let petArr = []
		for (let index = 0; index < this.fullInfo.petModuleInfo.pet.length; index++) {
			let petData = this.fullInfo.petModuleInfo.pet[index]
			if (petData.protoId == protoId) {
				petArr.push(petData)
			}
		}
		return petArr
	}

	/**
	 * 获取所有该品质的侠侣，且为原始侠侣。
	*/
	public getPetInstsByQuality(quality: string|number): Array<any>{
		quality = String(quality);
		let temps = new Array<any>();
		for (let index = 0; index < this.fullInfo.petModuleInfo.pet.length; index++) {
			let petInst = this.fullInfo.petModuleInfo.pet[index];
			if (this.fullInfo.base.summonPet != petInst.id && petInst.proto.quality == quality && petInst.level == 1 && petInst.devourLevel == 0) {
				temps.push(petInst);
			}
		}
		return temps;
	}

	public getTheurgyFragNumber(protoId){
        let allFrag = this.fullInfo.theurgyInfo.theurgyFrag
        for (let index = 0; index < allFrag.length; index++) {
            let element = allFrag[index];
            if (element.protoId == protoId) {
                return element.count
            }
        }
        return 0
    }

	/**
     * 获得所有对应品质的神通碎片实例
     * */
	public getTheurgyFragInstsByQuality(quality:string | number): Array<any> {
		quality = String(quality);
		let temps = new Array<any>();
		for (let index = 0; index < this.fullInfo.theurgyInfo.theurgyFrag.length; index++) {
			let inst = this.fullInfo.theurgyInfo.theurgyFrag[index];
			if (inst.proto.quality == quality) {
				temps.push(inst);
			}
		}
		return temps;
	}

	public getPersonalization(arr :Array<number>){
		let needArr = []
        let all = this.fullInfo.personalization
        for (let i = 0; i < arr.length; i++) {
			let type = arr[i];
			for (let index = 0; index < all.length; index++) {
				let element = all[index];
				if (element.type == type) {
					needArr.push(element)
				}
			}
		}
        return needArr
    }

}
