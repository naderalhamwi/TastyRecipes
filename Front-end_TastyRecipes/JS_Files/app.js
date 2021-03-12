
var logInForm; 
var createAcc; 
let searchForm;
let searchWord;
var action = 1; 

async function init(){
    document.getElementById("accountForms").style.display = "none";
    logInForm = document.getElementById("logIn");  
    logInForm.addEventListener("submit", logIn);  

    createAcc = document.getElementById("createAcc");  
   createAcc.addEventListener("submit", createAccount);
   
   document.getElementById("searchButton").addEventListener("click", searchRecept);
   document.getElementById("userName").innerText = sessionStorage.getItem("userName");
    document.getElementById("logoutbutton").addEventListener("click", logOut);
    document.getElementById("loginRegister").addEventListener("click", ()=>{
        if ( action == 1 ) {
            document.getElementById("accountForms").style.display = "block";
            action = 2;
        } else {
            document.getElementById("accountForms").style.display = "none";
            action = 1;
        }
    });

  

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


    if(window.location.href.match("/HTML_Files/searchedRecipes.html")){
        let categoryOptions = document.getElementById("categoryOptions");
    
        for (let b = 0; b < categoryOptions.childNodes.length; b++) {
            if(categoryOptions.childNodes[b].nodeName == "LI"){
                categoryOptions.childNodes[b].addEventListener("click", () =>{
                    let category = categoryOptions.childNodes[b].innerText;
                    searchReceptCategory(category);
                });
            }
        }
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

function openNav() {
    if ( action == 1 ) {
        document.getElementById("mySidenav").style.width = "150px";
        action = 2;
    } else {
        document.getElementById("mySidenav").style.width = "0px";
        action = 1;
    }
}

async function searchRecept(){
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
            main.innerHTML= "";
            let p = document.createElement("p");
            p.innerHTML = "Din sökning på : " + searchWord;
            main.appendChild(p);
            return response.json();
        })
        .then((data) => {
            if(!data.length){
                main.innerHTML= "";
                let p = document.createElement("p");
                p.innerHTML = "Din sökning på : " + searchWord + " gav inga resultat";
                main.appendChild(p);
            }else{
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

function searchReceptCategory(categoryValue){
    let main = document.getElementById("main");
    fetch('http://localhost:8080/Backend/resources/recipe/search/category', {
        method: "GET",
        mode: 'cors',
        headers: {  
            'title': categoryValue
        }
    })
    .then((response) => {
        main.innerHTML= "";
            let p = document.createElement("p");
            p.innerHTML = "Din sökning på : " + categoryValue;
            main.appendChild(p);
        return response.json();
    })
    .then((data) => {
        if(!data.length){
            main.innerHTML= "";
            let p = document.createElement("p");
            p.innerHTML = "Din sökning på : " + categoryValue + " gav inga resultat";
            main.appendChild(p);
        }else{
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
        
    


  /**async function searchRecept(){
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
            window.location.href = "/HTML_Files/searchedRecipes.html";
            document.getElementById("searchWord").innerText = "Din sökning på : " + searchWord;
            return response.json();
        })
        .then((data) => {
            if(!data.length){
                document.getElementById("searchWord").innerText = "Din sökning på : " + searchWord + " gav inga resultat";
            }else{
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
} */