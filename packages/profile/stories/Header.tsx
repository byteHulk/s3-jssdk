import styled from "styled-components";
import { useSession } from "@us3r-network/auth-with-rainbowkit";
import {
  LoginButton,
  LogoutButton,
  UserAvatar,
  UserName,
} from "@us3r-network/profile";

export default function Header() {
  const session = useSession();

  return (
    <Wrapper>
      {session ? (
        <>
          <Welcome>
            Welcome, <UserName />! <UserAvatar />
          </Welcome>
          <LogoutButton className="button" />
        </>
      ) : (
        <>
          <LoginButton className="button" />
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    margin-left: auto;
  }
`;

const Welcome = styled.span`
  color: #333;
  font-size: 14px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  gap: 20px;
`;
