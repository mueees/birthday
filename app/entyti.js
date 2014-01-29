var request = require('request');
var jsdom = require('jsdom');

parse('http://www.theguardian.com/technology/2014/jan/28/indiegogo-crowdfunding-platform-40m-finance-expansion');

var regexps = {
  unlikelyCandidatesRe: /combx|comment|disqus|foot|header|menu|meta|nav|rss|shoutbox|sidebar|sponsor/i,
  okMaybeItsACandidateRe: /and|article|body|column|main/i,
  positiveRe: /article|body|content|entry|hentry|page|pagination|post|text/i,
  negativeRe: /combx|comment|contact|foot|footer|footnote|link|media|meta|promo|related|scroll|shoutbox|sponsor|utility|tags|widget/i,
  divToPElementsRe: /<(a|blockquote|dl|div|img|ol|p|pre|table|ul)/i,
  replaceBrsRe: /(<br[^>]*>[ \n\r\t]*){2,}/gi,
  replaceFontsRe: /<(\/?)font[^>]*>/gi,
  trimRe: /^\s+|\s+$/g,
  normalizeRe: /\s{2,}/g,
  killBreaksRe: /(<br\s*\/?>(\s|&nbsp;?)*){1,}/g,
  videoRe: /http:\/\/(www\.)?(youtube|vimeo|youku|tudou|56|yinyuetai)\.com/i
};

function dbg(text){
	console.log(text)
}

function parse(url, options){
	request(url, options, function(err, response, buffer) {
      if(err) {
      	console.log( 'request error' );
        return false;
      }

      jsdomParse(null, buffer);
    });
}

function jsdomParse(error, body){
	jsdom.env({
      html: body,
      //html: "<div class='comment'>this is test</div>",
      //html: "<div><p><a href='blabla'>this is test</a></p></div>",
      scripts: ["http://code.jquery.com/jquery.js"],
      done: function (errors, window) {
      	var bodyHtml = window.document.body.innerHTML;
      	grabContent(window.document, false);
      }
    });
}

function grabContent(document, preserveUnlikelyCandidates){

	var nodes = document.getElementsByTagName('*');

	for( var i = 0; i < nodes.length; i++ ){
		var node = nodes[i];

    	// Remove unlikely candidates */
    	var continueFlag = false;
	    if (!preserveUnlikelyCandidates) {
	      var unlikelyMatchString = node.className + node.id;
	      if (unlikelyMatchString.search(regexps.unlikelyCandidatesRe) !== -1 && unlikelyMatchString.search(regexps.okMaybeItsACandidateRe) == -1 && node.tagName !== 'HTML' && node.tagName !== "BODY") {
	        dbg("Removing unlikely candidate - " + unlikelyMatchString);
	        node.parentNode.removeChild(node);
	        continueFlag = true;
	      }
	    }

	    // Turn all divs that don't have children block level elements into p's
	    if (!continueFlag && node.tagName === "DIV") {
	      if (node.innerHTML.search(regexps.divToPElementsRe) === -1) {
	        dbg("Altering div to p");
	        var newNode = document.createElement('p');
	        newNode.innerHTML = node.innerHTML;
	        node.parentNode.replaceChild(newNode, node);
	      } else {
	        // EXPERIMENTAL
	        /*node.childNodes._toArray().forEach(function (childNode) {
	          if (childNode.nodeType == 3 ) {
	            // use span instead of p. Need more tests.
	            dbg("replacing text node with a span tag with the same content.");
	            var span = document.createElement('span');
	            span.innerHTML = childNode.nodeValue;
	            childNode.parentNode.replaceChild(span, childNode);
	          }}
	        );*/
	      }
	    }
	}


	var allParagraphs = document.getElementsByTagName("p");
  	var candidates = [];

  	for (var i = 0; i < allParagraphs.length; ++i) {
  		var paragraph = allParagraphs[i];
	    var parentNode = paragraph.parentNode;
	    var grandParentNode = parentNode.parentNode;
	    var innerText = getInnerText(paragraph);

	    // If this paragraph is less than 25 characters, don't even count it. 
    	if (innerText.length < 25) continue;

    	// Initialize readability data for the parent.
	    if (typeof parentNode.readability == 'undefined') {
	      initializeNode(parentNode);
	      candidates.push(parentNode);
	    }

	    // Initialize readability data for the grandparent.
	    if (typeof grandParentNode.readability == 'undefined') {
	      initializeNode(grandParentNode);
	      candidates.push(grandParentNode);
	    }

	    var contentScore = 0;

	    // Add a point for the paragraph itself as a base. */
	    ++contentScore;

	    // Add points for any commas within this paragraph */
	    // support Chinese commas.
	    contentScore += innerText.replace('，', ',').split(',').length;

	    // For every 100 characters in this paragraph, add another point. Up to 3 points. */
	    contentScore += Math.min(Math.floor(innerText.length / 100), 3);

	    // Add the score to the parent. The grandparent gets half. */
	    parentNode.readability.contentScore += contentScore;
	    grandParentNode.readability.contentScore += contentScore / 2;

  	}


	  	/**
	   * After we've calculated scores, loop through all of the possible candidate nodes we found
	   * and find the one with the highest score.
	   **/
	  var topCandidate = null;
	  candidates.forEach(function (candidate) {
	    /**
	     * Scale the final candidates score based on link density. Good content should have a
	     * relatively small link density (5% or less) and be mostly unaffected by this operation.
	     **/
	    candidate.readability.contentScore = candidate.readability.contentScore * (1 - getLinkDensity(candidate));

	    dbg('Candidate: ' + candidate + " (" + candidate.className + ":" + candidate.id + ") with score " + candidate.readability.contentScore);

	    if (!topCandidate || candidate.readability.contentScore > topCandidate.readability.contentScore) topCandidate = candidate;
	  });

	  /**
	   * If we still have no top candidate, just use the body as a last resort.
	   * We also have to copy the body node so it is something we can modify.
	   **/
	  if (topCandidate === null || topCandidate.tagName === "BODY") {
	    // With no top candidate, bail out if no body tag exists as last resort.
	    if (!document.body) return new Error("No body tag was found.");
	    topCandidate = document.createElement("DIV");
	    topCandidate.innerHTML = document.body.innerHTML;
	    document.body.innerHTML = "";
	    document.body.appendChild(topCandidate);
	    initializeNode(topCandidate);
	  }


	  /**
   * Now that we have the top candidate, look through its siblings for content that might also be related.
   * Things like preambles, content split by ads that we removed, etc.
   **/
  var articleContent = document.createElement("DIV");
  articleContent.id = "readability-content";
  var siblingScoreThreshold = Math.max(10, topCandidate.readability.contentScore * 0.2);
  var siblingNodes = topCandidate.parentNode.childNodes;

  for (var i = 0, il = siblingNodes.length; i < il; i++) {
    var siblingNode = siblingNodes[i];
    var append = false;

    dbg("Looking at sibling node: " + siblingNode + " (" + siblingNode.className + ":" + siblingNode.id + ")" + ((typeof siblingNode.readability != 'undefined') ? (" with score " + siblingNode.readability.contentScore) : ''));
    dbg("Sibling has score " + (siblingNode.readability ? siblingNode.readability.contentScore : 'Unknown'));

    if (siblingNode === topCandidate) {
      append = true;
    }

    if (typeof siblingNode.readability != 'undefined' && siblingNode.readability.contentScore >= siblingScoreThreshold) {
      append = true;
    }

    if (siblingNode.nodeName == "P") {
      var linkDensity = getLinkDensity(siblingNode);
      var nodeContent = getInnerText(siblingNode);
      var nodeLength = nodeContent.length;

      if (nodeLength > 80 && linkDensity < 0.25) {
        append = true;
      } else if (nodeLength < 80 && linkDensity == 0 && nodeContent.search(/\.( |$)/) !== -1) {
        append = true;
      }
    }

    if (append) {
      dbg("Appending node: " + siblingNode)

      /* Append sibling and subtract from our list because it removes the node when you append to another node */
      articleContent.appendChild(siblingNode);
      i--;
      il--;
    }
  }

  /**
   * So we have all of the content that we need. Now we clean it up for presentation.
   **/
  //prepArticle(articleContent);

  console.log(articleContent.innerHTML);

  return articleContent;

}


getInnerText = exports.getInnerText = function (e, normalizeSpaces) {
  var textContent = "";

  normalizeSpaces = (typeof normalizeSpaces == 'undefined') ? true : normalizeSpaces;

  textContent = e.textContent.trim();

  if (normalizeSpaces) return textContent.replace(regexps.normalizeRe, " ");
  else return textContent;
}

/**
 * Initialize a node with the readability object. Also checks the
 * className/id for special names to add to its score.
 *
 * @param Element
 * @return void
 **/
function initializeNode (node) {
  node.readability = {
    "contentScore": 0
  };

  switch (node.tagName) {
  case 'DIV':
    node.readability.contentScore += 5;
    break;

  case 'PRE':
  case 'TD':
  case 'BLOCKQUOTE':
    node.readability.contentScore += 3;
    break;

  case 'ADDRESS':
  case 'OL':
  case 'UL':
  case 'DL':
  case 'DD':
  case 'DT':
  case 'LI':
  case 'FORM':
    node.readability.contentScore -= 3;
    break;

  case 'H1':
  case 'H2':
  case 'H3':
  case 'H4':
  case 'H5':
  case 'H6':
  case 'TH':
    node.readability.contentScore -= 5;
    break;
  }

  node.readability.contentScore += getClassWeight(node);
}

/**
 * Get an elements class/id weight. Uses regular expressions to tell if this 
 * element looks good or bad.
 *
 * @param Element
 * @return number (Integer)
 **/
function getClassWeight (e) {
  var weight = 0;

  /* Look for a special classname */
  if (e.className != "") {
    if (e.className.search(regexps.negativeRe) !== -1) weight -= 25;

    if (e.className.search(regexps.positiveRe) !== -1) weight += 25;
  }

  /* Look for a special ID */
  if (typeof (e.id) == 'string' && e.id != "") {
    if (e.id.search(regexps.negativeRe) !== -1) weight -= 25;

    if (e.id.search(regexps.positiveRe) !== -1) weight += 25;
  }

  return weight;
}


/**
 * Get the density of links as a percentage of the content
 * This is the amount of text that is inside a link divided by the total text in the node.
 * 
 * @param Element
 * @return number (float)
 **/
function getLinkDensity (e) {
  var links = e.getElementsByTagName("a");

  var textLength = getInnerText(e).length;
  var linkLength = 0;
  for (var i = 0, il = links.length; i < il; i++) {
    var href = links[i].getAttribute('href');
    // hack for <h2><a href="#menu"></a></h2> / <h2><a></a></h2>
    if(!href || (href.length > 0 && href[0] === '#')) continue;
    linkLength += getInnerText(links[i]).length;
  }
  return linkLength / textLength;
}


var read = require('node-readability');
read('http://www.theguardian.com/technology/2014/jan/28/indiegogo-crowdfunding-platform-40m-finance-expansion', function(err, article, meta) {

	/*console.log(article.content);

  console.log(article.content);
  console.log(article.html);
  console.log(article.document);
  console.log(meta);*/
});