function tokenFactory(tokenString, tokenKind, tokenLineNumber, tokenPosition){
        this.tokenString = tokenString;//local variables
        this.tokenKind = tokenKind;
        this.tokenLineNumber = tokenLineNumber;
	this.tokenPosition = tokenPosition;
	this.tokenPositionString = "" + this.tokenLineNumber + ":" + this.tokenPosition;//combiner method
        this.toString = function(){
                                return "(" + this.tokenString + ", " + tokenKind + ", " + this.tokenPositionString + ") \n";  //converts to String
                                }
	//getter Functions
        this.getTokenString = 	      function() { return this.tokenString }
        this.getTokenLineNumber =     function() { return this.tokenLineNumber }
        this.getTokenKind = 	      function() { return this.tokenKind }
	this.getTokenPositionString = function() { return this.tokenPositionString }
	this.getTokenPosition =       function() { return this.tokenPosition }

	//setter functions
        this.setTokenString = 	  function(string) { this.tokenString = string }
        this.setTokenLineNumber = function(lineNumber) { this.tokenLineNumber = lineNumber }
        this.setTokenKind = 	  function(kind) { this.tokenKind = kind }
	this.setTokenPosition =   function(index) {this.tokenPosition = index}
}



function symbolTableFactory(){
	this.symbolArray = new Array();
	//adds symbol to symbolArray
	this.addSymbol = function(symbol) {	
						var isSet = false;//flag
						var i = 0;//index
						//if isSet is false and index is less than length of symbolArray, perform while loop
						while(!isSet && i < this.symbolArray.length){
							//if string at index of token array = tokenString of symbol
							if(this.symbolArray[i].getTokenString() == symbol.getTokenString()){
								isSet = true;//set flag
								putMessage("Found a redeclared variable");
								this.symbolArray.push(symbol);//push symbol onto array
								if(contains(usedIds, this.symbolArray[i])){//if redeclared
									usedIds = remove(usedIds, this.symbolArray[i]);//removes from usedIds
								}
							}
							i++;//increase index 
  						}
  
  						if(!isSet){
							this.symbolArray.push(symbol);//if declared for first time, push
  						}				
	}
	// checks if the symbol is declared in the symbol table
	this.isDeclared = function(id){
					for(var i = 0; i < this.symbolArray.length; i++) {
						if(this.symbolArray[i].getTokenString() == id){
				      			return true;
    						}
  					}
  					return false;
	}
	// retreives the symbol type of the first declaration of an id
	this.getSymbolType = function(id){
					   var type = "";
				  	   for(var i = 0; i < this.symbolArray.length; i++) {
	    					if(this.symbolArray[i].getTokenString() == id){
							type = this.symbolArray[i].getTokenKind();
    						}
  					   }
			    		   return type;
	}
	// returns the symbol array as a string
	this.toString = function(){
					return "(" + this.symbolArray + ")";
	}
	// opens a new level of scope
	this.addNewScope = function(){
		putMessage("Adding scope: " + scope);
		var scopeMarker = new tokenFactory(scope, "scopeMarker", 0, 0);
		this.symbolArray.push(scopeMarker);
	}
	// closes the last level of scope
	this.closeScope = function(){
		var tmp;
		var lastElem = this.symbolArray.length-1;
		// starts at the end, poping of symbols until it reaches the scope marker
		while(this.symbolArray[lastElem].getTokenKind() != "scopeMarker"){
			putMessage("removing symbol: " + this.symbolArray[lastElem]);
			tmp = this.symbolArray.pop();
			checkUse(tmp);	// checks to see if id was used before deleting it
			lastElem--;
		}

		putMessage("Removing symbolMarker: " + this.symbolArray[lastElem]);
		tmp = this.symbolArray.pop();	// removes the scope marker
		putMessage(this.symbolArray);


	}
	// retrieves the most recent declaration type of an id
	this.getLastIdType = function(id){
		if(this.isDeclared(id)){
			var lastElem = this.symbolArray.length-1;
			// looks for last instance in the symbol table
			while(this.symbolArray[lastElem].getTokenString() != id && lastElem > -1){
				lastElem--;
			}
			return this.symbolArray[lastElem].getTokenKind();
		} else { // it's an undeclared variable
			return "undeclared";
		}
		
	}
}
// checks to see if the variable has been used
function checkUse(symbol){
	if(!contains(usedIds, symbol)){
		unusedIds.push(symbol);
	}
}
// checks if the token is an element of an array
function contains(array, token){
	for(var i=0; i<array.length; i++){
		if(array[i].getTokenString() == token.getTokenString() &&
		   array[i].getTokenKind()   == token.getTokenKind()){
			return true;
		}
	}
	return false;
}
// removes the token from a given array by returning a new array without the specified token
function remove(array, token){
	var newArray = new Array();
	
	for(var i=0; i<array.length; i++){
		if(array[i].getTokenString() != token.getTokenString() &&
		   array[i].getTokenKind()   != token.getTokenKind()){
			newArray.push(array[i]);
		}
	}

	return newArray;
}



