let editAccount;
window.onload= init;

async function init(){
    editAccount = document.getElementById("editAccount");
    
    document.getElementById("userName").innerText = sessionStorage.getItem("userName");
    document.getElementById("logoutbutton").addEventListener("click", logOut);
    document.getElementById("editUserDataButton").addEventListener("click", adminChangeUserData);
    document.getElementById("deleteUserButton").addEventListener("click", adminDeleteUser);
    document.getElementById("changeUserDataButton").addEventListener("click", changeUserData);

    document.getElementById("searchUserButton").addEventListener("keypress", function (e) {
        if (e.key === 'Enter') {
            searchUser();
        }
    })

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

    if(sessionStorage.getItem("userName") == null){
        location.replace("Home.html");
        alert("du måste vara inloggad för att gå vidare till din profil");
    }
}

function logOut(){
    sessionStorage.removeItem("userName");  //Removes the logged in user
    sessionStorage.removeItem("adminSatus");  
    location.reload();  //reloads the page
    location = "Home.html"
}

function changeUserData(){
    editAccount = document.getElementById("editAccount");

    let userData = {
    "email":editAccount.email.value,
    "password":editAccount.password.value,
    "userName":editAccount.userName.value};

    if(editAccount.email.value == "" || editAccount.password.value == ""){
        alert("inga toma fält tack");
        location.reload(); 
    }else{
        fetch('http://localhost:8080/Backend/resources/user/change', {
            method: 'PUT',
            mode: 'cors',
          headers: {  
              'Content-Type': 'text/plain'
          },
          body: JSON.stringify(userData)
          }).then((response) => {
            alert("Användaren har uppdaterat");
            location.reload(); 
          return response.json(); 
        }).catch(err => {
            console.log(err);
        });
    }
}

function searchUser(){
    let adminEditAccount = document.getElementById("adminEditAccount");
    if(adminEditAccount.searchUserinput.value == ""){
        
    }else{
        fetch('http://localhost:8080/Backend/resources/user/search', {
            method: 'GET',
            mode: 'cors',
          headers: {  
              'userName':  adminEditAccount.searchUserinput.value
          },
          })
          .then(response => response.json())
          .then((data) => {
            adminEditAccount.userName.value = data.userName,
            adminEditAccount.email.value = data.email
          }).catch(err => {
            alert("användaren fins inte");
        });
    }
        
}

function adminChangeUserData(){
    let adminEditAccount = document.getElementById("adminEditAccount");


    if(adminEditAccount.userName.value == ""){
        alert("inga tomma fält");
    }else{
        let userData = {
            "email":adminEditAccount.email.value,
            "password":adminEditAccount.password.value,
            "userName":adminEditAccount.userName.value};
                fetch('http://localhost:8080/Backend/resources/user/change', {
                    method: 'PUT',
                    mode: 'cors',
                  headers: {  
                      'Content-Type': 'text/plain'
                  },
                  body: JSON.stringify(userData)
                  }).then((response) => {
                    alert("Användaren har uppdaterat");
                    location.reload(); 
                  return response.json(); 
                }).catch(err => {
                    console.log(err);
                });
    }
}

function adminDeleteUser(){
    let adminEditAccount = document.getElementById("adminEditAccount");
    if(adminEditAccount.userName.value == ""){
        alert("inga tomma fält");
    }else{
        fetch('http://localhost:8080/Backend/resources/user/delete', {
            method: 'DELETE',
            mode: 'cors',
        headers: {  
            'userName':  adminEditAccount.userName.value
        },
        }).then((response) => {
            alert("Användaren togs bort");
            location.reload(); 
        return response.json(); 
        }).catch(err => {
            console.log(err);
        });
    }
}