import { LightningElement } from "lwc";

export default class VoiceInputCard extends LightningElement {
    onChange(evt) {
        var utterance = evt.detail;
        var regex = /([A-Za-z0-9]*) bedrooms in ([A-Za-z]*)/i;
        var result = utterance.match(regex);

        if (result && result.length > 0) {
            var bedrooms = result[1];
            if (bedrooms === "one") bedrooms = 1;
            if (bedrooms === "two") bedrooms = 2;
            if (bedrooms === "three") bedrooms = 3;
            if (bedrooms === "four") bedrooms = 4;
            if (bedrooms === "five") bedrooms = 5;
            if (bedrooms === "six") bedrooms = 6;

            this.dispatchEvent(new CustomEvent("filtersChanged", {
                cancelable: true,
                composed: true,
                bubbles: true,
                detail: {
                    searchKey: result[2],
                    minPrice: 0,
                    maxPrice: 99999999,
                    minBedrooms: bedrooms,
                    minBathrooms: 0,
                    visualSearchKey: ""
                }
            }));
        }
    }
}
