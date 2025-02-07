// MapComponent.js
import { useState, useEffect, useRef } from "react"
import { Feature, Map, MapBrowserEvent, MapEvent, View } from "ol"
import "ol/ol.css"
import { getInterestPoints, getRoads, handleFetchSeriesFeatures, handleInsertFeature } from "../../BusinessLogic/BusinessLogic"
import { AdlImageLayer, AusAmenityLayer, AusLineLayer, AusPointLayer, AusPolyLayer, AusRoadLayer, countriesLayer, CustomPointsLayer, CustomPointsLayerSource, populatedPlacesLayer, RouteLayer, VectorRouteSource, VectorRouteLayer } from "../../assets/WmtsLayers"
import Draw, { DrawEvent } from 'ol/interaction/Draw.js';
import { Geometry, LineString, Point, Polygon } from "ol/geom"
import { Type } from "ol/geom/Geometry"
import { fetchRoute, fetchSeries } from "../../persistence/PgQuery"
import { Coordinate } from "ol/coordinate"
import { transform } from "ol/proj"
import DrawController from "./DrawController"
import { Series } from "../../assets/TypeDeclarations/Types"

export default function MapWMTS() {

    const map = null;
    const [mapPosition, setMapPosition] = useState([138.5998587389303, -34.925828922097786]);
    const mapElement = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef(map);

    const [intialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);

    const [zoomLevel, setZoomLevel] = useState(6);

    const layers: { name: string, z: number, value: any }[] = [AdlImageLayer, countriesLayer, RouteLayer, populatedPlacesLayer, AusPolyLayer, AusLineLayer, AusRoadLayer, AusPointLayer, AusAmenityLayer, CustomPointsLayer, VectorRouteLayer];
    const [toggledLayers, setToggledLayers] = useState<{ name: string, z: number, value: any }[]>([AusLineLayer, AusRoadLayer, AusAmenityLayer, CustomPointsLayer, VectorRouteLayer]);

    const [selectedRoads, setSelectedRoads] = useState<{ id: number | null; name: string | null; adminLevel: string | null; boundary: string | null; source: number | null; target: number | null; z: string | null }[] | undefined>(undefined);
    const [selectedAmenities, setSelectedAmenities] = useState<{ id: string | null, name: string | null, covered: boolean | null }[] | undefined>(undefined);
    const [selectedRoute, setSelectedRoute] = useState({ source: 75299, target: 78946 })
    const [selectedCoordinate, setSelectedCoordinate] = useState<[number | null, number | null]>([null, null]);

    // Drawing controls
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [drawType, setDrawType] = useState<"Polygon" | "LineString" | "Point" | "Circle" | "None">("None");
    const [series, setSeries] = useState<Series[] | undefined>(undefined);
    const [selectedSeriesId, setSelectedSeriesId] = useState<number | undefined>(undefined);

    mapRef.current = map;

    useEffect(() => {
        if (!intialLoadComplete) {
            getData();
            setInitialLoadComplete(true);
        }
        const map = new Map({
            target: mapElement.current || undefined,
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
        if (drawType != "None" && selectedSeriesId) {
            let drawObj = new Draw({
                source: CustomPointsLayerSource,
                type: drawType as Type
            });
            drawObj.on("drawstart", e => onDrawBegin(e))
            drawObj.on("drawend", e => onDrawComplete(e));
            map.addInteraction(drawObj);
        }

        return () => map.setTarget(undefined)
    }, [toggledLayers, selectedRoute, drawType, selectedSeriesId]);

    /**
     * Fetch data on page load
     */
    async function getData() {

        try {
            setSeries(await fetchSeries());
        } catch (error: any) {
            console.warn(error.message, "Fetching series");
        }
    }

    /**
     * Change the visibility of a layer
     * @param name the name of the layer to change the visibity of
     * @param visible 
     */
    function setLayerVisible(name: string, visible: boolean) {

        let localLayers = [...toggledLayers];

        // Remove a layer
        if (visible == false && toggledLayers?.find((e) => e.name == name)) {
            const index = localLayers.findIndex((l) => l?.name == name);
            localLayers.splice(index, 1);
        }

        // Add a layer
        else if (visible == true && !toggledLayers?.find((e) => e.name == name)) {
            let newLayer = layers?.find((l) => l?.name == name);
            newLayer && localLayers.push(newLayer);
            localLayers.sort((l1, l2) => { return l1.z - l2.z });
        }

        setToggledLayers(localLayers);
    }


    /**
     * Update state after user clicks the map
     * @param e The event
     */
    async function onMapClick(e: MapBrowserEvent<any>) {
        setSelectedCoordinate([e.coordinate[0], e.coordinate[1]]);

        // Get details of the road which was clicked on
        const roads = await getRoads(e.coordinate, e.map.getView().getZoom() || 5);
        setSelectedRoads(roads);

        // Get route to point clicked on
        if (drawType == "None" && roads && roads[0]?.target) {
            setSelectedRoute({ source: selectedRoute.source, target: roads[0].target });
            drawRoute(selectedRoute.source, roads[0].target);
        }

        // Get details of selected amenities
        setSelectedAmenities(await getInterestPoints(e.coordinate, e.map.getView().getZoom() || 5));
    }


    /**
     * Update state after the map moves
     * @param e The map event
     */
    function onMapMoveEnd(e: MapEvent) {
        const zoom = e.map.getView().getZoom();
        setZoomLevel(zoom || 5);
        setMapPosition(e.map.getView().getCenter() || [138.5998587389303, -34.925828922097786]);
    }

    /**
     * Update state when a drawing is completed
     * @param e The drawing event
     */
    async function onDrawComplete(e: DrawEvent) {
        const featureType = e.feature.getGeometry()?.getType();
        setIsDrawing(false);

        if (!selectedSeriesId) {
            console.warn("Feature not inserted. No series specified.")
            return;
        }

        if (!featureType) {
            console.warn("Feature not inserted. Issue finding type")
            return null;
        }
        try {
            await handleInsertFeature("", selectedSeriesId, featureType, e.feature as Feature<Geometry>);
            console.info("Feature inserted successfully into series", selectedSeriesId)
        } catch (error) {
            console.warn("Error inserting feature.")
        }
    }

    /**
     * Actions to perform when a drawing event first occurs
     * @param _e 
     */
    function onDrawBegin(_e: DrawEvent) {
        setIsDrawing(true);
    }

    /**
     * Add a route to the map
     * @param source The vertice id to begin the route at
     * @param target The vertice id to end the route at
     */
    async function drawRoute(source: number, target: number) {
        const layer = VectorRouteLayer.value;
        const route = await fetchRoute(source, target);
        const vertices: Coordinate[] = [];

        // Clear any existing routes
        layer.getSource()?.clear();

        // Visualise the fetched route
        route?.forEach((v) => { vertices.push(transform([v.x1, v.y1], 'EPSG:3857', 'EPSG:4326')) });
        var path = new LineString(vertices);
        const pathFeature = new Feature({
            name: "obj",
            geometry: path,
        })
        VectorRouteSource.addFeature(pathFeature);
    }

    /**
     * Update state when the selected series changes
     * @param id The number of the new series
     */
    async function onSeriesChange(id: number) {
        if (id == -1) { return null }
        const drawLayer = CustomPointsLayer.value;

        // Clear current features
        drawLayer.getSource()?.clear();

        setSelectedSeriesId(id || undefined);
        if (!id) {
            return null
        }

        // Display new features on screen
        try {
            const features = await handleFetchSeriesFeatures(id);

            if (features && features.length > 0) {
                features.forEach(geom => {
                    let geometry: Geometry | undefined;
                    if (geom.type == "Point") geometry = new Point(geom.geom[0])
                    else if (geom.type == "LineString") geometry = new LineString(geom.geom)
                    else if (geom.type == "Polygon") geometry = new Polygon([geom.geom])

                    drawLayer.getSource()?.addFeature(new Feature({
                        geometry: geometry
                    }))
                })

            }
        } catch (error: any) {
            console.warn(error.message, "Fetching features")
        }
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
                        <p>{selectedCoordinate[0] || 0},{selectedCoordinate[1] || 0}</p>
                    </div>
                </div>

                <DrawController
                    drawType={drawType}
                    setDrawType={setDrawType}
                    series={series}
                    setSeries={setSeries}
                    isDrawing={isDrawing}
                    selectedSeries={selectedSeriesId}
                    setSelectedSeries={onSeriesChange} />

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
                            <p>{road.id} ({road.z}): {road.name} ({road.source} - {road.source} )</p>
                        </div>
                    ))}
                </div>
                <div >
                    <h3>Amenities</h3>
                    {selectedAmenities?.map((a) => (
                        <div key={a.id} style={{ width: "100%" }}>
                            <p>{a.name} ({a.covered == false && "un"}covered)</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
