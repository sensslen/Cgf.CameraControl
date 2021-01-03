import * as React from 'react';

import { Connection } from '../Connection/Connection';
import { AppStyle, BottombarStyle, MainContentStyle, TitleStyle } from './styled';

export class App extends React.Component<{}, {}> {
    render() {
        return (
            <AppStyle>
                <TitleStyle>
                    <h1>Cgf.CameraControl.Main</h1>
                </TitleStyle>
                <MainContentStyle>Hi There</MainContentStyle>
                <BottombarStyle>
                    <Connection />
                </BottombarStyle>
            </AppStyle>
        );
    }
}
