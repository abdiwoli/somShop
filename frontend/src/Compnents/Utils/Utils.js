// Example of handling errors in createUser
export const createUser = async (name, email, password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        return { error: `Error ${response.status}: ${errorText}` };
      }
  
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: `Network error: ${error.message}` };
    }
  };
  
  export const loginUser = async (email, password) => {
    const credentials = btoa(`${email}:${password}`);
    console.log(`Logging in with credentials: ${credentials}`);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/connect`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      });
  
      console.log(`Response status: ${response.status}`);
      if (!response.ok) {
        const errorText = await response.text();
        return { error: `Error ${response.status}: ${errorText}` };
      }
  
      const data = await response.json();
      console.log('Login successful:', data);
      return { data };
    } catch (error) {
      console.error('Network error:', error.message);
      return { error: `Network error: ${error.message}` };
    }
  };
  
  