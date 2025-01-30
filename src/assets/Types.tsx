import { Coordinate } from "ol/coordinate";
import { typeName } from "ol/expr/expression"
import { types } from "pg"

export interface Route {
    osm_id: number,
    seq: number, 
    path_seq: number,
    start_vid: number,
    end_vid: number,
    cost: number,
    x1: number, 
    y1: number,
    x2: number,
    y2: number,
    way: string
}

export type Series = {
    id: number, 
    label: string, 
    description: string
};

export type ServerResponse = {
    response: number,
    data: any[] | undefined
}

export type Feature = {
    id: number, 
    label: string | null,
    type: string,
    geom: string,
    series_id: number
}

export type HandledFeature = {
    id: number, 
    label: string | null,
    type: string,
    geom: Coordinate[],
    series_id: number
}