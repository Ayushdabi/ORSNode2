// Welcome.js
import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>Welcome to the Online Result System</h1>
                <p style={styles.subtitle}>
                    Access your academic records with ease and stay updated on your progress.
                </p>
                <Link to="/MarksheetList">
                    <button style={styles.button}>Get Started</button>
                </Link>            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Changed to 100vh to cover full viewport height
        background: 'linear-gradient(to bottom right, #141E30, #243B55)', // Gradient background
        color: 'white',
        margin: 0, // Remove default margin
        padding: 0, // Remove default padding
    },
    content: {
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background for content
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(5px)', // Blur effect
        animation: 'fadeIn 2s', // Animation
    },
    title: {
        fontSize: '2.8rem',
        color: '#FFD700', // Gold color
        fontWeight: 'bold',
        marginBottom: '15px',
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#f0f0f0', // Light gray color
        marginBottom: '25px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '1rem',
        color: '#141E30',
        backgroundColor: '#FFD700', // Matching the title color
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'transform 0.2s', // Hover effect
    },
    '@keyframes fadeIn': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
    }
};

export default Welcome;