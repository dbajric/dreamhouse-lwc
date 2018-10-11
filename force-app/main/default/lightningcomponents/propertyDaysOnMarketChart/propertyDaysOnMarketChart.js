import { LightningElement, track } from "lwc";

export default class PropertyDaysOnMarketChart extends LightningElement {
    @track daysOnMarket = 0;
    @track daysBlockClass = "days-block";
    @track barClass = "bar";
    @track barStyle = "width: 0%";
    @track formattedDateListed = "";

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
        let property = evt.detail;
        this.daysOnMarket = property.Days_On_Market__c;

        let status = "green";
        if (this.daysOnMarket > 60) {
            status = "red";
        } else if (this.daysOnMarket > 30) {
            status = "orange";
        }

        this.daysBlockClass = `days-block ${status}`;
        this.barClass = `bar ${status}`;
        this.barStyle = `width: ${this.daysOnMarket / 90 * 100}%`;
        this.formattedDateListed = new Date(property.Date_Listed__c).toLocaleString("en-US", {month: "short", year: "numeric", day: "numeric"});
    }
}
