import { User } from './user.model';

export interface UserResponse {
  total_count: number;
  incomplete_results: boolean;
  items: User[];
}
