let editAccount;
window.onload= init;

async function init(){
    editAccount = document.getElementById("editAccount");
    
    document.getElementById("userName").innerText = sessionStorage.getItem("userName");
    document.getElementById("logoutbutton").addEventListener("click", logOut);

    if(sessionStorage.getItem("userName") == null){

    }else{
        editAccount.userName.value = sessionStorage.getItem("userName");
        document.getElementById("profileLink").setAttribute('href', 'profile.html');
        if(sessionStorage.getItem("adminSatus") == true){
            document.getElementById("adminEditAccount").style.display = "block";
        } else{
            document.getElementById("adminEditAccount").style.display = "none";
        }
    }
}


function logOut(){
    sessionStorage.removeItem("userName");  //Removes the logged in user
    location.reload();  //reloads the page
    location = "Home.html"
}