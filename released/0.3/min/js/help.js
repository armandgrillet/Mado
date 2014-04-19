/* The JS to help the user when he types something on the help input. */

/*
* Variables (in alphabetical order):
	* Everything except arrays.
	* Arrays.
*/

var answersContainer; // The div who contains the answers displayed.
var help; // The input where the user writes what he wants.
var helpButton; // The help button.
var helpDisplayer; // The div who contains all the help divs.
var maxAnswers; // Check the number of answers displayed, max = 3.
var resultsContainer; // Will contain the HTML results container.
var wordPos; // Shortcut for "words[i][j].toLowerCase().indexOf(help.value.toLowerCase());".

var helpArray = [
	[
		["Headers", "Titles"],
		"Six sizes available, the size depends on the numbers of #. <br> #Big title (size 1, the biggest). <br> ####A less impresive title (size 4 on 6).",
		"Six sizes available, the size depends on the numbers of #.<h1 id=\"big-title-size-1-the-biggest-\">Big title (size 1, the biggest).</h1><h4 id=\"a-less-impresive-title-size-4-on-6-br-\">A less impresive title (size 4 on 6).</h4>"
	],
	[
		["Bold", "Strong emphasis"],
		"<span class=\"help-code\">**bold**</span> or <span class=\"help-code\">__bold__</span>",
		"<strong>Bold</strong>"
	],
	[
		["Italic", "Emphasis"],
		"<span class=\"help-code\">*italic*</span> or <span class=\"help-code\">_italic_</span>",
		"<em>Italic</em>"
	],
	[
		["Bold italic", "Combined emphasis"],
		"<span class=\"help-code\">**_ bold italic_**</span> or <span class=\"help-code\">*__bold italic__*</span> or <span class=\"help-code\">***this***</span> or <span class=\"help-code\">___this___</span>",
		"<strong><em>Bold italic</em></strong>"
	],
	[
		["Ordered lists"],
		"1. First ordered list item. <br>2. Another item.",
		"<ol><li>First ordered list item</li><li>Another item.</li></ol>"
	],
	[
		["Unordered lists"],
		"* An item. <br>* A second item (you can also use + or -).",
		"<ul><li>An item. </li><li>A second item (you can also use + or -).</li></ul>"
	],
	[
		["Inline-style links"],
		"<span class=\"help-code\">[Hypertext](http://aplusa.io/mado)</span><br>(Can be used to create an anchor.)",
		"<a target=\"_blank\" href=\"http://aplusa.io/mado\">Hypertext</a>"
	],
	[
		["Reference-style links"],
		"<span class=\"help-code\">[Hypertext][1]<br>[1]: http://aplusa.io/mado</span>",
		"<a target=\"_blank\" href=\"http://aplusa.io/mado\">Hypertext</a>"
	],
	[
		["Images (inline)", "Pictures (inline)"],
		"<span class=\"help-code\">![alt text](path/to/image.jpg \"Title\")</span>",
		"<div class=\"example-image\"></div>"
	],
	[
		["Images (reference-style)", "Pictures (reference-style)"],
		"<span class=\"help-code\">![alt text][image Id] <br> [image Id]: path/to/image.jpg \"Title\"</span>",
		"<div class=\"example-image\"></div>"
	],
	[
		["Blocks of code"],
		"<span class=\"help-code\">```Text between three back-ticks is a block of code.```<br>&nbsp;&nbsp;&nbsp;&nbsp;Text after four spaces is also a block of code.</span>",
		"<code>Write your code between three back-ticks to make a block of code.</code><br><code>You can also write code by indent your text with four spaces.</code>"
	],
	[
		["Blockquotes"],
		"> Blockquotes only need <span class=\"help-code\">></span> to work. <br><br> <span class=\"help-code\">> Two blockquotes without a break (a line who isn't a blockquote)  are a single quote.</span>",
		"<blockquote>Blockquotes only need &gt; to work. To separate two blockquotes, insert a blank line between them.</blockquote>"
	],
	[
		["Inline HTML", "HTML in Markdown"],
		"<span class=\"help-code\">It &lt;strong>works&lt;/strong>.</span>",
		"It <strong>works<strong>"
	],
	[
		["Horizontal rules"],
		"<span class=\"help-code\">*** <br> You can use Hyphens, asterisks or underscores. <br> ---</span>",
		"<hr> You can use Hyphens, asterisks or underscores.<hr>"
	],
	[
		["Line breaks"],
		"To separate two paragraphs, press <span class=\"help-code\">Enter</span> twice.<br><br>And you have a new paragraph.",
		"<p>To separate two paragraphs, press Enter twice.</p><p>And you have a new paragraph!</p>"
	],
	[
		["Tables", "Arrays"],
		"| Tables&nbsp; | Are&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Cool&nbsp;&nbsp;|<br>| -------- |:----------------:| ------:|<br>| col 3 is | right-aligned | $13 &nbsp;&nbsp; |<br>| col 2 is | centered&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | $37 &nbsp;&nbsp; |",
		"<table> <thead><tr> <th>Tables</th> <th align=\"center\">Are</th> <th align=\"right\">Cool</th> </tr></thead> <tbody> <tr> <td>col 3 is</td> <td align=\"center\">right-aligned</td> <td align=\"right\">$13</td> </tr> <tr> <td>col 2 is</td> <td align=\"center\">centered</td> <td align=\"right\">$37</td> </tr> </tbody> </table>"
	],
	[
		["Question"],
		"Seriously?",
		"Life's most persistent and urgent question is, 'What are you doing for others?'."
	]
];

/*
* Functions (in alphabetical order).
*
* Resume:
	* answer (): find the answers and the examples for the question.
	* displayAnswers (): display the answers.
	* resetAnswerDiv (): clear the Help divs.
	* setResultsHeight (number of results): set the help container's height, depending on the number of results.
	* switchResult (result number): show the answer or the example when the user click on a switch.
*/

function answer () {
	maxAnswers = 0; // Reset the number of answers that can be diplayed (max: 3)
	for (var i = 0; i < helpArray.length && maxAnswers < 3; i++) // A line = a syntax, this loop runs through each line.
		for (var j = 0; j < helpArray[i][0].length; j++) // A line can have many columns (different ways to say the same thing), this loop run through each column.
			if (helpArray[i][0][j].toLowerCase().indexOf(help.value.toLowerCase()) > -1) { // Everything in lower case to help the condition.
				wordPos = helpArray[i][0][j].toLowerCase().indexOf(help.value.toLowerCase());
				document.getElementById("answer-" + (maxAnswers + 1)).innerHTML = "<h1 class=\"help-title\">" + helpArray[i][0][j].substring(0, wordPos) + "<span class=\"match\">" + helpArray[i][0][j].substr(wordPos, help.value.length) + "</span>" + helpArray[i][0][j].substring(wordPos + help.value.length) + "</h1>" + helpArray[i][1]; // Put the answer in the appropriate div.
				document.getElementById("example-" + (maxAnswers + 1)).innerHTML = helpArray[i][2]; // Put the answer in the appropriate div.
				maxAnswers++; // You can't have more than 3 answers.
				j = helpArray[i][0].length; // Change the line (to don't have 2 times the same answer).
			}
	switch (maxAnswers) {
		case 0: // Nothing found.
			document.getElementById("answer-1").innerHTML = "No help found.";
			resultsContainer.className = "one-result no-result";
			resetAnswerDiv(2); // This is 2 and not 1 to display the result "No help found."
			break;
		case 1: // One answer found.
			resultsContainer.className = "one-result";
			resetAnswerDiv(2);
			break;
		case 2: // Two answers found.
			resultsContainer.className = "two-results";
			resetAnswerDiv(3);
			break;
		case 3: // Three answers found, maximum number possible at the same time.
			resultsContainer.className = "three-results";
			break;
	}
}

function displayAnswers () {
	for (var i = 1; i <= 3; i++) // Reset the results' position.
		if (document.getElementById("result-" + i).className == "result switched")
			document.getElementById("result-" + i).className = "result";

	if (help.value.length == 0) {
		resultsContainer.className = "hidden"; // Hide the results container, there is nothing in it if there is nothing written in the help input.
		resetAnswerDiv(3);
		setResultsHeight();	
	}
	else {
		if (help.value.length < 3) {
			resultsContainer.className = "one-result no-result";
			resetAnswerDiv(2);
			if (help.value.length == 1)
				document.getElementById("answer-1").innerHTML = "Add two more characters"; // The input has to have 3 characters minimum to launch the function.
			else if (help.value.length == 2)
				document.getElementById("answer-1").innerHTML = "Add one more character"; // The input has to have 3 characters minimum to launch the function.

			setResultsHeight();
		}
		else
			answer(); // Find the answers.
	}
}

function resetAnswerDiv(begin) {
	for (var i = begin; i <= 3; i++) { 
		if (document.getElementById("answer-" + i).innerHTML == "")
			i = 3;
		else {
			document.getElementById("answer-" + i).innerHTML = "";
			document.getElementById("result-" + i).className = "result";
			document.getElementById("example-" + i).innerHTML = "";
		}
	}
}

function setResultsHeight() {
	var totalHeight = 0;
	for (var i = 1; i <= 3; i++) {// Check all the results, depending on the number of results
		if ($("#answer-" + i).html() != "") {
			$("#result-" + i).css("display", "block");
			if ($("#answer-" + i).outerHeight() >= $("#example-" + i).outerHeight()) 
				$("#result-" + i).css("height", $("#answer-" + i).outerHeight() + "px");
			else
				$("#result-" + i).css("height", $("#example-" + i).outerHeight() + "px");
			totalHeight += $("#result-" + i).outerHeight(); // Add the height of the current result to the total height
		}
		else {
			$("#result-" + i).css("height", 0);
			$("#result-" + i).css("display", "none");
		}
		
	}
	$(resultsContainer).css("height", totalHeight + "px");

}

function switchResult (numResult) {
	if (document.getElementById("result-" + numResult).className == "result") // If Markdown style displayed
		document.getElementById("result-" + numResult).className = "result switched";
	else // If corresponding example displayed
		document.getElementById("result-" + numResult).className = "result";
	help.focus();
}