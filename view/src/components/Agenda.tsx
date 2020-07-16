import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import DailyReservations from '../models/DailyReservations';
import { range } from '../helpers';
import Reservation from '../models/Reservation';
import { SLOT_DURATION } from '../constants';


const AgendaContainer = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid lightgray;
`

const HourBlock = styled.div`
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid lightgray;
    height: 200px;
`

const HourLabelBlock = styled.div`
    padding-top: 5px;
    padding-left: 5px;
    border-right: 1px solid lightgray;
    min-width: 80px;
    text-align: left;
`

const HourItemsContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`

const ReservationSlot = styled.div`
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    border-bottom: 1px solid lightgray;
`

const ReservationItem = styled.div`
    flex-grow: 1;
    background: green;
    border: 1px solid black;
    margin: 2px;
`

function Agenda({dailyReservations}: {dailyReservations: DailyReservations}): JSX.Element {
    const [minHour, maxHour] = dailyReservations.getOpenCloseHours();

    return (
        <AgendaContainer>
            {range(minHour, maxHour).map((h, i) => {
                return <AgendaHour 
                            hour={h}
                            items={dailyReservations} />
            })}
        </AgendaContainer>
    )
}

function AgendaHour({hour, items}: {hour: number, items: DailyReservations}): 
    JSX.Element
{
    return (
        <HourBlock>
            <HourLabelBlock>{formatHour(hour)}</HourLabelBlock>
            <AgendaSlot hour={hour} items={items} />
        </HourBlock>
    )
}

function formatHour(hour: number): string {
    return `${hour % 12 || 12}:00 ${hour > 11 ? 'PM': 'AM'}`
}

function AgendaSlot({hour, items}: {hour: number, items: DailyReservations}): JSX.Element {
    const slots = 60 / SLOT_DURATION;

    return (
        <HourItemsContainer>
            {range(slots).map((i) => {
                let minute = i * SLOT_DURATION;
                return <AgendaItems items={items.getSlotReservations(hour, minute)}
                            key={`agendaItem-${i}`} />
            })}
        </HourItemsContainer>
    )
}

function AgendaItems({items}: {items: Reservation[]}): JSX.Element {
    return (
        <ReservationSlot>
            {items.map((item, i) => AgendaItem({item}))}
        </ReservationSlot>
    )
}

function AgendaItem({item, color}: {item: Reservation, color?: string}): JSX.Element {
    return (
        <ReservationItem>
            {`${item.name} party of ${item.partySize}`}
        </ReservationItem>
    )
}

export default Agenda