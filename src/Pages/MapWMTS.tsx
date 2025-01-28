// MapComponent.js
import { useState, useEffect, useRef } from "react"
import { Map, MapBrowserEvent, MapEvent, View } from "ol"
import "ol/ol.css"
import { getInterestPoints, getRoads } from "../DBAccess/XMLParse"
import { AdlImageLayer, AusAmenityLayer, AusLineLayer, AusPointLayer, AusPolyLayer, AusRoadLayer, countriesLayer, populatedPlacesLayer, RouteLayer } from "../MapData/WmtsLayers"
import Draw, { DrawEvent } from 'ol/interaction/Draw.js';
import VectorSource from "ol/source/Vector"
import VectorLayer from "ol/layer/Vector"

const customPointsLayerSource = new VectorSource({ wrapX: false });

const CustomPointsLayer = {
    name: "Custom Points",
    z: 20,
    value: new VectorLayer({
        source: customPointsLayerSource
    })
}

export default function MapWMTS() {

    const map = null;
    const [mapPosition, setMapPosition] = useState([138.5998587389303, -34.925828922097786]);
    const mapElement = useRef();
    const mapRef = useRef(map);

    const [zoomLevel, setZoomLevel] = useState(6);

    const [layers, setLayers] = useState([AdlImageLayer, countriesLayer, RouteLayer, populatedPlacesLayer, AusPolyLayer, AusLineLayer, AusRoadLayer, AusPointLayer, AusAmenityLayer, CustomPointsLayer]);
    const [toggledLayers, setToggledLayers] = useState<{name: string, z: number, value: any}[] | undefined>([AdlImageLayer, AusLineLayer, AusRoadLayer, AusAmenityLayer, CustomPointsLayer]);

    const [selectedRoads, setSelectedRoads] = useState<{ id: string | null; name: string | null; adminLevel: string | null; boundary: string | null; source: string | null; target: string | null; }[] | undefined>(undefined);
    const [selectedAmenities, setSelectedAmenities] = useState<{id: string | null, name: string | null, covered: boolean | null}[] | undefined>(undefined);
    const [selectedRoute, setSelectedRoute] = useState({ source: 75562, target: 78946 })
    const [selectedCoordinate, setSelectedCoordinate] = useState<{x: number | null, y: number | null}>({ x: null, y: null });
    const [drawType, setDrawType] = useState("Polygon");

    const [draw, setDraw] = useState(new Draw({
        source: new VectorSource({ wrapX: false }),
        type: "Point",
    }))

    mapRef.current = map;

    useEffect(() => {

        const map = new Map({
            target: mapElement.current,
            layers: toggledLayers?.map(l => l.value),
            view: new View({
                projection: "EPSG:4326",
                center: mapPosition,
                zoom: zoomLevel,
            }),
        })

        let wms = RouteLayer.value.getSource();
        if (wms) {
            wms.updateParams({
                'LAYERS': 'qmaps:aus_routes',
                'viewParams': `source:${selectedRoute.source};target:${selectedRoute.target}`
            })
            RouteLayer.value?.setSource(wms);
        }


        map.on("moveend", (e) => onMapMoveEnd(e))
        map.on('click', (e) => onMapClick(e))

        // Enable Drawing
        let drawObj = new Draw({
            source: customPointsLayerSource,
            type: drawType
        });
        drawObj.on("drawend", e => onDrawComplete(e));

        map.addInteraction(drawObj);

        return () => map.setTarget(undefined)
    }, [toggledLayers, drawType, customPointsLayerSource]);

    /* Change whether a layer is visible */
    function setLayerVisible(name: string, visible: boolean) {

        let localLayers = [...toggledLayers];

        // Remove a layer
        if (visible == false && toggledLayers?.find((e) => e.name == name)) {
            const index = localLayers.findIndex((l) => l?.name == name);
            localLayers.splice(index, 1);
        }

        // Add a layer
        else if (visible == true && !toggledLayers?.find((e) => e.name == name)) {
            localLayers.push(layers.find((l) => l?.name == name));
            localLayers.sort((l1, l2) => { return l1.z - l2.z });
        }

        setToggledLayers(localLayers);
    }


    // Perform actions when user clicks the map
    async function onMapClick(e:  MapBrowserEvent<any>) {
        const roads = await getRoads(e.coordinate, e.map.getView().getZoom() || 5);
        setSelectedRoads(roads);
        setSelectedAmenities(await getInterestPoints(e.coordinate, e.map.getView().getZoom() || 5));
        setSelectedCoordinate({ x: e.coordinate[0], y: e.coordinate[1] });

        // if (roads[0] != null) {
        //     setLayerVisible("Adl Route", true);
        //     setSelectedRoute({ source: selectedRoute.source, target: roads[0].target });
        // }

    }


    // Perform actions when map move stops
    function onMapMoveEnd(e: MapEvent) {
        const zoom = e.map.getView().getZoom();
        setZoomLevel(zoom || 5);
        setMapPosition(e.map.getView().getCenter() || [138.5998587389303, -34.925828922097786]);
    }

    function onDrawComplete(e: DrawEvent) {
        const geom = e.feature.getGeometry();
    }

    return (
        <div className="leftRow" style={{ width: "100%", height: "100%" }}>
            <div style={{ width: "70%" }}>
                <div className="row">
                    {layers.map((lay, i) => (
                        <div key={i}>
                            <input type="checkbox" checked={toggledLayers?.find((l) => l.name == lay.name) ? true : false} onChange={(e) => setLayerVisible(lay.name, e.target.checked)} />
                            <label>{lay.name}</label>
                        </div>
                    ))}
                </div>

                <div className="leftRow">
                    <div className="leftRow middle" style={{ width: 200 }}>
                        <label style={{ marginRight: 10 }}>Zoom level: </label>
                        <p>{Math.round(zoomLevel * 100) / 100}</p>
                    </div>
                    <div className="leftRow middle">
                        <label style={{ marginRight: 10 }}>Last click: </label>
                        <p>{selectedCoordinate.x || 0},{selectedCoordinate.y || 0}</p>
                    </div>
                </div>

                <div>
                    <select onChange={((e) => setDrawType(e.target.value))}>
                        <option value="Point">Point</option>
                        <option value="LineString">LineString</option>
                        <option value="Polygon">Polygon</option>
                        <option value="Circle">Circle</option>
                        <option value="None">None</option>
                    </select>
                </div>

                <div style={{ height: "70vh" }}>
                    <div
                        style={{ height: "100%", width: "100%", border: "2px solid black" }}
                        ref={mapElement}
                    />
                </div>
            </div>
            <div style={{ margin: 10 }} />
            <div style={{ marginTop: 100, width: 300 }}>
                <div >
                    <h3>Roads</h3>
                    {selectedRoads?.map((road, i) => (
                        <div key={i} style={{ width: "100%" }}>
                            <p>{road.id}: {road.name} ({road.source} - {road.source} )</p>
                        </div>
                    ))}
                </div>
                <div >
                    <h3>Amenities</h3>
                    {selectedAmenities?.map((a, i) => (
                        <div key={a.id} style={{ width: "100%" }}>
                            <p>{a.name} ({a.covered == false && "un"}covered)</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
