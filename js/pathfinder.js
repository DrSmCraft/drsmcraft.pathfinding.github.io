function hashPosition() {

    // switch (arguments.length) {
    //     case 1:
    //         return ((arguments[0].x) * 0x1f1f1f1f) ^ arguments[0].y;
    //     case 2:
    //         return ((arguments[0]) * 0x1f1f1f1f) ^ arguments[1];
    //
    // }

    switch (arguments.length) {
        case 1:
            return "(" + arguments[0].x + "," + arguments[0].y + ")";
        case 2:
            return "(" + arguments[0] + "," + arguments[1] + ")";

    }
}


// Taken from https://en.wikipedia.org/wiki/Dijkstra's_algorithm#Pseudocode
class Dijkstra {

    constructor(graph, source, target, obstacles) {
        this.graph = graph;
        this.source = source;
        this.target = target;
        this.targetHash = hashPosition(target);
        this.obstacles = obstacles;
        this.q = {}
        this.hashes = {}
        this.dist = {}
        this.prev = {}
        this.done = false;
        this.step = 0;
        this.reachedTarget = false;

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
                let alt = this.dist[this.u] + 1; // In a grid all weights are 1

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
            if (left.x > -1 && left.x < 23 && left.y > -1 && left.y < 23) {
                nodes.push(left);
            }
        }

        if (!(hashPosition(right) in this.obstacles)) {
            if (right.x > -1 && right.x < 23 && right.y > -1 && right.y < 23) {
                nodes.push(right);
            }
        }

        if (!(hashPosition(up) in this.obstacles)) {
            if (up.x > -1 && up.x < 23 && up.y > -1 && up.y < 23) {
                nodes.push(up);
            }
        }

        if (!(hashPosition(down) in this.obstacles)) {
            if (down.x > -1 && down.x < 23 && down.y > -1 && down.y < 23) {
                nodes.push(down);
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


}








