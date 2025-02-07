import TileLayer from "ol/layer/Tile"
import "ol/ol.css"
import { TileWMS, WMTS } from "ol/source"
import WMTSTileGrid from "ol/tilegrid/WMTS"
import { getTopLeft } from "ol/extent"
import { getWidth } from 'ol/extent';
import { get as getProjection, Projection, useGeographic } from 'ol/proj'
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import Style from "ol/style/Style"
import Stroke from "ol/style/Stroke"


const projection = getProjection("EPSG:4326") || new Projection({code: "EPSG:4326"});
const projectionExtent = projection.getExtent();
var size = getWidth(projectionExtent) / 256 / 2;
const zoomLevel = 25;
const resolutions = new Array(zoomLevel);
const matrixIds = new Array(zoomLevel);
useGeographic(); // This needs to be called once to enable geographic funcionality

for (var z = 0; z < zoomLevel; ++z) {
    // generate resolutions and matrixIds arrays for this WMTS
    resolutions[z] = size / Math.pow(2, z);
    matrixIds[z] = 'EPSG:4326:' + z;
}

export const populatedPlacesLayer = {
    name: "Population areas",
    z: 10,
    value: new TileLayer({
        preload: Infinity,
        maxZoom: 10,
        source: new WMTS({
            url: 'http://localhost:8080/geoserver/gwc/service/wmts?',
            layer: 'CacheTest:populated_places',
            matrixSet: "EPSG:4326",
            format: 'image/png',
            projection: projection,
            tileGrid: new WMTSTileGrid({
                resolutions: resolutions,
                matrixIds: matrixIds,
                origin: getTopLeft(projectionExtent),
            }),
            //attributions: "@geoserver",
            style: '',
            wrapX: true
        }),
    })
};

export const topographyLayer = {
    name: "Topography",
    z: 1,
    value: new TileLayer({
        preload: Infinity,
        maxZoom: 8,
        source: new WMTS({
            url: 'http://localhost:8080/geoserver/gwc/service/wmts?',
            layer: 'CacheTest:SR_50M',
            matrixSet: "EPSG:4326",
            format: 'image/png',
            projection: projection,
            tileGrid: new WMTSTileGrid({
                resolutions: resolutions,
                matrixIds: matrixIds,
                origin: getTopLeft(projectionExtent),
            }),
            //attributions: "@geoserver",
            style: '',
            wrapX: true
        }),
    })
};


export const countriesLayer = {
    name: "Country borders",
    z: 1,
    value: new TileLayer({
        preload: Infinity,
        maxZoom: 13,
        source: new WMTS({
            url: 'http://localhost:8080/geoserver/gwc/service/wmts?',
            layer: 'CacheTest:countries',
            matrixSet: "EPSG:4326",
            format: 'image/png',
            projection: projection,
            tileGrid: new WMTSTileGrid({
                resolutions: resolutions,
                matrixIds: matrixIds,
                origin: getTopLeft(projectionExtent),
            }),
            //attributions: "@geoserver",
            style: '',
            wrapX: true
        }),
    })
};

export const AusLineLayer = {
    name: "Paths",
    z: 5,
    value: new TileLayer({
        preload: Infinity,
        minZoom: 10,
        opacity: 0.5,
        source: new WMTS({
            url: 'http://localhost:8080/geoserver/gwc/service/wmts?',
            layer: 'qmaps:planet_osm_line',
            matrixSet: "EPSG:4326",
            format: 'image/png',
            projection: projection,
            tileGrid: new WMTSTileGrid({
                resolutions: resolutions,
                matrixIds: matrixIds,
                origin: getTopLeft(projectionExtent),
            }),
            //attributions: "@geoserver",
            style: '',
            wrapX: true
        }),
    })
};

export const AusPolyLayer = {
    name: "Buildings",
    z: 3,
    value: new TileLayer({
        preload: Infinity,
        minZoom: 15,
        source: new WMTS({
            url: 'http://localhost:8080/geoserver/gwc/service/wmts?',
            layer: 'qmaps:planet_osm_polygon',
            matrixSet: "EPSG:4326",
            format: 'image/png',
            projection: projection,
            tileGrid: new WMTSTileGrid({
                resolutions: resolutions,
                matrixIds: matrixIds,
                origin: getTopLeft(projectionExtent),
            }),
            //attributions: "@geoserver",
            style: '',
            wrapX: true
        }),
    })
};


export const AusRoadLayer = {
    name: "Roads",
    z: 6,
    value: new TileLayer({
        preload: Infinity,
        maxZoom: 14,
        minZoom: 5,
        opacity: 0.5,
        source: new WMTS({
            url: 'http://localhost:8080/geoserver/gwc/service/wmts?',
            layer: 'qmaps:aus_roads_with_vertices',
            matrixSet: "EPSG:4326",
            format: 'image/png',
            projection: projection,
            tileGrid: new WMTSTileGrid({
                resolutions: resolutions,
                matrixIds: matrixIds,
                origin: getTopLeft(projectionExtent),
            }),
            //attributions: "@geoserver",
            style: '',
            wrapX: true
        }),
    })
};

export const AusPointLayer = {
    name: "Interest Points",
    z: 8,
    value: new TileLayer({
        preload: Infinity,
        minZoom: 15,
        source: new WMTS({
            url: 'http://localhost:8080/geoserver/gwc/service/wmts?',
            layer: 'qmaps:planet_osm_point',
            matrixSet: "EPSG:4326",
            format: 'image/png',
            projection: projection,
            tileGrid: new WMTSTileGrid({
                resolutions: resolutions,
                matrixIds: matrixIds,
                origin: getTopLeft(projectionExtent),
            }),
            //attributions: "@geoserver",
            style: '',
            wrapX: true
        }),
    })
};


export const AusAmenityLayer = {
    name: "Amenities",
    z: 9,
    value: new TileLayer({
        preload: Infinity,
        minZoom: 16,
        source: new WMTS({
            url: 'http://localhost:8080/geoserver/gwc/service/wmts?',
            layer: 'qmaps:aus_amenities',
            matrixSet: "EPSG:4326",
            format: 'image/png',
            projection: projection,
            tileGrid: new WMTSTileGrid({
                resolutions: resolutions,
                matrixIds: matrixIds,
                origin: getTopLeft(projectionExtent),
            }),
            //attributions: "@geoserver",
            style: '',
            wrapX: true
        }),
    })
};

export const AdlImageLayer = {
    name: "Adl Image",
    z: 0,
    value: new TileLayer({
        preload: Infinity,
        source: new WMTS({
            url: 'http://localhost:8080/geoserver/gwc/service/wmts?',
            layer: 'qmaps:ESRIWI_AUS',
            matrixSet: "EPSG:4326",
            format: 'image/png',
            projection: projection,
            tileGrid: new WMTSTileGrid({
                resolutions: resolutions,
                matrixIds: matrixIds,
                origin: getTopLeft(projectionExtent),
            }),
            //attributions: "@geoserver",
            style: '',
            wrapX: true
        }),
    })
};


export const RouteLayer = {
    name: "Adl Route",
    z: 12,
    value: new TileLayer({
        preload: Infinity,
        source: new TileWMS({
            url: 'http://localhost:8080/geoserver/qmaps/wms?',
            params: {
                'LAYERS': 'qmaps:aus_routes',
            }
        }),
    })
};

export const CustomPointsLayerSource = new VectorSource({ wrapX: false });

export const CustomPointsLayer = {
    name: "Custom Points",
    z: 20,
    value: new VectorLayer({
        source: CustomPointsLayerSource
    })
}


export const VectorRouteSource = new VectorSource({ wrapX: false });

export const VectorRouteLayer = {
    name: "Route",
    z: 20,
    value: new VectorLayer({
        source: VectorRouteSource,
        style: new Style({
            stroke: new Stroke({
              color: '#82caffDD',
              width: 8,
            }),
            
          }),
    })
}
