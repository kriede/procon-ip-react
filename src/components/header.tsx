import React, { ChangeEvent, useState } from 'react'
import { t } from '../services/appi18n'
import { LinkToOverview, reconnect } from '../App'
import { login, logout, isLoggedIn, currentUser } from '../services/login'
import { Turn as Hamburger } from 'hamburger-react'
import { Menu } from './menu'
import { Card } from './card'
import './header.scss'

export function Header({
  title
}: {
  title: string
}) {

  const [isMenuOpen, setMenuOpen] = useState(false)

  const onSetMenuOpen = () => {
    setMenuOpen(!isMenuOpen)
  }

  const [loginData, setLoginData] = useState(currentUser)

  const onChangeUsername =  (e: ChangeEvent<HTMLInputElement>) => setLoginData({...loginData, username: e.target.value})
  const onChangePassword =  (e: ChangeEvent<HTMLInputElement>) => setLoginData({...loginData, password: e.target.value})

  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const onAvatarClick = () => {
    setShowProfileMenu(true)
  }

  const [errorText, setErrorText] = useState('')
  const [loggedIn, setLoggedIn] = useState(isLoggedIn())

  const onLogin = async () => {
    if (loginData.username === "" || loginData.password === "") {
      setErrorText("Zugangsdaten unvollständig")
      return
    }
    try {
      login(loginData.username, loginData.password)
      setShowProfileMenu(false)
      setLoggedIn(true)
      setErrorText('')
      reconnect(loginData.username, loginData.password)
    } catch (e) {
      console.dir(e)
      onLogout()
      if (e instanceof Error) {
        setErrorText(e.message)
      }
    }
  }

  const onCancel = () => {
    setShowProfileMenu(false)
  }

  const onLogout = () => {
    logout()
    setLoggedIn(false)
    reconnect('', '')
  }

  return (
    <>
      <Menu open={isMenuOpen} />
      <Card width="full" id="0" >
        <div className="header">
          <div className="hdiv">
            <Hamburger toggled={isMenuOpen} toggle={setMenuOpen} />
          </div>
          <div className="hdiv">
            <LinkToOverview>
              <div className="title">{title}</div>
            </LinkToOverview>
          </div>
          <div className="avatar hdiv" onClick={onAvatarClick}>
            { loginData.username !== '' && 
              <div className="username">{loggedIn && loginData.username}</div>
            }
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" className="avatar">
              <g><path d="M990,946.9L990,946.9c0-0.1,0-0.1,0-0.2c-0.1-4.1-0.9-8.1-2.2-11.8C953,761.5,828.1,620.7,664,563.5c81.8-53.5,135.8-145.9,135.8-250.9C799.8,147,665.6,12.8,500,12.8c-165.6,0-299.8,134.2-299.8,299.8c0,105,54,197.4,135.8,250.9C171.9,620.7,47,761.5,12.3,934.9c-1.3,3.7-2.1,7.7-2.2,11.8c0,0.1,0,0.1,0,0.2h0c0,0.4,0,0.7,0,1.1c0,21.6,17.5,39.2,39.2,39.2s39.2-17.5,39.2-39.2c0-0.4,0-0.8,0-1.1h0.8C129,756.5,297.8,613.5,500,613.5c202.2,0,371,143,410.8,333.4h0.8c0,0.4,0,0.7,0,1.1c0,21.6,17.5,39.2,39.2,39.2c21.6,0,39.2-17.5,39.2-39.2C990,947.7,990,947.3,990,946.9z M276.8,312.5c0-123.3,99.9-223.2,223.2-223.2s223.2,99.9,223.2,223.2S623.3,535.8,500,535.8S276.8,435.8,276.8,312.5z"/></g>
            </svg>
          </div>
          { showProfileMenu &&
            <>
              <div className="overlay" onClick={onCancel}/>
              <form>
                <div className="profile-dialog">
                  { loggedIn && 
                    <>
                      <div className="title">Logout</div>
                      <button type="button" onClick={onLogout} id="logout" className="primary">{t("logout")}</button>
                    </>
                  }
                  { !loggedIn &&
                    <>
                      <div className="title">Login</div>
                      <label htmlFor="username">Username</label>
                      <input type="text" id="username" placeholder="username" value={loginData.username} onChange={onChangeUsername} autoCorrect="off" autoComplete="username" />
                      <label htmlFor="password">Passwort</label>
                      <input type="password" id="password" placeholder="password" value={loginData.password} onChange={onChangePassword} autoCorrect="off" autoComplete="current-password" />
                      <button type="button" onClick={onLogin} id="login" className="primary" disabled={loginData.username === "" || loginData.password === ""}>{t("login")}</button>
                    </>
                  }
                  <button type="button" onClick={onCancel} id="cancel" className="secondary">{t("cancel")}</button>
                  { errorText && errorText !== '' &&
                    <div className="error">{errorText}</div>
                  }
                </div>
              </form>
            </>
          }
        </div>
      </Card>
    </>
  )
}
