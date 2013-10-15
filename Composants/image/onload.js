window.onload = function() {
	galleriesChoice = document.getElementById("choix-galleries");
	imageChoice = document.getElementById("choix-image");
	galleries = document.getElementById("galleries");
	choosedPath = document.getElementById("image-choisie");
	images = document.getElementById("images"); 

	update();

	galleriesChoice.addEventListener("click", chooseGalleries, false);
	imageChoice.addEventListener("click", chooseAnImage, false);
}