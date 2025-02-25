import React from 'react';
import { SignIn, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import Body from './components/body/Body';
import Footer from './components/footer/Footer';
import './App.css';  // Make sure styles are applied

const App = () => {
  return (
    <div>
      {/* Header Section */}
      <header className="header">
        <h1 className="title">🚀 Welcome to <span className="highlight">VAssist</span></h1>
        <SignedIn>
          <UserButton className="profile-icon" />
        </SignedIn>
      </header>

      {/* Main Content */}
      <main>
        <SignedOut>
          <SignIn />
        </SignedOut>

        <SignedIn>
          <Body />
          <Footer />
        </SignedIn>
      </main>
    </div>
  );
};

export default App;
// djfkajfd