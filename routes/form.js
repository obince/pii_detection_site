const db = require("../db");
const express = require('express');
const router = express.Router();

router.get("/forms", async (req, res)=>{
    let response = await db.getAllForms();
    if(response){
        res.status(200).send(response);
    }else{
        res.status(200).send([]);
    }
});

router.post("/create-suspect-form", async (req, res)=>{
    let result = await db.createSuspectForm(
        req.body.form_id,
        req.body.entities
    );
    if(result == null){
        res.status(400).send({"message": "There is an error in the db write stage of suspect form creation."});
    }else{
        res.status(200).send({"message": "Successfully suspect form created."});
    }
});

router.get("/get-suspect-form/:fid", async (req, res)=>{
    console.log(`Get suspected form id: ${req.params.fid}`);
    let response = await db.getSuspectForm(req.params.fid);
    console.log(`Get suspected form id (response): ${response}`);
    res.status(200).send(response);
});

router.get("/get-earliest-suspect-form", async (req, res)=>{
    let response = await db.getEarliestSuspectForm();
    res.status(200).send(response);
});

router.get("/get-most-weighted-suspect-form", async (req, res)=>{
    let response = await db.getMostWeightedSuspectForm();
    res.status(200).send(response);
});

router.get("/get-previous-form-id/:id", async (req, res)=>{
    console.log(`Get previous form's id: ${req.params.id}`);
    let response = await db.getPreviousFormById(req.params.id);
    res.status(200).send(response);
});

router.get("/get-next-form-id/:id", async (req, res)=>{
    console.log(`Get next form's id: ${req.params.id}`);
    let response = await db.getNextFormById(req.params.id);
    res.status(200).send(response);
});

router.get("/get-previous-form-weight/:id", async (req, res)=>{
    console.log(`Get previous form's id: ${req.params.id}`);
    let response = await db.getPreviousFormByWeight(req.params.id);
    res.status(200).send(response);
});

router.get("/get-next-form-weight/:id", async (req, res)=>{
    console.log(`Get next form's id: ${req.params.id}`);
    let response = await db.getNextFormByWeight(req.params.id);
    res.status(200).send(response);
});

router.post("/update-form-status", async (req, res)=>{
    let response = await db.updateSuspectFormStatus(
        req.body.id,
        req.body.status
    );
    if(!response){
        res.status(400).send({"message": "There is an error occurred in the db update stage of status."});
    }else {
        res.status(200).send({"message": "Successfully updated status."});
    }
});

router.get("/get-entity-score-weight/:type/:score", async (req, res)=>{
    let response = await db.getEntityScoreWeight(
        req.params.type,
        req.params.score
    );
    res.status(200).send(response);
});

router.post("/update-entity-score-weight", async (req, res)=>{
    let response = await db.updateEntityScoreWeight(req.body.type, req.body.score, req.body.value);
    if(!response){
        res.status(400).send({"message": "There is an error occurred in the db update stage of entity-score weight."});
    }else {
        res.status(200).send({"message": "Successfully updated weight."});
    }
});

module.exports = router;