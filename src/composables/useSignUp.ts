import { useState, useCallback } from 'react';
import { auth } from '../firebase';
import { UserCredential } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const useSignUp = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const signup = useCallback(
    async (email: string, password: string): Promise<UserCredential> => {
    setError(null);
    setIsPending(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (!res) {
        throw new Error('Could not complete signup');
      }

      setError(null);
      return res;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { error, isPending, signup };
};

export default useSignUp;
