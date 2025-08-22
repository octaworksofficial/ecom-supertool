'use client'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

const NavToggle = () => {
  // Hooks
  const { toggleVerticalNav, isBreakpointReached } = useVerticalNav()

  const handleClick = () => {
    toggleVerticalNav()
  }

  return (
    <>
      {/* <span className='text-xl cursor-pointer' onClick={handleClick}>☰</span> */}
      {/* Comment following code and uncomment above code in order to toggle menu on desktop screens as well */}
      {isBreakpointReached && <span className='text-xl cursor-pointer' onClick={handleClick}>☰</span>}
    </>
  )
}

export default NavToggle
