// this is custome made for my web app based on the youtubes tutoirial  video using chatgpt


/* eslint-disable no-unused-vars */

// ====== USER PARAMS
export interface User {
  clerkId: string;
  email: string;
  username: string;
  subscription: {
    type: "monthly" | "yearly";
    startDate: Date;
    endDate: Date;
  };
}

export interface CreateUserParams {
  clerkId: string;
  email: string;
  username: string;
  subscriptionType: "monthly" | "yearly";
}

export interface UpdateUserParams {
  clerkId: string;
  updates: {
    subscriptionType?: "monthly" | "yearly";
    profileUpdates?: Partial<User>;
  };
}



// aa 3 files last chatgpt koduthathu vechu sheiryakan und ippo kidakunathu enthokeyo mix pole aanu yotube ile yum chatgpt ellam koode sheriyano ariyila
// proper aayitu padichitu undakanam