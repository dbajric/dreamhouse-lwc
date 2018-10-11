import { LightningElement, track, api } from "lwc";
import { loadStyle, loadScript } from "c/utils";
import leaflet from "@salesforce/resourceUrl/leaflet";

export default class MapCard extends LightningElement {
    @track title;
    @track isFullScreen = false;
    @track location = { longitude: 42.356045, latitude: -71.085650 };

    renderedCallback() {
        //this.renderMapCallback = this.renderMap.bind(this);

        Promise.all([
            loadStyle(document, leaflet + "/leaflet.css"),
            loadScript(document, leaflet + "/leaflet.js")
        ]).then(this.renderMapCallback);
    }

    onFullScreen(evt) {
        this.isFullScreen = true;
        // var sObject = component.get("v.sObject");
        // if (sObject) {
        //     component.find("bigMap").setLocation(sObject[component.get("v.latField")], sObject[component.get("v.longField")]);
        // }
    }

    closeDialog() {
        this.isFullScreen = false;
    }
}


/* // TODO
({
    doInit : function(component) {
        component.set("v.fields", ["Id", component.get("v.latField"), component.get("v.longField"), component.get("v.titleField")]);
        var recordId = component.get("v.recordId");
        component.set("v.dsRecordId", recordId);
        var service = component.find("service");
        service.reloadRecord();
	},

    fullScreen : function(component) {
        console.log(component.get("v.property"));
        component.set("v.fullScreen", true);
		var sObject = component.get("v.sObject");
        if (sObject) {
            component.find("bigMap").setLocation(sObject[component.get("v.latField")], sObject[component.get("v.longField")]);
        }

	},

	closeDialog : function(component) {
        component.set("v.fullScreen", false);
	},

  	recordChangeHandler : function(component, event) {
        console.log('recordChangeHandler');
        var id = event.getParam("recordId");
        component.set("v.dsRecordId", id);
        var service = component.find("service");
        service.reloadRecord();
	},

  	onRecordUpdated : function(component, event) {
        console.log('onRecordUpdated');
        var sObject = component.get("v.sObject");
        if (sObject) {
	        component.set("v.title", sObject[component.get("v.titleField")]);
            component.find("map").setLocation(sObject[component.get("v.latField")], sObject[component.get("v.longField")]);
        }
    }
})
*/
