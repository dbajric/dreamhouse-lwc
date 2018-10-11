import { LightningElement, track } from "lwc";
//TODOimport getSimilarProperties from "@salesforce/apex/PropertyController.getSimilarProperties";

export default class SimilarProperties extends LightningElement {
    @track properties;
    @track title = "Similar Properties by Price";

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
        this.findSimilarProperties(property);
    }

    /**
     * Finds similar properties to the property passed in as a parameter
     * @param {object} property
     */
    findSimilarProperties(property) {
        let filters = {
            propertyId: property.Id,
            price: property.Price__c,
            bedrooms: property.Beds__c,
            searchCriteria: ""
        };

        //TODO
        // // Get properties from the server
        // getSimilarProperties(filters).then(response => {
        //     this.properties = response;
        // }).catch(() => {
        //     //TODO: implement error handling
        // });
    }
}
