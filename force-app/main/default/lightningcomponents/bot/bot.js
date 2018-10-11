import { LightningElement, api, track } from "lwc";
import submit from "@salesforce/apex/BotController.submit";

export default class Bot extends LightningElement {
    @track messages = [];
    session = [];
    /*
        author
        icon = {#message.author == "Me" ? "standard:avatar_loading" : "standard:custom_notification"}
        messageText
        imageURL
        hasImageURL
        field.hasLinkURL
    */

    renderedCallback() {

    }

    postbackButtonClickHandler(evt) {
        //var utterance = event.getSource().get("v.label");
        const utterance = evt.detail;
		this.messages.push({author: "Me", messageText: utterance});
        this.submitHelper(utterance, this.session, null, null, function(answer) {
            if (answer) {
                this.session = answer.session;
                Array.prototype.push.apply(this.messages, answer.messages);
            }
        });
    }

    onUtteranceChange(evt) {
        const utterance = evt.detail;
        this.messages.push({author: "Me", messageText: utterance});

        this.submitHelper(utterance, this.session, null, null, function(answer) {
            if (answer) {
                this.session = answer.session;
                Array.prototype.push.apply(this.messages, answer.messages);
                if (answer && answer.messages && answer.messages[0] && answer.messages[0].records && answer.messages[0].records[0].fields && answer.messages[0].records[0].fields[0] && answer.messages[0].records[0].fields[0].linkURL) {
                    window.open(answer.messages[0].records[0].fields[0].linkURL, '_self');
                }
            }
        });
    }

    submitHelper(utterance, session, fileName, base64Data, callback) {
        const params = {
            utterance: utterance,
            session: session,
            fileName: fileName,
            fileContent: base64Data
        };

        submit(params).then(response => {
            callback(response);
        }).catch(() => {
            //TODO: implement error handling
        });
    }

}



/*


    rerender: function (component, helper) {
        this.superRerender();
        window.setTimeout(
    		$A.getCallback(function() {
                if (component.isValid()) {
                    var el = component.find("content").getElement();
				    el.scrollTop = el.scrollHeight;
                }
		    }),200);
	}
*/

/*

<aura:component implements="flexipage:availableForAllPageTypes" controller="BotController" >

    <aura:attribute name="question" type="String" default=""/>
    <aura:attribute name="messages" type="Object[]"/>
    <aura:attribute name="session" type="Array"/>
    <aura:attribute name="height" type="String" default="500px"/>
	<aura:attribute name="files" type="Object[]"/>

    <div style="{#'height: '+v.height}" class="slds-p-vertical--x-small">
		<div aura:id="content" class="content">
	        <aura:iteration items="{!v.messages}" var="message">

                <lightning:layout >
                    <lightning:layoutitem padding="around-small">
                        <lightning:icon iconName="{#message.author == 'Me' ? 'standard:avatar_loading' : 'standard:custom_notification'}" size="small"/>
                    </lightning:layoutitem>

                    <lightning:layoutitem padding="around-small" flexibility="grow">
                        <p><strong>{#message.author}</strong></p>
                        <p class="slds-text-body">{#message.messageText}</p>

                        <aura:if isTrue="{!message.imageURL}">
                            <figure class="slds-image slds-image--card slds-m-top--x-small">
                                <img src='{#message.imageURL}'/>
                            </figure>
                        </aura:if>

                        <aura:iteration items="{!message.buttons}" var="button">
                            <lightning:button label="{#button.label}" name="{#button.value}" onclick="{!c.postbackButtonClickHandler}" class="message-button"/>
                        </aura:iteration>

                        <aura:iteration items="{!message.records}" var="record">
                            <dl class="slds-list--horizontal slds-wrap">
                                <aura:iteration items="{!record.fields}" var="field">
                                    <dt class="slds-item--label slds-text-color--weak slds-truncate">{!field.name}:</dt>
                                    <dd class="slds-item--detail slds-truncate">
                                        <aura:if isTrue="{!field.linkURL}">
                                            <a href="{#field.linkURL}">{#field.value}</a>
                                            <aura:set attribute="else">
                                                {#field.value}
                                            </aura:set>
                                        </aura:if>
                                    </dd>
                                </aura:iteration>
                            </dl>
                        </aura:iteration>

                        <aura:iteration items="{!message.items}" var="item">
                            <aura:if isTrue="{!item.linkURL}">
                                <div class="list-item"><a href="{#item.linkURL}" target="_blank">{#item.name}</a></div>
                                <aura:set attribute="else">
                                    <div class="list-item">{#item.name}</div>
                                </aura:set>
                            </aura:if>
                        </aura:iteration>

                    </lightning:layoutitem>
                </lightning:layout>

            </aura:iteration>

        </div>

        <div class="footer slds-form-element slds-p-horizontal--x-small">
            <div class="slds-form-element__control">
                <c:voice_input onchange="{!c.utteranceHandler}" />
            </div>
        </div>

    </div>

</aura:component>

*/
