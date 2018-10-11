import { LightningElement, track } from "lwc";

export default class VoiceInput extends LightningElement {
    @track utterance = "";
    @track talking = false;
    SpeechRecognition;
    SpeechGrammarList;

    connectedCallback() {
        this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    }

    /**
     * Handler for input box key pressing
     * @param {Event} evt key press event
     */
    onKeyPress(evt) {
        if (evt.keyCode !== 13) {
            return;
        }

        this.utterance = evt.target.value;
        this.dispatchUtteranceChange(this.utterance);
    }

    onTalk() {
        // Locker Service is blocking Speech APIs due to security concerns.
        // So, we just check here if SpeechRecognition is available and skip if it is not.
        if (!this.SpeechRecognition) {
            return;
        }

        this.talking = true;

        let recognition = new this.SpeechRecognition();
        let speechRecognitionList = new this.SpeechGrammarList();
        recognition.grammars = speechRecognitionList;
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = function (event) {
            this.talking = false;
            this.utterance = event.results[0][0].transcript;
            this.dispatchUtteranceChange(this.utterance);
        }.bind(this);

        recognition.onspeechend = function () {
            recognition.stop();
        }

        recognition.onerror = function (event) {
            this.talking = false;
            this.result = event.error;
        }.bind(this);

        recognition.start();
    }

    dispatchUtteranceChange(utterance) {
        this.dispatchEvent(new CustomEvent("change", {
            cancelable: true,
            composed: true,
            bubbles: true,
            detail: utterance
        }));
    }
}

VoiceInput.interopMap = {
    exposeNativeEvent: {
        change: true
    },
};
