import styled from 'styled-components';

const BaseStyle = styled.div`
    flex-grow: 1;
`;

export const ConnectedStyle = styled(BaseStyle)`
    background-color: green;
`;

export const NotConnectedStyle = styled(BaseStyle)`
    background-color: red;
`;
