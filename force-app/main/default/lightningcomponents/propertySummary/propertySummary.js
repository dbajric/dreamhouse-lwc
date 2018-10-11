import { LightningElement, api, track} from "lwc";
import { NavigationMixin } from "lightning/navigation";

// TODO W-5180125 - temporary workaround for mixins
import tmpl from "./propertySummary.html";

export default class PropertySummary extends NavigationMixin(LightningElement) {
    @api property;
    @track hasProperty = false;
    @track hasPropertyThumbnail = false;
    @track hasBrokerPicture = false;

    render() {
        return tmpl;
    }

    connectedCallback() {
        this.onPropertySelectedCallback = this.onPropertySelected.bind(this);
        window.addEventListener("propertySelected", this.onPropertySelectedCallback);
    }

    disconnectedCallback() {
        window.removeEventListener("pageIndexChanged", this.onPropertySelectedCallback);
    }

    /**
     * Handler for the 'propertySelected' event
     * @param {Event} evt change event.
     */
    onPropertySelected(evt) {
        this.property = evt.detail;
        this.hasProperty = !!this.property;
        if(this.property) {
            this.hasPropertyThumbnail = !!this.property.Thumbnail__c;
            this.hasBrokerPicture = !!this.property.Broker__r.Picture__c;
        }
    }

    /**
     * Handler for clicking on the edit icon.
     * @param {Event} evt click event.
     */
    editProperty(evt) {
        evt.stopPropagation();

        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                recordId: this.property.Id,
                actionName: "edit",
            },
        });
    }

    /**
     * Handler for clicking on the broker name.
     * @param {Event} evt click event.
     */
    navigateToBrokerRecord(evt) {
        evt.stopPropagation();

        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                recordId: this.property.Broker__r.Id,
                actionName: "view",
            },
        });
    }
}
