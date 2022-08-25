import Link from 'next/link';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
const Navigation = () => {
  return (
    <nav className="header-content__navigation space-pr--15 space-pl--15 d-none d-lg-block">
      <ul>
        <li>
          <Link href="/" as={process.env.PUBLIC_URL + '/'}>
            <a>Home</a>
          </Link>
        </li>

        <li className="position-relative">
          <Link href="/" as={process.env.PUBLIC_URL + '/'}>
            <a>About Us</a>
          </Link>
        </li>
        <li>
          <Link href="/" as={process.env.PUBLIC_URL + '/'}>
            <a>Shop</a>
          </Link>
        </li>
        <li>
          <Link href="/" as={process.env.PUBLIC_URL + '/'}>
            <a>Contact Us</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
