import { Route } from "../assets/TypeDeclarations/Interfaces";
import { Feature, Series, ServerResponse } from "../assets/TypeDeclarations/Types";

const rootAddress = "http://localhost:3002/api"

/* ----- FETCH FUNCTIONS ----- */
export async function fetchAusRoads(limit:number) {
    return await fetch(`${rootAddress}/roads?limit=${limit}`, {
        method: 'GET',
    });
}


export async function fetchRoute(source: number, target:number):Promise<[Route] | undefined> {
    try {
        return await fetch(`${rootAddress}/route?source=${source}&target=${target}`, {
            method: 'GET',
        }).then((res) => res.json());
    } catch (error) {
        console.log(error);
    }
   
}

export async function fetchSeries(): Promise<Series[] | undefined>{

    return await fetch(`${rootAddress}/series/fetch`, {
        method: 'GET',
    })
    .then((res: Response) => res.json()
    .then((sr: ServerResponse) => {
        if(sr.response == 200) return sr.data;
        else throw Error(sr.response.toString())
    }))
    .catch(() => {throw Error("Unknown Error")});
}

export async function fetchSeriesFeatures(id: number): Promise<Feature[] | undefined>{

    return await fetch(`${rootAddress}/series/fetchsingle?id=${id}`, {
        method: 'GET',
    })
    .then((res: Response) => res.json()
    .then((sr: ServerResponse) => {
        if(sr.response == 200) return sr.data;
        else throw Error(sr.response.toString())
    }))
    .catch(() => {throw Error("Unknown Error")});
}


/* ----- INSERT FUNCTIONS ----- */
export async function insertSeries(name: string, description: string){

        return await fetch(`${rootAddress}/series/post?name=${name}&description=${description}`, {
            method: 'POST',
        })
        .then((res) => {if(res.status != 200) throw Error(); else return true})
        .catch(e => {throw Error(e)});
}

export async function insertFeature(label: string, type: string, geom: number[], series: number): Promise<boolean>{

        return await fetch(`${rootAddress}/feature/post?label=${label}&type=${type}&geom=${geom}&series=${series}`, {
            method: 'POST',
        })
        .then((res) => {if(res.status != 200) throw Error(); else return true})
        .catch(e => {throw Error(e)});
}