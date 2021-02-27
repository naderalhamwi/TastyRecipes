window.onload= init;

async function init(){
    
    document.getElementById("userName").innerText = sessionStorage.getItem("userName");
    document.getElementById("adminEditAccount").style.display = "none";
    if(sessionStorage.getItem("userName") == null){
        
    }else{
        
        document.getElementById("profileLink").setAttribute('href', 'profile.html');
    }
}