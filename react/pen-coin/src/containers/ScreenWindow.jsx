import style from './ScreenWindow.module.scss'
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

let windowController = null;

const ScreenWindow = () => {
    // 改成数组，存多个窗口
    const [windows, setWindows] = useState([]);

    useEffect(() => {
        windowController = {
            open: (id, component) => {
                setWindows((prev) => {
                    // 如果已存在相同 id，替换内容；否则新增
                    const exists = prev.find(w => w.id === id);
                    if (exists) {
                        return prev.map(w => w.id === id ? { ...w, content: component, visible: true } : w);
                    }
                    return [...prev, { id, content: component, visible: true }];
                });
            },
            close: (id) => {
                setWindows((prev) =>
                    prev.map(w =>
                        w.id === id ? { ...w, visible: false } : w
                    )
                );
                // 动画结束后删除
                setTimeout(() => {
                    setWindows((prev) => prev.filter(w => w.id !== id));
                }, 300); // 300ms 对应 SCSS 过渡时间
            },
        };
    }, []);

    if (windows.length === 0) return null;

    return createPortal(
        <>
            {windows.map((w) => (
                <div
                    key={w.id}
                    className={`${style.ScreenWindow} ${w.visible ? style.show : style.hide}`}
                >
                    <button
                        className={style.ExitButton}
                        onClick={() => windowController.close(w.id)}
                    />
                    {w.content}
                </div>
            ))}
        </>,
        document.body
    );
};

export const FullWindowController = {
    open: (id, component) => windowController?.open(id, component),
    close: (id) => windowController?.close(id),
};

export default ScreenWindow;
