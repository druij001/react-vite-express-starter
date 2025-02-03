import { Coordinate } from "ol/coordinate";
import { fetchAmenities, fetchRoads } from "../persistence/GeoserverQuery";
import { Geometry, LineString, Point, Polygon } from "ol/geom";
import { Type } from "ol/geom/Geometry";
import { Feature } from "ol";
import { fetchSeriesFeatures, insertFeature } from "../persistence/PgQuery";
import { GeoserverFeatureCollection, GeoserverRoadFeature, HandledFeature } from "../assets/TypeDeclarations/Types";

const DOM_PARSER = new DOMParser();

/**
 * Helper function to extract a section from an xml field
 */
function parseDocAndGetTag(xmlText: string, tag: string) {
    try {
        return DOM_PARSER.parseFromString(xmlText, "text/xml").getElementsByTagName(tag);
    } catch (error) {
        console.warn(error);
        return null;
    }
}

/**  
    EXAMPLE of how to extract roads information out of an json object 
*  @param coordinate The coordinate clicked on
*  @param zoom The current map zoom level (used to calculate the bounding box size)
*/
export async function getRoads(coordinate: Coordinate, zoom: number) {
    const returnObj: { id: number | null; name: string | null; adminLevel: string | null; boundary: string | null; source: number | null; target: number | null; z: string | null }[] = [];

    // Fetch and parse data
    const rawData: GeoserverFeatureCollection = await fetchRoads(coordinate, zoom);
    const roadElements: GeoserverRoadFeature[] = rawData?.features;

    if (!roadElements) return [];
    console.log(roadElements)

    // return roads in json format
    for (let i = 0; i < roadElements?.length; i++) {
        let properties = roadElements[i].properties;

        // Select only properties that are a type of highway
        if (properties.highway)
            returnObj.push(
                {
                    id: properties.osm_id || null,
                    name: properties.name || null,
                    adminLevel: properties.admin_level || null,
                    boundary: properties.boundary || null,
                    source: properties.source || null,
                    target: properties.target || null,
                    z: properties.z_order || null
                })
    }

    return returnObj;
}

/**  
 * EXAMPLE of how to extract points information out of an xml object 
*  @param coordinate The coordinate clicked on
*  @param zoom The current map zoom level (used to calculate the bounding box size)
*/
export async function getInterestPoints(coordinate: Coordinate, zoom: number) {
    const returnObj: { id: string | null; name: string | null; covered: boolean | null; }[] = [];

    // Call fetch function
    const rawXml = await fetchAmenities(coordinate, zoom);

    if (!rawXml) return;

    // Extract the elements with "qmaps:aus_amenities tag"
    const interestElements = parseDocAndGetTag(await rawXml.text(), "qmaps:aus_amenities") || [];

    // return as json object
    for (let i = 0; i < interestElements.length; i++) {
        let el = interestElements[i];

        returnObj.push({
            id: el?.getElementsByTagName("qmaps:osm_id")[0].innerHTML || null,
            name: el?.getElementsByTagName("qmaps:amenity")[0].innerHTML || "Undefined",
            covered: el?.getElementsByTagName("qmaps:covered")[0]?.innerHTML ? true : false
        })
    }

    return returnObj;
}

/**
* EXAMPLE of how to prepare an open layers point, polygon or linestring for insertion into the postgres DB
*  @param coordinate The coordinate clicked on
*  @param zoom The current map zoom level (used to calculate the bounding box size)
*/
export async function handleInsertFeature(label: string, series: number, type: Type, feature: Feature<Geometry>) {

    if (!type) return false;

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

/**
    EXAMPLE of how to parse feature data from postgres into open layers format
*  @param id The id of the series to fetch features from
*/
export async function handleFetchSeriesFeatures(id: any) {
    const features = await fetchSeriesFeatures(id);
    const handledFeatures = new Array<HandledFeature>();

    if (!features || features.length < 0) {
        return [];
    }

    // Convert geometry element array from string representation into array of coordinates
    features.forEach(feat => {
        const localArray = new Array<Coordinate>();
        let splitString = feat.geom.split(',');

        // Get coordinate pairs from flat array
        for (let i = 0; i < splitString.length; i = i + 2) {
            localArray.push([
                parseFloat(splitString[i]),
                parseFloat(splitString[i + 1])])
        }

        handledFeatures.push({
            id: feat.id,
            label: feat.label,
            type: feat.type,
            geom: localArray,
            series_id: feat.series_id
        });
    })

    return handledFeatures;
}