import { Component } from '@angular/core';
import { NotificationDTO } from '../../Interfaces/inotification';
import { NotificationService } from '../../Services/notification.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  notifications: NotificationDTO[] = [];
  loading = false;
  errorMessage = '';
  pageNumber = 1;
  pageSize = 20;

  constructor(private notificationService: NotificationService, private toaster: ToastrService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
  this.loading = true;
  this.errorMessage = '';
  this.notificationService.getMyNotifications(this.pageNumber, this.pageSize).subscribe({
    next: (res) => {
      console.log(res);
      this.notifications = res;
      this.loading = false;
    },
    error: (err) => {
      console.log(err);
      this.errorMessage = 'Failed to load notifications.';
      this.loading = false;
    },
  });
}


  markAsRead(notificationId: string) {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: (res) => {
        console.log(res);
        const notif = this.notifications.find((n) => n.id === notificationId);
        if (notif) notif.isRead = true;
      },
      error: (err) => {
        console.log(err);
        this.toaster.error('Failed to mark notification as read.');
      },
    });
  }

  trackById(index: number, item: NotificationDTO) {
    return item.id;
  }
}
