window.onload = function() {
	buttonFichier = document.getElementById("fichier");

	buttonRemove1 = document.getElementById("supFichier1");
	buttonRemove2 = document.getElementById("supFichier2");
	buttonRemove3 = document.getElementById("supFichier3");

	buttonDisplay1 = document.getElementById("disFichier1");
	buttonDisplay2 = document.getElementById("disFichier2");
	buttonDisplay3 = document.getElementById("disFichier3");

	inputDef1 = document.getElementById("fichier1-defini");
	inputDef2 = document.getElementById("fichier2-defini");
	inputDef3 = document.getElementById("fichier3-defini");

	inputExi1 = document.getElementById("fichier1-present");
	inputExi2 = document.getElementById("fichier2-present");
	inputExi3 = document.getElementById("fichier3-present");

	affichage = document.getElementById("affichage");

	displayFiles();

	buttonFichier.addEventListener("click", function() { loadFile(); }, false);

	buttonRemove1.addEventListener("click", function() { deleteFile(1); }, false);
	buttonRemove2.addEventListener("click", function() { deleteFile(2); }, false);
	buttonRemove3.addEventListener("click", function() { deleteFile(3); }, false);

	buttonDisplay1.addEventListener("click", function() { openFile(1); }, false);
	buttonDisplay2.addEventListener("click", function() { openFile(2); }, false);
	buttonDisplay3.addEventListener("click", function() { openFile(3); }, false);
}