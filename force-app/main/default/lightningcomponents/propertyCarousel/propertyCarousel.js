import { LightningElement, track, api, wire } from "lwc";
import { showToast } from "lightning/notificationsLibrary";
import { getRecord } from "lightning/uiRecordApi";
import getPictures from "@salesforce/apex/PropertyController.getPictures";

const fields = ["Property__c.Address__c", "Property__c.City__c", "Property__c.Description__c"];

export default class PropertyCarousel extends LightningElement {
    @api recordId;
    @track urls;
    @track property;

    get title() {
        return this.property && this.property.Name ? this.property.Name.value : "";
    }

    @wire(getRecord, { recordId: "$recordId", fields: fields })
    wiredRecord({ error, data }) {
        if (error) {
            showToast({
                title: "Error loading pictures",
                message: error.message,
                variant: "error"
            });
        } else if (data) {
            this.property = data.fields;
        }
    }

    @wire(getPictures, { propertyId: "$recordId" })
    wiredPictures({ error, data }) {
        if (error) {
            showToast({
                title: "Error loading pictures",
                message: error.message,
                variant: "error"
            });
        } else if (data) {
            this.files = data;
            if (Array.isArray(this.files) && this.files.length > 0) {
                this.urls = this.files.map(file => "/sfc/servlet.shepherd/version/download/" + file.Id);
            } else {
                this.urls = null;
            }
        }
    }

    onUploadFinished(evt) {
        // TODO: Refresh carousel
    }
}
