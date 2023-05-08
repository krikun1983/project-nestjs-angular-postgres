import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { UserData, UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  public dataSource: UserData | null = null;
  public displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role'];
  public pageEvent?: PageEvent;

  private unsubscribe$ = new Subject<void>();

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.initDataSource();
  }

  initDataSource() {
    this.userService
      .findAll(1, 10)
      .pipe(
        tap((data: UserData) => (this.dataSource = data)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex + 1;
    let size = event.pageSize;
    this.pageEvent = event;

    this.userService
      .findAll(page, size)
      .pipe(
        tap((data: UserData) => (this.dataSource = data)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
