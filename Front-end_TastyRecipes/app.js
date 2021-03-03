
var logInForm; //Reference to log in form
var createAcc; //Reference to log in form
var action = 1; //one button one function on first click another on second

window.onload = init;

async function init(){
    logInForm = document.getElementById("logIn");  //Saves reference to the log in form
    logInForm.addEventListener("submit", logIn);  //Eventlistener submit, runs logIn function

    createAcc = document.getElementById("createAcc");  //Saves reference to the log in form
   createAcc.addEventListener("submit", createAccount);  //Eventlistener submit, runs logIn function
    
    document.getElementById("logoutbutton").addEventListener("click", logOut);
    document.getElementById("accountForms").style.display = "none";
    document.getElementById("loginRegister").addEventListener("click", ()=>{
        if ( action == 1 ) {
            document.getElementById("accountForms").style.display = "block";
            action = 2;
        } else {
            document.getElementById("accountForms").style.display = "none";
            action = 1;
        }
    });
    document.getElementById("userName").innerText = sessionStorage.getItem("userName");

    if(sessionStorage.getItem("userName") == null){
        document.getElementById("loginRegister").style.display = "block";
        document.getElementById("profileLink").disabled  = true;
        document.getElementById("logoutbutton").disabled  = true;
    }else{
        //document.getElementById("adminEditAccount").style.display = "block";
        logInForm.elements[0].disabled  = true;
        createAcc.elements[0].disabled  = true;
        document.getElementById("loginRegister").style.display = "none";
        document.getElementById("profileLink").setAttribute('href', 'profile.html');
    }
}

/**
 * Checks with the database to see if the user with that passwords exists and returns true/false
 */
function logIn(){
    let name = logInForm.userName.value;  //username
    let pass = logInForm.password.value;  //password

    let encrypted = window.btoa(name + ":" + pass);  //Json to string as Base64

    fetch("http://localhost:8080/Backend/resources/user/confirm", {
        method: "GET",
        mode: 'cors',
        headers: {
            'Authorization': 'Basic ' + encrypted
        },
        }).then((response) => {
            console.log(response.status);

            response.text().then(function(text){
                sessionStorage.setItem("adminSatus", text);
            });
            if(response.ok){
                sessionStorage.setItem("userName", name);  //Saves username in sessionStorage
                document.getElementById("userName").innerText = sessionStorage.getItem("userName");
                document.getElementById("loginRegister").style.display = "none";
                location.reload();  //reloads the page
            }else{
                alert("Fel användarnamn/lösenord");
            }

            return response.json();
        }).catch(err => {
            console.log(err);
    });
}

function logOut(){
    sessionStorage.removeItem("userName"); 
    sessionStorage.removeItem("adminSatus");  
    location.reload();  
}

function createAccount(){
    /*           Form values           */
    let name = createAcc.userName.value;
    let pass = createAcc.password.value;
    let email = createAcc.email.value;

    let userData = { 
        "userName": name,
        "email": email,
        "password": pass
    };

    fetch("http://localhost:8080/Backend/resources/user/create", {
        method: "POST",
        mode: 'cors',
        headers: {  
            'Content-Type': 'text/plain'
        },
        body: JSON.stringify(userData)
        }).then((response) => {
            console.log(response);
            if(response.status == 201){
                sessionStorage.setItem("userName", name); 
                alert("created");
            }else{
                alert("Det gick inte att skapa kontot")
            }
            return response;
        }).catch(err => {
            console.log(err);
    });
}