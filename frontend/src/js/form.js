((Utils) => {
    const App = {
        htmlElements: {
            loginForm: document.querySelector("#login-form"),
            userInput: document.querySelector("#user-query"),
            passInput: document.querySelector("#pass-query"),
            nameInput: document.querySelector("#name-query"),
            emailInput: document.querySelector("#email-query"),
            scoreInput: document.querySelector("#score-query"),

            tokenInput: document.querySelector("#token-query"),

        },
        init: () => {
            App.htmlElements.loginForm.addEventListener(
                "click",
                App.handlers.loginFormOnSubmit
            );
        },
        handlers: {
            loginFormOnSubmit: async (e) => {
                if(e.target.id === "btnLogin"){
                    e.preventDefault();

                    const user = App.htmlElements.userInput.value;
                    const pass = App.htmlElements.passInput.value;

                    const data = {
                        id: user, 
                        pass: pass
                    }

                    try {
                        const response = await Utils.postService({
                            service: "login", 
                            data: data, 
                            method: "POST" 
                        });
                        if(response.succes){
                            //Inicio Envio Token
                            const response2 = await Utils.postServiceToken({
                                service: "generar", 
                                data: data, 
                                method: "POST" 
                            });
                            if(response.succes){
                                const user2 = document.getElementById('user-query');
                                const pass2 = document.getElementById('pass-query');
                                const token = document.getElementById('token-query');
                                const btnToken = document.getElementById('btnToken');
                                const btnLogin = document.getElementById('btnLogin');

                                user2.style.display = 'none'
                                pass2.style.display = 'none'
                                btnLogin.style.display = 'none'
                                token.style.display = 'block'
                                btnToken.style.display = 'block'

                                Utils.navigate({
                                //    route: "index"
                                    route: "Token"
                                    
                                });
                            }else{
                                alert(response2.error.cod + ": " + response2.error.message);
                            }
                            //Fin Envio Token
                        }else{
                            alert(response.error.cod + ": " + response.error.message);
                        }
                    } catch(error) {
                        console.error(error);
                    }
                }
                if(e.target.id === "btnSignUp"){
                    e.preventDefault();

                    const user = App.htmlElements.userInput.value;
                    const pass = App.htmlElements.passInput.value;
                    const name = App.htmlElements.nameInput.value;
                    const score = App.htmlElements.scoreInput.value;
                    const email = App.htmlElements.emailInput.value;
                    let scoreAux = 0;

                    if(score === "new"){
                        scoreAux = 800;
                    }
                    if(score === "beginner"){
                        scoreAux = 1200;
                    }
                    if(score === "intermediate"){
                        scoreAux = 1600;
                    }
                    if(score === "advanced"){
                        scoreAux = 2000;
                    }

                    const data = {
                        id: user, 
                        pass: pass,
                        name: name,
                        score: scoreAux,
                        email: email
                    }

                    try {
                        const response = await Utils.postService({
                            service: "register", 
                            data: data, 
                            method: "POST" 
                        });
                        if(response.succes){
                            Utils.navigate({
                                route: "index"
                            });
                        }else{
                            alert(response.error.cod + ": " + response.error.message);
                        }
                    } catch(error) {
                        console.error(error);
                    }
                }


                
                if(e.target.id === "btnToken"){
                    e.preventDefault();

                    const token = App.htmlElements.tokenInput.value;
                    
                    try {
                  
                  
                        //     const response = await Utils.postService({
                    //        service: "validateSession", 
                    //        data: {}, 
                     //       method: "GET" 
                     //   });
                  
                  

                       // if(response.succes){
                            
                            const user = App.htmlElements.userInput.value;
                            const data = {
                                
                                //id: response.player.id,
                                id: user,
                                token: token
                            };
                        
                        
                            //Inicio Envio Token
                            const response2 = await Utils.postServiceToken({
                                service: "validar", 
                                data: data, 
                                method: "POST" 
                            });



                            
                            


                            if(response2.succes){
                                

                                const user = App.htmlElements.userInput.value;
                                const pass = App.htmlElements.passInput.value;
            
                                const data = {
                                    id: user, 
                                    pass: pass
                                }


                                const response = await Utils.postService({
                                    service: "creaSession", 
                                    data: data, 
                                    method: "POST" 
                               });


                                Utils.navigate({
                                    route: "index"
                                    //route: "Token"
                                });


                            }else{
                                alert(response2.error.cod + ": " + response2.error.message);
                            }
                            //Fin Envio Token
                     
                     
                     //   }else{
                       //     if(response.error.cod === "UNAUTHORIZED"){
                       //     Utils.navigate({
                      //          route: "login"
                      //      });
                       //     }else{
                       //     alert(response.error.cod + ": " + response.error.message);
                       //     }
                       // }
                    } catch(error) {
                        console.error(error);
                    }
                }



            }
        },
        templates: {

        }
    }
    App.init();
})(document.Utils);