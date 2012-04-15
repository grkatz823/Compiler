/* --------  
 lex.js
 
 lexicon functions.
 -------- */

function lex(){
  
  // Grab the "raw" source code.
  var sourceCode = document.getElementById("taSourceCode").value;
  // Trim the leading and trailing spaces.
  sourceCode = trim(sourceCode);

  var lineNumber = 0;
  var positionIndex = -1;
  var currentToken;
  var currentChar = "";
  var index=0;

  //For loop goes through every character of the inputStream and makes an array of Tokens
  while(index<sourceCode.length){
    currentChar = sourceCode.charAt(index);
    positionIndex++;

    // increment line number whenever we see a line break
    // and reset the position
    if(currentChar == '\n'){
      lineNumber++;
      positionIndex = -1;
    }
    // if in a charlist, just make tokens, don't look for TYPE identifyers
    if(inCharList){
      if(currentChar != "\""){//looking for the end of CharList
 	if(currentChar != '\t' && currentChar != '\n'){// gets rid of '\t', '\n' in charList 
	   makeToken(currentChar, getKind(currentChar),lineNumber, positionIndex);
	}
      } else {//found a quotation and sets flag that CharList is closed.
	 makeToken(currentChar, "other",lineNumber, positionIndex);
         setCharListFlag();
      }
    } else {

	if(currentChar == '"'){//looks for beginning of CharList and makes a token
  	   makeToken(currentChar, "other",lineNumber, positionIndex);
           setCharListFlag();

        } else if(isNormalCharacter(currentChar)){//anything but c,i,p,' ',\n, or \t
   	   makeToken(currentChar, getKind(currentChar),lineNumber, positionIndex);

	} else if(currentChar == 'p'){//looking for keyword print
		
		if(isTypePrint(sourceCode,index)){
		 	//If is keyword Print, make a token, and increase the loop counter to skip the rest of the word
	  	 	makeToken("print", "keyword",lineNumber, positionIndex);
		 	index = index+4;
			positionIndex = positionIndex+4;  
		} else {
		  	makeToken(currentChar, "char",lineNumber, positionIndex);			
 	       }
			
        } else if(currentChar == 'c'){//looking for TYPE char
        	if(isTypeChar(sourceCode,index)){
			 //if is Type Char, make a token, and increase the loop counter to skip the rest of the word
		  	 makeToken("char", "TYPE",lineNumber, positionIndex);
	      		 index = index + 3;     
			 positionIndex = positionIndex+3; 
       		} else { //not a TYPE char, make a token

		  	 makeToken(currentChar, "char",lineNumber, positionIndex);
 	       }

      	} else if(currentChar == 'i'){//looking for TYPE int
        	if(isTypeInt(sourceCode,index)){

		 	//If is Type Int, make a token, and increase the loop counter to skip the rest of the word
	  	 	makeToken("int", "TYPE",lineNumber, positionIndex);
		 	index = index + 2;
			positionIndex = positionIndex+2; 			
       		 } else {// not a TYPE int, make a token

	  	     makeToken(currentChar, "char",lineNumber, positionIndex);

      		}
        
      } else { /* currentChar == '\t', ' ', '\n' make no token */ }
    }
   index++;
  }
     //Accepts a program where the user may or may not put a $ on the end of a valid program
     if(tokenArray[tokenArray.length-1].getTokenString() == "$"){
	tokenArray.pop();
     }
       makeToken("$", "EOF",lineNumber, positionIndex);
}


function isDigit(n){// looks for 0-9
  if(n == '1' || n == '2' || n == '3' || n == '4' || n == '5' || n == '6' || n == '7' || n == '8' || n == '9' || n == '0'){
    return true;
  } 
  
  return false;
}

function isChar(n){//only looks for lowercase chars
  if(n == 'a' || n == 'b' || n == 'c' || n == 'd' || n == 'e' || n == 'f' || n == 'g' || n == 'h' || n == 'i' || n == 'j' ||
     n == 'k' || n == 'l' || n == 'm' || n == 'n' || n == 'o' || n == 'p' || n == 'q' || n == 'r' || n == 's' || n == 't' ||
     n == 'u' || n == 'v' || n == 'w' || n == 'x' || n == 'y' || n == 'z'){
    return true;
  } 
  
  return false;
}

function isOp(n){// only looks for +,-
  if(n == '+' || n == '-'){
    return true;
  }
  
  return false;
}

function setCharListFlag(){//Sets flag signalling the entrance or exit of a CharList
  if(inCharList){
    inCharList = false;
  } else {
    inCharList = true;
  }
}

function isNormalCharacter(n){//looks for characters that need no additional checking
  if(n != 'c' && n != 'i' && n != 'p' && n != ' ' && n != '\t' && n != '\n'){
    return true;
  }
  
  return  false;
}

function getKind(n){// looks at the char and infers what kind of terminal it is based on the grammar
  var kind;
  
  if(isDigit(n)){
    kind = "digit";
  } else if (isChar(n)){
    kind = "char";
  } else if (isOp(n)){
    kind = "op";   
  } else {
    kind = "other";
  }
  
  return kind;
}

function isTypeChar(sourceCode, i){//looks for the identifier word 'char'
  if(sourceCode.charAt(i+1) == 'h' && sourceCode.charAt(i+2) == 'a' && sourceCode.charAt(i+3) == 'r'){
     return true;
  }
  
  return false;
  
}

function isTypePrint(sourceCode, i){//looks for the identifier word 'print'
  if(sourceCode.charAt(i+1) == 'r' && sourceCode.charAt(i+2) == 'i' && sourceCode.charAt(i+3) == 'n' && sourceCode.charAt(i+4) == 't'){
     return true;
  }
  return false;
}

function isTypeInt(sourceCode, i){//looks for the identifier word 'int'
  if(sourceCode.charAt(i+1) == 'n' && sourceCode.charAt(i+2) == 't'){
        return true;
      }
  return false;
}

function makeToken(string, kind, lineNumber, position){// Helper function for making and pushing tokens

  	   currentToken = new tokenFactory(string, kind, lineNumber, position);
	   tokenArray.push(currentToken);
}


