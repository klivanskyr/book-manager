
type Option<T> = T | null;

export default function passwordIsValid(password: string): Option<string> {
    const max = 35;
    const min = 8;
    if (password.length < min) {
        return `Password must be at least ${min} characters`;
    }
    if (password.length > max) {
        return `Password must be less than ${min} characters`;
    }

    return null;
}
