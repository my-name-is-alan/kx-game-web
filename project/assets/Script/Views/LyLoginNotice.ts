//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import * as fgui from "fairygui-cc";
import { UtilsUI } from "../Kernel/UtilsUI";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { ViewLayer } from "../Kernel/ViewLayer";

export class LyLoginNotice extends ViewLayer {

    public constructor() {
        super();
        this.viewResI.resName = "LyLogin";
        this.viewResI.pkgName = "LyLogin";
        this.viewResI.comName = "LyLoginNotice";
    }
    // private list_notice: fgui.GList
    private noticeList: any
    private uiPanel: fgui.GComponent
    public onViewCreate(params: any): void {
        this.uiPanel = this.getUiPanel().getChild("group_loginNotice");
        UtilsUI.playCommonGroupAni(this.uiPanel, null)
        // 关闭
        let btn_close: fgui.GButton = this.getUiPanel().getChild("btn_close");
        btn_close.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyLoginNotice, 0, null);
        })
        let btn_close1: fgui.GButton = this.uiPanel.getChild("btn_close1");
        btn_close1.onClick(() => {
            ViewDispatcher.pushViewEvent(null, ViewDispatcher.EVENT_DESTROY, LyLoginNotice, 0, null);
        })
        this.noticeList = JSON.parse(params.notice)
        //标题
        let label_name: fgui.GLabel = this.uiPanel.getChild("label_name")
        label_name.text = this.noticeList[0].table
        // this.list_notice = getUiPanel.getChild("list_notice")
        // this.list_notice.itemRenderer = this.renderListItem.bind(this);
        // this.list_notice.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);
        // this.list_notice.numItems = this.noticeList.length;
        this.onLoadNotice(0)
    };

    private onLoadNotice(index: number): void {
        //内容
        let group_notice: fgui.GComponent = this.uiPanel.getChild("group_notice")
        let label_txt: fgui.GComponent = group_notice.getChild("label_txt")
        label_txt.text = this.noticeList[index].content
    };
    // private onClickItem(obj: fgui.GObject): void {
    //     let index: number = this.list_notice.getChildIndex(obj)
    //     this.onLoadNotice(index)
    // };

    // private renderListItem(index: number, obj: fgui.GButton): void {
    //     obj.text = this.noticeList[index].table
    //     let label_time: fgui.GLabel = obj.getChild("label_time")
    //     label_time.text = this.noticeList[index].time
    // };

    public getIsViewMask(): boolean {
        return false;
    };

}