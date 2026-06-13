const buildGraph = (lineStations) => {
    const byLine = {};
    for(const ls of lineStations) {
        if(!byLine[ls.lineId]) {
            byLine[ls.lineId] = [];
        }
        byLine[ls.lineId].push(ls);
    }

    const graph = new Map();
    for(const lineId of Object.keys(byLine)) {
        const sorted = byLine[lineId].sort((a, b) => a.position - b.position);
        for(let i = 0; i < sorted.length - 1; i++) {
            const a = sorted[i].stationId;
            const b = sorted[i + 1].stationId;
            if(!graph.has(a)) {
                graph.set(a, new Set());
            }
            if(!graph.has(b)) {
                graph.set(b, new Set());
            }
            graph.get(a).add(b);
            graph.get(b).add(a);
        }
    }
    return graph;
};

const bfsDistance = (graph, startId, destId) => {
    if(startId === destId) {
        return 0;
    }
    const visited = new Set([startId]);
    const queue = [{ id: startId, dist: 0 }];
    while(queue.length > 0) {
        const { id, dist } = queue.shift();
        for(const neighbor of (graph.get(id) || [])) {
            if(neighbor === destId) {
                return dist + 1;
            }
            if(!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push({ id: neighbor, dist: dist + 1 });
            }
        }
    }
    return Infinity;
};

export const getRandomStartDest = (stations, lineStations) => {
    const graph = buildGraph(lineStations);
    let startStation, destStation;
    let attempts = 0;
    do {
        const idx1 = Math.floor(Math.random() * stations.length);
        let idx2 = Math.floor(Math.random() * stations.length);
        while(idx2 === idx1) {
            idx2 = Math.floor(Math.random() * stations.length);
        }
        startStation = stations[idx1];
        destStation = stations[idx2];
        attempts++;
    } while(bfsDistance(graph, startStation.id, destStation.id) < 3 && attempts < 1000);
    return { startStation, destStation };
};

export const validateRoute = (submittedSegments, lineStations, startId, destId) => {
    if(!submittedSegments || submittedSegments.length === 0) {
        return { valid: false, reason: 'Route is empty.' };
    }

    if(submittedSegments[0].from !== startId) {
        return { valid: false, reason: 'Route does not start at the assigned station.' };
    }

    if(submittedSegments[submittedSegments.length - 1].to !== destId) {
        return { valid: false, reason: 'Route does not end at the destination station.' };
    }

    for(let i = 0; i < submittedSegments.length - 1; i++) {
        if(submittedSegments[i].to !== submittedSegments[i + 1].from) {
            return { valid: false, reason: 'Route is not continuous.' };
        }
    }

    const segmentsSeen = new Set();
    for(const seg of submittedSegments) {
        const key = `${Math.min(seg.from, seg.to)}-${Math.max(seg.from, seg.to)}`;
        if(segmentsSeen.has(key)) {
            return { valid: false, reason: 'The same segment cannot be used more than once.' };
        }
        segmentsSeen.add(key);
    }

    const byLine = {};
    for(const ls of lineStations) {
        if(!byLine[ls.lineId]) {
            byLine[ls.lineId] = [];
        }
        byLine[ls.lineId].push(ls);
    }

    const segmentLines = new Map();
    const stationLines = new Map();

    for(const lineId of Object.keys(byLine)) {
        const sorted = byLine[lineId].sort((a, b) => a.position - b.position);
        for(let i = 0; i < sorted.length - 1; i++) {
            const a = sorted[i].stationId;
            const b = sorted[i + 1].stationId;
            const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
            if(!segmentLines.has(key)) {
                segmentLines.set(key, new Set());
            }
            segmentLines.get(key).add(parseInt(lineId));
        }
        for(const ls of byLine[lineId]) {
            if(!stationLines.has(ls.stationId)) {
                stationLines.set(ls.stationId, new Set());
            }
            stationLines.get(ls.stationId).add(parseInt(lineId));
        }
    }

    for(const seg of submittedSegments) {
        const key = `${Math.min(seg.from, seg.to)}-${Math.max(seg.from, seg.to)}`;
        if(!segmentLines.has(key)) {
            return { valid: false, reason: `Segment ${seg.from}→${seg.to} is not a valid connection.` };
        }
    }

    for(let i = 0; i < submittedSegments.length - 1; i++) {
        const seg1 = submittedSegments[i];
        const seg2 = submittedSegments[i + 1];
        const key1 = `${Math.min(seg1.from, seg1.to)}-${Math.max(seg1.from, seg1.to)}`;
        const key2 = `${Math.min(seg2.from, seg2.to)}-${Math.max(seg2.from, seg2.to)}`;
        const lines1 = segmentLines.get(key1);
        const lines2 = segmentLines.get(key2);
        const commonLines = [...lines1].filter(l => lines2.has(l));
        if(commonLines.length === 0) {
            const junction = seg1.to;
            const junctionLines = stationLines.get(junction) || new Set();
            if(junctionLines.size < 2) {
                return { valid: false, reason: `Line change at station ${junction} is not allowed — not an interchange station.` };
            }
        }
    }
    return { valid: true };
};