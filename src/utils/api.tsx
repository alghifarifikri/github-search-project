export const fetchUsers = async (search: string) => {
  try {
    const response = await fetch(
      `https://api.github.com/search/users?q=${search}`
    );
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchUserRepositories = async (username: string) => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user repositories:", error);
    throw error;
  }
};
