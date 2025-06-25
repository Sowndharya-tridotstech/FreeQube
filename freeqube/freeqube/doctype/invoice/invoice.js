// Copyright (c) 2025, sowndharya and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Invoice", {
// 	refresh(frm) {

// 	},
// });

//FORM Script js- frm.set_value()
// frappe.ui.form.on('Invoice', {
//     refresh: function(frm) {
//         frm.set_value('payment_status', 'Draft');
//     }
// });


//Form script js- frm.refresh()
// frappe.ui.form.on("Invoice", {
//     refresh: function(frm){
//         frm.set_value("paid", 1);
//         // frm.refresh();
//     }
    
// });


//frm.save()
// frappe.ui.form.on('Invoice', {
//     paid: function(frm) {
//         if(frm.doc.paid) {
//             frm.set_value('payment_status', 'Paid');
//             frm.save();
//         }
//     }
// });


//Form Script js- frm.enable save/diable save
// frappe.ui.form.on("Invoice", {
//     amount: function(frm){
//         if(frm.doc.amount <= 0){
//             frm.disable_save();
//             frappe.msgprint("amount value should be greater than 0");
//         }
//         else{
//             frm.enable_save()
//         }
        
//     }
// })


// frm.email_doc
// frappe.ui.form.on("Invoice", {
//     refresh: function(frm){
//         frm.add_custom_button("Email", () =>{
//             frm.email_doc().then(()=>{
//                 frappe.msgprint("Email sended successfully")
//             })
//         });
        
//     },
   
// })

//Form script js - is_new()
// frappe.ui.form.on("Invoice", {
//     refresh: function(frm){
//         if(frm.is_new()){
//             frm.add_custom_button("Click me", function(){
//                 frappe.msgprint("button is clicked");
//             })
//         }
//     }
// })


//Form Script js -  set_intro()
// frappe.ui.form.on("Invoice", {
//     refresh: function(frm){
//         console.log("test")
//         //frm.remove_custom_button - format script js
//         // if(frm.doc.paid){
//         //     frm.remove_custom_button("Mark as Paid", 'danger');
//         // }
//         // else{
//             // frm.add_custom_button("Mark as Paid", () => {
//             //     frm.doc.paid = 1
//             //     frm.save()
//             // })
//             frm.clear_custom_button();
//         // }
//         if(frm.doc.amount >= 0){ 
//             console.log("123")
//             frm.set_df_property("amount", 'read_only', 1);
//             frm.refresh_field("paid");
//     }

//     }
// })


// frappe.ui.form.on("Invoice", {
//     refresh: function(frm) {
//             frm.add_custom_button("Pay Now", function () {
                
//                 // Razorpay options
//                 let options = {
//                     key: "rzp_test_1DP5mmOlF5G5ag",  // ⚠️ Replace with your Razorpay TEST key ID
//                     amount: 1000 * 100,  // amount in paise
//                     currency: "INR",
//                     name: "Test Company",
//                     description: "Invoice Payment - " + frm.doc.name,
//                     // handler: function (response) {
//                     //     frappe.msgprint("Payment successful! Razorpay ID: " + response.razorpay_payment_id);
                        
//                     //     // Update the invoice fields
//                     //     frm.set_value("paid", 1);  // Assuming 'paid' is a Check field
//                     //     frm.set_value("payment_status", "Paid");
//                     //     frm.set_value("payment_method", "Razorpay");

//                     //     frm.save_or_update();  // Save updated values
//                     // },
//                     // prefill: {
//                     //     name: frm.doc.customer_name || "Test User",
//                     //     email: frm.doc.email || "test@example.com",
//                     //     contact: frm.doc.phone || "9999999999"
//                     // },
//                     // theme: {
//                     //     color: "#3399cc"
//                     // }
//                 };

//                 // Open Razorpay window
//                 let rzp = new Razorpay(options);
//                 rzp.open();
//             });
//     }
// });


frappe.ui.form.on("Invoice",{
    refresh(frm){
        frm.add_custom_button("Pay Now", () => {
            let details = {
                key: "rzp_test_1DP5mmOlF5G5ag",
                amount: 1000 * 100,
                currency: "INR",
                company: "Test Company",
                description:"Invoice payment -"+ frm.doc.name
            };
            let rzp = new Razorpay(details);
            rzp.open();
        })
    }
})