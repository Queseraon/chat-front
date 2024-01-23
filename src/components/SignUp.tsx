import { ChangeEvent, useState } from "react";
import { User } from "../types/User.type";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
    const [error, setError] = useState(false);
    const [chatUser, setChatUser] = useState<User>({});
    const [errMsg, setErrMsg] = useState<string>('');
    const navigate = useNavigate();
    const join = () => {
        console.log(chatUser);
        if (!chatUser.uiId) {
            setErrMsg('아이디를 입력해주세요.');
            return;
        }
        axios.post('http://localhost:8081/join', chatUser, {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then(res => {
                alert("회원가입 되었습니다.");
                navigate('/sign-in');
            })
            .catch(err => {
                setError(true);
                console.log(err);
            });
    }
    const changeUser = (evt: ChangeEvent<HTMLInputElement>) => {
        setChatUser({
            ...chatUser,
            [evt.target.id]: evt.target.value,
        })
    }
    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form>
                    <h3>Sign Up</h3>

                    <div className="mb-3">
                        <div className="text-danger">
                            {errMsg !== '' ? errMsg : ''}
                        </div>
                        <label>ID</label>
                        <input type="text" id="uiId" className="form-control" placeholder="아이디" onChange={changeUser} />
                    </div>

                    <div className="mb-3">
                        <label>Password</label>
                        <input type="password" id="uiPwd" className="form-control" placeholder="비밀번호" onChange={changeUser} />
                    </div>

                    <div className="mb-3">
                        <label>Name</label>
                        <input type="text" id="uiName" className="form-control" placeholder="이름" onChange={changeUser} />
                    </div>

                    <div className="mb-3">
                        <label>Email</label>
                        <input type="text" id="uiEmail" className="form-control" placeholder="이메일" onChange={changeUser} />
                    </div>

                    <div className="mb-3">
                        <label>Mobile</label>
                        <input type="text" id="uiMobile" className="form-control" placeholder="전화번호" onChange={changeUser} />
                    </div>

                    <div className="mb-3">
                        <label>Roadaddr</label>
                        <input type="text" id="uiRoadaddr" className="form-control" placeholder="도로명 주소" onChange={changeUser} />
                    </div>

                    <div className="mb-3">
                        <label>Zonecode</label>
                        <input type="text" id="uiZonecode" className="form-control" placeholder="우편번호" onChange={changeUser} />
                    </div>

                    <div className="d-grid">
                        <button type="button" className="btn btn-primary" onClick={join}>
                            회원가입
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
