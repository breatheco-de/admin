function getConfig(defaults){
    let host = defaults.REACT_APP_API_HOST;

    const urlHost = new URLSearchParams(window.location.search).get('host');
    
    if(urlHost && urlHost[urlHost.length-1] === "/") urlHost.slice(0, -1);
    if(urlHost) localStorage.setItem('host', urlHost);
    if(localStorage.getItem('host')) host = localStorage.getItem('host');
    if(host === 'reset') host = defaults.REACT_APP_API_HOST;

    return {
        ...defaults,
        REACT_APP_API_HOST: host
    }
}

export default getConfig(process.env);