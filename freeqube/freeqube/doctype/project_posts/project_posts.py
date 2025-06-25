# Copyright (c) 2025, sowndharya and contributors
# For license information, please see license.txt

# # import frappe
# from frappe.model.document import Document


# class ProjectPosts(Document):
# 	pass



import frappe
from frappe.model.document import Document
from frappe.utils import nowdate

class ProjectPosts(Document):

    def before_insert(self):
        # Automatically assign the current user as the client
        self.client = frappe.session.user
        frappe.msgprint("Project created by: {}".format(self.client))

    def validate(self):
        # Ensure deadline is not in the past
        if self.deadline and self.deadline < nowdate():
            frappe.throw("Deadline cannot be in the past.")

        # Ensure required fields are filled
        if not self.project_title or not self.description or not self.budget or not self.project_type:
            frappe.throw("Title, Description, and Budget are required.")

        # Validate status value
        if self.status not in ["Open", "Hired", "Closed"]:
            frappe.throw("Status must be either 'Open' or 'Closed'.")

    # def before_save(self):
    #     # Prevent updates to a closed project (unless creating a new one)
    #     if self.status == "Closed" and not self.flags.in_insert:
    #         frappe.throw("You cannot update a closed project.")

    def get_dashboard_data(self):
        return {
            'label': 'Proposals',
            'items': [{
                'type': 'doctype',
                'name': 'Proposal',
                'label': 'Proposals',
                'filter': {'project': self.name}
            }]
        }

			