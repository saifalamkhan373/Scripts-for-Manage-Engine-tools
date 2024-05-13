configuration = global_function_6();
instanceJson = context.get("instance");
helpdeskID = instanceJson.get("id");
Changetemplate = "Change request Form(Test template)";
resources_json = requestObj.get("resources");
Risks = resources_json.get("res_1801").get("qstn_text_1808").get("value");
AS_IS = resources_json.get("res_1801").get("qstn_text_1810").get("value");
TO_BE = resources_json.get("res_1801").get("qstn_text_1811").get("value");
Impact_Analysis = resources_json.get("res_1801").get("qstn_text_1814").get("value");
Change_Request_Type = resources_json.get("res_1801").get("qstn_select_1805").get("name");
Category = resources_json.get("res_1801").get("qstn_select_1812").get("name");
Purpose = resources_json.get("res_1801").get("qstn_select_1813").get("name");
ImpactedUsers = resources_json.get("res_1801").get("qstn_check_1807");
ImpactedUsers_values = List();
for each answer in ImpactedUsers{
	name = answer.toMap().get("name");
	ImpactedUsers_values.add(name);
}
SystemNameTobechanged = resources_json.get("res_1801").get("qstn_check_1809");
SystemNameTobechanged_values = List();
for each answer in SystemNameTobechanged{
	name = answer.toMap().get("name");
	SystemNameTobechanged_values.add(name);
}
Change_impact = resources_json.get("res_1801").get("qstn_check_1806");
Change_impact_values = List();
for each answer in Change_impact{
	name = answer.toMap().get("name");
	Change_impact_values.add(name);
}
description = requestObj.get("description") + "<br> <br> Impacted Users :"+ { ImpactedUsers_values } + "<br> <br> System Name To be changed :"+ { SystemNameTobechanged_values } + " <br> <br> Risks: " +Risks+" <br> <br> Change Request Type: "+Change_Request_Type+" <br> <br> AS IS الوضع الحالي: " +AS_IS+" <br> <br> To Be الوضع المستهدف: " +TO_BE+" <br> <br> Impact Analysis تفاصيل التأثير: " +Impact_Analysis+" <br> <br>  Category التصنيف: " +Category+" <br> <br> Purpose الغرض: " +Purpose+" <br> <br> Change Impact التأثير " +Change_impact+" <br> <br>  System Name To be changed اسم النظام المستهدف " +SystemNameTobechanged;
inputData = {
	"change": {
		"template": {
			"name": Changetemplate
		},
		"description": description,
		"title": requestObj.get("subject"),
		"change_requester": {
			"id": requestObj.get("requester").get("id")
		},
		"workflow": {
			"id": "602"
		}
	}
};

response = invokeurl
[
	url: configuration.get("url") + "/api/v3/changes"
	type: POST
	parameters: {"input_data":inputData}
	headers: {"authtoken":configuration.get("technicianKey"),"PORTALID":helpdeskID}
];

returnObj = Collection();
if(response.get("response_status").get("status_code") == 2000) {
	changeid = response.get("change").get("id");
	msg = "New Change added with ChangeID: "+ changeid;

	input_data = {"request_initiated_change": {"change": {"id": changeid}}};
	response = invokeurl
	[
		url: configuration.get("url") + "/api/v3/requests/"+requestObj.get("id")+"/request_initiated_change"
		type: POST
		parameters: {"input_data":input_data}
		headers: {"authtoken":configuration.get("technicianKey"),"PORTALID":helpdeskID}
	];
	if(response.get("response_status").get("status_code") == 2000) {
		msg = msg + " and change is associated successfully!";
		returnObj.insert("result":"Success","message":msg);
	}
	else{
		msg = msg + " but failed to associate with the request!";
		returnObj.insert("result":"Success","message":msg);
	}
}
else{
	returnObj.insert("result":"failure","message":"Problem in creating change request! "+response);
}
return returnObj;