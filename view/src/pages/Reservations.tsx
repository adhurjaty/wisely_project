import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import { getReservationSpans } from '../backend_interface/api_interface';
import ReservationSpan from '../models/ReservationSpan';
import Agenda from '../components/Agenda';


interface ReservationState {
    isLoading: boolean;
    reservationSpans: ReservationSpan[],
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

function Reservations(): JSX.Element {
    let [state, setState] = useState<ReservationState>({
        isLoading: true,
        reservationSpans: [],
        error: ''
    });
    let [date, setDate] = useState(new Date());

    useEffect(() => {
        getReservationSpans(date).then((resSpans) => {
            setState({
                isLoading: false,
                reservationSpans: resSpans,
                error: ''
            })
        }).catch((err) => {
            setState({
                isLoading: false,
                reservationSpans: [],
                error: err.toString()
            })
        })
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

            <StateDisplay state={state} />
        </div>
    )
}

function StateDisplay({state}: {state: ReservationState}): JSX.Element {
    if(state.isLoading) {
        return IsLoadingDisplay();
    }
    if(state.error) {
        return ErrorDisplay(state.error);
    }
    return ReservationDisplay(state.reservationSpans);
}

function IsLoadingDisplay(): JSX.Element {
    return <h4>Loading...</h4>
}

function ErrorDisplay(error: string): JSX.Element {
    return <ErrorText>{error}</ErrorText>
}

function ReservationDisplay(reservationSpans: ReservationSpan[]): JSX.Element {
    return (
        <ReservationSection>
            <SectionHeader>Reservation Times</SectionHeader>
            <Agenda reservationSpans={reservationSpans} />
        </ReservationSection>
    )
}

export default Reservations