import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { Menu } from 'primeng/menu';


@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule,
    Ripple,
    RouterModule,
    ButtonModule,
    MenubarModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    BadgeModule,
    OverlayBadgeModule,
    AvatarModule,
    AvatarGroupModule,
    MenuModule, Menu
  ],
  templateUrl: './navigation.component.html',

})
export class NavigationComponent {

  UserProfileItems: MenuItem[] | undefined;
  NotificationItems: MenuItem[] | undefined;

  ngOnInit() {

    this.UserProfileItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        routerLink: 'UserProfile'
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        routerLink: 'Settings'
      },
      {
        separator: true,
      },
      {
        label: 'LogOut',
        icon: 'pi pi-sign-out',
        routerLink: 'LogOut'
      },
    ];

    this.NotificationItems = [
      {
        label: 'Messages 1',
        icon: 'pi pi-envelope',
      } ,
      {
        label: 'Messages 2',
        icon: 'pi pi-envelope',
      } ,
      {
        label: 'Messages 3',
        icon: 'pi pi-envelope',
      } 
    ];

  }


}
