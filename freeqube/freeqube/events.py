import frappe

def notify_client_on_submit(doc, method):
    client_user = doc.client  # User ID (like "client@gmail.com")
    freelancer_name = doc.freelancer_name

    if not client_user:
        frappe.logger().error("Proposal has no client assigned.")
        return

    try:
        frappe.publish_realtime(
            event="freelancer_proposal_submitted",
            message={
                "title": "New Proposal Submitted",
                "body": f"{freelancer_name} submitted a proposal for your project."
            },
            user=client_user
        )
    except Exception as e:
        frappe.logger().error(f"Realtime error: {e}")
