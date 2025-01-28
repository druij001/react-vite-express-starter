import { Coordinate } from "ol/coordinate";

export async function fetchPaths(coordinate: Coordinate, zoom: number) {
    const zoomAmt = 1/(zoom*200);
    try {
        return await fetch(`http://localhost:8080/geoserver/qmaps/wms?service=wfs&request=GetFeature&srsName=EPSG:4326&strict=true&typeNames=planet_osm_line&bbox=${coordinate[1]-zoomAmt},${coordinate[0]-zoomAmt},${coordinate[1]+zoomAmt},${coordinate[0]+zoomAmt}`);
    } catch (error) {
        console.log("caught", error);
    }
}

export async function fetchRoads(coordinate: Coordinate, zoom: number) {
    const zoomAmt = 1/(zoom*200);
    try {
        return await fetch(`http://localhost:8080/geoserver/qmaps/wms?service=wfs&request=GetFeature&srsName=EPSG:4326&strict=true&typeNames=aus_roads_with_vertices&bbox=${coordinate[1]-zoomAmt},${coordinate[0]-zoomAmt},${coordinate[1]+zoomAmt},${coordinate[0]+zoomAmt}`);
    } catch (error) {
        console.log("caught", error);
    }
    return;
}


export async function fetchInterestPoints(coordinate: Coordinate, zoom: number) {
    const zoomAmt = 1/(zoom*50);
    try {
        return await fetch(`http://localhost:8080/geoserver/qmaps/wms?service=wfs&request=GetFeature&srsName=EPSG:4326&strict=true&typeNames=planet_osm_point_special&bbox=${coordinate[1]-zoomAmt},${coordinate[0]-zoomAmt},${coordinate[1]+zoomAmt},${coordinate[0]+zoomAmt}`);
    } catch (error) {
        console.log("caught", error);
    }
}

export async function fetchAmenities(coordinate: Coordinate, zoom: number) {
    const zoomAmt = 1/(zoom*500);
    try {
        return await fetch(`http://localhost:8080/geoserver/qmaps/wms?service=wfs&request=GetFeature&srsName=EPSG:4326&typeNames=aus_amenities&bbox=${coordinate[1]-zoomAmt},${coordinate[0]-zoomAmt},${coordinate[1]+zoomAmt},${coordinate[0]+zoomAmt}`);
    } catch (error) {
        console.log("caught", error);
    }

}