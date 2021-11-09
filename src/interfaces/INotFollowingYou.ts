import { AccountFollowersFeedResponseUsersItem } from "instagram-private-api";

export default interface INotFollowingYou {
    followers: AccountFollowersFeedResponseUsersItem[];
    following: AccountFollowersFeedResponseUsersItem[];
    notFollowingYou: AccountFollowersFeedResponseUsersItem[];
}