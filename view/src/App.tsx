import React from 'react';
import logo from './logo.svg';
import styled from 'styled-components'
import './App.css';
import AppRouter from './AppRouter';
import Header from './components/Header';
import 'react-calendar/dist/Calendar.css'

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
`

const BodyContainer = styled.div`
    display: flex;
    flex-direction: column;
`

function App() {
    return (
        <MainContainer>
            <Header />
            <BodyContainer>
                <div id="modalContainer"></div>
                <AppRouter />
            </BodyContainer>
        </MainContainer>
    );
}

export default App;
