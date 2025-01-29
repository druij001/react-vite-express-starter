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