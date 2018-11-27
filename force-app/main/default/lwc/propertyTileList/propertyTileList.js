import { LightningElement, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getPropertyListPage from "@salesforce/apex/PropertyController.getPropertyListPage";

const DEFAULT_SEARCH_KEY = "";
const DEFAULT_VISUAL_SEARCH_KEY = "";
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1200000;
const DEFAULT_PAGE_INDEX = 1;
const DEFAULT_PAGE_SIZE = 8;
const DEFAULT_MIN_BEDROOMS = 0;
const DEFAULT_MIN_BATHROOMS = 0;

const DEFAULT_FILTERS = {
    searchKey: DEFAULT_SEARCH_KEY,
    minPrice: DEFAULT_MIN_PRICE,
    maxPrice: DEFAULT_MAX_PRICE,
    minBedrooms: DEFAULT_MIN_BEDROOMS,
    minBathrooms: DEFAULT_MIN_BATHROOMS,
    visualSearchKey: DEFAULT_VISUAL_SEARCH_KEY,
    pageSize: DEFAULT_PAGE_SIZE,
    pageIndex: DEFAULT_PAGE_INDEX
};

export default class PropertyTileList extends LightningElement {
    searchKey;
    minPrice;
    maxPrice;
    minBedrooms;
    minBathrooms;
    visualSearchKey;
    pageSize;
    pageIndex;

    @track properties;
    @track total = 0;
    @track page = 0;
    @track pages = 0;

    connectedCallback() {
        // Catch event that indicates filter changes
        this.onFiltersChangedCallback = this.onFiltersChanged.bind(this);
        window.addEventListener("filtersChanged", this.onFiltersChangedCallback);

        // Listen to Paginator for request to change page index
        this.onPageIndexChangedCallback = this.onPageIndexChanged.bind(this);
        window.addEventListener("pageIndexChanged", this.onPageIndexChangedCallback);

        // Load default list of properties
        this.searchProperties();
    }

    disconnectedCallback() {
        window.removeEventListener("filtersChanged", this.onFiltersChangedCallback);
        window.removeEventListener("pageIndexChanged", this.onPageIndexChangedCallback);
    }

    /**
     * Handler for the page index changed event
     * @param {Event} evt change event.
     */
    onPageIndexChanged(evt) {
        this.pageIndex = evt.detail.pageIndex;
        this.searchProperties({
            pageIndex: this.pageIndex
        });
    }

    /**
     * Handler for the filters changed event
     * @param {Event} evt change event.
     */
    onFiltersChanged(evt) {
        this.searchKey = evt.detail.searchKey;
        this.minPrice = evt.detail.minPrice;
        this.maxPrice = evt.detail.maxPrice;
        this.minBedrooms = evt.detail.minBedrooms;
        this.minBathrooms = evt.detail.minBathrooms;

        // Reset page index to default value
        this.pageIndex = DEFAULT_PAGE_INDEX;

        this.searchProperties({
            searchKey: this.searchKey,
            minPrice: this.minPrice,
            maxPrice: this.maxPrice,
            minBedrooms: this.minBedrooms,
            minBathrooms: this.minBathrooms
        });
    }

    /**
     * Normalizes filters by combining passed in filters and default values.
     * For options not present in the filters paramater, default values will be used.
     * @param {Object} filters search filters.
     */
    normalizeFilters(filters) {
        if (!filters) {
            return DEFAULT_FILTERS;
        } else {
            return {
                searchKey: filters.searchKey || this.searchKey || DEFAULT_SEARCH_KEY,
                minPrice: filters.minPrice || this.minPrice || DEFAULT_MIN_PRICE,
                maxPrice: filters.maxPrice || this.maxPrice || DEFAULT_MAX_PRICE,
                minBedrooms: filters.minBedrooms || this.minBedrooms || DEFAULT_MIN_BEDROOMS,
                minBathrooms: filters.minBathrooms || this.minBathrooms || DEFAULT_MIN_BATHROOMS,
                visualSearchKey: filters.visualSearchKey || this.visualSearchKey || DEFAULT_VISUAL_SEARCH_KEY,
                pageSize: filters.pageSize || this.pageSize || DEFAULT_PAGE_SIZE,
                pageIndex: filters.pageIndex || this.pageIndex || DEFAULT_PAGE_INDEX
            };
        }
    }

    /**
     * Searches properties based on specified filters.
     * If filters parameter is omitted, default search filters will be used.
     * @param {Object} filters search filters.
     */
    searchProperties(filters) {
        filters = this.normalizeFilters(filters);

        // Get properties from the server
        getPropertyListPage(filters).then(data => {
            this.properties = data.properties;
            this.total = data.total;
            this.page = data.pageNumber;
            this.pages = Math.ceil(this.total / filters.pageSize);
        }).catch((error) => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error loading properties",
                    message: error.message,
                    variant: "error"
                })
            );
        });
    }
}
