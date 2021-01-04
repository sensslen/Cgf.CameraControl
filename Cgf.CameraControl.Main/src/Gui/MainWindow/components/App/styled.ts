import styled from 'styled-components';

const Border = styled.div`
    margin: 0em 2em;
`;

export const AppStyle = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

export const BottombarStyle = styled.div`
    flex-basis: 0.5em;
    flex-grow: 0;
    display: flex;
    align-content: stretch;
`;

export const MainContentStyle = styled(Border)`
    flex-grow: 1;
`;

export const TitleStyle = styled(Border)`
    flex-grow: 0;
    padding-top: 1em;
`;
