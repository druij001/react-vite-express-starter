import { Route, Series } from "../assets/Types";

const rootAddress = "http://localhost:3002/api"

/* ----- FETCH FUNCTIONS ----- */
export async function fetchAusRoads(limit) {
    let res = await fetch(`${rootAddress}/roads?limit=${limit}`, {
        method: 'GET',
    });
}



export async function fetchRoute(source, target):Promise<[Route] | undefined> {
    try {
        return await fetch(`${rootAddress}/route?source=${source}&target=${target}`, {
            method: 'GET',
        }).then((res) => res.json());
    } catch (error) {
        console.log(error);
    }
   
}

export async function fetchSeries(id?: number): Promise<Series[]>{

    return await fetch(`${rootAddress}/series/fetch`, {
        method: 'GET',
    })
    .then((res) => res.json())
    .catch(e => {throw Error(e)});
}

/* ----- INSERT FUNCTION ----- */
export async function insertSeries(name: string, description: string){
    try {
        return await fetch(`${rootAddress}/series/post?name=${name}&description=${description}`, {
            method: 'POST',
        }).then((res) => res.status);
    } catch (error) {
        console.log(error);
    }
}

export async function insertFeature(label, geom, series): Promise<number | Error>{

        return await fetch(`${rootAddress}/feature/post?label=${label}&geom=${geom}&series=${series}`, {
            method: 'POST',
        })
        .then((res) => res.status)
        .catch(e => e);
}