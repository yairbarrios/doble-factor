(() => {
    const Utils = {
        settings: {
            backendBaseUrl: "http://localhost:3005",
            frontendBaseUrl: "http://localhost:3000",
            backendBaseUrlToken: "http://localhost:3005",
        },
        getFormattedBackendUrl: ({ service }) => {
            return `${Utils.settings.backendBaseUrl}/${service}`;
        },
        getFormattedTokenUrl: ({ service }) => {
            return `${Utils.settings.backendBaseUrl}/${service}`;
        },
        getFormattedFrontendUrl: ({ route }) => {
            return `${Utils.settings.frontendBaseUrl}/${route}.html`;
        },
        navigate: ({ route }) => {
            let newUrl = Utils.getFormattedFrontendUrl({ route });
            window.location.replace(newUrl);
        },
        postService: ({ service, data, method }) => {
            return Utils.fetch({
                url: Utils.getFormattedBackendUrl({ service }),
                service,
                data,
                method
            });
        },
        postServiceToken: ({ service, data, method }) => {
            return Utils.fetch({
                url: Utils.getFormattedTokenUrl({ service }),
                service,
                data,
                method
            });
        },
        fetch: async ({ url, service, data, method }) => {
            let parameters = (method === "HEAD" || method === "GET") ? { 
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'SameSite': 'none'
                    },
                    credentials: "include",
                } : 
                {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'SameSite': 'none'
                    },
                    body: JSON.stringify(data),
                    credentials: "include",
                }
            try {
                const rawResponse = await fetch(url, parameters);
                if (rawResponse.status !== 200) {
                    throw new Error(`${service} not found`);
                }
                return rawResponse.json();
            } catch (error) {
                throw error;
            }
        }
    }
    document.Utils = Utils;
})();
