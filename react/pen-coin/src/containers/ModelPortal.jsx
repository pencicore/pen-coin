import React, { cloneElement } from "react";
import { createRoot } from "react-dom/client";

// 小窗口组件
const ModalWindow = ({ content, onClose }) => {
    return (
        <>
            {/* 黑幕背景 */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(5px)",
                    WebkitBackdropFilter: "blur(5px)",
                    zIndex: 1999,
                }}
                onClick={onClose}
            />

            {/* 弹窗内容 */}
            <div
                style={{
                    position: "fixed",
                    top: "30%",
                    left: "50%",
                    transform: "translate(-50%, -30%)",
                    borderRadius: "8px",
                    padding: "20px",
                    zIndex: 2000,
                    minWidth: "300px",
                }}
            >
                {content}
            </div>
        </>
    );
};

/**
 * showModal(options)
 * @param content React节点
 */
export function showModal({ content }) {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    const close = () => {
        root.unmount();
        container.remove();
    };

    // 自动注入 closeHandle
    const injectedContent = cloneElement(content, { closeHandle: close });

    root.render(<ModalWindow content={injectedContent} onClose={close} />);

    return close; // 外部依然可以拿到关闭函数
}
