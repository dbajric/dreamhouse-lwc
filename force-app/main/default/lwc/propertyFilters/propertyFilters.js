import { LightningElement, api, track } from "lwc";

export default class PropertyFilters extends LightningElement {
    dispatchId;
    @api einsteinVisionModelId = "YQXUQ3NXBEW3MRF5BSJBIA7MSA";
    @api property;
    @track searchKey;
    @track minPrice = 200000;
    @track maxPrice = 1200000;
    @track step = 50000;
    @api minBedrooms = 0;
    @api minBathrooms = 0;

    /**
     * Resets all filters to default values and dispatches 'filtersChanged' event.
     */
    onResetFilters() {
        this.searchKey = "";
        this.minPrice = 200000;
        this.maxPrice = 1200000;
        this.step = 50000;
        this.minBedrooms = 0;
        this.minBathrooms = 0;
        this.dispatchFiltersChanged();
    }

    /**
     * Handler for the Search changed event
     * @param {Event} evt change event.
     */
    onSearchKeyChange(evt) {
        evt.stopPropagation();
        this.searchKey = evt.detail.value;
        this.dispatchFiltersChanged();
    }

    /**
     * Handler for the Bedrooms changed event
     * @param {Event} evt change event.
     */
    onMinBedroomsChange(evt) {
        evt.stopPropagation();
        this.minBedrooms = Number(evt.detail.value);
        this.dispatchFiltersChanged();
    }

    /**
     * Handler for the Bathrooms changed event
     * @param {Event} evt change event.
     */
    onMinBathroomsChange(evt) {
        evt.stopPropagation();
        this.minBathrooms = Number(evt.detail.value);
        this.dispatchFiltersChanged();
    }

    /**
     * Handler for the Price Range changed event
     * @param {Event} evt change event.
     */
    onPriceRangeChange(evt) {
        evt.stopPropagation();
        this.minPrice = evt.detail.minPrice;
        this.maxPrice = evt.detail.maxPrice;
        this.dispatchFiltersChanged();
    }

    /**
     * Handler for the Visual Search event
     * @param {Event} evt change event.
     */
    onPrediction(evt) {
        evt.stopPropagation();
        let prediction = evt.detail.predictions[0];
        this.searchKey = prediction.label;
        this.dispatchFiltersChanged();
    }

    /**
     * Dispatches 'filtersChanged' event.
     * It performs a delayed dispatch (250ms delay) in order to allow multiple changes to happen.
     * This will avoid unneccessary events being dispatched.
     */
    dispatchFiltersChanged() {
        function dispatch() {
            let data = {
                cancelable: true,
                composed: true,
                bubbles: true,
                detail: {
                    searchKey: this.searchKey,
                    minPrice: this.minPrice,
                    maxPrice: this.maxPrice,
                    minBedrooms: this.minBedrooms,
                    minBathrooms: this.minBathrooms
                }
            };
            this.dispatchEvent(new CustomEvent("filtersChanged", data));
        }

        // The slider component fires onchange event even while the slider is held and moved.
        // By using the following method, we can combine multiple changes into one by basically
        // waiting (250ms) until no more changes are made and then fire the actual event.
        if (this.dispatchId) {
            clearTimeout(this.dispatchId);
        }

        this.dispatchId = setTimeout(dispatch.bind(this), 250);
    }
}
