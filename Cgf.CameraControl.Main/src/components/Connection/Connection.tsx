import { ipcRenderer } from 'electron';
import * as React from 'react';
import style from './style.css';

type ConnectionProps = {
    connected: boolean;
};

export class Connection extends React.Component<{}, ConnectionProps> {
    render() {
        return <div className={this.state.connected ? style.connected : style.base}></div>;
    }

    componentWillMount() {
        this.setState({
            connected: false,
        });
    }

    componentDidMount() {
        ipcRenderer.on('connected', (event, connected) => {
            this.setState({ connected: connected as boolean });
        });
    }
}
