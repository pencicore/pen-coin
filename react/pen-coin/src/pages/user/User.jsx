import style from './User.module.scss'
import LineChart from "../../components/LineChart.jsx";

const User = () => {
    return (
        <div-main className={style.User}>
            <div className={style.Left}>
                <h1>个人中心</h1>
                <h5>查看个人账户与活动记录</h5>
                <div-back>
                    <p>代币资产</p>
                    <h2>3456.6879 PEN</h2>
                    <small>相对于上周下降 <mark className={style.Down}>20.4%</mark> </small>
                </div-back>
                &nbsp;
                <div-back>
                    <p>本周活动</p>
                    <h2>223 次</h2>
                    <small>相对于上周活跃度上升   <mark className={style.Up}>2.0%</mark> </small>
                </div-back>
                <br></br><br></br>
                <LineChart arr={[1,2,3,5,7,9,11,11.9,12.1,12.2,12.2,12.2,11,11,1,2,4,8,9,19,9,8,4,2,1,3,6,8,9,8,9,8,9,8]}></LineChart>
            </div>
        </div-main>
    )
}

export default User