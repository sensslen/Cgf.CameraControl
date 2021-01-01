import * as React from 'react';

import { Connection } from '../Connection/Connection';
import style from "./style.css";

export class App extends React.Component<{},{}> {
    render() {
        return (
            <div className={style.App}>
                <div>
                    <h1>Cgf.CameraControl.Main</h1>
                </div>
                <div className={style.content}>
                 Hi There
                </div>
                <div className={style.bottom}>
                    <Connection  />
                </div>
            </div>
        )
    }
}