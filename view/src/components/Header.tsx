import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom';

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

const Links = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`

const NavLink = styled.a`
    background-color: gray;
    color: white;
    padding: 0.6em 1.0em;
    text-decoration: none;
    margin-right: 10px;
`

function Header(): JSX.Element {
    return (
        <NavBar>
            <span><b>Wisely Reservation Manager</b></span>
            <Links>
                <NavLink href="/inventory">Inventory</NavLink>
                <NavLink href="/reservations">Reservations</NavLink>
            </Links>
        </NavBar>
    )
}

export default Header