import { useAppDispatch } from "../../hooks";
import { collapseLines } from "../../store/linesSlice";
import "./MyButton.scss"

const MyButton: React.FC  = () => {
    const dispatch = useAppDispatch();

    return <button type='button' className='btn' onClick={() => dispatch(collapseLines(true))}>Collapse line</button>
}

export default MyButton;
