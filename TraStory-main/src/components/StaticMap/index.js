import React, { Component } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import cheast from "../../images/treasure.png";
import "leaflet/dist/leaflet.css";

function GetIcon(_iconSize, forecast) {
  return L.icon({
    iconUrl: cheast,
    iconSize: [_iconSize],
  });
}

//Intialied intrest point dots
function StaticMap(props) {
  const position = [props.pointIntrest?.geoPointSite?.latitude, props.pointIntrest?.geoPointSite?.longitude];
  let temp = [];
  if (props.gameList) {
    props.gameList.map((itm, i) => {
      temp.push({
        name: itm.pointIntrest.placeName,
        position: itm.pointIntrest.geoPoint ? [itm.pointIntrest.geoPoint.latitude, itm.pointIntrest.geoPoint.longitude] : [32.70386081777419, 35.12992763616121],
        size: 25,
      });
    });
  }
  const locations = temp;

  return (
    <MapContainer className="map" center={position} zoom={17} style={{ height: 300, width: 200, position: " center" }}>
      <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locations.map((location) => (
        <Marker position={location.position} icon={GetIcon(location.size, location.forecast)}>
          <Popup>{location.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default StaticMap;
