import { ReactElement } from 'react';

import Form from './Form'
import { } from '@/app/types/UserContext';

function Signup(): ReactElement {

    async function handleSubmit(data: any) {
        console.log(data);
    }

    return (
        <div>
            <Form handleSubmit={handleSubmit}/>
        </div>
    )
}

export default Signup;