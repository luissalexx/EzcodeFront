import { FootNavAuth } from "./FootNavAuth";
import { FootNavNotAuth } from "./FootNavNotAuth";

export const ChangeFootNav = () => {
    const token = localStorage.getItem('token');

    return (
        <div>
            {token == null ? (
                <FootNavNotAuth />
            ) : (
                <FootNavAuth />
            )}
        </div>
    )
}
