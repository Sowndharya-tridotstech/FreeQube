// Copyright (c) 2025, sowndharya and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Project Posts", {
// 	refresh(frm) {
//         console.log("Refreshes!!!!")
//         if (frappe.user.has_role('Freelancer') && frm.doc.status === 'Open') {
//             console.log("works")
//             let btn = frm.add_custom_button(__('Proposal'), function() {
//                 frappe.new_doc('Proposal', {
//                     project: frm.doc.name,
//                     project_title: frm.doc.project_title
//                 });
//             });
//            $(btn).removeClass('btn-default').addClass('btn-success');
//         }

// 	},
// });


frappe.ui.form.on("Project Posts", {
    refresh(frm) {
        console.log("Project Post refreshed!");

        // Only for freelancers and when project is open
        if (frappe.user.has_role('Freelancer') && frm.doc.status === 'Open') {
            // Check if an approved proposal already exists
            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: "Proposal",
                    filters: {
                        project: frm.doc.name,
                        workflow_state: "Approved"
                    },
                    limit_page_length: 1
                },
                callback: function(r) {
                    if (r.message && r.message.length > 0) {
                        console.log("Approved proposal already exists. Button not shown.");
                        return; // Hide button
                    } else {
                        // Show proposal button if none is approved
                        let btn = frm.add_custom_button(__('Proposal'), function() {
                            frappe.new_doc('Proposal', {
                                project: frm.doc.name,
                                project_title: frm.doc.project_title
                            });
                        });

                        $(btn).removeClass('btn-default').addClass('btn-success');
                    }
                }
            });
        }
    }
});
