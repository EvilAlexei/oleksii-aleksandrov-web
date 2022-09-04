import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';

import { UserResponse } from '@models/user-response.model';
import { UsersSearchService } from '@services/users-search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  login = '';
  resultsPerPage = 9;
  userList!: UserResponse;
  error = false;

  constructor(
    private readonly usersSearchService: UsersSearchService,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  searchUsers(): void {
    this.usersSearchService.getUserList(this.login, this.resultsPerPage)
      .pipe(
        catchError(() => {
          this.error = true;
          this.cdr.markForCheck();

          return EMPTY;
        })
      )
      .subscribe(res => {
        this.error = false;
        this.userList = res;
        this.cdr.markForCheck();
      });
  }
}
