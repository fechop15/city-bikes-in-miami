import React, {Component} from "react";
import socketIOClient from "socket.io-client";
import {Map, TileLayer} from "react-leaflet";
import AddMarker from "./componets/AddMarker";
import DatePoint from "./componets/DatePoint";
import moment from "moment";

class App extends Component {
    constructor() {
        super();
        this.state = {
            response: false,
            endpoint: "http://127.0.0.1:4001",
            lat: 51.505,
            lng: -0.09,
            zoom: 13,
            historyBiker: [],
            PointHistoryBiker: [],
            PointHistoryBikerIndex: -1,
            loadPointMap: false,
            time: null
        };

    }

    componentDidMount() {
        const {endpoint} = this.state;
        const socket = socketIOClient(endpoint);

        socket.emit("bikes_aviable", endpoint);

        socket.on("get_biker_info", (data) => {
            let infoBiker = JSON.parse(data);
            console.log(infoBiker)
            if (infoBiker) {
                this.setState(prevState => ({
                    historyBiker: infoBiker.network.stations,
                    response: true,
                    lat: infoBiker.network.location.latitude,
                    lng: infoBiker.network.location.longitude,
                    time: moment().format("DD-MM-YYYY hh:mm")
                }));
            }
        });

    }

    savePoint() {
        this.setState(prevState => ({
            PointHistoryBiker: [...prevState.PointHistoryBiker, {
                stations: this.state.historyBiker,
                date: moment().format("DD-MM-YYYY hh:mm")
            }]
        }));
    }

    realTimePoint() {
        this.setState(prevState => ({
            loadPointMap:false
        }));
    }


    render() {
        const {response, historyBiker, loadPointMap, PointHistoryBiker,time,PointHistoryBikerIndex} = this.state;
        const position = [this.state.lat, this.state.lng]
        let historyMarker,dateHistory=-1;
        if (loadPointMap) {
            dateHistory=PointHistoryBiker[PointHistoryBikerIndex].date;
            historyMarker = <AddMarker stations={PointHistoryBiker[PointHistoryBikerIndex].stations}/>
        } else {
            dateHistory=-1;
            historyMarker = <AddMarker stations={historyBiker}/>
        }
        const loadPoint=(index)=>{
            this.setState(prevState => ({
                loadPointMap:true,
                PointHistoryBikerIndex:index,
            }));
        };
        if (response)
            return (

                <div className="map">
                    <h1> City Bikes in Miami </h1>
                    <p>{dateHistory===-1?time:dateHistory}</p>
                    <Map center={position} zoom={this.state.zoom}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {historyMarker}
                    </Map>
                    <button onClick={() => this.savePoint()}>save date point</button>
                    <button onClick={() => this.realTimePoint()}>real time point</button>
                    <DatePoint PointHistoryBiker={PointHistoryBiker} loadPoint={loadPoint}/>
                </div>
            );
        else
            return (
                <div className="map">
                    loading...
                </div>
            );
    }
}

export default App;
