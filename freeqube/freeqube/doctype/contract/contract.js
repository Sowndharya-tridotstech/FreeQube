// Copyright (c) 2025, sowndharya and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Contract", {
// 	refresh(frm) {

// 	},
// });


// frappe.ui.form.on("Contract", {
//     refresh: function(frm){
//         if(frappe.user.has_role('Freelancer') && frm.doc.status === 'Open'){
//             let btn = frm.add_custom_button(__('Milestone'), function(){
//                 console.log("Milestone button is created...")
//                 frappe.new_doc("Milestone Template", {
//                     contract: frm.doc.name
//                 });
                
//             });
//             $(btn).removeClass('btn-default').addClass('btn-primary')
//         }
//     }
// })

/*
frappe.ui.form.on('Contract', {
    refresh: function(frm) {
        if (frappe.user.has_role('Freelancer') && frm.doc.status === 'Open') {  
            frm.add_custom_button(__('Create Milestones'), function() {
                frappe.call({
                    method: 'freeqube.freeqube.doctype.contract.contract.create_contract_milestones',
                    args: {
                        contract_name: frm.doc.name
                    },
                    callback: function(r) {
                        if (!r.exc) {
                            frappe.msgprint(__('Milestones created successfully.'));
                            frm.reload_doc();
                        }
                    }
                });
            }, __('Actions'));
        }
    }
});*/

frappe.ui.form.on('Contract', {
    refresh: function(frm) {
        if (frm.doc.project_type) {  // Allow when docstatus is 0 or 1
            frm.add_custom_button(__('Create Milestone'), function () {
                frappe.call({
                    method: 'freeqube.freeqube.doctype.contract.contract.create_milestone_from_contract',
                    args: {
                        contract_name: frm.doc.name
                    },
                    callback: function(r) {
                        if (!r.exc) {
                            frappe.msgprint(r.message);
                            frappe.set_route("Form", "Milestone Template", r.message.milestone_template);
                        }
                    }
                });
            });
        }
    }
});


