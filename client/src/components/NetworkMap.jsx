import { Badge, Card } from 'react-bootstrap';

const lineColor = (name) => {
    if(name.includes('Red')) return 'danger';
    if(name.includes('Blue')) return 'primary';
    if(name.includes('Green')) return 'success';
    if(name.includes('Yellow')) return 'warning';
    return 'secondary';
};

function NetworkMap({ network, showLines }) {
    const { stations, lines, lineStations } = network;

    const stationById = {};
    for(const s of stations) {
        stationById[s.id] = s;
    }

    const stationLineCounts = {};
    for(const ls of lineStations) {
        stationLineCounts[ls.stationId] = (stationLineCounts[ls.stationId] || 0) + 1;
    }
    const isInterchange = (id) => (stationLineCounts[id] || 0) > 1;

    if(!showLines) {
        return (
            <div className="d-flex flex-wrap gap-2">
                {stations.map(s =>(
                    <Badge
                        key={s.id}
                        bg={isInterchange(s.id) ? 'dark' : 'secondary'}
                        className="py-2 px-3 fs-6">
                        {s.name}
                        {isInterchange(s.id) && <span className="ms-1 opacity-75">(interchange)</span>}
                    </Badge>
                ))}
            </div>
        );
    }
    return (
        <div className="d-flex flex-column gap-3">
            {lines.map(line => {
                const color = lineColor(line.name);
                const sorted = lineStations
                    .filter(ls => ls.lineId === line.id)
                    .sort((a, b) => a.position - b.position);

                return (
                    <Card key={line.id} className="border-0 shadow-sm">
                        <Card.Header className={`bg-${color} text-white fw-semibold`}>
                            {line.name}
                        </Card.Header>
                        <Card.Body className="py-3">
                            <div className="d-flex align-items-center flex-wrap gap-1">
                                {sorted.map((ls, idx) => {
                                    const station = stationById[ls.stationId];
                                    return (
                                        <span key={ls.stationId} className="d-flex align-items-center gap-1">
                                            <Badge
                                                bg={isInterchange(ls.stationId) ? 'dark' : color}
                                                className="py-2 px-2">
                                                {station?.name}
                                            </Badge>
                                            {idx < sorted.length - 1 && (
                                                <span className="text-muted small">→</span>
                                            )}
                                        </span>
                                    );
                                })}
                            </div>
                        </Card.Body>
                    </Card>
                );
            })}
            <p className="text-muted small mb-0">Dark badges indicate interchange stations.</p>
        </div>
    );
}

export default NetworkMap;





