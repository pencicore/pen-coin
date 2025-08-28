import { forwardRef, useImperativeHandle, useState } from "react";
import style from './WheelDraw.module.scss';
import { erc20DrawContractApi } from "../../api/erc20ContractApi.js";

const WheelDraw = forwardRef(({ n = 6, prizes, prizesSimple, radius = 225 }, ref) => {
    const [hoverIndex, setHoverIndex] = useState(null);
    const [rotation, setRotation] = useState(0);       // 记录当前角度
    const [lastIndex, setLastIndex] = useState(n - 1);
    const [isSpinning, setIsSpinning] = useState(false); // 是否无限旋转
    const [targetRotation, setTargetRotation] = useState(null); // 目标角度

    useImperativeHandle(ref, () => ({
        luckyDraw
    }));

    const luckyDraw = () => {
        return new Promise(resolve => {
            setIsSpinning(true); // 开始无限旋转

            (async () => {
                const prize = await erc20DrawContractApi.luckyDraw();
                console.log("中奖结果:", prize);
                const randomIndex = prizesSimple.indexOf(prize);

                const anglePerSector = 360 / n;
                const targetAngle = anglePerSector * (n * 5 - randomIndex + lastIndex);
                setLastIndex(randomIndex);

                // 停掉无限旋转
                setIsSpinning(false);

                // 稍微延迟，给 CSS 有时间清掉无限旋转
                setTimeout(() => {
                    setTargetRotation(prev => (prev || rotation) + targetAngle);
                }, 50);

                // 动画结束后 resolve
                setTimeout(() => {
                    resolve(prizes[randomIndex]);
                }, 4000);
            })();
        });
    };

    const cx = radius + 14;
    const cy = radius + 14;

    const createSectors = () => {
        const paths = [];
        const anglePerSector = (2 * Math.PI) / n;

        for (let i = 0; i < n; i++) {
            const startAngle = anglePerSector * i + anglePerSector / 2;
            const endAngle = anglePerSector * (i + 1) + anglePerSector / 2;

            const x1 = cx + radius * Math.cos(startAngle);
            const y1 = cy + radius * Math.sin(startAngle);
            const x2 = cx + radius * Math.cos(endAngle);
            const y2 = cy + radius * Math.sin(endAngle);

            const d = `
                M ${cx} ${cy}
                L ${x1} ${y1}
                A ${radius} ${radius} 0 0 1 ${x2} ${y2}
                Z
            `;

            const midAngle = (startAngle + endAngle) / 2;
            const offset = 16;
            const dx = (hoverIndex === i ? offset : 8) * Math.cos(midAngle);
            const dy = (hoverIndex === i ? offset : 8) * Math.sin(midAngle);

            const textX = cx + (radius * 0.6) * Math.cos(midAngle);
            const textY = cy + (radius * 0.6) * Math.sin(midAngle);

            paths.push(
                <g key={i} transform={`translate(${dx}, ${dy})`}>
                    <path
                        d={d}
                        fill="rgba(243, 243, 243, 1)"
                        stroke="rgba(220, 223, 230, 1)"
                        strokeWidth="2"
                        onMouseEnter={() => setHoverIndex(i)}
                        onMouseLeave={() => setHoverIndex(null)}
                        style={{ transition: "transform 0.2s ease" }}
                    />
                    <text
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="rgba(96, 98, 102, 1)"
                    >
                        {prizes[i]}
                    </text>
                </g>
            );
        }
        return paths;
    };

    return (
        <div className={style.WheelDraw}>
            <svg
                width={radius * 2 + 20}
                height={radius * 2 + 20}
                viewBox={`0 0 ${radius * 2 + 30} ${radius * 2 + 30}`}
            >
                <g
                    style={{
                        transform: `rotate(${targetRotation ?? rotation}deg)`,
                        transformOrigin: `${cx}px ${cy}px`,
                        transition: isSpinning
                            ? "none"
                            : "transform 4s cubic-bezier(0.25, 1, 0.5, 1)"
                    }}
                    className={isSpinning ? style.spinning : ""}
                >
                    {createSectors()}
                    <circle
                        cx={cx}
                        cy={cy}
                        r={40}
                        fill="rgba(243, 243, 243, 1)"
                        stroke="white"
                        strokeWidth="5"
                        style={{
                            filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
                        }}
                    />
                    <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="24"
                        fontWeight="bold"
                        fill="rgba(96, 98, 102, 1)"
                    >
                        GO
                    </text>
                </g>
                <polygon
                    points={`${radius*2+5},${cy} ${radius*2+30},${cy-15} ${radius*2+30},${cy+15}`}
                    fill="red"
                />
            </svg>
        </div>
    );
});

export default WheelDraw;
