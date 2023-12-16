export type NotificationReponse = {
  id: number;
  user_id: number;
  user_name: string;
  user_roles: string;
  to_user_id: number;
  to_user_name: string;
  to_user_roles: string;
  description: string;
  has_seen: boolean;
  link: string;
  created_at: Date;
};
