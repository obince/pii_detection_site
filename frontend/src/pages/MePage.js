import Container from "react-bootstrap/Container";
import React from "react";
import '../styles/me.css';

export default function MePage ()  {

    const styles = {
        "card":{
            "height":"auto",
            "backgroundColor":"white",
            "boxShadow":"0px 6px 6px 0px rgba(0,0,0,0.24)",
            "borderRadius":"1em",
            "margin":"1em auto auto"
        },
        "cardcollection":{
            "width":"96%",
            "display":"flex",
            "flex":"1",
            "flexDirection":"row",
            "flexWrap":"wrap",
            "padding":"1.5% 2% 0 2%"
        },
        "h3":{
            "fontSize":"1.5em",
            "fontWeight":"500",
            "color":"rgba(103, 58, 183, 1)",
            "margin":"0",
            "padding":"1em 0 0 0.95em"
        },
        "h4":{
            "fontSize":"1em",
            "fontWeight":"400",
            "color":"black",
            "margin":"0",
            "padding":"1.5em 0 0 1.5em"
        },
        "h5":{
            "fontSize":"1em",
            "fontWeight":"300",
            "color":"black",
            "margin":"0",
            "padding":"0.75em 0 0 1.5em"
        },
        "profile_pic":{
            "maxWidth":"100%",
            "height":"21.9em",
            "borderRadius":"1em 1em 0 0"
        },
        "mentor":{
            "fontSize":"1em",
            "fontWeight":"300",
            "color":"black",
            "margin":"0",
            "padding":"0.5em 0 0.5em 1.5em"
        },
        "web_btn":{
            "backgroundImage":"url(\"../images/world-wide-web@3x.png\")",
            "maxWidth":"100%",
            "width":"2em",
            "height":"2em",
            "backgroundSize":"2em 2em",
            "float":"right",
            "marginTop":"1.25em",
            "marginRight":"1.5em"
        },
        "card_bottom_p":{
            "fontSize":"0.9em",
            "fontWeight":"500",
            "color":"rgba(103, 58, 183, 1)",
            "margin":"0",
            "padding":"1.95em 0 1.65em 1.75em",
            "display":"inline-block"
        }
    }
    return (
        <Container class="mt-5" style={{textAlign: 'left', marginTop:'24px'}}>
            <header className="masthead text-center">
                <div className="card text-left">
                    <img className="profile_pic" src="../images/osman.jpg" alt="Osman image"/>
                    <h3>Osman Batur İnce</h3>
                    <h4>Data Science Intern</h4>
                    <h4 className="mentor">Mentor: <strong>Ömer Orkun Akpınar</strong></h4>
                    <h5>Personal Identifiable Info <strong>(PII)</strong> Detection <br/> Manual Reviewing System </h5>
                    <div className="card_bottom">
                        <p>Bilkent University / CS / Senior</p>
                    </div>
                </div>
            </header>
        </Container>
    );
}