# Copyright (c) 2025, sowndharya and contributors
# For license information, please see license.txt

# import frappe

import frappe

def execute(filters=None):
    columns = [
        {"label": "Contract", "fieldname": "contract", "fieldtype": "Link", "options": "Contract"},
        {"label": "Project", "fieldname": "project", "fieldtype": "Link", "options": "Project Posts"},
        {"label": "Project Type", "fieldname": "project_type", "fieldtype": "Data"},
        {"label": "Project Deadline", "fieldname": "deadline", "fieldtype": "Date"},
        {"label": "Task ID", "fieldname": "task_id", "fieldtype": "Link", "options": "Task List"},
        {"label": "Task Title", "fieldname": "task_title", "fieldtype": "Data"},
        {"label": "Task Status", "fieldname": "task_status", "fieldtype": "Data"},
        {"label": "Completion Date", "fieldname": "completion_date", "fieldtype": "Date"},
        {"label": "Estimated Days", "fieldname": "estimated_days", "fieldtype": "Int"},
    ]

    data = []

    milestone_templates = frappe.get_all("Milestone Template", fields=["name", "contract", "project", "project_type"])

    for template in milestone_templates:
        # Get deadline from linked Project Post
        project_deadline = frappe.db.get_value("Project Posts", template.project, "deadline")

        # Get child table entries
        child_tasks = frappe.get_all("Milestone Task Detail", filters={"parent": template.name},
            fields=["task_id", "task_title", "estimated_days"])

        for task in child_tasks:
            # Get task status and completion date from Task List
            task_doc = frappe.get_doc("Task List", task.task_id) if task.task_id else None

            data.append({
                "contract": template.contract,
                "project": template.project,
                "project_type": template.project_type,
                "deadline": project_deadline,
                "task_id": task.task_id,
                "task_title": task.task_title,
                "task_status": task_doc.task_status if task_doc else "",
                # "completion_date": task_doc.estimated_days if task_doc else "",
                "estimated_days": task.estimated_days,
            })

    return columns, data
