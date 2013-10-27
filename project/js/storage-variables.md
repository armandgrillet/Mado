#Variables utilisées dans chrome.storage.local :


###Taille des fenêtres :
int lastX : dernière position de la fenêtre en X.

int lastY : dernière position de la fenêtre en Y.


int lastWidth : dernière taille de la fenêtre.

int lastHeight : dernière hauteur de la fenêtre.

###Configuration de l'utilisateur : 

bool gfm : syntaxe Markdown voulue.

string displaySize : small, medium ou big.

bool resize : true si l'utilisateur veut retourner à Both en agrandissant la fenêtre. 

bool analytics : true si l'utilisateur veut bien partager ses données.

###Fonctionnement de l'application : 
string tempFileEntry : stockage du fichier Markdown ouvert si ouverture dans une nouvelle fenêtre.

string recentFile[1 à 7] : stockage du nom des 7 derniers fichiers ouverts.

string recentFileId(1 à 7] : stockage des Id des derniers fichiers ouverts.

