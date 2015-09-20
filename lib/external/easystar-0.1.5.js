(function(window,undefined){
    
    


//NameSpace
var EasyStar = EasyStar || {};

/**
* A simple Node that represents a single tile on the grid.
* @param {Object} parent The parent node.
* @param {Number} x The x position on the grid.
* @param {Number} y The y position on the grid.
* @param {Number} costSoFar How far this node is in moves*cost from the start.
* @param {Number} simpleDistanceToTarget Manhatten distance to the end point.
**/
EasyStar.Node = function(parent, x, y, costSoFar, simpleDistanceToTarget) {
	this.parent = parent;
	this.x = x;
	this.y = y;
	this.costSoFar = costSoFar;
	this.simpleDistanceToTarget = simpleDistanceToTarget;

	/**
	* @return {Number} Best guess distance of a cost using this node.
	**/
	this.bestGuessDistance = function() {
		return this.costSoFar + this.simpleDistanceToTarget;
	};
};

//Constants
EasyStar.Node.OPEN_LIST = 0;
EasyStar.Node.CLOSED_LIST = 1;
/**
* This is an improved Priority Queue data type implementation that can be used to sort any object type.
* It uses a technique called a binary heap.
* 
* For more on binary heaps see: http://en.wikipedia.org/wiki/Binary_heap
* 
* @param {String} criteria The criteria by which to sort the objects. 
* This should be a property of the objects you're sorting.
* 
* @param {Number} heapType either PriorityQueue.MAX_HEAP or PriorityQueue.MIN_HEAP.
**/
EasyStar.PriorityQueue = function(criteria,heapType) {
	this.length = 0; //The current length of heap.
	var queue = [];
	var isMax = false;

	//Constructor
	if (heapType==EasyStar.PriorityQueue.MAX_HEAP) {
		isMax = true;
	} else if (heapType==EasyStar.PriorityQueue.MIN_HEAP) {
		isMax = false;
	} else {
		throw heapType + " not supported.";
	}

	/**
	* Inserts the value into the heap and sorts it.
	* 
	* @param value The object to insert into the heap.
	**/
	this.insert = function(value) {
		if (!value.hasOwnProperty(criteria)) {
			throw "Cannot insert " + value + " because it does not have a property by the name of " + criteria + ".";
		}
		queue.push(value);
		this.length++;
		this.bubbleUp(this.length-1);
	};

	/**
	* Peeks at the highest priority element.
	*
	* @return the highest priority element
	**/
	this.getHighestPriorityElement = function() {
		return queue[0];
	};

	/**
	* Removes and returns the highest priority element from the queue.
	*
	* @return the highest priority element
	**/
	this.shiftHighestPriorityElement = function() {
		if (this.length === 0) {
			throw ("There are no more elements in your priority queue.");
		} else if (this.length === 1) {
			var onlyValue = queue[0];
			queue = [];
                        this.length = 0;
			return onlyValue;
		}
		var oldRoot = queue[0];
		var newRoot = queue.pop();
		this.length--;
		queue[0] = newRoot;
		this.swapUntilQueueIsCorrect(0);
		return oldRoot;
	};

	this.bubbleUp = function(index) {
		if (index===0) {
			return;
		}
		var parent = this.getParentOf(index);
		if (this.evaluate(index,parent)) {
			this.swap(index,parent);
			this.bubbleUp(parent);
		} else {
			return;
		}
	};

	this.swapUntilQueueIsCorrect = function(value) {
		var left = this.getLeftOf(value);
		var right = this.getRightOf(value);
		if (this.evaluate(left,value)) {
			this.swap(value,left);
			this.swapUntilQueueIsCorrect(left);
		} else if (this.evaluate(right,value)) {
			this.swap(value,right);
			this.swapUntilQueueIsCorrect(right);
		} else if (value==0) {
			return;
		} else {
			this.swapUntilQueueIsCorrect(0);
		}
	};

	this.swap = function(self,target) {
		var placeHolder = queue[self];
		queue[self] = queue[target];
		queue[target] = placeHolder;
	};

	this.evaluate = function(self,target) {
		if (queue[target]===undefined||queue[self]===undefined) {
			return false;
		}

		//Check if the criteria should be the result of a function call.
		if (typeof queue[self][criteria] === 'function') {
			var selfValue = queue[self][criteria]();
			var targetValue = queue[target][criteria]();
		} else {
			var selfValue = queue[self][criteria];
			var targetValue = queue[target][criteria];
		}

		if (isMax) {
			if (selfValue > targetValue) {
				return true;
			} else {
				return false;
			}
		} else {
			if (selfValue < targetValue) {
				return true;
			} else {
				return false;
			}
		}
	};

	this.getParentOf = function(index) {
		return Math.floor(index/2)-1;
	};

	this.getLeftOf = function(index) {
		return index*2 + 1;
	};

	this.getRightOf = function(index) {
		return index*2 + 2;
	};
};

//Constants
EasyStar.PriorityQueue.MAX_HEAP = 0;
EasyStar.PriorityQueue.MIN_HEAP = 1;
/**
 * Represents a single instance of EasyStar.
 * A path that is in the queue to eventually be found.
 */
EasyStar.instance = function() {
	this.isDoneCalculating = true;
	this.pointsToAvoid = {};
	this.startX;
	this.callback;
	this.startY;
	this.endX;
	this.endY;
	this.nodeHash = {};
	this.openList;
};
/**
*	EasyStar.js
*	github.com/prettymuchbryce/EasyStarJS
*	Licensed under the MIT license.
* 
*	Implementation By Bryce Neal (@prettymuchbryce)
**/
EasyStar.js = function() {
	var STRAIGHT_COST = 10;
	var DIAGONAL_COST = 14; 
        var TURN_COST = 30;
	var pointsToAvoid = {};
	var collisionGrid;
	var costMap = {};
	var iterationsSoFar;
	var instances = [];
	var iterationsPerCalculation = Number.MAX_VALUE;
	var acceptableTiles;
	var diagonalsEnabled = false;

	/**
	* Sets the collision grid that EasyStar uses.
	* 
	* @param {Array|Number} tiles An array of numbers that represent 
	* which tiles in your grid should be considered
	* acceptable, or "walkable".
	**/
	this.setAcceptableTiles = function(tiles) {
		if (tiles instanceof Array) {
			//Array
			acceptableTiles = tiles;
		} else if (!isNaN(parseFloat(tiles)) && isFinite(tiles)) {
			//Number
			acceptableTiles = [tiles];
		}
	};

	/**
	 * Enable diagonal pathfinding.
	 */
	this.enableDiagonals = function() {
		diagonalsEnabled = true;
	};

	/**
	 * Disable diagonal pathfinding.
	 */
	this.disableDiagonals = function() {
		diagonalsEnabled = false;
	};

	/**
	* Sets the collision grid that EasyStar uses.
	* 
	* @param {Array} grid The collision grid that this EasyStar instance will read from. 
	* This should be a 2D Array of Numbers.
	**/
	this.setGrid = function(grid) {
		collisionGrid = grid;

		//Setup cost map
		for (var y = 0; y < collisionGrid.length; y++) {
			for (var x = 0; x < collisionGrid[0].length; x++) {
				if (!costMap[collisionGrid[y][x]]) {
					costMap[collisionGrid[y][x]] = 1
				}
			}
		}
	};

	/**
	* Sets the tile cost for a particular tile type.
	*
	* @param {Number} The tile type to set the cost for.
	* @param {Number} The multiplicative cost associated with the given tile.
	**/
	this.setTileCost = function(tileType, cost) {
		costMap[tileType] = cost;
	};

	/**
	* Sets the number of search iterations per calculation. 
	* A lower number provides a slower result, but more practical if you 
	* have a large tile-map and don't want to block your thread while
	* finding a path.
	* 
	* @param {Number} iterations The number of searches to prefrom per calculate() call.
	**/
	this.setIterationsPerCalculation = function(iterations) {
		iterationsPerCalculation = iterations;
	};
	
	/**
	* Avoid a particular point on the grid, 
	* regardless of whether or not it is an acceptable tile.
	*
	* @param {Number} x The x value of the point to avoid.
	* @param {Number} y The y value of the point to avoid.
	**/
	this.avoidAdditionalPoint = function(x, y) {
		pointsToAvoid[x + "_" + y] = 1;
	};

	/**
	* Stop avoiding a particular point on the grid.
	*
	* @param {Number} x The x value of the point to stop avoiding.
	* @param {Number} y The y value of the point to stop avoiding.
	**/
	this.stopAvoidingAdditionalPoint = function(x, y) {
		delete pointsToAvoid[x + "_" + y];
	};

	/**
	* Stop avoiding all additional points on the grid.
	**/
	this.stopAvoidingAllAdditionalPoints = function() {
		pointsToAvoid = {};
	};

	/**
	* Find a path.
	* 
	* @param {Number} startX The X position of the starting point.
	* @param {Number} startY The Y position of the starting point.
	* @param {Number} endX The X position of the ending point.
	* @param {Number} endY The Y position of the ending point.
	* @param {Function} callback A function that is called when your path
	* is found, or no path is found.
	* 
	**/
	this.findPath = function(startX, startY ,endX, endY, callback) {
		//No acceptable tiles were set
		if (acceptableTiles === undefined) {
			throw "You can't set a path without first calling setAcceptableTiles() on EasyStar.";
		}
		//No grid was set
		if (collisionGrid === undefined) {
			throw "You can't set a path without first calling setGrid() on EasyStar.";
		}

		//Start or endpoint outside of scope.
		if (startX < 0 || startY < 0 || endX < 0 || endX < 0 || 
		startX > collisionGrid[0].length-1 || startY > collisionGrid.length-1 || 
		endX > collisionGrid[0].length-1 || endY > collisionGrid.length-1) {
			throw "Your start or end point is outside the scope of your grid.";
		}

		//Start and end are the same tile.
		if (startX===endX && startY===endY) {
			callback([]);
		}

		//End point is not an acceptable tile.
               
		var endTile = collisionGrid[endY][endX];
		var isAcceptable = false;
		for (var i = 0; i < acceptableTiles.length; i++) {
			if (endTile === acceptableTiles[i]) {
				isAcceptable = true;
				break;
			}
		}

		if (isAcceptable === false) {
			callback(null);
			return;
		}

		//Create the instance
		var instance = new EasyStar.instance();
		instance.openList = new EasyStar.PriorityQueue("bestGuessDistance",EasyStar.PriorityQueue.MIN_HEAP);
		instance.isDoneCalculating = false;
		instance.nodeHash = {};
		instance.startX = startX;
		instance.startY = startY;
		instance.endX = endX;
		instance.endY = endY;
		instance.callback = callback;
		
		instance.openList.insert(this.coordinateToNode(instance, instance.startX, 
			instance.startY, null, STRAIGHT_COST));
		
		instances.push(instance);
	};

	/**
	* This method steps through the A* Algorithm in an attempt to
	* find your path(s). It will search 4 tiles for every calculation.
	* You can change the number of calculations done in a call by using
	* easystar.setIteratonsPerCalculation().
	**/
	this.calculate = function() {
		if (instances.length === 0 || collisionGrid === undefined || acceptableTiles === undefined) {
			return;
		}
		for (iterationsSoFar = 0; iterationsSoFar < iterationsPerCalculation; iterationsSoFar++) {
			if (instances.length === 0) {
				return;
			}

			//Couldn't find a path.
			if (instances[0].openList.length===0) {
				instances[0].callback(null);
				instances.shift();
				continue;
			}

			var searchNode = instances[0].openList.shiftHighestPriorityElement();
			searchNode.list = EasyStar.Node.CLOSED_LIST;

			if (searchNode.y > 0) {
				this.checkAdjacentNode(instances[0], searchNode, 0, -1, STRAIGHT_COST * 
					costMap[collisionGrid[searchNode.y-1][searchNode.x]]);
				if (instances[0].isDoneCalculating===true) {
					instances.shift();
					continue;
				}
			}
			if (searchNode.x < collisionGrid[0].length-1) {
				this.checkAdjacentNode(instances[0], searchNode, 1, 0, STRAIGHT_COST *
					costMap[collisionGrid[searchNode.y][searchNode.x+1]]);
				if (instances[0].isDoneCalculating===true) {
					instances.shift();
					continue;
				}
			}
			if (searchNode.y < collisionGrid.length-1) {
				this.checkAdjacentNode(instances[0], searchNode, 0, 1, STRAIGHT_COST *
					costMap[collisionGrid[searchNode.y+1][searchNode.x]]);
				if (instances[0].isDoneCalculating===true) {
					instances.shift();
					continue;
				}
			}
			if (searchNode.x > 0) {
				this.checkAdjacentNode(instances[0], searchNode, -1, 0, STRAIGHT_COST *
					costMap[collisionGrid[searchNode.y][searchNode.x-1]]);
				if (instances[0].isDoneCalculating===true) {
					instances.shift();
					continue;
				}
			}
			if (diagonalsEnabled) {
				if (searchNode.x > 0 && searchNode.y > 0) {
					this.checkAdjacentNode(instances[0], searchNode, -1, -1,  DIAGONAL_COST *
						costMap[collisionGrid[searchNode.y-1][searchNode.x-1]]);
					if (instances[0].isDoneCalculating===true) {
						instances.shift();
						continue;
					}
				}
				if (searchNode.x < collisionGrid[0].length-1 && searchNode.y < collisionGrid.length-1) {
					this.checkAdjacentNode(instances[0], searchNode, 1, 1, DIAGONAL_COST *
						costMap[collisionGrid[searchNode.y+1][searchNode.x+1]]);
					if (instances[0].isDoneCalculating===true) {
						instances.shift();
						continue;
					}
				}
				if (searchNode.x < collisionGrid[0].length-1 && searchNode.y > 0) {
					this.checkAdjacentNode(instances[0], searchNode, 1, -1, DIAGONAL_COST *
						costMap[collisionGrid[searchNode.y-1][searchNode.x+1]]);
					if (instances[0].isDoneCalculating===true) {
						instances.shift();
						continue;
					}
				}
				if (searchNode.x > 0 && searchNode.y < collisionGrid.length-1) {
					this.checkAdjacentNode(instances[0], searchNode, -1, 1, DIAGONAL_COST *
						costMap[collisionGrid[searchNode.y+1][searchNode.x-1]]);
					if (instances[0].isDoneCalculating===true) {
						instances.shift();
						continue;
					}
				}
			}
		}
	};


var prev_direction = {x:0,y:0};

	this.checkAdjacentNode = function(instance, searchNode, x, y, cost) {
		var adjacentCoordinateX = searchNode.x+x;
		var adjacentCoordinateY = searchNode.y+y;
		
                if(prev_direction.x != x || prev_direction.y != y){
                    // there is a change of direction
                    // add some cost to it
                    cost += TURN_COST;
                    prev_direction = {x:x,y:y};
                }
                
                
		if (instance.endX === adjacentCoordinateX && instance.endY === adjacentCoordinateY) {
			instance.isDoneCalculating = true;
			var path = [];
			var pathLen = 0;
			path[pathLen] = {y: adjacentCoordinateX, x: adjacentCoordinateY};
			pathLen++;
			path[pathLen] = {y: searchNode.x, x:searchNode.y};
			pathLen++;
			var parent = searchNode.parent;
			while (parent!=null) {
				path[pathLen] = {y: parent.x, x:parent.y};
				pathLen++;
				parent = parent.parent;
			}
			path.reverse();
			instance.callback(path);
		}

		if (pointsToAvoid[adjacentCoordinateX + "_" + adjacentCoordinateY] === undefined) {
			for (var i = 0; i < acceptableTiles.length; i++) {
				if (collisionGrid[adjacentCoordinateY][adjacentCoordinateX] === acceptableTiles[i]) {
					
					var node = this.coordinateToNode(instance, adjacentCoordinateX, 
						adjacentCoordinateY, searchNode, cost);
					
					if (node.list === undefined) {
						node.list = EasyStar.Node.OPEN_LIST;
						instance.openList.insert(node);
					} else if (node.list === EasyStar.Node.OPEN_LIST) {
						if (searchNode.costSoFar + cost < node.costSoFar) {
							node.costSoFar = searchNode.costSoFar + cost;
							node.parent = searchNode;
						}
					}
					break;
				}
			}

		}
	};

	//Helpers

	this.coordinateToNode = function(instance, x, y, parent, cost) {
		if (instance.nodeHash[x + "_" + y]!==undefined) {
			return instance.nodeHash[x + "_" + y];
		}
		var simpleDistanceToTarget = this.getDistance(x, y, instance.endX, instance.endY);
		if (parent!==null) {
			var costSoFar = parent.costSoFar + cost;
		} else {
			costSoFar = simpleDistanceToTarget;
		}
		var node = new EasyStar.Node(parent,x,y,costSoFar,simpleDistanceToTarget);
		instance.nodeHash[x + "_" + y] = node;
		return node;
	};

	this.getDistance = function(x1,x2,y1,y2) {
		return Math.floor(Math.abs(x2-x1) + Math.abs(y2-y1));
	};

};

window.EasyStar = EasyStar;

}(window));