function parse(){
	putMessage("In parse()");	
	putMessage("Parsing [" + tokenArray + "]");

	currentToken = getNextToken();

	// A valid parse derives the P(rogram) production, recursive parse call
        parseP();
	
	//Warning message for variables not declared, but used
	if(warningFlag){
		putMessage("WARNING: ABOUT TO FAIL!!! VARIABLE(S) NOT DECLARED: ");
		for(var i = 0; i < warningIndex.length; i++){
			putMessage( warningIndex[i].getTokenString() + " used at "
				    + warningIndex[i].getTokenPositionString() + ".");
		}
		
	}
	
	//Warning message for variables declared, but not used
	if(unusedIds.length > 0){
		putMessage("\nUnused Variables at: ");
		for(var i=0; i < unusedIds.length; i++){
			putMessage(unusedIds[i].getTokenString() + " declared at "
				    + unusedIds[i].getTokenPositionString() + ".");
		}
	}

	// Report the results.
	if (errorCount != 0){
       		putMessage("SO MUCH FAIL!!! You have " + errorCount + 
		" error(s), and the first one is at line "  + errorIndexString + "." );
   		}else{
		putMessage("\nParsing WIN!");
	}
}

function parseP(){
	putMessage("In parseP()");

        // A P(rogram) production can only be an S(tatement), so parse the S production.
        parseS();
	currentToken = getNextToken();

	//looking for end of stream, if not found error
	if(currentToken.getTokenString() != "$"){
		setError();
		putMessage("WTF?!?!?!  Useless Symbols at end of Program!");
	}

	//found an end of stream, but not an EOF
	if(currentToken.getTokenKind() != "EOF" && errorCount == 0){
		//functions as a warning message at end of parse, will not cause an error.			
		putMessage("Danger! Danger! Will Robinson!  " +
			   "Useless Symbols at the end of grammatically correct program");
	}
}

function parseS(){
	putMessage("in parseS()");
	// Validate that we have the expected start of an Statement.
	putMessage("Expecting statement...");

	//Looking for the Statement "P(EXPR)"
	if (currentToken.getTokenString() == "print"){
		putMessage("Found a print Statement!");
		currentToken = getNextToken();
		parsePStmt();

	// Looking for Statement: ID = EXPR
	}else if (currentToken.getTokenKind() == "char"){ 		
		parseIDExprStmt();

	// Looking for Statement: {StatementList}
	}else if (currentToken.getTokenString() == "{"){
		putMessage("Found a statementList");
		
		//Start a new scope level
		scope++;
		symbolTable.addNewScope();

		//Parses the StatementList, and 
		//if not closed up propperly gives an error
		parseStmtListStmt();

		//Close the scope level
		symbolTable.closeScope();
		scope--;

	//Looking for Statement: Variable Declaration (TYPE ID)
	}else if (currentToken.getTokenString() == "int" || currentToken.getTokenString() == "char"){
		putMessage("Found a VarDecl instead!");
		parseVD();

		//Catch all for improper statement.
	}else {
		setError();
		putMessage("EPIC FAIL!!! You're doin' it wrong.\n" + 
			   "To begin a statement you need one of four forms: \n" +
			   "P( Expression ) \n" +
			   "id = Expression \n" + 
			   "{StatementList} \n" +
			   "VarDecl");
	}	
}


function parseSList(){
	putMessage("Expecting a Statement List");

	//Special case for last Element due to lookAhead pointer in getNextToken()
	if(tokenIndex < tokenArray.length || currentToken.getTokenString() == "}"){
	
		//If not a squiggly brace, will parse a Statement then recursively call SList
		if(currentToken.getTokenString() != "}"){
			putMessage("If not the end of SList:");
			parseS();
			currentToken = getNextToken();
			parseSList();
		}
	//StatementList didn't get closed
	} else {
		putMessage("FAIL BOAT FAILS TO DOCK!! Close your statementList with a }!");
		setError();
	}
}



function parseE(){
	putMessage("Expecting an Expression");

	//checks flag
	if(inIntExpr){
		putMessage("Flag set intExpr");
		
		//if a digit, parse an Int Expression
		if(currentToken.getTokenKind() == "digit"){
			parseIE();

		//else checks for an id
		} else if (currentToken.getTokenKind() == "char"){
			parseId();

			//checks for id and is not an intType error
			if(checkTable(currentToken.getTokenString()) && !isOfType("intTYPE")){
				setError();
				putMessage("Internet Explorer, teaching you how to FAIL since 1995!" +
						  " A char cannot be used in an int Expression. ");
			}else{
				parseId();//parses it anyway
			}
		//Type Error
		}else{
			setError();
			putMessage("This fail brought to you by the letter FAIL!" + 
				   "\n An int expression can only accept digit or declared int variables");
		}

	//if not in an Int Expression			
	}else{
		//if a digit, parse an Int Expression
		if(currentToken.getTokenKind() == "digit"){
			putMessage("going to parseIE");		
			parseIE();

		//looks for possible ID
		}else if (currentToken.getTokenKind() == "char"){
			checkTable(currentToken.getTokenString())//sets a warning if not declared
			parseId();

		//if in character list parse a character expression
		}else if (currentToken.getTokenString() == "\""){
			parseCharExpr();
			
		//Type error
		}else {
			setError();
			putMessage("I find your lack of WIN disturbing.  May the FAIL be with you." + 
				   "\n An expression must start with a digit, char, or a charList");
		}
	}
}

function parseIE(){
	putMessage("Expecting an IntExpression...");

	//checks for digit
	if(currentToken.getTokenKind() == "digit"){
		putMessage("found a digit!"); 
		currentToken = getNextToken();

		//Op may follow, if so an Expression must follow the operand so we parse it.;
		if(currentToken.getTokenKind() == "op"){
			putMessage("found an op!");	 
			currentToken = getNextToken();
			inIntExpr = true;
			parseE();
			//putMessage("End of intExpression!");

		// If not operand, tokenIndex is now one spot ahead of where it should be, so we dec it.
		}else{	
			
			tokenIndex--;
			putMessage("End of Expression!");
			inIntExpr = false;
		}

	//checks for anything else
	} else {
		putMessage("FAIL!  Professor Happy Cat wants a digit.");
		setError();
	}
}


function parseCharExpr(){
	putMessage("Expecting an CharExpression...");

	// Looking for a CharList
	if(currentToken.getTokenString() == "\""){
		currentToken = getNextToken();
		parseCharList();
			
		// Checks for end of CharList
		if(currentToken.getTokenString() != "\""){
			setError();
			putMessage("Full of FAIL....learn how to CharExpress yourself better. " + 
				   "(CharExpr can only contain chars and closes with a \"");
		}

	//Needed a " to get in, but here for code coverage purposes and unforseen circumstance
	}else{
		setError();
		putMessage("Dude...This is an impossible fail.  WIN!!! ");
	}
}

function parseCharList(){
	putMessage("Expecting a CharList...");

	// Expecting a character or space
	if(currentToken.getTokenKind() == "char" || currentToken.getTokenString() == " "){
		putMessage("Found a character or a space!");
		currentToken = getNextToken();
		parseCharList();
	}
}

function parseVD(){
	putMessage("Expecting a Variable Declaration");

	// looking for "int" or "char"
	if(currentToken.getTokenKind() == "TYPE"){ 
		parseType();

		// new TYPE for symbolTable "charTYPE" and "intTYPE"
		var type = currentToken.getTokenString() + "TYPE"; 
		currentToken = getNextToken();
//		parseId();

		var id = currentToken.getTokenString(); // Sets ID

		//Makes new Symbol Token  and adds it to Symbol Table
		var symbol = new tokenFactory(id, type, currentToken.getTokenLineNumber(),
							currentToken.getTokenPosition()); 			
		symbolTable.addSymbol(symbol);

	//else fail			
	}else{ 
		setError(); 
		putMessage("Your TYPE is fail.");
	}
}

function parseType(){
	putMessage("Expecting a Type");

	//Sets error if kind is not TYPE
	if(currentToken.getTokenKind() != "TYPE"){
		setError();
		putMessage("This fail brought to you by the letter FAIL!");
	}	
}
		
function parseId(){
	putMessage("Expecting an ID");
	var tmp = new tokenFactory(currentToken.getTokenString(),symbolTable.findLastVarType(),
					currentToken.getTokenLineNumber(),currentToken.getTokenPosition());
//	putMessage("tmp type etc: \n" + tmp);
	usedIds.push(currentToken.getTokenString());

	//Sets error if kind is not Char
	if(currentToken.getTokenKind() != "char"){
		setError();
		putMessage("Your syntax is FAIL!!! You require a character.");
	}	
}


function getNextToken(){

	// for empty input
        var thisToken = EOF;    

	
        if (tokenIndex < tokenArray.length){
	    thisToken = tokenArray[tokenIndex];
	    putMessage("Current token: " + thisToken);
	    tokenIndex++;
        }
        return thisToken;
}


function setError(){	
	//Counts the number of Errors encountered
	errorCount++;
		
	//Only Sets the first errorIndex.
	if(errorIndex < 0){
		errorIndex = tokenIndex -1;
		errorIndexString = currentToken.getTokenPositionString();
	}
}
	
function setWarning(){	
	//sets flag for reporting, 
	warningFlag = true;	

	//pushes a new token onto an array so that all undeclared variables can be reported
	var token = new tokenFactory(currentToken.getTokenString(), "undeclared", currentToken.getTokenLineNumber(), currentToken.getTokenPosition())
	warningIndex.push(token);
}
	
/* 
 * Helper function to make more readable. 
 * Takes an id, and checks if it is in the 
 * symbol Table.  If not, it sets a warning
 * and returns false.  
 */
function checkTable(id){ 
 
	//Checks table
	if(symbolTable.isDeclared(id)){
		return true;
	}
		
	setWarning(); 
	return false;

}

/*
 * Helper function to make more readable.
 * Takes in a string that represents a TYPE
 * if a Symbol is declared in the Symbol Table 
 * and is of the right type, then it returns true.
 * Otherwise it returns false.
 */
function isOfType(symbolType){ //helper function to make code more readable
	if(symbolTable.getSymbolType(currentToken.getTokenString()) == symbolType){
		return true;
	}
	return false;
}	

//SubMethod for a Print Statement
function parsePStmt(){
	putMessage("Looking for a ( ...")

	if (currentToken.getTokenString() == "("){	
		putMessage("Found a ( !");
		currentToken = getNextToken();					

		//Parses expression.
		parseE();
		currentToken = getNextToken(); 

		// Looks for close perenthesis.
		if(currentToken.getTokenString() != ")"){
			putMessage("If not closed up properly.");
			setError();
			putMessage("ERREREREREREROR!!! You fail at life..." + 
				   "and need a statment of the" +
				   " form: P(EXPR)");
		}
	//didn't find a '('
	} else	{	
		putMessage("SYNTAX FAILLLL!!!!  Found a P, needs a (");
		setError();	
	}
}

	//Submethod for parsing a StatementList
function parseStmtListStmt(){
	putMessage("Found a { !");

	//Parses a StatementList
	currentToken = getNextToken();
	parseSList();

	//If statement doesn't close up properly
	if(currentToken.getTokenString() != "}"){
	putMessage("If not closed up properly.");
		setError();
		putMessage("ERREREREREREROR!!! YOU FAIL!!! to properly make a StatementList: {}");
	}
}

//Submethod for parsing an (ID=EXPR)
function parseIDExprStmt(){
	putMessage("Found an ID instead!");
	parseId();

	//saves an id and TYPE to work with in the symbol table
	var typeMatch = ""; 

	//has been Declared and thus in the SymbolTable
	if(checkTable(currentToken.getTokenString())){
		//finds the type of the declared id
		typeMatch = symbolTable.getSymbolType(currentToken.getTokenString());
	} 
				
	currentToken = getNextToken();
	putMessage("Looking for a = ...");

	if (currentToken.getTokenString() == "="){
		putMessage("Found an = !");
		currentToken = getNextToken();

		// if looking to set a char
		if(typeMatch == "charTYPE"){ 
			parseIDExprCharTYPEStmt(); //yes, we made this helper function just for the name.
			
		// if looking to set an int	
		}else if(typeMatch == "intTYPE"){ 
			parseIDExprIntTYPEStmt(); //This one too

		} else {//if(typeMatch == "")
		    parseE();
		}
	// Else fail
	}else{
		putMessage("Your doin' it wrong.  Found an id, needs an = !");
		setError();
	}
}


function parseIDExprCharTYPEStmt(){

	// looking for Id
	if(currentToken.getTokenKind() == "char"){ 
		parseId();

		// Valid ID
		if(isOfType("charTYPE")){
			parseE();

		// Invalid ID
		}else if(isOfType("intTYPE")){ 
			setError();
			putMessage("Go directly to FAIL, do not pass GO, do not collect $200! \n" +
  				   "A variable of type char cannot be set to a variable of type int");

		//Undeclared Variable
		}else{
			setWarning();
		}
	
	// looking for a Charlist
	}else if(currentToken.getTokenString()=="\""){
		parseE();
	
	// invalid characters				
	} else { 
		setError();
		putMessage("All your FAIL are belong to us! \n" +
			   "A variable of type char can only be set to a char.");
		if(currentToken.getTokenKind() == "digit"){
			parseIE();
		}
	}
}

function parseIDExprIntTYPEStmt(){
	// parse if digit
	if(currentToken.getTokenKind() == "digit"){ 
		parseE();

	// possible ID
	}else if(currentToken.getTokenKind() == "char"){
		parseId();

		//Valid ID 
		if(isOfType("intTYPE")){ 
			parseE();

		//Invalid ID
		}else if(isOfType("charTYPE")){ 
		       setError();
		       putMessage("Well the FAIL store called, and they're running out of YOU! \n" +
				  "Need to set the variable to a digit or a numerical id");
	
		//Undeclared Variable
		}else{
			setWarning(); 
		}

	// Invalid Input
	} else { 
		setError();
		putMessage("All your FAIL are belong to us! \n" +
			   "A variable of type int can only be set to a numerical expression.");
		if(currentToken.getTokenString() == "\""){
			parseCharExpr();
		}
	}
}


