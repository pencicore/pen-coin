import { toast } from 'react-toastify';

const toastUtil = {
    log(msg) {
        toast(msg, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            icon: false,
            closeOnClick: false,     // ❌ 禁止点击关闭
            closeButton: false,      // ❌ 不显示关闭按钮
            style: {
                width: '200px',
                height: '64px',
                backgroundImage: "url('src/assets/images/util-notice-background.png')",
                // backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                // imageRendering: 'pixelated',
                // imageRendering: 'crisp-edges',
                borderRadius: '0px',
                color: '#000',
                fontSize: '16px',
                fontWeight: 500,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 0px',
                boxShadow: 'none',
            }
        });
    }
}

export default toastUtil;
