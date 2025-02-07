import { Route } from "../assets/TypeDeclarations/Interfaces";
import { Feature, Series, ServerResponse } from "../assets/TypeDeclarations/Types";

const rootAddress = "http://localhost:3002/api"

/*
    This file features examples of how to query postgres gis data using the JS express api
*/

/**
    Fetch all roads in the australian roads table
    @param limit - the max number of roads to return
*/
export async function fetchAusRoads(limit: number) {
    return await fetch(`${rootAddress}/roads?limit=${limit}`, {
        method: 'GET',
    })
        .then(res => res.json())
        .catch(() => { throw Error("Unknown error fetching roads") });
}

/**
    Fetch a route from a source to a target
    @param source - the vertice id to start the path at
    @param target - the vertice id to end the path at
*/
export async function fetchRoute(source: number, target: number): Promise<Route[] | undefined> {
    return await fetch(`${rootAddress}/route?source=${source}&target=${target}`, {
        method: 'GET',
    })
        .then((res: Response) => res.json()
            .then((sr: ServerResponse) => {
                if (sr.response == 200) return sr.data as Route[];
                else                    throw Error(sr.response.toString())
            }))
        .catch(() => { throw Error("Unknown Error fetching route") });

}

/**
    Fetch all rows from the series table
*/
export async function fetchSeries(): Promise<Series[] | undefined> {

    return await fetch(`${rootAddress}/series/fetch`, {
        method: 'GET',
    })
        .then((res: Response) => res.json()
            .then((sr: ServerResponse) => {
                if (sr.response == 200) return sr.data;
                else                    throw Error(sr.response.toString())
            }))
        .catch(() => { throw Error("Unknown Error fetcgubg series") });
}

/** 
     Fetch all geometry elements from a specific series
     @param id - the id of the series to get features from
*/
export async function fetchSeriesFeatures(id: number): Promise<Feature[] | undefined> {

    return await fetch(`${rootAddress}/series/fetchsingle?id=${id}`, {
        method: 'GET',
    })
        .then((res: Response) => res.json()
            .then((sr: ServerResponse) => {
                if (sr.response == 200) return sr.data;
                else                    throw Error(sr.response.toString());
            }))
        .catch(() => { throw Error("Unknown Error fetching features") });
}

/** 
     Insert a feature into a series
     @param label - The label to give the feature
     @param type - The type of the feature Point, LineString or Polygon
     @param geom - The array of coordinates representing the layout of the feature
     @param series - The series to insert the feature into
*/
export async function insertFeature(label: string, type: string, geom: number[], series: number): Promise<boolean> {
    return await fetch(`${rootAddress}/feature/post?label=${label}&type=${type}&geom=${geom}&series=${series}`, {
        method: 'POST',
    })
        .then((res: Response) => res.json()
            .then((sr: ServerResponse) => {
                if (sr.response == 200) return true;
                else                    throw Error(sr.response.toString());
            }))
        .catch(() => { throw Error("Unknown Error inserting feature") });
}