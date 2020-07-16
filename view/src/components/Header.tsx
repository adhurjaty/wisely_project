import React from 'react'
import styled from 'styled-components'

const NavBar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 2%;
    height: 50px;
    align-items: center;
    margin-bottom: 10px;
`;

function Header(): JSX.Element {
    return (
        <NavBar>
            <span><b>Wisely Reservation Manager</b></span>
        </NavBar>
    )
}

export default Header