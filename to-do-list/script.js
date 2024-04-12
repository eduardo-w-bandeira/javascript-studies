var latest_task_num = 0;

function move_task(button) {
    return
}

function process_button_activation() {
    const task_divs = document.getElementsByClassName("task");
    for (let index=0; index < task_divs.length; index++) {
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
    const new_task_input = document.getElementById("new-task-input");
    if (!new_task_input.value) {
        window.alert("No task title added");
        return false;
    }
    let task_div;
    const original_div = document.getElementsByClassName("task")[0];
    if (latest_task_num == 0) {
        task_div = original_div;
    } else {
        // Clone the original div
        task_div = original_div.cloneNode(true);
        // Insert the cloned div after the original div
        original_div.parentNode.insertBefore(task_div, original_div.nextSibling);
    }
    latest_task_num++;
    // Assign ids
    task_div.id = `task-idem-div-${latest_task_num}`;
    task_div.getElementsByClassName("up-button")[0].id = `up-button-${latest_task_num}`;
    task_div.getElementsByClassName("down-button")[0].id = `down-button-${latest_task_num}`;
    //
    task_div.style.display = 'block'; // Make the container visible
    const task_p = document.getElementsByClassName("task-p")[0];
    task_p.innerText = new_task_input.value;
    new_task_input.value = null;
    process_button_activation();
    return true;
}



document.getElementById("add-new-task-button").addEventListener("click", add_task);

