#This Python Script is used to read the user information in the ChangeOwner(Technician) Role and use that to update the Implementer Role.This script will be triggered using the Change Custom Trigger feature,which can be configured under the Admin Tab \ Change Custom Triggers.

#Below are the list of Packages used in this Script.
import sys
import json
import urllib

#Reading the argument passed to the script.The ChangeRequest details are stored as a JSON Object in a file and its path is provided to the Script as input.
file_Path = sys.argv[1]
with open(file_Path) as data_file:
    data = json.load(data_file)

inputData = data["INPUT_DATA"]
changeData = inputData["entity_data"]

#Below is a Sample of the Change Details in Json Format.Please note that there is a Change in the ChangeRequest Json after build 9203 of SDP.
'''
{"INPUT_DATA":{"entity":"change","login_name":"administrator","entity_data":{"id":1,"template":{"id":1,"name":"General Template"},"workflow":{"id":1,"name":"SDGeneral"},"SLAID":"","ISOVERDUE":null,"type":{"id":3,"name":"Significant"},"group":null,"category":{"id":11,"name":"Operating System"},"subcategory":{"id":23,"name":"Windows Server 2003"},"item":null,"impact":{"id":1,"name":"High"},"urgency":{"id":2,"name":"High"},"priority":{"id":4,"name":"High"},"risk":{"id":3,"name":"High"},"scheduled_start_on":{"value":1475697180000,"display_value":"Oct 5, 2016 03:53 PM"},"scheduled_end_on":null,"created_on":{"value":1475610888931,"display_value":"Oct 4, 2016 03:54 PM"},"completed_on":null,"services_affected":[{"id":2,"name":"Communication"}],"assets":[],"title":"Testing Read Json","reason_for_change":{"id":5,"name":"Patch updates"},"description":"<br />","state":{"stage":{"id":1,"name":"Submission"},"status":{"id":3,"name":"Requested"},"comments":""},"roles":[{"id":1,"name":"ChangeManager","users":[{"id":3,"name":"Gopinath"}]},{"id":2,"name":"ChangeOwner","users":[{"id":6,"name":"Balaji"}]},{"id":3,"name":"ChangeRequester","users":[{"id":902,"name":"Prem"}]},{"id":4,"name":"CAB","users":[]},{"id":5,"name":"ChangeApprover","users":[{"id":9,"name":"Pugazh"},{"id":1801,"name":"Bala"}]},{"id":6,"name":"Line Manager","users":[]},{"id":7,"name":"Implementer","users":[]},{"id":8,"name":"Reviewer","users":[]}]},"entity_diff_data":{"type":{"old":{"id":2,"name":"Major"},"new":{"id":3,"name":"Significant"}}}}}
'''

#The Roles section in the Change Request is represented in the JSON file as a JSON Array.We store that in the variable called rolesJson.
rolesJson = changeData["roles"]

#Parsing the Roles Json Array and finding the Entry for the ChangeOwner(Technician).The ChangeOwner Role can have only one user in it.The users ID and Name are stored in a JSON Array called "users".The following is an example of a Roles JSON string that stores the ChangeOwner details.
'''{"id":2,"name":"ChangeOwner","users":[{"id":6,"name":"Balaji"}]}'''

for role in rolesJson:
	if role["name"] == "ChangeOwner":
		users=role["users"]

#The "users" variable will store a value similar to [{"id":6,"name":"Balaji"}].This is a combination of the users ID and Name.This will be used to set the 'user' value of the Implementer Role Json .

#Constructing the JSON object that is used to Set the user in the Implementer Role.
#The following is a Sample of the JSON Object for Updating Roles in a Change Request.
'''
{"operations": [{"input_data": {"change": {"roles": [{"users": [{"name": "Pugazh", "email": "technician4@sohocorp.com"}], "name":
"Implementer"}]}}, "operation_name": "UPDATE_ROLES"}], "message": "Updating Change Roles through Custom Trigger"}
'''
#You can find more information about this operation in the link give below.
#https://www.manageengine.com/products/service-desk/help/adminguide/configurations/problem_changemanagement/change-sample-scenario-custom-triggers.html

returnjson={}
returnjson["message"]="Updating Change Roles through Custom Trigger" #This is a Custom Message that will appear in the Change History.
returnjson["operations"]=[]

operationjson={}
operationjson["operation_name"]="UPDATE_ROLES"

input_datajson={}
changejson={}
changejson["roles"]=[]

rolesjson={}
rolesjson["name"]="Implementer"
rolesjson["users"]=users #Setting the user value got from the ChangeOwner to the ChangeImplementer role.

changejson["roles"].append(rolesjson)
input_datajson["change"]=changejson
operationjson["input_data"]=input_datajson

returnjson["operations"].append(operationjson)

#Returning the Constructed Json.
print(returnjson)
