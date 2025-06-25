# # Copyright (c) 2025, sowndharya and contributors
# # For license information, please see license.txt

from frappe import _
import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime

class TaskPaymentRequest(Document):
	pass


@frappe.whitelist()
def mark_payment_success(docname, razorpay_payment_id=None):
	doc = frappe.get_doc("Task Payment Request", docname)

	if not doc.task:
		frappe.throw("Task List is not specified for this payment request.")

	try:
		task = frappe.get_doc("Task List", doc.task)
	except frappe.DoesNotExistError:
		frappe.throw(f"Task List {doc.task_list} not found")

	if doc.payment_status != "Paid":
		doc.payment_status = "Paid"
		doc.razorpay_payment_id = razorpay_payment_id
		doc.payment_date = now_datetime()
		doc.save(ignore_permissions=True)

	task.db_set("receivable_amount", (task.receivable_amount or 0) + doc.payable_amount)

	if task.receivable_amount == task.payable_amount:
		task.db_set("payable_amount", 0)
		frappe.db.commit()
		
	return {"status": "success"}


# @frappe.whitelist()
# def mark_payment_success(docname, razorpay_payment_id=None):
#     doc = frappe.get_doc("Task Payment Request", docname)

#     if not doc.task_list:
#         frappe.throw("Task List is not specified for this payment request.")

#     try:
#         task = frappe.get_doc("Task List", doc.task_list)
#     except frappe.DoesNotExistError:
#         frappe.throw(f"Task List {doc.task_list} not found")

#     if doc.payment_status != "Paid":
#         doc.payment_status = "Paid"

#         # Add payable amount to receivable_amount in Task List
#         task.receivable_amount = (task.receivable_amount or 0) + doc.payable_amount

#         # Reset Task List's payable_amount to 0
#         task.payable_amount = 0

#         # Save changes in Task List
#         task.save(ignore_permissions=True)

#         # Optional: save Razorpay Payment ID
#         if razorpay_payment_id:
#             doc.razorpay_payment_id = razorpay_payment_id

#         # Save and update Task Payment Request
#         doc.save(ignore_permissions=True)

#         frappe.db.commit()

#     return {"status": "success"}


