import { Coordinate } from "ol/coordinate";
import { GeoserverFeatureCollection } from "../assets/TypeDeclarations/Types";

const ROOT = "http://localhost:8080"


/* 
A few examples of how to query data from a vector map using GeoServer's 'getFeature' request. 
For more info view the documentation at: https://docs.geoserver.org/main/en/user/services/wfs/reference.html#getfeature
*/

/** 
 * Get all roads from within a specified bounding box and return in json format
 *  @param coordinate The coordinate clicked on
 *  @param zoom The current map zoom level (used to calculate the bounding box size)
 */
export async function fetchRoads(coordinate: Coordinate, zoom: number) {
    const zoomAmt = 1/(zoom*200);
    const boundingBox = `${coordinate[1]-zoomAmt},${coordinate[0]-zoomAmt},${coordinate[1]+zoomAmt},${coordinate[0]+zoomAmt}`
    const geoserverWorkspace = "qmaps";
    const fetchLayer = "aus_roads_with_vertices";
    const format = "application/json"

    const query =   `${ROOT}/geoserver/${geoserverWorkspace}/wfs?
                    service=wfs&
                    request=GetFeature&
                    srsName=EPSG:4326&
                    strict=true&
                    outputFormat=${format}&
                    typeNames=${fetchLayer}&
                    bbox=${boundingBox}`
                    .replace(/\s/g,'')

        return await fetch(query, {
            method: "GET",
        })
        .then(res => res.json() as Promise<GeoserverFeatureCollection>)
        .catch(() => {throw Error("Unkown error fetching data")});
    }

/** 
 * Fetch all objects from the amenities layer and return as xml
 *  @param coordinate The coordinate clicked on
 *  @param zoom The current map zoom level (used to calculate the bounding box size)
 */
export async function fetchAmenities(coordinate: Coordinate, zoom: number) {
    const zoomAmt = 1/(zoom*500);
    const boundingBox = `${coordinate[1]-zoomAmt},${coordinate[0]-zoomAmt},${coordinate[1]+zoomAmt},${coordinate[0]+zoomAmt}`
    const geoserverWorkspace = "qmaps";
    const fetchLayer = "aus_amenities";

    const query =   `${ROOT}/geoserver/${geoserverWorkspace}/wms?
                    service=wfs&
                    request=GetFeature&
                    srsName=EPSG:4326&
                    typeNames=${fetchLayer}&
                    bbox=${boundingBox}`
                    .replace(/\s/g,'')

        return await fetch(query, {
            method: "GET",
            mode: 'cors'
        })
        .catch((e) => {throw Error(e)});
}