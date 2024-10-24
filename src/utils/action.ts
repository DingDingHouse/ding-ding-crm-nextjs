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
 
export const getAllClients = async (page:number) => {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}/api/users/all?page=${page}`,
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
    return { data };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getMyClients = async (page:number) => {
  const token = await getCookie();
  try {
    const response = await fetch(
      `${config.server}/api/users/subordinates?page=${page}`,
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
    return { data };
  } catch (error) {
    throw error;
  }
};

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

export const editPassword = async (existingPassword:string, password:string, id:string) => {
  const token = await getCookie();
  try {
    const response = await fetch(`${config.server}/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ password, existingPassword }),
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






// export const getSubordinateTransactions = async (id, page) => {
//   const token = await getCookie();
//   try {
//     const response = await fetch(
//       `${config.server}/api/transactions/${id}?page=${page}`,
//       {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: `userToken=${token}`,
//         },
//         next: { tags: ["client"] },
//       }
//     );
//     if (!response.ok) {
//       const error = await response.json();
//       return { error: error.message };
//     }
//     const data = await response.json();
//     console.log(data);
//     return { data };
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// export const getSubordinateClients = async (id, page) => {
//   const token = await getCookie();
//   try {
//     const response = await fetch(
//       `${config.server}/api/users/subordinates?id=${id}&page=${page}`,
//       {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: `userToken=${token}`,
//         },
//         next: { tags: ["client"] },
//       }
//     );
//     if (!response.ok) {
//       const error = await response.json();
//       return { error: error.message };
//     }
//     const data = await response.json();
//     console.log(data);
//     return { data };
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// export const getGames = async (platform, category, gameName, query) => {
//   const token = await getCookie();
//   try {
//     const response = await fetch(
//       `${config.server}/api/games?platform=${platform}&category=${category}`,
//       {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: `userToken=${token}`,
//         },
//       }
//     );
//     if (!response.ok) {
//       const error = await response.json();
//       return { error: error.message };
//     }
//     const data = await response.json();
//     return { data };
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// export const editGames = async (game, id) => {
//   const token = await getCookie();
//   try {
//     const response = await fetch(`${config.server}/api/games/${id}`, {
//       method: "PUT",
//       credentials: "include",
//       body: game,
//       headers: {
//         Cookie: `userToken=${token}`,
//       },
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       return { error: error.message };
//     }
//     const data = await response.json();
//     return { data };
//   } catch (error) {
//     console.log("error", error);
//   } finally {
//     revalidatePath("/game");
//   }
// };

// export const deleteGame = async (platform, id) => {
//   const token = await getCookie();
//   try {
//     const response = await fetch(
//       `${config.server}/api/games/${id}?platformName=${platform}`,
//       {
//         method: "DELETE",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: `userToken=${token}`,
//         },
//       }
//     );
//     if (!response.ok) {
//       const error = await response.json();
//       return { error: error.message };
//     }
//     const data = await response.json();
//     return { data };
//   } catch (error) {
//     console.log("error", error);
//   } finally {
//     revalidatePath("/game");
//   }
// };

// export const addGame = async (game) => {
//   const token = await getCookie();
//   try {
//     const response = await fetch(`${config.server}/api/games`, {
//       method: "POST",
//       credentials: "include",
//       body: game,
//       headers: {
//         Cookie: `userToken=${token}`,
//       },
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       return { error: error.message };
//     }
//     const data = await response.json();
//     return { data };
//   } catch (error) {
//     throw error;
//   } finally {
//     revalidatePath("/game");
//   }
// };


// export const addPlatform = async (platform) => {
//   const token = await getCookie();
//   try {
//     const response = await fetch(`${config.server}/api/games/platforms`, {
//       method: "POST",
//       credentials: "include",
//       body: JSON.stringify(platform), // Ensure platform is stringified
//       headers: {
//         "Content-Type": "application/json", // Specify content type
//         Cookie: `userToken=${token}`,
//       },
//     });

//     console.log(response);

//     if (!response.ok) {
//       const error = await response.json();
//       return { error: error.message };
//     }
//     const data = await response.json();

//     return { data };
//   } catch (error) {
//     throw error;
//   }
// };

// export async function getPlatform() {
//   const token = await getCookie();

//   try {
//     const response = await fetch(`${config.server}/api/games/platforms`, {
//       method: "GET",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//         Cookie: `userToken=${token}`,
//       },
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       return { error: error.message };
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log("error", error);
//   }
// }



// export const searchByUsername = async (search, page, query) => {
//   const token = await getCookie();
//   let filterQuery = "{}";
//   let username = "";
//   if (query) {
//     filterQuery = JSON.stringify(query);
//   }
//   if (search) {
//     username = search;
//   }
//   try {
//     const response = await fetch(
//       `${config.server}/api/users/subordinates?filter=${username}&page=${page}&search=${filterQuery}`,
//       {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: `userToken=${token}`,
//         },
//       }
//     );
//     if (!response.ok) {
//       const error = await response.json();
//       return { error: error.message };
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// export const searchAllByUsername = async (search, page, query) => {
//   const token = await getCookie();
//   try {
//     let username = "";
//     let filterQuery = "{}";
//     if (query) {
//       filterQuery = JSON.stringify(query);
//     }
//     if (search) {
//       username = search;
//     }
//     const response = await fetch(
//       `${config.server}/api/users/all?filter=${username}&page=${page}&search=${filterQuery}`,
//       {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: `userToken=${token}`,
//         },
//       }
//     );
//     if (!response.ok) {
//       const error = await response.json();
//       return { error: error.message };
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// export const filterMyTransactions = async (search, page, query) => {
//   const token = await getCookie();
//   let filterQuery = "{}";
//   let username = "";
//   if (query) {
//     filterQuery = JSON.stringify(query);
//   }
//   if (search) {
//     username = search;
//   }
//   try {
//     const response = await fetch(
//       `${config.server}/api/transactions?filter=${username}&page=${page}&search=${filterQuery}&limit=11`,
//       {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: `userToken=${token}`,
//         },
//       }
//     );
//     if (!response.ok) {
//       const error = await response.json();
//       return { error: error.message };
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// export const filterAllTransactions = async (search, page, query) => {
//   const token = await getCookie();
//   let filterQuery = "{}";
//   let username = "";
//   if (query) {
//     filterQuery = JSON.stringify(query);
//   }
//   if (search) {
//     username = search;
//   }
//   try {
//     const response = await fetch(
//       `${config.server}/api/transactions/all?filter=${username}&page=${page}&search=${filterQuery}&limit=11`,
//       {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: `userToken=${token}`,
//         },
//       }
//     );
//     if (!response.ok) {
//       const error = await response.json();
//       return { error: error.message };
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// export const fetchPayoutversion = async (tagname, platform) => {
//   const token = await getCookie();
//   console.log(platform, tagname);
//   try {
//     const response = await fetch(
//       `${config.server}/api/payouts/${tagname}?platformName=${platform}`,
//       {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: `userToken=${token}`,
//         },
//       }
//     );
//     if (!response.ok) {
//       const error = await response.json();
//       return { error: error.message };
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// export const addPayout = async (payout) => {
//   const token = await getCookie();
//   try {
//     const response = await fetch(`${config.server}/api/payouts`, {
//       method: "POST",
//       credentials: "include",
//       body: payout,
//       headers: {
//         Cookie: `userToken=${token}`,
//       },
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       return { error: error.message };
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const deletePayout = async (tagname, version) => {
//   const token = await getCookie();
//   try {
//     const response = await fetch(
//       `${config.server}/api/payouts/${tagname}/${version}`,
//       {
//         method: "DELETE",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: `userToken=${token}`,
//         },
//       }
//     );
//     if (!response.ok) {
//       const error = await response.json();
//       return { error: error.message };
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log("error", error);
//   } finally {
//     revalidatePath("/game");
//   }
// };

// export const setPayoutActive = async (tagname, version, platform) => {
//   const token = await getCookie();
//   try {
//     const response = await fetch(`${config.server}/api/payouts/${tagname}`, {
//       method: "PATCH",
//       credentials: "include",
//       body: JSON.stringify({ version, platform }),
//       headers: {
//         "Content-Type": "application/json",
//         Cookie: `userToken=${token}`,
//       },
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       return { error: error.message };
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log("error", error);
//   }
// };

