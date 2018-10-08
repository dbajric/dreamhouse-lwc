import { Element, track, api } from "engine";

export default class MortgageCalculator extends Element {
    @api principal = 200000;
    years = 30;
    rate = 5;
    @track monthlyPayment;

    // TODO: See if you can convert this to getter/setter methods

    onPrincipalChange(evt) {
        evt.stopPropagation();
        this.principal = evt.target.value;
        this.calculateMonthlyPayment();
    }

    onYearsChange(evt) {
        evt.stopPropagation();
        this.years = evt.target.value;
        this.calculateMonthlyPayment();
    }

    onRateChange(evt) {
        evt.stopPropagation();
        this.rate = evt.target.value;
        this.calculateMonthlyPayment();
    }

    renderedCallback() {
        this.calculateMonthlyPayment();
    }

	calculateMonthlyPayment() {
        if (this.principal && this.years && this.rate && this.rate > 0) {
            let monthlyRate = this.rate / 100 / 12;
            this.monthlyPayment = this.principal * monthlyRate / (1 - (Math.pow(1/(1 + monthlyRate), this.years * 12)));

            this.dispatchEvent(new CustomEvent("mortgageChanged", {
                cancelable: true,
                composed: true,
                bubbles: true,
                detail: {
                    principal: this.principal,
                    years: this.years,
                    rate: this.rate,
                    monthlyPayment: this.monthlyPayment
                }
            }));
        }
	}
}
