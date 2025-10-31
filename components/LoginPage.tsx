import React from 'react';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
            <div className="text-center p-8 max-w-md w-full">
                <h1 className="text-4xl font-bold mb-2">Welcome to ClubApp</h1>
                <p className="text-lg text-gray-400 mb-8">Collaborative finance for alumni.</p>
                <div className="bg-gray-800 p-8 rounded-lg shadow-2xl">
                    <h2 className="text-2xl font-semibold mb-6">Sign In</h2>
                    <button
                        onClick={onLogin}
                        className="w-full flex items-center justify-center bg-white text-gray-800 font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
                    >
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
                            <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                            <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v8.51h13.04c-.57 3.32-2.31 6.2-5.24 8.12l7.98 6.19c4.63-4.28 7.3-10.45 7.3-17.27z"></path>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                            <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.98-6.19c-2.11 1.42-4.78 2.27-7.91 2.27-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            <path fill="none" d="M0 0h48v48H0z"></path>
                        </svg>
                        Sign in with Google
                    </button>
                    <p className="text-xs text-gray-500 mt-6">
                        This is a simulated login. Clicking will sign you in as a default user.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;