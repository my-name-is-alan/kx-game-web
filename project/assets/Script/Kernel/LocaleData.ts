//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { VarVal } from "../Values/VarVal";
import { GameServerData } from "./GameServerData";
import { PlatformAPI } from "./PlatformAPI";
import { UtilsTool } from "./UtilsTool";
import { BodyPointType, BonuseItem, MonthCardItemType, UtilsUI } from "./UtilsUI";

enum AvatarType {
	PHASE = "1",
	ACTIVITY = "2",
	ELITE = "3",
	PET = "4",
}

export interface ModelShowInfo {
	id:string,
	name:string,
	spine:string,
	skin:string,
	point:BodyPointType,
	thumbnail:string,
	icon:string,
	icon_square:string,
	battleScale:string,
	normalSkill:string
}

export class LocaleData {
	private constructor() { }

	private static itemProtoMap = new Map();

	/**
	 * 1、不能往里写入数据，只能读取！！！
     * 2、返回值为json结构。
	 * 3、获取数组请加下划线前缀"_"，属性不需要加，例如monster._root[0]._item[1].name。
     */
	private static getObject(name: string): any {
		let json: any = PlatformAPI.getResource_Data(name);
		return json;
	}

	/**
	 * 获得扣除或奖励类型的数组。
     */
	public static getCostArray(costStr:string): Array<any> {
		let costs:Array<any> = new Array<any>();
		let blocks:Array<string> = costStr.split(";");
        for (let i = 0; i < blocks.length; i++) {
			let block:Array<string> = blocks[i].split(",");
			costs.push({type:block[0], count:block[1]});
		}
		return costs;
	}

	/**
	 * 获得扣除或奖励类型的消耗或增加值。
     */
	public static getCostArrayCount(costs:Array<any>, attrtype:string): string {
		for (let i = 0; i < costs.length; i++) {
			if (costs[i].type == attrtype) {
                return costs[i].count;
			}
		}
		return "0";
	}

	/**
	 * 是否道具。
     */
	public static isItem(protoId: string | number): boolean {
		return (Number(protoId) >= 100001 && Number(protoId) <= 199999);
	}

	/**
	 * 是否装备。
     */
	public static isEquip(protoId: string | number): boolean {
		return (Number(protoId) >= 100000001 && Number(protoId) <= 999999999);
	}
	/**
	 * 是否精怪。
     */
	public static isEliteMonster(protoId: string | number): boolean {
		return (Number(protoId) >= 20001 && Number(protoId) <= 24999);
	}
	/**
	 * 是否精怪碎片
     */
	public static isEliteMonsterDebris(protoId: string | number): boolean {
		return (Number(protoId) >= 25001 && Number(protoId) <= 29999);
	}
    /**
	 * 是否神通以及神通碎片
     */
	public static isTheurgy(protoId: string | number): boolean {
		return (Number(protoId) >= 30001 && Number(protoId) <= 39999);
	}
	/**
	 * 是否神通印记
     */
	public static isTheurgySeal(protoId: string | number): boolean {
		return (Number(protoId) >= 40001 && Number(protoId) <= 49999);
	}
	/**
	 * 是否宠物
     */
	public static isPet(protoId: string | number): boolean {
		return (Number(protoId) >= 10001 && Number(protoId) <= 19999);
	}

	/**
	 * 获得对应protoId物品、装备原型，可扩展增加。
     */
	 public static getProto(protoId: string): any {
		protoId = String(protoId);
		if (LocaleData.isItem(protoId)) {
			return LocaleData.getItemProto(protoId);
		} else if (LocaleData.isEquip(protoId)) {
			return LocaleData.getEquipProto(protoId);
		}else if(LocaleData.isEliteMonster(protoId)){
			return LocaleData.getEliteMonsterProto(protoId)	
		}else if(LocaleData.isPet(protoId)){
			return LocaleData.getPetProto(protoId)	
		}else if(LocaleData.isTheurgySeal(protoId)){
			return LocaleData.getTheurgSealByItemId(protoId)
		}else if(LocaleData.isEliteMonsterDebris(protoId)){
			return LocaleData.getEliteMonsterDebProto(protoId)
		}
	
	}

	/**
	 * 根据原型id获得对应装备protoId原型。
     */
	public static getEquipProto(protoId: string | number): any {
		protoId = String(protoId);
		let fileObj: any = LocaleData.getObject("Equip");
		let items: Array<any> = fileObj._root[0]._equip[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == protoId) {
				return items[i];
			}
		}
		let items1: Array<any> = fileObj._root[0]._extra[0]._item;
		for (let i = 0; i < items1.length; i++) {
			if (items1[i].id == protoId) {
				return items1[i];
			}
		}
	}
	/**
	 * 根据原型id获得对应装备的品阶。
	 */
	public static getEquipQualityProto(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Equip");
		let items: Array<any> = fileObj._root[0]._quality[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}
		}
		return items
	}

	/**
	 * 根据原型id获得对应装备的品阶。
	 */
	public static getEquipStarNumByStar(id: string | number,star: string | number): any {
		star = String(star);
		id = Number(id);
		let fileObj: any = LocaleData.getObject("Equip");
		let items: Array<any> = fileObj._root[0]._quality[0]._item;
		let starNum = 0
		for (let i = 0; i < items.length; i++) {
			if (items[i].star == star && id >= Number(items[i].id)) {
				starNum++
			}
		}
		return starNum
	}
	/**
	 * 根据英文获得对应装备的部位。
	 */
	 public static getSoltQualityProto(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Equip");
		let items: Array<any> = fileObj._root[0]._slot[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}
		}
		return items
	}

	/**
	 * 获得对应protoId物品原型。
	 * 获得对应资产数值value原型（读道具表来虚拟显示）。
     */
	public static getItemProto(protoId: string | number): any {
		protoId = String(protoId);

		let hitItem:any = this.itemProtoMap.get(protoId);
		if (hitItem == 1) {
			return undefined;
		} else if (hitItem) {
			return hitItem;
		} else {
			hitItem = undefined;
			let fileObj: any = LocaleData.getObject("Items");
			let items: Array<any> = fileObj._root[0]._item;
			if (this.isItem(protoId)) {
				for (let i = 0; i < items.length; i++) {
					if (items[i].id == protoId) {
						hitItem = items[i];
						break;
					}
				}
			} else { // 资产类型
				for (let i = 0; i < items.length; i++) {
					if (items[i].value == protoId) {
						hitItem = items[i];
						break;
					}
				}
				if (!hitItem) {
					return this.getItemProto(160002); // 用改名卡防错。暂时
				}
			}
			if (hitItem) {
				this.itemProtoMap.set(protoId, hitItem);
			} else {
				this.itemProtoMap.set(protoId, 1);
			}
			return hitItem;
		}
	}

	/**
	 * 获得对应protoId物品原型。
     */
	public static getAllItemProto(): any {
		let fileObj: any = LocaleData.getObject("Items");
		let items: Array<any> = fileObj._root[0]._item;
		return items
	}

		/**
	 * 获得对应protoId物品原型 通过subType。
     */
	public static getItemProtoBySubType(subType: string | number): any {
		subType = String(subType);
		let fileObj: any = LocaleData.getObject("Items");
		let items: Array<any> = fileObj._root[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].subType == subType) {
				return items[i];
			}
		}
	}
	/**
	 * 获得对应protoId宠物原型。
     */
	public static getPetProto(protoId: string | number): any {
		protoId = String(protoId);
		let fileObj: any = LocaleData.getObject("Pet");
		let items: Array<any> = fileObj._root[0]._items[0]._items;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == protoId) {
				return items[i];
			}
		}
		return items;
	}

	/**
	 * 获得对应protoId精怪原型。
     */
	public static getEliteMonsterProto(protoId: string | number): any {
		protoId = String(protoId);
		let fileObj: any = LocaleData.getObject("EliteMonster");
		let items: Array<any> = fileObj._root[0]._elitemonster[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == protoId) {
				return items[i];
			}
		}
	}

	/**
	 * 获得对应protoId精怪碎片原型。
     */
	public static getEliteMonsterDebProto(protoId: string | number): any {
		protoId = String(protoId);
		let fileObj: any = LocaleData.getObject("EliteMonster");
		let items: Array<any> = fileObj._root[0]._items[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == protoId) {
				return items[i];
			}
		}
	}

	/**
	 * 获得对应品质protoId精怪碎片原型。
     */
	public static getEliteMonsterDebProtosByQuality(quality: string | number, exProtoId:string): Array<any> {
		quality = String(quality);
		let temps = new Array<any>();
		let fileObj: any = LocaleData.getObject("EliteMonster");
		let items: Array<any> = fileObj._root[0]._items[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].quality == quality && items[i].id != exProtoId) {
				temps.push(items[i]);
			}
		}
		return temps;
	}

	/**
	 * 获得对应protoId怪物原型。
     */
	public static getMonsterProto(protoId: string | number): any {
		protoId = String(protoId);
		let fileObj: any = LocaleData.getObject("Monster");
		let items: Array<any> = fileObj._root[0]._items[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].monster_id == protoId) {
				return items[i];
			}
		}
	}

	/**
	 * 获得对应protoId的奖励。
     */
	public static getBonuseProtos(bonusesId: string): Array<any> {
		let temps = new Array<any>();
		let fileObj: any = LocaleData.getObject("Bonuses");
		let items: Array<any> = fileObj._root[0]._bonuses[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].bonusesId == bonusesId) {
				temps.push(items[i]);
			}
		}
		return temps;
	}

	/**
	 * 获得对应protoId技能原型。
     */
	public static getSkillProto(protoId: string | number): any {
		protoId = String(protoId);
		let fileObj: any = LocaleData.getObject("Skill");
		let items: Array<any> = fileObj._root[0]._skill[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == protoId) {
				return items[i];
			}
		}
	}

	/**
	 * 获得对应id的表现效果。
     */
	public static getSkillEffectShow(id: string, isUseDef?:boolean): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Skill");
		let items: Array<any> = fileObj._root[0]._effect_show[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}
		}
		if (isUseDef) { // 策划数据错误，找一个默认的。
			return items[0];
		}
	}

	/**
	 * 获得对应id的buff数据。
     */
	public static getSkillBuffItem(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Skill");
		let items: Array<any> = fileObj._root[0]._buff[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}
		}
	}

	/**
	 * 获得PlayerConfig的root节点。
     */
	public static getPlayerRoot(): any {
		return LocaleData.getObject("Player")._root[0];
	}
	/**
	 * 获得PlayerConfig的level数据。
     */
	 public static getPlayerLevel(level: string | number): any {
		level = String(level);
		let fileObj: any = LocaleData.getObject("Player")
		let items: Array<any> = fileObj._root[0]._level[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].level == level) {
				return items[i]
			}			
		}
	}

	public static getCharacterItems():Array<any>{
		let fileObj: any = LocaleData.getObject("Character")
		let items: Array<any> = fileObj._root[0]._character[0]._item;
		return items;
	}
	public static getCharacterRoot():Array<any>{
		let fileObj: any = LocaleData.getObject("Character")
		let items: Array<any> = fileObj._root[0]
		return items;
	}

	/**
	 * 获得某个角色项。
	 */
	public static getCharacterItem(charId: string | number): any  {
		charId = String(charId)
		let fileObj: any = LocaleData.getObject("Character")
		let items: Array<any> = fileObj._root[0]._character[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == charId) {
				return items[i];
			}			
		}
	}

	/**
	 * 获角色活动皮肤项。
	 */
	public static getCharActivityItem(id: string | number): any  {
		id = String(id)
		let fileObj: any = LocaleData.getObject("Character")
		let items: Array<any> = fileObj._root[0]._activity[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}			
		}
	}

	/**
	 * 获角色活动皮肤项。
	 */
	public static getCharActivityItemByGoodsId(id: string | number): any  {
		id = String(id)
		let fileObj: any = LocaleData.getObject("Character")
		let items: Array<any> = fileObj._root[0]._activity[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].levelUpItemId == id) {
				return items[i];
			}			
		}
	}

	/**
	 * 获角色默认皮肤项。
	 */
	public static getCharSuitItem(id: string | number): any  {
		id = String(id)
		let fileObj: any = LocaleData.getObject("Character")
		let items: Array<any> = fileObj._root[0]._suit[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}			
		}
	}

	/**
	 * 获角色默认皮肤项。
	 */
	public static getCharSuitItemByGP(group: string | number, phase: string | number): any  {
		group = String(group)
		phase = Number(phase)
		if (phase == 0) { // 防错
			phase = 1;
		}
		let fileObj: any = LocaleData.getObject("Character")
		let items: Array<any> = fileObj._root[0]._suit[0]._item;
		for (let i = items.length - 1; i >= 0; i--) {
			if (items[i].group == group && phase >= Number(items[i].phase)) {
				return items[i];
			}			
		}
	}

	/**
	 * 获角色头像皮肤项。
	 */
	public static getCharAvatarItem(id: string | number): any  {
		id = String(id)
		let fileObj: any = LocaleData.getObject("Character")
		let items: Array<any> = fileObj._root[0]._avatar[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}			
		}
	}

	/**
	 * 获得模型项。
	 */
	public static getModelItem(id: string | number): any  {
		id = String(id)
		let fileObj: any = LocaleData.getObject("Character")
		let items: Array<any> = fileObj._root[0]._model[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}			
		}
	}

	/**
	 * 获得模型内Spine显示名称组。
	 */
	public static getModelShowInfo(modelId: string | number | ModelShowInfo): ModelShowInfo  {
	if (typeof(modelId) == "string" || typeof(modelId) == "number") {
		let info:ModelShowInfo = {
			id: "",
			name: "",
			spine: "",
			skin: "",
			point: BodyPointType.none,
			thumbnail: "",
			icon: "",
			icon_square: "",
			battleScale: "",
			normalSkill: ""
		}
		let item:any = LocaleData.getModelItem(modelId);
		let spineArr:Array<string> = item.spine.split(",");

		info.name = item.name;
		info.spine = spineArr[0];
		info.skin = (spineArr[1] ? spineArr[1] : "1");
		info.point = item.point;
		info.thumbnail = item.thumbnail;
		info.icon = item.avatar2;
		info.icon_square = item.avatar;
		info.battleScale = item.battleScale;
		info.normalSkill = item.normalSkill;

		return info;
	} else {
		return modelId;
	}
	}

	/**
	 * 获得角色模型显示组合数据（通常用于显示其他玩家，包含自己）。
	 */
	public static getCharShowResInfo(charId: string | number, phase: string | number, suitId: string | number, avatarId: string | number): ModelShowInfo  {
		suitId = Number(suitId);
		// 身体
		let suitItem:any;
		let charItem:any;
		if (suitId && suitId > 0) { // 玩家选定了套装（活动||默认）。
			suitItem = LocaleData.getCharActivityItem(suitId);
			if (!suitItem) {
				suitItem = LocaleData.getCharSuitItem(suitId);
			}
		} else {
			charItem = LocaleData.getCharacterItem(charId);
			suitItem = LocaleData.getCharSuitItemByGP(charItem.suitGroup, phase);
		}
		let info:ModelShowInfo = LocaleData.getModelShowInfo(suitItem.modelId)

		// 头像
		if (avatarId && String(avatarId).length > 1) { // 玩家选定了头像（活动||默认）。
			let avatarItem = LocaleData.getCharAvatarItem(avatarId);
			// let avatarModel = LocaleData.getModelItem(avatarItem.modelId);
			let avatarModel;
			if (avatarItem.type == AvatarType.PHASE) {
				if (!charItem) {
					charItem = LocaleData.getCharacterItem(charId);
				}
				let suitItem = LocaleData.getCharSuitItemByGP(charItem.suitGroup, avatarItem.typeId);
				avatarModel = LocaleData.getModelItem(suitItem.modelId);
			} else if (avatarItem.type == AvatarType.ACTIVITY) {
				let suitItem = LocaleData.getCharActivityItem(avatarItem.typeId);
				avatarModel = LocaleData.getModelItem(suitItem.modelId);
			} else if (avatarItem.type == AvatarType.ELITE) {
				let proto = LocaleData.getEliteMonsterProto(avatarItem.typeId);
				avatarModel = LocaleData.getModelItem(proto.modelId);
			} else if (avatarItem.type == AvatarType.PET) {
				let proto = LocaleData.getPetProto(avatarItem.typeId);
				avatarModel = LocaleData.getModelItem(proto.modelId);
			} 
			info.icon = avatarModel.avatar2;//默认是圆的了
		 	info.icon_square = avatarModel.avatar;
		}

		return info;
	}

	/**
	 * 获得玩家自己模型显示组合数据。
	 */
	public static getCharShowResInfoSelf(): ModelShowInfo  {
		let base = GameServerData.getInstance().getPlayerFullInfo().base;
		return LocaleData.getCharShowResInfo(base.character, base.phase, base.appearance, base.avatar);
	}

	/**
	 * 获得角色坐骑模型显示组合数据。
	 */
	public static getMountShowResInfo(tid: string | number, cid: string | number): ModelShowInfo  {
		tid = Number(tid);
		cid = Number(cid);
		let suitItem:any;
		if (cid && cid > 0) { // 玩家选定了皮肤（活动）。
			suitItem = LocaleData.getMountClothesItem(cid);
		} else if (tid && tid > 0) {
			suitItem = LocaleData.getMountTypeItem(tid);
		}
		if (suitItem) {
			let info:ModelShowInfo = LocaleData.getModelShowInfo(suitItem.modelId)
			return info;
		}
	}

	/**
	 * 获得玩家自己坐骑模型显示组合数据。
	 */
	public static getMountShowResInfoSelf(): ModelShowInfo  {
		let base = GameServerData.getInstance().getPlayerFullInfo().base;
		return LocaleData.getMountShowResInfo(base.mountType, base.mountSkin);
	}

	/**
	 * 获得坐骑Root。
	 */
	public static getMountRoot(): any  {
		let fileObj: any = LocaleData.getObject("Mount")
		return fileObj._root[0];
	}

	/**
	 * 获得所有坐骑Item。
	 */
	public static getMountTypeItems(): Array<any>  {
		let fileObj: any = LocaleData.getObject("Mount")
		return fileObj._root[0]._mounttype[0]._item;
	}

	/**
	 * 获得坐骑Item。
	 */
	public static getMountTypeItem(tid: string | number): any  {
		tid = String(tid);
		let fileObj: any = LocaleData.getObject("Mount")
		let items: Array<any> = fileObj._root[0]._mounttype[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == tid) {
				return items[i];
			}			
		}
	}

	/**
	 * 获得坐骑阶级Item。
	 */
	public static getMountStageItem(stage: string | number): any  {
		stage = String(stage);
		let fileObj: any = LocaleData.getObject("Mount")
		let items: Array<any> = fileObj._root[0]._mountlevel[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].mount_stage == stage) {
				return items[i];
			}			
		}
	}

	/**
	 * 获得所有坐骑皮肤Item。
	 */
	public static getMountClothesItems(): Array<any>  {
		let fileObj: any = LocaleData.getObject("Mount")
		return fileObj._root[0]._mountclothes[0]._item;
	}

	/**
	 * 获得坐骑皮肤Item。
	 */
	public static getMountClothesItem(cid: string | number): any  {
		cid = String(cid);
		let fileObj: any = LocaleData.getObject("Mount")
		let items: Array<any> = fileObj._root[0]._mountclothes[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == cid) {
				return items[i];
			}			
		}
	}

	/**
	 * 获得对应引导原型。
     */
	public static getGuideItem(guideId: string | number): any {
		guideId = String(guideId);
		let fileObj: any = LocaleData.getObject("NewGuide");
		let items: Array<any> = fileObj._root[0]._guidGroup[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == guideId) {
				return items[i];
			}
		}
	}
	/**
	* 获得Task通过id。
	*/
	public static getTaskRoot(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Task")
		let items: Array<any> = fileObj._root[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i]
			}			
		}
	}
	/**
	* 获得Task通过type。
	*/
	public static getTaskByType(type: string | number): any {
		type = String(type);
		let fileObj: any = LocaleData.getObject("Task")
		let items: Array<any> = fileObj._root[0]._item;
		let arr :any = []
		for (let i = 0; i < items.length; i++) {
			if (items[i].type == type) {
				arr.push(items[i])
			}			
		}
		return arr
	}
	/**
	* 获得specialTaskType
	*/
	public static getTaskSpecialTaskType(id: string | number): boolean {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Player")
		let items: Array<any> = fileObj._root[0]._specialTaskType[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].conditionType == id) {
				return true
			}			
		}
		return false
	}

	public static getCombatAttrs(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("CombatAttrs")
		let items: Array<any> = fileObj._root[0]._attr[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i]
			}			
		}
	}


	/**
	 * 获得关卡数据。
	 */
	public static getStageItem(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Stage");
		let items: Array<any> = fileObj._root[0]._items[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}
		}
	}

	/**
	 * 获得关卡有章节奖励的数据。
	 */
	public static getStageChapterRewardItems(): Array<any> {
		let arr:Array<any> = new Array<any>();
		let fileObj: any = LocaleData.getObject("Stage");
		let items: Array<any> = fileObj._root[0]._items[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].chapter_reward.length > 1) {
				arr.push(items[i]);
			}
		}
		return arr;
	}

	/**
	 * 获得敏感词数组。
     */
	public static getSensitiveWords(): Array<string> {
		if (!this.sensitiveWord) {
			this.sensitiveWord = new Array<string>();
			let fileObj: any = LocaleData.getObject("SensitiveWord");
			let words: Array<any> = fileObj._root[0]._word;
			if (words) {
				for (let i = 0; i < words.length; i++) {
					this.sensitiveWord.push(words[i].word);
				}
			}
		}
		return this.sensitiveWord;
	}
	private static sensitiveWord: Array<string>;

	/**
	 * 获得常规活动数据。
     */
	public static getActivityXml(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Activities");
		let items: Array<any> = fileObj._root[0]._activity;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}
		}
	}

	/**
	 * 获得常驻累充数据。
     */
	public static getLeiTotalItems(): Array<any> {
        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.PAYACC);
        return activityXml._perpetual[0]._item;
    }

	/**
	 * 获得妖塔数据。
     */
	public static getTowerItem(id:number | string): any {
        id = String(id);
        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.MONSTOR_TOWER);
        let items:Array<any> = activityXml._tier[0]._item;
        for (let i = 0; i < items.length; i++) {
            if (id == items[i].id) {
                return items[i];
            }
        }
    }

	/**
	 * 获得妖塔BUFF。
     */
	public static getTowerBuffItem(id:number | string): any {
        id = String(id);
        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.MONSTOR_TOWER);
        let items:Array<any> = activityXml._buff[0]._item;
        for (let i = 0; i < items.length; i++) {
            if (id == items[i].id) {
                return items[i];
            }
        }
    }

	/**
	 * 获得妖塔所有BUFF。
     */
	public static getTowerBuffItems(): Array<any> {
        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.MONSTOR_TOWER);
        return activityXml._buff[0]._item;
    }

	/**
	 * 获得妖塔解锁槽。
     */
	public static getTowerTrenchItems(): Array<any> {
        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.MONSTOR_TOWER);
        return activityXml._trench[0]._item;
    }

	/**
	 * 获得挑战妖王最大次数。
     */
	public static getKingMonsterMaxCount(): number {
        let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.KING_MONSTER);
        let refCnt:string = activityXml._config[0]._item[0].refCnt;
		let activeCardItem = UtilsUI.getMonthLifeCardActiveItem(MonthCardItemType.king_monster);
        if (activeCardItem) { // 卡项生效
            return Number(refCnt) + Number(activeCardItem.count);
        } else {
			return Number(refCnt);
		}
    }

	/**
	 * 获得指定七日签到数据。
	 */
	public static getSevenDaysItems(id: string | number): Array<any> {
		id = String(id);
		let activityXml = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.SEVENDAYS);
		let items: Array<any> = activityXml._bonuse[0]._item
		let arr: any = []
		for (let i = 0; i < items.length; i++) {
			if (items[i].topID == id) {
				arr.push(items[i])
			}
		}
		return arr;
	}
	/**
	 * 获得老王的Condition表，不知道这个意义是要做什么。
     */
	public static getConditionItem(id: string): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Condition");
		let items: Array<any> = fileObj._root[0]._condition[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}
		}
	}

	/**
	 * 获得斗法的root。
     */
	public static getDuelRoot(): any {
		let fileObj: any = LocaleData.getObject("Duel");
		return fileObj._root[0];
	}

	/**
	 * 获得仙术等级数组。
	 */
	public static getEvolutionRoot(): any  {
		let fileObj: any = LocaleData.getObject("Evolution");
		let items: Array<any> = fileObj._root[0]
		return items
	}
	/**

	/**
	 * 获得仙术等级数组。
	 */
	public static getEvolutions(): Array<any>  {
		let fileObj: any = LocaleData.getObject("Evolution");
		let items: Array<any> = this.getEvolutionRoot()._evolution[0]._item;
		return items
	}
	/**
	 * 获得仙术等级数组。
	 */
	public static getEvolutionByLevel(level: string | number): any  {
		level = String(level)
		let items: Array<any> = this.getEvolutions()
		if (Number(level) > items.length) {
			return null
		} else {
			for (let i = 0; i < items.length; i++) {
				if (items[i].level == level) {
					return items[i];
				}
			}
		}
	}

	/**
	 * 获得仙数体力消耗数。
	*/
	public static getEvolutionsStamina(): any  {
		let fileObj: any = LocaleData.getObject("Evolution");
		let items: Array<any> = this.getEvolutionRoot()._stamina[0]._item;
		return items
	}

	/**
	 * 获得仙数掉落。
	*/
	public static getEvolutionsDrop(): any  {
		let fileObj: any = LocaleData.getObject("Evolution");
		let items: Array<any> = this.getEvolutionRoot()._drop[0]._item;
		return items
	}

	/**
	 * 获取主角升级信息
	 */
	public static getPlayerGrowByLevel(level: string | number): any {
		level = String(level);
		let fileObj: any = LocaleData.getObject("PlayerGrow");
		let items: Array<any> = fileObj._root[0]._level[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].level == level) {
				return items[i];
			}
		}
	}
	
	/**
	 * 获取主角当前等级前升级信息
	 */
	 public static getPlayerGrowArrByLevel(level: string | number): any {
		level = Number(level);
		let fileObj: any = LocaleData.getObject("PlayerGrow");
		let items: Array<any> = fileObj._root[0]._level[0]._item;
		let arr:Array<any>=[]
		for (let i = 0; i < items.length; i++) {
			if (Number(items[i].level) <= level) {
				arr.push(items[i])
			}
		}
		return arr;
	}

	/**
	 * 获取主角阶段信息
	 */
	public static getPlayerPhaseByLevel(level: string | number): any {
		level = String(level);
		let fileObj: any = LocaleData.getObject("PlayerGrow");
		let items: Array<any> = fileObj._root[0]._phase[0]._item;
		let data: any[] = []
		for (let i = 0; i < items.length; i++) {
			if (level <= items[i].level) {
				data[0] = items[i]
				if (items[i + 1]) {
					data[1] = items[i + 1]
				}
				return data
			}
		}
	}
	public static getPlayerPhaseById(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("PlayerGrow");
		let items: Array<any> = fileObj._root[0]._phase[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (id == items[i].id) {
				return items[i]
			}
		}
	}
	public static getPlayerPhase(): any {
		let fileObj: any = LocaleData.getObject("PlayerGrow");
		let items: Array<any> = fileObj._root[0]._phase[0]._item;
		return items
	}

	public static getPlayerMaxLevel(): any {
		let fileObj: any = LocaleData.getObject("PlayerGrow");
		let items: Array<any> = fileObj._root[0]._level[0]._item;
		return items[items.length-1].level
	}
	/**
	 * 获得灵脉等级数组。
	 */
	public static getVeinRoot(): any  {
		let fileObj: any = LocaleData.getObject("Vein");
		let items: Array<any> = fileObj._root[0]
		return items
	}
	/**
	 * 根据英文获得对应装备的部位。
	 */
	public static getVeinSoltByen(en: string | number): any {
		en = String(en);
		let items: Array<any> = this.getVeinRoot()._slot[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].en == en) {
				return items[i];
			}
		}
		return items
	}

	public static getVeinSoltById(id: string | number): any {
		id = String(id);
		let items: Array<any> = this.getVeinRoot()._slot[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}
		}
		return items
	}

	public static getVeinLevel(level: string | number): any {
		level = String(level);
		let items: Array<any> = this.getVeinRoot()._level[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].level == level) {
				return items[i]
			}
		}
		return null
	}

	public static getVeinLearn(level: string | number): any {
		level = String(level);
		let items: Array<any> = this.getVeinRoot()._learn[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].level == level) {
				return items[i]
			}
		}
		return null
	}
	
	public static getVeinQua(){
		return this.getVeinRoot()._quality[0]._item;
	}
	public static getVeinAttrSet(){
		return this.getVeinRoot()._attrSet[0]._item;
	}

	public static getVeinAttrSetById(id: string | number){
		id = String(id);
		let items: Array<any> = this.getVeinAttrSet();
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i]
			}
		}
	}
	public static getVeinAttrNumber(id: string | number){
		id = String(id);
		let items: Array<any> = this.getVeinRoot()._attrNumber[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i]
			}
		}
	}

	/**
	 * 获得精怪root。
	 */
	public static getEliteMonsterRoot(): any  {
		let fileObj: any = LocaleData.getObject("EliteMonster");
		return fileObj._root[0];
	}

	public static getEliteMonsterLevel(proto:string | number, level: string | number): any  {
		proto = String(proto)
		level = String(level);
		let items: Array<any> = this.getEliteMonsterRoot()._level[0]._item;
		let monsterItems: Array<any> = []
		for (let i = 0; i < items.length; i++) {
				if (items[i].elite_monster_id == proto) {
						monsterItems.push(items[i])
				}
		}
		if (Number(level) >= monsterItems.length) {
				return monsterItems[monsterItems.length - 1]
		}
		for (let index = 0; index < monsterItems.length; index++) {
				if (monsterItems[index].level == level) {
						return monsterItems[index]
				}
		}
	}

	public static getEliteDrawReward(id: string | number): any  {
		id = String(id);
		let items: Array<any> = this.getEliteMonsterRoot()._specialguarantees[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i]
			}
		}
		return null
	}

	public static getEliteMonsterAllSkill(proto:string | number): any  {
		proto = String(proto)
		let items: Array<any> = this.getEliteMonsterRoot()._level[0]._item;
		let skillData :Array<any> = []
		for (let i = 0; i < items.length; i++) {
			if (items[i].elite_monster_id == proto && items[i].skill_id != "0") {
				let insert = true
				for (let index = 0; index < skillData.length; index++) {
					if (skillData[index].skill_id == items[i].skill_id ) {
						insert = false
					}
				}
				if (insert) {
					skillData.push(items[i])
				}
			}
		}
		return skillData
	}

	public static getEliteMonsterByMonsterProto(proto:any): Array<any>  {
		let eliteProtos:Array<any> = [];
        if (proto.rune_1.length > 1) {
            eliteProtos.push(LocaleData.getEliteMonsterProto(proto.rune_1));
        }
        if (proto.rune_2.length > 1) {
            eliteProtos.push(LocaleData.getEliteMonsterProto(proto.rune_2));
        }
        if (proto.rune_3.length > 1) {
            eliteProtos.push(LocaleData.getEliteMonsterProto(proto.rune_3));
        }
		return eliteProtos;
	}

	public static getEliteMonsterEncyclopedia(): any  {
		let items: Array<any> = this.getEliteMonsterRoot()._encyclopedia[0]._item;
		return items;
	}

	public static getEliteMonsterEncyclopediaById(id: string | number, level: string | number): any  {
		id = String(id)
		level = String(level)
		let items: Array<any> = this.getOneTypeEncyclopedia(id);
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			if (element.resonance_level == level) {
				return element
			}
		}
		return items[items.length - 1]
	}

	public static getEliteMonsMaxLevel(id: string | number): number{
		id = String(id)
		let items: Array<any> = this.getOneTypeEncyclopedia(id);
		return items.length
	}

	public static getOneTypeEncyclopedia(id: string | number){
		id = String(id)
		let items: Array<any> = this.getEliteMonsterEncyclopedia();
		let needitems: Array<any> = []
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			if (element.resonance_id == id) {
				needitems.push(element)
			}
		}
		return needitems
	}

	/**
	 * 门客proto
	 * @param suipid 
	 * @returns 
	 */
	public static getEliteMonsterByDebrisid(suipid: string | number): any{
		suipid = String(suipid)
		let items: Array<any> = this.getEliteMonsterRoot()._elitemonster[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].debris_id == suipid) {
				return items[i]
			}
		}
	}
	
	public static getPetRoot():any{
		let fileObj: any = LocaleData.getObject("Pet");
		let items: Array<any> = fileObj._root[0]
		return items
	}

	public static getPetQualityById(quality:string|number):any{
		quality = String(quality);
		let fileObj: any = LocaleData.getObject("Pet");
		let items: Array<any> = fileObj._root[0]._quality[0]._quality;
		for (let i = 0; i < items.length; i++) {
			if (quality == items[i].quality_id) {
				return items[i]
			}
		}
	}

	public static getPetProtosByQuality(quality:string|number, exProtoId:string):Array<any>{
		quality = String(quality);
		let temps = new Array<any>();
		let fileObj: any = LocaleData.getObject("Pet");
		let items: Array<any> = fileObj._root[0]._items[0]._items;
		for (let i = 0; i < items.length; i++) {
			if (quality == items[i].quality && items[i].id != exProtoId) {
				temps.push(items[i]);
			}
		}
		return temps;
	}

	public static getPetLevelByIdLevel(id:string|number,level:string|number ):any{
		id = String(id);
		let fileObj: any = LocaleData.getObject("Pet");
		let items: Array<any> = fileObj._root[0]._level[0]._level;
		for (let i = items.length - 1; i >= 0; i--) {
			if (id == items[i].pet_id) {
				if (Number(level)>= items[i].level) {
					return items[i]
				}
			}
		}
	}
	public static getPetLevelByIdLevel1(id:string|number,level:string|number ):any{
		id = String(id);
		let fileObj: any = LocaleData.getObject("Pet");
		let items: Array<any> = fileObj._root[0]._level[0]._level;
		let skillLevel = 0
		for (let i = items.length - 1; i >= 0; i--) {
			if (id == items[i].pet_id) {
				skillLevel++
				if (Number(level)>= items[i].level) {
					return skillLevel
				}
			}
		}
	}
	public static getPetLevelByIdLevel2(id:string|number,level:string|number ):any{
		id = String(id);
		level = String(level);
		let fileObj: any = LocaleData.getObject("Pet");
		let items: Array<any> = fileObj._root[0]._level[0]._level;
		for (let i = items.length - 1; i >= 0; i--) {
			if (id == items[i].pet_id && level == items[i].level) {
				return items[i]
			}
		}
	}

	public static getPetLevelByIdId(id:string|number):any{
		id = String(id);
		let fileObj: any = LocaleData.getObject("Pet");
		let items: Array<any> = fileObj._root[0]._level[0]._level;
		let arr = []
		for (let i = items.length - 1; i >= 0; i--) {
			if (id == items[i].pet_id) {
				arr.push(items[i])
			}
		}
		return arr
	}


	public static getEncyclopedia():any{
		let fileObj: any = LocaleData.getObject("Pet");
		let items: Array<any> = fileObj._root[0]._encyclopedia[0]._encyclopedia;
		return items
	}

	public static getPetBackpackByIndex(index:string|number):any{
		index = String(index);
		let fileObj: any = LocaleData.getObject("Pet");
		let items: Array<any> = fileObj._root[0]._backpack[0]._backpack;
		for (let i = 0; i < items.length; i++) {
			if ( index == items[i].backpack_expansion) {
				return items[i]
			}
		}
		return items
	}
	
	public static getPetrefreshBuffGroupByLockCnt(lockCnt:string|number):any{
		lockCnt = String(lockCnt);
		let fileObj: any = LocaleData.getObject("Pet");
		let items: Array<any> = fileObj._root[0]._refreshBuffGroup[0]._refreshBuffGroup;
		for (let i = 0; i < items.length; i++) {
			if ( lockCnt == items[i].lockCnt) {
				return items[i]
			}
		}
		return items
	}

	public static getPetBuffById(buffId:string|number):any{
		buffId = String(buffId);
		let fileObj: any = LocaleData.getObject("Pet");
		let items: Array<any> = fileObj._root[0]._buff[0]._buff;
		for (let i = 0; i < items.length; i++) {
			if (buffId == items[i].buffId) {
				return items[i]
			}
		}
		return items
	}

	
	public static getPetPool():any{
		let fileObj: any = LocaleData.getObject("Pet");
		let items: Array<any> = fileObj._root[0]._pool[0]._pool;
		return items
	}

	public static getPetMaxAttr(id:string|number, level_limit?:number, rank_limit?:number):Array<number>{
		let root: any = this.getPetRoot()
		if (level_limit || level_limit == 0) {
		} else {
			level_limit = Number(root.level_limit);
		}
		if (rank_limit || rank_limit == 0) {
		} else {
			rank_limit = Number(root.rank_limit);
		}
		let PetProto: any = this.getPetProto(id)	
		let qualitys: any = this.getPetQualityById(PetProto.quality)
		let initial_dimensional_value:string []= qualitys.initial_dimensional_value.split(",")
		let dimensional_gain_per_devour:string[] = qualitys.dimensional_gain_per_devour.split(",")
		let dimensional_gain_per_upgrade:string[] = qualitys.dimensional_gain_per_upgrade.split(",")

		let items:number[] = [];
		for (let i = 0; i < initial_dimensional_value.length; i++) {
			let att :number = Number(initial_dimensional_value[i])
			+ level_limit * Number(dimensional_gain_per_upgrade[i])
			+ rank_limit * Number(dimensional_gain_per_devour[i])
			items.push(att)
		}
		return items
	}
	public static getPetSpecialGuarantees(): any {
		let fileObj: any = LocaleData.getObject("Pet");
		let items: Array<any> = fileObj._root[0]._specialGuarantees[0]._item;
	
		return items
	}
	public static getPetSpecialGuarantees1(consumption:number|string): any {
		let fileObj: any = LocaleData.getObject("Pet");
		let items: Array<any> = fileObj._root[0]._specialGuarantees[0]._item;
		consumption = Number(consumption)
		for (let i = 0; i < items.length; i++) {
			const element = items[i];
			if (consumption < Number(element.consumption)){
				return element
			}
		}
		return items
	}
	public static getCompanion(): any {
		let fileObj: any = LocaleData.getObject("Companion");
		let items: Array<any> = fileObj._root[0]._companion[0]._item;
		return items
	}
	public static getCompanionRoot(): any {
		let fileObj: any = LocaleData.getObject("Companion");
		return	fileObj._root[0];
	}
	public static getCompanionById(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Companion");
		let items: Array<any> = fileObj._root[0]._companion[0]._item;
		
		for (let i = 0; i < items.length; i++) {
			if (id == items[i].id) {
				return items[i]
			}
		}
	}
	public static getCompanionLikingByLevel(level: string | number): any {
		level = String(level);
		let fileObj: any = LocaleData.getObject("Companion");
		let items: Array<any> = fileObj._root[0]._likingPhase[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (i < items.length) {
				if (level >= items[i].likingLevel && level < items[i + 1].likingLevel) {
					return items[i]
				}
			} else {
				return items[i]
			}
		}
		return items
	}
	public static getCompanionLikingByPhase(phase: string | number): any {
		phase = String(phase);
		let fileObj: any = LocaleData.getObject("Companion");
		let items: Array<any> = fileObj._root[0]._likingPhase[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (phase == items[i].phase) {
				return items[i]
			}
		}
	}
	public static getCompanionlikingValueByItemId(itemId: string | number): any {
		itemId = String(itemId);
		let fileObj: any = LocaleData.getObject("Companion");
		let items: Array<any> = fileObj._root[0]._likingValue[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (itemId == items[i].itemId) {
				return items[i]
			}
		}
	}
	public static getCompanionAttrById(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Companion");
		let items: Array<any> = fileObj._root[0]._attr[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (id == items[i].id) {
				return items[i]
			}
		}
		return items
	}

	public static getCompanionLikingLevelByLevel(level: string | number): any {
		level = String(level);
		let fileObj: any = LocaleData.getObject("Companion");
		let items: Array<any> = fileObj._root[0]._likingLevel[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (level == items[i].level) {
				return items[i]
			}
		}
	}

	public static getCompanionArrLikingLevelByLevel(level: string | number, level1: string | number): any {
		level = Number(level);
		level1 = Number(level1);
		let fileObj: any = LocaleData.getObject("Companion");
		let items: Array<any> = fileObj._root[0]._likingLevel[0]._item;
		let arr: Array<any> = []
		for (let i = 0; i < items.length; i++) {
			if (level <= Number(items[i].level) && level1 >= Number(items[i].level)) {
				arr.push(items[i])
			}
		}
		return arr
	}

	public static getCompanionDuel(): any {
		let fileObj: any = LocaleData.getObject("Companion");
		let items: Array<any> = fileObj._root[0]._duel[0]._item;
		return items
	}
	public static getCompanionDuelById(companionId:string | number): any {
		companionId = String(companionId);
		let fileObj: any = LocaleData.getObject("Companion");
		let items: Array<any> = fileObj._root[0]._duel[0]._item;
		let arr :any =[]
		for (let i = 0; i < items.length; i++) {
			if (companionId == items[i].companionId ) {
				arr.push(items[i])
			}
		}
		return arr
	}
	public static getCompanionDuelByPlayer(playerLevel:string| number,likingLevel:string| number,companionId:string| number): any {
		playerLevel = Number(playerLevel);
		likingLevel = Number(likingLevel);
		companionId = String(companionId);
		let fileObj: any = LocaleData.getObject("Companion");
 		likingLevel = likingLevel==0 ?1:likingLevel
		let items: Array<any> = fileObj._root[0]._duel[0]._item;
			for (let i = 0; i < items.length; i++) {
			if (companionId == items[i].companionId) {
				if (playerLevel <Number(items[i].playerLevel) 
				|| likingLevel < Number(items[i].likingLevel)) {
					if (i > 0) {
						return items[i-1]
					}else{
						return items[0]
					}
				}
			}
		}
	
	}
	public static getCompanionExplore(): any {
		let fileObj: any = LocaleData.getObject("Companion");
		let items: Array<any> = fileObj._root[0]._explore[0]._item;
		return items
	}
	public static getCompanionStaminaByLevel(level:string | number): any {
		level = Number(level);
		let fileObj: any = LocaleData.getObject("Companion");
		let items: Array<any> = fileObj._root[0]._stamina[0]._item;
		for (let i = items.length - 1; i >= 0; i--) {
			if (level >= Number(items[i].playerLevel)) {
				return items[i]
			}
		}
	}
	public static getCompanionSkin(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Companion");
		let items: Array<any> = fileObj._root[0]._skin[0]._item;
		let arr :any =[]
		for (let i = 0; i < items.length; i++) {
			if (id == items[i].companionId ) {
				arr.push(items[i])
			}
		}
		return arr
	}
	public static getCompanionSkinById(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Companion");
		let items: Array<any> = fileObj._root[0]._skin[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (id == items[i].id ) {
				return items[i]
			}
		}
	}


	public static getBoostById(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Boost");
		let items: Array<any> = fileObj._root[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (id == items[i].id) {
				return items[i]
			}
		}
	}

	public static getCounterByKey(key: string | number): any {
		key = String(key);
		let fileObj: any = LocaleData.getObject("Counter");
		let items: Array<any> = fileObj._root[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (key == items[i].key) {
				return items[i]
			}
		}
	}

	/**
	 * 获得跑马灯数据项。
	 */
	public static getTickerItem(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Ticker");
		let items: Array<any> = fileObj._root[0]._ticker[0]._ticker;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}
		}
	}

	/**
	 * 获得聊天表情数据。
	 */
	public static getChatEmojiItem(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Chat");
		let items: Array<any> = fileObj._root[0]._emoji[0]._emoji;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}
		}
	}

	/**
	 * 获得所有聊天表情数据。
	 */
	public static getChatEmojiItems(): any {
		let fileObj: any = LocaleData.getObject("Chat");
		return fileObj._root[0]._emoji[0]._emoji;
	}

	/**
	 * 获得金手指数据。
	 */
	public static getGoldFingerRoot(): any {
		let fileObj: any = LocaleData.getObject("GoldFinger");
		return fileObj._root[0];
	}

	/**
	 * 获得金手指数据。
	 */
	public static getGoldFingerItems(): Array<any> {
		let fileObj: any = LocaleData.getObject("GoldFinger");
		let items:Array<any> = fileObj._root[0]._list[0]._item;
		items.sort((itemA, itemB) => {
            return Number(itemA.id) - Number(itemB.id);
        })
		return items;
	}

	/**
	 * 获得金手指数据。
	 */
	public static getGoldFingerItem(id:string | number): any {
		id = String(id)
		let fileObj: any = LocaleData.getObject("GoldFinger");
		let items:Array<any> = fileObj._root[0]._list[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}
		}
	}

	/**
	 * 获得金手指数据。
	 */
	public static getGoldFingerRaffleItems(): Array<any> {
		let fileObj: any = LocaleData.getObject("GoldFinger");
		return fileObj._root[0]._raffle[0]._item;
	}

	/**
	 * 获得金手指数据。
	 */
	public static getGoldFingerLevelItem(id:number | string, level:number | string): any {
		id = String(id);
		level = String(level);
		let fileObj: any = LocaleData.getObject("GoldFinger");
		let items:Array<any> = fileObj._root[0]._ability[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].type == id && items[i].level == level) {
				return items[i];
			}
		}
	}

    public static getGoldFingerLevelItemDesc(id:string | number, level:string | number):string {
        let levelItem = LocaleData.getGoldFingerLevelItem(id, level);
        if (levelItem) {
            return UtilsTool.stringFormat(levelItem.desc, levelItem.data.split(","));
        } else {
            return "";
        }
    }

	public static getGoldFingerLevelItemMax(levelItem:any):number {
        let count = 0;
        let datas:Array<any> = levelItem.data.split(",");
        if (levelItem.functionType == VarVal.GOLDFINGER_TYPE.ELITEREPLACE) {
            count = Number(datas[2]);
        } else if (levelItem.functionType == VarVal.GOLDFINGER_TYPE.PETREPLACE) {
			count = Number(datas[2]);
		} else if (levelItem.functionType == VarVal.GOLDFINGER_TYPE.EQUIP) {
			count = Number(datas[1]);
		} else if (levelItem.functionType == VarVal.GOLDFINGER_TYPE.SKILLATTR) {
			count = Number(datas[2]);
		}
        return count;
    }

	/**
	 * 获得基金子Root。
	 */
	public static getFundRootByType(type:string): any {
		let fileObj: any = LocaleData.getObject("Funds");
		if (type == VarVal.payOtherType.fundxiuwei) {
			return fileObj._root[0]._level[0];
		} else if (type == VarVal.payOtherType.fundstage) {
			return fileObj._root[0]._stage[0];
		} else if (type == VarVal.payOtherType.fundxianshu) {
			return fileObj._root[0]._evolution[0];
		} else if (type == VarVal.payOtherType.fundtower) {
			return fileObj._root[0]._tower[0];
		} else if (type == VarVal.payOtherType.fundfabao) {
			return fileObj._root[0]._dhama[0];
		}
	}

	/**
	 * 获得基金奖励项。
	 */
	public static getFundItemsByType(type:string): Array<any> {
		return LocaleData.getFundRootByType(type)._item;
	}

	/**
	 * 获得充值档次数据。
	 */
	public static getPayItemsByType(type: string): Array<any> {
		let temps:Array<any> = new Array<any>();
		let fileObj: any = LocaleData.getObject("Pay");
		let items: Array<any> = fileObj._root[0]._pay[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].type == type) {
				temps.push(items[i]);
			}
		}
		return temps;
	}

	/**
	 * 获得每日礼包列表。
	 */
	public static getPayGiftDailyItems(): Array<any> {
		let temps:Array<any> = new Array<any>();
		let fileObj: any = LocaleData.getObject("Pay");
		let items: Array<any> = fileObj._root[0]._dailyGift[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].sysId == "" || GameServerData.getInstance().isActivationSys(items[i].sysId)) {
				temps.push(items[i]);
			}
		}
		return temps;
	}

	/**
	 * 获得每日自选礼包列表。
	 */
	public static getPayGiftDailyChooseItems(): Array<any> {
		let fileObj: any = LocaleData.getObject("Pay");
		let items: Array<any> = fileObj._root[0]._optionGift[0]._item;
		let temps: Array<any> = new Array<any>();
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			let isOpen = true;
			let giftItem = LocaleData.getPayGiftItem(item.id);
			if (giftItem.optionItems.length > 0) { // 有选择样式
				let optionIds:Array<string> = giftItem.optionItems.split(",");
				for (let jjj = 0; jjj < optionIds.length; jjj++) {
					let chooseItems = LocaleData.getPayChooseItemsByGroup(optionIds[jjj]);
					if (chooseItems.length == 0) {
						isOpen = false;
						break;
					}
				}
			}
			if (isOpen) {
				temps.push(item);
			}
		}
		return temps;
	}

	/**
	 * 获得充值档次数据。
	 */
	public static getPayItem(id:string|number): any {
		id = String(id)
		let fileObj: any = LocaleData.getObject("Pay");
		let items: Array<any> = fileObj._root[0]._pay[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}
		}
	}

	/**
	 * 获得功能卡档次数据。
	 */
	public static getPayItemByOtherType(subType:string): any {
		let fileObj: any = LocaleData.getObject("Pay");
		let items: Array<any> = fileObj._root[0]._pay[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].type == VarVal.payType.others && items[i].value == subType) {
				return items[i];
			}
		}
	}

	/**
	 * 获得月卡终身卡的功能项。
	 */
	public static getPayOtherCardItems(type:string): Array<any> {
		let fileObj: any = LocaleData.getObject("Pay");
		let items: Array<any> = fileObj._root[0]._payCard[0]._item;
		if (type) {
			let temps:Array<any> = new Array<any>();
			for (let i = 0; i < items.length; i++) {
				if (items[i].type == type) {
					temps.push(items[i]);
				}
			}
			return temps;
		} else {
			return items;
		}
	}

	/**
	 * 获得某充值礼包。
	 */
	public static getPayGiftItem(id:string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Pay");
		let items: Array<any> = fileObj._root[0]._gift[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}
		}
	}

	/**
	 * 获得某充值礼包组。
	 */
	public static getPayGiftItemsByGroup(id:string | number): Array<any> {
		id = String(id);
		let temp:Array<any> = new Array<any>();
		let fileObj: any = LocaleData.getObject("Pay");
		let items: Array<any> = fileObj._root[0]._gift[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].giftGroupId == id) {
				temp.push(items[i]);
			}
		}
		return temp;
	}

	/**
	 * 获得当前首充档次。
	 */
	/*
	public static getFirstGiftItem(): any {
		let fullInfo = GameServerData.getInstance().getPlayerFullInfo();
		if (fullInfo.firstPay && fullInfo.firstPay.isLast != 1) {
			let currId = String(fullInfo.firstPay.id);
			let fileObj: any = LocaleData.getObject("Pay");
			let firstGroup:string = fileObj._root[0].firstPay;
			let items: Array<any> = fileObj._root[0]._gift[0]._item;
			for (let i = 0; i < items.length; i++) {
				if (items[i].giftGroupId == firstGroup && items[i].id == currId) {
					return items[i];
				}
			}
		}
	}
	*/

	/**
	 * 获得当前激活的礼包组。
	 */
	public static getActiveGiftGroups(isCanBuyOnly?:boolean, isSeven?:number): Array<any> {
		let temps:Array<any> = new Array<any>();
		let fullInfo = GameServerData.getInstance().getPlayerFullInfo();
		let giftGroups:Array<any> = fullInfo.xianyouGroup;
		if (isSeven == 1) {
			giftGroups = fullInfo.openGift;
		}
		for (let i = 0; i < giftGroups.length; i++) {
			let giftItem = LocaleData.getPayGiftItem(giftGroups[i].id);
			let isPushIn = false;
			if (isCanBuyOnly) {
				let gift;
				if (isSeven == 1) {
					gift = GameServerData.getInstance().getPaySevenGiftGroupRecord(giftItem.id);
				} else {
					gift = GameServerData.getInstance().getPayGiftGroupRecord(giftItem.id);
				}
				if (gift && gift.count >= Number(giftItem.buyCount)) {
					// 买完了。
				} else {
					isPushIn = true;
				}
			} else {
				isPushIn = true;
			}
			if (isPushIn) {
				let hitGroup;
				for (let jjj = 0; jjj < temps.length; jjj++) {
					if (temps[jjj].giftGroupId == giftItem.giftGroupId) {
						hitGroup = temps[jjj];
						break;
					}
				}
				if (!hitGroup) {
					hitGroup = {
						giftGroupId: giftItem.giftGroupId,
						giftItems: []
					}
					temps.push(hitGroup);
				}
				hitGroup.giftItems.push(giftItem);
			}
		}
		temps.sort((instA, instB) => {
			return Number(instA.giftGroupId) - Number(instB.giftGroupId);
		})
		for (let i = temps.length - 1; i >= 0; i--) {
			let isHasBuy = false;
			let giftItems = temps[i].giftItems;
			for (let jjj = 0; jjj < giftItems.length; jjj++) {
				let giftItem = giftItems[jjj];
					let gift;
					if (isSeven == 1) {
						gift = GameServerData.getInstance().getPaySevenGiftGroupRecord(giftItem.id);
					} else {
						gift = GameServerData.getInstance().getPayGiftGroupRecord(giftItem.id);
					}
					if (gift && gift.count >= Number(giftItem.buyCount)) {
						// 买完了。
					} else {
						isHasBuy = true;
					}
			}
			if (isHasBuy || !isCanBuyOnly) {
				temps[i].giftItems.sort((instA, instB) => {
					return Number(instA.id) - Number(instB.id);
				})
			} else if (temps.length > 1) {
				temps.splice(i, 1);
			}
		}
		return temps;
	}

	/**
	 * 获得当前激活的礼包组。
	 */
	public static getActiveSevenGiftGroups(isCanBuyOnly?:boolean): Array<any> {
		return this.getActiveGiftGroups(isCanBuyOnly, 1);
	}

	/**
	 * 获得仙缘充值。
	 */
	public static getFairyGiftItem(): Array<any> {
		let temps = new Array<any>();
		let fileObj: any = LocaleData.getObject("Pay");
		let xianyuanGiftGroup:string = fileObj._root[0].xianyuanGiftGroup;
		let items: Array<any> = fileObj._root[0]._gift[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].giftGroupId == xianyuanGiftGroup) {
				temps.push(items[i]);
			}
		}
		return temps;
	}

	/**
	 * 获得仙缘功能物品数据。
	 */
	public static getFairyItem(): Array<any> {
		let fileObj: any = LocaleData.getObject("Pay");
		let items: Array<any> = fileObj._root[0]._xianyuan[0]._item;
		return items;
	}

	/**
	 * 获得仙缘功能物品数据。
	 */
	public static getFairyCishuGift(id): any {
		id = String(id)
		let fileObj: any = LocaleData.getObject("Pay");
		let items: Array<any> = fileObj._root[0]._xyfl[0]._item;
		if(id == "-1"){
			return items[0];
		}else{
			let nowIndex = 0
			for (let index = 0; index < items.length; index++) {
				if (items[index].id == id) {
					nowIndex = index + 1
				}
			}
			if (nowIndex < items.length) {
				return items[nowIndex];
			}else{
				return items[items.length - 1];
			}
			
		}
	}

	/**
	 * 获得仙缘功能物品数据。
	 */
	public static getPayRoot(): any {
		let fileObj: any = LocaleData.getObject("Pay");
		return	fileObj._root[0];
	}

	/**
	 * 获得选择礼包组的，某"组"的（物品+货币）奖励结构。
	 */
	public static getPayChooseBonuseItemsByGroup(fixItems:string): Array<BonuseItem> {
		let temps = new Array<BonuseItem>();
		let fileObj: any = LocaleData.getObject("Pay");
		let items: Array<any> = fileObj._root[0]._item[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].groupId == fixItems) {
				let item = items[i];
				if (item.equipId.length > 1) {
					temps.push(UtilsUI.getBonuseItem(VarVal.bonusType.equip, null, item.equipId, item.count));
				}
				if (item.protoId.length > 1) {
					temps.push(UtilsUI.getBonuseItem(VarVal.bonusType.item, null, item.protoId, item.count));
				}
				if (item.btype.length > 0) {
					temps.push(UtilsUI.getBonuseItem(item.btype, null, null, item.bvalue));
				}
			}
		}
		return temps;
	}

	/**
	 * 获得选择礼包组的，某组。
	 */
	public static getPayChooseItemsByGroup(fixItems:string): Array<any> {
		let temps = new Array<any>();
		let fileObj: any = LocaleData.getObject("Pay");
		let items: Array<any> = fileObj._root[0]._item[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].groupId == fixItems && (items[i].sysId == "" || GameServerData.getInstance().isActivationSys(items[i].sysId))) {
				temps.push(items[i]);
			}
		}
		return temps;
	}

	/**
	 * 获得选择礼包组的，单"项"的（物品+货币）奖励结构。
	 */
	public static getPayChooseBonuseItems(id:string | number): Array<BonuseItem> {
		id = String(id);
		let temps = new Array<BonuseItem>();
		let fileObj: any = LocaleData.getObject("Pay");
		let items: Array<any> = fileObj._root[0]._item[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				let item = items[i];
				if (item.protoId.length > 1) {
					temps.push(UtilsUI.getBonuseItem(VarVal.bonusType.item, null, item.protoId, item.count));
				}
				if (item.btype.length > 0) {
					temps.push(UtilsUI.getBonuseItem(item.btype, null, null, item.bvalue));
				}
			}
		}
		return temps;
	}

	/**
	 * 获得选择礼包组的，单项。
	 */
	public static getPayChooseItem(id:string): any {
		let fileObj: any = LocaleData.getObject("Pay");
		let items: Array<any> = fileObj._root[0]._item[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}
		}
	}

	public static getPayWeekCard(id:string | number): any {
		let items: Array<any> = LocaleData.getPayRoot()._weekCard[0]._item
		for (let i = 0; i < items.length; i++) {
			if (items[i].id == id) {
				return items[i];
			}
		}
	}

	//神通
	public static getTheurgyRoot(): any{
		let fileObj: any = LocaleData.getObject("Theurgy");
		let items: Array<any> = fileObj._root[0]
		return items
	}
	
	public static getTheurgyById(id:string|number){
		id = String(id);
		let items: Array<any> = this.getTheurgyRoot()._theurgy[0]._item;
		for (let index = 0; index < items.length; index++) {
			if (id == items[index].id) {
				return items[index]
			}
		}
	}

	public static getTheurgTypeById(id:string|number): any{
		id = String(id);
		let items: Array<any> = this.getTheurgyRoot()._type[0]._item;
		for (let index = 0; index < items.length; index++) {
			const element = items[index];
			if (items[index].id == id) {
				return items[index]
			}
		}
	}

	public static getTheurgLevel(): any {
		let items: Array<any> = this.getTheurgyRoot()._theurgyLevel[0]._item;
		return items
	}
	public static getTheurgLevelByLevel(level:string|number): any {
		level = String(level)
		let items: Array<any> = this.getTheurgLevel();
		if (Number(level) >= items.length)
		{
		 	return items[items.length - 1]
		}
		for (let index = 0; index < items.length; index++) {
			const element = items[index];
			if (items[index].level == level) {
				return items[index]
			}
		}

	}

	public static getTheurgPhase(phase:string|number){
		phase = String(phase)
		let items: Array<any> = this.getTheurgyRoot()._phase[0]._item;
		if (Number(phase) >= items.length)
		{
		 	return items[items.length - 1]
		}else{
			for (let index = 0; index < items.length; index++) {
				if (items[index].phase == phase) {
					return items[index]
				}
			}
		}
	}

	/**
	 * 获得对应品质protoId神通碎片原型。
     */
	public static getTheurgFragProtosByQuality(quality: string | number, exProtoId:string): Array<any> {
		quality = String(quality);
		let temps = new Array<any>();
		let items: Array<any> = this.getTheurgyRoot()._theurgy[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (items[i].quality == quality && items[i].id != exProtoId) {
				temps.push(items[i]);
			}
		}
		return temps;
	}

	public static getTheurgQua(qua:string|number){
		qua = String(qua)
		let items: Array<any> = this.getTheurgyRoot()._quality[0]._item;
		for (let index = 0; index < items.length; index++) {
			if (String(items[index].id) == qua) {
				return items[index]
			}
		}
	}

	public static getTheurgCatalog(id:string|number) :any{
		id = String(id)
		let items: Array<any> = this.getTheurgyRoot()._catalog[0]._item;
		for (let index = 0; index < items.length; index++) {
			if (items[index].id == id) {
				return items[index]
			}
		}
	}

	public static getTheurgCatalogs() :any{
		return this.getTheurgyRoot()._catalog[0]._item;
	}

	public static getTheurgCatalogLevel(level:string|number) :any{
		level = String(level)
		let items: Array<any> = this.getTheurgyRoot()._catalogLevel[0]._item;
		if (Number(level) >= items.length)
		{
		 	return items[items.length - 1]
		}
		for (let index = 0; index < items.length; index++) {
			if (items[index].level == level) {
				return items[index]
			}
		}
	}

	public static getTheurgAttr(id:string|number) :any{
		id = String(id)
		let items: Array<any> = this.getTheurgyRoot()._attr[0]._item;
		for (let index = 0; index < items.length; index++) {
			if (items[index].id == id) {
				return items[index]
			}
		}
	}

	public static getTheurgNextGuarantees(times) :any{
		times = Number(times)
		let items: Array<any> = this.getTheurgyRoot()._specialGuarantees[0]._item;
		for (let index = 0; index < items.length; index++) {
			if (Number(items[index].time) > times) {
				return items[index]
			}
		}
	}

	public static getTheurgGuarantees(id) :any{
		id = String(id)
		let items: Array<any> = this.getTheurgyRoot()._specialGuarantees[0]._item;
		for (let index = 0; index < items.length; index++) {
			if (items[index].id == id) {
				return items[index]
			}
		}
	}

	public static getTheurgAllGuarantees() :any{
		return this.getTheurgyRoot()._specialGuarantees[0]._item;
	}

	public static getTheurgProbability(id) :any{
		id = String(id)
		let items: Array<any> = this.getTheurgyRoot()._specialProbability[0]._item;
		for (let index = 0; index < items.length; index++) {
			if (items[index].id == id) {
				return items[index]
			}
		}
	}

	public static getTheurgSealByItemId(itemId:string|number) :any{
		itemId = String(itemId)
		let items: Array<any> = this.getTheurgyRoot()._seal[0]._item;
		for (let index = 0; index < items.length; index++) {
			if (items[index].id == itemId) {
				return items[index]
			}
		}
	}

	public static getCharacterById(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Character");
		let items: Array<any> = fileObj._root[0]._activity[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (id == items[i].id) {
				return items[i]
			}
		}
	}
	
	public static getCharacterActivity(): any {
		let fileObj: any = LocaleData.getObject("Character");
		let items: Array<any> = fileObj._root[0]._activity[0]._item;
		return items 
	}
	public static getCharacterAvatar(): any {
		let fileObj: any = LocaleData.getObject("Character");
		let items: Array<any> = fileObj._root[0]._avatar[0]._item;
		return items 
	}
	public static getCharacterAvatarBorder(): any {
		let fileObj: any = LocaleData.getObject("Character");
		let items: Array<any> = fileObj._root[0]._avatarBorder[0]._item;
		return items 
	}
	public static getCharacterChatBubble(): any {
		let fileObj: any = LocaleData.getObject("Character");
		let items: Array<any> = fileObj._root[0]._chatBubble[0]._item;
		return items 
	}
	public static getCharacterTitleByType(type: string | number): any {
		type = String(type);
		let fileObj: any = LocaleData.getObject("Character");
		let items: Array<any> = fileObj._root[0]._title[0]._item;
		let arr :Array<any>= []
		for (let i = 0; i < items.length; i++) {
			if (type == items[i].type) {
				arr.push(items[i])
			}
		}
		return arr 
	}
	public static getCharacterTitle(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Character");
		let items: Array<any> = fileObj._root[0]._title[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (id == items[i].id) {
				return items[i];
			}
		}
	}
	public static getCharacterAttrById(id: string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Character");
		let items: Array<any> = fileObj._root[0]._attr[0]._item;
		for (let i = 0; i < items.length; i++) {
			if (id == items[i].id) {
				return items[i]
			}
		}
		return items
	}
	public static getCharacterSuitArr(group: string | number): any  {
		group = String(group)
		let fileObj: any = LocaleData.getObject("Character")
		let items: Array<any> = fileObj._root[0]._suit[0]._item;
		let arr: Array<any> = []
		for (let i = 0; i < items.length; i++) {
			if (items[i].group == group) {
				arr.push(items[i])
			}			
		}
		return arr;
	}

	public static getAvatarOpen(type: string | number, id: string | number):boolean{
		type = String(type)
			id = String(id)
		let isOpen :boolean = false
		let fullInfo :any=  GameServerData.getInstance().getPlayerFullInfo()
		if (type == AvatarType.PHASE) {
			isOpen = LocaleData.getCharSuitItem(id).phase > fullInfo.base.phase
		} else if (type == AvatarType.ACTIVITY) {
	
		} else if (type == AvatarType.ELITE) {
			for (let i = 0; i < fullInfo.elitemonsterInfo.elitemonsterDebris.length; i++) {
				if (fullInfo.elitemonsterInfo.elitemonsterDebris[i] == id) {
					isOpen = true
				}
			}
		} else if (type == AvatarType.PET) {
			for (let i = 0; i < fullInfo.petModuleInfo.pet.length; i++) {
				if (fullInfo.petModuleInfo.pet[i].protoId == id) {
					isOpen = true
				}
			}
		} 
		return isOpen
	}

	//福地物品
	public static getHavenItem(id) :any{
        id = String(id);
        let items: Array<any> = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.HAVEN)._resource[0]._item;
        for (let index = 0; index < items.length; index++) {
            let element = items[index];
            if (element.id == id) {
                return element
            }
        }
    }

	public static getHavenWorker(tl, extAdd?) :any{
        tl = Number(tl);
		if (!extAdd) {
			extAdd = 0
		}
		let num = 0
        let items: Array<any> = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.HAVEN)._worker[0]._item;
        for (let index = 0; index < items.length; index++) {
            let element = items[index];
			num = num + Number(element.stamina)
			if (index == 0) {
				num = num + extAdd
			}
            if (tl < num) {
                return element
            }
        }
		return items[items.length - 1]
    }

	public static getHavenTrain(lv) :any{
        lv = String(lv);
        let items: Array<any> = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.HAVEN)._train[0]._item;
        for (let index = 0; index < items.length; index++) {
            let element = items[index];
            if (element.trainLevel == lv) {
                return element
            }
        }
    }

	public static getHavenHire(number) :any{
        number = String(number);
        let items: Array<any> = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.HAVEN)._hire[0]._item;
        for (let index = 0; index < items.length; index++) {
            let element = items[index];
            if (element.number == number) {
                return element
            }
        }
    }

	public static getHavenAcquisition(number1, number2) :any{
        number1 = String(number1);
        number2 = String(number2);
        let items: Array<any> = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.HAVEN)._acquisition[0]._item;
        for (let index = 0; index < items.length; index++) {
            let element = items[index];
            if (element.owner == number1 && element.attacker == number2) {
                return element
            }
        }
    }

	//合成
	public static getAllItemMerge() :any{
		let fileObj: any = LocaleData.getObject("ItemMerge");
		return fileObj._root[0]._item
    }

	public static getItemMergeById(id) :any{
		id = String(id)
		let allItems = LocaleData.getAllItemMerge()
		for (let index = 0; index < allItems.length; index++) {
			const element = allItems[index];
			if (element.id == id) {
				return element
			}
		}
    }

	//系统开启
	public static getActivation(id: string | number): any  {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Activation");
		let items: Array<any> =	 fileObj._root[0]._sys[0]._item
		for (let index = 0; index < items.length; index++) {
			if (items[index].id == id) {
				return items[index];
			}
		}
	}

	//系统开启全部
	public static getActivationAll(): Array<any>  {
		let fileObj: any = LocaleData.getObject("Activation");
		return fileObj._root[0]._sys[0]._item
	}

	// 琅琊榜
	public static getPalaceRoot(): any {
		let fileObj: any = LocaleData.getObject("Palace");
		return fileObj._root[0];
	}

	// 琅琊榜
	public static getPalaceItems(): Array<any> {
		let fileObj: any = LocaleData.getObject("Palace");
		let items: Array<any> =	 fileObj._root[0]._palace[0]._item;
		items.sort((itemA, itemB) => {
			return itemB.id - itemA.id;
		})
		return items;
	}

	// 琅琊榜宫殿
	public static getPalaceItem(id:string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Palace");
		let items: Array<any> =	 fileObj._root[0]._palace[0]._item;
		for (let index = 0; index < items.length; index++) {
			if (items[index].id == id) {
				return items[index];
			}
		}
	}

	// 琅琊榜商店物品
	public static getPalaceGoodItems(): Array<any> {
		let fileObj: any = LocaleData.getObject("Palace");
		let items: Array<any> =	 fileObj._root[0]._goods[0]._item;
		return items;
	}

	// 琅琊榜赐福语句
	public static getPalaceGrantItems(): Array<any> {
		let fileObj: any = LocaleData.getObject("Palace");
		let items: Array<any> =	 fileObj._root[0]._grant[0]._item;
		return items;
	}

	// 琅琊榜赐福语句
	public static getPalaceGrantItem(id:string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Palace");
		let items: Array<any> =	 fileObj._root[0]._grant[0]._item;
		for (let index = 0; index < items.length; index++) {
			if (items[index].id == id) {
				return items[index];
			}
		}
	}

	// 琅琊榜BUFF
	public static getPalaceBuffItems(): Array<any> {
		let fileObj: any = LocaleData.getObject("Palace");
		return fileObj._root[0]._buff[0]._item;
	}

	// 琅琊榜BUFF
	public static getPalaceBuffItem(id:string | number): any {
		id = String(id);
		let fileObj: any = LocaleData.getObject("Palace");
		let items: Array<any> =	 fileObj._root[0]._buff[0]._item;
		for (let index = 0; index < items.length; index++) {
			if (items[index].id == id) {
				return items[index];
			}
		}
	}

	//广告
	public static getAdXml(id: string | number): any{
		id = String(id)
		let fileObj: any = LocaleData.getObject("Ad");
		let items: Array<any> =	 fileObj._root[0]._ad[0]._item
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			if (element.id == id) {
				return element
			}
		}
	}

	/**
     * 获得坊市对应奖励类型。
     */
    public static getShopItemBonusType(itemId:string):string {
        if (itemId == VarVal.propertyID.chance) {
            return VarVal.bonusType.chance;
        } else if (itemId == VarVal.propertyID.stone) {
            return VarVal.bonusType.stone;
        } else if (itemId == VarVal.propertyID.money) {
            return VarVal.bonusType.money;
        } else if (itemId == VarVal.propertyID.exp) {
            return VarVal.bonusType.exp;
        } else if (itemId == VarVal.propertyID.physical) {
            return VarVal.bonusType.physical;
        }
    }

	/**
     * 获得奖励对应坊市类型。
     */
    public static getShopItemBonusShopType(bonusType:string):string {
        if (bonusType == VarVal.bonusType.chance) {
            return VarVal.propertyID.chance;
        } else if (bonusType == VarVal.bonusType.stone) {
            return VarVal.propertyID.stone;
        } else if (bonusType == VarVal.bonusType.money) {
            return VarVal.propertyID.money;
        } else if (bonusType == VarVal.bonusType.exp) {
            return VarVal.propertyID.exp;
        } else if (bonusType == VarVal.bonusType.physical) {
            return VarVal.propertyID.physical;
        }
    }
	
	/**
	 * 帮派root
	 */
	public static getClanRoot(): any  {
		return LocaleData.getObject("Clan")._root[0];
	}
	/**
	 * 帮派旗帜
	 */
	public static getClanFlag(): any  {
		let fileObj: any = LocaleData.getObject("Clan");
		let items: Array<any> =	 fileObj._root[0]._flag[0]._item
		return items
	}
	/**
	 * 帮派旗帜通过id
	 */
	public static getClanFlagById(id:number|string): any  {
		let fileObj: any = LocaleData.getObject("Clan");
		let items: Array<any> =	 fileObj._root[0]._flag[0]._item
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			if (element.id ==String(id)) {
				return element
			}
		}
	}
		/**
	 * 帮派旗帜通过id
	 */
	 public static getClanDialogueByPrice(price:number|string): any  {
		price = Number(price)
		let fileObj: any = LocaleData.getObject("Clan");
		let items: Array<any> =	 fileObj._root[0]._dialogue[0]._item
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			let prices = element.priceInterval.split(",")
			if (Number(prices[0]) < price && Number(prices[1]) >= price)  {
				return element
			}
		}
	}
	/**
	 * 帮派信息通过等级
	 */
	public static getClanByLevel(level:number|string): any  {
		let fileObj: any = LocaleData.getObject("Clan");
		let items: Array<any> =	 fileObj._root[0]._clan[0]._item
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			if (element.level ==String(level)) {
				return element
			}
		}
	}
	/**
	 * 帮派商店通过类型
	 */
	public static getClanShopByType(type:number|string): any  {
		type = String(type)
		let fileObj: any = LocaleData.getObject("Clan");
		let items: Array<any> =	 fileObj._root[0]._goods[0]._item
		let arr :any = []
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			if (element.type == type) {
				arr.push(element)
			}
		}
		return arr
	}
	/**
	 * 帮派商店
	 */
	public static getClanShop(): any  {
		let fileObj: any = LocaleData.getObject("Clan");
		let items: Array<any> =	 fileObj._root[0]._goods[0]._item
		return items
	}
	/**
	 * 帮派充值活动
	 */
	 public static getClanRechargeByType(type:number|string): any  {
		type = String(type)
		let fileObj: any = LocaleData.getObject("Clan");
		let items: Array<any> =	 fileObj._root[0]._recharge[0]._item
		let arr :any = []
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			if (element.event == type) {
				arr.push(element)
			}
		}
		return arr
	}
	
	/**
	 * 帮派怪物通过id
	 */
	public static getClanMonsterById(id:number|string): any  {
		let fileObj: any = LocaleData.getObject("Clan");
		let items: Array<any> =	 fileObj._root[0]._monster[0]._item
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			if (element.id ==String(id)) {
				return element
			}
		}
		return items
	}
	/**
	 * 帮派阶段通过id
	 */
	public static getClanPhaseById(id:number|string): any  {
		let fileObj: any = LocaleData.getObject("Clan");
		let items: Array<any> =	 fileObj._root[0]._phase[0]._item
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			if (element.id ==String(id)) {
				return element
			}
		}
		return items
	}

	/**
	 * 帮派活跃通过id
	 */
	public static getClanActiveById(id:number|string): any  {
		let fileObj: any = LocaleData.getObject("Clan");
		let items: Array<any> =	 fileObj._root[0]._active[0]._item
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			if (element.id ==String(id)) {
				return element
			}
		}
		return items
	}

	/**
	 * 帮派神秘商店通过id
	 */
	 public static getClanMerchantById(id:number|string): any  {
		id = String(id)
		let fileObj: any = LocaleData.getObject("Clan");
		let items: Array<any> =	 fileObj._root[0]._merchant[0]._item
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			if (element.id == id) {
				return element
			}
		}
		return items
	}

	/**
	 * 单刀赴会
	 */
	public static getClanSoloRoot(): any  {
		let fileObj: any = LocaleData.getObject("ClanSolo");
		let items: Array<any> =	 fileObj._root[0]
		return items
	}

	/**
	 * 单刀赴会商店
	 */
	public static getClanSoloShop(): any  {
		let fileObj: any = LocaleData.getObject("ClanSolo");
		let items: Array<any> =	 fileObj._root[0]._goods[0]._item
		return items
	}

	/**
	 * 单刀赴会排名奖励
	 */
	public static getClanSoloRank(day): any  {
		let fileObj: any = LocaleData.getObject("ClanSolo");
		let items: Array<any> =	 fileObj._root[0]._rank[0]._item
		let createDay:number = GameServerData.getInstance().getServerCreateDay() - Number(day)
		let itemArr = []
		let maxIndex = 11
		for (let i = 0; i < items.length; i++) {
			let element = items[i];
			if (Number(element.serverDay) <= createDay&&maxIndex>0) {
				itemArr.push(element)
				maxIndex--
			}
		}
		return itemArr
	}

	/**
	 * 单刀赴会任务
	 */
	 public static getClanSoloTaskByType(type:number|string): any  {
		type = String(type)
		let fileObj: any = LocaleData.getObject("ClanSolo");
		let items: Array<any> =	 fileObj._root[0]._task[0]._item
		let arr = []
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			if (element.type == type) {
				arr.push(element)
			}
		}
		return arr
	}

	/**
	 * 单刀赴会礼包
	 */
	public static getClanSoloGift(): any  {
		let fileObj: any = LocaleData.getObject("ClanSolo");
		let items: Array<any> =	 fileObj._root[0]._gift[0]._item
		return items
	}

	/**
	 * 单刀赴会过关斩将礼包
	 */
	public static getClanSoloPassport(): any  {
		let fileObj: any = LocaleData.getObject("ClanSolo");
		let items: Array<any> =	 fileObj._root[0]._passport[0]._item
		return items
	}

	/**
	 * 单刀赴会buff
	 */
	public static getClanSoloBuff(id:number|string): any  {
		id = String(id)
		let fileObj: any = LocaleData.getObject("ClanSolo");
		let items: Array<any> =	 fileObj._root[0]._buff[0]._item
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			if (element.id == id) {
				return element
			}
		}
		return items
	}

	/**
	 * 单刀赴会排名
	 */
	public static getClanSoloRanking(): any  {
		let fileObj: any = LocaleData.getObject("ClanSolo");
		let items: Array<any> =	 fileObj._root[0]._ranking[0]._item
		return items
	}

	/**
	 * 单刀赴会结算
	 */
	public static getClanSoloWin(): any  {
		let fileObj: any = LocaleData.getObject("ClanSolo");
		let items: Array<any> =	 fileObj._root[0]._win[0]._item
		return items
	}

	/**
	 * 我要变强
	 */
	public static getStronger(): any  {
		let fileObj: any = LocaleData.getObject("stronger");
		let items: Array<any> = fileObj._root[0]._list[0]._item
		return items
	}
	public static getStrongerAttr(id:number|string): any  {
		id = String(id)
		let fileObj: any = LocaleData.getObject("stronger");
		let items: Array<any> =	 fileObj._root[0]._attr[0]._item
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			if (element.id == id) {
				return element
			}
		}
		return items
	}
	public static getStrongerGameOptions(id:number|string): any  {
		id = String(id)
		let fileObj: any = LocaleData.getObject("stronger");
		let items: Array<any> =	 fileObj._root[0]._gameOptions[0]._item
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			if (element.id == id) {
				return element
			}
		}
		return items
	}
	public static getStrongerAttrSet(id:number|string): any  {
		id = String(id)
		let fileObj: any = LocaleData.getObject("stronger");
		let items: Array<any> =	 fileObj._root[0]._attrSet[0]._item
		for (let index = 0; index < items.length; index++) {
			let element = items[index];
			if (element.id == id) {
				return element
			}
		}
		return items
	}
	/**
	 * 灵泉获取最高称号质量title
	 */
	public static getMaxSptingTitle(titles): any  {
		if (!titles) {
			titles = []
		}
		let maxQua: number = 0		
		for (let index = 0; index < titles.length; index++) {
			let element = titles[index];
			let titleProto = LocaleData.getCharacterTitle(element.cfgId)
			if (Number(titleProto.quality) > maxQua) {
				maxQua = Number(titleProto.quality)
			}
		}
       	let titleAdd: any = LocaleData.getActivityXml(VarVal.ACTIVITY_ID.SPRING)._title[0]._item
		for (let index = 0; index < titleAdd.length; index++) {
			let element = titleAdd[index];
			if (Number(element.quality) == maxQua) {
				return element
			}
		}
	}

	//攻城掠地
	public static getGrabCityRoot(): any  {
		return LocaleData.getActivityXml(VarVal.ACTIVITY_ID.GRABCITY);
	}

	public static getGrabCityPrepare(level: string|number): any  {
		level = String(level)
		let all = LocaleData.getGrabCityRoot()._prepare[0]._item;
		for (let index = 0; index < all.length; index++) {
			let element = all[index];
			if (element.level == level) {
				return element
			}
		}
		return null
	}

	public static getGrabCityPreCost(count): any {
		count = String(count)
		let all = LocaleData.getGrabCityRoot()._preCost[0]._item;
		for (let index = 0; index < all.length; index++) {
			let element = all[index];
			if (element.count == count) {
				return Number(element.cost)
			}
		}
		return 0
	}

	/**
	 * 攻城排名奖励
	 */
	public static getGrabCityRank(day): any  {
		let fileObj: any = LocaleData.getObject("ClanSolo");
		let items: Array<any> =	 fileObj._root[0]._rank[0]._item
		let createDay:number = GameServerData.getInstance().getServerCreateDay() - Number(day)
		let itemArr = []
		let maxIndex = 11
		for (let i = 0; i < items.length; i++) {
			let element = items[i];
			if (Number(element.serverDay) <= createDay&&maxIndex>0) {
				itemArr.push(element)
				maxIndex--
			}
		}
		return itemArr
	}

	/**
	 * 攻城帮派排名积分
	 */
	public static getGrabCityCombatScore(battlefield: string | number, rank: string | number): any  {
		battlefield = String(battlefield)
		rank = Number(rank)
		let items: Array<any> = LocaleData.getGrabCityRoot()._combat[0]._item;
		for (let i = 0; i < items.length; i++) {
			let element = items[i];
			if (rank >= Number(element.minRank) && rank <= Number(element.maxRank)  && battlefield == element.battlefield) {
				return element.score
			}
		}
		return "0"
	}

	public static getBrumeIsleRoot(): any  {
		return LocaleData.getObject("ActivityDomainMonster")._root[0];
	}

	public static getBrumeIsleConfig(): any  {
		return LocaleData.getObject("ActivityDomainMonster")._root[0]._config[0]._item[0];
	}

	/**
	 * 雾隐岛获取特殊事件
	 */
	public static getBrumeIsleSpecialEvent(id): any  {
		id = String(id)
       	let all: any = LocaleData.getBrumeIsleRoot()._specialEvents[0]._item
		for (let index = 0; index < all.length; index++) {
			let element = all[index];
			if (Number(element.id) == id) {
				return element
			}
		}
	}

	/**
	 * 雾隐岛获取特殊事件
	 */
	public static getBrumeIsleTask(type): any  {
		type = String(type)
		let arr = []
       	let all: any = LocaleData.getBrumeIsleRoot()._task[0]._item
		for (let index = 0; index < all.length; index++) {
			let element = all[index];
			if (element.type == type) {
				arr.push(element)
			}
		}
		return arr
	}

	/**
	 * 雾隐岛获取怪物
	 */
	public static getBrumeIsleMonster(id): any  {
		id = String(id)
       	let all: any = LocaleData.getBrumeIsleRoot()._monster[0]._item
		for (let index = 0; index < all.length; index++) {
			let element = all[index];
			if (Number(element.id) == id) {
				return element
			}
		}
	}

	/**
	 * 雾隐岛获取怪物
	 */
	public static getBrumeIsleText(id): any  {
		id = String(id)
       	let all: any = LocaleData.getBrumeIsleRoot()._text[0]._item
		for (let index = 0; index < all.length; index ++) {
			let element = all[index];
			if (Number(element.id) == id) {
				return element
			}
		}
	}

	/**
	 * 雾隐岛获取层数
	 */
	public static getBrumeIsleZone(id): any  {
		id = String(id)
       	let all: any = LocaleData.getBrumeIsleRoot()._groupProbability[0]._item
		for (let index = 0; index < all.length; index ++) {
			let element = all[index];
			if (Number(element.group) == id) {
				return element
			}
		}
	}

	/**
	 * 雾隐岛笔记
	 */
	public static getBrumeIsleNote(day: number|string, zone: number|string): any  {
		if (day == 0) {
			day = 1
		}
		day = Number(day)
		zone = String(zone)
		let all = []
       	let allmonster: any = LocaleData.getBrumeIsleRoot()._monster[0]._item
		for (let index = 0; index < allmonster.length; index ++) {
			let element = allmonster[index];
			let openDays = element.openDays.split(";")
			if(Number(openDays[0]) <= day && Number(openDays[1]) >= day && zone == element.group) {
				all.push(element)
			}
		}

		let allSpecial: any = LocaleData.getBrumeIsleRoot()._specialEvents[0]._item
		for (let index = 0; index < allSpecial.length; index ++) {
			let element = allSpecial[index];
			let openDays = element.openDays.split(";")
			if(Number(openDays[0]) <= day && Number(openDays[1]) >= day && zone == element.group && element.type != "2") {
				all.push(element)
			}
		}
		return all
	}

	public static getBrumeIslePayGift(id: number| string): any  {
		id = String(id)
       	let all: any = LocaleData.getBrumeIsleRoot()._payGift[0]._item
		for (let index = 0; index < all.length; index ++) {
			let element = all[index];
			if (id == element.index) {
				return element
			}
			
		}
		return null
	}
	//八荒
	public static getConquestRoot(): any  {
		let fileObj: any = LocaleData.getObject("Conquest");
		let items: Array<any> =	 fileObj._root[0]
		return items
	}	

	// 获得八荒排行榜奖励
	public static getConquestRankRewardItems(isFaction: boolean): Array<any>  {
		let fileObj: any = LocaleData.getObject("Conquest");
		if (isFaction) {
			return fileObj._root[0]._gRanking[0]._item;
		} else {
			return fileObj._root[0]._pRanking[0]._item;
		}
	}

	// 获得八荒任务数据
	public static getConquestTaskItems(): Array<any>  {
		let fileObj: any = LocaleData.getObject("Conquest");
		return fileObj._root[0]._task[0]._item;
	}

	//八荒地图大小根据人数
	public static getConquestSceneByNum(num: number| string): any  {
		num = Number(num)
		let fileObj: any = LocaleData.getObject("Conquest");
		let items: Array<any> =	 fileObj._root[0]._scene[0]._item
		for (let index = items.length - 1; index >= 0; index--) {
			let element = items[index];
			if (num >= Number(element.maxNumber)) {
				return element
			}
		}
	}
	//八荒地图大小根据id陕西
	public static getConquestSceneById(id: number| string): any  {
		id = String(id)
		let fileObj: any = LocaleData.getObject("Conquest");
		let items: Array<any> =	 fileObj._root[0]._scene[0]._item
		for (let i = 0; i < items.length; i++) {
			let element = items[i];
			if (id == element.id) {
				return element
			}
		}
	}
	// 八荒 获取怪物
	public static getConquestMonsterById(id: number| string): any  {
		id = String(id)
		let fileObj: any = LocaleData.getObject("Conquest");
		let items: Array<any> =	 fileObj._root[0]._monster[0]._item
		for (let i = 0; i < items.length; i++) {
			let element = items[i];
			if (id == element.id) {
				return element
			}
		}
	}

	// 八荒 获取任务
	public static getConquestTaskById(id: number| string): any  {
		id = String(id)
		let fileObj: any = LocaleData.getObject("Conquest");
		let items: Array<any> =	 fileObj._root[0]._task[0]._item
		for (let i = 0; i < items.length; i++) {
			let element = items[i];
			if (id == element.id) {
				return element
			}
		}
	}
	// 八荒 获取连杀公告
	public static getConquestContinuityNoticeByNum(num: number| string): any  {
		num = Number(num)
		let fileObj: any = LocaleData.getObject("Conquest");
		let items: Array<any> =	 fileObj._root[0]._continuityNotice[0]._item
		for (let i = 0; i < items.length; i++) {
			const element = items[i];
			if (num <= Number(element.continuity)) {
				return element
			}
		}
	}
	// 八荒 获取累杀公告
	public static getConquestCumulativeNoticeByNum(num: number| string): any  {
		num = Number(num)
		let fileObj: any = LocaleData.getObject("Conquest");
		let items: Array<any> =	 fileObj._root[0]._cumulativeNotice[0]._item
		for (let i = 0; i < items.length; i++) {
			const element = items[i];
			if (num <= Number(element.cumulative)) {
				return element
			}
		}
	}
	// 八荒 获取排名
	public static getConquestRankingByRange(range?: number| string): any  {
		let fileObj: any = LocaleData.getObject("Conquest");
		let items: Array<any> = fileObj._root[0]._ranking[0]._item
		if (range) {
			range = Number(range)
			for (let i = 0; i < items.length; i++) {
				const element = items[i];
				let rangeStr = element.range.split(";")
				if (range>=Number(rangeStr[0])&&range<=Number(rangeStr[1])) {
					return element
				}
			}	
		}else{
			return items
		}
	}
}