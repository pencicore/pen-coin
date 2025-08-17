import { useEffect, useRef, useState } from "react";
import style from './LineChart.module.scss';

const LineChart = ({ arr = [], unit = 'PEN' }) => {
    const canvasRef = useRef(null);
    const [labels, setLabels] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);
        if (!arr.length) return;

        const maxValue = Math.max(...arr);
        const minValue = Math.min(...arr);
        const range = maxValue - minValue || 1;
        const paddingY = 20;
        const stepX = width / (arr.length - 1);
        const scaleY = (height - 2 * paddingY) / range;

        const points = arr.map((val, i) => ({
            x: i * stepX,
            y: height - paddingY - (val - minValue) * scaleY,
            val
        }));

        // --- 绘制轻微曲度折线（小 Catmull-Rom Bezier） ---
        const curvature = 18; // 控制曲度，越大越平滑
        ctx.strokeStyle = "rgba(61, 197, 93, 1)";
        ctx.lineWidth = 3;
        ctx.shadowColor = "rgba(61, 197, 93, 0.8)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i === 0 ? i : i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

            const cp1x = p1.x + (p2.x - p0.x) / curvature;
            const cp1y = p1.y + (p2.y - p0.y) / curvature;
            const cp2x = p2.x - (p3.x - p1.x) / curvature;
            const cp2y = p2.y - (p3.y - p1.y) / curvature;

            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
        ctx.stroke();

        // --- 生成折线高度表 ---
        const yMap = [];
        for (let x = 0; x < width; x++) {
            let idx = Math.floor(x / stepX);
            if (idx < 0) idx = 0;
            if (idx >= points.length - 1) idx = points.length - 2;
            const p1 = points[idx];
            const p2 = points[idx + 1];
            const t = (x - p1.x) / (p2.x - p1.x);
            yMap[x] = p1.y + (p2.y - p1.y) * t;
        }

        // --- 绘制网格点 ---
        ctx.shadowColor = "rgba(61, 197, 93, 0.6)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = "rgba(61, 197, 93, 0.6)";

        for (let x = 0; x < width; x += 6) {
            for (let y = 0; y < height; y += 6) {
                if (y - 2 > yMap[Math.floor(x)] && y < height - 20) {
                    ctx.beginPath();
                    ctx.arc(x, y, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // --- 最高点和最低点 ---
        const maxPoint = points.reduce((prev, cur) => cur.val > prev.val ? cur : prev, points[0]);
        const minPoint = points.reduce((prev, cur) => cur.val < prev.val ? cur : prev, points[0]);

        setLabels([
            { x: maxPoint.x, y: maxPoint.y - 20, val: maxValue },
            { x: minPoint.x, y: minPoint.y - 42, val: minValue }
        ]);
    }, [arr]);

    return (
        <div className={style.LineChart} style={{ position: 'relative' }}>
            <div className={style.Map}>
                <canvas ref={canvasRef} width={550} height={280}></canvas>
            </div>
            {labels.map((label, idx) => (
                <div
                    key={idx}
                    style={{
                        left: label.x - 27,
                        top: label.y,
                    }}
                    className={style.Extremum}
                >
                    {label.val} {unit}
                </div>
            ))}
            <span>1 day</span>
            <span>1 week</span>
            <span>1 month</span>
            <span>1 year</span>
        </div>
    );
};

export default LineChart;
