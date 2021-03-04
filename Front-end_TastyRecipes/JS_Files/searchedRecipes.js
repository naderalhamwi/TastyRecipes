
var logInForm; 
var createAcc; 
var action = 1; 

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