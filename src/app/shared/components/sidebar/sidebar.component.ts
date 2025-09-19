import { Component, OnDestroy, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnDestroy {
  isCollapsed = signal(false);
  public theme = inject(ThemeService);
  private openSections = signal<Record<string, boolean>>({});
  sidebarTheme = signal<'purple' | 'emerald' | 'cyan' | 'rose'>('purple');
  private resizeHandler = () => this.syncCollapseWithViewport();

  sections = [
    {
      title: 'Instructions & Purpose',
      icon: 'pi pi-list',
      items: [
        {
          label: 'Purposes',
          icon: 'pi pi-bullseye',
          link: '/list-of-purposes',
        },
        {
          label: 'Special requirements',
          icon: 'pi pi-sliders-h',
          link: '/list-of-special-requirements',
        },
        {
          label: 'Entry instructions',
          icon: 'pi pi-sign-in',
          link: '/list-of-entry-instructions',
        },
        {
          label: 'Permit submission',
          icon: 'pi pi-file-import',
          link: '/list-of-instructions-to-submit-permit',
        },
      ],
    },
    {
      title: 'Form Builder',
      icon: 'pi pi-file-edit',
      items: [
        { label: 'Create form', icon: 'pi pi-plus', link: '/create-form' },
        {
          label: 'Form schemas',
          icon: 'pi pi-database',
          link: '/form-schemas',
        },
      ],
    },
  ];
  constructor() {
    const first = this.sections[0]?.title;
    if (first) {
      this.openSections.update((s) => ({ ...s, [first]: true }));
    }
    this.syncCollapseWithViewport();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.resizeHandler);
    }
  }
  isSectionOpen(title: string): boolean {
    return !!this.openSections()[title];
  }

  toggleSection(title: string) {
    this.openSections.update((s) => ({ ...s, [title]: !s[title] }));
  }
  toggleSidebar() {
    if (this.isSmallViewport()) {
      this.isCollapsed.set(true);
      return;
    }
    this.isCollapsed.update((v) => !v);
  }

  private isSmallViewport = (): boolean => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  };

  private syncCollapseWithViewport = (): void => {
    if (this.isSmallViewport()) {
      this.isCollapsed.set(true);
    }
  };

  getThemeClasses(): string {
    const theme = this.sidebarTheme();
    switch (theme) {
      case 'emerald':
        return 'from-emerald-500 to-teal-600';
      case 'cyan':
        return 'from-cyan-500 to-blue-600';
      case 'rose':
        return 'from-rose-500 to-pink-600';
      case 'purple':
      default:
        return 'from-indigo-500 to-purple-600';
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }
}
