import style from './ScreenWindow.module.scss'
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

let windowController = null;

const ScreenWindow = () => {
    const [content, setContent] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        windowController = {
            open: (component) => {
                setContent(component);
                requestAnimationFrame(() => setVisible(true)); // 触发动画
            },
            close: () => {
                setVisible(false);
                setTimeout(() => setContent(null), 300); // 300ms 对应 SCSS 过渡时间
            },
        };
    }, []);

    if (!content) return null;

    return createPortal(
        <div className={`${style.ScreenWindow} ${visible ? style.show : style.hide}`}>
            <button
                className={style.ExitButton}
                onClick={() => windowController.close()}
            />
            {content}
        </div>,
        document.body
    );
};

export const FullWindowController = {
    open: (component) => windowController?.open(component),
    close: () => windowController?.close(),
};

export default ScreenWindow;
