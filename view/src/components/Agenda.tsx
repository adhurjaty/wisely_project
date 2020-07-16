import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import ReservationSpan from '../models/DailyReservations';
import { range, slotKeysForHour } from '../helpers';
import Reservation from '../models/Reservation';
import { SLOT_DURATION } from '../constants';


const AgendaContainer = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid lightgray;
`

const HourBlock = styled.div`
    display: flex;
    flex-direction: column;
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
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    border-bottom: 1px solid lightgray;
`

const ReservationItem = styled.div`
    flex-grow: 1;
    background: green;
`

function Agenda({reservationSpans}: {reservationSpans: ReservationSpan[]}): JSX.Element {
    const timeSpans = reservationSpans.map(rs => rs.timeSpan);
    const minHour = Math.min(...timeSpans.map(s => s.startTime.getHours()));
    const maxHour = Math.max(...timeSpans.map(s => s.endTime.getHours()));

    return (
        <AgendaContainer>
            {range(minHour, maxHour).map((h, i) => {
                return <AgendaHour 
                            hour={h}
                            items={ReservationsThisHour(h)} />
            })}
        </AgendaContainer>
    )
}

function ReservationsThisHour(reservationMap: Map<string, Reservation[]>, hour: number):
    Map<string, Reservation[]>
{
    const keys = slotKeysForHour(hour);
    const hourlyResMap = new Map<string, Reservation[]>();

    for (const key of keys) {
        if(reservationMap.has(key)) {
            hourlyResMap.set(key, reservationMap.get(key) as Reservation[])
        }
    }

    return hourlyResMap;
}

function AgendaHour({hour, items}: {hour: number, items: Map<string, Reservation[]>}): 
    JSX.Element
{
    return (
        <HourBlock>
            <HourLabelBlock>{formatHour(hour)}</HourLabelBlock>
            <AgendaSlot items={items} />
        </HourBlock>
    )
}

function formatHour(hour: number): string {
    return `${hour % 12 || 12}:00 ${hour > 11 ? 'PM': 'AM'}`
}

function AgendaSlot({items}: {items: Map<string, Reservation[]>}): JSX.Element {
    const slots = 60 / SLOT_DURATION;

    return (
        <div>
            {range(slots).map((i) => {
                return (
                    <ReservationSlot>a</ReservationSlot>
                )
            })}
        </div>
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