var latest_task_num = 0;
const TEMPLATE_DIV = document.querySelector('#tasks-div > .container.task:first-child');

function move_task(task_div, up) {
    let parent_div = task_div.parentNode;
    let sibling_div
    if (up) {
        sibling_div = task_div.previousSibling;
        parent_div.insertBefore(task_div, sibling_div);
    } else {
        sibling_div = task_div.nextSibling;
        parent_div.insertBefore(sibling_div, task_div);
    };
    process_button_activation();
}

function process_button_activation() {
    const task_divs = document.getElementsByClassName("task");
    for (let index = 0; index < task_divs.length; index++) {
        div = task_divs[index]
        let up_button = div.getElementsByClassName("up-button")[0];
        let down_button = div.getElementsByClassName("down-button")[0];
        up_button.disabled = false;
        down_button.disabled = false;
        if (index === 0) {
            up_button.disabled = true;
        };
        if (index === task_divs.length - 1) {
            down_button.disabled = true;
        };
    };
};

function add_task() {
    const add_task_input = document.getElementById("add-task-input");
    if (!add_task_input.value) {
        window.alert("No task title added");
        return false;
    }
    // Clone the first div
    let task_div = TEMPLATE_DIV.cloneNode(true);
    // Insert the cloned div after the first div
    TEMPLATE_DIV.parentNode.insertAdjacentElement('afterend', task_div);
    latest_task_num++;
    task_div.id = `task-idem-div-${latest_task_num}`;
    const task_checkbox = task_div.querySelector("input");
    const task_label = task_div.querySelector("label");
    const remove_button = task_div.getElementsByClassName("remove-button")[0];
    const up_button = task_div.getElementsByClassName("up-button")[0];
    const down_button = task_div.getElementsByClassName("down-button")[0];
    task_checkbox.id = `task-checkbox${latest_task_num}`;
    task_label.setAttribute('for', task_checkbox.id);
    task_label.classList.remove('strikethrough');
    remove_button.addEventListener("click", () => {task_div.remove()});
    task_checkbox.addEventListener('change', function() {
        if (this.checked) {
          task_label.classList.add('strikethrough');
        } else {
          task_label.classList.remove('strikethrough');
        }
      });
    up_button.addEventListener("click", () => {
        move_task(task_div, true)
    });
    down_button.addEventListener("click", () => {
        move_task(task_div, false)
    });
    task_div.style.display = 'block'; // Make the container visible
    task_label.textContent = add_task_input.value;
    add_task_input.value = null;
    task_checkbox.checked = false;
    process_button_activation();
    return true;
}

function set_events() {
    let add_task_button = document.getElementById("add-task-button");
    add_task_button.addEventListener("click", add_task);
    document.getElementById("add-task-input").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            add_task_button.click();
        };
    });
};

set_events()

