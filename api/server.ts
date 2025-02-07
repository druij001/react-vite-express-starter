
import express from "express";
import pg from "pg"
import cors from "cors"

class ServerResponse {
    response: number;
    data: any;

    constructor(response: number, data: any) {
        this.response = response;
        this.data = data;
    }
}


const app = express();
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
setupApp()

async function setupApp() {


    const pgClient = new pg.Client({
        database: "gisdb",
        password: "postgres",
        user: "postgres",
        port: 5432,
        host: "postgres",
    });
    await pgClient.connect();


    //Create a new series
    app.post("/api/series/post", (req, res) => {

        const options = {
            name: req.query.name || null,
            description: req.query.description || null
        };

        // Needs validation
        if (!options.description && !options.name) {
            res.send(new ServerResponse(403, false));
            return;
        }

        pgClient.query(
            "INSERT INTO SERIES (name, description) \
                VALUES ($1, $2)", [options.name, options.description])
            .then(() => res.send(new ServerResponse(200, true)))
            .catch(() => res.send(new ServerResponse(404, false)));
    });

    //Create a new point
    app.post("/api/feature/post", (req, res) => {

        const options = {
            label: req.query.label || null,
            type: req.query.type,
            geom: req.query.geom,
            series_id: req.query.series
        };

        // Needs validation
        if (!options.geom || !options.series_id || !options.type) {
            res.send(new ServerResponse(403, false));
            return;
        }

        pgClient.query(
            "INSERT INTO user_features (label, type, geom, series_id) \
            VALUES ($1, $2, $3, $4)", [options.label, options.type, options.geom, options.series_id])
            .then(() => res.send(new ServerResponse(200, true)))
            .catch(() => res.send(new ServerResponse(404, false)));
    })



    // Fetch roads
    app.get("/api/roads", (req, res) => {

        const options = {
            limit: req.query.limit || 10
        };

        // Needs validation

        pgClient.query(
            "select * from planet_osm_roads \
            limit $1", [options.limit])
            .then(r => res.send(new ServerResponse(200, r.rows)))
            .catch(() => res.send(new ServerResponse(404, undefined)));
    })

    // Fetch a route
    app.get("/api/route", (req, res) => {

        const options = {
            source: req.query.source || 0,
            target: req.query.target || 0
        };

        // Needs validation
        pgClient.query(
            "SELECT * FROM get_route($1, $2)", [options.source as number, options.target as number])
            .then(r => res.send(new ServerResponse(200, r.rows)))
            .catch(() => res.send(new ServerResponse(404, undefined)));
    })

    // Fetch all series
    app.get("/api/series/fetch", (_req, res) => {

        let query = "SELECT * FROM series ORDER BY id";

        pgClient.query(
            query)
            .then((r) => res.send(new ServerResponse(200, r.rows)))
            .catch(() => res.send(new ServerResponse(404, undefined)));
    })

    // Fetch a single series
    app.get("/api/series/fetchSingle", (req, res) => {

        const options = {
            id: req.query.id,
        };

        if (!options.id) {
            res.sendStatus(400);
            return;
        }

        let query = "\
            select f.id, f.label, f.series_id, f.type, f.geom from user_features as f \
            join series as s on s.id = f.series_id \
            where s.id = $1"

        pgClient.query(
            query, [options.id])
            .then((r) => res.send(new ServerResponse(200, r.rows)))
            .catch(() => res.send(new ServerResponse(404, undefined)));
    })
}

app.listen(3002, (() => console.log("Listening")))