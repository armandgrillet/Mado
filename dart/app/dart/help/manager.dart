library help_manager;

import "dart:html";

import 'array.dart';
import 'block.dart';

class HelpManager {
	// The HTML shortcuts. 	
	DivElement helpButton = querySelector("#help-button");
	DivElement helpDisplayer = querySelector("#help-input-displayer");
	InputElement helpInput = querySelector("#help-input");
	DivElement resultsContainer = querySelector("#help-results-container");
	
	// Variables.
	var helpBlock = [new HelpBlock(1), new HelpBlock(2), new HelpBlock(3)];
	int maxAnswers;
	int wordPos;
	HelpArray helpArray = new HelpArray();
	
	// Constructor.
	HelpManager () {
		helpInput.onInput.listen((e) { displayAnswers(); });
	}
	
	/*
		* Functions (in alphabetical order).
		*
		* answer (): find the answers and the examples for the question.
		* displayAnswers (): display the answers.
		* hide (): hide the displayer.
		* resetAnswerDiv (): clear the Help divs.
		* show (): show the displayer.
		* stringArrayBug (): return a correct string from a string corrupted by an array.
	*/
	
	void answer () {
		maxAnswers = 1; // Reset the number of answers that can be diplayed (max: 4)
		for (int i = 0; i < helpArray.words.length && maxAnswers < 4; i++) // A line = a syntax, this loop runs through each line.
			for (int j = 0; j < helpArray.words[i].length; j++) // A line can have many columns (different ways to say the same thing), this loop run through each column.
				if (helpArray.words[i][j].toLowerCase().indexOf(helpInput.value.toLowerCase()) != -1) { // Everything in lower case to help the condition.
					wordPos = helpArray.words[i][j].toLowerCase().indexOf(helpInput.value.toLowerCase());
					helpBlock[maxAnswers - 1].changeAnswer(helpArray.words[i][j].toString(), wordPos, helpInput.value.length, stringArrayBug(helpArray.answers[i].toString()));
					helpBlock[maxAnswers - 1].example.setInnerHtml(stringArrayBug(helpArray.examples[i].toString())); // Put the answer in the appropriate div.
					maxAnswers++; // You can't have more than 3 answers.
					j = helpArray.words[i].length; // Change the line (to don't have 2 times the same answer).
				}
		switch (maxAnswers) {
			case 1: // Nothing found.
				helpBlock[0].answer.setInnerHtml("No help found.");
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
	
	void displayAnswers () {
		if (helpInput.value.length == 0) 
			resultsContainer.className = "hidden"; // Hide the results container, there is nothing in it if there is nothing written in the help input.
		else {
			if (helpInput.value.length < 3) {
				resultsContainer.className = "one-result no-result";
				resetAnswerDiv(2);
				if (helpInput.value.length == 1)
					helpBlock[0].answer.setInnerHtml("Add two more characters") ; // The input has to have 3 characters minimum to launch the function.
				else if (helpInput.value.length == 2)
					helpBlock[0].answer.setInnerHtml("Add one more character"); // The input has to have 3 characters minimum to launch the function.
			}
			else
				answer(); // Find the answers.
		}
	}
	
	void hide () {
		helpInput.value = ""; // Reset the input of the help.
		resetAnswerDiv(1);
		resultsContainer.className = "hidden"; // Hide the results container.
		helpDisplayer.className = "tool-displayer hidden";
	}
	
	void resetAnswerDiv (int begin) {
		for (int i = begin; i < 4; i++) { 
			if (helpBlock[i - 1].answer == "")
				i = 3;
			else {
				helpBlock[i - 1].answer.setInnerHtml("");
				helpBlock[i - 1].result.className = "result";
				helpBlock[i - 1].example.setInnerHtml("");
			}
		}
	}
	
	void show () {
		helpDisplayer.className = "tool-displayer";
		helpInput.focus();
	}
	
	String stringArrayBug (String weirdoString) {
		return(weirdoString.substring(1, weirdoString.length - 1));
	}
}