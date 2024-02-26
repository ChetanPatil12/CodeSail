import React from 'react'

const Navbar = () => {
  return (
    <div>
      <div className='flex items-center justify-between px-10 border '>
        <a href="/" className='flex items-center text-xl font-bold'>
            <img className='w-16' src="../../public/logo.png" alt="logo" />
            <span>CodeSail</span>
        </a>
        <div className='text-lg font-semibold mr-10'>
            <a className='mr-10 hover:underline' href="https://github.com/ChetanPatil12/CodeSail" target="_blank">Source Code</a>
            <a className='hover:underline' href="https://github.com/ChetanPatil12" target="_blank">Github</a>
        </div>
      </div>
    </div>
  )
}

export default Navbar
