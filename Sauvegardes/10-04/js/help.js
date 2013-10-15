/* The JS to help the user when he types something on the help input. */

var help; // The input where the user writes what he wants.
var helpButton; // The help button.
var helpDisplayer; // The div who contains all the help divs.
var answersContainer; // The div who contains the answers displayed.
var wordPos;
var answer1; // 1st answer div.
var answer2; // 2nd answer div.
var answer3; // 3rd answer div.
var example1;
var example2;
var example3;
var result1;
var result2;
var result3;
var resultSwitch1;
var resultSwitch2;
var resultSwitch3;

var words = [ // All the words that can be used on the help input, each line corresponding to the same line in 'answers'. Source: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
	// Headers
	["Headers", "Titles"],

	// Emphasys
	["Bold", "Strong emphasis"],
	["Italic", "Emphasis"],
	["Bold italic", "Combined emphasis"],

	// Lists 
	["Ordered lists"],
	["Unordered lists"],

	// Links 
	["Inline-style links"],
	["Reference-style links"],

	// Images 
	["Images", "Pictures"],

	// Code and Syntax Highlighting
	["Blocks of code"],
	["Blocks of code with syntax highlighting"],

	// Tables
	["Tables"],

	// Blockquotes
	["Blockquotes"],

	// Inline HTML
	["Inline HTML", "HTML in Markdown"],

	// Horizontal Rules
	["Horizontal rules"],

	// Line Breaks
	["Line breaks"]
];

var answers = [ // The answers displayed.
	// Headers
	["Six sizes available, the size depends on the numbers of #. <br> #Big title (size 1, the biggest). <br> ####A less impresive title (size 4 on 6)."],

	// Emphasys
	["**bold** or __bold__"],
	["*italic* or _italic_"],
	["**_ bold italic_** or *__bold italic__* or ***this*** or ___this___"],

	// Lists 
	["1. First ordered list item. <br> 1. Another item, the number doesn't matter. <br> 1. Ordered sub-list."],
	["* An item, you can use *, + or - for your lists. <br> + A second item. <br> - Unordered sub-list."],

	// Links 
	["[Inline-style link.](https://mado.com) <br> [The link can be a relative reference to a repository file](../blob/master/LICENSE)"], // TODO : Change the link
	["[You an use numbers for reference-style link defs][1] [Or use the link text itself][] <br> [1]: http://mado.com <br> [Or use the link text itself]: http://mado.com"],

	// Images
	['Inline-style: ![alt text](http://armand.gr/mado.png "Mado") <br> Reference-style: ![alt text][logo] <br> [logo]: http://armand.gr/mado.png "Mado"'],

	// Code and Syntax Highlighting
	["```Write your code between three back-ticks to make a block of code.``` <br> &nbsp; &nbsp; &nbsp; &nbsp; You can also write code by indent your text with four spaces."],
	["```javascript Add a language to active the syntax highlighting of the block of code.```"],

	// Tables
	["| You can       |write         | tables  | <br> | ------------- |:-------------:| -----:| <br> | col 3 is      | right-aligned | (normal) | <br> | col 2 is      | centered      |   (awesome!) |"],

	// Blockquotes
	["> Blockquotes only need > to work. <br><br> > Two blockquotes without a break (a line who isn't a blockquote)  are a single quote."],

	// Inline HTML
	["It &lt;strong>works&lt;strong>."],

	// Horizontal Rules
	["*** <br> You can use Hyphens, asterisks or underscores. <br> ---"],

	// Line Breaks
	["To separate two paragraphs, press Enter twice.<br><br>And you have a new paragraph!"]
];

var examples = [
	// Headers
	["Six sizes available, the size depends on the numbers of #.<h1 id=\"big-title-size-1-the-biggest-\">Big title (size 1, the biggest).</h1><h4 id=\"a-less-impresive-title-size-4-on-6-br-\">A less impresive title (size 4 on 6).</h4>"],

	// Emphasys
	["<strong>Bold</strong> or <strong>bold</strong>"],
	["<em>Italic</em> or <em>italic</em>"],
	["<strong><em>Bold italic</em></strong> or <em><strong>bold italic</strong></em> or <strong><em>this</em></strong> or <strong><em>this</em></strong>"],

	// Lists TODO
	["1. First ordered list item. <br>1. Another item, the number doesn't matter. <br> 1. Ordered sub-list."],
	["* An item, you can use *, + or - for your lists. <br> + A second item. <br> - Unordered sub-list."],

	// Links 
	["<a href=\"https://mado.com\">Inline-style link.</a><a href=\"../blob/master/LICENSE\">The link can be a relative reference to a repository file</a>"], // TODO : Change the link
	["[You an use numbers for reference-style link defs][1] [Or use the link text itself][] <br> [1]: http://mado.com <br> [Or use the link text itself]: http://mado.com"],

	// Images
	['Inline-style: ![alt text](http://armand.gr/mado.png "Mado") <br> Reference-style: ![alt text][logo] <br> [logo]: http://armand.gr/mado.png "Mado"'],

	// Code and Syntax Highlighting
	["<code>Write your code between three back-ticks to make a block of code.</code><br><code>You can also write code by indent your text with four spaces.</code>"],
	["<code>Add a language to active the syntax highlighting of the block of code.</code>"],

	// Tables
	["<table><thead><tr><th>You can</th><th align=\"center\">write</th><th align=\"right\">tables</th></tr></thead><tbody><tr><td>col 3 is</td><td align=\"center\">right-aligned</td><td align=\"right\">(normal)</td></tr><tr><td>col 2 is</td><td align=\"center\">centered</td><td align=\"right\">(awesome!)</td></tr></tbody></table>"],

	// Blockquotes
	["<blockquote>Blockquotes only need &gt; to work.Two blockquotes without a break (a line who isn't a blockquote)  are a single quote.</blockquote>"],

	// Inline HTML
	["It <strong>works<strong>."],

	// Horizontal Rules
	["<hr> You can use Hyphens, asterisks or underscores. <hr>"],

	// Line Breaks
	["<p>To separate two paragraphs, press Enter twice.</p><p>And you have a new paragraph!</p>"]
];

var maxAnswers; // Check the number of answers displayed, max = 3.

var resultsContainer; // Will contain the HTML results container.

function activateHelp () { // Show the help input and focus when the help button is clicked.
	if (helpDisplayer.className == "hidden") {
		console.log("a");
		helpDisplayer.className = " ";
    	help.focus();
	}	
}

function displayAnswers () {
	if (help.value.length == 0)
		resultsContainer.className = "hidden"; // Hide the results container, there is nothing in it if there is nothing written in the help input.
	else {
		if (help.value.length < 3) {
			resultsContainer.className = "one-result no-result";
			resetAnswerDiv(2);
			if (help.value.length == 1)
				answer1.innerHTML = "Add two more characters"; // The input has to have 3 characters minimum to launch the function.
			else if (help.value.length == 2)
				answer1.innerHTML = "Add one more character"; // The input has to have 3 characters minimum to launch the function.
		}
		else
			answer(); // Find the answers.
	}
}

function answer () {
	maxAnswers = 1; // Reset the number of answers that can be diplayed (max: 4)
	for (var i = 0; i < words.length && maxAnswers < 4; i++) // A line = a syntax, this loop runs through each line.
		for (var j = 0; j < words[i].length; j++) // A line can have many columns (different ways to say the same thing), this loop run through each column.
			if (words[i][j].toLowerCase().indexOf(help.value.toLowerCase()) != -1) { // Everything in lower case to help the condition.
				wordPos = words[i][j].toLowerCase().indexOf(help.value.toLowerCase());
				window["answer" + maxAnswers].innerHTML = words[i][j].substring(0, wordPos) + "<span class=\"match\">" + words[i][j].substr(wordPos, help.value.length) + "</span>" + words[i][j].substring(wordPos + help.value.length) + ' : ' + answers[i]; // Put the answer in the appropriate div.
				window["example" + maxAnswers].innerHTML = examples[i]; // Put the answer in the appropriate div.
				maxAnswers++; // You can't have more than 3 answers.
				j = words[i].length; // Change the line (to don't have 2 times the same answer).
			}
	switch (maxAnswers) {
		case 1: // Nothing found.
			answer1.innerHTML = "No help found.";
			resultsContainer.className = "one-result no-result";
			resetAnswerDiv(2);
			break;
		case 2: // One answer found.
			resultsContainer.className = "one-result";
			resetAnswerDiv(2);
			break;
		case 3: // Two answers found.
			resultsContainer.className = "two-results";
			resetAnswerDiv(3);
			break;
		case 4: // Three answers found, maximum number possible at the same time.
			resultsContainer.className = "three-results";
			break;
	}
}

/* Switch between the help answer and the corresponding example. */
function switchResult (numResult) {
	if (window["result" + numResult].className == "result") // If Markdown style displayed
		window["result" + numResult].className = "result switched";
	else // If corresponding example displayed
		window["result" + numResult].className = "result";
}

function resetAnswerDiv(begin) {
	for (var i = begin; i < 4; i++) { 
		if (window["answer" + i].innerHTML == "")
			i = 3;
		else {
			window["answer" + i].innerHTML = "";
			window["result" + i].className = "result";
			window["example" + i].innerHTML = "";
		}
	}
}

$(document).click(function(e) {
	if ($(e.target).closest(helpButton).length && helpDisplayer.className == "tool-displayer hidden") { // Click on the help button with the help input hide.
		helpDisplayer.className = "tool-displayer";
    	help.focus();
	}
	else if (! $(e.target).closest(help).length && ! $(e.target).closest(resultsContainer).length) { // The user doesn't click on the help input nor help results (with help displayed)
		help.value = ""; // Reset the input of the help
		resetAnswerDiv(1);
		resultsContainer.className = "hidden"; // Hide the results container
		helpDisplayer.className = "tool-displayer hidden";
	}
});