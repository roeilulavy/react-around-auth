import { Route, Switch, Redirect, withRouter, useHistory } from 'react-router-dom';
import React, { useState } from "react";
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/auth';
import Login from "./Login";
import Register from "./Register";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import InfoTooltip from "./InfoTooltip";
import "../index.css";
import api from "../utils/api";
import CurrentUserContext from "../contexts/CurrentUserContext";

function App() {
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [isInfoTolltipOpen, setIsInfoTolltipPopup] = useState(false);

  const [success, setSuccess] = useState(false);

  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const [isEditAvatarPopupOpen, setIsEditAvatarPopup] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopup] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});

  React.useEffect(() => {
    console.log("useEffect handleTokenCheck()")
    console.log("Is Logged In = "+isLoggedIn)

    async function handleTokenCheck() {
      console.log(localStorage.getItem('jwt'))
      if (localStorage.getItem('jwt')) {
        console.log("Exist")
        const jwt = localStorage.getItem('jwt');
        auth.checkToken(jwt).then((res) => {
          console.log(res)
          if (res) {
            setIsLoggedIn(true);
            setUserEmail(res.data.email);
            getUserData();
            getCardsData();
          }
        });
      } else {
        setIsLoggedIn(false);
      }
    }
    handleTokenCheck();
  },[isLoggedIn]);

  function handleLogin(password, email) {
    auth
      .signin(password, email)
      .then((data) => {
        console.log(data);
        if (data.token) {
          console.log("Login Successfuly: " + data);
          setIsLoggedIn(true);
          history.push("/");
        }
      })
      .catch((err) => {
        setSuccess(false);
        setIsInfoTolltipPopup(true);
        console.log(err);
      });
  }

  function handleSignup(password, email) {
    auth.signup(password, email).then((res) => {
      console.log(res)
      if (res.status === 400) {
        setSuccess(false);
        setIsInfoTolltipPopup(true);
        console.error("Signup Error: Something went wrong." + res);
      } else {
        setSuccess(true);
        setIsInfoTolltipPopup(true);
      }
    }).catch((err) => console.log(err));
    setIsInfoTolltipPopup(true);
  }

  function handleLogout() {
    console.log("Logout Clicked")
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    history.push("./signin");
  }

  async function getUserData() {
    setIsLoading(true);
    try {
      const userInfo = await api.getUserInfo();

      if (userInfo) {
        setCurrentUser(userInfo);
      }
    } catch (error) {
      console.log("Error! ", error);
      alert("Something went wrong getting user data..");
    } finally {
      setIsLoading(false);
    }
  }

  async function getCardsData() {
    setIsLoading(true);
    try {
      const cardsData = await api.getInitialCards();

      if (cardsData) {
        setCards(cardsData);
      }
    } catch (error) {
      console.log("Error! ", error);
      alert("Something went wrong getting cards data..");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCardLike(card) {
    const isLiked = card.likes.some((item) => item._id === currentUser._id);

    try {
      const updatedCard = await api.changeLikeCardStatus(card._id, !isLiked);

      if (updatedCard) {
        setCards((cards) =>
          cards.map((oldCard) =>
            oldCard._id === card._id ? updatedCard : oldCard
          )
        );
      }
    } catch (error) {
      console.log("Error! ", error);
      alert("something went wrong with HandleLike..");
    }
  }

  async function handleCardDelete(card) {
    const cardId = card;

    try {
      const deletedCard = await api.deleteCard(card._id);
      if (deletedCard) {
        setCards((cards) => cards.filter((item) => item._id !== cardId._id));
      }
    } catch (error) {
      console.log("Error! ", error);
      alert("something went wrong with handleCardDelete..");
    }
  }

  async function handleAddPlaceSubmit(name, link) {
    try {
      const newCard = await api.addNewCard(name, link);

      if (newCard) {
        setCards([newCard, ...cards]);
        closeAllPopups();
      }
    } catch (error) {
      console.log("Error! ", error);
      alert("something went wrong adding new place..");
    }
  }

  async function handleUpdateUser({ name, description }) {
    try {
      const updatedUserInfo = await api.setUserInfo(name, description);

      if (updatedUserInfo) {
        setCurrentUser(updatedUserInfo);
        closeAllPopups();
      }
    } catch (error) {
      console.log("Error! ", error);
      alert("something went wrong with Update user..");
    }
  }

  async function handleUpadeAvatar({ avatar }) {
    try {
      const newAvatar = await api.setUserAvatar(avatar);

      if (newAvatar) {
        setCurrentUser({ ...currentUser, avatar: newAvatar.avatar });
        closeAllPopups();
      }
    } catch (error) {
      console.log("Error! ", error);
      alert("something went wrong with Update user avatar..");
    }
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopup(false);
    setIsEditAvatarPopup(false);
    setIsImagePopup(false);
    setIsDeleteCardPopupOpen(false);
    setIsInfoTolltipPopup(false);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopup(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopup(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopup(true);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__wrapper">
          <Switch>
            <Route path="/signin">
              <Header
                linkTitle={"Sing up"}
                link={"/signup"}
                button={"header__button"}
              />
              <Login handleLogin={handleLogin} />
              {isInfoTolltipOpen && success ? (
                <></>
              ) : (
                <InfoTooltip
                  isOpen={isInfoTolltipOpen}
                  onClose={closeAllPopups}
                  success={false}
                  message={"Oops, something went wrong! Please try again."}
                />
              )}
            </Route>      
            <Route path="/signup">
              <Header
                linkTitle={"Log in"}
                link={"/signin"}
                button={"header__button"}
              />
              <Register handleSignup={handleSignup}/>
              {success ? (
                <InfoTooltip
                  isOpen={isInfoTolltipOpen}
                  onClose={closeAllPopups}
                  success={true}
                />
              ) : (
                <InfoTooltip
                  isOpen={isInfoTolltipOpen}
                  onClose={closeAllPopups}
                  success={false}
                />
              )}
              
            </Route>
            <ProtectedRoute exact path="/" isLoggedIn={isLoggedIn}>
              <Header
                link={""}
                email={userEmail}
                button={"header__button_active"}
                onClick={handleLogout}
              />

              <Main
                isLoading={isLoading}
                onEditAvatarClick={handleEditAvatarClick}
                onEditProfileClick={handleEditProfileClick}
                onAddPlaceClick={handleAddPlaceClick}
                cards={cards}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />

              <ImagePopup
                selectedCard={selectedCard}
                isOpen={isImagePopupOpen}
                onClose={closeAllPopups}
              />

              <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser}
              />

              <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateAvatar={handleUpadeAvatar}
              />

              <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onUpdateCard={handleAddPlaceSubmit}
              />

              <PopupWithForm
                isOpen={isDeleteCardPopupOpen}
                onClose={closeAllPopups}
                name="delete-card"
                title="Are you sure?"
                buttonText="Yes"
              />

              <Footer />              
            </ProtectedRoute>
            <Route path="/*">
              {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
            </Route>
          </Switch>
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
