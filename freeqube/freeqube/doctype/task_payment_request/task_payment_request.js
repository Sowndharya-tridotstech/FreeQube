
/*//Working Perfect
frappe.ui.form.on('Task Payment Request', {
    refresh: function(frm) {
        if (frappe.user.has_role("Client") && frm.doc.payment_status !== "Paid") {
            frm.add_custom_button('Pay Now', () => {
                let options = {
                    "key": "rzp_test_1DP5mmOlF5G5ag", // Replace with your Razorpay Test Key
                    "amount": frm.doc.payable_amount * 100, // in paise
                    "currency": "INR",
                    "name": "Freeqube Inc.",
                    "description": "Task Payment",
                    "handler": function (response){
                        frappe.msgprint("Payment successful! Razorpay Payment ID: " + response.razorpay_payment_id);
                        // Optional: Save response to the doc using frappe.call
                    },
                    "prefill": {
                        "name": frappe.session.user_fullname,
                        "email": frappe.session.user,
                    },
                    "theme": {
                        "color": "#528FF0"
                    }
                };

                let rzp = new Razorpay(options);
                rzp.open();
            });
        }
    }
}); */


frappe.ui.form.on('Task Payment Request', {
    refresh: function(frm) {
        if (frappe.user.has_role("Client") && frm.doc.payment_status !== "Paid") {
            frm.add_custom_button('Pay Now', () => {
                let options = {
                    "key": "rzp_test_1DP5mmOlF5G5ag", // Replace with your Razorpay Test Key
                    "amount": frm.doc.payable_amount * 100, // in paise
                    "currency": "INR",
                    "name": "Freeqube Inc.",
                    "description": "Task Payment",
                    "handler": function (response) {
                        // Call backend to mark payment success and update Task
                        frappe.call({
                            method: "freeqube.freeqube.doctype.task_payment_request.task_payment_request.mark_payment_success",
                            args: {
                                docname: frm.doc.name,
                                razorpay_payment_id: response.razorpay_payment_id
                            },
                            callback: function (r) {
                                if (r.message.status === "success") {
                                    frappe.msgprint("Payment Successful!");

                                    // Reload form to reflect status and hide Pay Now button
                                    frm.reload_doc();
                                }
                            }
                        });
                    },
                    "prefill": {
                        "name": frappe.session.user_fullname,
                        "email": frappe.session.user,
                    },
                    "theme": {
                        "color": "#528FF0"
                    }
                };

                let rzp = new Razorpay(options);
                rzp.open();
            });
        }
    }
});
