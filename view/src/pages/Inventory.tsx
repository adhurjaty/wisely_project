import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import Calendar from 'react-calendar';
import DayCalendar from '../components/DayCalendar';
import InventorySpan from '../models/InventorySpan';
import { getInventory } from '../backend_interface/api_interface';
import { range, formatTime } from '../helpers';
import { MAX_PARTY_SIZE } from '../constants';

interface InventoryState {
    isLoading: boolean;
    timeSlots: InventorySpan[];
    error: string;
}

const MonthCalSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ErrorText = styled.h4`
    color: red;
`;

const SlotsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 25px;
`

const TimeSlotRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 15px;
`

const LabelledInputContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin-right: 20px;
`

const SideLabel = styled.div`
    margin-right: 5px;
`

function Inventory(): JSX.Element {
    const [state, setState] = useState<InventoryState>({
        isLoading: true,
        timeSlots: [],
        error: ''
    });
    const [date, setDate] = useState(new Date());

    const loadInventory = (d: Date) => {
        getInventory(d).then((invSpans) => {
            setState({
                isLoading: false,
                timeSlots: invSpans,
                error: ''
            });
        }).catch((err) => {
            setState({
                isLoading: false,
                timeSlots: [],
                error: err.toString()
            });
        })
    }

    useEffect(() => {
        loadInventory(date);
    }, [date]);

    return (
        <div>
            <h1>Inventory</h1>
            <DayCalendar date={date}
                setDate={setDate} />
            <StateDisplay state={state}
                onSubmit={() => loadInventory(date)} />
        </div>
    );
}

function StateDisplay({state, onSubmit}: 
    {state: InventoryState, onSubmit: () => void}): 
    JSX.Element 
{
    if(state.isLoading) {
        return IsLoadingDisplay();
    }

    if(state.error) {
        return ErrorDisplay(state.error);
    }

    return InventoryDisplay(state, onSubmit);
}

function IsLoadingDisplay(): JSX.Element {
    return <h4>Loading...</h4>
}

function ErrorDisplay(error: string): JSX.Element {
    return <ErrorText>{error}</ErrorText>
}

function InventoryDisplay(state: InventoryState, 
    onSubmit: () => void): JSX.Element 
{
    const [timeSlots, setTimeSlots] = useState(state.timeSlots);

    const onDelete = (ts: InventorySpan) => {
        setTimeSlots(timeSlots.filter(x => x !== ts));
    };

    const onTimeChange = (ts: InventorySpan) => {
        const newSpans = []
        for (const slot of timeSlots) {
            if(ts === slot) {
                newSpans.push(slot);
                continue;
            }

            const newSlot = new InventorySpan().fromJson(slot);
            if(ts.startTime.getTime() < slot.endTime.getTime() &&
                ts.endTime.getTime() > slot.endTime.getTime()) 
            {
                newSlot.endTime = new Date(ts.startTime.getTime());
            }
            if(ts.endTime.getTime() > slot.startTime.getTime() &&
                ts.startTime.getTime() < slot.startTime.getTime()) 
            {
                newSlot.startTime = new Date(ts.endTime.getTime());
            }
            newSpans.push(newSlot)
        }
        setTimeSlots(newSpans);
    };

    return (
        <SlotsContainer>
            {timeSlots.map((ts, i) => (
                <TimeSlotDisplay timeSlot={ts}
                    onDelete={onDelete} 
                    onTimeChange={onTimeChange}
                    key={`slots-${i}`} />
            ))}
        </SlotsContainer>
    )
}

function TimeSlotDisplay({timeSlot, onTimeChange, onDelete}: 
    {timeSlot: InventorySpan, onTimeChange: (ts: InventorySpan) => void,
    onDelete: (ts: InventorySpan) => void}): JSX.Element 
{
    const [fromTime, setFromTime] = useState(timeSlot.startTime);
    const [toTime, setToTime] = useState(timeSlot.endTime);
    const [numParties, setNumParties] = useState(timeSlot.numParties);

    useEffect(() => {
        timeSlot.startTime = fromTime;
        if(timeSlot.endTime.getTime() <= fromTime.getTime()) {
            debugger;
            const time = new Date(fromTime.getTime());
            time.setHours(time.getHours() + 1);
            setToTime(time);
        }
        onTimeChange(timeSlot);
    }, [fromTime]);

    useEffect(() => {
        timeSlot.endTime = toTime;
        if(timeSlot.startTime.getTime() >= toTime.getTime()) {
            debugger;
            const time = new Date(toTime.getTime());
            time.setHours(time.getHours() - 1);
            setFromTime(time);
        }
        onTimeChange(timeSlot);
    }, [toTime]);

    useEffect(() => {
        timeSlot.numParties = numParties;
    }, [numParties])

    useEffect(() => {
        setFromTime(timeSlot.startTime);
        setToTime(timeSlot.endTime);
        setNumParties(timeSlot.numParties);
    }, [timeSlot]);

    return (
        <TimeSlotRow>
            <TimeInput label="From:"
                    time={fromTime}
                    setTime={setFromTime} />
            <TimeInput label="To:"
                    time={toTime}
                    setTime={setToTime} />
            <LabelledInputContainer>
                <SideLabel>Parties:</SideLabel>
                <select onChange={(e) => setNumParties(parseInt(e.target.value))} 
                    value={numParties}>
                    {range(1, MAX_PARTY_SIZE + 1).map(p => (
                        <option value={p}
                            key={`party-${timeSlot.id}-${p}`}>
                            {p}
                        </option>
                    ))}
                </select>
            </LabelledInputContainer>
            <button onClick={(e) => onDelete(timeSlot)}>Delete</button>
        </TimeSlotRow>
    )
}

function TimeInput({label, time, setTime}: 
    {label: string, time: Date, setTime: (d: Date) => void}) : JSX.Element
{
    return (
        <LabelledInputContainer>
            <SideLabel>{label}</SideLabel>
            <HourChooser time={time}
                setTime={setTime} />
        </LabelledInputContainer>
    )
}

function HourChooser({time, setTime, minHour, maxHour}: 
    {time: Date, setTime: (d: Date) => void, minHour?: number, maxHour?: number}): JSX.Element 
{
    const today = new Date(time.getFullYear(), time.getMonth(), time.getDate());
    const validTimes = GetValidTimes(today, minHour || 0, maxHour || 24);

    return (
        <select onChange={(e) => setTime(new Date(parseInt(e.target.value)))}
            value={time.getTime()}>
            {validTimes.map((t, i) => (
                <option value={t.getTime()}
                    key={`${minHour}-hour-${i}`}>
                    {formatTime(t)}
                </option>
            ))}
        </select>
    );
}

function GetValidTimes(today: Date, minHour: number, maxHour: number): Date[] {
    return range(minHour, maxHour + 1).map(h => 
        new Date(today.getFullYear(), today.getMonth(), today.getDate(), h));
}

export default Inventory