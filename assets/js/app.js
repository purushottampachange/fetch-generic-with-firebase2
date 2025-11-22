
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
                            <button class="btn btn-sm btn-success">Edit</button>
                            <button class="btn btn-sm btn-danger">Remove</button>
                        </div>
                    </div>

        `;
    })

    blogContainer.innerHTML = res;

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
    finally{

    spinner.classList.add("d-none");

    }
}

const FetchBlogs = async () => {

    let res = await MakeAPICall(blogsURL, "GET", null);

    let data = ConvertArray(res);
   
    Templating(data);

}

FetchBlogs();