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
    MenuModule
  ],
  templateUrl: './navigation.component.html',

})
export class NavigationComponent {

  UserProfileItems: MenuItem[] | undefined;
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.UserProfileItems = [
      {
        label: 'Refresh',
        icon: 'pi pi-bell'
      },
      {
        label: 'Export',
        icon: 'pi pi-bell'
      }


    ];

    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
      },
      {
        label: 'Projects',
        icon: 'pi pi-search',
        badge: '3',
        items: [
          {
            label: 'Core',
            icon: 'pi pi-bolt',
            shortcut: '⌘+S',
          },
          {
            label: 'Blocks',
            icon: 'pi pi-server',
            shortcut: '⌘+B',
          },
          {
            separator: true,
          },
          {
            label: 'UI Kit',
            icon: 'pi pi-pencil',
            shortcut: '⌘+U',
          },
        ],
      },
    ];


  }


}
