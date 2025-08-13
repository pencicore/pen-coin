import style from './LoginButton.module.scss'

function LoginButton({ name, handleClick }) {
    return (
        <div className={`${style.LoginButton} pixel-16-000`} onClick={handleClick}>
            {name}
        </div>
    );
}

export default LoginButton;