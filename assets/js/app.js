
const cl = console.log;

const blogForm = document.getElementById("blogForm");
const title = document.getElementById("title");
const content = document.getElementById("content");
const userId = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const blogContainer = document.getElementById("blogContainer");
const spinner = document.getElementById("spinner");

const BaseURL = "https://post-task-xhr-default-rtdb.firebaseio.com/";

const blogsURL = `${BaseURL}/blogs.json`;

const SnackBar = (icon, msg) => {

    Swal.fire({
        title: msg,
        icon: icon,
        timer: 1500
    })
}

const ConvertArray = (obj) => {

    let res = [];

    for (const key in obj) {

        let data = { ...obj[key], id: key }

        res.push(data);
    }

    return res;
}

const Templating = (arr) => {

    let res = "";

    arr.forEach(b => {

        res += `
           
                    <div class="card mb-4" id="${b.id}">
                        <div class="card-header">
                            <h5>${b.title}</h5>
                        </div>
                        <div class="card-body">
                            <p>${b.content}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-success" onclick = "onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick = "onRemove(this)">Remove</button>
                        </div>
                    </div>

        `;
    })

    blogContainer.innerHTML = res;

}

const CreateCard = (obj, id) => {

    let card = document.createElement("div");

    card.id = id;

    card.className = "card mb-4";

    card.innerHTML = `
       
                        <div class="card-header">
                            <h5>${obj.title}</h5>
                        </div>
                        <div class="card-body">
                            <p>${obj.content}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-success" onclick = "onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick = "onRemove(this)">Remove</button>
                        </div>
    
    `;

    blogContainer.append(card);
    blogForm.reset();

}

const MakeAPICall = async (apiURL, method, msgBody) => {

    spinner.classList.remove("d-none");

    msgBody = msgBody ? JSON.stringify(msgBody) : null;

    let configObj = {

        method: method,
        body: msgBody,
        headers: {

            "content-type": "aplication/json",
            "auth": "token from local storage"
        }
    }

    try {

        let res = await fetch(apiURL, configObj);

        return res.json();

    }
    catch (err) {

        SnackBar("error", err);
    }
    finally {

        spinner.classList.add("d-none");

    }
}

const PatchData = (obj) => {

    title.value = obj.title;
    content.value = obj.content;
    userId.value = obj.userId;

    submitBtn.classList.add("d-none");

    updateBtn.classList.remove("d-none");
}

const UIupdate = (obj, id) => {

    let card = document.getElementById(obj.id);

    card.querySelector(".card-header h5").innerText = obj.title;

    card.querySelector(".card-body p").innerText = obj.content;

    submitBtn.classList.remove("d-none");

    updateBtn.classList.add("d-none");

    blogForm.reset();

}

const FetchBlogs = async () => {

    let res = await MakeAPICall(blogsURL, "GET", null);

    let data = ConvertArray(res);

    Templating(data);

}

FetchBlogs();

const onEdit = async (ele) => {

    let EDIT_ID = ele.closest(".card").id;

    let EDIT_URL = `${BaseURL}/blogs/${EDIT_ID}.json`;

    localStorage.setItem("EDIT_ID", EDIT_ID);

    let res = await MakeAPICall(EDIT_URL, "GET", null);

    PatchData(res);
}

const onUpdate = async () => {

    let UPDATE_ID = localStorage.getItem("EDIT_ID");

    let UPDATE_URL = ` ${BaseURL}/blogs/${UPDATE_ID}.json`;

    let UPDATE_OBJ = {

        title: title.value,
        content: content.value,
        userId: userId.value,
        id: UPDATE_ID
    }

    let res = await MakeAPICall(UPDATE_URL, "PATCH", UPDATE_OBJ);

    cl(res);

    UIupdate(UPDATE_OBJ, UPDATE_ID);

    SnackBar("success","card Updated successfully");
}

const onRemove = async (ele) => {

    let result = await Swal.fire({
        title: "Do you want to Remove ?",
        showCancelButton: true,
        confirmButtonText: "Remove",
    })

    if (result.isConfirmed) {

        let REMOVE_ID = ele.closest(".card").id;

        let REMOVE_URL = `${BaseURL}/blogs/${REMOVE_ID}.json`;

        let res = await MakeAPICall(REMOVE_URL, "DELETE", null);

        ele.closest(".card").remove();

        SnackBar("success","card Removed successfully");
    }
}

const onSubmit = async (eve) => {

    eve.preventDefault();

    let blogObj = {

        title: title.value,
        content: content.value,
        userId: userId.value
    }

    let res = await MakeAPICall(blogsURL, "POST", blogObj);

    CreateCard(blogObj, res.name);

    SnackBar("success","card Created successfully");
}

blogForm.addEventListener("submit", onSubmit);

updateBtn.addEventListener("click", onUpdate);