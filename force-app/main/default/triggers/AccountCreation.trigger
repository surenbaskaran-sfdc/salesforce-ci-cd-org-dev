trigger AccountCreation on Account(after insert){

for(Account a : Trigger.new){

 AccountCreatedFromSource.createAccountinTargetOrg(a.Name, a.Id);

}

}