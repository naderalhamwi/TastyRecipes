
var logInForm; 
var createAcc; 
let searchForm;
let searchWord;
var action = 1; 
let likeCont;

async function init(){
    localStorage.setItem('editRecipeStatus', 0);
    document.getElementById("accountForms").style.display = "none";
    logInForm = document.getElementById("logIn");  
    logInForm.addEventListener("submit", logIn);  

    createAcc = document.getElementById("createAcc");  
   createAcc.addEventListener("submit", createAccount);
   
   if(localStorage.getItem('recept') != null){
       likeCont = JSON.parse(localStorage.getItem('recept')).likes;
   }

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
        document.getElementById("profileLink").style.display  = "none";
        document.getElementById("logoutbutton").style.display  = "none";
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

    if(window.location.href.match("/HTML_Files/searchedRecipes.html")){
        document.getElementById("searchButton").addEventListener("click", searchRecept);
        document.getElementById("header").style.gridTemplateColumns = "10% 80% 5% 5%";
        document.getElementById("header").style.gridTemplateRows = "auto auto";
    }


    if(window.location.href.match("http://127.0.0.1:5500/HTML_Files/ViewedRecipes.html")){
            showSelectedRecipe();
    }
    if(window.location.href.match("http://127.0.0.1:5500/HTML_Files/Home.html")){
        localStorage.removeItem("recept");
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
                    div.setAttribute("id", data[i].reciptId);
                    div.addEventListener("click", showRecipe);

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
                div.setAttribute("id", data[i].reciptId);
                div.addEventListener("click", showRecipe);
                
                main.appendChild(div);
            }
        }
    })
    .catch((e) => {
        console.log(e);
    });
}
function showRecipe(){

    fetch('http://localhost:8080/Backend/resources/recipe/show', {
        method: "GET",
        mode: 'cors',
        headers: {  
            'receptId': this.id
        }
    })
    .then((response) => {
        return response.json(); // or .text() or .blob() ...
    })
    .then((text) => {
        localStorage.setItem("recept", JSON.stringify(text));
        window.location.href = "http://127.0.0.1:5500/HTML_Files/ViewedRecipes.html";
    })
    .catch((e) => {
    // error in e.message
    });
}

function showSelectedRecipe(){
    let main = document.getElementById("showSelectedRecipe"); 
    let recipe = JSON.parse(localStorage.getItem('recept'));

    let section = document.createElement("section");
    section.className = "showSelectedRecipe";
    
    let h1 = document.createElement("h1");
    let p = document.createElement("p");
    let img = document.createElement("img");
    let div = document.createElement("div");
    
    let form = document.createElement("form");
    
    let editRecipeButton = document.createElement("button");
    let commentOnrecipeButton = document.createElement("button");
    let likeRecipeButton = document.createElement("button");
    
    h1.innerText += recipe.title;
    img.src = "\\" + recipe.imgPath ;
    
    commentOnrecipeButton.innerText = "commeentera på recipe";
    commentOnrecipeButton.addEventListener("click", () =>{

    });

    likeRecipeButton.innerText = likeCont + " like";
    likeRecipeButton.addEventListener("click", () =>{
        likeRecipeButton.innerText =  sessionStorage.getItem("likeCont") + " like";
        likeRecept();
    });

    if(sessionStorage.getItem("userName") != null){
        if(sessionStorage.getItem("adminSatus") == 1 || sessionStorage.getItem("userName") == JSON.parse(localStorage.getItem('recept')).userName ){
            editRecipeButton.innerText = "Ändra";
            editRecipeButton.addEventListener("click", () =>{
                localStorage.setItem('editRecipeStatus', 1);
                window.location.href = "/HTML_Files/profile.html";
            });
            
            section.appendChild(img);
            section.appendChild(h1);
            section.appendChild(form);
            section.appendChild(div);
            section.appendChild(p);
            section.appendChild(editRecipeButton);
            section.appendChild(commentOnrecipeButton);
            section.appendChild(likeRecipeButton);
        }else{
            section.appendChild(img);
            section.appendChild(h1);
            section.appendChild(form);
            section.appendChild(div);
            section.appendChild(p);
            section.appendChild(commentOnrecipeButton);
            section.appendChild(likeRecipeButton);
        } 
    }else{
        section.appendChild(img);
        section.appendChild(h1);
        section.appendChild(form);
        section.appendChild(div);
        section.appendChild(p);
        section.appendChild(likeRecipeButton);
    }
    
    p.innerText += "skapades av: " + recipe.userName;

    for (var key in recipe) {
        if (recipe.hasOwnProperty(key)) {
            if(key == "time"){
                let p = document.createElement("p");
                p.setAttribute("id",key);
                p.innerText += key + ": " + recipe[key];
                form.appendChild(p);
            }
            if(key == "category"){
                let p = document.createElement("p");
                p.setAttribute("id",key);
                p.innerText += key + ": " + recipe[key];
                form.appendChild(p);
            }
            if(key == "description"){
                let p = document.createElement("p");
                p.setAttribute("id",key);
                p.innerText += key + ": " + recipe[key];
                form.appendChild(p);
            }
            if(key == "nutritionalValue"){
                let p = document.createElement("p");
                p.setAttribute("id",key);
                p.innerText += key + ": " + recipe[key];
                form.appendChild(p);
            }
            if(key == "ingredientInfoList"){
                let ol = document.createElement("ol");
                for (let i = 0; i < recipe[key].length; i++) {
                    let li = document.createElement("li");
                    li.setAttribute("id",key+i);
                    li.innerText += "ingred: " + recipe[key][i];
                    ol.appendChild(li);
                    form.appendChild(ol);
                }
            }
            if(key == "stegList"){
                let ol = document.createElement("ol");
                for (let i = 0; i < recipe[key].length; i++) {
                    let li = document.createElement("li");
                    li.setAttribute("id",key+i);
                    li.innerText += "steg: " + recipe[key][i];
                    ol.appendChild(li);
                    form.appendChild(ol);
                }
            }
            if(key == "comments"){
                for (let i = 0; i < recipe[key].length; i++) {
                    let p = document.createElement("p");
                    let button = document.createElement("button");
                    p.setAttribute("id",key+i);
                    p.innerText += "comment: " + recipe[key][i].userName + " ";
                    p.innerText += recipe[key][i].content+ " ";
                    p.innerText += recipe[key][i].date;
                    if(sessionStorage.getItem("userName") != null){
                        button.innerText += "comment to " + recipe[key][i].userName;
                        div.appendChild(button);
                    }
                    div.appendChild(p);
                }
            }
            if(key == "replayComments"){
                for (let i = 0; i < recipe[key].length; i++) {
                    let p = document.createElement("p");
                    let button = document.createElement("button");
                    p.setAttribute("id",key+i); 
                    p.innerText += "replayComment: " + recipe[key][i].userName + " ";
                    p.innerText += recipe[key][i].content+ " ";
                    p.innerText += recipe[key][i].date+" ";
                    p.innerText += "To: "+recipe[key][i].relatedUserName + " ";
                    if(sessionStorage.getItem("userName") != null){
                        button.innerText += "comment to " + recipe[key][i].userName;
                        div.appendChild(button);
                    }
                    div.appendChild(p);
                }
            }
        }
     }

    main.appendChild(section);
}

function likeRecept(){
    fetch('http://localhost:8080/Backend/resources/recipe/like', {
        method: "post",
        mode: 'cors',
        headers: {  
            'like': likeCont
        }
    })
    .then((response) => {
        return response.json(); // or .text() or .blob() ...
    })
    .then((text) => {
        localStorage.setItem("recept", JSON.stringify(text));
        window.location.href = "http://127.0.0.1:5500/HTML_Files/ViewedRecipes.html";
    })
    .catch((e) => {
    // error in e.message
    });
}