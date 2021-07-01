import {Col, Jumbotron, Form, Button} from "react-bootstrap";
import React, {useContext, useEffect, useRef, useState} from "react";
import {NotificationContext} from "../contexts/NotificationContext";
import {useHistory, useParams, Link} from 'react-router-dom';
import axios from "axios";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import {table} from "../constants/db_prob_table";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import JotformEmbed from "../components/react-jotform-embed";
import {BLACKLIST} from "../constants/blacklist";
import styles from '../App.css';

export default function SuspectFormPage() {
    const context = useContext(NotificationContext);
    const params = useParams();
    const [INCREASE, DECREASE] = [1, -1];
    const [setShowToast, setContent, setIntent] = [context.setShow, context.setContent, context.setIntent];
    const [src, setSrc] = useState("");
    const [formData, setFormData] = useState(null);
    const [disableButton, setDisableButton] = useState(null);
    const [refresh, setRefresh] = useState(false);
    let history = useHistory();

    /**
     * Navigates to the previous form.
     *
     * By retrieving the previous form by weight, it navigates to the previous form.
     *
     * @return {void}.
     */
    const goToPreviousForm = async () => {
        let response = await axios({
            // url:"/api/form/get-previous-form-id/" + formData.id,
            url:"/api/form/get-previous-form-weight/" + formData.id,
            method: "GET",
        });
        console.log(response.data);
        setShowToast(true);
        if(!!response.data){
            setIntent("success");
            setContent("Success", "You are being redirected to previous form");
            setTimeout(()=>{
                history.push(`/form/${response.data.form_id}`);
                setRefresh(!refresh);
            },200);
            setRefresh(!refresh);
        } else{
            setIntent("failure");
            setContent("Error", "There is no previous form");
        }
    }

    /**
     * Updates the status of form.
     *
     * Update the status of form with the newStatus param.
     *
     * @param {string}   newStatus           The new status for the form. ("TBD", "NO", "YES", "MAYBE")
     *
     * @return {void}.
     */
    const updateFormStatus = async (newStatus) => {
        let response = await axios({
            url: "/api/form/update-form-status",
            method: "POST",
            data: {
                id: formData.id,
                status: newStatus,
            }
        });
        setShowToast(true);
        if(response.status === 200){
            setIntent("success");
            setContent("Success", response.data.message);
            setDisableButton(true);
        } else{
            setIntent("failure");
            setContent("Status cannot be updated", response.data.message);
        }
    }

    /**
     * Navigates to the next form.
     *
     * By retrieving the previous form by weight, it navigates to the previous form.
     *
     * @return {void}.
     */
    const goToNextForm = async () => {
        let response = await axios({
            // url:"/api/form/get-next-form-id/" + formData.id,
            url:"/api/form/get-next-form-weight/" + formData.id,
            method: "GET",
        });
        console.log(response.data);
        setShowToast(true);
        if(!!response.data){
            setIntent("success");
            setContent("Success", "You are being redirected to next form");
            setTimeout(()=>{
                history.push(`/form/${response.data.form_id}`);
                setRefresh(!refresh);
            },200);
        } else{
            setIntent("failure");
            setContent("Error", "There is no next form");
        }
    }
    /**
     * Get the form data, and parse the entities
     * If the form is already flagged in terms of PII, disable flag buttons
     */
    useEffect(async () => {
        let response = await axios({
            url:"/api/form/get-suspect-form/" + params.fid,
            method: "GET",
        });
        response.data['entities'] = JSON.parse(response.data['entities']);
        setFormData(response.data);
        console.log(response.data);
        let initialDisable = true;
        if (response.data.status === "TBD" || response.data.status === "MAYBE")
            initialDisable = false;
        setDisableButton(initialDisable);
        setSrc("https://form.jotform.com/" + params.fid);
    }, [refresh]);

    if(formData == null){
        return (<Container className="mt-5">
            <Spinner className="mt-5" style={{width:"35vw", height:"35vw"}} animation="border" variant="dark"/>
        </Container>);
    }

    /**
     * Updates the status of form.
     *
     * Update the status of form with the newStatus param.
     *
     * @param {Object}   entity           The entity object that has (type, score, substring)
     *
     * @param {number}   FLAG             Whether the score weight will be increased or not
     *
     * @return {void}.
     */
    const updateScoreWeight = async (entity, FLAG) => {
        const curScore = table[entity.score];
        let response = await axios({
            url: "/api/form/get-entity-score-weight/" + entity.type + "/" + curScore,
            method: "GET",
        });
        let newWeight = response.data[curScore];
        console.log("First new weight:");
        console.log(newWeight);

        if( FLAG === INCREASE){
            newWeight += Math.sqrt(newWeight);
        } else {
            newWeight -= Math.sqrt(newWeight);
        }
        if (newWeight < 0){
            newWeight = 0;
        }

        if(response.status === 200){
            console.log("Entity update is done!")
        } else{
            console.log("Entity update is not done!")
        }

        console.log(newWeight);
        console.log(parseInt(newWeight));
        let updateResponse = await axios({
            url: "/api/form/update-entity-score-weight",
            method: "POST",
            data: {
                type: entity.type,
                score: curScore,
                value: newWeight
            },
        });

        setShowToast(true);
        if(updateResponse.status === 200){
            setIntent("success");
            setContent("Success", updateResponse.data.message);
            setDisableButton(true);
        } else{
            setIntent("failure");
            setContent("Status cannot be updated", updateResponse.data.message);
        }
    }

    /**
     * Render an entity to a Card.
     *
     * Render an entity to a Card.
     *
     * @param {Object}   entity           The entity object that has (type, score, substring)
     *
     * @return {JSX.Element}.
     */
    const entityItem = (entity) => {
        if(BLACKLIST.includes(entity.type)){
            return <></>;
        }
        
        return (
            <Card className="mt-3">
                <Card.Header><strong>{entity.substr}</strong></Card.Header>
                <Card.Body>
                    <Card.Subtitle >{entity.type + "\n"}
                        <Card.Text>{"Score: " + entity.score}</Card.Text>
                    </Card.Subtitle>
                </Card.Body>
                <Card.Body className="mt-0 pt-0">
                    <Button className="mr-2" variant="danger" style={{height: "min-content"}} onClick={async () => updateScoreWeight(entity, DECREASE)}>
                        Incorrect Label
                    </Button>
                    <Button className="ml-2" variant="success" style={{height: "min-content"}} onClick={async () => updateScoreWeight(entity, INCREASE)}>
                        Correct Label
                    </Button>
                </Card.Body>
            </Card>
        )
    }

    return (
        <div className="splitScreen">
            <div className="topPane">
                <JotformEmbed src={src} />
            </div>
            <div className="bottomPane">
                    <h2><strong>Suspected Form</strong></h2>
                    <h3 className="mt-3"><strong>Suspected Substrings</strong></h3>
                    <ListGroup>
                        {formData['entities'].map((entity) => entityItem(entity))}
                    </ListGroup>
                    <Button className="float-left ml-3" variant="outline-dark" style={{height: "min-content"}} onClick={goToPreviousForm}>
                        Previous Form
                    </Button>
                    <Button disabled={disableButton} className="mr-2" variant="danger" style={{height: "min-content"}}  onClick={() => updateFormStatus("NO")}>
                        Does not contain PII
                    </Button>
                    <Button disabled={disableButton} className="mr-2 ml-2" variant="warning" style={{height: "min-content"}}  onClick={() => updateFormStatus("MAYBE")}>
                        Maybe contains PII
                    </Button>
                    <Button disabled={disableButton} className="ml-2" variant="success" style={{height: "min-content"}} onClick={() => updateFormStatus("YES")}>
                        Contains PII
                    </Button>
                    <Button className="float-right mr-3" variant="outline-dark" style={{height: "min-content"}} onClick={goToNextForm}>
                        Next Form
                    </Button>
            </div>
        </div>
    );
}