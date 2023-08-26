

export function erreur(detail:string) {
    var erreurObjet = {
        erreur: detail
    };

    var erreurJson = JSON.stringify(erreurObjet);
    return erreurJson;
}
