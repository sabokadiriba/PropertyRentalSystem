import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}
const NavigationItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/home',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'content',
    title: 'Contents',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'property',
        title: 'Manage Property',
        type: 'item',
        classes: 'nav-item',
        url: '/view-property',
        icon: 'ti ti-typography'
      },
      {
        id: 'search-rent',
        title: 'Seach for Rent',
        type: 'item',
        classes: 'nav-item',
        url: '/rent-request',
        icon: 'ti ti-search'
      },
      {
        id: 'my-rent-request',
        title: 'My rent requests ',
        type: 'item',
        classes: 'nav-item',
        url: '/view-rent-request',
        icon: 'ti-alert-circle'
      }
    ]
  }

];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
