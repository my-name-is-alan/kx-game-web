import { _decorator, Component } from 'cc';
import { ViewLayer } from '../Kernel/ViewLayer';
const { ccclass } = _decorator;

@ccclass('CustomGameBehaviour')
export class CustomGameBehaviour extends Component {
    private viewLayer:ViewLayer;

    setViewLayer(view:ViewLayer) {
        this.viewLayer = view;
    }

    onLoad(): void {
        if (this.viewLayer) {
            this.viewLayer.onBehaviourOnLoad();
        }
    }

    start() {
        if (this.viewLayer) {
            this.viewLayer.onBehaviourStart();
        }
    }

    update(deltaTime: number) {
        if (this.viewLayer) {
            this.viewLayer.onBehaviourUpdate(deltaTime);
        }
    }

    lateUpdate(dt: number): void {
        if (this.viewLayer) {
            this.viewLayer.onBehaviourLateUpdate(dt);
        }
    }

    onEnable(): void {
        if (this.viewLayer) {
            this.viewLayer.onBehaviourOnEnable();
        }
    }

    onDisable(): void {
        if (this.viewLayer) {
            this.viewLayer.onBehaviourOnDisable();
        }
    }

    onDestroy(): void {
        if (this.viewLayer) {
            this.viewLayer.onBehaviourOnDestroy();
        }
    }
}


