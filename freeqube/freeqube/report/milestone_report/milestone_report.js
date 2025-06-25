// Copyright (c) 2025, sowndharya and contributors
// For license information, please see license.txt

// frappe.query_reports["Milestone Report"] = {
// 	"filters": [

// 	]
// };


frappe.query_reports["Milestone Report"] = {
    filters: [
        {
            fieldname: "project",
            label: "Project",
            fieldtype: "Link",
            options: "Project Posts",
            reqd: 0
        },
        {
            fieldname: "task_status",
            label: "Task Status",
            fieldtype: "Select",
            options: "\nOpen\nIn Progress\nCompleted",
            reqd: 0
        },
		{
			fieldname: "task",
			label: "Task",
			fieldtype: "Link",
			options: "Task List",
			reqd: 0
		}
    ],

};




// }
// onload: function(report) {
// 	// Auto refresh when filters change
// 	report.page.set_primary_action('Refresh', () => {
// 		report.refresh();
// 	});
// }