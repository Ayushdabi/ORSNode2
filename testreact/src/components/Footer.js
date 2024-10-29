import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <p style={styles.text}>
                    &copy; {new Date().getFullYear()} RAYS Technologies. All rights reserved.
                </p>
                <div style={styles.links}>
                    <Link style={styles.link} to="/privacy">Privacy Policy</Link>
                    <span style={styles.separator}>|</span>
                    <Link style={styles.link} to="/terms">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        background: '#000', // Dark black background
        color: 'white',
        padding: '10px 0', // Reduced padding
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100%',
    },
    container: {
        maxWidth: '1200px', // Limit the width
        margin: '0 auto',
    },
    text: {
        margin: '0',
        fontSize: '0.9rem', // Reduced font size
        fontWeight: '300', // Light font weight
    },
    links: {
        marginTop: '5px', // Reduced margin
    },
    link: {
        color: '#FFD700', // Gold color for links
        textDecoration: 'none',
        margin: '0 5px', // Reduced margin
        transition: 'color 0.3s', // Transition for hover effect
    },
    separator: {
        color: 'white',
        margin: '0 5px', // Reduced margin
    },
};

export default Footer;