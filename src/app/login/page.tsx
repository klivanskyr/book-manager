import dynamic from 'next/dynamic';

const Form = dynamic(() => import('./Form'), { ssr: false });

function Login() {

  return (
    <div>
      <Form /> 
    </div>   
  );
}

export default Login;