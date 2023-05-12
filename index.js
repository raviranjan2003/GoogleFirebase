document.getElementById("login").addEventListener('submit',(e)=>{
    e.preventDefault();
})

/*
firebase.auth().onAuthStateChanged((user)=>{
    var userInfo = user;
    if(user){
        console.log(userInfo);
    }else{
        console.log("Sign Out");
    }
})
*/
const saveContent = document.getElementById("input-content");

async function login(e){
    // e.preventDefault();
    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    // console.log(name.value);
    // console.log(email.value);
   
    firebase.auth().onAuthStateChanged((user)=>{
        let userInfo = user;
        if(user){
            // console.log(userInfo.emailVerified);
            if(userInfo.emailVerified){
                firebase.auth().signInWithEmailAndPassword(email.value,password.value)
                .catch((error)=>{
                    document.getElementById("error").innerHTML=error.message;
                })
                document.getElementById("login-btn").style.display="none";
                document.getElementById("signup-btn").style.display="none";
                document.getElementById("logout-btn").style.display="block";
                
                let rem = document.getElementById("input-content");
            
                rem.remove();
            }else{
                alert("Email not verified:");
            }
        }else{

            console.log("Sign Out");
        }
    })

}

async function signup(e){
    // e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try{
        const result =await firebase.auth().createUserWithEmailAndPassword(email,password);
        console.log("SignUp done:");
        
        await result.user.sendEmailVerification()
        .then(()=>{
            console.log("Email verification link sent :");
            alert("Email verification link sent to your Email Id :");
        })
        // console.log(result);
    }catch(error){
        console.log(error);
    }


    const newClient = {
        ClientName : name,
        ClientEmail : email,
        ClientPassword : password
    }

    firebase.database().ref("ClientsInfo").push().set(newClient);
    
    // saveContent.parentNode.removeChild(remove);
    // we can also write the above line as 
    // saveContent.remove();
    
    // firebase.database().ref("ClientsInfo").push().set(newClient);
    // if(emailVerified){
    //     document.getElementById("login-btn").style.display="none";
    //     // document.getElementById("input-content").style.display="none";
    //     document.getElementById("signup-btn").style.display="none";
    //     document.getElementById("logout-btn").style.display="block";
    // }else{
    //     console.log("User Not Verified!");
    // }
}

async function logout(){
    firebase.auth().signOut();

    document.getElementById("parent-input-content").append(saveContent);

    document.getElementById("login-btn").style.display="block";
    document.getElementById("signup-btn").style.display="block";
    document.getElementById("logout-btn").style.display="none";
    // document.getElementById("input-content").style.display="block";
    document.getElementById("login").reset();
}

async function resetPassword(){
    const email = document.getElementById("email").value;
    firebase.auth().sendPasswordResetEmail(email);
    alert("Password reset link sent to your Email Id :");
}


function fetchData(){
    firebase.database().ref().on("value",(snapshot)=>{
        const object = snapshot.val().ClientsInfo;

        const arr = [];

        for(let key in object){
            arr.push(key,object[key]);
        }

        document.getElementById("heading").innerHTML="Here the available data in your database!"
        document.getElementById("check-btn").style.display="none";


        console.log(arr);
        for(let i=1;i<=arr.length;i=i+2){
            let UserName = document.createElement("p");
            UserName.innerHTML = `User Name : ${arr[i].ClientName}`;
            document.getElementById("database-content").appendChild(UserName);
            
            let UserEmail = document.createElement("p");
            UserEmail.innerHTML = `User Email : ${arr[i].ClientEmail}`;
            document.getElementById("database-content").appendChild(UserEmail);
            
            
            let UserPassword = document.createElement("p");
            UserPassword.innerHTML = `User Password : ${arr[i].ClientPassword}`;
            document.getElementById("database-content").appendChild(UserPassword);

            document.getElementById("database-content").appendChild(document.createElement("hr"));
        }
    })
}