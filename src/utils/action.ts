"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { config } from "./config";
import { getCookie } from "./cookie";


export const loginUser = async (data:any) => {
  try {
    const response = await fetch(`${config.server}/api/users/login`, {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const responseData = await response.json();
    return { responseData };
  } catch (error) {
    console.log("error:", error);
  } finally {
    revalidatePath("/");
  }
};

export async function getUserReport(id:string, type:string) {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server
      }/api/users/report?userId=${id}&type=${type.toLowerCase()}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("error:", error);
  }
}


export const addClient = async (user:any) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/users`, {
      method: "POST",
      body: JSON.stringify({ user }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    console.log("error:", error);
  } finally {
    revalidatePath("/clients/all");
  }
};

export async function generatePassword() {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}/api/users/generatePassword`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
}

export const editPassword = async (password:string, id:string) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ password}),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const responseData = await response.json();
    return { responseData };
  } catch (error) {
    console.log("error:", error);
  } finally {
    revalidateTag("client");
  }
};

export const editCredits = async (credits:any, id:string) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ credits: credits }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const responseData = await response.json();
    return { responseData };
  } catch (error) {
    console.log("error", error);
  } finally {
    revalidateTag("client");
  }
};


export const editStatus = async (status:string, id:string) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: status }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const responseData = await response.json();
    return { responseData };
  } catch (error) {
    console.log("error", error);
  } finally {
    revalidateTag("client");
  }
};

export const deleteClient = async (id:string) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/users/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    console.log("error:", error);
  } finally {
    revalidatePath("/clients/all");
  }
};

export const getActivePlayers = async (page:number) => {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}/api/users/allPlayer?page=${page}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPlatform = async () => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/games/platforms`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const getGames = async (platform:string, category:string) => {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}/api/games?platform=${platform}&category=${category}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const editGames = async (game:any, id:string) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/games/${id}`, {
      method: "PUT",
      credentials: "include",
      body: game,
      headers: {
        Cookie: `userToken=${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    console.log("error", error);
  } finally {
    revalidatePath("/game");
  }
};

export const addPayout = async (payout:any) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/payouts`, {
      method: "POST",
      credentials: "include",
      body: payout,
      headers: {
        Cookie: `userToken=${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }finally {
    revalidatePath("/game");
  }
};

export const fetchPayoutversion = async (tagname:string, platform:string) => {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}/api/payouts/${tagname}?platformName=${platform}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }finally {
    revalidatePath("/game");
  }
};



export const deletePayout = async (tagname:string, version:string) => {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}/api/payouts/${tagname}/${version}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  } finally {
    revalidatePath("/game");
  }
};

export const setPayoutActive = async (tagname:string, version:string, platform:string) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/payouts/${tagname}`, {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({ version, platform }),
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const addGame = async (game:any) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/games`, {
      method: "POST",
      credentials: "include",
      body: game,
      headers: {
        Cookie: `userToken=${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    throw error;
  } finally {
    revalidatePath("/game");
  }
};


export const deleteGame = async (platform:string, id:string) => {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}/api/games/${id}?platformName=${platform}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    console.log("error", error);
  } finally {
    revalidatePath("/game");
  }
};

export const getSubordinates = async (id:string) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/users/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    throw error;
  }
};

export const getSubordinateTransactions = async (id:number, page:string) => {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}/api/transactions/${id}?page=${page}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`, 
        },
        next: { tags: ["client"] },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    console.log(data);
    return { data };
  } catch (error) {
    console.log("error", error);
  }
};

export const getSubordinateClients = async (id:string, page:number) => {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}/api/users/subordinates?id=${id}&page=${page}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
        next: { tags: ["client"] },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    console.log(data);
    return { data };
  } catch (error) {
    console.log("error", error);
  }finally {
    revalidatePath("/clients");
  }
};



export const addPlatform = async (platform:any) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/games/platforms`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(platform), 
      headers: {
        "Content-Type": "application/json", 
        Cookie: `userToken=${token}`,
      },
    });

    console.log(response);

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();

    return { data };
  } catch (error) {
    throw error;
  }
};

export const getToggle = async () => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/toggle`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const UpdateMaintenance = async (availableAt:string) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/toggle`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ availableAt }),
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};


export const GetAllClients = async (search: string, page: number, query?: any) => {
  const token = await getCookie();
  try {
    let filterQuery = '';
    if (query) {
      if (query?.credits?.From > 0 && query?.credits?.To > 0) {
        filterQuery = JSON.stringify(query);
      }
      
    }
    const response = await fetch(
      `${config.server}/api/users/all?filter=${search}&page=${page}&search=${filterQuery}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const GetMyClients = async (search:string,page:number,query?:any) => {
  const token = await getCookie();
  try {
    let filterQuery = '';
    if (query) {
      if (query?.credits?.From > 0 && query?.credits?.To > 0) {
        filterQuery = JSON.stringify(query);
      }
      
    }
    
    const response = await fetch(
      `${config.server}/api/users/subordinates?filter=${search}&page=${page}&search=${filterQuery}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const GetMyTransactions = async (search:string,page:number, query?:any) => {
  const token = await getCookie();
  let filterQuery = "{}";
  let username = "";
  if (query) {
    filterQuery = JSON.stringify(query);
  }
  if (search) {
    username = search;
  }
  try {
    const response = await fetch(
      `${config.server}/api/transactions?filter=${username}&page=${page}&search=${filterQuery}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const GetAllTransactions = async (search:string,page:number, query?:any) => {
  const token = await getCookie();
  let filterQuery = "{}";
  let username = "";
  if (query) {
    filterQuery = JSON.stringify(query);
  }
  if (search) {
    username = search;
  }
  try {
    const response = await fetch(
      `${config.server}/api/transactions/all?filter=${username}&page=${page}&search=${filterQuery}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `userToken=${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { error: error.message };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const getUserData = async () => {
  try {
    const token = await getCookie();
    const response = await fetch(`${config.server}/api/users`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userToken=${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    console.log(error);
  }
};



