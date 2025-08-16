import {useEffect, useRef, useState} from 'react';
import style from './CheckinCalendar.module.scss';

function CheckinCalendar({year, month}) {

    const titleRef = useRef(null);

    const [currentYear, setCurrentYear] = useState(year)
    const [currentMonth, setCurrentMonth] = useState(month)
    const currentDate = new Date().getDate();
    const checkinDates = [new Date(2025, 8, 13), new Date(2025, 8, 12), new Date(2025, 8, 14)]
    const [weeks, setWeeks] = useState([])

    // 获取当前月份的日期，创建一个数组，从周日开始，共六周，大小为42天，填充下个月或上个月的日期
    function getDateArr(year, month) {
        const result = [];

        const firstDay = new Date(year, month - 1, 1);
        const firstDayWeek = firstDay.getDay();

        const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
        const currentMonthDays = new Date(year, month, 0).getDate();

        for (let i = firstDayWeek - 1; i >= 0; i--) {
            result.push({
                year: month === 1 ? year - 1 : year,
                month: month === 1 ? 12 : month - 1,
                day: prevMonthLastDay - i
            });
        }
        for (let i = 1; i <= currentMonthDays; i++) {
            result.push({
                year,
                month,
                day: i
            });
        }
        let nextMonthDay = 1;
        while (result.length < 42) {
            result.push({
                year: month === 12 ? year + 1 : year,
                month: month === 12 ? 1 : month + 1,
                day: nextMonthDay++
            });
        }

        return result;
    }

    useEffect(() => {
        if (currentYear === undefined) {
            setCurrentYear(new Date().getFullYear());
        }
        if (currentMonth === undefined) {
            setCurrentMonth(new Date().getMonth() + 1);
        }

        const dateArr = getDateArr(currentYear, currentMonth);
        console.log(currentDate)

        const weeksTemp = dateArr.map((dayObj, index) => {
            let spanStyle = (dayObj.month === currentMonth) ? style.DateCurrentMonth : style.DateNotCurrentMonth;

            if (dayObj.month === currentMonth && dayObj.day === currentDate) spanStyle += ' ' + style.DateCurrentDate;

            if (checkinDates && checkinDates.some(date => date.getFullYear() === dayObj.year && date.getMonth() === dayObj.month && date.getDate() === dayObj.day)) {
                spanStyle += ' ' + style.DateCheckinDate;
            }

            return <span key={index} className={spanStyle}>{dayObj.day}</span>;

        });

        setWeeks(weeksTemp)

    }, [currentYear, currentMonth]);

    // useEffect(() => {
    //     const spans = titleRef.current.querySelectorAll("span");
    //     const i = new Date().getDay() % 7;
    //     if (spans[i]) {
    //         spans[i].classList.add(style.DateCurrentDay);
    //     }
    // }, []);

    return (
        <div-container>
            <div className={style.CalendarTitle} ref={titleRef}>
                <span className={style.DateCurrentDay}>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span className={style.DateCurrentDay}>Sat</span>
            </div>
            {weeks}
            <hr></hr>
            <div className={style.CalendarBottom}>
                <button className={style.RightButton}></button>
                <button className={style.LeftButton}></button>
                <p>2025/08</p>
            </div>
        </div-container>
    );
}

export default CheckinCalendar;
