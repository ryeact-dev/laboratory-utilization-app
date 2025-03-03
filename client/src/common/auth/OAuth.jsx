import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useLoginUser } from "@/hooks/users.hook";
import { app } from "@/lib/utils/firebase";
import { Button } from "../ui/button";

export default function OAuth() {
  const googleAuthMutation = useLoginUser(true);

  const onGoogleClickHandler = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);

    const result = await signInWithPopup(auth, provider);

    const googleUserData = {
      name: result.user.displayName,
      email: result.user.email,
      photo_url: result.user.photoURL,
    };

    googleAuthMutation.mutate(googleUserData);
  };

  return (
    <Button
      onClick={onGoogleClickHandler}
      type="button"
      className="w-full gap-2 border-2 border-primary bg-primary/10 text-sm font-medium text-white hover:bg-primary/50"
    >
      Login with Google
    </Button>
  );
}
