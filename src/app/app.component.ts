import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent, SidebarComponent],
   templateUrl: './app.component.html',

  styles: [],
})
export class AppComponent {
  title = 'visitor-management';
}
