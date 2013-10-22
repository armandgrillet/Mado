#Changelog de Mado

###22 octobre 2013
L : L'infobulle *Styles* s'ouvre sans problème, CSS des infobulles repensé pour moins de lignes.

###21 octobre 2013
L : Tous les thèmes terminés, code optimisé pour rester le plus *light* possible.

R : Gestion des fenêtres aboutie, un bug de chez Google m'empêchant d'avoir quelque chose de parfaitement optimisé mais ça marche bien quand même.
app.js commenté d'une nouvelle façon, à venir sur tout les autres fichiers JS nous appartenant.

###20 octobre 2013
L : About.html mis à jour pour R. Thème *Tramway* commencé.

R : La sauvegarde immédiate marche. 
Prise en charge de l'ouverture d'un fichier Markdown améliorée niveau performances.
About.html terminé.
Meilleure gestion de la taille minimale des fenêtres, il faudra attendre que Google mette à jour son API pour avoir quelque chose de parfait.

###19 octobre 2013
L : Le thème *Clinic* est terminé, le thème *Home* est avancé et le thème *Tramway* est superficiellement commencé.

R : Analytics est inclut à Mado, il n'y a plus qu'à mettre la bonne ID (qu'on aura une fois le site web lié à Google). Pour l'instant Analytics nous donne juste les statistiques d'ouvertures de Mado.

###18 octobre 2013
L : Thème Clinic quasiment terminé.

R : Modification du compteur de mots/lettres pour qu'il soit plus précis. Mado peut ouvrir des fichiers Markdown directement, sur Windows il faut passer par l'invité de commandes pour tester (voir code dans background.js).

###17 octobre 2013
L : Clinic.css mis à jour : intégration de la fonte Bariol. Le thème *Clinic* est commencé. Achat de Bariol Italic Font Family prévu pour compléter.

R : Ajout du code concernant le display size s'appliquant à la classe du body. La façon de voir si le window resizing est changé a été modifiée (de manière plus optimisée).

###15 octobre 2013
L : Overview-style-base.css mis à jour : les styles principaux sont tous en place (à l’exception des titres de niveaux 4, 5 et 6). Document « Example document.md » créé dans Mado\Documents\ pour tester les styles.

R : Projet migré sur GitHub, changelog au format Markdown.

###14 octobre 2013
L : Style-base.css mis à jour : problème d’alignement vertical du footer et de l’icône d’état de sauvegarde réglé ; problème d’overflow de #image-status réglé (il reste un bug impossible à résoudre). Overview-style-base.css mis à jour : premiers stylages effectués.

R : Changement de la gestion des settings via une analyse de changements de valeur pour les variables (plus optimisé). Taille des fenêtres More comme convenu.

###13 octobre 2013
L : Q&A complet.

###12 octobre 2013
Meeting A+A.

R : Le clic sur Both au resizing peut être décidé dans Settings. Changements avec L de l’aide et corrections de plusieurs bugs durant le meeting.

###11 octobre 2013
L : « Shortcuts » finalisé, gère la séparation Mac/autre (à tester sous Mac). CSS de tout « More » presque terminé.

R : Changements de texte sur « About Mado », JS en cours concernant Settings (le choix de la syntaxe marche).

###8 octobre 2013
L : Style-base.css, mado.html et image.js mis à jour : l’alignement vertical du nom de l’image choisie fonctionne.

###7 octobre 2013
L : Le contenu HTML des fenêtres de « More » est rempli, sauf pour « Q&A » (aucun contenu décidé pour le moment). Styles CSS à faire demain.

R : Tentative de contrôle de l’application en cas d’ouverture d’un fichier Markdown.

###6 octobre 2013
L : Les fichiers HTML correspondant aux menus de « More » sont créés et liés à leurs CSS. Pas encore remplis ni stylés.

R : Le cas « tentative d’ouverture d’un fichier récent supprimé» marche. Footer.js mis à jour.

###5 octobre 2013
L : Style-base.css mis à jour : corrections de styles diverses (les inputs text n’ont plus de border-radius, quelques corrections de couleurs minimes). Icônes mises à jour dans la topbar, rendent beaucoup mieux.

R : Modifications de recentfiles.js, au démarrage une analyse de fichiers supprimés est faîtes pour ne pas afficher les fichiers récents ayant pu être supprimés par l’utilisateur. Suppression de tous les timers inutiles afin de rendre le code « beau ».

###4 octobre 2013
L : Suppression de responsive.js devenu inutile. Style-base.css mis à jour : le menu déroulant de « more » est fonctionnel et stylé ; more.js créé et modifié en conséquence, ainsi que onload.js. Multiples corrections CSS minimes pour l’ergonomie et la synthétisation du code.

R : Création de footer.js pour mieux diviser le code.

###3 octobre 2013
L : Intégration des icônes, mise à jour de style-base.css en conséquence et gestion de transform-origin. Je trouve les icônes excellentes dans les sidebars et dans les infobulles (« Recent » et « Help ») mais l’effet est beaucoup moins bon dans la topbar. Je jouerai avec les couleurs pour améliorer ; de plus, peut-être que supprimer les labels est finalement une bonne idée.

###2 octobre 2013
L : Listing du menu déroulant « More » (Documents\More.docx). Toutes les icônes terminées. Style-base.css mis à jour : optimisation et suppression de code inutile, et ajout de la classe « no-result » gérée par help.js (mis à jour en conséquence).

R : Améliorations diverses sur images.js.

###1 octobre 2013
L : Icônes des sidebars terminées. (À faire ce soir : icônes génériques.)

R : Optimisations majeures sur images.js, toutes les images peuvent désormais être chargées et rapidement. Bugs à travailler : gestion des \ et non rechargement de l’image.

###30 septembre 2013
L : Conversion-view-base.css créé mis à jour : les images ne dépassent plus la taille de la colonne.

R : Travail sur images.js pour trouver comment supprimer le timer.

###29 septembre 2013
L : Icônes de la navbar refaites en version « Angles » (sans arrondis sur les infos).

R : Modification d’images.js, la gestion d’images inaccessibles marche.

###28 septembre 2013
L : Icônes de la navbar terminées (format AI).

R : L’insertion de plusieurs images marche. Le dernier point à revoir est un bug quand un fichier est introuvable ou inaccessible (donc un très gros bug).

27 septembre 2013
L : Style-base.css mis à jour : finalisation de la refonte de la veille (animations et visuel de la section « Export ») et débogage du switch central.

###26 septembre 2013
L : Style-base.css mis à jour : refonte des infobulles au niveau visuel (désormais blanches et ombrées, animation changée).

R : Finalisation du composant image, à poster sur GitHub une fois que Mado sera publié. Insertion dans Mado en cours.

###24 septembre 2013
L : Set d’icônes de la navbar terminé mais disproportionné (trop grand) ; je recommence. Heureusement, j’ai déjà toutes les bases, le nouveau set ne devrait me prendre qu’une matinée.

R : J’ai ajouté un composant (image) pour créer le code JS afin de gérer l’insertion d’image. J’ai réussir à obtenir tous les fichiers accessibles par l’appli, il me reste maintenant à faire une correspondance entre cette liste et l’image voulue par l’utilisateur pour afficher l’image grâce à son ID (ça sera totalement transparent pour l’utilisateur et c’est le seul moyen pour afficher des images locales).

###21 septembre 2013
L : Mado.html et style-base.css mis à jour : balise "webview" ajoutée et stylée.

R : Ajout des fonctions pour ajouter une image (non fonctionnelles à cause de la protection de Chrome).

###20 septembre 2013
R : Modification de l’ouverture d’une nouvelle fenêtre, désormais légèrement décalée pour que l’utilisateur comprenne qu’il s’agit d’une nouvelle fenêtre. 

###19 septembre 2013
R : Ajout de la fonction d’ouverture lors d’un clic sur un fichier récent. Les event listeners ont été remplacés par des fonction on().

###18 septembre 2013
R : Modification de « recentFiles » pour prendre en charge le cas « plusieurs fenêtres de Mado et suppression d’un fichier récent dans l’une » et modification du code pour que l’ouverture d’un fichier dans une nouvelle fenêtre si texte présent dans la textarea marche. Lancer Mado comme un site web ne marche plus avec ces nouveaux ajouts.

###17 septembre 2013
L : Mado.html et style-base.css mis à jour : le module d’insertion d’images est prêt et stylisé, la couleur du footer est désormais la même que celle des « boîtes à outils » et le code a été repensé en partie pour une meilleure optimisation et synthétisation. Help.js, link.js et image.js mis à jour en conséquence des ajouts de nouvelles classes. Image.js créé, variables initialisées et bouton « Image » fonctionnel.

R : Le fichier recentfiles.js a été totalement refait dans une nouvelle forme bien optimisée avec un nombre de fonctions réduit pour simplifier la lecture et optimiser le code. Tout marche sauf le clic sur un document récent (qui entrainera l’ouverture du fichier).

###15 septembre 2013
L : Mado.html mis à jour : écriture de l’HTML nécessaire à l’insertion d’images.

###14 septembre 2013
R : Débogage du raccourci Ctrl + flèche.

###13 septembre 2013
L : Style.css mis à jour : chaque document récent a désormais un bouton de délétion (pour le moment un gros carré rouge). Recentfiles.js légèrement débogué (pas de changements significatifs).

R : Les suppressions de documents dans « Recent » marchent.

###12 septembre 2013
L : Style-base.css (renommé à partir de style.css) mis à jour : le bouton « Recent » est fonctionnel, avec la liste associée utilisable. Recentfiles.js créé dans Projet/js/.

R : Le bouton « Recent » marche (avec clic sur une zone extérieure entrainant une fermeture).

###11 septembre 2013
L : Premiers croquis des icônes de la topbar de Mado.

###10 septembre 2013
L : Style.css mis à jour : la disparition des labels est fonctionnelle.

R : Suppression d’autosize.js.

###9 septembre 2013
L : Style.css mis à jour : le switch se modifie avec fluidité lors du changement de taille de la fenêtre, et l’application n’a plus de bug visuel au lancement en petite fenêtre. Reste la disparition des labels de la topbar sur petit écran et le responsive sera fini.

R : Logo mis à jour.

###8 septembre 2013
L : Style.css mis à jour : la hauteur de la textarea est à 100% et la topbar et le footer présentent désormais une lumière en dégradé qui agit comme une ombre (invisible) pour faire disparaître le texte avec plus de fluidité.

R : Viewswitch.js modifié : fonctionnement responsive avancé, suppression du bouton « Both » sur petit écran à faire. Insertion d’images locales fonctionnelle (avec l’orthographe Md). Raccourcis claviers ajoutés pour changer de vue. Le nom du fichier dans le footer est désormais correctement affiché.

###7 septembre 2013
R : Fonctionnement des liens (pour le moment seulement les liens hypertextes, pas de notes possibles). Ouverture de nouvelle fenêtre si ouverture d’un fichier avec déjà du texte dans la textarea. Amélioration globale d’app.js (code très aéré pour une meilleure compréhension).

###6 septembre 2013
L : Style.css mis à jour : finitions au niveau de la sidebar de gauche, ajout de la ligne de séparation centrale et de son comportement animé. Création de responsive.js (ne fonctionne pas).

R : Ajout de balises <span> quand aide demandée.

###5 septembre 2013
R : Modification du fonctionnement au clic de l’aide et des liens, maintenant un clic sur le bouton alors que l’input est visible ferme le tout.

###4 septembre 2013
R : Le compteur caractères / mots marche.

###3 septembre 2013
R : Mise à jour d’onload.js (rangement, suppression de doublons), suppression de footer.js (inclus dans conversion.js), remplacement de count.js par counter.js qui est un  fichier JS plus précis, « head » de mado.html rangé au niveau du JS.

###2 septembre 2013
L : Style.css mis à jour : l’input d’aide est mieux stylisé.

###1er septembre 2013
L : Style.css mis à jour : switch visuellement presque terminé (il reste l’initialisation par JavaScript et le responsive) et topbar légèrement stylée.

R : Fonction Save As et Export fonctionnelles, début de fonctionnement pour « save-state », ajout de raccourcis (aide et lien) et fonctionnement des raccourcis même dans l’input.

###31 août 2013
L : Style.css mis à jour : les boutons de switch sont presque entièrement stylés, et il est désormais impossible de sélectionner le texte des navbar, sidebars et footer. Premier test pour le logo final.

R : Ajout d’id pour les boutons en topbar, optimisations d’onload.js, remplacement des eval() par des window[] ; ajout de fonctionnalités de Packaged Apps : les boutons « New », « Open » et « Save » fonctionnent (code dans app/app.js). Ajout de raccourcis clavier grâce à mousetrap.js.

###23 août 2013
L : Corrections diverses dans style.css et mado.html, proposition d’accueil façon application.

###22 août 2013
L : Style.css débogué, positionnement et animations des éléments fonctionnels. Le switch des résultats de l’aide fonctionne (c’était bien dû au Z-index) et est animé.

R : Focus automatique dans les inputs au clic sur le bouton correspondant. Link.js mis à jour : la sélection éventuelle du texte est gardée au clic sur le bouton, par contre après ça marche pas.

###21 août 2013
L : Fonction ‘displayAnswers’ de help.js déboguée, le conteneur des résultats de l’aide (#help-results-container) ne s’affiche plus si l’input est vide. Classes des displayers de l’aide et de l’insertion de lien quasi-fonctionnelles.

R : Fonction de clic ailleurs que dans les inputs revue et corrigée dans help.js, toutes les variables HTML passées dans onload.js, clic sur les boutons « Help » et « Link » fonctionnel. Link.js créé.

###20 août 2013
L : Mado.html et style.css mis à jour : les inputs des boutons « Help » et « Link » sont ajoutés et partiellement mis à jour.

R : Help.js fonctionnel, la fonction de rétraction au clic ailleurs que dans la zone fonctionne. La variable 

###18 août 2013
L : Viewswitch.js débogué. Changement de classe du conteneur de réponses dans help.js fonctionnel, par contre je ne sais pas comment le faire revenir à la classe « hidden »…

R : Count.js ajouté (et fonctionnel) : le nombre de mots de la textarea est affiché dans le footer.

###17 août 2013
L : Help.js ajouté, non fonctionnel a priori à cause du ‘onload’. CSS complet au niveau du conteneur (mais pas les items de réponse elles-mêmes).

R : Modifications de help.js, conversion.js et viewswitch.js pour un fonctionnement avec onload.js (qui gère les évènements de la page). Tout est fonctionnel sauf la dernière ligne de viewswitch.js.

###16 août 2013
L : Viewswitch.js est complet, en revanche l’appel des ‘onClick’ ne fonctionne pas (bug déjà vu et revu en JS, je cherche une solution sans passer par le HTML). CSS associé commencé, classes attribuées. Footerdata.js est créé mais pas encore écrit (besoin de discuter de son fonctionnement). Le viewswitch2.js est devenu le nouveau viewswitch.js, problème de ‘onClick’ encore à régler. Visuel de la textarea corrigé, on a maintenant l’impression qu’elle se fond au reste.

###15 août 2013
R : Changements divers sur la textarea Markdown : hauteur dynamique, nouvelle taille approximative en attendant un vrai CSS.

###13 août 2013
R : Débogage background.js, l’application fonctionne maintenant avec width ou height non paire ; ajout de la font Source Code Pro et liaison avec mado.html

###12 août 2013
R : Ecriture de Developpement.docx, à valider par L.
nne maintenant avec width ou height non paire ; ajout de la font Source Code Pro et liaison avec mado.html

###12 août 2013
R : Ecriture de Developpement.docx, à valider par L.
avec width ou height non paire ; ajout de la font Source Code Pro et liaison avec mado.html

###12 août 2013
R : Ecriture de Developpement.docx, à valider par L.
Developpement.docx, à valider par L.
