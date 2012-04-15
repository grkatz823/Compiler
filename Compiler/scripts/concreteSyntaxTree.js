//*****************************************
//* treeDemo.js
//*     
//* By Alan G. Labouseur, based on the 2009 
//* work by Michael Ardizzone and Tim Smith.
//******************************************

var Tree = function() {
    // Initialize the (empty) object that we're building.
    var t = {};

    // Note the root node of this tree.
    t.root = null;

    // Note the current node of the tree we're building.
    t.cur = {};
    
    //********************************************
    //* Add an interior (branch) node to the tree.
    //********************************************
    t.addBranchNode = function(name) {
        // Construct the node object.
        var node = {name: name, children: [], parent: {}};

        // Check to see if it needs to be the root node.
        if (!t.root) 
        {
            // We are the root node.
            t.root = node;
        } 
        else 
        {
            // We are the children.  
            // Make our parent the CURrent node...            
            node.parent = t.cur;
            // ... and add ourselves (via the unfrotunately-named 
            // "push" function) to the children of the current node.
            t.cur.children.push(node);
        }

        // Update the CURrent node pointer to ourselves.
        t.cur = node;
    }

    //******************************
    //* Add a leaf node to the tree.
    //******************************
    t.addLeafNode = function(name) {
        // Construct the node object.
        var node = {name: name, children: [], parent: {}};

        // Check to see if it needs to be the root node. (It should not be.)
        if (!t.root) 
        {
            // We are the root node.
            t.root = node;
        } 
        else 
        {
            // Add ourselves (via the unfrotunately-named 
            // "push" function) to the children of the current node.
            t.cur.children.push(node);
        }
    }

    t.endChildren = function() {
        // Note that we're done with this branch of the tree
        // by moving "up" to our parent node (if possible).
        if (t.cur.parent) 
        {
            t.cur = t.cur.parent;
        }    
    }

    //*********************************************
    //* Return a string representation of the tree. 
    //*********************************************
    t.toString = function() {
        // Initialize the result string.
        traversalResult = "";
        
        // Recursive function to handle the expansion of the nodes.
        function expand(node, depth) 
        {
            // Space out based on the current depth so
            // this looks at least a little tree-like.
            for (var i=0; i < depth; i++) 
            {
                traversalResult += "-";
            }

            // If there are no children (i.e., leaf nodes)...
            if (!node.children || node.children.length==0) 
            {
                // ... note the leaf node.
                traversalResult += "[" + node.name + "]";                
                traversalResult += "\n";
            }
            else
            {
                // There are children, so note these interior/branch nodes and ...
                traversalResult += "<" + node.name + "> \n";
                // .. recursively expand them.
                for (var i = 0; i < node.children.length; i++) 
                {
                    expand(node.children[i], depth + 1);
                }               
            }
        }
        
        // Make the initial call to expand from the root.
        expand(t.root, 0);
        
        // Return the result.
        return traversalResult;
    }
    
    // Finally, return a reference to ourselves.
    return t;
}


/*function concreteSyntaxTree(root){
	this.currentParent = null
	this.root = root;
	this.toString(
}

function concreteNode(identifier,parent, children, scope){
	this.identifier = identifier;
	this.parent = parent;
	this.children = children;
	this.scope = scope;
	this.toString = function(){
				if(this.children.length > 0){
					var childIndices = new Array();
					var i = 0;
					while (i < this.children.length){
						childIndices[i] = getScopeNumber(this.children[i]);
						i++;
					}
					return identifier + ": " + scope + ", Parent(" + parent + ")" + ", Children(" + childIndices + ")";
				}else{
					return identifier + ": " + scope + ", Parent(" + parent + ")" + ", Children( no children )";
				}
			       }

}
function isRoot(tree){
	if (tree.parent == null){
		return true;
	}
	return false;
}

function addBranch(tree,node){
//	var newNode
	if (tree.root == null){
		tree.root = node;
	} else {
		addChild(tree.currentParent,node);
		setParent(node,tree.currentParent);
		tree.currentParent = node;
		
	}
	
		
}
*/
