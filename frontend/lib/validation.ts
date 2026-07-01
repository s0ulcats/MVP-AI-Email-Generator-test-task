export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function getEmailError(email: string) {
  if (!email.trim()) return "Email is required."
  if (!isValidEmail(email)) return "Enter a valid email address."
  return undefined
}

export function getPasswordError(password: string) {
  if (!password) return "Password is required."
  if (password.length < 8) return "Password must be at least 8 characters."
  return undefined
}

export function getNameError(name: string) {
  if (!name.trim()) return "Name is required."
  if (name.trim().length < 2) return "Name must be at least 2 characters."
  return undefined
}
