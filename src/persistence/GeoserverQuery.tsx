import { Coordinate } from "ol/coordinate";
import { GeoserverFeatureCollection } from "../assets/TypeDeclarations/Types";

/* 
A few examples of how to query data from a vector map using GeoServer's 'getFeature' request. 
For more info view the documentation at: https://docs.geoserver.org/main/en/user/services/wfs/reference.html#getfeature
*/

// Get all roads from within a specified bounding box and return in json format
export async function fetchRoads(coordinate: Coordinate, zoom: number) {
    const zoomAmt = 1/(zoom*200);
    const boundingBox = `${coordinate[1]-zoomAmt},${coordinate[0]-zoomAmt},${coordinate[1]+zoomAmt},${coordinate[0]+zoomAmt}`
    const geoserverWorkspace = "qmaps";
    const fetchLayer = "aus_roads_with_vertices";
    const format = "application/json"

    const query = ` http://localhost:8080/geoserver/${geoserverWorkspace}/wfs?
                    service=wfs&
                    request=GetFeature&
                    srsName=EPSG:4326&
                    strict=true&
                    outputFormat=${format}&
                    typeNames=${fetchLayer}&
                    bbox=${boundingBox}`
                    .replace(/\s/g,'')

        return await fetch(query, {
            method: "GET"
        })
        .then(res => res.json() as Promise<GeoserverFeatureCollection>)
        .catch(() => {throw Error("Unkown error fetching data")});
    }

// Fetch all objects from the amenities layer and return as xml
export async function fetchAmenities(coordinate: Coordinate, zoom: number) {
    const zoomAmt = 1/(zoom*500);
    const boundingBox = `${coordinate[1]-zoomAmt},${coordinate[0]-zoomAmt},${coordinate[1]+zoomAmt},${coordinate[0]+zoomAmt}`
    const geoserverWorkspace = "qmaps";
    const fetchLayer = "aus_amenities";

    const query = ` http://localhost:8080/geoserver/${geoserverWorkspace}/wms?
                    service=wfs&
                    request=GetFeature&
                    srsName=EPSG:4326&
                    typeNames=${fetchLayer}&
                    bbox=${boundingBox}`
                    .replace(/\s/g,'')

        return await fetch(query, {
            method: "GET"
        })
        .catch((e) => {throw Error(e)});
}

export async function fetchElevation(coordinate: Coordinate, zoom: number) {
    const zoomAmt = 1/(zoom*500);
    try {
        return await fetch(`http://localhost:8080/geoserver/qmaps/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image/jpeg&TRANSPARENT=true&QUERY_LAYERS=qmaps:SpatialMetadata&STYLES=&LAYERS=qmaps:SpatialMetadata&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=50&Y=50&SRS=EPSG:4326&WIDTH=101&HEIGHT=101&bbox=${coordinate[0]-zoomAmt},${coordinate[1]-zoomAmt},${coordinate[0]+zoomAmt},${coordinate[1]+zoomAmt}`)
        .then(res => res.json())
        .catch(() => {throw Error()});
    } catch (error) {
        console.log("caught", error);
    }

}