from frappe import _ 
import frappe
from frappe.model.document import Document

class Proposal(Document):
    def before_insert(self):
        # Automatically set the freelancer submitting the proposal
        self.freelancer = frappe.session.user

    def validate(self):
        # Prevent duplicate proposals for the same project by the same freelancer
        if frappe.db.exists("Proposal", {
            "project": self.project,
            "freelancer": self.freelancer,
            "name": ["!=", self.name]
        }):
            frappe.throw(_("You have already submitted a proposal for this project."))

        # Prevent submitting to closed projects
        project_status = frappe.get_value("Project Posts", self.project, "status")
        if project_status == "Closed":
            frappe.throw(_("You cannot submit a proposal to a closed project."))
#-------------------------------------------Notification sent to client----------------------------------#

    def before_submit(self):
        if self.workflow_state == "Submitted":
            self.notify_client()

    def notify_client(self):
        client_user = self.client
        freelancer_name = self.freelancer_name
        proposal_name = self.name

        if not client_user:
            frappe.logger().error("Proposal has no client assigned.")
            return

        try:
            # Create Notification Log (bell icon alert)
            frappe.get_doc({
                "doctype": "Notification Log",
                "document_type": "Proposal",
                "document_name": self.name,
                "subject": "New Proposal Submitted",
                "email_content": f"{freelancer_name} submitted a proposal{proposal_name} for your project.",
                "for_user": client_user,
                "type": "Alert"
            }).insert(ignore_permissions=True)
            frappe.msgprint("proposal submitted sucessfully and notification sended to client")

            # Also send a realtime alert (optional popup)
            frappe.publish_realtime(
                event="freelancer_proposal_submitted",
                message={
                    "title": "New Proposal Submitted",
                    "body": f"{freelancer_name} submitted a proposal for your project."
                },
                user=client_user
            )
            
            frappe.logger().info(f"Notification sent to user: {client_user}")

        except Exception as e:
            frappe.logger().error(f"Notification Log error: {e}")


#------------------------------------Contract Creation Automatically-----------------------------------#
@frappe.whitelist()
def create_contract_from_proposal(proposal_name):
    proposal = frappe.get_doc("Proposal", proposal_name)

    # Only proceed if submitted and approved
    if proposal.docstatus == 1 and proposal.workflow_state == "Approved":
        if not proposal.contract_created and not frappe.db.exists("Contract", {"proposal": proposal_name}):
            contract = frappe.new_doc("Contract")
            contract.proposal = proposal_name
            contract.project_post = proposal.project
            contract.client = proposal.client
            contract.freelancer = proposal.freelancer
            contract.total_amount = proposal.amount
            contract.status = "Open"  
            contract.insert()
            frappe.db.commit()

            # Set contract_created flag in Proposal
            proposal.db_set("contract", contract.name, update_modified=False)
            proposal.db_set("contract_created", 1)

            # Update Project Post status to 'Hired'
            frappe.db.set_value("Project Posts", proposal.project, "status", "Hired")

            return f"Contract created successfully for Proposal {proposal_name} and project marked as Hired."
        else:
            return "Contract already exists or already created."
    else:
        return "Proposal must be submitted and approved before creating a contract."

