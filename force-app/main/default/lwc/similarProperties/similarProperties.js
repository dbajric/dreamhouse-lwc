import { LightningElement, api, track, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getRecord } from "lightning/uiRecordApi";
import getSimilarProperties from "@salesforce/apex/PropertyController.getSimilarProperties";

const fields = ["Property__c.Price__c", "Property__c.Beds__c"];

export default class SimilarProperties extends LightningElement {
    @api recordId;
    @track properties;

    @wire(getRecord, { recordId: "$recordId", fields: fields })
    wiredRecord({ error, data }) {
        if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error loading current Property record.",
                    message: error.message,
                    variant: "error"
                })
            );
        } else if (data) {
            this.findSimilarProperties(data.fields);
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

    /**
     * Finds similar properties to the property passed in as a parameter
     * @param {object} property
     */
    findSimilarProperties(property) {
        let filters = {
            propertyId: property.Id,
            price: property.Price__c.value,
            bedrooms: property.Beds__c.value,
            searchCriteria: ""
        };

        // Get properties from the server
        getSimilarProperties(filters).then(response => {
            this.properties = response;
        }).catch((error) => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error loading similar properties",
                    message: error.message,
                    variant: "error"
                })
            );
        });
    }
}
