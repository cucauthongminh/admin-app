import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signout } from '../../redux/actions/auth.actions';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const [t, i18n] = useTranslation('common');

    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const logout = () => {
        dispatch(signout());
    }

    const renderLoggedInLinks = () => {
        return (
            <Nav>
                <li className="nav-item">
                <span className="nav-link" onClick={logout} >{t('header.signout')}</span>
                </li>
            </Nav>
        );
    }

    const renderNonLoggedInLinks = () => {
        return (
            <Nav>
                {/* <Nav.Link href="#deets">Signin</Nav.Link> */}
                <li className="nav-item">
                <NavLink to="/signin" className="nav-link">{t('header.signin')}</NavLink>
                </li>
                <li className="nav-item">
                <NavLink to="/signup" className="nav-link">{t('header.signup')}</NavLink>
                </li>
            </Nav>
        );
    }
    return (
        <Navbar collapseOnSelect fixed="top" expand="lg" bg="dark" variant="dark" style={{ zIndex: 1 }}>
            <Container fluid>
                {/* <Navbar.Brand href="#home">Admin Dashboard</Navbar.Brand> */}
                <Link to="/" className="navbar-brand">{t('header.title')}</Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown> */}
                </Nav>
                <Nav>
                    <NavDropdown title={t('header.trans')} id="collasible-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1" onClick={() => i18n.changeLanguage('vi')}>{t('language.vi')}</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2" onClick={() => i18n.changeLanguage('en')}>{t('language.en')}</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                {auth.authenticate ? renderLoggedInLinks() : renderNonLoggedInLinks()}
                
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header

