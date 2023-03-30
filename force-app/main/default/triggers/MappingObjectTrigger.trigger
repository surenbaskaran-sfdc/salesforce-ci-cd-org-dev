trigger MappingObjectTrigger on Mapping_Object__c (before delete, after delete) 
{
    if(trigger.isBefore && Trigger.isDelete){
        /*Mapping_Object__c delMappingObject = Trigger.Old[0];
        if(SFConnectController.checkIsUsedMappingObject(delMappingObject.Name))
            delMappingObject.addError('Cannot delete this Object. It is being used in a Contract Rule.');*/
        SFConnectController.checkObjectUsedStatus(Trigger.Old);
    }
}