document.addEventListener("DOMContentLoaded", function () {
    chargerLieuxPersonnalises();
    chargerLieux();
    afficherEnregistrements();

let restt = localStorage.getItem('currentTab');

setTimeout(function () {
    if (restt !== null && restt !== undefined && restt.trim() !== '') {
        openTab(restt);

    } 
}, 100);


    var savedTheme = localStorage.getItem('theme');

    // Si un thème est sauvegardé, appliquez-le
    if (savedTheme) {
               changerTheme(savedTheme);
    }


        const tabulValue = localStorage.getItem('TABUL');

    // Vérifier si "TABUL" est défini dans le localStorage
    if (tabulValue !== null) {
        // Mettre à jour l'état du switch en fonction de la valeur de "TABUL"
        const tabulSlider = document.getElementById('tabulSlider');
        tabulSlider.checked = tabulValue === 'true'; // Convertir la chaîne en booléen
    }
});


if (!localStorage.getItem('lieuxEnregistres')) {
    localStorage.setItem('lieuxEnregistres', JSON.stringify([]));
}







function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}


function afficherEnregistrements() {
    const enregistrementsDiv = document.getElementById('enregistrements');
    
    // Effacer le contenu existant
    enregistrementsDiv.innerHTML = '';

    const enregistrementsString = localStorage.getItem('enregistrements');

    try {
        let enregistrements = JSON.parse(enregistrementsString);

        if (!Array.isArray(enregistrements)) {
            throw new Error('Les enregistrements ne sont pas un tableau.');
        }

        const listeEnregistree = JSON.parse(localStorage.getItem('maListe')) || [];

        enregistrements.forEach(enregistrement => {
            const enregistrementDiv = document.createElement('div');
            enregistrementDiv.id = enregistrement.id; // Ajouter l'ID à l'enregistrementDiv
            enregistrementDiv.className = "AFregis"; // Ajouter la classe à l'enregistrementDiv

            let enregistrementTexte;

            if (enregistrement.texte) {
                // Ancien format avec la propriété texte
                const parties = enregistrement.texte.split('-');
                enregistrementTexte = parties.map(partie => partie.trim()).join(' - ');
            } else {
                // Nouveau format avec des propriétés distinctes
                enregistrementTexte = `${enregistrement.date} - ${enregistrement.temps} - ${enregistrement.zoneTexte1} - ${enregistrement.zoneTexte2} - ${enregistrement.zoneTexte3}`;
            }

            enregistrementDiv.textContent = enregistrementTexte;

            const boutonsDiv = document.createElement('div');
            boutonsDiv.style.display = 'flex'; // Utiliser flexbox pour aligner les boutons sur une ligne

            // Ajouter un bouton de modification avec un gestionnaire d'événements
            const boutonModifier = document.createElement('button');
            boutonModifier.textContent = 'Modifier';
            boutonModifier.style.marginRight = '5px'; // Ajouter une marge à droite pour séparer les boutons
            boutonModifier.addEventListener('click', () => {
                afficherZonesDeTexte(enregistrement);
            });

            // Create "Restaurer" button with the id "restore"
 const boutonRestaurer = document.createElement('button');
boutonRestaurer.textContent = 'Restaurer';
boutonRestaurer.id = 'restore';
boutonRestaurer.style.marginRight = '5px'; // Ajouter une marge à droite pour séparer les boutons

            // Check if the location is in the listeEnregistree
            const isLocationInListe = listeEnregistree.includes(enregistrement.zoneTexte1);

if (isLocationInListe) {
    boutonRestaurer.disabled = true; // Disable the button
    boutonRestaurer.classList.add('disabled-button'); // Add the disabled style
} else {
boutonRestaurer.disabled = false;    
boutonRestaurer.classList.add('green-button'); // Add the green-button style
}

            boutonRestaurer.addEventListener('click', () => {
                const enregistrementDivToDelete = document.getElementById(enregistrement.id);
                if (enregistrementDivToDelete) {
                    enregistrementDivToDelete.remove();
                }

                const indexASupprimer = enregistrements.findIndex(e => comparerEnregistrements(e, enregistrement));

                if (indexASupprimer !== -1) {
                    enregistrements.splice(indexASupprimer, 1);
                    localStorage.setItem('enregistrements', JSON.stringify(enregistrements));

                } 
                relancer(enregistrement.zoneTexte1, enregistrement.temps, enregistrement.zoneTexte2, enregistrement.zoneTexte3, enregistrement.zoneTexte4, enregistrement.zoneTexte5,  enregistrement.zoneTexte6);
            });

            // Create "Supprimer" button with the id "dell"
            const boutonSupprimer = document.createElement('button');
            boutonSupprimer.textContent = 'Supprimer';
            boutonSupprimer.id = 'dell';
            boutonSupprimer.style.marginRight = '5px'; // Ajouter une marge à droite pour séparer les boutons
            boutonSupprimer.addEventListener('click', () => {
                const confirmation = window.confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?');
                if (confirmation) {
                    const enregistrementDivToDelete = document.getElementById(enregistrement.id);
                    if (enregistrementDivToDelete) {
                        enregistrementDivToDelete.remove();
                    }

                    const indexASupprimer = enregistrements.findIndex(e => comparerEnregistrements(e, enregistrement));

                    if (indexASupprimer !== -1) {
                        enregistrements.splice(indexASupprimer, 1);
                        localStorage.setItem('enregistrements', JSON.stringify(enregistrements));
                    }
                }
            });

            boutonsDiv.appendChild(boutonModifier);
            boutonsDiv.appendChild(boutonRestaurer);
            boutonsDiv.appendChild(boutonSupprimer);

            enregistrementDiv.appendChild(boutonsDiv);
            enregistrementsDiv.appendChild(enregistrementDiv);
        });

    } catch (error) {

    }
}


function relancer(nomLieu, temps, liste1, liste2, Text1, Text2, arret) {


    // Ensuite, vous pouvez exécuter votre logique pour ouvrir l'iframe
    ouvrirIframe(nomLieu, temps, liste1, liste2, Text1, Text2, arret);
}



function creerFenetreModale(enregistrement) {
    const modalDiv = document.createElement('div');
    modalDiv.classList.add('modal');


    return modalDiv;
}

function creerInputAvecLabel(labelText, inputType, valeurInitiale) {
    const label = document.createElement('label');
    label.textContent = labelText;

    const input = document.createElement('input');
    input.type = inputType;
    input.value = valeurInitiale;

    return { label, input };
}


function mettreAJourEnregistrement(enregistrement, date, temps, zoneTexte1, zoneTexte2, zoneTexte3) {
  

    // Récupérer le tableau d'enregistrements depuis le stockage local
    const enregistrementsString = localStorage.getItem('enregistrements');
    let enregistrements = JSON.parse(enregistrementsString);

    // Vérifier si enregistrements est défini
    if (!enregistrements) {
        enregistrements = [];
    }

    // Mettre à jour l'enregistrement spécifique dans le tableau
    const indexAUpdater = enregistrements.findIndex(e => comparerEnregistrements(e, enregistrement));

    if (indexAUpdater !== -1) {
        enregistrements[indexAUpdater].date = date;
        enregistrements[indexAUpdater].temps = temps;
        enregistrements[indexAUpdater].zoneTexte1 = zoneTexte1;
        enregistrements[indexAUpdater].zoneTexte2 = zoneTexte2;
        enregistrements[indexAUpdater].zoneTexte3 = zoneTexte3;


        // Réenregistrer le tableau mis à jour dans le stockage local
        localStorage.setItem('enregistrements', JSON.stringify(enregistrements));
      
    } 


}

function creerBoutonValider(callbackValider, callbackAnnuler) {
    const boutonValider = document.createElement('button');
    boutonValider.textContent = 'Valider';
    boutonValider.addEventListener('click', callbackValider);
    
    // Create Cancel button
    const boutonAnnuler = document.createElement('button');
    boutonAnnuler.textContent = 'Annuler';
    boutonAnnuler.addEventListener('click', callbackAnnuler);
    boutonAnnuler.id = 'dell';


   return { boutonValider, boutonAnnuler };
}



function mettreAJourAffichage() {

    afficherEnregistrements();
    
    var angleCouleur = localStorage.getItem('angleCouleur');;
    if (angleCouleur !== null) {
        changerCouleur(angleCouleur);
    }
}
function afficherZonesDeTexte(enregistrement) {
    // Create the modalDiv variable before using it
    const modalDiv = creerFenetreModale(enregistrement);

    // Define the callbackAnnuler function to close the modal
    const callbackAnnuler = () => modalDiv.remove();

    const { label: dateLabel, input: dateInput } = creerInputAvecLabel('Date:', 'text', enregistrement.date);
    const { label: tempsLabel, input: tempsInput } = creerInputAvecLabel('Temps:', 'text', enregistrement.temps);
    const { label: zoneTexte1Label, input: zoneTexte1Input } = creerInputAvecLabel('Lieu:', 'text', enregistrement.zoneTexte1);
    const { label: zoneTexte2Label, input: zoneTexte2Input } = creerInputAvecLabel('Résumer:', 'text', enregistrement.zoneTexte2);
    const { label: zoneTexte3Label, input: zoneTexte3Input } = creerInputAvecLabel('Pièces:', 'text', enregistrement.zoneTexte3);

    const { boutonValider, boutonAnnuler } = creerBoutonValider(
        () => {
            const confirmation = window.confirm('Êtes-vous sûr de vouloir modifier cet enregistrement ?');
            if (confirmation) {
                mettreAJourEnregistrement(enregistrement, dateInput.value, tempsInput.value, zoneTexte1Input.value, zoneTexte2Input.value, zoneTexte3Input.value);
                mettreAJourAffichage();
                modalDiv.remove();
            }
        },
        () => modalDiv.remove()
    );

    modalDiv.appendChild(dateLabel);
    modalDiv.appendChild(dateInput);
    modalDiv.appendChild(tempsLabel);
    modalDiv.appendChild(tempsInput);
    modalDiv.appendChild(zoneTexte1Label);
    modalDiv.appendChild(zoneTexte1Input);
    modalDiv.appendChild(zoneTexte2Label);
    modalDiv.appendChild(zoneTexte2Input);
        modalDiv.appendChild(zoneTexte3Label);
    modalDiv.appendChild(zoneTexte3Input);
    modalDiv.appendChild(boutonValider);
    modalDiv.appendChild(boutonAnnuler);

    document.body.appendChild(modalDiv);

            var angleCouleur = localStorage.getItem('angleCouleur');;
if (angleCouleur !== null) {
    changerCouleur(angleCouleur);
}
}



function comparerEnregistrements(enregistrement1, enregistrement2) {
    return (
        enregistrement1.date === enregistrement2.date &&
        enregistrement1.temps === enregistrement2.temps &&
        enregistrement1.zoneTexte1 === enregistrement2.zoneTexte1 &&
        enregistrement1.zoneTexte2 === enregistrement2.zoneTexte2 &&
        enregistrement1.zoneTexte3 === enregistrement2.zoneTexte3
    );
}


function getCurrentTime() {
    // Implémentez ici la logique pour obtenir le temps actuel
    // Vous pouvez utiliser la classe Date de JavaScript ou une bibliothèque externe
    const now = new Date();
    return `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} - ${now.getHours()}h${now.getMinutes()}m${now.getSeconds()}s`;
}

let timers = {};
let lieuxState = {};

let globalPauseState = false;

        function formatTime(time) {
    return time < 10 ? '0' + time : time;
}





function openTab(tabName) {
    const chronoButton = document.getElementById('ChronoButton');
    const currentAnnimValue = chronoButton.getAttribute('annim');
    const newAnnimValue = 'false';
    chronoButton.setAttribute('annim', newAnnimValue);

    var i, tabcontent, tabbuttons;

    // Cacher tous les onglets
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Retirer la classe "active" de tous les boutons
    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].classList.remove("active");
    }

    // Afficher l'onglet sélectionné
    document.getElementById(tabName + "Tab").style.display = "block";

    // Ajouter la classe "active" au bouton correspondant
    document.getElementById(tabName + "Button").classList.add("active");

    // Stocker l'onglet actuel dans le localStorage
    localStorage.setItem('currentTab', tabName);

    // Appeler afficherEnregistrements si le tabName est "interventions"
    if (tabName === "interventions") {
        setTimeout(function () {
    afficherEnregistrements();
}, 100);

    }

    var angleCouleur = localStorage.getItem('angleCouleur');;
    if (angleCouleur !== null) {
        changerCouleur(angleCouleur);
    }
}


function ajouterLieu() {
    const nouveauLieuInput = document.getElementById('nouveauLieu');
    const nouveauLieu = nouveauLieuInput.value.trim();

    if (nouveauLieu !== '') {
        // Ajouter le nouveau lieu à localStorage
        const lieuxEnregistres = localStorage.getItem('lieuxEnregistres') || '';
        const nouveauxLieux = lieuxEnregistres + ',' + nouveauLieu;
        localStorage.setItem('lieuxEnregistres', nouveauxLieux);

        // Ajouter le nouveau lieu en haut de la liste lieux-list
        ajouterLieuEnHaut(nouveauLieu);


        // Mettre à jour la liste déroulante
        mettreAJourListeDeroulante(nouveauLieu);

    }

    // Effacer le champ de saisie
    nouveauLieuInput.value = '';
}

function ajouterLieuEnHaut(nouveauLieu) {
    const lieuxList = document.getElementById('lieux-list');

    // Exclure les lieux vides
    if (nouveauLieu.trim() !== '' && nouveauLieu !== "[]") {
        // Créer un nouvel élément li
        const lieuItem = document.createElement('li');
        lieuItem.innerHTML = `
            <div class="place-card level" >
                <span class="pastille" data-texte="${nouveauLieu}" style="display:block"> ${nouveauLieu}</span>
                <button id="lancer-chrono-btn-${nouveauLieu}" data-lieu="${nouveauLieu}" onclick="ouvrirIframe('${nouveauLieu}')" style="width: 40px; height: 41px; position: absolute; top: -12px; right: -12px; border-radius: 8px; display: block;">
                    <img src="chrono.png" alt="Icône chrono" style="width: 20px; height: 20px; position: absolute; bottom: 10px; right: 9px;">
                </button>
                <div class="iframe-container" id="iframe-container-${nouveauLieu}"></div>
            </div>`;

        // Insérer l'élément en haut de la liste lieux-list
        lieuxList.prepend(lieuItem);
    }
}


function mettreAJourListeDeroulante(nouveauLieu) {
    const lieuxDropdown = document.getElementById('lieuxDropdown');

    // Vérifier si nouveauLieu est différent de "[]"
    if (nouveauLieu.trim() !== '' && nouveauLieu !== "[]") {
        // Ajouter le nouvel élément à la liste déroulante
        const option = document.createElement('option');
        option.value = nouveauLieu;
        option.textContent = nouveauLieu;
        lieuxDropdown.appendChild(option);
    }
}


function chargerLieuxPersonnalises() {

    
    const lieuxEnregistres = localStorage.getItem('lieuxEnregistres') || '';
    const lieuxEnregistresArray = lieuxEnregistres.split(',');

    const lieuxList = document.getElementById('lieux-list');

    for (const lieuEnregistre of lieuxEnregistresArray) {

        ajouterLieuEnHaut(lieuEnregistre);
        mettreAJourListeDeroulante(lieuEnregistre)
    }
}




function parcourirArborescenceEtCreerIframes(arbre, parent) {
    for (const lieu in arbre) {
        const iframeContainer = document.createElement('div');
        const iframe = document.createElement('iframe');
        const nomLieu = lieu.toLowerCase().replace(/\s+/g, '-');

        iframe.id = `iframe-${nomLieu}`;
        iframe.src = `chrono.html?lieu=${lieu}`;

        iframeContainer.appendChild(iframe);
        parent.appendChild(iframeContainer);

        if (Object.keys(arbre[lieu]).length > 0) {
            parcourirArborescenceEtCreerIframes(arbre[lieu], iframeContainer);
        }
    }
}

function exportToTxt() {
    // Demander à l'utilisateur dans quelle liste exporter les données
    const listName = window.prompt("Nom de famille utilisé dans la GMAO", "AUTRE");

    // Vérifier si l'utilisateur a annulé la fenêtre contextuelle
    if (listName === null) {
        return; // Sortir de la fonction si l'utilisateur a annulé
    }

    // Obtenir le contenu brut depuis le stockage local
    const enregistrementsString = localStorage.getItem('enregistrements');

    // Ajouter un saut de ligne après chaque `},{`
    const contentWithNewlines = enregistrementsString.split('},{').join('},\n{');

    // Créer un objet Blob pour le contenu du fichier
    const blob = new Blob([contentWithNewlines], { type: 'text/plain' });

    // Créer un objet URL pour le Blob
    const url = URL.createObjectURL(blob);

    // Créer un élément de lien pour déclencher le téléchargement
    const link = document.createElement('a');
    link.href = url;
    link.download = `${listName}.txt`; // Utiliser le nom de la liste dans le nom du fichier

    // Ajouter le lien à la page et déclencher le téléchargement
    document.body.appendChild(link);
    link.click();

    // Retirer le lien de la page une fois le téléchargement terminé
    document.body.removeChild(link);
}



function supprimerLieu() {
    const lieuxDropdown = document.getElementById('lieuxDropdown');
    const selectedLieu = lieuxDropdown.value;

    if (selectedLieu) {
        // Ajoutez une confirmation avant de supprimer
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce lieu ?");
        
        if (confirmation) {
            // Supprimez l'élément sélectionné des cookies
            const lieuxEnregistres = localStorage.getItem('lieuxEnregistres') || '';
            
            // Convertir la chaîne en tableau en supprimant les espaces vides
            const lieuxEnregistresArray = lieuxEnregistres.split(',').filter(lieu => lieu.trim() !== '' && lieu !== "[]");

            const indexToRemove = lieuxEnregistresArray.indexOf(selectedLieu);

            if (indexToRemove !== -1) {
                lieuxEnregistresArray.splice(indexToRemove, 1);
                localStorage.setItem('lieuxEnregistres', lieuxEnregistresArray.join(','));

                // Effacer la liste déroulante actuelle
                lieuxDropdown.innerHTML = '';

                lieuxEnregistresArray.forEach(nomLieu => {
                    const option = document.createElement('option');
                    option.value = nomLieu;
                    option.textContent = nomLieu;
                    lieuxDropdown.appendChild(option);
                });

                // Supprimer l'élément correspondant dans la liste lieux-list
                const lieuxList = document.getElementById('lieux-list');
                const lieuItemToRemove = document.querySelector(`[data-texte="${selectedLieu}"]`).parentNode.parentNode;
                lieuxList.removeChild(lieuItemToRemove);
            }
        }
    }
}


// Fonction pour basculer l'état du slider et mettre à jour le paramètre "TABUL"
function toggleTabul() {
    const tabulSlider = document.getElementById('tabulSlider');
    const tabulValue = tabulSlider.checked;


    localStorage.setItem('TABUL', tabulValue ? 'true' : 'false');
   
}



