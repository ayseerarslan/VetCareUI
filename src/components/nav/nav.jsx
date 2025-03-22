import './nav.css'
import logo from '../../assets/pngwing.com.png'
import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <div>
      <nav>
      <Link to="/"><div className='logo-title'>
          <img src={logo} alt="logo"/>
          <p className='title'>Vet Care</p>
          
        </div></Link>
        <ul className='nav-ul'>
            <li className='nav-li'>
              <Link to="/customer">Customer</Link>
            </li>
            <hr />
            <li className='nav-li'>
              <Link to="/doctor">Doctor</Link>
              </li>
            <hr />
            <li className='nav-li'>
              <Link to="/animal">Animal</Link>
              </li>
            <hr />
            <li className='nav-li'>
              <Link to="/appointment">Appointment</Link>
              </li>
            <hr />
            <li className='nav-li'>
              <Link to="/vaccine">Vaccine</Link>
              </li>
        </ul>
        <a href="#"></a>
      </nav>
    </div>
  )
}

export default Nav