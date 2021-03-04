
var logInForm; 
var createAcc; 
var action = 1; 
let searchForm;

async function init(){
    logInForm = document.getElementById("logIn");  
    logInForm.addEventListener("submit", logIn);  

    createAcc = document.getElementById("createAcc");  
   createAcc.addEventListener("submit", createAccount);
   

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
        logInForm.elements[0].disabled  = true;
        createAcc.elements[0].disabled  = true;
        document.getElementById("loginRegister").style.display = "none";
        document.getElementById("profileLink").setAttribute('href', 'profile.html');
    }
}window.onload = init;

function logIn(){
    let name = logInForm.userName.value;
    let pass = logInForm.password.value;

    let encrypted = window.btoa(name + ":" + pass);

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
                sessionStorage.setItem("userName", name);
                document.getElementById("userName").innerText = sessionStorage.getItem("userName");
                document.getElementById("loginRegister").style.display = "none";
                location.reload();
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
                alert("Konton Skapades");
                location.reload();
            }else{
                alert("Det gick inte att skapa kontot")
            }
            return response;
        }).catch(err => {
            console.log(err);
    });
}
