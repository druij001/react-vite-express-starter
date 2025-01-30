import { Coordinate } from "ol/coordinate";

export type DrawControllerElement = {
    drawType: "Point" | "LineString" | "Polygon" | "Circle" | "None",
    setDrawType: any,
    series: Series[] | undefined,
    setSeries: any,
    isDrawing: boolean,
    selectedSeries: number | undefined,
    setSelectedSeries: any,
}

export type Series = {
    id: number, 
    name: string, 
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