var aa, ba, ca, da, ea, fa, ga, c, ha, f;

function g() {
    ia();
    ja.scrollHeight > $(ja).height() ? ka.style.display = "none" : ka.style.display = "block"
}

function h() {
    void 0 != la && (ma(la), la = void 0)
}

function na() {
    marked(k.innerText, function (a, b) {
        chrome.fileSystem.chooseEntry({
            type: "saveFile",
            suggestedName: oa() + ".html"
        }, function (a) {
            a && a.createWriter(function (a) {
                a.write(new Blob([b], {
                    type: "text/HTML"
                }))
            }, h)
        })
    })
}

function l(a) {
    return a.substring(a.lastIndexOf("/") + 1)
}

function oa() {
    var a = m.innerHTML;
    return "" == a ? "document" : a.substring(a.lastIndexOf("/") + 1, a.lastIndexOf("."))
}

function pa(a) {
    chrome.app.window.create(a, {
        bounds: {
            left: Math.round(window.screenX + ($(window).width() - 498) / 2),
            top: Math.round(window.screenY + ($(window).height() - 664) / 2),
            width: 498,
            height: 664
        },
        frame: "none",
        minWidth: 498,
        minHeight: 664,
        maxWidth: 498,
        maxHeight: 664
    });
    qa.click()
}

function ra() {
    chrome.storage.local.get("displaySize", function (a) {
        void 0 != a.displaySize ? "small" == a.displaySize ? $("body").attr("class", "small") : "medium" == a.displaySize ? $("body").attr("class", " ") : $("body").attr("class", "big") : (chrome.storage.local.set({
            displaySize: "medium"
        }), $("body").attr("class", " "))
    })
}

function sa() {
    0 < k.innerText.length && (916 != k.innerText.length || k.innerHTML != ta) ? chrome.app.window.create("mado.html", {
        bounds: {
            left: window.screenX + 20,
            top: window.screenY + 20,
            width: window.innerWidth,
            height: window.innerHeight
        },
        frame: "none",
        minWidth: 683,
        minHeight: 240
    }) : k.innerHTML == ta && (k.innerHTML = "", g(), $(k).focus())
}

function ua(a) {
    a.file(function (b) {
        var e = new FileReader;
        e.onload = function (b) {
            "" != k.innerText ? chrome.storage.local.set({
                tempFileEntry: chrome.fileSystem.retainEntry(a)
            }, sa) : (k.innerText = b.target.result, c = a, n = k.innerText, g(), m.innerHTML = l(a.fullPath) + "&nbsp;-", ga.innerHTML = l(a.fullPath) + " - Mado");
            va(a)
        };
        e.readAsText(b)
    }, h)
}

function wa() {
    chrome.fileSystem.chooseEntry({
        type: "openFile",
        accepts: [{
            extensions: ["markdown", "md", "txt"]
        }]
    }, function (a) {
        a && ua(a)
    })
}

function xa() {
    chrome.fileSystem.chooseEntry({
        type: "saveFile",
        suggestedName: "document.md"
    }, function (a) {
        a && a.createWriter(function (b) {
            f = !1;
            b.onwriteend = function () {
                f ? (c = a, va(c), n = k.innerText, ya(), m.innerHTML = l(a.fullPath) + "&nbsp;-", ga.innerHTML = l(fileToOpen.fullPath) + " - Mado") : (f = !0, this.truncate(this.position))
            };
            b.write(new Blob([k.innerText], {
                type: "plain/text"
            }))
        }, h)
    })
}

function za() {
    void 0 == c || "md&nbsp;-" != m.innerHTML.substring(m.innerHTML.length - 9) ? xa() : c.createWriter(function (a) {
        f = !1;
        a.onwriteend = function () {
            f ? (va(c), n = k.innerText, ya()) : (f = !0, this.truncate(this.position))
        };
        a.write(new Blob([k.innerText], {
            type: "plain/text"
        }))
    }, h)
}
chrome.app.window.current().onBoundsChanged.addListener(function () {
    1160 > window.innerWidth && "switch-button activated" == p.className ? q.click() : 1160 <= window.innerWidth && 1160 > ha && Aa && p.click();
    ha = window.innerWidth
});
chrome.storage.onChanged.addListener(function (a) {
    for (key in a) "analytics" == key ? Ba() : "displaySize" == key ? ra() : "gfm" == key ? Ca() : "resize" == key && Da()
});
$(document).click(function (a) {
    $(a.target).closest(Ea).length && "tool-displayer hidden" == Fa.className ? (Fa.className = "tool-displayer", r.focus()) : "tool-displayer hidden" == Fa.className || $(a.target).closest(r).length || $(a.target).closest(s).length || (r.value = "", Ga(1), s.className = "hidden", Fa.className = "tool-displayer hidden");
    $(a.target).closest(Ha).length && "tool-displayer hidden" == t.className ? (u.innerHTML = "Choose an image", v.value = "", w.value = "", x = void 0, 0 == $(k).find("#mado-image").length && (k.focus(), y("mado-image")),
        t.className = "tool-displayer", z = document.getElementById("mado-image"), Ia = z.innerText, /!\[.*\]\(.*\)/.test(z.innerText) && (/!\[.*\]\(.*\s".*"\)/.test(z.innerText) ? (w.value = z.innerText.match(/".*"\)/)[0].substring(1, z.innerText.match(/".*"\)/)[0].length - 2), x = z.innerText.match(/.*\s"/)[0].substring(2, z.innerText.match(/.*\s"/)[0].length - 2).replace(/\\/g, "/")) : x = z.innerText.match(/\]\(\S+\)/)[0].substring(2, z.innerText.match(/\]\(\S+\)/)[0].length - 1).replace(/\\/g, "/"), Ja(l(x)), v.value = z.innerText.match(/!\[.+\]/)[0].substring(2,
            z.innerText.match(/!\[.+\]/)[0].length - 1))) : "tool-displayer" != t.className || $(a.target).closest(Ka).length || (t.className = "tool-displayer hidden", A(z), B("mado-image"));
    $(a.target).closest(La).length && "tool-displayer hidden" == C.className ? (D.value = "", E.value = "", 0 == $(k).find("#mado-link").length && (k.focus(), y("mado-link")), C.className = "tool-displayer", F = document.getElementById("mado-link"), Ia = F.innerText, /\[\w*\]\(.*\)/.test(F.innerText) ? (D.value = F.innerText.match(/\(.*\)/)[0].substring(1, F.innerText.match(/\(.*\)/)[0].length -
        1), E.value = F.innerText.match(/\[\w*\]/)[0].substring(1, F.innerText.match(/\[\w*\]/)[0].length - 1)) : E.value = F.innerText, D.focus()) : "tool-displayer" != C.className || $(a.target).closest(C).length || (C.className = "tool-displayer hidden", A(F), B("mado-link"));
    $(a.target).closest(qa).length && "hidden" == Ma.className ? Ma.className = " " : "hidden" == Ma.className || $(a.target).closest(Na).length || (Ma.className = "hidden");
    $(a.target).closest(da).length && "hidden" == G.className ? (Oa(), G.className = "") : "hidden" == G.className || $(a.target).closest(H).length ||
        (G.className = "hidden");
    $(a.target).closest(Pa).length && "tool-displayer hidden" == I.className ? I.className = "tool-displayer" : "tool-displayer hidden" == I.className || $(a.target).closest(I).length || (I.className = "tool-displayer hidden");
    "visible" != Qa.className || $(a.target).closest(Ra).length && !$(a.target).closest(Sa).length || (Qa.className = "hidden")
});
var ka, J, k, ja, Ta, K, Ua, ta = "# Dear user,<br><br>Thanks for installing **Mado**. For your first launch, here is some information:<br><br>* Mado handles .md, .markdown and .txt files, can save these files as .md (the official extension for MarkDown files) and offers an export in .html.<br>* You can click the number of words in the bottom-right corner to see the number of characters in your document (and *vice versa*). Click the eye icon next to it to change the style of the HTML view.<br>* Mado uses Google Analytics to know in real time how many users are currently running the app, for statistical analysis only. You can deactivate it anytime in the settings (top-right button, \u201cSettings\u201d section).<br>* See the keyboard shortcuts (top-right button, \u201cShortcuts\u201d section) to use Mado in depth.<br><br>We hope you will enjoy Mado,<br><br>**[A+A](https://twitter.com/AplusA_io)**<br><br>***<br><br>P.S. This message will not appear anymore. Click \u201cNew\u201d in the navbar to start using Mado.",
    Ia,
    L, Va, Wa, Xa, Ya, M, Za, $a, ab = document.createElement("div");
document.createElement("textarea");
var N, O;

function ia() {
    4 < k.innerHTML || 0 < k.innerText.length && "<br>" != k.innerHTML ? void 0 == Ua ? chrome.storage.local.get("gfm", function (a) {
        void 0 != a.gfm ? marked.setOptions({
            gfm: a.gfm
        }) : (chrome.storage.local.set({
            gfm: !1
        }), marked.setOptions({
            gfm: !1
        }));
        Ca();
        marked(k.innerText, function (a, e) {
            for (var d = P = 0; d < Q.length; d++) Q[d][2] = !1;
            N = e;
            R()
        })
    }) : (marked.setOptions({
        gfm: Ua
    }), marked(k.innerText, function (a, b) {
        for (var e = P = 0; e < Q.length; e++) Q[e][2] = !1;
        N = b;
        R()
    })) : (k.innerHTML = "", J.innerHTML = "See the result here", S.innerHTML = "&nbsp;0 characters&nbsp;", T.innerHTML =
        "&nbsp;0 words&nbsp;", ya())
}

function y(a) {
    if (Ya = rangy.getSelection().rangeCount ? rangy.getSelection().getRangeAt(0) : null) {
        ab.id = a;
        try {
            Ya.surroundContents(ab)
        } catch (b) {}
    }
}

function bb(a, b, e, d) {
    Va = b.indexOf("<div", e);
    K = b.indexOf("</div>", e);
    return -1 != K ? -1 != Va && Va < K ? bb(a + 1, b, Va + 5, d) : 1 == a ? (L = b.substring(0, b.indexOf('<div id="' + d + '">')), L += b.substring(b.indexOf('<div id="' + d + '">') + ('<div id="' + d + '">').length, K), L += b.substring(K + 6), [0, L]) : bb(a - 1, b, K + 6, d) : [-1]
}

function cb() {
    db = U = void 0;
    for (var a = 0; a < Q.length; a++)!1 == Q[a][2] && (Q = Q.splice(Q[a], 1));
    N = N.replace(/<img src=\"img\/nofile.png/g, '<span class="nofile-link"> <span class="nofile-visual">File not found</span>&nbsp;</span><img class="nofile" src="img/nofile.png');
    J.innerHTML = N;
    $("#html-conversion a").each(function () {
        "#" != $(this).attr("href").substring(0, 1) && "http" != $(this).attr("href").substring(0, 4) && $(this).attr("href", "http://" + $(this).attr("href"));
        $(this).attr("target", "_blank")
    });
    $(".nofile").on("click",
        function () {
            eb()
        });
    $(".nofile-link").on("click", function () {
        eb()
    });
    $(".nofile-visual").on("click", function () {
        eb()
    });
    Countable.once(J, function (a) {
        S.innerHTML = "&nbsp;" + a.characters + " characters&nbsp;";
        T.innerHTML = "&nbsp;" + a.words + " words&nbsp;";
        1 == a.characters && (S.innerHTML = "&nbsp;" + a.characters + " character&nbsp;");
        1 == a.words && (T.innerHTML = "&nbsp;" + a.words + " word&nbsp;")
    }, {
        s: !0
    });
    ya()
}

function fb() {
    y("mado-paste");
    Xa = document.getElementById("mado-paste");
    Ta.focus();
    setTimeout(function () {
        void 0 != Xa ? Xa.innerText = Ta.value : $(k).innerText = $(k).innerText + Ta.value;
        Ta.value = "";
        A(Xa);
        B("mado-paste");
        g()
    }, 20)
}

function B(a) {
    Za = rangy.saveSelection();
    O = k.innerHTML;
    O = O.replace(/< *div/g, "<div");
    O = O.replace(/<div *>/g, "<div>");
    O = O.replace(/< *\/ *div *>/g, "</div>"); - 1 != O.indexOf('<div id="' + a + '">') && (Wa = bb(0, O, O.indexOf('<div id="' + a + '">'), a), -1 != Wa[0] && (O = Wa[1]));
    k.innerHTML = O;
    rangy.restoreSelection(Za);
    rangy.removeMarkers(Za)
}

function A(a) {
    if (document.createRange && window.getSelection) {
        M = document.createRange();
        $a = window.getSelection();
        $a.removeAllRanges();
        try {
            M.q(a), $a.addRange(M)
        } catch (b) {
            M.selectNode(a), $a.addRange(M)
        }
    } else document.body.createTextRange && (M = document.body.createTextRange(), M.moveToElementText(a), M.select())
}

function Ca() {
    chrome.storage.local.get("gfm", function (a) {
        void 0 != a.gfm ? Ua = a.gfm : (chrome.storage.local.set({
            gfm: !1
        }), Ua = !1);
        g()
    })
}
var S, gb, m, T;

function hb() {
    "none" == S.style.display ? (S.style.display = "inline", T.style.display = "none") : (S.style.display = "none", T.style.display = "inline")
}
var r, Ea, Fa, ib, s, jb, V = [
        ["Headers", "Titles"],
        ["Bold", "Strong emphasis"],
        ["Italic", "Emphasis"],
        ["Bold italic", "Combined emphasis"],
        ["Ordered lists"],
        ["Unordered lists"],
        ["Inline-style links"],
        ["Reference-style links"],
        ["Images (inline)", "Pictures (inline)"],
        ["Images (reference-style)", "Pictures (reference-style)"],
        ["Blocks of code"],
        ["Blockquotes"],
        ["Inline HTML", "HTML in Markdown"],
        ["Horizontal rules"],
        ["Line breaks"],
        ["Question"]
    ],
    kb = [
        ["Six sizes available, the size depends on the numbers of #. <br> #Big title (size 1, the biggest). <br> ####A less impresive title (size 4 on 6)."],
        ['<span class="help-code">**bold**</span> or <span class="help-code">__bold__</span>'],
        ['<span class="help-code">*italic*</span> or <span class="help-code">_italic_</span>'],
        ['<span class="help-code">**_ bold italic_**</span> or <span class="help-code">*__bold italic__*</span> or <span class="help-code">***this***</span> or <span class="help-code">___this___</span>'],
        ["1. First ordered list item. <br>2. Another item."],
        ["* An item. <br>* A second item (you can also use + or -)."],
        ['<span class="help-code">[Hypertext](http://url.com)</span><br>(Also works with a local path.)'],
        ['<span class="help-code">[Hypertext][1]<br>[1]: http://url.com</span>'],
        ['<span class="help-code">![alt text](path/to/image.jpg "Title")</span>'],
        ['<span class="help-code">![alt text][image Id] <br> [image Id]: path/to/image.jpg "Title"</span>'],
        ['<span class="help-code">```Text between three back-ticks is a block of code.```<br>&nbsp;&nbsp;&nbsp;&nbsp;Text after four spaces is also a block of code.</span>'],
        ['> Blockquotes only need <span class="help-code">></span> to work. <br><br> <span class="help-code">> Two blockquotes without a break (a line who isn\'t a blockquote)  are a single quote.</span>'],
        ['<span class="help-code">It &lt;strong>works&lt;/strong>.</span>'],
        ['<span class="help-code">*** <br> You can use Hyphens, asterisks or underscores. <br> ---</span>'],
        ['To separate two paragraphs, press <span class="help-code">Enter</span> twice.<br><br>And you have a new paragraph.'],
        ["Seriously?"]
    ],
    lb = [
        ['Six sizes available, the size depends on the numbers of #.<h1 id="big-title-size-1-the-biggest-">Big title (size 1, the biggest).</h1><h4 id="a-less-impresive-title-size-4-on-6-br-">A less impresive title (size 4 on 6).</h4>'],
        ["<strong>Bold</strong>"],
        ["<em>Italic</em>"],
        ["<strong><em>Bold italic</em></strong>"],
        ["<ol><li>First ordered list item</li><li>Another item.</li></ol>"],
        ["<ul><li>An item. </li><li>A second item (you can also use + or -).</li></ul>"],
        ['<a target="_blank" href="http://aplusa.io/mado">Hypertext</a>'],
        ['<a target="_blank" href="http://aplusa.io/mado">Hypertext</a>'],
        ['<div class="example-image"></div>'],
        ['<div class="example-image"></div>'],
        ["<code>Write your code between three back-ticks to make a block of code.</code><br><code>You can also write code by indent your text with four spaces.</code>"],
        ["<blockquote>Blockquotes only need &gt; to work. To separate two blockquotes, insert a blank line between them.</blockquote>"],
        ["It <strong>works<strong>"],
        ["<hr> You can use Hyphens, asterisks or underscores.<hr>"],
        ["<p>To separate two paragraphs, press Enter twice.</p><p>And you have a new paragraph!</p>"],
        ["Life's most persistent and urgent question is, 'What are you doing for others?'."]
    ];

function mb() {
    for (var a = 1; 3 >= a; a++) "result switched" == window["result" + a].className && (window["result" + a].className = "result");
    if (0 == r.value.length) s.className = "hidden";
    else if (3 > r.value.length) {
    	s.className = "one-result no-result";
    	Ga(2);
    	if (r.value.length == 1) answer1.innerHTML = "Add two more characters";
        else if (r.value.length == 2) answer1.innerHTML = "Add one more character"
	}
    else {
        ib = 1;
        for (a = 0; a < V.length && 4 > ib; a++)
            for (var b = 0; b < V[a].length; b++) - 1 != V[a][b].toLowerCase().indexOf(r.value.toLowerCase()) && (jb = V[a][b].toLowerCase().indexOf(r.value.toLowerCase()), window["answer" + ib].innerHTML = '<span class="help-title">' + V[a][b].substring(0, jb) + '<span class="match">' +
                V[a][b].substr(jb, r.value.length) + "</span>" + V[a][b].substring(jb + r.value.length) + "</span>: " + kb[a], window["example" + ib].innerHTML = lb[a], ib++, b = V[a].length);
        switch (ib) {
        case 1:
            answer1.innerHTML = "No help found.";
            s.className = "one-result no-result";
            Ga(2);
            break;
        case 2:
            s.className = "one-result";
            Ga(2);
            break;
        case 3:
            s.className = "two-results";
            Ga(3);
            break;
        case 4:
            s.className = "three-results"
        }
    }
}

function Ga(a) {
    for (; 3 >= a; a++) "" == window["answer" + a].innerHTML ? a = 3 : (window["answer" + a].innerHTML = "", window["result" + a].className = "result", window["example" + a].innerHTML = "")
}

function nb(a) {
    window["result" + a].className = "result" == window["result" + a].className ? "result switched" : "result";
    r.focus()
}
var v, ob, pb, Ha, Ka, u, t, z, w, qb, rb = [],
    sb, x, U, P = 0,
    Q = [],
    db;

function tb() {
    "" == v.value ? (v.setAttribute("class", "flash"), v.focus(), v.removeAttribute("class")) : void 0 != x && (ub(), t.className = "tool-displayer hidden", A(z), B("mado-image"))
}

function vb() {
    void 0 != z && (z.innerText = Ia);
    t.className = "tool-displayer hidden";
    A(z);
    B("mado-image");
    g()
}

function eb() {
    chrome.mediaGalleries.getMediaFileSystems({
        interactive: "yes"
    }, wb)
}

function xb(a) {
    rb = a;
    yb(0)
}

function R() {
    if (-1 != N.indexOf('<img src="', P))
        if (P = N.indexOf('<img src="', P) + 10, db = !1, U = N.substring(P, N.indexOf('"', P)), "data" != U.substring(0, 4))
            if (0 < Q.length)
                for (var a = 0; a < Q.length; a++)
                    if (Q[a][0] == U)
                        if (N = N.replace(RegExp(U, "g"), Q[a][1]), Q[a][2] = !0, -1 != N.indexOf('<img src="', P)) {
                            R();
                            break
                        } else cb();
                        else a == Q.length - 1 && wb();
                        else wb();
                        else R();
                        else cb()
}

function yb(a) {
    !1 == db ? a < rb.length ? (qb = a, rb.forEach(function (b, e) {
        e == a && void 0 != U && !1 == db && b.root.createReader().readEntries(zb)
    })) : (N = N.replace(RegExp(U, "g"), "img/nofile.png"), -1 != N.indexOf('<img src="', P) ? R() : cb()) : (Q.length = 0, ub())
}

function Ab(a) {
    rb[qb].root.getFile(a, {
        create: !1
    }, function (a) {
        a.file(function (a) {
            var b = new FileReader;
            b.onloadend = function () {
                Q.push([U, this.result, !0]);
                N = N.replace(RegExp(U, "g"), this.result);
                db = !0; - 1 != N.indexOf('<img src="', P) ? R() : cb()
            };
            b.readAsDataURL(a)
        })
    })
}

function zb(a) {
    for (var b = 0; b < a.length && !1 == db; b++)
        if (a[b].isDirectory && -1 != U.indexOf(a[b].fullPath)) {
            a[b].createReader().readEntries(zb);
            break
        } else if (-1 != U.indexOf(a[b].fullPath)) {
        Ab(a[b].fullPath);
        break
    } else b == a.length - 1 && yb(qb + 1)
}

function Bb() {
    chrome.fileSystem.chooseEntry({
        type: "openFile",
        accepts: [{
            mimeTypes: ["image/*"]
        }]
    }, function (a) {
        a && chrome.fileSystem.getDisplayPath(a, function (a) {
            Ja(l(a.replace(/\\/g, "/")));
            x = a.replace(/\\/g, "/");
            ub();
            v.focus()
        })
    })
}

function ub() {
    sb = "" == w.value ? "![" + v.value + "](" + x + ")" : "![" + v.value + "](" + x + ' "' + w.value + '")';
    void 0 != z ? z.innerText = sb : $(k).innerText = $(k).innerText + sb;
    g()
}

function Ja(a) {
    u.innerHTML = a;
    15 < u.innerHTML.length && (u.innerHTML = u.innerHTML.substring(0, 6) + "(\u2026)" + u.innerHTML.substring(u.innerHTML.length - 6, u.innerHTML.length))
}

function wb() {
    chrome.mediaGalleries.getMediaFileSystems({
        interactive: "no"
    }, xb)
}
var Cb, E, Db, La, C, D, F;

function Eb() {
    "" == D.value ? (D.setAttribute("class", "flash"), D.focus(), D.removeAttribute("class")) : (Fb(), C.className = "tool-displayer hidden", A(F), B("mado-link"))
}

function Gb() {
    void 0 != F && (F.innerText = Ia);
    C.className = "tool-displayer hidden";
    A(F);
    B("mado-link");
    g()
}

function Fb() {
    Db = "" == E.value ? "[" + D.value + "](" + D.value + ")" : "[" + E.value + "](" + D.value + ")";
    void 0 != F ? F.innerText = Db : $(k).innerText = $(k).innerText + Db;
    g()
}
var qa, Ma, Na, Hb, Ib, Jb, Kb;
window.onload = function () {
    aa = document.getElementById("export");
    ba = document.getElementById("new");
    ca = document.getElementById("open");
    da = document.getElementById("recent");
    ea = document.getElementById("save");
    fa = document.getElementById("save-as");
    ga = document.getElementsByTagName("title")[0];
    ka = document.getElementById("center-line-container");
    J = document.getElementById("html-conversion");
    k = document.getElementById("markdown");
    ja = document.getElementById("markdown-container");
    Ta = document.getElementById("paste-zone");
    S = document.getElementById("character-nb");
    gb = document.getElementById("link-url");
    m = document.getElementById("doc-name");
    T = document.getElementById("word-nb");
    r = document.getElementById("help-input");
    Ea = document.getElementById("help-button");
    Fa = document.getElementById("help-input-displayer");
    for (var a = 1; 3 >= a; a++) window["answer" + a] = document.getElementById("answer-" + a), window["example" + a] = document.getElementById("example-" + a), window["result" + a] = document.getElementById("result-" + a), window["resultSwitch" +
        a] = document.getElementById("result-switch-" + a);
    s = document.getElementById("help-results-container");
    ob = document.getElementById("cancel-image");
    pb = document.getElementById("galleries-button");
    Ha = document.getElementById("image-button");
    t = document.getElementById("image-insertion-displayer");
    Ka = document.getElementById("image-insertion-box");
    u = document.getElementById("browse-image");
    v = document.getElementById("alt-input");
    w = document.getElementById("title-input");
    Cb = document.getElementById("cancel-link");
    La = document.getElementById("link-button");
    C = document.getElementById("link-insertion-displayer");
    D = document.getElementById("url-input");
    E = document.getElementById("hypertext-input");
    qa = document.getElementById("more-button");
    Ma = document.getElementById("more-displayer");
    Na = document.getElementById("more-container");
    Hb = document.getElementById("settings");
    Ib = document.getElementById("q-and-a");
    Jb = document.getElementById("shortcuts");
    Kb = document.getElementById("about");
    da = document.getElementById("recent-button");
    G = document.getElementById("recent-files-displayer");
    H = document.getElementById("recent-files-container");
    Pa = document.getElementById("style-tool");
    I = document.getElementById("style-tool-displayer");
    Lb = document.getElementById("home-style");
    Mb = document.getElementById("clinic-style");
    Nb = document.getElementById("tramway-style");
    Ob = document.getElementById("mado-footer");
    Pb = document.getElementById("workspace");
    q = document.getElementById("switch-md");
    p = document.getElementById("switch-both");
    Qb = document.getElementById("switch-html");
    W.push(q, p, Qb);
    Sa = document.getElementById("cancel");
    Qa = document.getElementById("close-alert-displayer");
    Rb = document.getElementsByTagName("head")[0];
    Sb = document.getElementById("quit");
    Tb = document.getElementById("save-quit");
    Ub = document.getElementById("save-state");
    Ra = document.getElementById("window-close");
    Vb = document.getElementById("window-close-button");
    Wb = document.getElementById("window-maximize");
    Xb = document.getElementById("window-minimize");
    chrome.storage.local.get("tempFileEntry", function (a) {
        void 0 !=
            a.tempFileEntry ? chrome.fileSystem.restoreEntry(a.tempFileEntry, function (a) {
                c = a;
                chrome.storage.local.remove("tempFileEntry");
                c.file(function (a) {
                    var b = new FileReader;
                    b.onload = function (a) {
                        k.innerText = a.target.result;
                        n = k.innerText;
                        g();
                        m.innerHTML = l(c.fullPath) + "&nbsp;-";
                        ga.innerHTML = l(c.fullPath) + " - Mado"
                    };
                    b.readAsText(a)
                }, h)
            }) : n = void 0
    });
    ra();
    $(ba).on("click", sa);
    Mousetrap.bind(["command+n", "ctrl+n"], function () {
        sa();
        return !1
    });
    $(ca).on("click", wa);
    Mousetrap.bind(["command+o", "ctrl+o"], function () {
        wa();
        return !1
    });
    $(ea).on("click", za);
    Mousetrap.bind(["command+s", "ctrl+s"], function () {
        za();
        return !1
    });
    $(fa).on("click", xa);
    Mousetrap.bind(["command+shift+s", "ctrl+shift+s"], function () {
        xa();
        return !1
    });
    $(aa).on("click", na);
    $(k).bind("scroll", function () {
        console.log("Event worked")
    });
    Ca();
    S.style.display = "none";
    chrome.storage.local.get("firstLaunch", function (a) {
        void 0 == a.firstLaunch && (k.innerHTML = ta, chrome.storage.local.set({
            firstLaunch: !1
        }))
    });
    $(k).focus();
    $(k).on("input propertychange", function () {
        g()
    });
    $(k).bind("paste", function () {
        fb()
    });
    $(k).keydown(function (a) {
        9 == a.keyCode && a.preventDefault()
    });
    $("#html-conversion").on("click", "a", function (a) {
        -1 != a.currentTarget.href.indexOf("chrome-extension://") && (a.preventDefault(), "" != a.currentTarget.hash && 0 != $(a.currentTarget.hash).length && $("#html-conversion").animate({
            scrollTop: $(a.currentTarget.hash).position().top
        }, "slow"))
    });
    $(S).on("click", hb);
    $(T).on("click", hb);
    $("#html-conversion").on("mouseenter", "a", function (a) {
        gb.innerHTML = -1 == a.currentTarget.href.indexOf("chrome-extension://") ?
            a.currentTarget.href : a.currentTarget.hash;
        gb.className = "show"
    });
    $("#html-conversion").on("mouseleave", "a", function () {
        gb.className = ""
    });
    Mousetrap.bind(["command+h", "ctrl+h"], function () {
        $(Ea).click();
        return !1
    });
    $(r).keyup(function (a) {
        27 == a.keyCode && $(Ea).click()
    });
    $(r).on("input propertychange", mb);
    $(resultSwitch1).on("click", function () {
        nb("1")
    });
    $(resultSwitch2).on("click", function () {
        nb("2")
    });
    $(resultSwitch3).on("click", function () {
        nb("3")
    });
    $(Ha).on("mousedown", function () {
        y("mado-image")
    });
    $(u).on("click", Bb);
    $(pb).on("click",
        eb);
    $(v).keyup(function (a) {
        13 == a.keyCode ? tb() : 27 == a.keyCode ? vb() : ub()
    });
    $(w).keydown(function (a) {
        9 == a.keyCode && (a.preventDefault(), $(v).select())
    });
    $(w).keyup(function (a) {
        13 == a.keyCode ? tb() : 27 == a.keyCode ? vb() : ub()
    });
    $(ob).on("click", vb);
    $(La).on("mousedown", function () {
        y("mado-link")
    });
    Mousetrap.bind(["command+k", "ctrl+k"], function () {
        y("mado-link");
        $(La).click();
        return !1
    });
    $(D).keyup(function (a) {
        13 == a.keyCode ? Eb() : 27 == a.keyCode ? Gb() : Fb()
    });
    $(E).keydown(function (a) {
        9 == a.keyCode && (a.preventDefault(),
            $(D).select())
    });
    $(E).keyup(function (a) {
        13 == a.keyCode ? Eb() : 27 == a.keyCode ? Gb() : Fb()
    });
    $(Cb).on("click", Gb);
    $(Hb).on("click", function () {
        pa("more/settings.html")
    });
    $(Ib).on("click", function () {
        pa("more/qanda.html")
    });
    $(Jb).on("click", function () {
        pa("more/shortcuts.html")
    });
    $(Kb).on("click", function () {
        pa("more/about.html")
    });
    Oa();
    navigator.onLine && (Yb = analytics.getService("Mado"), Ba(), Zb = Yb.getTracker("UA-45134408-1"), Zb.sendAppView("mainWindow"));
    $b();
    $(Lb).on("click", function () {
        ac("home")
    });
    $(Mb).on("click", function () {
        ac("clinic")
    });
    $(Nb).on("click", function () {
        ac("tramway")
    });
    1159 < chrome.app.window.current().getBounds().width ? p.className = "switch-button activated" : (q.className = "switch-button activated", Pb.className = "markdown-view");
    chrome.app.window.current().getBounds();
    Da();
    $(q).on("click", function () {
        bc(this.id, "markdown-view")
    });
    $(p).on("click", function () {
        bc(this.id, "normal")
    });
    $(Qb).on("click", function () {
        bc(this.id, "conversion-view")
    });
    Mousetrap.bind(["command+alt+left", "ctrl+alt+left"], function () {
        cc("left");
        return !1
    });
    Mousetrap.bind(["command+alt+right",
        "ctrl+alt+right"
    ], function () {
        cc("right");
        return !1
    });
    dc.setAttribute("rel", "stylesheet");
    dc.setAttribute("type", "text/css"); - 1 != navigator.appVersion.indexOf("Mac") ? (dc.setAttribute("href", "css/window-frame-mac.css"), Vb.setAttribute("class", "cta little-icon-mac-close"), Wb.setAttribute("class", "cta little-icon-mac-maximize"), Xb.setAttribute("class", "cta little-icon-mac-minimize")) : (-1 != navigator.appVersion.indexOf("Win") ? dc.setAttribute("href", "css/window-frame-windows.css") : dc.setAttribute("href", "css/window-frame-others.css"),
        Vb.setAttribute("class", "cta little-icon-win-close"), Wb.setAttribute("class", "cta little-icon-win-maximize"), Xb.setAttribute("class", "cta little-icon-win-minimize"));
    Rb.appendChild(dc);
    $(Sb).on("click", ec);
    $(Tb).on("click", fc);
    $(Vb).on("click", gc);
    Mousetrap.bind(["command+w", "ctrl+w"], function () {
        gc();
        return !1
    });
    $(Wb).on("click", hc);
    $(Xb).on("click", ic)
};
var G, H, X, Y = "",
    la, Z = {}, jc = "recentFile1 recentFile2 recentFile3 recentFile4 recentFile5 recentFile6 recentFile7 recentFileId1 recentFileId2 recentFileId3 recentFileId4 recentFileId5 recentFileId6 recentFileId7".split(" ");

function kc(a) {
    7 >= a && chrome.storage.local.get(jc, function (b) {
        void 0 != b["recentFile" + a] && chrome.fileSystem.isRestorable(b["recentFileId" + a], function (e) {
            e ? chrome.fileSystem.restoreEntry(b["recentFileId" + a], function (b) {
                b ? kc(a + 1) : (document.getElementById("recent-" + a).setAttribute("class", "recent-file deleted"), lc(a, "check"))
            }) : (document.getElementById("recent-" + a).setAttribute("class", "recent-file deleted"), lc(a, "check"))
        })
    })
}

function Oa() {
    kc(1);
    H.innerHTML = " ";
    chrome.storage.local.get(jc, function (a) {
        for (var b = 1; 7 >= b; b++)
            if (void 0 != a["recentFile" + b]) H.innerHTML += '<li class="recent-file" id="recent-' + b + '"><div class="recent-file-wrapped"><p>' + l(a["recentFile" + b].toString()) + '</p><div class="delete-recent-button little-icon-delete" id="delete-button-' + b + '"></div></div></li>';
            else break;
        $(".recent-file").on("click", function (a) {
            $(a.target).closest("#delete-button-" + this.id.charAt(this.id.length - 1)).length || (la = this.id.charAt(this.id.length -
                1).valueOf(), Y = "recentFileId" + this.id.charAt(this.id.length - 1), chrome.storage.local.get(Y, function (a) {
                chrome.fileSystem.restoreEntry(a[Y], function (a) {
                    ua(a);
                    G.className = "hidden"
                })
            }))
        });
        $(".delete-recent-button").on("click", function () {
            ma(this.id.charAt(this.id.length - 1))
        });
        X = document.createElement("li");
        X.setAttribute("id", "recent-files-info");
        " " != H.innerHTML ? (X.setAttribute("class", "clear-all"), X.innerHTML = '<div class="icon-recent-clear"></div><span class="clear-all-text">Clear all</span>') : (X.setAttribute("class",
            " "), X.innerHTML = "No recent document.");
        H.appendChild(X);
        $(".clear-all").on("click", function () {
            mc()
        })
    })
}

function va(a, b) {
    chrome.storage.local.get(jc, function (e) {
        for (var d = 1; 7 >= d; d++)
            if (void 0 == e["recentFile" + d] || e["recentFile" + d] == a.fullPath || 7 == d) {
                for (; 0 < d; d--) 1 < d ? (Y = ("recentFileId" + d).toString(), Z[Y] = e["recentFileId" + (d - 1)], chrome.storage.local.set(Z), Z = {}, Y = ("recentFile" + d).toString(), Z[Y] = e["recentFile" + (d - 1)], chrome.storage.local.set(Z), Z = {}) : (chrome.storage.local.set({
                        recentFileId1: chrome.fileSystem.retainEntry(a)
                    }), chrome.storage.local.set({
                        recentFile1: a.fullPath
                    }), Oa(), void 0 != b && "quit" == b &&
                    ec());
                break
            }
    })
}

function ma(a) {
    document.getElementById("recent-" + a).setAttribute("class", "recent-file deleted");
    setTimeout(function () {
        lc(a, "display")
    }, 100)
}

function lc(a, b) {
    chrome.storage.local.get(jc, function (e) {
        if (void 0 != e["recentFile" + a]) {
            for (var d = parseInt(a); 7 >= d; d++)
                if (void 0 != e["recentFile" + (d + 1)]) Y = ("recentFileId" + d).toString(), Z[Y] = e["recentFileId" + (d + 1)], chrome.storage.local.set(Z), Z = {}, Y = ("recentFile" + d).toString(), Z[Y] = e["recentFile" + (d + 1)], chrome.storage.local.set(Z), Z = {};
                else {
                    Y = ("recentFileId" + d).toString();
                    chrome.storage.local.remove(Y);
                    Y = ("recentFile" + d).toString();
                    chrome.storage.local.remove(Y);
                    Y = "";
                    break
                }
                "display" == b ? Oa() : "check" ==
                b && kc(a)
        }
    })
}

function mc() {
    chrome.storage.local.get(jc, function (a) {
        for (var b = 1; 7 >= b; b++)
            if (void 0 == a["recentFile" + (b + 1)]) {
                nc(b);
                break
            }
    })
}

function nc(a) {
    chrome.storage.local.get(jc, function () {
        Y = ("recentFileId" + a).toString();
        chrome.storage.local.remove(Y);
        Y = ("recentFile" + a).toString();
        chrome.storage.local.remove(Y);
        Y = "";
        1 < a ? nc(a - 1) : H.innerHTML = '<li id="recent-files-info" class=" ">No recent document.</li>'
    })
}
var Yb, Zb;

function Ba() {
    chrome.storage.local.get("analytics", function (a) {
        void 0 != a.analytics ? Yb.t.setTrackingPermitted(a.analytics) : (chrome.storage.local.set({
            analytics: !0
        }), Yb.t.setTrackingPermitted(!0))
    })
}
var Pa, I, Mb, Lb, Nb;

function $b() {
    chrome.storage.local.get("style", function (a) {
        void 0 != a.style ? ("home" == a.style ? Lb.checked = !0 : "clinic" == a.style ? Mb.checked = !0 : Nb.checked = !0, $(J).attr("class", a.style)) : (Lb.checked = !0, ac("home"))
    })
}

function ac(a) {
    chrome.storage.local.set({
        style: a
    }, function () {
        $(J).attr("class", a)
    })
}
var Ob, p, Qb, q, Pb, W = [],
    Aa;

function bc(a, b) {
    for (var e = 0; e < W.length; e++) W[e].className = W[e].id != a ? "switch-button" : "switch-button activated";
    Pb.className = b;
    "markdown-view" == b ? Ob.className = b : Ob.removeAttribute("class")
}

function Da() {
    chrome.storage.local.get("resize", function (a) {
        void 0 != a.resize ? Aa = a.resize : (chrome.storage.local.set({
            resize: !0
        }), Aa = !0)
    })
}

function cc(a) {
    if (1159 < window.innerWidth)
        for (var b = 0; b < W.length; b++) "switch-button activated" == W[b].className && ("left" == a && 0 < b ? W[b - 1].click() : "right" == a && b < W.length - 1 && W[b + 1].click(), b = W.length);
    else "left" == a ? q.click() : Qb.click()
}
var Sa, Qa, Rb, n, Sb, Tb, Ub, dc = document.createElement("link"),
    Ra, Vb, Wb, Xb, oc;

function ya() {
    Ub.innerHTML = "" != k.innerText ? void 0 == n || k.innerText != n ? '<span class="little-icon-unsaved"></span>' : "" : void 0 != n ? '<span class="little-icon-unsaved"></span>' : ""
}

function gc() {
    chrome.runtime.getBackgroundPage(function (a) {
        a.jBond(chrome.app.window.current().getBounds())
    });
    '<span class="little-icon-unsaved"></span>' == Ub.innerHTML ? Qa.className = "visible" : chrome.app.window.current().close()
}

function hc() {
    -1 != navigator.appVersion.indexOf("Win") ? 0 == chrome.app.window.current().getBounds().left && 0 == chrome.app.window.current().getBounds().top && chrome.app.window.current().getBounds().width == screen.availWidth && chrome.app.window.current().getBounds().height == screen.availHeight || chrome.app.window.current().isMaximized() ? chrome.app.window.current().setBounds(oc) : (oc = chrome.app.window.current().getBounds(), chrome.app.window.current().setBounds({
        left: 0,
        top: 0,
        width: screen.availWidth,
        height: screen.availHeight
    })) :
        chrome.app.window.current().isMaximized() ? chrome.app.window.current().restore() : chrome.app.window.current().maximize()
}

function ic() {
    chrome.app.window.current().minimize()
}

function ec() {
    chrome.runtime.getBackgroundPage(function (a) {
        a.jBond(chrome.app.window.current().getBounds())
    });
    chrome.app.window.current().close()
}

function pc() {
    c.createWriter(function (a) {
        f = !1;
        a.onwriteend = function () {
            f ? va(c, "quit") : (f = !0, this.truncate(this.position))
        };
        a.write(new Blob([k.innerText], {
            type: "plain/text"
        }))
    }, h)
}

function qc() {
    chrome.fileSystem.chooseEntry({
        type: "saveFile",
        suggestedName: "document.md"
    }, function (a) {
        a && a.createWriter(function (b) {
            f = !1;
            b.onwriteend = function () {
                f ? va(a, "quit") : (f = !0, this.truncate(this.position))
            };
            b.write(new Blob([k.innerText], {
                type: "plain/text"
            }))
        }, h)
    })
}

function fc() {
    void 0 == c || "md&nbsp;-" != m.innerHTML.substring(m.innerHTML.length - 9) ? qc() : pc()
};