var idErr = ""
var titleErr = ""
// Get form
function taskform() {
    var taskaddform = `
                <h3>Add To Do Task</h3>
                <form name="myForm" id="form1 reg-form">
                    <div class="col field-row">
                        <label class="form-label" for="id">Task id:</label>
                        <input type="text" id="id" name="id" class="text-field" placeholder="Enter task ID" onchange="handleInputChange(this.name)" >
                        <p id="errorid" class="error"></p>
                    </div>
                    <div class="col field-row">
                        <label class="form-label" for="date">Date:</label>
                        <input type="date" id="date" name="date" class="text-field">
                    </div>
                    <div class="col field-row">
                        <label class="form-label" for="title">Task Title:</label>
                        <input type="text" id="title" name="title" class="text-field" placeholder="Enter Task Title." onchange="handleInputChange(this.name)">
                        <p id="errortitle" class="error"></p>
                    </div>
                    <div class="col field-row">
                        <label class="form-label" for="description">Task description :</label>
                        <textarea rows="6" cols="30" id="description" name="description" class="text-field" placeholder="Write Task description"></textarea>
                    </div>
                    <div class="field-btn" >
                        <input type="button" class="btn btn-success" id="btn-add" value="Add task">&nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="reset" class="btn btn-secondary" value="reset">
                    </div>
                </form>
                `
    document.getElementById("dom1").innerHTML = taskaddform
    //call addtask function
    document.getElementById('btn-add').addEventListener('click', addtask);
}

const handleInputChange = async name => {
    console.log(name)
    const nameForm = name
    formValidation(nameForm);
};

const formValidation = (nameForm) => {
    // debugger
    console.log(nameForm)
    switch (nameForm) {
        // // id validation
        case 'id':
            const idValue = document.forms["myForm"]["id"].value;
            if (idValue === "" || null) {
                idErr = "ID must not be empty"
            }
            else if (idValue.trim().length < 3) {
                idErr = 'Id must be at least 3 characters!'
            }
            else {
                idErr = ""
            }
            break;

        // // title validation
        case 'title':
            const regExp = /^[0-9a-zA-Z ]+$/
            const titleValue = document.forms["myForm"]["title"].value;
            if (titleValue.trim().length == "") {
                titleErr = "Title must not be empty"
            }
            else {
                if (titleValue.match(regExp)) {
                    if (titleValue.trim().length < 5) {
                        titleErr = "Title must contain at least 5 characters"
                    }
                    else if (titleValue.trim().length > 15) {
                        titleErr = "Title must not exceed 15 characters"
                    }
                    else {
                        titleErr = ""
                    }
                }
                else {
                    titleErr = 'Title must not contain any symbols'
                }
            }
            break;

        default:
            break;
    }

    document.getElementById("errorid").innerHTML = idErr
    document.getElementById("errortitle").innerHTML = titleErr
}

// add task
function addtask(event) {
    // event.preventDefault();                                //to stop the form submitting ==> validation works

    const nameFormList = ["id", "title"]
    nameFormList.forEach((nameForm) => {
        formValidation(nameForm)
    })

    let task = {
        id: document.getElementById('id').value,
        date: document.getElementById('date').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
    }

    if (task.id && task.title && !idErr && !titleErr) {
        var jsondata = JSON.stringify(task)
        // post request
        var url = "http://localhost:3005/todo";
        var xhr = new XMLHttpRequest();                       // Create  XMLHttpRequest object
        xhr.open("POST", url, true);                          // initializes  newly created or reinitializes existing request
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function () {                            // readystate 4 ==> request finished and response is ready
            if (xhr.status === 200) {                         // succefull response from server
                alert("Task Saved successfully");
                clear_entered_data();
                // document.forms[0].reset();                 // to prevent page reloading & clear the form for the next entries
                console.log(task)
                gettask();
                return
            }
            console.log(xhr.error)
        }
        xhr.send(jsondata);                                   // send the request to server
    }
}

function clear_entered_data() {
    document.getElementById('id').value = '';
    document.getElementById('date').value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
}

// get task
function gettask() {
    var taskListHeader = `
                <div class="task retrive">
                    <div id="info1">
                        <h2 style="text-align: center;">Task List</h2>
                        <table id="">
                            <thead>
                                <tr style="border: black solid 1px;">
                                    <th>id</th>
                                    <th>Date</th>
                                    <th>Title</th>
                                    <th>description</th>
                                    <th>Update</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody id="display"></tbody>
                        </table>
                    </div>
                </div>`
    document.getElementById("dom1").innerHTML = taskListHeader

    url = 'http://localhost:3005/todo'
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true);
    xhr.onload = () => {
        if (xhr.status === 200) {
            let data = xhr.responseText;
            // console.log(JSON.parse(data))
            // console.log(JSON.parse(JSON.parse(data)))
            var obj = JSON.parse(JSON.parse(data))

            obj.forEach((z) => {
                debugger

                // // 1st method to pass object or variable for edit_data() & deletetask() function
                // var q = "{A:'ad', B:'bd'}"      //or//     // var q = "'ad'"
                str1 = "'"
                str2 = "'"
                // idx = str1.concat(z.id).concat(str2)
                idx = str1 + z.id + str2
                console.log(idx)


                var table = `
                  <td>${z.id}</td>
                  <td>${z.date}</td>
                  <td>${z.title}</td>
                  <td>${z.description}</td>
                  <td><button  id="Edit-btn-${z.id}" type='button' class='btn btn-success'>Edit</button></td>
                  <td><a href="#" class='btn btn-danger' id="dlt" onclick="deletetask('${z.id}')">Delete</a></td>
                `

                // // 2nd method to pass object or variable for edit_data() & deletetask() function
                let tr = document.createElement('tr');
                tr.innerHTML = table
                document.getElementById("display").appendChild(tr);

                document.getElementById(`Edit-btn-${z.id}`).addEventListener('click', function () {
                    edit_data(z)
                })
            })
        }
    }
    xhr.send();
}

// get update form
function edit_data(z) {
    var taskupdateform = `
                        <h3>Add To Do Task</h3>
                        <form name="myForm" id="form1">
                            <div class="col field-row">
                                <label class="form-label" for="id" aria-disabled="true">Task id:</label>
                                <input type="text" id="id" name="id" class="text-field" placeholder="Enter task ID" disabled>
                                <p id="errorid" class="error"></p>
                            </div>
                            <div class="col field-row">
                                <label class="form-label" for="date">Date:</label>
                                <input type="date" id="date" name="date" class="text-field">
                            </div>
                            <div class="col field-row">
                                <label class="form-label" for="title">Task Title:</label>
                                <input type="text" id="title" name="title" class="text-field" placeholder="Enter Task Title." onchange="handleInputChange(this.name)">
                                <p id="errortitle" class="error"></p>
                            </div>
                            <div class="col field-row">
                                <label class="form-label" for="description">Task description :</label>
                                <textarea rows="6" cols="25" id="description" name="description" class="text-field" placeholder="Write Task description"></textarea>
                            </div>
                            <div class="field-btn">
                                <input type="button" class="btn btn-success" id="btn-update" value="Update task">&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                        </form>
                        `
    document.getElementById("dom1").innerHTML = taskupdateform

    document.getElementById('id').value = z.id;
    document.getElementById('date').value = z.date;
    document.getElementById('title').value = z.title;
    document.getElementById('description').value = z.description;

    document.getElementById('btn-update').addEventListener('click', updatetask);
}

function updatetask() {
    debugger
    const nameFormList = ["id", "title"]
    nameFormList.forEach((nameForm) => {
        formValidation(nameForm)
    })

    let task = {
        id: document.getElementById('id').value,
        date: document.getElementById('date').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
    }

    if (task.id && task.title && !idErr && !titleErr) {
        var jsondata = JSON.stringify(task)
        // PUT request
        var url = "http://localhost:3005/todo";
        var xhr = new XMLHttpRequest();   // new HttpRequest object 
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function () {
            if (xhr.status === 200) {
                alert("Save edited Changes successfully");
                clear_entered_data();
                // document.forms[0].reset(); // to prevent page reloading & clear the form for the next entries
                console.log(task)
                gettask();
                return
            }
            console.log(xhr.error)
        }
        xhr.send(jsondata);
    }
}

// delete task
function deletetask(idx) {
    debugger
    console.log(idx)
    // Delete a user
    var url = "http://localhost:3005/todo/";
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url + idx, true);
    xhr.onload = function () {
        var data = JSON.parse(xhr.responseText);
        if (xhr.status == "200") {
            // console.table(data);
            alert("record deleted successfully");
            gettask();
        }
        else {
            console.error(data);
        }
    }
    xhr.send(null);
}

