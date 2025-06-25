frappe.pages['freeqube-'].on_page_load = function(wrapper) {
    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Task List',
        single_column: true
    });

    // Create container for task list and form
    let container = $('<div>').appendTo(page.main);

    // Create form elements
    let form_html = `
        <div>
            <h4>Create New Task</h4>
            <label>Project Type</label>
            <select id="project_type">
                <option value="">Select</option>
                <option value="Front End Development">Front End Development</option>
                <option value="Back End Development">Back End Development</option>
                <option value="Full Stack Develpment">Full Stack Develpment</option>
                <option value="Mobile App Development">Mobile App Development</option>
            </select><br><br>

            <label>Payable Amount</label>
            <input type="number" id="payable_amount" step="0.01"><br><br>

            <label>Receivable Amount</label>
            <input type="number" id="receivable_amount" step="0.01"><br><br>

            <label>Status</label>
            <select id="task_status">
                <option value="">Select</option>
                <option value="Open">Open</option>
                <option value="Working">Working</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
            </select><br><br>

            <label>Completed By</label>
            <input type="text" id="completed_by"><br><br>

            <label>Completed On</label>
            <input type="date" id="completed_on"><br><br>

            <label>Task Title</label>
            <input type="text" id="task_title"><br><br>

            <label>Task Description</label>
            <textarea id="task_description"></textarea><br><br>

            <label>Estimated Days</label>
            <input type="number" id="estimated_days"><br><br>

            <button id="btn_create_task" class="btn btn-primary">Create Task</button>
        </div>
        <hr>
        <h4>Existing Tasks</h4>
        <div id="task_list"></div>
    `;

    container.html(form_html);

    // Load existing tasks and display them
    function load_tasks() {
        frappe.call({
            method: "freeqube.freeqube.page.freeqube_.freeqube_.get_tasks",
            callback: function(r) {
                if(r.message) {
                    let tasks = r.message;
                    let html = '<table class="table table-bordered"><thead><tr>' + 
                        '<th>Task Title</th><th>Project Type</th><th>Status</th><th>Payable</th><th>Receivable</th><th>Completed By</th><th>Completed On</th></tr></thead><tbody>';
                    tasks.forEach(task => {
                        html += `<tr>
                            <td>${task.task_title || ''}</td>
                            <td>${task.project_type || ''}</td>
                            <td>${task.task_status || ''}</td>
                            <td>${task.payable_amount || ''}</td>
                            <td>${task.receivable_amount || ''}</td>
                            <td>${task.completed_by || ''}</td>
                            <td>${task.completed_on || ''}</td>
                        </tr>`;
                    });
                    html += '</tbody></table>';
                    $('#task_list').html(html);
                }
            }
        });
    }

    load_tasks();

    // Handle create task button click
    $('#btn_create_task').click(function() {
        let data = {
            project_type: $('#project_type').val(),
            payable_amount: parseFloat($('#payable_amount').val()) || 0,
            receivable_amount: parseFloat($('#receivable_amount').val()) || 0,
            task_status: $('#task_status').val(),
            completed_by: $('#completed_by').val(),
            completed_on: $('#completed_on').val(),
            task_title: $('#task_title').val(),
            task_description: $('#task_description').val(),
            estimated_days: parseInt($('#estimated_days').val()) || 0,
        };

        frappe.call({
            method: "freeqube.freeqube.page.freeqube_.freeqube_.create_task",
            args: { data: JSON.stringify(data) },
            callback: function(r) {
                if(r.message) {
                    frappe.msgprint("Task created successfully: " + r.message);
                    load_tasks();  // Refresh the list
                }
            }
        });
    });
}
