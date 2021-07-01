import logo from './logo.svg';
import './App.css';
import React, {useEffect, useRef, useState} from "react";
import {NotificationContext} from "./contexts/NotificationContext";
import {Toast, Navbar, Nav, Form, Button} from "react-bootstrap";
import SuspectFormPage from "./pages/SuspectFormPage";
import ReviewPage from "./pages/ReviewPage";
import AboutPage from "./pages/AboutPage";
import MainPage from "./pages/MainPage";
import {Switch, Route, useHistory} from "react-router-dom";
import NavbarCollapse from "react-bootstrap/NavbarCollapse";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

let timer = null;

function App() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Processing");
  const [show, setShow] = useState(false);
  const [toastStyle, setToastStyle] = useState({});
  const [earliestId, setEarliestId] = useState(null);
  let history = useHistory();
  const formRef = useRef(null);

  useEffect(async () => {
    let response = await axios({
      url:"/api/form/get-most-weighted-suspect-form",
      method: "GET",
    });
    response.data['entities'] = JSON.parse(response.data['entities']);
    setEarliestId(response.data.form_id);
    console.log(response.data);
  }, []);

  if(earliestId == null){
    return (<Container className="mt-5">
      <Spinner className="mt-5" style={{width:"35vw", height:"35vw"}} animation="border" variant="dark"/>
    </Container>);
  }

  const searchForm = async (event) => {
    const elements = formRef.current;
    event.preventDefault();
    const searchFormId = BigInt(elements[0].value);
    console.log('searchFormId: ' + searchFormId);

    let response = await axios({
      url: "/api/form/get-suspect-form/" + searchFormId,
      method: "GET"
    });
    response = response.data;
    console.log(response);
    if (response != null){
      console.log('searchFormId1: ' + searchFormId);
      setTimeout(()=>{
        history.push(`/form/${searchFormId}`);
      },1000);
    } else {
      console.log('searchFormId2: ' + searchFormId);
    }
  }

  return (
    <NotificationContext.Provider value={{
      setShow: (isShown)=>{
        console.log("Notification shown");
        setShow(isShown);
        if(timer){
          clearTimeout(timer);
        }
        timer = setTimeout(()=>{
          setShow(false);
          console.log("Notification hided");
        }, 2000);
      },
      setIntent: (intent) => {
        switch (intent) {
          case "success":
            setToastStyle({backgroundColor: "rgb(200,255,200)"});
            break;
          case "failure":
            setToastStyle({backgroundColor: "rgb(255,200,200)"});
            break;
          case "warning":
            setToastStyle({backgroundColor: "rgb(255,230,210)"});
            break;
          default:
            setToastStyle({});
        }
      },
      setContent: (title, content) =>{
        setTitle(title);
        setContent(content);
      }
    }}>
      <div className="App">
        <Toast show={show} onClose={()=>setShow(false)} className="fixed-bottom ml-auto mr-5 mb-5">
          <Toast.Header style={toastStyle}>
            <strong className="mr-auto">{title}</strong>
            <small>time: {new Date().toLocaleTimeString("tr")}</small>
          </Toast.Header>
          <Toast.Body>{content}</Toast.Body>
        </Toast>
        <Navbar bg="light" variant="light">
          <Navbar.Brand href="/">PII Detection</Navbar.Brand>
          <NavbarCollapse>
            <Nav className="m-auto">
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href={"/form/" + earliestId}>Review</Nav.Link>
            </Nav>
            <Form inline onSubmit={searchForm} ref={formRef}>
              <Form.Group>
                <Form.Control type="text" placeholder="Suspected Form ID"/>
                <div>
                  <Button variant="outline-success" type="submit" >
                    Search
                  </Button>
                </div>
              </Form.Group>
            </Form>
          </NavbarCollapse>
        </Navbar>
        <Switch>
          <Route exact path='/' component={MainPage}/>
          <Route path='/about' component={AboutPage}/>
          <Route path='/review' component={ReviewPage}/>
          <Route path='/form/:fid' component={SuspectFormPage}/>
        </Switch>
      </div>
    </NotificationContext.Provider>

  );
}

export default App;
