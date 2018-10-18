import { LightningElement, api, track, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { showToast } from "lightning/notificationsLibrary";
import { getRecord } from "lightning/uiRecordApi";

// TODO W-5180125 - temporary workaround for mixins
import tmpl from "./propertySummary.html";

const fields = [
    "Property__c.Id",
    "Property__c.Thumbnail__c",
    "Property__c.Address__c",
    "Property__c.City__c",
    "Property__c.State__c",
    "Property__c.Zip__c",
    "Property__c.Beds__c",
    "Property__c.Baths__c",
    "Property__c.Price__c",
    "Property__c.Broker__r.Id",
    "Property__c.Broker__r.Picture__c",
    "Property__c.Broker__r.Name",
    "Property__c.Broker__r.Title__c",
    "Property__c.Broker__r.Mobile_Phone__c",
    "Property__c.Broker__r.Email__c"
];

export default class PropertySummary extends NavigationMixin(LightningElement) {
    @api recordId;
    @track property;
    @track broker;

    render() {
        return tmpl;
    }

    @wire(getRecord, { recordId: "$recordId", fields: fields })
    wiredRecord({ error, data }) {
        if (error) {
            showToast({
                title: "Error loading selected Property.",
                message: error.message,
                variant: "error"
            });
        } else if (data) {
            this.property = data.fields;
            this.broker = data.fields.Broker__r.value.fields;
        }
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
        this.recordId = evt.detail.Id;
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
                recordId: this.broker.Id,
                actionName: "view",
            },
        });
    }
}
