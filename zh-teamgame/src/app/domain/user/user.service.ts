import { Injectable } from '@angular/core';
import { DomainModule } from '../domain.module';
import { DisposableCollection } from '../model/Disposable';
import { User } from './user';
import { UserDetails } from './UserDetails';

@Injectable({
  providedIn: DomainModule
})
export class UserService {
  private readonly _disposables: DisposableCollection;
  constructor() {
    this._disposables = new DisposableCollection();
  }
  init(user: UserDetails): User {
    this._disposables.empty();
    return User.Factory(
      user.id,
      user.teamId
    )
  }
}


