import { Type } from "ol/geom/Geometry"
import React from "react"

export default function DrawController({ drawType, setDrawType, series, setSeries, isDrawing }) {

    return (
        <div>
            <div className="m2">
                <div className="Column">
                    <label>Geometry Type</label>
                    <select onChange={((e) => setDrawType(e.target.value as Type))} disabled={isDrawing}>
                        <option value={"None"}>None</option>
                        <option value="Point">Point</option>
                        <option value="LineString">LineString</option>
                        <option value="Polygon">Polygon</option>
                    </select>
                </div>
                <div className="Column">
                    <label>Series</label>
                    <option value={undefined}>None</option>
                    <select onChange={(e) => setSeries(e.target.value)} disabled={isDrawing}>
                        {series?.map((ser) => (
                            <option key={ser.id} value={ser.id}>{ser.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}