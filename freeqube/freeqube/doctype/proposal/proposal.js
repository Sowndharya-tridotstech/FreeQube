// Copyright (c) 2025, sowndharya and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Proposal", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on("Proposal", {
    refresh: function(frm) {
        console.log("wroksjfjj;oi8y")
        // When form is loaded or refreshed, check workflow_state
        check_and_create_contract(frm);
        console.log("contract:", frm.doc.contract);

        if(frm.doc.contract_created && frm.doc.workflow_state === "Approved" && frm.doc.contract) {
            frm.add_custom_button("View Contract", function () {
                frappe.set_route("Form", "Contract", frm.doc.contract);
            }, __("View"));
        }

    },

    workflow_state: function(frm) {
        // When workflow_state field changes, check and create contract
        check_and_create_contract(frm);
    }
});

function check_and_create_contract(frm) {
    if(frm.doc.workflow_state === "Approved" && frm.doc.docstatus === 1 && !frm.doc.contract_created) {
        // Call server method to create contract
        frappe.call({
            method: "freeqube.freeqube.doctype.proposal.proposal.create_contract_from_proposal",
            args: { proposal_name: frm.doc.name },
            callback: function(r) {
                if(r.message) {
                    console.log("message", r.message)
                    frappe.msgprint(r.message);
                    frm.reload_doc();
                }
            }
        });
    }
}


frappe.realtime.on("freelancer_proposal_submitted", (data) => {
    console.log("works");  // Log when event is received

    frappe.show_alert({
        message: data.body,
        indicator: 'green'
    });
});




