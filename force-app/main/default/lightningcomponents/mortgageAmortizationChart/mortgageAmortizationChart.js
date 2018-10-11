import { LightningElement, track } from "lwc";

export default class MortgageAmortizationChart extends LightningElement {
    @track amortization = [];

    connectedCallback() {
        this.onMortgageChangedCallback = this.onMortgageChanged.bind(this);
        window.addEventListener("mortgageChanged", this.onMortgageChangedCallback);
    }

    disconnectedCallback() {
        window.removeEventListener("mortgageChanged", this.onMortgageChangedCallback);
    }

    onMortgageChanged(evt) {
        let principal = evt.detail.principal;
        let years = evt.detail.years;
        let rate = evt.detail.rate;
        let monthlyPayment = evt.detail.monthlyPayment;
        let monthlyRate = rate / 100 / 12;
        let balance = principal;
        let amortization = [];
        for (let y = 0; y < years; y++) {
            let interestY = 0;
            let principalY = 0;
            for (let m = 0; m < 12; m++) {
                let interestM = balance * monthlyRate;
                let principalM = monthlyPayment - interestM;
                interestY = interestY + interestM;
                principalY = principalY + principalM;
                balance = balance - principalM;
            }

            let principalYRounded = Math.round(principalY);
            let interestYRounded = Math.round(interestY);

            amortization.push({
                year: y + 1,
                principalY: principalYRounded,
                interestY: interestYRounded,
                balance: Math.round(balance),
                principalStyle: `flex:${principalYRounded};-webkit-flex:${principalYRounded}`,
                interestStyle: `flex:${interestYRounded};-webkit-flex:${interestYRounded}`
            });
        }
        this.amortization = amortization;
    }
}
