# Copyright (c) 2025, sowndharya and contributors
# For license information, please see license.txt

from frappe import _
import frappe
from frappe.model.document import Document


class MilestoneTemplate(Document):
    pass
	
	# @frappe.whitelist()
	# def load_tasks_by_project_type(project_type):
	# 	if not project_type:
	# 		frappe.throw(_("Project Type is required."))

	# 	# Fetch milestone template by project type
	# 	template = frappe.get_doc("Milestone Template", {"project_type": project_type})

	# 	# Clear existing tasks
	# 	template.set("task_table", [])

	# 	# Get matching tasks
	# 	tasks = frappe.get_all("Task List", filters={"project_type": project_type},
	# 		fields=["name", "task_title", "estimated_days", "status", "task_description" ])

	# 	if not tasks:
	# 		frappe.throw(_("No tasks found for the selected project type."))

	# 	for task in tasks:
	# 		template.append("task_table", {
	# 			"task_title": task.task_title,
	# 			"task_description": task.task_description,
	# 			"estimated_days": task.estimated_days,
	# 			"status": task.status or "Open"
	# 		})

	# 	template.save(ignore_permissions=True)
	# 	return "Tasks added to Milestone Template"