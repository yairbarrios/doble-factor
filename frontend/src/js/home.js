((Utils) => {
    const App = {
        htmlElements: {
            indexForm: document.querySelector("#index-form"),
            yappyButton: document.querySelector('.yappy-button'),
            yappyAnchor: document.getElementById("yappy-anchor"),
            modal: document.getElementById("myModal"),
        },
        init: () => {
            App.htmlElements.indexForm.addEventListener(
                "click",
                App.handlers.indexFormOnSubmit
            );
        },
        handlers: {
            indexFormOnSubmit: async (e) => {
                if(e.target.id === "logout"){
                    e.preventDefault();
                    try {
                        const response = await Utils.postService({
                            service: "logout", 
                            data: {}, 
                            method: "GET" 
                        });
                        if(response.response.cod === 'LOGOUT'){
                            Utils.navigate({
                                route: "login"
                            });
                        }else{
                            alert(response.response.message);
                        }
                    } catch(error) {
                        console.error(error);
                    }
                }
                if(e.target.id === "subscribe"){
                    e.preventDefault();
                    /*Inicia Pasarela*/
                    try {
                        const response = await Utils.postService({
                            service: "paymentGateway", 
                            data: {}, 
                            method: "POST" 
                        });
                        if(response.success){
                            const url = response.url;
                            App.htmlElements.yappyButton.classList.value = 'yappy-button flex';
                            App.htmlElements.yappyAnchor.href = url;
                            App.htmlElements.yappyAnchor.target = "_blank";
                            App.htmlElements.modal.style.display = "block";
                            /*Inicio Activa Suscripción*/
                            try {
                                const response = await Utils.postService({
                                    service: "subscribe", 
                                    data: {}, 
                                    method: "POST" 
                                });
                                if(response.succes){
                                    //alert("Subscribed!");
                                    //location.reload();
                                }else{
                                    alert(response.error.cod + ": " + response.error.message);
                                }
                            } catch(error) {
                                console.error(error);
                            }
                            /*Fin Activa Suscripción*/
                        }else{
                            alert(response.error.cod + ": " + response.error.message);
                        }
                    } catch(error) {
                        console.error(error);
                    }
                    /*Termina Pasarela*/
                }
            }
        },
        templates: {

        }
    }
    App.init();
})(document.Utils);