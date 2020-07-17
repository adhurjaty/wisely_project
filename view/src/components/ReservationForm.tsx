import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Reservation from '../models/Reservation';
import InventorySpan from '../models/InventorySpan';
import { MAX_PARTY_SIZE, SLOT_DURATION } from '../constants';
import { range, formatTime } from '../helpers';


const Container = styled.div`
    display: flex;
    flex-direction: column;
`

const SectionsContainer = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: flex-start;
    margin-left: 20px;
    margin-right: 20px;
`

const InputSection = styled.div`
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    flex-basis: 45%;
    margin-top: 10px;
    margin-bottom: 10px;
    min-width: 250px;
`

const InputLabel = styled.label`
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 5px;
`

const FieldError = styled.div`
    color: red;
    margin-top: 5px;
`

const SubmitButton = styled.button`
    margin-left: 20px;
    margin-top: 10px;
    height: 30px;
    width: 80px;
`

const DeleteButton = styled.button`
    background: red;
    color: white;
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
    height: 30px;
    width: 80px;
`

function ReservationForm({timeSlots, reservation, time}: 
    {timeSlots: InventorySpan[], reservation: Reservation | null, time: Date | null}): 
    JSX.Element
{
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");

    const isEditing = !!reservation;

    if(reservation) {
        time = reservation.time;
    }
    reservation = reservation || new Reservation();
    time = time || GetStartTime(timeSlots);

    return (
        <Container>
            <h4>{isEditing ? "Edit Reservation" : "Make Reservation"}</h4>
            <SectionsContainer>
                <NameSection reservation={reservation}
                    error={nameError} />
                <EmailSection reservation={reservation}
                    error={emailError} />
                <PartySizeSection reservation={reservation} />
                <TimeSection reservation={reservation}
                    timeSlots={timeSlots} />
            </SectionsContainer>
            { isEditing && <DeleteButton>Delete</DeleteButton>}
            <SubmitButton>{isEditing && "Update" || "Create"}</SubmitButton>
        </Container>
    )
}

function GetStartTime(timeSlots: InventorySpan[]): Date {
    return new Date(Math.min(...timeSlots.map(t => t.startTime.getTime())));
}

function NameSection({reservation, error}: {reservation: Reservation, error: string}):
    JSX.Element
{
    const [name, setName] = useState(reservation.name);

    useEffect(() => {
        reservation.name = name;
    }, [name])

    useEffect(() => {
        setName(reservation.name);
    }, [reservation]);

    return (
        <InputSection>
            <InputLabel>Name:</InputLabel>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)} />
            <FieldError>{error}</FieldError>
        </InputSection>
    )
}

function EmailSection({reservation, error}: {reservation: Reservation, error: string}):
    JSX.Element
{
    const [email, setEmail] = useState(reservation.email);

    useEffect(() => {
        reservation.email = email;
    }, [email]);

    useEffect(() => {
        setEmail(reservation.email);
    }, [reservation]);

    return (
        <InputSection>
            <InputLabel>Email:</InputLabel>
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
            <FieldError>{error}</FieldError>
        </InputSection>
    )
}

function PartySizeSection({reservation}: {reservation: Reservation}): JSX.Element {
    const [partySize, setPartySize] = useState(reservation.partySize);

    useEffect(() => {
        reservation.partySize = partySize;
    }, [partySize]);

    useEffect(() => {
        setPartySize(reservation.partySize);
    }, [reservation]);

    return (
        <InputSection>
            <InputLabel>Party Size:</InputLabel>
            <select onChange={(e) => setPartySize(parseInt(e.target.value))}
                value={partySize}>
                {range(1, MAX_PARTY_SIZE + 1).map(n => (
                    <option value={n} key={n}>{n}</option>
                ))}
            </select>
        </InputSection>
    )
}

function TimeSection({reservation, timeSlots}: 
    {reservation: Reservation, timeSlots: InventorySpan[]}): JSX.Element 
{
    const validTimes = GetValidTimes(timeSlots);
    const defaultTime = reservation.time.getTime() == new Date().getTime() ?
        validTimes[0] : reservation.time;
    
    const [time, setTime] = useState(defaultTime);

    useEffect(() => {
        reservation.time = time
    }, [time]);

    useEffect(() => {
        setTime(reservation.time);
    }, [reservation]);

    return (
        <InputSection>
            <InputLabel>Time:</InputLabel>
            <select onChange={(e) => setTime(new Date(parseInt(e.target.value)))}
                value={time.getTime()}>
                {validTimes.map((t, i) => (
                    <option value={t.getTime()}
                        key={`time-key-${i}`}>
                        {formatTime(t)}
                    </option>
                ))}
            </select>
        </InputSection>
    )
}

function GetValidTimes(timeSlots: InventorySpan[]): Date[] {
    const sortedRanges = timeSlots.map(ts => [ts.startTime, ts.endTime])
        .sort((a, b) => a[0].getTime() - b[0].getTime());

    return sortedRanges.map((r) => {
        let slots: Date[] = [];
        let time = new Date(r[0]);
        let endTime = r[1];
        while(time.getTime() < endTime.getTime()) {
            slots.push(time);
            time = new Date(time);
            time.setMinutes(time.getMinutes() + SLOT_DURATION);
        }
        return slots;
    }).flat();
}

export default ReservationForm
