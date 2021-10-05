import React, {Component} from "react";

class DatePoint extends Component {

    componentDidMount() {
        console.log("component did mount")
    }

    render() {
        const PointHistoryBiker = this.props.PointHistoryBiker;
        //console.log(historyBiker)
        return (
            <div>
                {PointHistoryBiker.map((item, index) => {
                    return (
                        <button key={index} onClick={() => this.props.loadPoint(index)}>{item.date}</button>
                    )
                })}
            </div>
        );
    }
}

export default DatePoint;