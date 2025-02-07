import { Coordinate } from "ol/coordinate";

export type DrawControllerElement = {
    drawType: "Point" | "LineString" | "Polygon" | "Circle" | "None",
    setDrawType: any,
    series: Series[] | undefined,
    setSeries: any,
    isDrawing: boolean,
    selectedSeries: number | undefined,
    setSelectedSeries: any,
}

export type Series = {
    id: number,
    name: string,
    description: string
};

export type ServerResponse = {
    response: number,
    data: any[] | undefined
}

export type Feature = {
    id: number,
    label: string | null,
    type: string,
    geom: string,
    series_id: number
}

export type HandledFeature = {
    id: number,
    label: string | null,
    type: string,
    geom: Coordinate[],
    series_id: number
}
/** The object returned from querying roads table through geoserver */
export type GeoserverFeatureCollection = {
    crs: Object,
    features: GeoserverRoadFeature[],
    numberMatched: number,
    numberReturned: number,
    timeStamp: string,
    totalFeatures: number
    type: string
}
/** The feature type returned from querying roads table through geoserver */
export type GeoserverRoadFeature = {
    type: string,
    id: string,
    geometry: {},
    geometry_name: string, 
    properties: GeoserverRoadProperty
}


/** The properties of the roads feature returned from querying roads table through geoserver */
export type GeoserverRoadProperty = {
    access: any
    "addr:housename": any
    "addr:housenumber": any
    "addr:interpolation": any
    admin_level: any
    aerialway: any
    aeroway: any
    amenity: any
    area: any
    barrier: any
    bicycle: any
    boundary: string
    brand: any
    bridge: any
    building: any
    construction: any
    covered: any
    culvert: any
    cutting: any
    denomination: any
    disused: any
    embankment: any
    foot: any
    harbour: any
    highway: any
    historic: any
    horse: any
    intermittent: any
    junction: any
    landuse: any
    layer: any
    leisure: any
    lock: any
    man_made: any
    military: any
    motorcar: any
    name: string
    natural: any
    office: any
    oneway: any
    operator: any
    osm_id: number
    place: string
    population: any
    power: any
    power_source: any
    public_transport: any
    railway: any
    ref: any
    religion: any
    route: any
    service: any
    shop: any
    sport: any
    surface: any
    way_area: any
    wetland: any
    width: any
    wood: any
    cost: number
    source: number
    target: number
    x1: number
    x2: number
    y1: number
    y2: number
    z_order: 0
}