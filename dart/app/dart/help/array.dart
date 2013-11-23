library help_array;

class HelpArray {
	var words = [ // All the words that can be used on the help input, each line corresponding to the same line in 'answers'.
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
		["Images (inline)", "Pictures (inline)"],
		["Images (reference-style)", "Pictures (reference-style)"],
		
		// Code and Syntax Highlighting
		["Blocks of code"],
		
		// Tables
		
		// Blockquotes
		["Blockquotes"],
		
		// Inline HTML
		["Inline HTML", "HTML in Markdown"],
		
		// Horizontal Rules
		["Horizontal rules"],
		
		// Line Breaks
		["Line breaks"],
		
		// Joke
		["Question"]
	];
	var answers = [ // The answers displayed.
		// Headers
		["Six sizes available, the size depends on the numbers of #. <br> #Big title (size 1, the biggest). <br> ####A less impresive title (size 4 on 6)."],
		
		// Emphasys
		["<span class=\"help-code\">**bold**</span> or <span class=\"help-code\">__bold__</span>"],
		["<span class=\"help-code\">*italic*</span> or <span class=\"help-code\">_italic_</span>"],
		["<span class=\"help-code\">**_ bold italic_**</span> or <span class=\"help-code\">*__bold italic__*</span> or <span class=\"help-code\">***this***</span> or <span class=\"help-code\">___this___</span>"],
		
		// Lists 
		["1. First ordered list item. <br>2. Another item."],
		["* An item. <br>* A second item (you can also use + or -)."],
		
		// Links 
		["<span class=\"help-code\">[Hypertext](http://url.com)</span><br>(Also works with a local path.)"], // TODO : Change the link
		["<span class=\"help-code\">[Hypertext][1]<br>[1]: http://url.com</span>"],
		
		// Images
		['<span class=\"help-code\">![alt text](path/to/image.jpg "Title")</span>'], 
		['<span class=\"help-code\">![alt text][image Id] <br> [image Id]: path/to/image.jpg "Title"</span>'],
		
		// Code and Syntax Highlighting
		["<span class=\"help-code\">```Text between three back-ticks is a block of code.```<br>&nbsp;&nbsp;&nbsp;&nbsp;Text after four spaces is also a block of code.</span>"],
		
		// Tables
		
		// Blockquotes
		["> Blockquotes only need <span class=\"help-code\">></span> to work. <br><br> <span class=\"help-code\">> Two blockquotes without a break (a line who isn't a blockquote)  are a single quote.</span>"],
		
		// Inline HTML
		["<span class=\"help-code\">It &lt;strong>works&lt;/strong>.</span>"],
		
		// Horizontal Rules
		["<span class=\"help-code\">*** <br> You can use Hyphens, asterisks or underscores. <br> ---</span>"],
		
		// Line Breaks
		["To separate two paragraphs, press <span class=\"help-code\">Enter</span> twice.<br><br>And you have a new paragraph."],
		
		// Joke
		["Seriously?"]
	];
	var examples = [ // The examples displayed.
		// Headers
		["Six sizes available, the size depends on the numbers of #.<h1 id=\"big-title-size-1-the-biggest-\">Big title (size 1, the biggest).</h1><h4 id=\"a-less-impresive-title-size-4-on-6-br-\">A less impresive title (size 4 on 6).</h4>"],
		
		// Emphasys
		["<strong>Bold</strong>"],
		["<em>Italic</em>"],
		["<strong><em>Bold italic</em></strong>"],
		
		// Lists TODO
		["<ol><li>First ordered list item</li><li>Another item.</li></ol>"],
		["<ul><li>An item. </li><li>A second item (you can also use + or -).</li></ul>"],
		
		// Links 
		["<a target=\"_blank\" href=\"http://aplusa.io/mado\">Hypertext</a>"], // TODO : Change the link
		["<a target=\"_blank\" href=\"http://aplusa.io/mado\">Hypertext</a>"],
		
		// Images
		["<div class=\"example-image\"></div>"],
		["<div class=\"example-image\"></div>"],
		
		// Code and Syntax Highlighting
		["<code>Write your code between three back-ticks to make a block of code.</code><br><code>You can also write code by indent your text with four spaces.</code>"],
		
		// Tables
		
		// Blockquotes
		["<blockquote>Blockquotes only need &gt; to work. To separate two blockquotes, insert a blank line between them.</blockquote>"],
		
		// Inline HTML
		["It <strong>works<strong>"],
		
		// Horizontal Rules
		["<hr> You can use Hyphens, asterisks or underscores.<hr>"],
		
		// Line Breaks
		["<p>To separate two paragraphs, press Enter twice.</p><p>And you have a new paragraph!</p>"],
		
		// Joke
		["Life's most persistent and urgent question is, 'What are you doing for others?'."]
	];
}