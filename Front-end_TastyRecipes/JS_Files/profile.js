let editAccount;
window.onload= init;

async function init(){
    editAccount = document.getElementById("editAccount");
    
    document.getElementById("userName").innerText = sessionStorage.getItem("userName");
    document.getElementById("logoutbutton").addEventListener("click", logOut);
    document.getElementById("editUserDataButton").addEventListener("click", adminChangeUserData);
    document.getElementById("createReciptButton").addEventListener("click", createRecipe);
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

    document.getElementById("addNewIngredens").addEventListener("click", () =>{
        let liItem = document.createElement("li");
        
        let inputItem = document.createElement("input");
        inputItem.setAttribute("type", "text");
        inputItem.setAttribute("name", "ingrediens");

        let ButtonItem = document.createElement("button");
        ButtonItem.appendChild(document.createTextNode("- tar bort ingrediens"));
        ButtonItem.setAttribute("id","deleteIngredens");


        liItem.appendChild(inputItem);
        let currentOl = document.getElementById("ingrediensList");
        document.getElementById("ingrediensList").appendChild(liItem, currentOl);
        document.getElementById("ingrediensList").appendChild(ButtonItem, currentOl);

        document.getElementById("deleteIngredens").addEventListener("click", () =>{
            
        });
    });

    document.getElementById("addNewSteg").addEventListener("click", () =>{
        let liItem = document.createElement("li");
        
        let inputItem = document.createElement("input");
        inputItem.setAttribute("type", "text");
        inputItem.setAttribute("name", "steg");

        let ButtonItem = document.createElement("button");
        ButtonItem.appendChild(document.createTextNode("- tar bort steg"));
        ButtonItem.setAttribute("id","deleteSteg");


        liItem.appendChild(inputItem);
        let currentOl = document.getElementById("stegList");
        document.getElementById("stegList").appendChild(liItem, currentOl);
        document.getElementById("stegList").appendChild(ButtonItem, currentOl);
        

        document.getElementById("deleteSteg").addEventListener("click", () =>{
            
        });
    });

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


function createRecipe(){
    let createReciptForm = document.getElementById("createRecipt");
    let x = document.getElementById("KategoriItems");
    let i = x.selectedIndex;
    let ingrediensString;
    let stegString;

    for (var j = 0; j < createReciptForm.ingrediens.length; j++){
        if(j == 0){
            ingrediensString = createReciptForm.ingrediens[j].value;
            ingrediensString += ",";
        }else{
            ingrediensString += createReciptForm.ingrediens[j].value;
            ingrediensString += ",";
        }
    }

    for (var j = 0; j < createReciptForm.steg.length; j++){
        if(j == 0){
            stegString = createReciptForm.steg[j].value;
            stegString += ",";
        }else{
            stegString += createReciptForm.steg[j].value;
            stegString += ",";
        }
    }

    let recipeData = {
        "title": createReciptForm.title.value,
        "userName": sessionStorage.getItem("userName"),
        "category": x.options[i].text,
        "tid": createReciptForm.tid.value,
        "imgPath": createReciptForm.img.value,
        "nutritionalValue": createReciptForm.näringsvärde.value,
        "IngredientInfo": ingrediensString,
        "steg":stegString,
        "description": createReciptForm.Beskrivning.value
    };

    fetch('http://localhost:8080/Backend/resources/recipe/create', {
        method: "POST",
        mode: 'cors',
        headers: {  
            'Content-Type': 'text/plain'
        },
        body: JSON.stringify(recipeData)
        })
        .then((response) => {
            return response.json(); // or .text() or .blob() ...
        })
        .then((text) => {
            // text is the response body
        })
        .catch((e) => {
            // error in e.message
    });
}