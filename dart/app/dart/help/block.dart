library help_block;

import "dart:html";

class HelpBlock {
	DivElement answer;
	DivElement example;
	DivElement result;
	DivElement resultSwitch;
	
	HelpBlock (int number) {
		answer = querySelector("#answer-" + number.toString());
		example = querySelector("#example-" + number.toString());
		result = querySelector("#result-" + number.toString());
		resultSwitch = querySelector("#result-switch-" + number.toString());

		resultSwitch.onClick.listen((e) { switchResult(); });
	}
	
	/*
		* Functions (in alphabetical order).
		*
		* changeAnswer (): affect the new answer to the help block.
		* switchResult (): display the answer/example when the user clicks on the arrow.
	*/
	
	changeAnswer (String word, int wordPos, int inputLength, String newAnswer) { // Put the answer in the appropriate div.
		answer.setInnerHtml("<span class=\"help-title\">" + word.substring(0, wordPos) + 
			"<span class=\"match\">" + word.substring(wordPos, wordPos + inputLength) + 
			"</span>" + word.substring(wordPos + inputLength) + 
			"</span>: " + newAnswer);
	}
	
	void switchResult () {
		if (result.className == "result") // If Markdown style displayed
			result.className = "result switched";
		else // If corresponding example displayed
			result.className = "result";
	}
}