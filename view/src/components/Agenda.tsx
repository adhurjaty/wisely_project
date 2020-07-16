import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import ReservationSpan from '../models/ReservationSpan';
import { range } from '../helpers';
import Reservation from '../models/Reservation';


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
    padding-left: 2px;
    padding-right: 10px;
    border-right: 1px solid lightgray;
`

const ReservationSlot = styled.div`
    flex-grow: 1;
    border-bottom: 1px solid lightgray;
`

function Agenda({reservationSpans}: {reservationSpans: ReservationSpan[]}): JSX.Element {
    const timeSpans = reservationSpans.map(rs => rs.timeSpan);
    const minHour = Math.min(...timeSpans.map(s => s.startTime.getHours()));
    const maxHour = Math.max(...timeSpans.map(s => s.endTime.getHours()));

    const reservations = reservationSpans.map(rs => rs.reservations).flat();
    const resByHour = reservations.reduce((resHourDict, reservation) => {
        let hour 
        if(!resHourDict[])
    }, {})

    return (
        <AgendaContainer>
            {range(minHour, maxHour).map((h, i) => {
                return <AgendaHour 
                            hour={h}
                            items={[]} />
            })}
        </AgendaContainer>
    )
}

function AgendaHour({hour, items}: {hour: number, items: Reservation[]}): JSX.Element {
    return (
        <HourBlock>
            <HourLabelBlock>{formatHour(hour)}</HourLabelBlock>
            {items.map((item, i) => <div>{i}</div>)}
        </HourBlock>
    )
}

function formatHour(hour: number): string {
    return `${hour % 12 || 12}:00 ${hour > 11 ? 'PM': 'AM'}`
}

export default Agenda