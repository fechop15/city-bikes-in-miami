import React, {Component} from "react";
import {Marker, Popup} from "react-leaflet";

class AddMarker extends Component {

    componentDidMount() {
        console.log("component did mount")
    }
    render() {
        const historyBiker = this.props.stations;
        //console.log(historyBiker)
        return (
            <div>
                {historyBiker.map(item => {
                    return (
                        <Marker key={item.id} position={[item.latitude, item.longitude]}>
                            {item.name && <Popup>
                                <p className="title">{item.name}</p>
                                <span> bikes aviable: {item.free_bikes}</span>
                            </Popup>}
                        </Marker>
                    )
                })}
            </div>
        );
    }
}

export default AddMarker;