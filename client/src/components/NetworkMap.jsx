import { useState } from 'react';
import { Badge, Card, Button } from 'react-bootstrap';

const POSITIONS = {
    1:  { x: 580, y: 60  },
    2:  { x: 460, y: 60  },
    3:  { x: 340, y: 130 },
    4:  { x: 170, y: 290 },
    5:  { x: 170, y: 390 },
    6:  { x: 170, y: 470 },
    7:  { x: 240, y: 200 },
    8:  { x: 370, y: 220 },
    9:  { x: 430, y: 330 },
    10: { x: 540, y: 400 },
    11: { x: 70,  y: 60  },
    12: { x: 150, y: 130 },
    13: { x: 270, y: 370 },
    14: { x: 360, y: 440 },
};

const LABEL = {
    1:  { dx: 10,  dy: 4,   anchor: 'start'  },
    2:  { dx: 0,   dy: -14, anchor: 'middle' },
    3:  { dx: 10,  dy: -8,  anchor: 'start'  },
    4:  { dx: -12, dy: 4,   anchor: 'end'    },
    5:  { dx: -12, dy: 4,   anchor: 'end'    },
    6:  { dx: -12, dy: 4,   anchor: 'end'    },
    7:  { dx: -12, dy: 4,   anchor: 'end'    },
    8:  { dx: 10,  dy: 4,   anchor: 'start'  },
    9:  { dx: 10,  dy: 4,   anchor: 'start'  },
    10: { dx: 10,  dy: 4,   anchor: 'start'  },
    11: { dx: -12, dy: 4,   anchor: 'end'    },
    12: { dx: -12, dy: 4,   anchor: 'end'    },
    13: { dx: -12, dy: 4,   anchor: 'end'    },
    14: { dx: 0,   dy: 18,  anchor: 'middle' },
};

const SVG_LINE_COLORS = {
    'Red Line':    '#c0392b',
    'Blue Line':   '#2980b9',
    'Green Line':  '#27ae60',
    'Yellow Line': '#e67e22',
};

const badgeColor = (name) => {
    if(name.includes('Red')) return 'danger';
    if(name.includes('Blue')) return 'primary';
    if(name.includes('Green')) return 'success';
    if(name.includes('Yellow')) return 'warning';
    return 'secondary';
};

function NetworkMap({ network, showLines }) {
    const [mapView, setMapView] = useState(true);
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

    const linePaths = lines.map(line => {
        const sorted = lineStations
            .filter(ls => ls.lineId === line.id)
            .sort((a, b) => a.position - b.position);
        const points = sorted
            .map(ls => {
                const p = POSITIONS[ls.stationId];
                return p ? `${p.x},${p.y}` : null;
            })
            .filter(Boolean)
            .join(' ');
        return { id: line.id, name: line.name, color: SVG_LINE_COLORS[line.name] || '#888', points };
    });

    return (
        <div>
            <div className="d-flex justify-content-end mb-2">
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() =>setMapView(v => !v)}>
                    {mapView ? 'List View' : 'Map View'}
                </Button>
            </div>

            {mapView ? (
                <div>
                    <svg viewBox="0 0 680 510" style={{ width: '100%', maxHeight: '480px', display: 'block' }}>
                        {linePaths.map(lp => (
                            <polyline
                                key={lp.id}
                                points={lp.points}
                                stroke={lp.color}
                                strokeWidth={6}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        ))}

                        {stations.map(station => {
                            const pos = POSITIONS[station.id];
                            if(!pos){ return null; }
                            const interchange = isInterchange(station.id);
                            const lbl = LABEL[station.id] || { dx: 10, dy: 4, anchor: 'start' };

                            return (
                                <g key={station.id}>
                                    {interchange && (
                                        <circle cx={pos.x} cy={pos.y} r={11} fill="white" stroke="#333" strokeWidth={2.5} />
                                    )}
                                    <circle
                                        cx={pos.x}
                                        cy={pos.y}
                                        r={interchange ? 6 : 7}
                                        fill="white"
                                        stroke="#333"
                                        strokeWidth={2}
                                    />
                                    <text
                                        x={pos.x + lbl.dx}
                                        y={pos.y + lbl.dy}
                                        fontSize={11}
                                        textAnchor={lbl.anchor}
                                        fill="#222"
                                        fontWeight={interchange ? '600' : '400'}>
                                        {station.name}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>

                    <div className="d-flex flex-wrap gap-3 mt-2 justify-content-center">
                        {lines.map(line => (
                            <span key={line.id} className="d-flex align-items-center gap-1 small">
                                <span style={{
                                    display: 'inline-block',
                                    width: 24,
                                    height: 5,
                                    borderRadius: 3,
                                    backgroundColor: SVG_LINE_COLORS[line.name] || '#888'
                                }} />
                                {line.name}
                            </span>
                        ))}
                        <span className="d-flex align-items-center gap-1 small text-muted">
                            <svg width="16" height="16" viewBox="0 0 16 16">
                                <circle cx="8" cy="8" r="6" fill="white" stroke="#333" strokeWidth="2" />
                                <circle cx="8" cy="8" r="3" fill="white" stroke="#333" strokeWidth="1.5" />
                            </svg>
                            Interchange
                        </span>
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {lines.map(line => {
                        const color = badgeColor(line.name);
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
            )}
        </div>
    );
}

export default NetworkMap;


