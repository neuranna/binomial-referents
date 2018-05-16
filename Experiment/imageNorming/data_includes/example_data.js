var shuffleSequence = seq("intro", randomize("image"), "debrief");

var defaults = [
    "Separator", {
        transfer: 1000,
        normalMessage: "Please wait for the next sentence.",
        errorMessage: "Wrong. Please wait for the next sentence."
    },
    "DashedSentence", {
        mode: "self-paced reading"
    },
    "AcceptabilityJudgment", {
        as: ["1", "2", "3", "4", "5", "6", "7"],
        presentAsScale: true,
        instructions: "Use number keys or click boxes to answer.",
        leftComment: "(Bad)", rightComment: "(Good)"
    },
    "Question", {
        hasCorrect: true
    },
    "Message", {
        hideProgressBar: true
    },
    "Form", {
        hideProgressBar: true,
        continueOnReturn: true,
        saveReactionTime: true
    }
];

// completion code
var code = Math.floor(Math.random()*1000000);
var sendingResultsMessage = "The results are now being transferred.  Please wait.";
var completionMessage = "Thank you for your participation.  The results were successfully transmitted.  Your participation code is: A" + code;

// start and end
var items = [
	["intro", "Form", {html: { include: "intro.html" }}],
	["debrief", "Form", {html: { include: "debrief.html" }}],
];


// We restrict the number of image pairs that need to be named to 147 pairs of pre-selected images.
// Images are taken from the POPORO dataset. Here, POPORO indexes are decremented by 1 (e.g. 
// POPORO image pair 1 corresponds to index 0).

var relevantIndices = [0, 1, 2, 3, 5, 7, 8, 9, 11, 14, 15, 18, 19, 21, 23, 24, 27, 29, 31, 36, 38, 39, 
	41, 44, 45, 46, 47, 48, 50, 52, 53, 54, 57, 58, 60, 64, 66, 67, 71, 74, 77, 89, 90, 92, 94, 97, 99, 
	101, 102, 105, 106, 107, 111, 112, 115, 116, 117, 118, 122, 124, 127, 128, 135, 138, 140, 145, 148, 
	150, 155, 156, 160, 161, 162, 165, 168, 170, 171, 174, 177, 179, 180, 182, 183, 185, 186, 188, 189, 
	190, 193, 194, 204, 205, 211, 213, 217, 226, 238, 239, 247, 250, 254, 256, 257, 258, 262, 265, 270, 
	272, 273, 287, 289, 299, 303, 304, 312, 318, 319, 331, 336, 337, 340, 344, 348, 350, 351, 353, 356, 
	358, 361, 363, 364, 370, 371, 372, 376, 378, 379, 380, 381, 382, 385, 389, 391, 392, 394, 395, 398];


var addImageItems = function () {
	/* The images are located on figshare. There are two groups, match and object. 
	 * For each group, images start at a certain index, which is incremented by 3 every time. */
	const linkChunk1 = 'https://ndownloader.figshare.com/files/';
	const linkChunk2 = '/preview/';
	const linkChunk3 = '/preview.jpg';
	const matchStartIndex = 3680562;
	const objectStartIndex = 3682968;

	var imageHtml1 = '<div style="display: table; margin: 0 auto;"> <img src="';
	var imageHtml2 = '" /> <div style="display: table; margin: 0 auto;">' +
		'<p><b> What is this? </b>' + 
		'<input required="" type="text" name="';
	var imageHtml3 = '" class="obligatory" size="40" autofocus /> </p>' + '</div>' + '</div>';

	for (let i = 0; i < relevantIndices.length; i++) {
		matchIndex = matchStartIndex + 3 * relevantIndices[i];
	    	link = linkChunk1 + matchIndex + linkChunk2 + matchIndex + linkChunk3;
		fieldName = "imageLabel" + matchIndex; 
		imageHtml = imageHtml1 + link + imageHtml2 + fieldName + imageHtml3;
		items.push(["image", "Form", {html: imageHtml}]);
	}

	for (let i = 0; i < relevantIndices.length; i++) {
		objectIndex = objectStartIndex + 3 * relevantIndices[i];
	    	link = linkChunk1 + objectIndex + linkChunk2 + objectIndex + linkChunk3;
		fieldName = "imageLabel" + objectIndex; 
		imageHtml = imageHtml1 + link + imageHtml2 + fieldName + imageHtml3;;
		items.push(["image", "Form", {html: imageHtml}]);
	}
}

addImageItems();

