import {useEffect, useRef, useState} from 'react';
import style from './CheckinCalendar.module.scss';
import dateUtil from "../../utils/dateUtil.js";
import erc20ContractApi from "../../api/erc20ContractApi.js";
import {metamaskApi} from "../../utils/metaMaskUtil.js";
import {GetMonthCheckin} from "../../api/erc20BackendApi.js";
import userStore from "../../store/userStore.js";
import maskUtil from "../../utils/maskUtil.js";

function CheckinCalendar() {

    const {login, playCount} = userStore()
    const [year, setYear] = useState(dateUtil.getCurrentYear)
    const [month, setMonth] = useState(dateUtil.getCurrentMonth)

    const [weeks, setWeeks] = useState([])
    const currentYear = dateUtil.getCurrentYear();
    const currentMonth = dateUtil.getCurrentMonth();
    const currentDate = dateUtil.getCurrentDay();

    // 获取当前月份的日期，创建一个数组，从周日开始，共六周，大小为42天，填充下个月或上个月的日期
    function getDateArrHandler(year, month) {
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

    const setCheckinMonthHandler = async () => {
        const checkinMonth = []
        const address = await maskUtil.getAddress();
        if (address) {
            const data = (await GetMonthCheckin(address, year, month)).data
            for (let i = 0; i < 31; i++) {
                if ((data & (2 ** i)) !== 0) {
                    checkinMonth.push(new Date(year, month, i+1))
                }
            }
        }
        return checkinMonth
    }

    useEffect(() => {
        const fun = async () => {
            const checkinMonth = await setCheckinMonthHandler();
            const dateArr = getDateArrHandler(year, month);

            const weeksTemp = dateArr.map((dayObj, index) => {
                let spanStyle = (dayObj.month === month) ? style.DateCurrentMonth : style.DateNotCurrentMonth;
                if (dayObj.year === currentYear && dayObj.month === currentMonth && dayObj.day === currentDate)
                    spanStyle += ' ' + style.DateCurrentDate;
                if (checkinMonth
                        && checkinMonth.some(date => date.getFullYear() === dayObj.year
                        && date.getMonth() === dayObj.month && date.getDate() === dayObj.day)) {
                    spanStyle += ' ' + style.DateCheckinDate;
                }
                return <span key={index} className={spanStyle}>{dayObj.day}</span>;
            });

            setWeeks(weeksTemp)
        }
        fun().then();
    }, [year, month, playCount]);

    const leftMonthHandle = () => {
        let target = month - 1
        if (target === 0) {
            setYear(year - 1)
            target = 12
        }
        setMonth(target)
    }

    const rightMonthHandle = () => {
        let target = month + 1
        if (target === 13) {
            setYear(year + 1)
            target = 1
        }
        setMonth(target)
    }

    return (
        <div-container className={style.Calendar}>
            <div className={style.CalendarTitle}>
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
                <button className={style.RightButton} onClick={rightMonthHandle}></button>
                <button className={style.LeftButton} onClick={leftMonthHandle}></button>
                <p>{year}/{month}</p>
            </div>
        </div-container>
    );
}

export default CheckinCalendar;
