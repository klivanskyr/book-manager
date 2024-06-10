import { User } from '@/app/types/UserContext';

export default function checkLoginStatus(user: User): {
    if (!user) {
        //redirect to login page
    } else {
        return true;
    }
}