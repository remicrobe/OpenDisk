

export function erreur(detail:string) {
    var erreurObjet = {
        erreur: detail
    };

    var erreurJson = JSON.stringify(erreurObjet);
    return erreurJson;
}

export function ValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

//TODO : implementer cette fonction
export function ValidPassword(email:string){
    return true
}