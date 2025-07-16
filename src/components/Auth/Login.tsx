import React, { useState, useEffect } from 'react';
import useLogin from '../../composables/useLogin';
import { useAuth } from '../../context/auth-context';
import { useNavigate, Link } from 'react-router-dom';

const LoginComponent = () => {
  const { error, isPending, login } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/account');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-surface rounded-lg shadow-lg p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center text-accent mb-2">Login to QuizMaster</h2>
      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Login form">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-border bg-muted text-text focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-border bg-muted text-text focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Your password"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 px-4 bg-accent text-white rounded-md font-semibold hover:bg-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {isPending ? 'Logging in...' : 'Login'}
        </button>
        {error && (
          <p className="text-center text-wrong-500 mt-2" role="alert">
            {error}
          </p>
        )}
      </form>
      <div className="text-center text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="text-accent underline hover:text-accent-hover">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LoginComponent;