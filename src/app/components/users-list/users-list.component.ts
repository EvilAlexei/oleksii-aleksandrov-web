import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { tap } from 'rxjs';

import { User } from '@models/user.model';
import { UserResponse } from '@models/user-response.model';
import { UsersSearchService } from '@services/users-search.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  standalone: true,
})
export class UsersListComponent implements AfterViewInit, OnChanges {
  displayedColumns: string[] = ['avatar_url', 'login', 'type'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();

  @Input() userList: UserResponse | null = null;
  @Input() resultsPerPage = 9;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly usersSearchService: UsersSearchService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.userList) {
      this.initDataSource(this.userList.items);
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.paginator.page
      .pipe(
        tap(() => this.loadUsersPage())
      )
      .subscribe();
  }

  loadUsersPage(): void {
    this.usersSearchService.getUserListPage(this.paginator.pageIndex + 1)
      .subscribe(res => {
        this.initDataSource(res.items);
      });
  }

  private initDataSource(items: User[]) {
    this.dataSource = new MatTableDataSource<User>(items);
    this.dataSource.sort = this.sort;
  }
}
