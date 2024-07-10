type Option<T> = T | null;

/** Returns 'Invalid email' if email is invalid else returns null */
export default function emailIsValid(email: string): Option<string> {
  const test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!test) {
    return `Invalid email`;
  } else {
    return null;
  }
}