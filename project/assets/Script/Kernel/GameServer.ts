//////////////////////////////////////////////////////////////////////////////////////
//
//  Jason
//  23-10-20
//
//////////////////////////////////////////////////////////////////////////////////////

import { VarVal } from "../Values/VarVal";
import { GameServerData } from "./GameServerData";
import { PlatformAPI, ServerItem } from "./PlatformAPI";
import { ScriptTimer } from "./ScriptTimer";
import { SocketClient } from "./SocketClient";
import { UtilsTool } from "./UtilsTool";
import { ShareGameQuery, UtilsUI } from "./UtilsUI";
import { ViewDispatcher } from "./ViewDispatcher";
import { PErrCode } from "../Values/PErrCode";
import sproto from '../Protos/sproto.js';
import { StrVal } from "../Values/StrVal";
import { BufferAsset } from "cc";

interface DataCmd {
	session: number,
	name: string,
	sarg: any,
	callback: Function,
	timeoutId: number,
}

export class GameServer {
	private static instance:GameServer;
	public static getInstance():GameServer {
    	if (!GameServer.instance) {
      		GameServer.instance = new GameServer();
    	}
    	return GameServer.instance
  	}
	public static destroyInstance() {
    	if (GameServer.instance) {
			GameServer.clear();
      		GameServer.instance = null;
		}
  	}
	
	private static GAMESTATE_CLOSE:number = 1001;
	// private static GAMESTATE_CONEC:number = 1002; // socket已连接（取消，等同是 GAMESTATE_CLOSE）。
	private static GAMESTATE_CREAT:number = 1003;
	private static GAMESTATE_ENTER:number = 1004;

	private static SEND_TIMEOUT:number = 10000;
	private static RECV_TIMEOUT:number = 20;

	private static REQ_ENTERGAME:string = "entergame";
	private static REQ_CREATECHARCTER:string = "createcharcter";

	// sproto
	private static pkghost:any;
	private static request:Function;

	private session:number = 0;
	private sendQueue:Array<DataCmd> = new Array<DataCmd>();
	private big_requeue:any = {};
	private gamestate:number = GameServer.GAMESTATE_CLOSE;
	private laststate:number = null; // 重连时为了区分是创角还是进游戏（此标记也可以判断是否重连）
	private isRecState:boolean = false; // 是否在重连操作中
	private reconnectTimeId:number = null; // 重连定时器
	private isLockReconnect:boolean = false; // 是否锁定重连
	private isLockRecCall:Function = null; // 重连成功调用

	private client:SocketClient;
	private gameServerData:GameServerData;

	private loginParams:any;

	private constructor () {
		// 里面状态CLOSE后，不会有任何回调。
		this.client = new SocketClient();
		// 数据回调&被动断开或保活超时回调。
		this.client.setCallback((data:any) => {
			this.onSocketReceive(data);
		},
		() => {
			this.onSocketClose();
		});
		this.gameServerData = GameServerData.getInstance();
	}

	/**
     * 加载sproto。
     */
	public static loadSproto(asset):void {
		if (!GameServer.pkghost) {
			let arrayBuffer = new DataView((<BufferAsset>asset).buffer());
			let data_8 = new Uint8Array(arrayBuffer.buffer, arrayBuffer.byteOffset, arrayBuffer.byteLength);
			let m_sproto = sproto.createNew(data_8);
			GameServer.pkghost = m_sproto.host("package");
			GameServer.request = GameServer.pkghost.attach(m_sproto);
		}
	}

	/**
     * 获得当前用户登录信息。
     */
	public static getLoginParams():any {
		if (GameServer.instance) {
			return GameServer.instance.getLoginParams();
		}
	}

	private getLoginParams():any {
		return this.loginParams;
	}

	/**
     * 是否已进入游戏。
     */
	public static isGameEnter():boolean {
		if (GameServer.instance) {
			return GameServer.instance.isGameEnter();
		}
		return false;
	}

	private isGameEnter():boolean {
		return (this.gamestate == GameServer.GAMESTATE_ENTER);
	}

	/**
     * 被踢出处理。
     */
	public kickClose() {
		this.close(PErrCode.ERROR_REMOTE_CLOSED);
		// 弹窗重启。
		UtilsUI.showSysBox(VarVal.LyMsgBox.STYLE_ONE, "", StrVal.GAMESERVER.STR101, null, "", null, "", null
		, StrVal.GAMESERVER.STR102, () =>  {
			UtilsUI.restartGame();
		});
	}

	/**
     * 被动断开或保活超时回调的处理。
     */
	private onSocketClose() {
		if (this.gamestate == GameServer.GAMESTATE_CREAT || this.gamestate == GameServer.GAMESTATE_ENTER) {
			this.laststate = this.gamestate;
			this.close(PErrCode.ERROR_REMOTE_CLOSED);
			// 重连
			this.reconnect(true, 10, StrVal.GAMESERVER.STR103);
		}
		else {
			// 1、普通登录有机会走这里
			// 2、重连登录有机会走这里（第一次先走上面分支，reconnect中有机会又触发这里）
			this.close(PErrCode.ERROR_REMOTE_CLOSED);
		}
	}

	/**
     * 手动打开重连开关时的辅助接口。
     */
	private doLockRecCall(isOk:boolean) {
		if (this.isLockRecCall) {
			this.isLockRecCall(isOk);
			this.isLockRecCall = null;
		}
	}

	/**
     * 重连。
     */
	private reconnect(isLockWait:boolean, leftNum:number, failsMsg:string) {
		// isLockWait且failsMsg（即首次由外部调起）
		if (isLockWait && (failsMsg && failsMsg.length > 0) && this.isLockReconnect) {
			return;
		} else {
			this.isRecState = true;
		}
		// 是否重新触发引导？
		// GuideManager.clear();
		if (isLockWait) {
			UtilsUI.lockWait();
		}
		this.connect((args:any) => {
			if (args.errorcode == 0 || args.errorcode == PErrCode.user_login_nochar) {
				UtilsUI.unlockWait();
				this.laststate = null; // 重连成功一定走这里。
				this.isRecState = false;
				this.doLockRecCall(true);
				if (args.errorcode == 0) { // 创建角色与服务器无任何交互，不需要触发。
					ViewDispatcher.doViewReconnect();
				}
			} else {
				// 延时重连次数
				leftNum = leftNum - 1;
				if (leftNum > 0) {
					this.reconnectTimeId = ScriptTimer.setTimeout(() => {
						this.reconnectTimeId = null;
						// 回调前超时器已在ScriptTimer内部清除，详情查看实现。
						this.reconnect(false, leftNum, failsMsg);
					}, 3000);
				} else {
					UtilsUI.unlockWait();
					if (failsMsg) { // 是否自动重连（没有则是手动）。
						UtilsUI.showSysBox(VarVal.LyMsgBox.STYLE_TWO, "", failsMsg, null
						, StrVal.GAMESERVER.STR102, () => {
							this.laststate = null; // 重连失败一定走这里。
							this.isRecState = false;
							this.doLockRecCall(false);
							UtilsUI.restartGame();
						}, StrVal.GAMESERVER.STR104, () => {
							this.reconnect(true, 1, null);
						}, "", null)
					} else {
						UtilsUI.showSysBox(VarVal.LyMsgBox.STYLE_ONE, "", StrVal.GAMESERVER.STR105, null, "", null, "", null
						, StrVal.GAMESERVER.STR102, () => {
							this.laststate = null; // 重连失败一定走这里。
							this.isRecState = false;
							this.doLockRecCall(false);
							UtilsUI.restartGame();
						})
					}
				}
			}
		}, null);
	}

	/**
     * 是否锁定重连，即断开时不重连，如果当前正在重连则下一次重连时生效。
     */
	public lockReconnect(bool:boolean, callback:Function) {
		if (this.isLockReconnect != bool) {
			this.isLockReconnect = bool;
			if (bool) {
				// 下一次重连时生效。
			} else {
				this.isLockRecCall = callback;
				if (this.gamestate == GameServer.GAMESTATE_CLOSE) { // 已断开
					if (!this.isRecState) { // 非重连中
						this.reconnect(true, 10, StrVal.GAMESERVER.STR103);
					}
				} else {
					this.doLockRecCall(true);
				}
			}
		}
	}

	/**
     * 请求后收到回应。
     */
	private doProtoResponse(psession:number, protoinfo:any) {
		let req:DataCmd;
		for (let i = 0; i < this.sendQueue.length; i++) {
			let mmmreq:DataCmd = this.sendQueue[i];
			if (mmmreq.session == psession) {
				req = mmmreq;
				this.sendQueue.splice(i, 1);
				ScriptTimer.clearTimeout(mmmreq.timeoutId);
				break;
			}
		}
		// 处理请求回调。
		if (req) {
			// 非GAMESTATE_ENTER状态时，忽略其余消息，但排除REQ_ENTERGAME、REQ_CREATECHARCTER。
			if (req.name == GameServer.REQ_ENTERGAME || req.name == GameServer.REQ_CREATECHARCTER || this.gamestate == GameServer.GAMESTATE_ENTER) {
				console.log("请求回应", req.name);
				if (protoinfo.errorcode == 0) {
					let comName:string = "on_" + req.name;
					if (this.gameServerData[comName]) {
						this.gameServerData[comName](protoinfo, req.sarg);
					}
					// this.gameServerData.onInvokeResponse(req.name, protoinfo);
				}
				// if (req.name == GameServer.REQ_ENTERGAME) {...} 可以放到三个地方，1、此处，2、GameServer.connect的send回调里，3、外部调用回调里。
				// 不放到3处而放到2处，是因为有一种情况的重连（即已进游戏但页面还停留在建角上，中途有误的情况）无法实现，像这个问题也需要用到this.gamestate做判断，其他问题暂没想到。
				// 不放到2处而放到1处，是因为建角里面也会调用 REQ_ENTERGAME ，为了统一简约。
				// 所以放到1处这里。
				if (req.name == GameServer.REQ_ENTERGAME || req.name == GameServer.REQ_CREATECHARCTER) {
					let prevstate:number = this.gamestate;
					if (this.laststate) {
						prevstate = this.laststate;
					}
					// 1、在登录页调用REQ_ENTERGAME，返回errorcode=0
					// 2、在登录页调用REQ_ENTERGAME，返回errorcode=user_login_nochar
					// 3、在创角页调用REQ_CREATECHARCTER，返回errorcode=0
					// 4、（重连）在创角页调用REQ_ENTERGAME，返回errorcode=user_login_nochar
					// 5、（重连）在创角页调用REQ_ENTERGAME，返回errorcode=0
					// 6、（重连）在普通页调用REQ_ENTERGAME，返回errorcode=0
					if (protoinfo.errorcode == 0) { // 说明进游戏，调用REQ_CREATECHARCTER只走这里。
						this.gamestate = GameServer.GAMESTATE_ENTER; // 放到界面前，引导需要。
						if (prevstate != GameServer.GAMESTATE_ENTER) {
							this.client.setRecvKeepTime(GameServer.RECV_TIMEOUT);
							UtilsUI.showEnterGameView(1, null);
						}
						UtilsUI.showEnterGameSend();
					} else if (protoinfo.errorcode == PErrCode.user_login_nochar) {
						// 无角色：打开创角页（勿在此处直接 create）
						this.gamestate = GameServer.GAMESTATE_CREAT;
						if (prevstate != GameServer.GAMESTATE_CREAT) {
							UtilsUI.showEnterGameView(2, req);
						}
					}
				}
				req.callback(protoinfo);
			}
			else {
				console.warn("登录主页前收到早期无效的回应", req.name)
				// req.callback(protoinfo); // 应该是无意义了。
			}
		}
		else {
			console.warn("收到未知回应 session:", psession, protoinfo);
		}
	}

	/**
     * 收到服务器事件。
     */
	private doProtoRequest(protoname:string, protoinfo:any) {
		if (protoname == "heartbeat") {
			// console.log("心跳");
		}
		else {
			if (this.gamestate == GameServer.GAMESTATE_ENTER) {
				console.log("收到事件", protoname);
				let envName:string = "env_" + protoname;
				let envOk: boolean = true;
				if (this.gameServerData[envName]) {
					envOk = this.gameServerData[envName](protoinfo) !== false;
				}
				if (envOk) {
					this.gameServerData.onInvokeRequest(protoname, protoinfo);
				}
			}
			else {
				console.log("登录主页前收到早期无效的事件", protoname);
			}
		}
	}

	/**
     * 分事件类型。
     */
	private doDispatchData(prototype:string, protoname:string, protosession:number, protoinfo:any) {
		// 看解包处代码，RESPONSE必定有session，REQUEST必定有pname。
		// 有个REQUEST有session，应该是服务器事件带的，没用到忽略。
		if (!protoinfo) { // 协议错位
			protoinfo = {errorcode: PErrCode.ERROR_SPROTO_NOTFOUND};
		}
		if (prototype == "RESPONSE") {
			this.doProtoResponse(protosession, protoinfo);
		} else { // "REQUEST"
			this.doProtoRequest(protoname, protoinfo);
		}
	}

	/**
     * 接受数据处理。
     */
	private onSocketReceive(data:any):void {
		let dataView = new DataView(data); // ArrayBuffer -> Uint8Array
		let data_8 = new Uint8Array(dataView.buffer);
		
		let params:any;
		try {
			params = GameServer.pkghost.dispatch(data_8.slice(2));
		} catch (e) {
			console.error("sproto dispatch failed", e);
			return;
		}
		if (params.pname == "bigdataHeader") {
			let protoinfo = params.result;
			this.big_requeue[protoinfo.index] = {protoinfo:protoinfo, data:undefined};
		} else if (params.pname == "bigdataContent") {
			let protoinfo = params.result;
			let req = this.big_requeue[protoinfo.index];
			if (req) {
				let _data_8:Uint8Array = new Uint8Array(protoinfo.data);
				if (req.data) {
					let buffer:Uint8Array = req.data;
					let _buffer = new Uint8Array(buffer.byteLength + _data_8.byteLength);
					_buffer.set(buffer, 0);
					_buffer.set(_data_8, buffer.byteLength);
					_data_8 = _buffer;
				}
				req.data = _data_8;
				if (_data_8.byteLength >= req.protoinfo.len) {
					delete this.big_requeue[protoinfo.index];
					let _params:any;
					try {
						_params = GameServer.pkghost.dispatch(_data_8);
					} catch (e) {
						console.error("sproto bigdata dispatch failed", e);
						return;
					}
					this.doDispatchData(_params.type, _params.pname, _params.session, _params.result);
				}
			} else {
				console.error("no bigdataHeader");
			}
		} else {
			this.doDispatchData(params.type, params.pname, params.session, params.result);
		}
	}

	/**
     * 刷新服务器状态，连接游戏服。
     */
	public connect(callback:Function, params:any):void {
		// 重连，登录，只有这两处调用。建角的在建角页面内调用entergame。

		// 重连不传参数，且已经有参数。
		let isReconnect:boolean = false;
		if (params) {
			this.loginParams = params;
		} else {
			isReconnect = true;
		}

		let userInfo:any = this.loginParams.userInfo;
		let serverItem:ServerItem = this.loginParams.serverItem;
		let serverInfo:any = PlatformAPI.getServerInfo();
		
		if (isReconnect) {
			PlatformAPI.getGameServerList((_userInfo:any, _serverInfo:any) => {
				if (_userInfo.errmsg) {
					callback({errorcode:_userInfo.errmsg});
				} else {
					serverItem = PlatformAPI.getGameServerItem(serverItem.serverId);
					if (!(serverItem.url && serverItem.url.length > 0) && serverItem.status != 1) {
						// 如果服务器限制了，则服务器为空。
						// 如果你是白名单，则服务器不为空，但状态不改。
						callback({errorcode: serverItem.desc});
					} else if (!(serverItem.url && serverItem.url.length > 0)) {
						callback({errorcode: PErrCode.ERROR_NO_REMOTE});
					} else {
						this.doConnect(callback, isReconnect, userInfo, serverItem, _serverInfo);
					}
				}
			})
		} else {
			this.doConnect(callback, isReconnect, userInfo, serverItem, serverInfo);
		}
	}

	/**
     * 连接向游戏服。
     */
	private doConnect(callback:Function, isReconnect:boolean, userInfo:any, serverItem:ServerItem, serverInfo:any) {
		console.log(UtilsTool.stringFormat("connecting game server({0}) -- {1}", [serverItem.serverId, serverItem.url]));
		this.client.connect((errcode:number) => {
			if (errcode == 0) {
				console.log("connecting game server -- succeed");
				// 微信小游戏参数
				let openId:string;
				let fromwxuuid:string;
				let fromguid:string;
				let wxtype:string;
				let gid:string;
				if (userInfo.wxLoginData) {
					openId = userInfo.wxLoginData.account.extdata1; // accountid;
				}
				PlatformAPI.doSdkGetWXQuery((errmsg:string, query:ShareGameQuery, asdkcfg:any) => {
					if (query && query.openid != openId) {
						fromwxuuid = query.openid;
						fromguid = query.guid;
						wxtype = query.type;
					}
					if (asdkcfg) {
						gid = asdkcfg.a_gameid;
					}
				});

				let entergameargs:any = {
					userid:userInfo.userId,
					serverid:Number(serverItem.serverId),
					token:serverInfo.token,
					version:PlatformAPI.getProtocolVersion(),
					serverName:serverItem.name,

					// 微信小游戏参数
					wxuuid:openId,
					fromwxuuid:fromwxuuid,
					fromguid:fromguid,
					wxtype:wxtype,
					gid:gid,
					
					// 创建角色需要。
					nickname:userInfo.nickname,
					platform:Number(PlatformAPI.getSdkId()),
					clientInformation:PlatformAPI.getSdkPlatInfo(),
				};
				// 如果服务器没完全起来，发消息后服务器会主动断开连接，此时缓存中有这条请求，则会再次执行一次（错）
				this.send((args:any) => {
					if (args.errorcode == 0) {
						callback(args);
					} else if (args.errorcode == PErrCode.user_login_nochar) {
						// 创角页已由 doProtoResponse → showEnterGameView(2) 打开
						callback(args);
					} else {
						// 非重连登录，或重连，若连接成功但entergame失败则关闭。
						this.close(null);
						if (args.errorcode == PErrCode.please_upgrade_version) {
							UtilsUI.showSysBox(VarVal.LyMsgBox.STYLE_ONE, "", StrVal.GAMESERVER.STR106, null, "", null, "", null
							, StrVal.GAMESERVER.STR107, () => {
								UtilsUI.restartGame();
							})
							if (isReconnect) {
								UtilsUI.unlockWait(); // 重连中的lock要去掉，也可以不去掉。
								return; // 放弃向下传递（飘字提示,重连失败弹窗）均不需要。
							}
						}
						callback(args);
					}
				}, GameServer.REQ_ENTERGAME, entergameargs);
			}
			else {
				// 已经连接或者正在连接时，再次连接，就会返回错误码（没有人会这么干的！）
				// 重连时，若连接失败则关闭。（非重连登录本就是这个状态）
				this.close(null);
				callback({errorcode:errcode});
			}
		}, serverItem.url, null, null);
	}

	/**
     * 创建一个发送超时器（服务器报错异常则不会回应）。
     */
	private getSendTimeout():number {
		let timeId:number = ScriptTimer.setTimeout(() => {
			// 回调前超时器已在ScriptTimer内部清除，详情查看实现。
			if (this.gamestate == GameServer.GAMESTATE_CREAT || this.gamestate == GameServer.GAMESTATE_ENTER) {
				this.laststate = this.gamestate;
				this.close(PErrCode.ERROR_SEND_TIMEOUT);
				// 重连
				this.reconnect(true, 10, StrVal.GAMESERVER.STR108);
			}
			else {
				this.close(PErrCode.ERROR_SEND_TIMEOUT);
			}
		}, GameServer.SEND_TIMEOUT);
		return timeId;
	}

	/**
     * 向游戏服发送消息。
     * 发送失败（非超时）代表scoket异常，则要等待保活处断开的回调。
     * 此处无需管scoket异常。
     */
	public send(callback:Function, name:string, args:any):void {
		this.session = this.session + 1;

		// args为空也行，它内部有处理，如果需要传空表可以在调用处。
		let reqpkg = GameServer.request(name, args, this.session);

		// 创建一个新的ArrayBuffer，大小为原始数据长度加上两个字节。
        let sendData = new ArrayBuffer(reqpkg.length + 2);

		// 在新的ArrayBuffer头部插入两个字节的大端数据。
        let dataView = new DataView(sendData);
        dataView.setUint16(0, reqpkg.length, false);
        const dataBytes = new Uint8Array(sendData, 2);
        dataBytes.set(reqpkg);

		this.client.send((errcode:number) => {
			if (errcode == 0) {
				let timeId = this.getSendTimeout();
				this.sendQueue.push({
					session: this.session,
					name: name,
					sarg: args,
					callback: callback,
					timeoutId: timeId,
				});
			} else {
				if (callback) {
					callback({errorcode:errcode});
				}
			}
		}, sendData)
	}

	/**
     * 关闭&清空请求队列且触发回调释放漏斗。
     * 一定要清除请求队列，因为可能服务器已经处理了部分请求，客户端没收到。
     */
	private close(ourcode:number):void {
		this.gamestate = GameServer.GAMESTATE_CLOSE;
		this.client.close();
		// 清除重连定时器
		if (this.reconnectTimeId) {
			ScriptTimer.clearTimeout(this.reconnectTimeId);
			this.reconnectTimeId = null;
		}
		// 清除心跳定时器
		for (let i = 0; i < this.sendQueue.length; i++) {
			let mmmreq:DataCmd = this.sendQueue[i];
			ScriptTimer.clearTimeout(mmmreq.timeoutId);
			if (ourcode && ourcode != 0) {
				mmmreq.callback({errorcode:ourcode});
			}
		}
		this.session = 0;
		this.sendQueue = new Array<DataCmd>();
		this.big_requeue = {};
	}

	/**
	 * 清空管理器，只能GameServer instance调用！
	 */
	public static clear(callback?:Function){
		if (GameServer.instance) {
			GameServer.instance.close(null);
		}
		if (callback) {
			callback();
		}
	}
}