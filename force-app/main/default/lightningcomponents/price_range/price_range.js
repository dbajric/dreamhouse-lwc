import { Element, api, track } from "engine";
import { loadStyle, loadScript } from "c-utils";
import nouislider from "@salesforce/resource-url/nouislider";

export default class PriceRange extends Element {
    slider;
    @track _min = 200000;
    @track _max = 1200000;
    step = 50000;

    @api
    get min() {
        return this._min;
    }

    @api
    set min(value) {
        this._min = value;
        this.resetSlider(this._min, this._max);
    }

    @api
    get max() {
        return this._max;
    }

    @api
    set max(value) {
        this._max = value;
        this.resetSlider(this._min, this._max);
    }

    /**
     * Resets slider to specified range
     * @param {*} min minimum value
     * @param {*} max maximum value
     */
    resetSlider(min, max) {
        if (this.slider) {
            this.slider.noUiSlider.set([min, max]);
        }
    }

    connectedCallback() {
        this.renderSliderCallback = this.renderSlider.bind(this);
        this.onSliderRangeChangeCallback = this.onSliderRangeChange.bind(this);
    }

    renderedCallback() {
        Promise.all([
            loadStyle(document, nouislider + "/nouislider.min.css"),
            loadScript(document, nouislider + "/nouislider.min.js")
        ]).then(this.renderSliderCallback);
    }

    /**
     * Renders Slider with default values
     */
    renderSlider() {
        // Get HTML element which will be replaced with the slider
        this.slider = this.template.querySelector(".slider");

        // Create slider
        window.noUiSlider.create(this.slider, {
            start: [this.min, this.max],
            connect: true,
            tooltips: true,
            format: {
                to: function ( value ) {
                    if (value >= 1000000) {
                        return (Math.round(value / 10000) / 100) + "M";
                    } else if (value > 100000) {
                        return Math.round(value / 1000) + "K";
                    } else {
                        return Math.round(value);
                    }
                },
                from: function ( value ) {
                    return value;
                }
            },
            step: this.step,
            range: {
                "min": this.min,
                "max": this.max
            }
        });

        // Add handler to when the range values change
        this.slider.noUiSlider.on("change", this.onSliderRangeChangeCallback);
    }

    /**
     * Handler for the change in slider range values
     * @param {array} range Current slider values
     * @param {number} handle Handle that caused the event
     * @param {array} unencoded Slider values without formatting
     * @param {boolean} tap Event was caused by the user tapping the slider
     * @param {array} positions Left offset of the handles
     */
    onSliderRangeChange(range, handle, unencoded, tap, positions) {
        this.dispatchEvent(new CustomEvent("change", {
            cancelable: true,
            composed: true,
            bubbles: true,
            detail: {
                minPrice: unencoded[0],
                maxPrice: unencoded[1]
            }
        }));
    }
}

PriceRange.interopMap = {
    exposeNativeEvent: {
        change: true
    },
};
