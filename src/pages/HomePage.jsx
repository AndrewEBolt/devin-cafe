import React from 'react';
import DailyIframe from "@daily-co/daily-js";
import {ROOM_URL} from '../constants'
import Call from '../components/call';

export default class HomePage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            callObject: null,
        };
    }

    componentDidMount() {
        const newCallObject = DailyIframe.createCallObject();
        newCallObject.join({
            url: ROOM_URL,
        })

        this.setState({callObject: newCallObject})
    }

    componentDidUpdate() {
        const {callObject} = this.state;

        if (!callObject) return;


    }

    render() {
        return (
            <div className="home-page-container">
                <Call callObject={this.state.callObject} />
            </div>
        )
    }
}