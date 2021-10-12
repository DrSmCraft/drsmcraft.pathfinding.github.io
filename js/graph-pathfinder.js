class GraphPathfinder {

    constructor(graph, source, target) {
        this.graph = graph;
        this.source = source;
        this.target = target;
        this.done = false;
        this.step = 0;
        this.reachedTarget = false;
    }

    runOneStep() {

    }


}

// Taken from https://en.wikipedia.org/wiki/Dijkstra's_algorithm#Pseudocode
class GraphDijkstra extends GraphPathfinder {
    constructor(graph, source, target) {
        super(graph, source, target);
        this.q = {};
        this.hashes = {};
        this.dist = {};
        this.prev = {};
        this.allowDiagonals = false;


        for (let i = 0; i < Object.keys(graph).length; i++) {
            let point = Object.keys(graph)[i];

            this.dist[point] = Number.MAX_VALUE;
            this.prev[point] = null;
            this.q[point] = point;
            this.hashes[point] = point;


        }
        this.dist[source] = 0;
    }

    runOneStep() {
        if (this.u == this.target) {
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

            if (v in this.q) {

                let dist = this.getWeight(this.u, v);

                // console.log(this.u + "   " + v + "     " + dist);
                let alt = this.dist[this.u] + dist + this.heuristicValue(node, this.target); // In a grid all weights are 1

                if (alt < this.dist[v]) {
                    this.dist[v] = alt;
                    this.prev[v] = this.u;
                }
            }
        }
    }

    getWeight(node1, node2) {
        let edges = this.graph[node1];
        for (const edge of edges) {
            if (edge.node == node2) {
                return edge.weight;
            }
        }
        return Number.MAX_VALUE;
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
        let list = [];

        for (const edge of this.graph[node]) {
            list.push(edge.node);
        }


        return list;


    }

    getPathToTarget() {
        let lst = [];

        let prev = this.prev[this.target];
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

class GraphAStar extends GraphDijkstra {
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

// let g =
//     {
//         'a': [{'node': 'b', 'weight': 1}, {'node': 'e', 'weight': 1}],
//         'b': [{'node': 'c', 'weight': 6}],
//         'c': [{'node': 'd', 'weight': 2}, {'node': 'e', 'weight': 7}],
//         'd': [{'node': 'e', 'weight': 3}],
//         'e': []
//     };
//
//
// let d = new Dijkstra(g, 'a', 'e', null);
//
// st = 0;
// while (!d.done) {
//     console.log("Running step " + st);
//
//     d.runOneStep();
//     st++;
// }
//
// console.log(d.getDistances());
// console.log(d.getPathToTarget());
