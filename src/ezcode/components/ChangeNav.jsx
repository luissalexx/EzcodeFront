import { NavAuth } from "./NavAuth";
import { NavNotAuth } from "./NavNotAuth";

export const ChangeNav = () => {
  const token = localStorage.getItem('token');

  return (
    <div>
      {token == null ? (
        <NavNotAuth />
      ) : (
        <NavAuth/>
      )}
    </div>
  );
}
