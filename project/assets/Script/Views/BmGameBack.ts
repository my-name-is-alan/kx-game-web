//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////
import { ViewLayer } from "../Kernel/ViewLayer";
import { VarVal } from "../Values/VarVal";
import { ViewDispatcher } from "../Kernel/ViewDispatcher";
import { BUILD_TYPE, PlatformAPI } from "../Kernel/PlatformAPI";
import { GameServer } from "../Kernel/GameServer";

export class BmGameBack extends ViewLayer {
	
    /**
     * 此时资源未下载，还未加入舞台，可以注册加入舞台事件。
     */
    public constructor() {
        super();
        this.viewResI.resName = VarVal.PACKAGE_FGUIS.CMemory;
        this.viewResI.pkgName = VarVal.PACKAGE_FGUIS.CMemory;
        this.viewResI.comName = "BmGameBack";
    }

    private COLLECT_MAX:number = 1;
    private collectCurr:number;
    private collectHash:any;
    private collectCurrSpine:number;
    private collectHashSpine:any;

    /**
     * 此时已经加入舞台。
     */
    public onViewCreate(params:any):void {
        let INTERVAL = 5000;
        let SPINE_DELAY = 2500;
        let LIFE_TIME = 5000;
        if (false) {
        // if (PlatformAPI.BUILD_CURRENT == BUILD_TYPE.ALPHA) {
            INTERVAL = 10;
            SPINE_DELAY = 5;
            LIFE_TIME = 10;
        }

        this.resetCollectState();
        this.setInterval(() => {
        this._partner.callLater(() => {
            this.collectCurr++;
            ViewDispatcher.viewCollectFguiTexUsed(ViewDispatcher.getViewContainer().parent, this.collectHash, null);
            if (this.collectCurr >= this.COLLECT_MAX && GameServer.isGameEnter()) {
                PlatformAPI.releaseFguiAssetTex2D(this.collectHash, LIFE_TIME);
                this.resetCollectState();
            }
        })
        }, INTERVAL)
        this.setTimeout(() => {
            this.resetCollectStateSpine();
            this.setInterval(() => {
            this._partner.callLater(() => {
                this.collectCurrSpine++;
                ViewDispatcher.viewCollectFguiTexUsed(ViewDispatcher.getViewContainer().parent, null, this.collectHashSpine);
                if (this.collectCurrSpine >= this.COLLECT_MAX && GameServer.isGameEnter()) {
                    PlatformAPI.releaseFguiAssetSpine(this.collectHashSpine, LIFE_TIME);
                    this.resetCollectStateSpine();
                }
            })
            }, INTERVAL)
        }, SPINE_DELAY)
    }

    private resetCollectState():void {
        this.collectCurr = 0;
        this.collectHash = {};
    };

    private resetCollectStateSpine():void {
        this.collectCurrSpine = 0;
        this.collectHashSpine = {};
    };

    public getIsSafeMask():boolean {
        return false;
    };
}