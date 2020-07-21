import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Reservation from '../models/Reservation';
import InventorySpan from '../models/InventorySpan';
import { MAX_PARTY_SIZE, SLOT_DURATION } from '../constants';
import { range, formatTime } from '../helpers';
import { updateReservation, makeReservation, deleteReservation } from '../backend_interface/api_interface';
import DailyReservations from '../models/DailyReservations';


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

function ReservationForm({dailyReservations, reservation, time, onSubmit}: 
    {dailyReservations: DailyReservations, reservation: Reservation | null, 
    time: Date | null, onSubmit: () => void}): JSX.Element
{
    if(reservation) {
        time = reservation.time;
    }

    const isEditing = !!reservation;
    const timeSlots = dailyReservations.getInventories();

    reservation = reservation || new Reservation();
    time = time || GetStartTime(timeSlots);

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [requestError, setRequestError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [remainingSlots, setRemainingSlots] = useState(
        GetRemainingSlots(dailyReservations, time));
    const [submitEnabled, setSubmitEnabled] = useState(remainingSlots > 0);

    const validate = () => {
        setNameError('');
        setEmailError('');

        if(!reservation) {
            return false;
        }

        if(!/[\w\-_ ]+/.test(reservation.name.trim())) {
            setNameError("Must enter a name");
            return false;
        }

        if(!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(reservation.email)) {
            setEmailError("Invalid email address");
            return false;
        }

        return true;
    }

    const apiRequest = isEditing ? updateReservation : makeReservation;

    const handleSubmit = () => {
        setRequestError("");
        setSuccessMessage("");

        if(!validate() || !reservation) {
            return;
        }
        
        apiRequest(reservation).then(result => {
            if(!result.id) {
                setRequestError(`Error ${isEditing ? "updating" : "creating"} reservation`);
            } else {
                setSuccessMessage("success");
                onSubmit();
            }
        });
    }

    const deleteRes = () => {
        if(!reservation) {
            return;
        }

        deleteReservation(reservation).then((resp) => {
            if(resp.status == 'success')
                onSubmit();
            else
                setRequestError(resp.message);
        });
    }

    const onTimeChange = (time: Date) => {
        const slots = GetRemainingSlots(dailyReservations, time);
        setRemainingSlots(slots);
        setSubmitEnabled(slots > 0 || isEditing);
    }

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
                    validTimes={GetValidTimes(timeSlots)}
                    onChange={onTimeChange} />
                <RemainingSlotsSection remainingSlots={remainingSlots} />
            </SectionsContainer>
            { isEditing && (
                <DeleteButton onClick={e => deleteRes()}>
                    Delete
                </DeleteButton>
            )}
            <SubmitButton onClick={e => handleSubmit()}
                disabled={!submitEnabled}>
                {isEditing && "Update" || "Create"}
            </SubmitButton>
            <FieldError>{requestError}</FieldError>
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

function TimeSection({reservation, validTimes, onChange}: 
    {reservation: Reservation, validTimes: Date[], onChange: (t: Date) => void}): JSX.Element 
{
    let initTime: Date = reservation.time;
    if(initTime.getTime() == 0 && validTimes.length > 0) {
        initTime = validTimes[0];
    }
    const [time, setTime] = useState(initTime);
    
    useEffect(() => {
        onChange(time);
        reservation.time = time;
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

function RemainingSlotsSection({remainingSlots}: {remainingSlots: number}): JSX.Element
{
    return (
        <InputSection>
            <InputLabel>Remaining Slots:</InputLabel>
            <div>{remainingSlots}</div>
        </InputSection>
    )
}

function GetRemainingSlots(dailyReservations: DailyReservations, time: Date): number {
    const slot = dailyReservations.getInventoryAtHour(time.getHours());
    if(!slot) {
        return 0;
    }
    const reservations = dailyReservations.getSlotReservations(time.getHours(), 
        time.getMinutes()).length;
    return slot.numParties - reservations;
}


export default ReservationForm
