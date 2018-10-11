import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

// TODO W-5180125 - temporary workaround for mixins
import tmpl from "./propertyTile.html";

export default class PropertyTile extends NavigationMixin(LightningElement) {
    @api property;

    render() {
        return tmpl;
    }

    /**
     * Returns a background-image style pointing to property's picture
     */
    get backgroundImageStyle() {
        return `background-image:url(${this.property.Thumbnail__c})`;
    }

    /**
     * Handler for clicking on the image.
     * @param {Event} evt change event.
     */
    handlePropertySelectedClick(evt) {
        evt.stopPropagation();

        this.dispatchEvent(
            new CustomEvent("propertySelected", {
                cancelable: true,
                composed: true,
                bubbles: true,
                detail: this.property
            })
        );
    }

    /**
     * Handler for clicking on the zoom icon.
     * @param {Event} evt change event.
     */
    handleViewPropertyClick(evt) {
        evt.stopPropagation();

        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                recordId: this.property.Id,
                actionName: "view",
            },
        });
    }
}
