

function treeNode(parent, scopeNumber, symbolTable, children){
	this.parent = parent;
	this.scopeNumber = scopeNumber;
	this.symbolTable = symbolTable;
	this.children = children; //new Array();
	this.toString = function(){
				if(this.children.length > 0){
					var childIndices = new Array();
					var i = 0;
					while (i < this.children.length){
						childIndices[i] = getScopeNumber(this.children[i]);
						i++;
					}
					return scopeNumber + ": " + symbolTable + ", Parent(" + parent + ")" + ", Children(" + childIndices + ")";
				}else{
					return scopeNumber + ": " + symbolTable + ", Parent(" + parent + ")" + ", Children( no children )";
				}
			       }
}

function addChild(parentNode, childNode){
	var tempArray = getChildren(parentNode);
	tempArray.push(childNode);
	
	parentNode.children = tempArray;
	return parentNode;		
}

function setParent(currentNode,parentNode){
	var temp = new treeNode(parentNode,getScopeNumber(currentNode),getSymbolTable(currentNode));
	return temp;
}

function getParent(currentNode){
	return currentNode.parent;
}

function setScopeNumber(currentNode, scopeNumber){
	var temp = new treeNode(getParent(currentNode),scopeNumber,getSymbolTable(currentNode));
	return temp;
}	

function getScopeNumber(currentNode){
	return currentNode.scopeNumber;
}

function setSymbolTable(currentNode, symbolTable){
	var temp = new treeNode(getParent(currentNode),getScopeNumber(currentNode),symbolTable);
	return temp;
}

function getSymbolTable(currentNode){
	return currentNode.symbolTable;

}

function getChildren(currentNode){
	return currentNode.children;
}
