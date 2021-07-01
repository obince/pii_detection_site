import {Col, Jumbotron, Form, Button} from "react-bootstrap";
import React, {useContext, useRef, useState} from "react";
import {NotificationContext} from "../contexts/NotificationContext";
import {useHistory, useParams, Link} from 'react-router-dom';
import axios from "axios";

export default function MainPage() {
    return (
        <Jumbotron>
            <h1>Welcome to PII Detection System.</h1>
            <p>
                Get started by clicking on <strong>Review</strong> link on the navbar.
            </p>
            <p>
                Or, you can enter the specific <strong>form ID</strong> to access that specific suspect form on the navbar.
            </p>
        </Jumbotron>
    );
}