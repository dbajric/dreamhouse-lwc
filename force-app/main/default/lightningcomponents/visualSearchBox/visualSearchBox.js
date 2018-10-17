import { LightningElement, api, track } from "lwc";

export default class VisualSearchBox extends LightningElement {
    @api modelid;
    @track pictureSrc;
    @track hasPicture = false;
    @track waiting = false;
    @track predictions = [];

    connectedCallback() {
        this.readFileCallback = this.readFile.bind(this);
    }

    onFileChange(evt) {
        evt.preventDefault();
        let files = evt.target.files;
        if (files && files.length > 0) {
            this.readFileCallback(files[0]);
        }
    }

    onDragOver(evt) {
        evt.preventDefault();
    }

    onDrop(evt) {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "copy";
        let files = evt.dataTransfer.files;
        if (files && files.length > 0) {
            this.readFileCallback(files[0]);
        }
    }

    readFile(file) {
        if (file.type.match(/(image.*)/)) {
            this.hasPicture = false;
            let reader = new FileReader();
            reader.onloadend = function () {
                let dataURL = reader.result;
                this.simulateUpload(file, dataURL);
            }.bind(this);
            reader.readAsDataURL(file);
        }
    }

    simulateUpload(file, dataURL) {
        this.waiting = true;

        let timeoutCallback = function() {
            if (file.name === "house1.jpg") {
                this.predictions = [
                    { label: "victorian", formattedProbability: "88.3%" },
                    { label: "colonial", formattedProbability: "11.7%" },
                    { label: "contemporary", formattedProbability: "0%" },
                ];
            } else if (file.name === "house2.jpg") {
                this.predictions = [
                    { label: "contemporary", formattedProbability: "96.7%" },
                    { label: "colonial", formattedProbability: "3.1%" },
                    { label: "victorian", formattedProbability: "0.2%" },
                ];
            } else {
                this.predictions = [
                    { label: "colonial", formattedProbability: "66.2%" },
                    { label: "victorian", formattedProbability: "31.7%" },
                    { label: "victorian", formattedProbability: "2.1%" },
                ];
            }

            this.pictureSrc = dataURL;
            this.hasPicture = true;

            this.dispatchEvent(new CustomEvent("prediction", {
                cancelable: true,
                composed: true,
                bubbles: true,
                detail: {
                    predictions: this.predictions
                }
            }));

            this.waiting = false;
        };

        window.setTimeout(timeoutCallback.bind(this), 1500);
    }
}

VisualSearchBox.interopMap = {
    exposeNativeEvent: {
        prediction: true
    },
};
