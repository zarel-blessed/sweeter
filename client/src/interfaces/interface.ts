/** @format */

export interface User {
  _id: User;
  name: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  location: string;
  dateOfBirth: string;
  followers: User[];
  following: User[];
}

export interface Tweet {
  _id: Tweet;
  parentId: Tweet | null | undefined;
  content: string;
  image?: string;
  tweetedBy: User;
  likes: User[];
  retweetBy: User[];
  replies: Tweet[];
  createdAt: string;
}
