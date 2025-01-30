import express from "express";
import { api } from "./api.js";
import pg from "pg"
import cors from "cors"

const app = express();
const router = express.Router();
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
  };
app.use(api);
app.use(cors(corsOptions));
setupApp()

async function setupApp() {


    const pgClient = new pg.Client({
        database: "gisdb",
        password: "",
        user: "postgres",
        port: 5432,
        host: "localhost",
    });
    await pgClient.connect();


    //Create a new series
    try {
        app.post("/api/series/post",(req, res) => {

            const options = {
                name: req.query.name || null,
                description: req.query.description || null
            };

            // Needs validation
            if(!options.description && !options.name) {
                res.send(options);
                return;
            }
    
            pgClient.query(
                "INSERT INTO SERIES (name, description) \
                VALUES ($1, $2)", [options.name, options.description])  
                .then((r) => {
                    res.send(options);
                })
        })
    } catch (error) {
        console.log(error);
    }

        //Create a new point
            app.post("/api/feature/post",(req, res) => {
    
                const options = {
                    label: req.query.label,
                    geom: req.query.geom,
                    series_id: req.query.series
                };
    
                // Needs validation
                if(!options.geom) {
                    res.sendStatus(410);
                    return;
                }
        
                pgClient.query(
                    "INSERT INTO user_features (label, geom, series_id) \
                    VALUES ($1, $2, $3)", [options.label, options.geom, options.series_id])  
                    .then((r) => {
                        res.sendStatus(200);
                    }).catch(e => res.sendStatus(400))
            })
    
    try {
    // Fetch roads
    app.get("/api/roads",(req, res) => {

        const options = {
            limit: req.query.limit || 10
        };

        // Needs validation

        pgClient.query(
            "select * from planet_osm_roads \
            limit $1", [options.limit])
            .then((r) => {
                res.send(r.rows)
            }).catch((err) => {
                res.send(err)
            })
    })
    }
    catch(error) {
        console.log(error);
    }    
    
    // Fetch a route
    try {
        app.get("/api/route",(req, res) => {

            const options = {
                source: req.query.source || 0,
                target: req.query.target || 0
            };

            // Needs validation
            pgClient.query(
                "SELECT * FROM get_route($1, $2)", [options.source as number, options.target as number])
                .then((r) => {
                    res.send(r.rows)
                })
        })
    } catch (error) {
        console.log(error);
    }

    // Fetch all series
        app.get("/api/series/fetch",(req, res) => {

            const options = {
                id: req.query.id,
            };

            let query = "SELECT * FROM series";
            if(options.id) query = query.concat(" WHERE id = $1")

            console.log(query);

            pgClient.query(
                query, [])
                .then((r) => res.send(r.rows))
                .catch(e => res.sendStatus(400));
        })
}

app.listen(3002, (() => console.log("Listening")))