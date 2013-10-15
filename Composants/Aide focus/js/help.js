/* The JS to help the user when he types something on the help input. */
var help; // The input where the user writes what he wants.
var answer1; // 1st answer div.
var answer2; // 2nd answer div.
var answer3; // 3rd answer div.

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
	["Line braks"]
];
var answers = [ // The answers displayed.
	// Headers
	["Six sizes available, the size depends on the numbers of #. <br> #Big title (size 1, the biggest). <br> ####A less impresive title (size 4 on 6). <br> "],

	// Emphasys
	["**bold** or __bold__"],
	["*italic* or _italic_"],
	["**_ bold italic_** or *__bold italic__* or ***this*** or ___this___"],

	// Lists 
	["1. First ordered list item. <br> 1. Another item, the number doesn't matter. <br> 1. Ordered sub-list."],
	["* An item, you can use *, + or - for your lists. <br> + A second item. <br> - Unordered sub-list."],

	// Links 
	["[Inline-style link](https://mado.com) <br> [The link can be a relative reference to a repository file](../blob/master/LICENSE)"], // TODO : Change the link
	["[You an use numbers for reference-style link defs][1] [Or use the link text itself][] <br> [1]: http://mado.com <br> [Or use the link text itself]: http://mado.com"],

	// Images
	['Inline-style: ![alt text](http://armand.gr/mado.png "Mado") <br> Reference-style: ![alt text][logo] <br> [logo]: http://armand.gr/mado.png "Mado"'],

	// Code and Syntax Highlighting
	["``` <br> Write your code between three back-ticks to make a block of code. <br> ``` <br> &nbsp; &nbsp; &nbsp; &nbsp; You can also write code by indent your text with four spaces."],
	["```javascript <br> Add a language to active the syntax highlighting of the block of code. <br> ```"],

	// Tables
	["| You can       |write         | tables  | <br> | ------------- |:-------------:| -----:| <br> | col 3 is      | right-aligned | (normal) | <br> | col 2 is      | centered      |   (awesome!) |"],

	// Blockquotes
	["> Blockquotes only need > to work. <br> > To blockquotes without a break (a line who isn't a blockquote)  are a single quote."],

	// Inline HTML
	["It &lt;strong>works&lt;strong>."],

	// Horizontal Rules
	["*** <br> You can use Hyphens, asterisks or underscores. <br> ---"],

	// Line Breaks
	["To separate two paragraphs, press Enter twice. <br>  <br> And you have a new paragraph!"]
];

var maxAnswers; // Check the numbers of answers displayed, max = 3.

window.onload = function () {
	// Set the variables
	help = document.getElementById("help-input");
	answer1 = document.getElementById("answer-1");
	answer2 = document.getElementById("answer-2");
	answer3 = document.getElementById("answer-3");

	for (var i = 1; i < 4; i++) // The help has to be invisible on the launch.
		document.getElementById("answer-" + i).style.display = "none";

	help.addEventListener("keyup", displayAnswers); // Launch the help when something is typed on the input.
}

function displayAnswers () {
	// Reset
	answer3.style.display = "none";
	answer2.style.display = "none";
	if (help.value.length == 0)
		answer1.style.display = "none";
	else {
		answer1.style.display = "block";
		if (help.value.length < 3)
			answer1.innerHTML = "Add " + (3 - help.value.length) + " more characters"; // The input has to have 3 characters minimum to launch the function.
		else 
			answer(); // Find the answers.
	}
}

function answer () {
	maxAnswers = 1; // Reset the number of answers who can be diplayed (max: 4)
	for (var i = 0; i < words.length && maxAnswers < 4; i++) // A line = a syntax, this loop run through each line.
		for(var j = 0; j < words[i].length; j++) // A line can have many columns (differents ways to say the same thing), this loop run through each column.
			if(words[i][j].toLowerCase().indexOf(help.value.toLowerCase()) != -1) { // Everything in lower case to help the condition.
				eval("answer" + maxAnswers + ".style.display = 'block'"); // Make the div of answer visible.
				eval("answer" + maxAnswers + ".innerHTML = words[i][j] + ' : ' + answers[i]"); // Put the answer in the appropriate div.
				maxAnswers++; // You can't have more than 3 answers.								
				j = words[i].length; // Change the line (to don't have 2 times the same answer).
			}
	if (maxAnswers == 1) // Nothing found.
		answer1.innerHTML = "No help found";
}