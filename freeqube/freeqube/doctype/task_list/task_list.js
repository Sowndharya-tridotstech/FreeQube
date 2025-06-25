// Copyright (c) 2025, sowndharya and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Task List", {
// 	refresh(frm) {

// 	},
// });
frappe.ui.form.on('Task List', {
    task_status: function(frm) {
        if (frm.doc.task_status === "Completed" && !frm.doc.completed_by) {
            frappe.call({
                method: "freeqube.freeqube.doctype.task_list.task_list.is_freelancer",  // update with your actual path
                args: { user: frappe.session.user },
                callback: function(r) {
                    if (r.message === true) {
                        frm.set_value('completed_by', frappe.session.user);
                        frm.set_value('completed_on', frappe.datetime.now_datetime());
                    } else {
                        frappe.msgprint("Only freelancers are allowed to complete tasks.");
                        frm.set_value('task_status', frm.doc._previous_status || "Working");
                    }
                }
            });
        }
    },

    refresh: function(frm) {
        frm.doc._previous_status = frm.doc.task_status;

        if (frm.doc.payable_amount >= 0) {
            frm.add_custom_button("Request Payment", () => {
                frappe.call({
                    method: "freeqube.freeqube.doctype.task_list.task_list.create_payment_request",
                    args: {
                        task_name: frm.doc.name
                    },
                    callback(r) {
                        if (!r.exc) {
                            frm.reload_doc();
                        }
                    }
                });
            });
        }
    }
});




