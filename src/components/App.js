import { Route, Switch, useHistory } from 'react-router-dom';
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
import "../index.css";
import api from "../utils/api";
import CurrentUserContext from "../contexts/CurrentUserContext";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("jwt"));

  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const [isEditAvatarPopupOpen, setIsEditAvatarPopup] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopup] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});

  const history = useHistory();
  
  const onRegister = () => {
    history.push('/signin');
  }

  const onLogin = (userData) => {
    setToken(userData.token);
    // setUserData(userData);
    setLoggedIn(true);
  }

  const onLogout = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    history.push("/signin");
  }

  React.useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if(!jwt) {
      return;
    }
    auth.checkToken(jwt).then((res) => {
      if (res){
        const data = {
          email: res.data.email,
          id: res.data._id
        }

        setUserData(data);
        setLoggedIn(true);
      }
    })
  }, []);

  React.useEffect(() => {
    if (loggedIn) {
      history.push('/');

      async function loadPage() {
        setIsLoading(true);

        try{
          const userInfo = await api.getUserInfo(token);

          if (userInfo) {
            setCurrentUser(userInfo);
          } else {
            throw new Error("Failed to load userInfo");
          }

          const cardsData = await api.getInitialCards(token);

          if (cardsData) {
            setCards(cardsData);
          } else {
            throw new Error("Failed to load cards");
          }

        } catch (error) {
          console.log("Error! ", error);
          alert("Something went wrong getting user data..");
        } finally {
          setIsLoading(false);
        }
      }

      // async function getUserData() {
      //   setIsLoading(true);
      //   try {
      //     const userInfo = await api.getUserInfo(token);

      //     if (userInfo) {
      //       setCurrentUser(userInfo);
      //     }
      //   } catch (error) {
      //     console.log("Error! ", error);
      //     alert("Something went wrong getting user data..");
      //   } finally {
      //     setIsLoading(false);
      //   }
      // }

      // async function getCardsData() {
      //   setIsLoading(true);
      //   try {
      //     const cardsData = await api.getInitialCards(token);

      //     if (cardsData) {
      //       setCards(cardsData);
      //     }
      //   } catch (error) {
      //     console.log("Error! ", error);
      //     alert("Something went wrong getting cards data..");
      //   } finally {
      //     setIsLoading(false);
      //   }
      // }

      // getUserData();
      // getCardsData();
      loadPage();
    } else {
      history.push('/signin');
    }
  }, [history, loggedIn, token]);

  async function handleCardLike(card) {
    const isLiked = card.likes.some((item) => item._id === currentUser._id);

    try {
      const updatedCard = await api.changeLikeCardStatus(card._id, !isLiked, token);

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
      const deletedCard = await api.deleteCard(card._id, token);
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
      const newCard = await api.addNewCard(name, link, token);

      if (newCard) {
        setCards([newCard, ...cards]);
        closeAllPopups();
      }
    } catch (error) {
      console.log("Error! ", error);
      alert("something went wrong adding new place..");
    }
  }

  async function handleUpdateUser({ name, description}) {
    try {
      const updatedUserInfo = await api.setUserInfo(name, description, token);

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
      const newAvatar = await api.setUserAvatar(avatar, token);

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
              <Header page={"signin"} />
              <Login onLogin={onLogin} />
            </Route>      
            <Route path="/signup">
              <Header page={"signup"} />
              <Register onRegister={onRegister} />
            </Route>
            <ProtectedRoute exact path="/" loggedIn={loggedIn}>
              <Header 
                page={"home"}
                email={userData.email}
                onLogout={onLogout}
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
          </Switch>
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
