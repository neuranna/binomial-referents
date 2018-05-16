var shuffleSequence = seq("setcounter", "preload", "intro", "sep", rshuffle("preload", "image"), "debrief");

var defaults = [
    "Separator", {
	hideProgressBar: true,
        transfer: "keypress",
        normalMessage: "Press any key when you are ready to start",
    },
    "Message", {
        hideProgressBar: true
    },
    "Form", {
        hideProgressBar: true,
        continueOnReturn: true,
        saveReactionTime: true,
	countsForProgressBar: true
    },
    "Preloader", {
	hideProgressBar: true
    }
];

// completion code
var code = Math.floor(Math.random()*1000000);
var sendingResultsMessage = "The results are now being transferred.  Please wait.";
var completionMessage = "Thank you for your participation.  The results were successfully transmitted.  Your participation code is: A" + code;

// preloading

var IMAGES_TO_PRELOAD = [];    // updated when image-containing items are created

define_ibex_controller({
    name: "Preloader",
    jqueryWidget: {
        _init: function () {
            this.element.append("Setting up the next part...");

            this.preloadedImages = [ ];
            var numToPreload = IMAGES_TO_PRELOAD.length;
            for (var i = 0; i < IMAGES_TO_PRELOAD.length; ++i) {
                var img = new Image();
                img.src = IMAGES_TO_PRELOAD[i];
                var self = this;
                img.onload = function () {
                    --numToPreload;
                    if (numToPreload == 0) {
                        self.options._finishedCallback([ ]);
                    }
                }
                this.preloadedImages.push(img);
            }
        }
    },
    properties: {
        countsForProgressBar: false,
	hideProgressBar: true
    }
});


/* DEFINING ITEMS */

// start and end
var items = [
	["intro", "Form", {html: { include: "instructions_binomial.html" }}],
	["debrief", "Form", {html: { include: "debrief.html" }}],
	["setcounter", "__SetCounter__", { }],
    	["sep", "Separator", { }],

	];


// the labels refer to a subset of objects from the POPORO dataset (see paper for details). 
// the indices corresponds to the POPORO indices shifted by 1 (e.g. 
// index 107 corresponds to POPORO object pair 108)
// the first name in each pair is "match", the second name is "object" (using POPORO notation)
//
var indexedLabels = {107: ['pipe', 'cigar'], 135: ['book', 'typewriter'], 
	392: ['shark', 'dolphin'], 394: ['skateboard', 'scooter'], 
	11: ['starfish', 'fish'], 272: ['slingshot', 'bow'], 145: ['strawberry', 'raspberry'], 
	156: ['toaster', 'microwave'], 31: ['football', 'basketball'], 
	161: ['chair', 'pillow'], 162: ['door', 'window'], 36: ['toaster', 'bread'], 
	46: ['starfish', 'seahorse'], 180: ['lion', 'tiger'], 54: ['screwdriver', 'hammer'], 
	287: ['snowflake', 'ornament'], 188: ['flashlight', 'lamp'], 194: ['bowl', 'plate'], 
	71: ['turtle', 'fish'], 336: ['typewriter', 'keyboard'], 211: ['screw', 'hinge'], 
	213: ['pipe', 'hookah'], 344: ['leash', 'dog'], 89: ['desk', 'chair'], 
	348: ['train', 'bridge'], 97: ['keyboard', 'mouse'], 358: ['donkey', 'camel'], 
	361: ['lock', 'key'], 363: ['lemon', 'kiwi'], 371: ['bat', 'hat'], 116: ['duck', 'feather'], 
	117: ['medal', 'trophy'], 118: ['eagle', 'owl'],  122: ['monitor', 'printer'], 
	254: ['spoon', 'knife'], 127: ['lobster', 'shrimp']};

	
var makeValueString = function (param_list, rowInd) {
	var params = param_list[rowInd];
	return params.order + '+' + params.size1 + '+' + params.size2 + '+' + rowInd;
}

// POPORO images are accessed through their links in Figshare. The indices of images are used to
// define the corresponding link.

var addTableRow = function (index, param_list, rowInd) {
	/** @index: refers to image pair
	 * Each entry of the param @list contains:
	 *  - size1, size2: respective sizes of match and object images	 
	 *  - order - either 1 (match then object) or 2 (object then match) */
	const linkChunk1 = 'https://ndownloader.figshare.com/files/';
	const linkChunk2 = '/preview/';
	const linkChunk3 = '/preview.jpg';
	const matchStartIndex = 3680562;
	const objectStartIndex = 3682968;

	// retrieve parameters
	params = param_list[rowInd];
	size1 = params.size1;
	size2 = params.size2;
	order = params.order;

	// create image links
	// The images are located on figshare. There are two groups, match and object. 
	// For each group, images start at a certain index, which is incremented by 3 every time. 
	var matchIndex = matchStartIndex + 3 * index;
	var objectIndex = objectStartIndex + 3 * index;
	var matchLink = linkChunk1 + matchIndex + linkChunk2 + matchIndex + linkChunk3;
	var objectLink = linkChunk1 + objectIndex + linkChunk2 + objectIndex + linkChunk3;

	// add links to preload
	if (IMAGES_TO_PRELOAD.indexOf(matchLink) < 0) {
		IMAGES_TO_PRELOAD.push(matchLink);
	}
	if (IMAGES_TO_PRELOAD.indexOf(objectLink) < 0) {
		IMAGES_TO_PRELOAD.push(objectLink);
	}

	// set up the image cells
	var cellStart = '<td width="200" align="center" ' + 
		'style="border-top: 1px solid gray; border-bottom: 1px solid gray;"><img src="';
	var cellEnd = ' /></td>';
	matchCell = cellStart + matchLink + '" height=' + size1 + ' width=' + size1 + cellEnd;
	objectCell = cellStart + objectLink + '" height=' + size2 + ' width=' + size2 + cellEnd;

	//set up the input field
	var inputName = '"' + makeValueString(param_list, 0) + '_' +
		makeValueString(param_list, 1) + '_' +
		makeValueString(param_list, 2) + '"';
	var value = '"' + makeValueString(param_list, rowInd) + '"';
	var responseCell = '<td><input name=' + inputName + ' type="radio"' + ' value=' + value + 
		'class="obligatory" id=' + value + '/>';
	responseCell += ('<label for=' + value + '><i> pair ' + (rowInd+1) + '</i></label></td>');
	
	// construct the row
	var rowHtml = '<tr height="200">';
	if (order==1) {
		rowHtml += matchCell;
		rowHtml += objectCell;
	} else {
		rowHtml += objectCell;
		rowHtml += matchCell;
	}
	rowHtml += responseCell;
	rowHtml += '</tr>';
	return rowHtml;
};

var sampleParams = function() {
	/* Returns an object with 3 parameters: size1, size2, order
	 * Options are chosen at random and are independent. */
	
	// image sizes in pixels
	const SMALL = 60;
	const LARGE = 120;
	var size1, size2, order;

	//exclude condition when both are small
	let sizeCondition = Math.floor(Math.random() * 3);    // either 0, 1 or 2
	if (sizeCondition === 0) {
		size1 = LARGE;
		size2 = LARGE;
	} else if (sizeCondition === 1) {
		size1 = LARGE;
		size2 = SMALL;
	} else {
		size1 = SMALL;
		size2 = LARGE;
	}
	order = Math.round(Math.random()) + 1;    // either 1 or 2

	return {size1: size1, size2: size2, order: order};
};

var constructTable = function(index) {
	/* constructs a table with 3 different configurations of image pairs
	 * (out of 6 possible). The configuration will be recorded in the 
	 * "value" field of the input form. */

	var htmlStart = '<div style="display: table; margin: 0 auto;">' + 
		'<table cellpadding="10" style="border-collapse: collapse;">';
	var htmlEnd = '</table></div>';

	var htmlAll = htmlStart;

	// get 3 sets of parameters and make sure they do not repeat
	var param_list = [];
	while (param_list.length < 3) {
		var params = sampleParams();
		inArray = param_list.some( x =>
			x.size1 === params.size1 && x.size2 === params.size2 &&
				x.order === params.order);
		if (!inArray) {
			param_list.push(params);
		}
	}

	// construct three rows and add them to the table
	for (let i=0; i < param_list.length; i++) {
		htmlAll += addTableRow(index, param_list, i);
	}
	htmlAll += htmlEnd;
	return htmlAll;
};


var makeBinomial = function(labels, order) {
	/* Accepts a list with two words and a variable order (0-4).
	If order == 0 or 3, returns binomial with original word order, if order==1 or 4, switches the words.
	If order == 2, a meaningless label is returned. */	
	var htmlStart = '<h1 style="position: fixed; top: 40%; left: 50%; transform: translate(-50%, -50%); ' + 
		'font-family:helvetica;">';
	var htmlEnd = '</h1>';
	var binomial;
	if (order%3 === 0) {
		binomial = labels[0] + ' and ' + labels[1];
	} else if(order%3 === 1) {
		binomial = labels[1] + ' and ' + labels[0];
	} else {
		binomial = 'xxxxxxxxxxxxxx';
	}
	var html = htmlStart + binomial + htmlEnd;
	return html;
};


/* Add stimuli to the items array */
var addImageItems = function () {
	
	var indices = Object.keys(indexedLabels);
	for (let i = 0; i < indices.length; i++) {
		index = indices[i];
		labels = indexedLabels[index];
		// 2 binomials in order AB, 2 in order BA, and one xxxxxxx
		for (let order=0; order<5; order++) {
			items.push([["image", i+1], 
				"Message", {html: '', transfer: 1000},
				"Message", {html: makeBinomial(labels, order), transfer: 1000},
				"Message", {html: '', transfer: 500},
				"Form", {html: constructTable(index)}]);
		}
	}
	// preload for every 5 image pairs (currently just loads all of them)
	for (let j = 0; j < indices.length / 5; j++) {
		items.push(["preload", "Preloader", { }]);
		console.log("adding a preloader:" + (j+1));
	}

};

addImageItems();


