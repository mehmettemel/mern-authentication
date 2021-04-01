import axios from 'axios'
import React from 'react'
import GoogleLogin from 'react-google-login'
const Google = () => {
  const responseGoogle = (response) => {
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/google-login`,
      data: { idToken: response.idToken },
    })
  }
  return (
    <div className='pb-3'>
      <GoogleLogin
        clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
        buttonText='Login'
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className='btn btn-warning btn-lg btn-block'
          >
            <i className='fab fa-google mr-2'> Login with Google</i>
          </button>
        )}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  )
}

export default Google
