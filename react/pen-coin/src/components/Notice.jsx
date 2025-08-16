import style from './Notice.module.scss'

function Notice({textArr}) {

    return (
        <div className={style.Notice}>
            <i></i>
            {textArr.map((text, index) => (
                <div className={style.textArea} key={index}>
                    <small
                        dangerouslySetInnerHTML={{ __html: text }}
                    />
                </div>
            ))}
        </div>
    );
}

export default Notice;