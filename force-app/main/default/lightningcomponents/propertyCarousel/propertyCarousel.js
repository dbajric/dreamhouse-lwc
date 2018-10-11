import { LightningElement, track, api } from "lwc";
import getPictures from "@salesforce/apex/PropertyController.getPictures";

export default class Map extends LightningElement {
    @track hasFiles = false;

    @track _files = []; // Id, src = {! '/sfc/servlet.shepherd/version/download/' + file.Id}
    @api
    set files(value) {
        this._files = value || [];
        this.hasFiles = this._files.length > 0;
    }
    get files() {
        return this._files;
    }

    @track recordId;
    @track property = {
        Name: "Test"
    };

    connectedCallback() {
        this.loadPictures();
    }

    onUploadFinished() {
        this.loadPictures();
    }

    loadPictures() {
        this.files = [];

        // Get pictures from the server
        getPictures({ PropertyId: this.recordId }).then(data => {
            this.files = data;
        }).catch(() => {
            //TODO: implement error handling
        });
    }
}
/*
TODO:
<aura:component implements="force:hasRecordId,flexipage:availableForAllPageTypes" controller="PropertyController" access="global">

    <aura:attribute name="recordId" type="Id" />
    <aura:attribute name="property" type="Property__c" />
    <aura:attribute name="files" type="Object[]" />

    <force:recordData recordId="{!v.recordId}"
        targetFields="{!v.property}"
        fields="['Id', 'Name', 'Address__c', 'Description__c']"/>

    <aura:handler name="init" value="{!this}" action="{!c.onInit}" />
    <aura:handler event="ltng:selectSObject" action="{!c.recordChangeHandler}"/>

    <lightning:card title="{!v.property.Name}" iconName="custom:custom38">
        <aura:if isTrue="{!v.files.length > 0}">
            <lightning:carousel disableAutoRefresh="true">
                <aura:iteration items="{!v.files}" var="file" indexVar="index">
                    <lightning:carouselImage src="{! '/sfc/servlet.shepherd/version/download/' + file.Id}" />
                </aura:iteration>
            </lightning:carousel>
            <aura:set attribute="else">
                <div class="card-content">
                    <lightning:icon iconName="utility:photo" size="medium" class="slds-align_absolute-center"/>
                    <p class="slds-text-color--weak">There are currently no pictures for this property.</p>
                </div>
            </aura:set>
        </aura:if>
        <div class="card-content">

        	<lightning:fileUpload label="Add picture" multiple="true" accept=".jpg, .png, .gif" recordId="{!v.recordId}" onuploadfinished="{!c.onUploadFinished}"/>
        </div>
    </lightning:card>

</aura:component>
*/



/*
({
	onUploadFinished: function (component, event, helper) {
        helper.loadPictures(component);
    },

    recordChangeHandler: function (component, event, helper) {
        component.set("v.recordId", event.getParam("recordId"));
        helper.loadPictures(component);
    },

})
*/
