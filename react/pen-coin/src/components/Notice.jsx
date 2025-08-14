import style from './Notice.module.scss'

function Notice({textArr}) {

    return (
        <div className={style.Numbered}>
            <i></i>
            {textArr.map((text, index) => (
                <div className={style.textArea}>
                    <p
                        key={index}
                        dangerouslySetInnerHTML={{ __html: text }}
                    />
                </div>
            ))}
        </div>
    );
}

export default Notice;