import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import { getDailyReservations } from '../backend_interface/api_interface';
import DailyReservations from '../models/DailyReservations';
import Agenda from '../components/Agenda';
import ReservationForm from '../components/ReservationForm';
import Reservation from '../models/Reservation';


interface ReservationState {
    isLoading: boolean;
    dailyReservations: DailyReservations | null,
    error: string
};

const MonthCalSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const SectionHeader = styled.h4`
    align-self: center;
`

const ErrorText = styled.h4`
    color: red;
`;

const ReservationSection = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 20px;
`

const ResButton = styled.button`
    margin: 10px;
    height: 40px;
    width: 140px;
    align-self: center;
`

function Reservations(): JSX.Element {
    let [state, setState] = useState<ReservationState>({
        isLoading: true,
        dailyReservations: null,
        error: ''
    });
    let [date, setDate] = useState(new Date());

    const loadReservations = (d: Date) => {
        getDailyReservations(d).then((dailyRes) => {
            setState({
                isLoading: false,
                dailyReservations: dailyRes,
                error: ''
            })
        }).catch((err) => {
            setState({
                isLoading: false,
                dailyReservations: null,
                error: err.toString()
            })
        })
    };
    
    useEffect(() => {
        loadReservations(date);
    }, [date])

    let setCalendarDate = (d: Date | Date[]) => setDate(d as Date);

    return (
        <div>
            <h1>Reservations</h1>
            <MonthCalSection>
                <h3>Choose a day...</h3>
                <Calendar 
                    onChange={setCalendarDate}
                    value={date}
                    calendarType="US" />
            </MonthCalSection>
            <StateDisplay state={state}
                onSubmit={() => loadReservations(date)} />
        </div>
    )
}

function StateDisplay({state, onSubmit}: {state: ReservationState, 
    onSubmit: () => void}): JSX.Element 
{
    if(state.isLoading) {
        return IsLoadingDisplay();
    }
    if(state.error) {
        return ErrorDisplay(state.error);
    }
    if(!state.dailyReservations) {
        throw new Error("Empty reservations object");
    }
    return ReservationDisplay(state.dailyReservations, onSubmit);
}

function IsLoadingDisplay(): JSX.Element {
    return <h4>Loading...</h4>
}

function ErrorDisplay(error: string): JSX.Element {
    return <ErrorText>{error}</ErrorText>
}

function ReservationDisplay(reservations: DailyReservations, 
    onSubmit: () => void): JSX.Element 
{
    const [showForm, setShowForm] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);

    let onAgendaClick = (res: Reservation | null=null, time: Date | null=null) => {
        setSelectedReservation(res);
        setSelectedTime(time);
        setShowForm(true);
    };

    let closeForm = () => {
        setSelectedReservation(null);
        setSelectedTime(null);
        setShowForm(false);
    };

    const handleSubmit = () => {
        onSubmit();
        setShowForm(false);
    }

    return (
        <ReservationSection>
            { showForm &&
                <div id="reservationForm">
                    <ReservationForm
                        dailyReservations={reservations}
                        reservation={selectedReservation}
                        time={selectedTime}
                        onSubmit={handleSubmit} />
                    <ResButton onClick={(e) => closeForm()}>Close</ResButton>
                </div>
            ||
                <ResButton onClick={(e) => setShowForm(true)}>
                    Make Reservation
                </ResButton>
            }
            <SectionHeader>Reservation Times</SectionHeader>
            <Agenda dailyReservations={reservations}
                onAgendaClick={onAgendaClick} />
        </ReservationSection>
    )
}


export default Reservations