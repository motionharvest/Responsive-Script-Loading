console.log("small javascript file loaded");

PubSub.subscribe("Enquire.SMALL_MATCH", function(){
	console.log("Match small");
});

PubSub.subscribe("Enquire.SMALL_UNMATCH", function(){
	console.log("Unmatch small");
});
