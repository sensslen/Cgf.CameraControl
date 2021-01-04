import * as React from 'react';
import { ConnectedStyle, NotConnectedStyle } from './styled';

type ConnectionProps = {
    connected: boolean;
};

export class Connection extends React.Component<{}, ConnectionProps> {
    render() {
        return this.state.connected ? <ConnectedStyle /> : <NotConnectedStyle />;
    }

    componentWillMount() {
        this.setState({
            connected: false,
        });
    }

    componentDidMount() {
        window.api.electronIpcOn('connected', (event, connected: boolean) => {
            this.setState({ connected: connected });
        });
    }
}
