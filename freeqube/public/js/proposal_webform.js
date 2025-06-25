frappe.ready(() => {
    if (!frappe.web_form.doc.name) return;

    const submitBtn = $(`<button class="btn btn-success mt-3">Submit Proposal</button>`);
    $('.web-form-actions').append(submitBtn);

    submitBtn.on('click', function () {
        frappe.confirm("Are you sure you want to submit this proposal?", () => {
            frappe.call({
                method: "frappe.client.submit",
                args: {
                    doctype: "Proposal",
                    name: frappe.web_form.doc.name
                },
                callback: function (r) {
                    console.log("Response from submit:", r);
                    if (!r.exc) {
                        frappe.msgprint("Proposal submitted successfully!");
                        window.location.reload();
                    }
                }
            });
        });
    });
});
