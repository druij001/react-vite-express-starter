import { Coordinate } from "ol/coordinate";
import { fetchAmenities, fetchPaths, fetchRoads } from "../persistence/GeoserverQuery";
import { Geometry, LineString, Point, Polygon } from "ol/geom";
import { Type } from "ol/geom/Geometry";
import { Feature } from "ol";
import { fetchSeriesFeatures, insertFeature } from "../persistence/PgQuery";
import { HandledFeature } from "../assets/TypeDeclarations/Types";

const DOM_PARSER = new DOMParser();

export async function getPaths(coordinate: Coordinate, zoom: number) {
    let returnObj = [{}];

    // Fetch and parse data
    let rawXml = await fetchPaths(coordinate, zoom);

    if (!rawXml) return;

    let lineElements = parseDocAndGetTag(await rawXml.text(), "qmaps:planet_osm_line") || [];

    // return roads in json format
    for (let i = 0; i < lineElements?.length; i++) {
        let el = lineElements[i]
        let highway = el.getElementsByTagName("qmaps:highway")[0]?.innerHTML;
        if (highway == "residential" || highway == "trunk" || highway == "secondary" || highway == "motorway" || highway == "unclassified") {
            returnObj.push({ id: el?.getElementsByTagName("qmaps:osm_id")[0]?.innerHTML || null, name: el?.getElementsByTagName("gml:name")[0]?.innerHTML || "unamed", highway: el?.getElementsByTagName("qmaps:highway")[0]?.innerHTML, surface: el?.getElementsByTagName("qmaps:surface")[0]?.innerHTML || "unclassified" })
        }
    }

    return returnObj;
}

export async function getRoads(coordinate: Coordinate, zoom: number) {
    let returnObj: { id: string | null; name: string | null; adminLevel: string | null; boundary: string | null; source: string | null; target: string | null; }[] = [];

    // Fetch and parse data
    let rawXml = await fetchRoads(coordinate, zoom);

    if (!rawXml) return;

    let roadElements = parseDocAndGetTag(await rawXml.text(), "qmaps:aus_roads_with_vertices") || [];


    // return roads in json format
    for (let i = 0; i < roadElements?.length; i++) {
        let el = roadElements[i]

        if (el.getElementsByTagName("qmaps:highway")[0]?.innerHTML != undefined) {
            returnObj.push(
                {
                    id: el?.getElementsByTagName("qmaps:osm_id")[0]?.innerHTML || null,
                    name: el?.getElementsByTagName("gml:name")[0]?.innerHTML || null,
                    adminLevel: el?.getElementsByTagName("qmaps:admin_level")[0]?.innerHTML || null,
                    boundary: el?.getElementsByTagName("qmaps:boundary")[0]?.innerHTML || null,
                    source: el?.getElementsByTagName("qmaps:source")[0]?.innerHTML || null,
                    target: el?.getElementsByTagName("qmaps:target")[0]?.innerHTML || null
                })
        }
    }

    return returnObj;
}

export async function getInterestPoints(coordinate: Coordinate, zoom: number) {
    let returnObj: { id: string | null; name: string | null; covered: boolean | null; }[] = [];

    let rawXml = await fetchAmenities(coordinate, zoom);

    if (!rawXml) return;

    let interestElements = parseDocAndGetTag(await rawXml.text(), "qmaps:aus_amenities") || [];

    for (let i = 0; i < interestElements.length; i++) {
        let el = interestElements[i];


        returnObj.push({ id: el?.getElementsByTagName("qmaps:osm_id")[0].innerHTML || null, name: el?.getElementsByTagName("qmaps:amenity")[0].innerHTML || "Undefined", covered: el?.getElementsByTagName("qmaps:covered")[0]?.innerHTML ? true : false })
    }

    return returnObj;
}

export async function handleInsertFeature(label: string, series: number, type: Type | undefined, feature: Feature<Geometry>) {
    if (!type) {
        return false;
    }

    // Convert feature into geometry format
    const geom = feature.getGeometry() as Point | Polygon | LineString;

    const geomArray = new Array<number>();

    if (type == "LineString") {
        (geom as LineString).getCoordinates().forEach((coord) => {
            geomArray.push(coord[0], coord[1]);
        });
    } else if (type == "Polygon") {
        (geom as Polygon).getCoordinates().forEach((nestedCoords) => {
            nestedCoords.forEach(coord => (geomArray.push(coord[0], coord[1])))
        });
    }
    else geomArray.push((geom as Point).getCoordinates()[0] as number, geom.getCoordinates()[1] as number);

    await insertFeature(label, type, geomArray, series);
}

export async function handleFetchSeriesFeatures(id:any) {
    const features = await fetchSeriesFeatures(id);
    const handledFeatures = new Array<HandledFeature>();

    if(!features || features.length<0) {
        return [];
    }

    // Convert from string format to numbered
    features.forEach(feat => {
        const localArray = new Array<Coordinate>();
        let splitString = feat.geom.split(',')

        for (let i = 0; i < splitString.length; i = i + 2) {
            localArray.push([parseFloat(splitString[i]), parseFloat(splitString[i + 1])])
        }
        handledFeatures.push({id: feat.id, label:feat.label, type: feat.type, geom: localArray , series_id: feat.series_id});
    })

    return handledFeatures;
}

// Helper function
function parseDocAndGetTag(xmlText: string, tag: string) {
    try {
        return DOM_PARSER.parseFromString(xmlText, "text/xml").getElementsByTagName(tag);
    } catch (error) {
        console.log(error);
        return null;
    }
}