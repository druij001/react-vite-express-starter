import { Route } from "../assets/Types";

const rootAddress = "http://localhost:3002/api"

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

export async function insertSeries(name: string, description: string){
    try {
        return await fetch(`${rootAddress}/series/post?name=${name}&description=${description}`, {
            method: 'POST',
        }).then((res) => res.status);
    } catch (error) {
        console.log(error);
    }
}

export async function insertPoint(x: number, y: number, label: string, series: number){
    try {
        return await fetch(`${rootAddress}/point/post?x=${x}&y=${y}&label=${label}&series=${series}`, {
            method: 'POST',
        }).then((res) => res.status);
    } catch (error) {
        console.log(error);
    }
}