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

interface ResItemProp {
    capacity: number;
}

const ReservationItem = styled.div`
    display: flex;
    flex-direction: column;
    background: green;
    border: 1px solid black;
    margin: 2px;
    justify-content: center;
    width: ${(props: ResItemProp) => 100 / props.capacity - 1}%
`

function Agenda({dailyReservations, onAgendaClick}: 
    {dailyReservations: DailyReservations, 
     onAgendaClick: (res?: Reservation | null, time?: Date | null) => void}): JSX.Element 
{
    const [minHour, maxHour] = dailyReservations.getOpenCloseHours();

    return (
        <AgendaContainer>
            {range(minHour, maxHour).map((h, i) => {
                return <AgendaHour 
                            hour={h}
                            items={dailyReservations}
                            onAgendaClick={onAgendaClick}
                            key={`agenda-hour-${i}`} />
            })}
        </AgendaContainer>
    )
}

function AgendaHour({hour, items, onAgendaClick}: 
    {hour: number, items: DailyReservations, 
    onAgendaClick: (res?: Reservation | null, time?: Date | null) => void}): 
    JSX.Element
{
    return (
        <HourBlock>
            <HourLabelBlock>{formatHour(hour)}</HourLabelBlock>
            <AgendaSlot hour={hour} 
                items={items}
                onAgendaClick={onAgendaClick} />
        </HourBlock>
    )
}

function formatHour(hour: number): string {
    return `${hour % 12 || 12}:00 ${hour > 11 ? 'PM': 'AM'}`
}

function AgendaSlot({hour, items, onAgendaClick}: 
    {hour: number, items: DailyReservations, 
    onAgendaClick: (res?: Reservation | null, time?: Date | null) => void}): JSX.Element 
{
    const slots = 60 / SLOT_DURATION;
    const invSlot = items.getInventoryAtHour(hour);

    return (
        <HourItemsContainer>
            {range(slots).map((i) => {
                let minute = i * SLOT_DURATION;
                let capacity = invSlot && invSlot.numParties || 0;
                return <AgendaItems items={items.getSlotReservations(hour, minute)}
                            capacity={capacity}
                            onAgendaClick={onAgendaClick}
                            key={`agendaItem-${i}`} />
            })}
        </HourItemsContainer>
    )
}

function AgendaItems({items, capacity, onAgendaClick}:
    {items: Reservation[], capacity: number,
    onAgendaClick: (res?: Reservation | null, time?: Date | null) => void}): JSX.Element 
{
    return (
        <ReservationSlot>
            {items.map((item, i) => (
                <AgendaItem item={item}
                    capacity={capacity}
                    onAgendaClick={onAgendaClick}
                    key={`agenda-item-${i}`} />
            ))}
        </ReservationSlot>
    )
}

function AgendaItem({item, capacity, onAgendaClick, color}: 
    {item: Reservation, capacity: number,
    onAgendaClick: (res?: Reservation | null, time?: Date | null) => void,
    color?: string}): JSX.Element 
{
    return (
        <ReservationItem capacity={capacity}
                onClick={(e) => onAgendaClick(item)}>
            {`${item.name} party of ${item.partySize}`}
        </ReservationItem>
    )
}


export default Agenda