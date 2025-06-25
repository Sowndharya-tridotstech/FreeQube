# Copyright (c) 2025, sowndharya and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


# class Feedback(Document):
# pass

class Feedback(Document):
    def validate(self):
        contract_status = frappe.db.get_value("Contract", self.contract, "status")
        if contract_status != "Completed":
            frappe.throw("Feedback can only be submitted after the contract is completed.")
