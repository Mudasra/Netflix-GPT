import React, { useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlics";
import { LOGO, SUPPORTED_LANGUAGES, USER_AVATAR } from "../utils/constants";
import { toggleGptSearchView } from "../utils/gptSlice";
import { changeLanguage } from "../utils/configSlice";
import lang from "../utils/languageConstants";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const langKey = useSelector((store) => store.config.lang);
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);

  const [isOpen, setIsOpen] = useState(false); // mobile toggle state

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {})
      .catch(() => navigate("/error"));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(
          addUser({ uid, email, displayName, photoURL })
        );
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate]);

  const handleGptSearchCLick = () => {
    dispatch(toggleGptSearchView());
  };

  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };

  return (
    <div className="absolute w-full top-0 z-20 px-4 sm:px-6 md:px-8 lg:px-12 py-4 bg-gradient-to-b from-black flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div className="flex justify-between items-center w-full sm:w-auto">
        <img className="w-28 sm:w-32 md:w-40 lg:w-44" alt="logo" src={LOGO} />

        {user && (
          <button
            className="sm:hidden text-white text-2xl font-bold focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        )}
      </div>

      {user && (
        <div
          className={`
            flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5
            w-full sm:w-auto
            transition-all duration-300 overflow-hidden
            ${isOpen ? "flex mt-3" : "hidden sm:flex mt-0"}
          `}
        >
          <select
            onChange={handleLanguageChange}
            className="px-4 py-2 bg-neutral-900 text-white rounded-md border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.identifier} value={lang.identifier}>
                {lang.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleGptSearchCLick}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md shadow-md transition duration-200"
          >
            {showGptSearch ? lang[langKey].home : lang[langKey].search}
          </button>

          <img className="w-10 h-10 rounded" alt="user profile" src={USER_AVATAR} />

          <button
            className="px-3 sm:px-4 py-1 text-sm sm:text-base text-white font-semibold bg-red-600 hover:bg-red-700 rounded transition-colors duration-300 ease-in-out"
            onClick={handleSignOut}
          >
            {lang[langKey].sign_out}
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
