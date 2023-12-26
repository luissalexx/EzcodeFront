import { useParams } from "react-router-dom";
import { ChangeCursoNav } from "../../components/ChangeCursoNav";

export const CursoPage = () => {
    const { id } = useParams();

    return (
        <div>
            <ChangeCursoNav />  
        
        </div >
    )
}
