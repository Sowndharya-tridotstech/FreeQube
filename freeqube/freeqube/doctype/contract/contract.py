from frappe import _
import frappe
from frappe.model.document import Document


class Contract(Document):
    def on_update(self):
        # if self.workflow_state == "Complete":
        #     create_milestone_from_contract(self.name)
            frappe.log_error("workflow state:", self.workflow_state)


@frappe.whitelist()
def create_milestone_from_contract(contract_name):
    contract = frappe.get_doc("Contract", contract_name)
    project_type = contract.project_type
    project = contract.project_post

    if not project_type:
        frappe.throw(_("Contract must have a Project Type."))

    existing = frappe.db.exists("Milestone Template", {"contract": contract_name})
    if existing:
        frappe.msgprint(_("Milestone Template already exists for this contract: {0}").format(existing))
        return {
            "message": _("Milestone Template already exists"),
            "milestone_template": existing
        }

    # Fetch all tasks linked to this project_type
    tasks = frappe.get_all("Task List",
        filters={"project_type": project_type},
        fields=["name", "task_title", "task_description", "estimated_days", "task_status"]
    )

    if not tasks:
        frappe.throw(_("No tasks found for Project Type: {0}").format(project_type))

    # Create new Milestone Template
    milestone_template = frappe.new_doc("Milestone Template")
    milestone_template.project_type = project_type
    milestone_template.project = project
    milestone_template.contract = contract.name  

    for task in tasks:
        milestone_template.append("task_table", {
            "task_id": task.name,
            "task_title": task.task_title,
            "task_description": task.task_description,
            "estimated_days": task.estimated_days,
            "status": task.task_status or "Open"
        })

    milestone_template.save()
    frappe.db.commit()

    return {
        "message": _("Milestone Template created successfully"),
        "milestone_template": milestone_template.name
    }
