# import frappe
# from frappe.model.document import Document

# class TaskList(Document):
# 	pass

import frappe
from frappe.model.document import Document
# from frappe.utils import now_datetime

class TaskList(Document):

	def validate(self):
		self.set_payable_amount_on_completion()
		
#--------------------------------------payable amount is set once task completion done--------------------------------------------------------#        

	def set_payable_amount_on_completion(self):
		if self.task_status == "Completed":
			current_user = frappe.session.user

			# Only freelancers allowed
			if "Freelancer" not in frappe.get_roles(current_user):
				frappe.throw("Only freelancers are allowed to complete tasks.")

			# Ensure project_type is set
			if not self.project_type:
				frappe.throw("Project Type must be set to calculate payable amount.")

			# Calculate total budget for all Project Posts with the same project_type
			total_budget = frappe.db.sql("""
				SELECT SUM(budget) FROM `tabProject Posts`
				WHERE project_type=%s
			""", (self.project_type,), as_dict=False)

			total_budget_value = total_budget[0][0] or 0

			# Count tasks with the same project_type
			total_tasks = frappe.db.count("Task List", {"project_type": self.project_type})

			self.payable_amount = (total_budget_value / total_tasks) if total_tasks else 0

			# Show a success message
			frappe.msgprint("Task marked as completed. Payable amount has been calculated.")
#------------------------------------------------milestone template child table change status to completd once task status is completed---------------------------------------------------------------#
	def before_save(self):
		self.update_milestone_task_row()
			
	def update_milestone_task_row(self): 
		if self.task_status != "Completed":
			return

		if not self.project_type:
			return

		# Fetch Milestone Template based on project type and project
		milestone_templates = frappe.get_all(
			"Milestone Template",
			filters={
				"project_type": self.project_type
			},
			fields=["name"]
		)

		if not milestone_templates:
			return

		# Assuming only one milestone template per project/project_type
		milestone = frappe.get_doc("Milestone Template", milestone_templates[0].name)

		# Find matching task row by title
		updated = False
		for row in milestone.task_table:
			if row.task_title.strip() == self.task_title.strip():
				row.status = "Completed"
				updated = True
				break

		if updated:
			milestone.save(ignore_permissions=True)
			frappe.msgprint("Milestone Template task row also marked as Completed.")

#------------------------------------------------------completed by and completed on should trigger immediately after select completed in the dropdown of task status-----------------------------------------------#
@frappe.whitelist()
def is_freelancer(user=None):
	user = user or frappe.session.user
	roles = frappe.get_roles(user)
	return "Freelancer" in roles
#------------------------------------------------------------------------------------------------------------#

@frappe.whitelist()
def create_payment_request(task_name):
    task = frappe.get_doc("Task List", task_name)
    if task.task_status != "Completed":
        frappe.throw("Task must be completed before requesting payment.")

    if frappe.db.exists("Task Payment Request", {"task": task.name, "payment_status": ["in", ["Requested", "Paid"]]}):
        frappe.throw("Payment already requested or completed.")

    payment_request = frappe.get_doc({
        "doctype": "Task Payment Request",
        "task": task.name,
        "freelancer": frappe.session.user,
        "client": frappe.session.user,
        "payable_amount": task.payable_amount,
        "payment_status": "Requested",
        "requested_on": frappe.utils.now_datetime()
    })
    payment_request.insert(ignore_permissions=True)

    frappe.msgprint("Payment request submitted to client.")
