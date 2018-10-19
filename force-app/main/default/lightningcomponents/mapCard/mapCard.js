import { LightningElement, track, api, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";

const fields = ["Property__c.Name", "Property__c.Location__Latitude__s", "Property__c.Location__Longitude__s"];

export default class MapCard extends LightningElement {
    @api recordId;
    @track title;
    @track isFullScreen = false;
    @track location = { latitude: 42.356045, longitude: -71.085650 };

    @wire(getRecord, { recordId: "$recordId", fields: fields })
    wiredRecord({ error, data }) {
        if (error) {
            showToast({
                title: "Error loading pictures",
                message: error.message,
                variant: "error"
            });
        } else if (data) {
            this.title = data.fields.Name.value;
            this.location = {
                latitude: data.fields.Location__Latitude__s.value,
                longitude: data.fields.Location__Longitude__s.value
            };
        }
    }

    onFullScreen() {
        this.isFullScreen = true;
    }

    closeDialog() {
        this.isFullScreen = false;
    }
}
