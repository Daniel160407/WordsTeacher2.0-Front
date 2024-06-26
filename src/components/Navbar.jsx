import '../style/Navbar.scss';

const Navbar = () => {
    return (
        <ul className="nav nav-tabs">
            <li className="nav-item"><a className="nav-link active" data-toggle="tab" href="#words">Words</a></li>
            <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#addWords">Add Words</a></li>
        </ul>
    );
}

export default Navbar;