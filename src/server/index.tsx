import express from "express";
import { api } from "./api.js";
import pg from "pg"
import cors from "cors"

const app = express();
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
    
    try {
    // Fetch roads
    app.get("/api/roads",(req, res) => {

        const options = {
            limit: req.query.limit || 10
        };

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

app.get("/roads", (req, res) => res.send(`api Server - path: "${req.path} "`))
app.listen(3002, (() => console.log("Listening")))