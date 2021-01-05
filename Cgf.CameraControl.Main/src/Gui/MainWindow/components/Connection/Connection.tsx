import * as React from 'react';
import { ConnectedStyle, NotConnectedStyle } from './styled';

type ConnectionProps = {
    connected: boolean;
};

export class Connection extends React.Component<{}, ConnectionProps> {
    constructor(props: Readonly<{}> | {}) {
        super(props);

        this.state = { connected: false };
    }

    render() {
        return this.state.connected ? <ConnectedStyle /> : <NotConnectedStyle />;
    }

    componentDidMount() {
        window.api.electronIpcOn('connected', (event, connected: boolean) => {
            this.setState({ connected: connected });
        });
    }
}
