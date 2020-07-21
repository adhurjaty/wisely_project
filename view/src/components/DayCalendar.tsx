import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';

const MonthCalSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

function DayCalendar({date, setDate}: {date: Date, setDate: (d: Date) => void}): JSX.Element {
    let setCalendarDate = (d: Date | Date[]) => setDate(d as Date);

    return (
        <MonthCalSection>
            <h3>Choose a day...</h3>
            <Calendar 
                onChange={setCalendarDate}
                value={date}
                calendarType="US" />
        </MonthCalSection>
    )
}

export default DayCalendar;