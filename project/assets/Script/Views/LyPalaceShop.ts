//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { ViewLayer } from "../Kernel/ViewLayer";
import * as fgui from "fairygui-cc";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { LocaleData, ModelShowInfo } from "../Kernel/LocaleData";
import { UtilsTool } from "../Kernel/UtilsTool";
import { StrVal } from "../Values/StrVal";
import { UtilsUI } from "../Kernel/UtilsUI";
import { LyGuideGetItem } from "./LyGuideGetItem";
import { GameServerData } from "../Kernel/GameServerData";
import { BattleTestResShow, LyBattleMain } from "./LyBattleMain";
import { SpineRoldMountPlayer } from "../Kernel/SpinePlayer";
import { GameServer } from "../Kernel/GameServer";

export class LyPalaceShop extends ViewLayer {
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.LyPalace;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.LyPalace;
        this.viewResI.comName = "LyPalaceShop";
    }

    private grantItemId:string;
    private shopItems:Array<any>;

    private currShowIndex:number;
    private charInfo:ModelShowInfo;
    private sRMPlayer:SpineRoldMountPlayer;

    public onViewCreate(params:any):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");

        let btn_acyivity:fgui.GButton = group_main.getChild("btn_acyivity");
        btn_acyivity.text = StrVal.LYPALACE.STR10;
        btn_acyivity.onClick(() => {
            
        })
        btn_acyivity.selected = true;
        UtilsUI.updateTabButtonColor(btn_acyivity);

        this.grantItemId = LocaleData.getPalaceRoot().grantItemId;
        this.shopItems = LocaleData.getPalaceGoodItems();

        let btn_close:fgui.GButton = uiPanel.getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyPalaceShop, 0, null);
        })

        let btn_add:fgui.GButton = uiPanel.getChild("btn_add");
        btn_add.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_PUSH, LyGuideGetItem, 0, {
                bonuseItem: UtilsUI.getBonuseItem(VarVal.bonusType.item, null, this.grantItemId, "1")
            });
        })

        let proto = LocaleData.getItemProto(this.grantItemId);
        let loader_icon:fgui.GLoader = uiPanel.getChild("loader_icon");
        loader_icon.url = UtilsTool.stringFormat("ui://CCommon/{0}", [proto.icon]);

        let label_desc:fgui.GButton = uiPanel.getChild("label_desc");
        label_desc.text = UtilsTool.stringFormat(StrVal.LYPALACE.STR8, [proto.name]);

        let btn_play:fgui.GButton = uiPanel.getChild("btn_play");
        btn_play.text = StrVal.LYPALACE.STR9;
        btn_play.onClick(() => {
            let battleResult = LyBattleMain.createrBattleResultOneRound("1010", this.charInfo.normalSkill, "14001");
            let resShow:BattleTestResShow = {
                // 会覆盖上面的模型（参数3）
                spine:this.charInfo.spine,
                skin:this.charInfo.skin,
            }
            LyBattleMain.showVirtualBattle(battleResult, VarVal.BATTLE_TYPE.PLAYVIRTUAL_SKIN, resShow, true);
        })

        // 列表
        let list_item:fgui.GList = group_main.getChild("list_item");
        list_item.setVirtual();
        list_item.itemRenderer = (index:number, child:fgui.GComponent) => {
            let shopItem = this.shopItems[index];
            let suitItem = LocaleData.getCharActivityItemByGoodsId(shopItem.itemId);
            let charInfo = LocaleData.getModelShowInfo(suitItem.modelId);

            let label_name:fgui.GButton = child.getChild("label_name");
            label_name.text = charInfo.name;

            let group_item:fgui.GComponent = child.getChild("group_item");
            group_item.touchable = false;
            UtilsUI.setUIGroupItem(UtilsUI.getBonuseItem(VarVal.bonusType.item, null, shopItem.itemId, "0"), group_item, null);

            let label_limit:fgui.GButton = child.getChild("label_limit");
            label_limit.text = UtilsTool.stringFormat(StrVal.LYPALACE.STR11, ["1"]);

            let img_text:fgui.GImage = child.getChild("img_text");
            let btn_buy:fgui.GButton = child.getChild("btn_buy");
            UtilsUI.setButtonIcon(btn_buy, this.grantItemId, shopItem.count);
            btn_buy.onClick(() => {
                UtilsUI.lockWait()
                GameServer.getInstance().send((args: any) => {
                    UtilsUI.unlockWait()
                    if (args.errorcode == 0) {
                        UtilsUI.showItemReward({ bonuseString: GameServerData.getInstance().bonusesResultsToString([{inserts:args.itemInserts}])});
                        this.updateShowCount();
                        list_item.numItems = this.shopItems.length;
                    } else {
                        UtilsUI.showMsgTip(args.errorcode)
                    }
                }, "palaceBuyGoods", {
                    goodsId: Number(shopItem.id)
                })
            })
            img_text.visible = GameServerData.getInstance().getPalaceShopIsBuy(shopItem.id);
            btn_buy.visible = !img_text.visible;

            let btn_select:fgui.GButton = child.getChild("btn_select");
            btn_select.onClick(() => {
                if (index != this.currShowIndex) {
                    this.setSelectIndex(index);
                }
            })
        }
        UtilsUI.setFguiGlistDelayNumItems(list_item, this.shopItems.length);

        this.updateShowCount();
        this.setSelectIndex(0);
    }

    private updateShowCount():void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        
        let count = GameServerData.getInstance().getItemCountByProtoId(this.grantItemId);
        let label_count:fgui.GTextField = uiPanel.getChild("label_count");
        label_count.text = String(count);
    }

    private setSelectIndex(index:number):void {
        let uiPanel: fgui.GComponent = this.getUiPanel();
        let group_main:fgui.GButton = uiPanel.getChild("group_main");

        this.currShowIndex = index;
        // 设置选中状态。
        let list_item:fgui.GList = group_main.getChild("list_item");
        let childIdx = list_item.itemIndexToChildIndex(this.currShowIndex);
        for (let i: number = 0; i < list_item.numChildren; i++) {
            let child: fgui.GComponent = list_item.getChildAt(i);
            let btn_frame:fgui.GButton = child.getChild("btn_frame");
            btn_frame.visible = (i == childIdx);
        }

        let shopItem = this.shopItems[this.currShowIndex];
        let suitItem = LocaleData.getCharActivityItemByGoodsId(shopItem.itemId);
        this.charInfo = LocaleData.getModelShowInfo(suitItem.modelId);

        // 描述
        let label_name:fgui.GTextField = group_main.getChild("label_name");
        label_name.text = this.charInfo.name;
        let label_attr1:fgui.GTextField = group_main.getChild("label_attr1");
        label_attr1.text = UtilsTool.stringFormat(StrVal.LYCHARACTER.STR1, [suitItem.desc, suitItem.expire == "0" ? StrVal.LYCHARACTER.STR2 : UtilsTool.stringFormat(StrVal.LYCHARACTER.STR3, [suitItem.expire])])
        let label_attr2:fgui.GTextField = group_main.getChild("label_attr2");
        label_attr2.text = UtilsTool.stringFormat(StrVal.LYCHARACTER.STR4, [LocaleData.getCharacterAttrById(suitItem.attrId).name, suitItem.attrValue.split(",")[0]])

        // 模型
        if (!this.sRMPlayer) {
            this.sRMPlayer = new SpineRoldMountPlayer(uiPanel.getChild("group_spine_ram"));
        }
        this.sRMPlayer.loadSpineRole(this.charInfo);
    }
}