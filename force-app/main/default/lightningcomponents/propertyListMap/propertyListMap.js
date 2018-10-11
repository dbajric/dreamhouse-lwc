import { LightningElement } from "lwc";
import { loadStyle, loadScript } from "c/utils";
import leaflet from "@salesforce/resourceUrl/leaflet";
import getPropertyList from "@salesforce/apex/PropertyController.getPropertyList";

const DEFAULT_SEARCH_KEY = "";
const DEFAULT_VISUAL_SEARCH_KEY = "";
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1200000;
const DEFAULT_MIN_BEDROOMS = 0;
const DEFAULT_MIN_BATHROOMS = 0;

export default class PropertyListMap extends LightningElement {
    map;

    connectedCallback() {
        // Catch event that indicates filter changes
        this.onFiltersChangedCallback = this.onFiltersChanged.bind(this);
        window.addEventListener("filtersChanged", this.onFiltersChangedCallback);
    }

    disconnectedCallback() {
        window.removeEventListener("filtersChanged", this.onFiltersChangedCallback);
    }

    renderedCallback() {
        this.searchPropertiesCallback = this.searchProperties.bind(this);

        Promise.all([
            loadStyle(document, leaflet + "/leaflet.css"),
            loadScript(document, leaflet + "/leaflet.js")
        ]).then(this.searchPropertiesCallback);
    }

    /**
     * Renders the map and adds markers based on properties passed into this function.
     * @param {Property_c[]} properties array of properties to display on the map.
     */
    renderMap(properties) {
        let L = window.L;

        // If the Leaflet library is not yet loaded, we can't draw the map: return
        if (!L) {
            return;
        }

        // Draw the map if it hasn't been drawn yet
        if (!this.map) {
            // TODO: FIX!!!!
            let container = this.template.querySelector("#container");
            this.map = L.map(container, {zoomControl: true}).setView([42.356045, -71.085650], 13);
            this.map.scrollWheelZoom.disable();
            window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles © Esri'}).addTo(this.map);
        }

        if (this.center && this.center.lat && this.center.long) {
            this.map.setView(this.center);
        }

        if (this.layerGroup) {
            this.map.removeLayer(this.layerGroup)
        }

        // Skip markers if no properties are available
        if (!properties) {
            return;
        }

        var markers = [];
        properties.forEach(function(property) {
            var latLng = [property.Location__Latitude__s, property.Location__Longitude__s];
            var myIcon = L.divIcon({
                className: 'my-div-icon',
                html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 52 52"><path fill="#DB4437" d="m26 2c-10.5 0-19 8.5-19 19.1 0 13.2 13.6 25.3 17.8 28.5 0.7 0.6 1.7 0.6 2.5 0 4.2-3.3 17.7-15.3 17.7-28.5 0-10.6-8.5-19.1-19-19.1z m0 27c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"></path></svg>'
            });
            var marker = L.marker(latLng, {icon: myIcon});
            marker.propertyId = property.Id;
            marker.on("click", function(event) {
                this.dispatchEvent(
                    new CustomEvent("propertySelected", {
                        cancelable: true,
                        composed: true,
                        bubbles: true,
                        detail: property // TODO: Maybe need to look up prop by ID
                    })
                );
            });
            markers.push(marker);
        });

        this.layerGroup = L.layerGroup(markers);
        this.layerGroup.addTo(this.map);
    }

    /**
     * Handler for the filters changed event
     * @param {Event} evt change event.
     */
    onFiltersChanged(evt) {
        this.searchProperties({
            searchKey: evt.detail.searchKey,
            minPrice: evt.detail.minPrice,
            maxPrice: evt.detail.maxPrice,
            minBedrooms: evt.detail.minBedrooms,
            minBathrooms: evt.detail.minBathrooms,
            visualSearchKey: evt.detail.visualSearchKey
        });
    }

    /**
     * Normalizes filters by combining passed in filters and default values.
     * For options not present in the filters paramater, default values will be used.
     * @param {Object} filters search filters.
     */
    normalizeFilters(filters) {
        filters = filters || {};

        return {
            searchKey: filters.searchKey || DEFAULT_SEARCH_KEY,
            minPrice: filters.minPrice || DEFAULT_MIN_PRICE,
            maxPrice: filters.maxPrice || DEFAULT_MAX_PRICE,
            minBedrooms: filters.minBedrooms || DEFAULT_MIN_BEDROOMS,
            minBathrooms: filters.minBathrooms || DEFAULT_MIN_BATHROOMS,
            visualSearchKey: filters.visualSearchKey || DEFAULT_VISUAL_SEARCH_KEY
        };
    }

    /**
     * Searches properties based on specified filters.
     * If filters parameter is omitted, default search filters will be used.
     * @param {Object} filters search filters.
     */
    searchProperties(filters) {
        filters = this.normalizeFilters(filters);

        // Get properties from the server
        getPropertyList(filters).then(data => {
            this.renderMap(data.properties);
        }).catch(() => {
            //TODO: implement error handling
        });
    }
}
