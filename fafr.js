var fafrKeyList = ["WorkOrder_Fields_UDF_CHAR1", "WorkOrder_Fields_UDF_CHAR10", "WorkOrder_Fields_UDF_CHAR13", "WorkOrder_Fields_UDF_CHAR2", "WorkOrder_Fields_UDF_CHAR4"];

fafrKeyList.forEach(listUsers);

function listUsers(fafrKey, index) {

    var cs_value = $CS.getValue(fafrKey);

    $CS.referField(fafrKey, "users", {
        multiple: true,
        ajax: {
            url: "api/v3/users",
            data: function(params) {
                var input_data = {
                    "list_info": {
                        "row_count": 100,
                        "fields_required": ["email_id"],
                        "search_fields": {
                            "email_id": params
                        }
                    }
                };
                if (params === "") {
                    delete input_data.list_info.search_fields;
                }
                return {
                    "input_data": $CS.toJSONString(input_data)
                };
            },
            results: function(res) {
                var list = [];
                var data = res.users;
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i].email_id != null) {
                        list.push({
                            id: data[i].email_id,
                            text: data[i].email_id
                        });
                    }
                }
                return {
                    results: list
                };
            }
        },
        formatSelection: function(data) {
            return data.id;
        }
    });

    if (cs_value !== "") {
        var arr = cs_value.split(",");
        var arr_length = arr.length;
        var list = [];
        for (var i = 0; i < arr_length; i++) {
            list.push({
                id: arr[i],
                text: arr[i]
            });
        }
        $CS.element(fafrKey).select2("data", list);
    }
}