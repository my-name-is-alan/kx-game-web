import { _decorator, Component } from 'cc';
import { PlatformAPI } from './Kernel/PlatformAPI';
const { ccclass } = _decorator;

@ccclass('StartGame')
export class StartGame extends Component {
    onLoad() {
        PlatformAPI.init();
    }
}