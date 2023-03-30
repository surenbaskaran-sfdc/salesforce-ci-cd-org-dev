import { LightningElement,api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

import NAME_FIELD from '@salesforce/schema/Order.Name';
import ACCOUNT_FIELD from '@salesforce/schema/Order.AccountId';
import STARTDATE_FIELD from '@salesforce/schema/Order.EffectiveDate';
import STATUS_FIELD from '@salesforce/schema/Order.Status';

export default class CreateOrder extends NavigationMixin(LightningElement)  {

    // objectApiName is "Order" when this component is called
    @api objectApiName;
    @track isShowModal = false;

    fields = [NAME_FIELD, ACCOUNT_FIELD, STARTDATE_FIELD, STATUS_FIELD];

    handleSuccess(event) {
        console.log(JSON.stringify(event.detail))
        const evt = new ShowToastEvent({
            title: 'Order created',
            message: 'Order '+ '"'+event.detail.fields.OrderNumber.value + '" was created: ',
            variant: 'success',
        });
        this.dispatchEvent(evt);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.detail.id,
                objectApiName: 'Order',
                actionName: 'view'
            },
        });
    }
    closeModal() {
        // Navigation to Order List view(recent)
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Order',
                actionName: 'list'
            },
            state: {
                filterName: 'Recent'
            },
        });
    }
}