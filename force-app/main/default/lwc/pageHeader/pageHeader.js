import { LightningElement, api, track } from "lwc";

export default class PageHeader extends LightningElement {
    @api title;
    @track _iconName;
    @track iconUrl;

    @api
    get iconName() {
        return this._iconName;
    }

    set iconName(value) {
        if (value) {
            if (value.startsWith("custom")) {
                this.iconUrl = `/img/icon/t4v35/custom/${value}_120.png`;
            } else {
                this.iconUrl = `/img/icon/t4v35/standard/${value}_120.png`;
            }
        } else {
            this._iconName = "";
            this.iconUrl = "";
        }
    }
}
