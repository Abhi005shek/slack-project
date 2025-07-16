"use client";

import { useState } from "react";
import { SignInFlow } from "../types";
import SigninCard from "./signin-card";
import SignupCard from "./signup-card";
import * as motion from "motion/react-client";

function AuthScreen() {
  const [state, setState] = useState<SignInFlow>("signIn");
  return (
    <div className="h-full flex justify-center items-center bg-[#5C3B58]">
      <motion.div initial={{scale: 0.8, y:10, opacity: 0 }} animate={{ scale: 1, y:0, opacity: 1}}  className="md:h-auto md:w-[420px]">
        {state === "signIn" ? (
          <SigninCard setState={setState} />
        ) : (
          <SignupCard setState={setState} />
        )}
      </motion.div>
    </div>
  );
}

export default AuthScreen;
