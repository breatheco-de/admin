

export function getSession(){
    const session = JSON.parse(localStorage.getItem("bc-session"));
    if(!session || !session.academy) window.location.href = "/login";
    return { academy: null, token: null }
}