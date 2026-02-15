import React, { useRef, useState } from "react";
import Header from "./Header";
import { CheckValidData } from "../utils/Validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlics";
import { BG_IMG } from "../utils/constants";

const Login = () => {
  const [isSignInForm, setisSignInForm] = useState(false);
  const toggleSignInForm = () => {
    setisSignInForm(!isSignInForm);
  };

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const dispatch = useDispatch();

  const [errorMessage, seterrorMessage] = useState({});
  const [firebaseError, setFirebaseError] = useState("");

  const handleButtonClick = () => {
    //Validate the form data

    const nameValue = isSignInForm ? "" : name.current?.value || "";
    const emailValue = email.current?.value || "";
    const passwordValue = password.current?.value || "";

    const message = CheckValidData(nameValue, emailValue, passwordValue);
    seterrorMessage(message || {});

    if (message) return;

    // else sign in or sign up the user
    if (!isSignInForm) {
      // sign up logic
      createUserWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          updateProfile(user, {
            displayName: nameValue,
            photoURL: "https://example.com/jane-q-user/profile.jpg",
          })
            .then(() => {
              const { uid, email, displayName, photoURL } = auth.currentUser;
                      dispatch(
                        addUser({
                          uid: uid,
                          email: email,
                          displayName: displayName,
                          photoURL,
                        })
                      );
            })
            .catch((error) => {
              seterrorMessage(message);
            });
          // console.log(user);
          
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setFirebaseError(errorCode + "-" + errorMessage);
        });
    } else {
      // sgin in logic
      signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => {
          // Signed in
          // console.log("user signed in", user);
          setFirebaseError("");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // console.log("FIREBASE ERROR:", error.code, error.message);
          setFirebaseError(errorCode + "-" + errorMessage);
        });
    }
  };

  return (
    <div>
      <Header />
      <div className="absolute w-screen h-screen">
        <img
          className="w-full h-full object-cover t-0 l-0 z-0"
          src={BG_IMG}
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-transparent pointer-events-none to-black/95 z-10"></div>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        autoComplete="on"
        className=" rounded absolute bg-black bg-opacity-80 flex flex-col   p-8 sm:p-10 md:p-12
  w-11/12 sm:w-8/12 md:w-5/12 lg:w-3/12
   top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <h1 className="font-bold mb-2 text-3xl text-white">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>

        {!isSignInForm && (
          <div className="my-6">
            {errorMessage.name && (
              <p className="text-red-500 text-xs"> {errorMessage.name}</p>
            )}

            <input
              ref={name}
              type="text"
              autoComplete="name"
              placeholder="Full Name"
              className="bg-[#333333] text-white w-full rounded  mt-1 p-2 focus:outline-none "
            />
          </div>
        )}

        <div className="mb-6">
          {errorMessage.email && (
            <p className="text-red-500 text-xs"> {errorMessage.email}</p>
          )}
          <input
            ref={email}
            type="email"
            autoComplete="email"
            placeholder="Email"
            className="bg-[#333333] text-white w-full rounded mt-1 p-2 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          {errorMessage.password && (
            <p className="text-red-500 text-xs"> {errorMessage.password}</p>
          )}
          <input
            ref={password}
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            className="bg-[#333333] text-white w-full rounded mt-1 p-2 focus:outline-none"
          />
        </div>

        <button
          className="rounded my-4 mb-0 px-6 text-white w-full font-bold py-3 bg-red-600 hover:bg-red-700 transition-colors duration-300 ease-in-out"
          onClick={handleButtonClick}
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>

        {firebaseError && (
          <p className="text-red-500 text-sm pt-4">{firebaseError}</p>
        )}
    
        <label className="flex items-center mt-3 mb-10 space-x-2 cursor-pointer">
          <input type="checkbox" className="cursor-pointer h-4 w-4 " />
          <span className="text-white">Remember me</span>
        </label>

        <p className="text-sm pt-4 pb-2 text-gray-400">
          {isSignInForm ? "New to Netflix?" : "Already Registered"}
          <span
            onClick={toggleSignInForm}
            className="text-white cursor-pointer hover:underline"
          >
            {isSignInForm ? " Sign Up " : " Sign In "}
          </span>{" "}
          now
        </p>

        <p className="text-sm text-gray-400">
          The page is protected by google CAPTCHA to ensure you are not a bot.
        </p>
      </form>
    </div>
  );
};

export default Login;

