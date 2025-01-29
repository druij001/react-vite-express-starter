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
        try {
            app.post("/api/point/post",(req, res) => {
    
                const options = {
                    x: req.query.x || null,
                    y: req.query.y || null,
                    label: req.query.label,
                    series_id: req.query.series
                };
    
                // Needs validation
                if(options.x == null || !options.y == null) {
                    res.sendStatus(400);
                    return;
                }
        
                pgClient.query(
                    "INSERT INTO POINTS (x, y, label, series_id) \
                    VALUES ($1, $2, $3, $4)", [options.x, options.y, options.label, options.series_id])  
                    .then((r) => {
                        res.send(options);
                    })
            })
        } catch (error) {
            console.log(error);
        }
    
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


}

// app.get("/roads", (req, res) => res.send(`api Server - path: "${req.path} "`))
// app.get("/route", (req, res) => res.send(`api Server - path: "${req.path} "`))
// app.get("/series/post", (req, res) => res.send(`api Server - path: "${req.path} "`))
// app.get("/point/post", (req, res) => res.send(`api Server - path: "${req.path} "`))

app.listen(3002, (() => console.log("Listening")))