let editAccount;
let action = 1;
window.onload= init;

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});


async function init(){
    editAccount = document.getElementById("editAccount");
    
    if(sessionStorage.getItem("userName").length >= 10){
        document.getElementById("userName").innerText = sessionStorage.getItem("userName").substring(0, 10) + "...";
    }else{
        document.getElementById("userName").innerText = sessionStorage.getItem("userName");
    }
    
    document.getElementById("logoutbutton").addEventListener("click", logOut);
    document.getElementById("editUserDataButton").addEventListener("click", adminChangeUserData);
    document.getElementById("createReciptButton").addEventListener("click", createRecipe);
    document.getElementById("searchButton").addEventListener("click", searchRecept);
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
        let br = document.createElement("br");
        let inputItem = document.createElement("input"); 
        let ButtonItem = document.createElement("button");
        
        inputItem.setAttribute("type", "text");
        inputItem.setAttribute("name", "ingrediens");

        ButtonItem.appendChild(document.createTextNode("- tar bort ingrediens"));
        ButtonItem.setAttribute("id","deleteIngredens");


        liItem.appendChild(inputItem);
        liItem.appendChild(br);
        liItem.appendChild(ButtonItem);
        let currentOl = document.getElementById("ingrediensList");
        document.getElementById("ingrediensList").appendChild(liItem, currentOl);

        
        document.getElementById("ingrediensList").addEventListener('click',function(e){
            if(e.target.nodeName == "BUTTON"){
                let length = document.querySelectorAll('li').length;
                if(length > 1){
                    let remove = e.target.parentNode;
                    remove.parentNode.removeChild(remove);
                }
            }
        });
    });

    document.getElementById("addNewSteg").addEventListener("click", () =>{
        let liSteg = document.createElement("li");
        let br = document.createElement("br");
        let ButtonItem = document.createElement("button");
        let inputItem = document.createElement("input");
        
        inputItem.setAttribute("type", "text");
        inputItem.setAttribute("name", "steg");

        ButtonItem.appendChild(document.createTextNode("- tar bort steg"));
        ButtonItem.setAttribute("id","deleteSteg");


        liSteg.appendChild(inputItem);
        liSteg.appendChild(br);
        liSteg.appendChild(ButtonItem);
        let currentOl = document.getElementById("stegList");
        document.getElementById("stegList").appendChild(liSteg, currentOl);
        

        document.getElementById("stegList").addEventListener('click',function(e){
            if(e.target.nodeName == "BUTTON"){
                let length = document.querySelectorAll('li').length;
                if(length > 1){
                    let remove = e.target.parentNode;
                    remove.parentNode.removeChild(remove);
                }
            }
        });
    });

    
}
function openNav() {
    if ( action == 1 ) {
        document.getElementById("mySidenav").style.width = "150px";
        action = 2;
    } else {
        document.getElementById("mySidenav").style.width = "0px";
        action = 1;
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

 async function createRecipe(){
    let createReciptForm = document.getElementById("createRecipt");
    let x = document.getElementById("KategoriItems");
    let i = x.selectedIndex;
    let ingrediensString;
    let stegString;

    var file = createReciptForm.img.files[0];
    console.log(toBase64(file));
    let g = await toBase64(file);

    try {
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
            "imgPath": g,
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
                alert("Receptet har skapat")
                location.reload();
                return response.json(); // or .text() or .blob() ...
            })
            .then((text) => {
                // text is the response body
            })
            .catch((e) => {
                // error in e.message
            });
    } catch (error) {
        if(!createReciptForm.title.value.trim().length){
            console.log("title");
        }
        else if(!createReciptForm.tid.value.trim().length){
            console.log("tid");
        }
        else if(!createReciptForm.img.value.trim().length){
            console.log("img");
        }
        else if(!createReciptForm.näringsvärde.value.trim().length){
            console.log("näringsvärde");
        }
        else if(!createReciptForm.Beskrivning.value.trim().length){
            console.log("Beskrivning");
        }
    }
}

function searchRecept(){
    let searchform = document.getElementById("searchForm");
    let searchWord = searchform.searchBar.value.trim();

    let main = document.getElementById("main");

    if(!searchform.searchBar.value.trim()){
        alert("Du söker med tom fält !")
    }else{
        fetch('http://localhost:8080/Backend/resources/recipe/search', {
            method: "GET",
            mode: 'cors',
            headers: {  
                'title': searchWord
            }
        })
        .then((response) => {
            document.getElementById("searchWord").innerText = "Din sökning på : " + searchWord;
            return response.json();
        })
        .then((data) => {
            if(!data.length){
                document.getElementById("searchWord").innerText = "Din sökning på : " + searchWord + " gav inga resultat";
            }else{
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    let div = document.createElement("div");
                    let descriptionText = document.createElement("p");
                    let userNameText = document.createElement("p");
                    let titleText = document.createElement("h1");
                    let img = document.createElement("img");
                    
                    img.src = "\\" + data[i].imgPath;
                    titleText.innerText += data[i].title;
                    userNameText.innerText += " skapades av: " + data[i].userName;
                    descriptionText.innerText += data[i].description;
        
                    div.appendChild(titleText);
                    div.appendChild(img);
                    div.appendChild(descriptionText);
                    div.appendChild(userNameText);
        
                    main.appendChild(div);
    
                }
            }
        })
        .catch((e) => {
            console.log(e);
        });
    }
}

/*

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readasdataurl(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

async function main (){
    const file = document.querySelector().files[0];
    imgData = await toBase64(file);
    imgData = json.stringify(imgData)
    i = imgData.indexOf(",")

    console.log(imgData.substring(i).charAt(303952))
    const response = await fetch (url, {
        method:"",
        mode:"",
        headers:{

        }, 
        body: JSON.stringify(imgData)
    }).then(data => {
        console.log(data)
    }).catch(error => console.log(""));
    return response;
}*/

