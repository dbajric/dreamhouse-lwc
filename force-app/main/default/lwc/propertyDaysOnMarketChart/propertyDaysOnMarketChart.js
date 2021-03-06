import { LightningElement, api, track, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getRecord } from "lightning/uiRecordApi";

const fields = ["Property__c.Date_Listed__c", "Property__c.Days_On_Market__c"];

export default class PropertyDaysOnMarketChart extends LightningElement {
    @api recordId;

    @track daysOnMarket = 0;
    @track daysBlockClass = "days-block";
    @track barClass = "bar";
    @track barStyle = "width: 0%";
    @track formattedDateListed = "";

    @wire(getRecord, { recordId: "$recordId", fields: fields })
    wiredRecord({ error, data }) {
        if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error loading selected Property.",
                    message: error.message,
                    variant: "error"
                })
            );
        } else if (data) {
            let property = data.fields;
            this.daysOnMarket = property.Days_On_Market__c.value;

            let status = "green";
            if (this.daysOnMarket > 60) {
                status = "red";
            } else if (this.daysOnMarket > 30) {
                status = "orange";
            }

            this.daysBlockClass = `days-block ${status}`;
            this.barClass = `bar ${status}`;
            this.barStyle = `width: ${this.daysOnMarket / 90 * 100}%`;
            this.formattedDateListed = new Date(property.Date_Listed__c.value).toLocaleString("en-US", {month: "short", year: "numeric", day: "numeric"});
        }
    }

    connectedCallback() {
        this.onPropertySelectedCallback = this.onPropertySelected.bind(this);
        window.addEventListener("propertySelected", this.onPropertySelectedCallback);
    }

    disconnectedCallback() {
        window.removeEventListener("propertySelected", this.onPropertySelectedCallback);
    }

    /**
     * Handler for the property selected event
     * @param {Event} evt change event.
     */
    onPropertySelected(evt) {
        this.recordId = evt.detail.Id;
    }
}
