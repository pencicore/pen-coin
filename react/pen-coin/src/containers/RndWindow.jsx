import style from './RndWindow.module.scss'
import { useLayoutEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";

const RndWindow = ({
                       children,
                       X = 100,
                       Y = 100,
                       disableDragging = false,
                       enableResizing = true,
                       closeHandle = () => {},
                   }) => {
    const childRef = useRef(null);

    // 窗口大小 & 位置
    const [size, setSize] = useState({ width: 200, height: 150 });
    const [position, setPosition] = useState({ x: X, y: Y });

    // 初次渲染时，根据子组件测量实际大小
    useLayoutEffect(() => {
        if (childRef.current) {
            const rect = childRef.current.children[0].getBoundingClientRect();
            setSize({ width: rect.width, height: rect.height });
        }
    }, [children]);

    return (
        <Rnd
            size={{ width: size.width, height: size.height }}
            position={{ x: position.x, y: position.y }}
            onDragStop={(e, d) => {
                setPosition({ x: d.x, y: d.y });
            }}
            onResizeStop={(e, direction, ref, delta, pos) => {
                setSize({
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                });
                setPosition(pos);
            }}
            disableDragging={disableDragging}
            enableResizing={enableResizing}
            bounds=".App"
        >
            <div className={style.RndWindow} ref={childRef}>
                {children}
                <div
                    className={style.Close}
                    onClick={closeHandle}
                >
                </div>
            </div>
        </Rnd>
    );
};

export default RndWindow;
