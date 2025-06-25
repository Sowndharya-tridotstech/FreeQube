import frappe

@frappe.whitelist()
def get_tasks():
    # Fetch existing task records
    tasks = frappe.get_all('Task List', fields=[
        'name', 'project_type', 'payable_amount', 'receivable_amount', 
        'task_status', 'completed_by', 'completed_on', 'task_title', 
        'task_description', 'estimated_days'
    ], limit=50)
    return tasks

@frappe.whitelist()
def create_task(data):
    # data is expected as JSON string - parse it
    import json
    task_data = json.loads(data)
    
    doc = frappe.get_doc({
        'doctype': 'Task List',
        'project_type': task_data.get('project_type'),
        'payable_amount': task_data.get('payable_amount'),
        'receivable_amount': task_data.get('receivable_amount'),
        'task_status': task_data.get('task_status'),
        'completed_by': task_data.get('completed_by'),
        'completed_on': task_data.get('completed_on'),
        'task_title': task_data.get('task_title'),
        'task_description': task_data.get('task_description'),
        'estimated_days': task_data.get('estimated_days')
    })
    doc.insert()
    frappe.db.commit()
    return doc.name
