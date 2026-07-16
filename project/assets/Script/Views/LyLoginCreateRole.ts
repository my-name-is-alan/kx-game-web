//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { ViewLayer } from "../Kernel/ViewLayer";
import { StrVal } from "../Values/StrVal";
import { PlatformAPI } from "../Kernel/PlatformAPI";
import { VarVal } from "../Values/VarVal";
import { UtilsTool } from "../Kernel/UtilsTool";
import { UtilsUI } from "../Kernel/UtilsUI";
import { GameServer } from "../Kernel/GameServer";
import { GameServerData } from "../Kernel/GameServerData";
import { LocaleData } from "../Kernel/LocaleData";
import { HorizontalTextAlignment, Overflow, VerticalTextAlignment } from "cc";

export class LyLoginCreateRole extends ViewLayer {

    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = "LyLoginCreateRole";
        this.viewResI.pkgName = "LyLoginCreateRole";
        this.viewResI.comName = "LyLoginCreateRole";
    }

    private input_name:fgui.GTextInput;
    private params:any;
    private character:number;
    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(_params:any):void {
        this.params = _params;
        let uiPanel:fgui.GComponent = this.getUiPanel();

        this.input_name = uiPanel.getChild("input_name");
		this.input_name.promptText = StrVal.LYCREATEROLE.STR1;
        UtilsUI.setGTextInputAlign(this.input_name, HorizontalTextAlignment.CENTER, VerticalTextAlignment.CENTER, Overflow.CLAMP);
        let group_role:fgui.GGroup =  uiPanel.getChild("group_role");
        let group_name:fgui.GGroup =  uiPanel.getChild("group_name");
        let label_roleName:fgui.GLabel =  uiPanel.getChild("label_roleName");
        let list_role:fgui.GList =  uiPanel.getChild("list_role");
        let btn_roleCreate:fgui.GButton =  uiPanel.getChild("btn_roleCreate");

        let items = LocaleData.getCharacterItems();

        // group_name.visible = false
        list_role.itemRenderer = ((index: number, obj: fgui.GComponent) => {
            let val: any = items[index]
            obj.getChild("label_name").text = val.name;
        }).bind(this)
        this.character = items[0].id
        list_role.on(fgui.Event.CLICK_ITEM, (obj: fgui.GObject)=>{
            let index = list_role.getChildIndex(obj)
            this.character = items[index].id
            label_roleName.text = items[index].name
        }, this);

        btn_roleCreate.onceClick(()=>{
            group_name.visible = true
            group_role.visible = false
        })
        list_role.numItems = items.length
        let btn_create:fgui.GButton = uiPanel.getChild("btn_create");
        btn_create.text = StrVal.LYCREATEROLE.STR3;
        btn_create.onClick(() => {
            LyLoginCreateRole.onBtnCreateClick(null, this.params, this.character, this.input_name.text);
        })

        PlatformAPI.postSdkPointData(PlatformAPI.ASDK_TRACKID.LUNCH_CREATEROLE);
    }

    /**
     * 创建角色。
     */
    public static onBtnCreateClick(callback:Function, params:any, character:number, name:string):void {
        if (!name || name.length == 0) {
            UtilsUI.showMsgTip(StrVal.LYCREATEROLE.STR1);
            return;
        } else if (UtilsTool.getUTF8Count(name) > VarVal.CHARLENGTH.CREATEROLE) {
            UtilsUI.showMsgTip(UtilsTool.stringFormat(StrVal.COMMON.STR7, [VarVal.CHARLENGTH.CREATEROLE / 2]))
            return;
        } else if (UtilsTool.hasSensitive(name)) {
            UtilsUI.showMsgTip(StrVal.LYCREATEROLE.STR2);
            return;
        }

        UtilsUI.lockWait();
        GameServer.getInstance().send((args) => {
            UtilsUI.unlockWait();
            if (args.errorcode == 0) {
                GameServerData.getInstance().submitSdkInfo("CREATE_ROLE");
                PlatformAPI.asdkMd(PlatformAPI.GAME_POINT.CREATE_SUCC)
            } else {
                UtilsUI.showMsgTip(args.errorcode);
            }
            if (callback) {
                callback(args);
            }
        }, "createcharcter", {
            // name: name,
            sex: 1,
            platform: params.platform,
            userid: params.userid,
            serverid: params.serverid,
            token: params.token,
            serverName: params.serverName,
            version: params.version,
            clientInformation: params.clientInformation,
            // birthday: "", // 不用传。
            character: character,

            // 微信小游戏参数
            wxuuid:params.wxuuid,
            fromwxuuid:params.fromwxuuid,
            fromguid:params.fromguid,
            wxtype:params.wxtype,
            gid:params.gid,
        })
    }
}