import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { environment } from './environment.ts';
import UserForm from './components/AddUser.js';
import UserList from './components/UserList';
import LoginForm from './components/Login.js';
import MarksheetForm from './components/AddMarksheet.js';
import MarksheetList from './components/MarksheetList';
import MeritMarksheetList from './components/MeritMarksheetList';
import SignUp from './components/SignUp';
import StudentForm from './components/AddStudent.js';
import StudentList from './components/StudentList';
import Footer from './components/Footer.js';
import Header from './components/Header.js';
import Welcome from './components/Welcome.js';

const App = () => {
  const [user, setUser] = useState(null);
  const apiUrl = environment.apiUrl;

  const handleLogout = () => {
    fetch(`${apiUrl}/api/user/logout`, {
      method: 'POST',
    })
      .then(response => {
        if (response.ok) {
          localStorage.removeItem('user');
          setUser(null);
        } else {
          throw new Error('Logout failed');
        }
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, []);

  return (
    <Router>
      <div>
        <Header user={user} handleLogout={handleLogout} />

        <Routes>
          <Route
            path="/"
            element={<LoginForm setAuth={(user) => { setUser(user); localStorage.setItem('user', JSON.stringify(user)); }} />}
          />
          {user ? (
            <>
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/adduser" element={user.role === 'admin' ? <UserForm /> : <Navigate to="/" />} />
              <Route path="/UserList" element={user.role === 'admin' ? <UserList /> : <Navigate to="/" />} />
              <Route path="/edituser/:id" element={user.role === 'admin' ? <UserForm /> : <Navigate to="/" />} />
              <Route path="/addMarksheet" element={user.role === 'admin' ? <MarksheetForm /> : <Navigate to="/" />} />
              <Route path="/MarksheetList" element={<MarksheetList />} />
              <Route path="/editmarksheet/:id" element={user.role === 'admin' ? <MarksheetForm /> : <Navigate to="/" />} />
              <Route path="/MeritMarksheetList" element={<MeritMarksheetList />} />
              <Route path="/addStudent" element={<StudentForm />} />
              <Route path="/studentList" element={<StudentList />} />
              <Route path="/editstudent/:id" element={<StudentForm />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<LoginForm setAuth={(user) => { setUser(user); localStorage.setItem('user', JSON.stringify(user)); }} />} />
              <Route path="/signUp" element={<SignUp />} />
            </>
          )}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;