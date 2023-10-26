import { NavAuth } from "./NavAuth";
import { NavNotAuth } from "./NavNotAuth";

export const ChangeNav = () => {
    const token = localStorage.getItem('token');
    if (token == null) {
        return (
          <div>
            <NavNotAuth/>
          </div>
        )
    }
    else{
        return (
            <div>
              <NavAuth/>
            </div>
          )
    }
}
