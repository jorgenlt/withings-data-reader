import { useState, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { 
  HiXMark, 
  HiOutlineBars3,
} from "react-icons/hi2";

const Nav = () => {
  // const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the navigation menu
  const toggleNav = () => {
    setIsOpen(prev => !prev)
  }

  const nodeRef = useRef(null);

  // Function to handle click outside of the nav 
  // navigation menu to close it
  // const clickOutside = e => {
  //   if (e.target.className === "nav--mobile-overlay") {
  //     toggleNav();
  //   }
  // };

  // Add or remove 'overflow-hidden' class on the body 
  // based on the state of the mobile navigation menu
  // useEffect(() => {
  //   const body = document.body;

  //   if(isOpen) {
  //     body.classList.add('overflow-hidden');
  //   } else {
  //     body.classList.remove('overflow-hidden');
  //   }
  // }, [isOpen]);

  return (
    <>
      <div 
        className="nav--open"
        onClick={() => toggleNav()}
      >
        <HiOutlineBars3 />
      </div>
        {/* open menu */}
        <CSSTransition
          in={isOpen}
          nodeRef={nodeRef}
          timeout={200}
          classNames={'nav--transition'}
          unmountOnExit
        >
          <div
            className='nav'
            ref={nodeRef}
          >
            {/* close menu */}
            <div 
              className="nav--close" 
              onClick={() => toggleNav()}
            >
              <HiXMark />
            </div>
            {/* menu content */}
            <div className='nav--content'>
              <ul>
                <li>nav content</li>
              </ul>
            </div>
          </div>
        </CSSTransition>
    </>
  )
}

export default Nav