import { ChangeEvent, useEffect, useState } from "react";
import { User } from "../types/User.type";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [chatUser, setChatUser] = useState<User>({});
  const [rememberId, setRememberId] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    let uiId: any = localStorage.getItem('uiId');
    if (uiId) {
      setChatUser({
        ...chatUser,
        uiId: uiId
      })
      setRememberId(true);
    }
  }, []);
  const checkRememberId = (evt: any) => {
    setRememberId(evt.target.checked);
  }
  const changeUser = (evt: ChangeEvent<HTMLInputElement>) => {
    setChatUser({
      ...chatUser,
      [evt.target.id]: evt.target.value,
    })
    console.log(chatUser);
  }
  const login = () => {
    axios.post('http://localhost:8081/api/login', chatUser, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data));
        alert("로그인 되었습니다.");
        if (rememberId) {
          localStorage.setItem('uiId', res.data.uiId);
        } else {
          localStorage.removeItem('uiId');
        }
        navigate('/main');
      })
      .catch(err => {
        setError(true);
        console.log(err);
      });
  }
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form>
          <h3>Sign In</h3>

          <div className="mb-3">
            {error
              ?
              <div className="text-danger">
                아이디와 비밀번호를 확인해주세요.
              </div> : ''
            }
            <label>Id</label>
            <input type="text" id="uiId" className="form-control" placeholder="아이디" onChange={changeUser} />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input type="password" id="uiPwd" className="form-control" placeholder="비밀번호" onChange={changeUser} />
          </div>

          <div className="mb-3">
            <div className="custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input"
                id="customCheck1" onChange={checkRememberId} checked={rememberId} />
              <label className="custom-control-label" htmlFor="customCheck1">
                아이디 기억하기
              </label>
            </div>
          </div>

          <div className="d-grid">
            <button type="button" className="btn btn-primary" onClick={login}>
              Sign In
            </button>
          </div>
          <p className="forgot-password text-right">
            Forgot <a href="#" onClick={() => navigate('/sign-up')}>회원가입</a>
          </p>
        </form>
      </div>
    </div>
  )
}

