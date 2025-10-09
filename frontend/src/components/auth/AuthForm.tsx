import React from 'react'

interface AuthformProps{
        type: 'login'|'signup';
        userRole: 'patient'|'doctor';
}
const Authform = ({type,userRole}:AuthformProps) => {
  return (
    <div>Authform</div>
  )
}

export default Authform