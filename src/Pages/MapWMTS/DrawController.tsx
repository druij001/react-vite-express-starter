import { Type } from "ol/geom/Geometry"
import React from "react"

export default function DrawController({ drawType, setDrawType, series, setSeries, isDrawing, selectedSeries, setSelectedSeries }) {

    return (
        <div>
            <div className="m2">
                <div className="Column">
                    <label>Geometry Type</label>
                    <select onChange={((e) => setDrawType(e.target.value as Type))} disabled={isDrawing}>
                        <option value={undefined}></option>
                        <option value="Point">Point</option>
                        <option value="LineString">LineString</option>
                        <option value="Polygon">Polygon</option>
                    </select>
                </div>
                <div className="Column">
                    <label>Series</label>
                    <select defaultValue={selectedSeries} onChange={(e) => setSelectedSeries(e.target.value)} disabled={isDrawing}>
                        <option value={undefined}></option>
                        {series?.map((ser) => (
                            <option key={ser.id} value={ser.id}>{ser.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}