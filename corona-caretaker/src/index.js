import React from "react";
import ReactDOM from "react-dom";
import "milligram";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import GoogleMapReact from "google-map-react";
import Radar from "radar-sdk-js";
import { Provider } from "react-redux";
import { store } from "./chat";
import App from "./App";
import { compose, withProps, withHandlers, withState } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
/*global google*/
function Header() {
  return (
    <React.Fragment>
      <div className="header-container">
        <div className="inner-header-container">
          <h1>Hi, my name is</h1>
          <h1>Corona Caretaker!</h1>
        </div>
        <div className="button-container">
          <a href="#about" className="scroll-button" >About</a>
          <a href="#chat" className="scroll-button">Try me!</a>
        </div>
      </div>

    </React.Fragment>
  );
}

function About() {
  return (
    <React.Fragment>
      <div className="about-container" id="about">
        <h2>About</h2>
        <div className="content">
            <h4>I am a virtual assistant designed to help users stay informed and educated about COVID-19. My creators made me by using <strong>Dialogflow</strong>, a natural language processing (NLP)
            tool powered by <strong>Google Cloud</strong>. I was trained on over 20 "intents," so I can hold a conversation, as well as provide you with a wide range of resources to learn from. Ask me about
            what COVID-19 is, if it's real or not, and conspiracy theories surrounding the virus. Tell me if you're sick too, I can help you out!</h4>
            <br></br>
            <h4>My creators built this entire application with <strong>JavaScript React</strong> and <strong>Redux</strong>, and hosted me using <strong>Google Firebase.</strong></h4>
            <br></br>
            <h4>There's still some work to be done though! My map function uses the <strong>Google Maps API*</strong> along with <strong>Radar.io</strong> to accurately display the closest COVID-19 testing facilities to you.
            However, the Google Maps API does not currently support COVID-19 testing facility tracking.</h4>
        </div>
        <div className="footer">
            Source code available on <strong><a href="https://github.com/lduan11/bigboycoders">GitHub</a></strong>
        </div>
      </div>
    </React.Fragment>
  );
}

const AnyReactComponent = ({ text }) => <div>{text}</div>;




const MyMapComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCj37HR3ebC1UHS50m3LqM1dTPQ5kzcHeU&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap,
    withState('places', 'updatePlaces', ''),
    withHandlers(() => {
        const refs = {
            map: undefined,
        }

        return {
            onMapMounted: () => ref => {
                refs.map = ref
            },
            fetchPlaces: ({ updatePlaces }) => {
                let places;
                const bounds = refs.map.getBounds();
                const service = new google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
                const request = {
                    bounds: bounds,
                    query : 'covid testing'
                };
                service.nearbySearch(request, (results, status) => {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        console.log(results);
                        updatePlaces(results);
                    }
                })
            }
        }
    }),
)((props) => {
    return (
        <GoogleMap
            onTilesLoaded={props.fetchPlaces}
            ref={props.onMapMounted}
            onBoundsChanged={props.fetchPlaces}
            defaultZoom={8}
            defaultCenter={{ lat: 51.508530, lng: -0.076132 }}
        >
            {props.places && props.places.map((place, i) =>
                <Marker key={i} position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }} />
            )}
        </GoogleMap>
    )
})




function Map() {
  Radar.initialize("prj_live_pk_21349df7f94d8750e0d0c588abde594ed166c46d");
  let defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };
  Radar.trackOnce(function(err, result) {
    if (!err) {
      defaultProps.center.lat = result.coords.latitude;
      defaultProps.center.lng = result.coords.longitude;
      return (
        <React.Fragment>
          <div style={{ height: "50vh", width: "50%" }}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyCYVBKK_e3qDxr5RJBALvR9B68AGjOsMYE"
              }}
              defaultCenter={defaultProps.center}
              defaultZoom={defaultProps.zoom}
            >
              <AnyReactComponent
                lat={59.955413}
                lng={30.337844}
                text="My Marker"
              />
            </GoogleMapReact>
          </div>
        </React.Fragment>
      );
    }
  });

  return (
    <React.Fragment>
      <div style={{ height: "50vh", width: "50%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyCYVBKK_e3qDxr5RJBALvR9B68AGjOsMYE" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
        </GoogleMapReact>
      </div>
    </React.Fragment>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Header />
    <About />
    <Provider store={store}>
      <App />
    </Provider>
    <MyMapComponent />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
