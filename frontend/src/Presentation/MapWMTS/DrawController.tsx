import { Type } from "ol/geom/Geometry"
import { DrawControllerElement, Series } from "../../assets/TypeDeclarations/Types"


export default function DrawController({ drawType, setDrawType, series, setSeries, isDrawing, selectedSeries, setSelectedSeries }:DrawControllerElement ) {

    return (
        <div>
            <div className="m2">
                <div className="column">
                    <label>Geometry Type</label>
                    <select onChange={((e) => setDrawType(e.target.value as Type))} disabled={isDrawing} defaultValue={drawType}>
                        <option value={undefined}></option>
                        <option value="Point">Point</option>
                        <option value="LineString">LineString</option>
                        <option value="Polygon">Polygon</option>
                        <option value="Circle">Circle</option>
                    </select>
                </div>
                <div className="column">
                    <label>Series</label>
                    <select defaultValue={selectedSeries} onChange={(e) => setSelectedSeries(e.target.value)} disabled={isDrawing}>
                        <option value={undefined}></option>
                        {series?.map((ser:Series) => (
                            <option key={ser.id} value={ser.id}>{ser.name}</option>
                        ))}
                        <option value={-1}>+ Series</option>
                    </select>
                </div>
            </div>
        </div>
    )
}