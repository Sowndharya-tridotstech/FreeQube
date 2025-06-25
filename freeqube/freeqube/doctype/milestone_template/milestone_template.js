// Copyright (c) 2025, sowndharya and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Milestone Template", {
// 	refresh(frm) {

// 	},
// });
/*
frappe.ui.form.on('Milestone Template', {
    refresh(frm) {
        frm.add_custom_button('Tasks', function () {
            // Extract task titles from the child table
            const task_titles = frm.doc.task_table.map(task => task.task_title);

            // Use the route_options to pass filters
            frappe.route_options = {
                "task_title": ["in", task_titles]
            };

            // Redirect to filtered Task List view
            frappe.set_route("List", "Task List");
        }, __('View'));
    }
});
*/


frappe.ui.form.on('Milestone Template', {
    refresh(frm){
        if(frappe.user.has_role("Freelancer") && frm.doc.docstatus === 0){
            frm.add_custom_button('Tasks', function(){
                const task_titles = frm.doc.task_table.map(task => task.task_title);
                frappe.route_options ={
                    "task_title": ["in", task_titles]
                };
                frappe.set_route("List", "Task List")
            }, __("View"));
         }

         //Debug Tasks
         frm.add_custom_button('Debug Tasks', () => {
            const task_rows = frm.doc.task_table || [];
            console.log("Debugging task_table rows:");
            task_rows.forEach((row, index) => {
                console.log(`Row ${index + 1}:`, row);
            });
        }, 'Actions');

    }
})




// frappe.ui.form.on('Milestone Template', {
//     refresh: function(frm) {
//         frm.add_custom_button('Debug Tasks', () => {
//             const task_rows = frm.doc.task_table || [];
//             console.log("Debugging task_table rows:");
//             task_rows.forEach((row, index) => {
//                 console.log(`Row ${index + 1}:`, row);
//             });
//         }, 'Actions');
//     }
// });
