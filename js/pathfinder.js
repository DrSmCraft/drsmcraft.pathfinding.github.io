const UPPER_BOUND = 20;


function hashPosition() {
    switch (arguments.length) {
        case 1:
            return "(" + arguments[0].x + "," + arguments[0].y + ")";
        case 2:
            return "(" + arguments[0] + "," + arguments[1] + ")";
    }
}

function euclideanDistance(pt1, pt2) {
    return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
}

function manhattanDistance(pt1, pt2) {
    return Math.abs(pt2.x - pt1.x) + Math.abs(pt2.y - pt1.y);
}

function penalizeHorizontal(pt1, pt2) {
    return pt2.x - pt1.x;
}

function penalizeVertical(pt1, pt2) {
    return pt2.y - pt1.y;
}

class Pathfinder {

    constructor(graph, source, target, obstacles) {
        this.graph = graph;
        this.source = source;
        this.target = target;
        this.targetHash = hashPosition(target);
        this.obstacles = obstacles;
        this.done = false;
        this.step = 0;
        this.reachedTarget = false;
    }

    runOneStep() {

    }


}

// Taken from https://en.wikipedia.org/wiki/Dijkstra's_algorithm#Pseudocode
class Dijkstra extends Pathfinder {
    constructor(graph, source, target, obstacles) {
        super(graph, source, target, obstacles);
        this.q = {};
        this.hashes = {};
        this.dist = {};
        this.prev = {};
        this.allowDiagonals = false;


        for (let i = 0; i < graph.length; i++) {
            let point = graph[i];
            let hashPoint = hashPosition(point);
            this.dist[hashPoint] = Number.MAX_VALUE;
            this.prev[hashPoint] = null;
            this.q[hashPoint] = point;
            this.hashes[hashPoint] = point;


        }
        this.dist[hashPosition(source)] = 0;
    }

    runOneStep() {
        if (this.u == this.targetHash) {
            this.done = true;
            this.reachedTarget = true;

            return;
        }

        this.step++;
        this.u = this.getNodeWithMinDistance();

        if (this.u == null) {
            this.done = true;
            this.reachedTarget = false;
            return;
        }

        let node = this.q[this.u];

        delete this.q[this.u];


        let neighbors = this.getNeighborsOfNode(node);
        for (let i = 0; i < neighbors.length; i++) {

            let v = neighbors[i];
            if (hashPosition(v) in this.q) {
                let alt = this.dist[this.u] + 1 + this.heuristicValue(node, this.target); // In a grid all weights are 1

                if (alt < this.dist[hashPosition(v)]) {
                    this.dist[hashPosition(v)] = alt;
                    this.prev[hashPosition(v)] = this.u;
                }
            }
        }
    }

    getNodeWithMinDistance() {

        let min = Number.MAX_VALUE;
        let minNode = null;

        for (const node in this.dist) {
            if (this.dist[node] < min && node in this.q) {
                min = this.dist[node];
                minNode = node;
            }
        }
        return minNode;
    }

    getNeighborsOfNode(node) {
        let nodes = []

        let left = {x: node.x - 1, y: node.y};
        let right = {x: node.x + 1, y: node.y};
        let up = {x: node.x, y: node.y - 1};
        let down = {x: node.x, y: node.y + 1};


        if (!(hashPosition(left) in this.obstacles)) {
            if (left.x > -1 && left.x < UPPER_BOUND && left.y > -1 && left.y < UPPER_BOUND) {
                nodes.push(left);
            }
        }

        if (!(hashPosition(right) in this.obstacles)) {
            if (right.x > -1 && right.x < UPPER_BOUND && right.y > -1 && right.y < UPPER_BOUND) {
                nodes.push(right);
            }
        }

        if (!(hashPosition(up) in this.obstacles)) {
            if (up.x > -1 && up.x < UPPER_BOUND && up.y > -1 && up.y < UPPER_BOUND) {
                nodes.push(up);
            }
        }

        if (!(hashPosition(down) in this.obstacles)) {
            if (down.x > -1 && down.x < UPPER_BOUND && down.y > -1 && down.y < UPPER_BOUND) {
                nodes.push(down);
            }
        }

        if (this.allowDiagonals) {
            let upperLeft = {x: node.x - 1, y: node.y - 1};
            let upperRight = {x: node.x + 1, y: node.y - 1};
            let lowerLeft = {x: node.x - 1, y: node.y + 1};
            let lowerRight = {x: node.x + 1, y: node.y + 1};


            if (!(hashPosition(upperLeft) in this.obstacles)) {
                if (upperLeft.x > -1 && upperLeft.x < UPPER_BOUND && upperLeft.y > -1 && upperLeft.y < UPPER_BOUND) {
                    nodes.push(upperLeft);
                }
            }

            if (!(hashPosition(upperRight) in this.obstacles)) {
                if (upperRight.x > -1 && upperRight.x < UPPER_BOUND && upperRight.y > -1 && upperRight.y < UPPER_BOUND) {
                    nodes.push(upperRight);
                }
            }

            if (!(hashPosition(lowerLeft) in this.obstacles)) {
                if (lowerLeft.x > -1 && lowerLeft.x < UPPER_BOUND && lowerLeft.y > -1 && lowerLeft.y < UPPER_BOUND) {
                    nodes.push(lowerLeft);
                }
            }

            if (!(hashPosition(lowerRight) in this.obstacles)) {
                if (lowerRight.x > -1 && lowerRight.x < UPPER_BOUND && lowerRight.y > -1 && lowerRight.y < UPPER_BOUND) {
                    nodes.push(lowerRight);
                }
            }
        }

        return nodes;


    }

    getPathToTarget() {
        let lst = [];

        let prev = this.prev[this.targetHash];
        while (prev != null) {
            lst.push(this.hashes[prev]);
            prev = this.prev[prev];
        }
        return lst;
    }

    getDistances() {
        let lst = [];
        for (const distKey in this.dist) {
            let point = this.hashes[distKey];
            let dist = this.dist[distKey];
            if (dist < Number.MAX_VALUE)
                lst.push({point: point, dist: dist});
        }

        return lst;
    }

    heuristicValue(node, targetNode) {
        return 0;
    }


}


class AStar extends Dijkstra {
    constructor(graph, source, target, obstacles) {
        super(graph, source, target, obstacles);
        this.heuristicType = 'euclidean';

    }


    heuristicValue(node, targetNode) {
        if (this.heuristicType == 'euclidean') {
            return euclideanDistance(node, targetNode) / euclideanDistance(this.source, this.target);
        } else if (this.heuristicType == 'manhattan') {
            return manhattanDistance(node, targetNode) / manhattanDistance(this.source, this.target);
        } else if (this.heuristicType == 'penalizeHorizontal') {
            return penalizeHorizontal(node, targetNode) / manhattanDistance(this.source, this.target);
        } else if (this.heuristicType == 'penalizeVertical') {
            return penalizeVertical(node, targetNode) / manhattanDistance(this.source, this.target);
        }
        return 0;
    }


}








