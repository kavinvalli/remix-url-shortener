export interface User {
  name: string;
  email: string;
}

export async function login(name: string, email: string): Promise<User> {
  return { name, email };
}
