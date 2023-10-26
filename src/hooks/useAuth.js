import { useNavigate } from "react-router-dom";
import ezcodeApi from "../api/ezcodeApi";

export const useAuth = () => {
    const navigate = useNavigate();

    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if ( !token ){
            navigate('/',{
                replace: true
              });
        }
    
        try {
            const { data } = await ezcodeApi.get('auth/renew');
            localStorage.setItem('token', data.token );
        } catch (error) {
            localStorage.clear();
        }
    }

    return{
        checkAuthToken
    }
}
