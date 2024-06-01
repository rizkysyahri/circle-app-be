export type AuthMiddlewareData = {
  id: string;
};

export type IRegister = {
  username: string;
  fullname: string;
  email: string;
  password: string;
};

export type ILogin = {
  username: string;
  password: string;
};

export interface IThread {
  id?: number;
  content?: string;
  images?: IThreadImage[];
  userId: number;
  threadId?: number;
}

export interface IThreadImage {
  id?: number;
  image: string;
  threadId: number;
}

export interface IProfile {
  fullname?: string;
  username?: string;
  bio?: string;
  cover?: string;
  avatar?: string;
  userId?: number;
}
