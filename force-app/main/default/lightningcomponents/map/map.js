import { LightningElement, track, api } from "lwc";
import { loadStyle, loadScript } from "c/utils";
import leaflet from "@salesforce/resourceUrl/leaflet";

export default class Map extends LightningElement {
    map;
    @track _location;

    @api
    set location(value) {
        this._location = value;
        this.renderMap();
    }
    get location() {
        return this._location;
    }

    renderedCallback() {
        this.renderMapCallback = this.renderMap.bind(this);

        Promise.all([
            loadStyle(document, leaflet + "/leaflet.css"),
            loadScript(document, leaflet + "/leaflet.js")
        ]).then(this.renderMapCallback);
    }

    /**
     * Renders the map and adds markers based on properties passed into this function.
     */
    renderMap() {
        let L = window.L;

        // If the Leaflet library is not yet loaded, we can't draw the map: return
        if (!L) {
            return;
        }

        // Draw the map if it hasn't been drawn yet
        if (!this.map) {
            const container = document.createElement("div");
            this.template.querySelector("div").appendChild(container);

            this.map = L.map(container, {zoomControl: true}).setView([42.356045, -71.085650], 13);
            this.map.scrollWheelZoom.disable();
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles © Esri'}).addTo(this.map);
        }

        if (this.location && this.location.latitude && this.location.longitude) {
            let latLng = [this.location.latitude, this.location.longitude];
            if (this.map.marker) {
                this.map.marker.setLatLng(latLng);
            } else {
                let myIcon = L.divIcon({
                    className: 'my-div-icon',
                    html: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 52 52"><path fill="#DB4437" d="m26 2c-10.5 0-19 8.5-19 19.1 0 13.2 13.6 25.3 17.8 28.5 0.7 0.6 1.7 0.6 2.5 0 4.2-3.3 17.7-15.3 17.7-28.5 0-10.6-8.5-19.1-19-19.1z m0 27c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"></path></svg>'
                });
                this.map.marker = window.L.marker(latLng, {icon: myIcon});
                this.map.marker.addTo(this.map.map);
            }
            this.map.map.setView(latLng);
        }
    }
}
