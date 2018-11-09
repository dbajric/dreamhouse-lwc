import { LightningElement, api, track, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";

export default class MortgageCalculatorWithAmortization extends LightningElement {
    @api recordId;
    @track principal = 200000;

    @wire(getRecord, { recordId: "$recordId", fields: ["Property__c.Price__c"] })
    wiredRecord({ error, data }) {
        if (error) {
            showToast({
                title: "Error loading pictures",
                message: error.message,
                variant: "error"
            });
        } else if (data) {
            this.principal = data.fields.Price__c.value;
        }
    }
}
