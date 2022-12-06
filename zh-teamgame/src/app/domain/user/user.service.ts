import { Injectable } from '@angular/core';
import { DomainModule } from '../domain.module';
import { Objective } from '../objective/objective';
import { User } from './user';
import { UserDetails } from './UserDetails';

@Injectable({
  providedIn: DomainModule
})
export class UserService {
  init(user: UserDetails): User {
    const objective = Objective.Factory(user.objectives);
    return User.Factory(
      user.id,
      user.teamId,
      [objective]
    )
  }
}


