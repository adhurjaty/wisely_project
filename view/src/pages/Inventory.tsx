import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import Calendar from 'react-calendar';
import DayCalendar from '../components/DayCalendar';
import InventorySpan from '../models/InventorySpan';
import { getInventory, setInventory } from '../backend_interface/api_interface';
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

const SubmitButton = styled.button`
    margin-top: 30px;
    width: 75px;
    height: 30px;
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
                date={date}
                onSubmit={() => loadInventory(date)} />
        </div>
    );
}

function StateDisplay({state, date, onSubmit}: 
    {state: InventoryState, date: Date, onSubmit: () => void}): 
    JSX.Element 
{
    if(state.isLoading) {
        return IsLoadingDisplay();
    }

    if(state.error) {
        return ErrorDisplay(state.error);
    }

    return InventoryDisplay(state, date, onSubmit);
}

function IsLoadingDisplay(): JSX.Element {
    return <h4>Loading...</h4>
}

function ErrorDisplay(error: string): JSX.Element {
    return <ErrorText>{error}</ErrorText>
}

function InventoryDisplay(state: InventoryState, date: Date,
    onSubmit: () => void): JSX.Element 
{
    const [timeSlots, setTimeSlots] = useState(state.timeSlots);
    const [showAddButton, setShowAdd] = useState(maxEndTimeHour(state.timeSlots) < 24);
    const [submitEnabled, setSubmitEnabled] = useState(state.timeSlots.length > 0);

    useEffect(() => {
        setTimeSlots(state.timeSlots);
    }, [state]);

    const onDelete = (ts: InventorySpan) => {
        const newSlots = timeSlots.filter(x => x !== ts);
        setTimeSlots(newSlots);
        setShowAdd(maxEndTimeHour(newSlots) < 24);
        setSubmitEnabled(newSlots.length > 0);
    };

    // adjust other time spans so no overlapping
    const onTimeChange = (ts: InventorySpan) => {
        const newSpans = []
        for (const slot of timeSlots) {
            if(ts === slot) {
                newSpans.push(slot);
                continue;
            }

            if(containsFully(ts, slot)) {
                continue;
            }

            const newSlot = slot.copy();
            if(mustMoveStartTime(ts, slot)) {
                newSlot.startTime = new Date(ts.endTime.getTime());
            }
            else if(mustMoveEndTime(ts, slot)) {
                newSlot.endTime = new Date(ts.startTime.getTime());
            }

            newSpans.push(newSlot)
        }
        setTimeSlots(newSpans);
        setShowAdd(maxEndTimeHour(newSpans) < 24);
    };

    const onAdd = () => {
        const newSlot = new InventorySpan();
        if(timeSlots.length) {
            const lastSlot = timeSlots[timeSlots.length - 1];
            newSlot.startTime = lastSlot.endTime;
        } else {
            newSlot.startTime = date;
        }
        newSlot.endTime = new Date(newSlot.startTime);
        newSlot.endTime.setHours(newSlot.endTime.getHours() + 1);

        setTimeSlots(timeSlots.concat([newSlot]));
        setSubmitEnabled(true);
    }

    const submit = () => {
        setInventory(timeSlots).then(resp => {
            if(resp.status == 'success')
                onSubmit();
        });
    }

    return (
        <SlotsContainer>
            {timeSlots.map((ts, i) => (
                <TimeSlotDisplay timeSlot={ts}
                    onDelete={onDelete} 
                    onTimeChange={onTimeChange}
                    key={`slots-${i}`} />
            ))}
            {showAddButton && <button onClick={(e) => onAdd()}>Add</button>}
            <SubmitButton onClick={submit}
                disabled={!submitEnabled}>
                Submit
            </SubmitButton>
        </SlotsContainer>
    )
}

function maxEndTimeHour(slots: InventorySpan[]): number {
    return Math.max(...slots.map(s => s.endTime.getHours() || 24));
}

function mustMoveStartTime(ts: InventorySpan, slot: InventorySpan): boolean {
    return slot.startTime.getTime() < ts.endTime.getTime() &&
        slot.endTime.getTime() > ts.endTime.getTime();
}

function mustMoveEndTime(ts: InventorySpan, slot: InventorySpan): boolean {
    return slot.endTime.getTime() > ts.startTime.getTime()  &&
        slot.startTime.getTime() < ts.startTime.getTime();
}

function containsFully(ts: InventorySpan, slot: InventorySpan): boolean {
    return ts.startTime.getTime() <= slot.startTime.getTime() &&
        ts.endTime.getTime() >= slot.endTime.getTime();
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
            const time = new Date(fromTime.getTime());
            time.setHours(time.getHours() + 1);
            setToTime(time);
        }

        onTimeChange(timeSlot);
    }, [fromTime]);

    useEffect(() => {
        timeSlot.endTime = toTime;
        if(timeSlot.startTime.getTime() >= toTime.getTime()) {
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