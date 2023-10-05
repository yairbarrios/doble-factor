((Utils) => {
    const App = {
        htmlElements: {
            loginForm: document.querySelector("#login-form"),
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
                if(e.target.id === "btnToken"){
                    e.preventDefault();

                    const token = App.htmlElements.tokenInput.value;
                    
                    try {
                        const response = await Utils.postService({
                            service: "validateSession", 
                            data: {}, 
                            method: "GET" 
                        });
                        if(response.succes){
                            const data = {
                                id: response.player.id,
                                token: token
                            };
                            //Inicio Envio Token
                            const response2 = await Utils.postServiceToken({
                                service: "validar", 
                                data: data, 
                                method: "POST" 
                            });
                            if(response2.succes){
                                Utils.navigate({
                                    route: "index"
                                    //route: "Token"
                                });
                            }else{
                                alert(response2.error.cod + ": " + response2.error.message);
                            }
                            //Fin Envio Token
                        }else{
                            if(response.error.cod === "UNAUTHORIZED"){
                            Utils.navigate({
                                route: "login"
                            });
                            }else{
                            alert(response.error.cod + ": " + response.error.message);
                            }
                        }
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