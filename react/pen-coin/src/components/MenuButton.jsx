import { useLocation,Link } from 'react-router-dom';
import style from "./MenuButton.module.scss"

function MenuButton({name,url})
{
    const location = useLocation(); // 新增
    const isActive = location.pathname === url; // 判断当前路由

    return (
        <div className={style.MenuButton}>
            <Link to={url} className={`${style.Button} pixel-16-000`}>{name}</Link>
            {isActive && <div className={style.Arrow}></div>}
        </div>
    );
}

export default MenuButton;